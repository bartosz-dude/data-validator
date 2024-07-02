import { TypeSchema } from "./types/schemaTypes"

export type SchemaTypes = Pick<TypeSchema, "type">["type"]

type ParsedCause<T extends unknown> = T & {
	target: { value: string }
}

type TypeValidationCause<T = SchemaTypes> = {
	type: "validation"
	errorType: "notSatisfied" | string
	schemaType: T
	schemaProperty: string
	target: {
		value: any
		name?: string
	}
	schema: TypeSchema
}

type CustomValidatorCause<T = SchemaTypes> = {
	customValidatorName: string
	type: "validation"
	errorType: "notSatisfied" | string
	schemaType: T
	schemaProperty: "customValidation"
	target: {
		value: any
		name?: string
	}
	schema: TypeSchema
}

type SchemaCause<T = SchemaTypes> = {
	type: "schema"
	errorType: string
	schemaType: T
	schemaProperty: string
	schema: TypeSchema
}

type DynamicSchemaCause<T = SchemaTypes> = {
	type: "dynamicSchema"
	errorType:
		| "wrongVarType"
		| "varNotAssigned"
		| "wrongSyntax"
		| "dynamicSchemaDisabled"
		| string
	schemaType?: T
	schemaProperty?: string
	schemaPropertyValue?: any
	target?: {
		name?: string
	}
	schema?: TypeSchema
}

class TVError<C extends unknown> extends Error {
	#cause: any

	constructor(message: string, cause: C) {
		super(message + "; read error cause for details")
		this.name = this.constructor.name
		this.cause = cause
	}

	set cause(cause: C) {
		this.#cause = cause
	}

	get cause(): C {
		return this.#cause
	}
}

export class TypeValidationError<
	T extends TypeValidationCause
> extends TVError<T> {
	constructor(message: string, cause: T) {
		const parsedCause = {
			...cause,
			target: {
				value: cause.target.value,
				name:
					typeof cause.target.name !== "string"
						? JSON.stringify(cause.target.name)
						: cause.target.name,
			},
		} as ParsedCause<T>
		super(message, parsedCause)
	}
}

export class SchemaError extends TVError<SchemaCause> {
	constructor(message: string, cause: SchemaCause) {
		super(message, cause)
	}
}

export class DynamicSchemaError extends TVError<DynamicSchemaCause> {
	constructor(message: string, cause: DynamicSchemaCause) {
		super(message, cause)
	}
}

export class RequiredError extends TypeValidationError<TypeValidationCause> {
	constructor(error: {
		schemaType: SchemaTypes
		target: {
			value: any
			name?: string
		}
		schema: TypeSchema
	}) {
		super(`${error.target.name ?? "value"} is required`, {
			type: "validation",
			errorType: "notSatisfied",
			schemaType: error.schemaType,
			schemaProperty: "required",
			target: {
				value: error.target.value,
				name: error.target.name,
			},
			schema: error.schema,
		})
	}
}

export class TypeError extends TypeValidationError<TypeValidationCause> {
	constructor(error: {
		schemaType: SchemaTypes
		target: {
			value: any
			name?: string
		}
		schema: TypeSchema
	}) {
		super(
			`${JSON.stringify(error.target.name) ?? "value"} must be of type ${
				error.schemaType
			}`,
			{
				type: "validation",
				errorType: "notSatisfied",
				schemaType: error.schemaType,
				schemaProperty: "type",
				target: {
					value: error.target.value,
					name: error.target.name,
				},
				schema: error.schema,
			}
		)
	}
}

export class MatchError extends TypeValidationError<TypeValidationCause> {
	constructor(error: {
		schemaType: SchemaTypes
		target: {
			value: any
			name?: string
		}
		schema: TypeSchema & { match: unknown }
	}) {
		const cause: TypeValidationCause = {
			type: "validation",
			errorType: "notSatisfied",
			schemaType: error.schemaType,
			schemaProperty: "match",
			target: {
				value: error.target.value,
				name: error.target.name,
			},
			schema: error.schema,
		}

		if (Array.isArray(error.schema.match)) {
			super(
				`${
					error.target.name ?? "value"
				} must match on of [${error.schema.match
					.map((v) => JSON.stringify(v))
					.join(", ")}]`,
				cause
			)
		} else {
			super(
				`${error.target.name ?? "value"} must match ${
					error.schema.match
				}`,
				cause
			)
		}
	}
}

export class DynamicSchemaDisabledError extends SchemaError {
	constructor(error: {
		schemaType: SchemaTypes
		schemaProperty: string
		schemaPropertyValue: any
		schema: TypeSchema
	}) {
		super(
			`Can't use dynamic schema without enabling it with use$ schema property`,
			{
				type: "schema",
				errorType: "dynamicSchemaDisabled",
				schemaType: error.schemaType,
				schemaProperty: error.schemaProperty,
				schema: error.schema,
			}
		)
	}
}

export class CustomValidatorError extends Error {
	constructor(message: string) {
		super(message)
	}
}
