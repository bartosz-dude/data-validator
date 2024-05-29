import { TypeSchema } from "./types/schemaTypes"

export type SchemaTypes = Pick<TypeSchema, "type">["type"]

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
	schemaType: T
	schemaProperty: string
	schemaPropertyValue: string
	target: {
		name?: string
	}
	schema: TypeSchema
}

class TVError extends Error {
	constructor(message: string, cause: any) {
		super(message + "; read cause for details")
		this.name = this.constructor.name
		this.cause = cause
	}
}

export class TypeValidationError extends TVError {
	constructor(message: string, cause: TypeValidationCause) {
		const parsedCause = {
			...cause,
			schema: JSON.stringify(cause.schema),
			target: {
				value: JSON.stringify(cause.target.value),
			},
		}
		super(message, parsedCause)
	}

	get cause(): TypeValidationCause {
		return this.cause
	}
}

export class SchemaError extends TVError {
	constructor(message: string, cause: SchemaCause) {
		const parsedCause = {
			...cause,
			schema: JSON.stringify(cause.schema),
		}
		super(message, parsedCause)
	}

	get cause(): SchemaCause {
		return this.cause
	}
}

export class DynamicSchemaError extends TVError {
	constructor(message: string, cause: DynamicSchemaCause) {
		const parsedCause = {
			...cause,
			schema: JSON.stringify(cause.schema),
		}
		super(message, parsedCause)
	}

	get cause(): DynamicSchemaCause {
		return this.cause
	}
}

export class RequiredError extends TypeValidationError {
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

export class TypeError extends TypeValidationError {
	constructor(error: {
		schemaType: SchemaTypes
		target: {
			value: any
			name?: string
		}
		schema: TypeSchema
	}) {
		super(
			`${error.target.name ?? "value"} must be of type ${
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

export class MatchError extends TypeValidationError {
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

export class DynamicSchemaDisabledError extends DynamicSchemaError {
	constructor(error: {
		schemaType: SchemaTypes
		schemaProperty: string
		schemaPropertyValue: string
		schema: TypeSchema
		target: {
			name?: string
		}
	}) {
		super(
			`Can't use dynamic schema${
				error.target.name ? ` on ${error.target.name}` : ""
			} without enabling it with use$ schema property`,
			{
				type: "dynamicSchema",
				errorType: "notSatisfied",
				schemaType: error.schemaType,
				schemaProperty: "required",
				schemaPropertyValue: error.schemaPropertyValue,
				target: {
					name: error.target.name,
				},
				schema: error.schema,
			}
		)
	}
}
