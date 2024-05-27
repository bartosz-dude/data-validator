import { ArraySchema, StringSchema, TypeSchema } from "./types/schemaTypes"

export type SchemaTypes = Pick<TypeSchema, "type">["type"]

type TypeValidationCause<T = SchemaTypes> = {
	type: "validation"
	originType: T
	targetValue: any
	targetName: string
	schemaProperty: string
	errorType: string
	detailedErrorType?: string
	schema: string
}

type SchemaCause<T = SchemaTypes> = {
	type: "schema"
	originType: T
	schemaProperty: string
	errorType: string
	schema: string
	details?: {
		expected?: string
		got?: string
	}
}

type DynamicSchemaCause<T = SchemaTypes> = {
	type: "dynamicSchema"
	originType: T
	property: string
	errorType: string
	schema: string
	details?: {
		expected?: string
		got?: string
	}
}

class CustomError extends Error {
	constructor(message: string, cause: any) {
		super(message + "; read cause for details")
		this.name = this.constructor.name
		this.cause = cause
	}
}

export class TypeValidationError extends CustomError {
	constructor(message: string, cause: TypeValidationCause) {
		super(message, cause)
	}
}

export class SchemaError extends CustomError {
	constructor(message: string, cause: SchemaCause) {
		super(message, cause)
	}
}

export class DynamicSchemaError extends CustomError {
	constructor(message: string, cause: DynamicSchemaCause) {
		super(message, cause)
	}
}

export class RequiredError extends TypeValidationError {
	constructor(error: {
		type: SchemaTypes
		targetName: string
		targetValue: any
		schema: string
	}) {
		super(`${error.targetName} is required`, {
			originType: error.type,
			errorType: "requiredNotSatisfied",
			targetName: error.targetName,
			targetValue: error.targetValue,
			schemaProperty: "required",
			schema: error.schema,
			type: "validation",
		})
	}
}

export class TypeError extends TypeValidationError {
	constructor(error: {
		type: SchemaTypes
		targetName: string
		targetValue: any
		schema: string
	}) {
		super(`${error.targetName} must be of type ${error.type}`, {
			originType: error.type,
			errorType: "typeNotSatisfied",
			targetName: error.targetName,
			targetValue: error.targetValue,
			schemaProperty: "type",
			schema: error.schema,
			type: "validation",
		})
	}
}

function handleValues(
	value: number,
	valueSchema:
		| number
		| number[]
		| {
				min?: number
				max?: number
		  }
		| {
				min?: number
				max?: number
		  }[]
): {
	message: string
	detailedErrorType: string
	schemaPropertySuffix: string
} {
	if (Array.isArray(valueSchema)) {
		if (valueSchema.every((v) => typeof v === "number")) {
			return {
				message: `must be contained in [${valueSchema.join(", ")}]`,
				detailedErrorType: `matchOneOfExactValues`,
				schemaPropertySuffix: "[]",
			}
		} else {
			return {
				message: `must be contained in one of the ranges`,
				detailedErrorType: `matchOneOfRanges`,
				schemaPropertySuffix: "[].(min | max)",
			}
		}
	} else {
		if (typeof valueSchema === "number") {
			return {
				message: `must be ${valueSchema}`,
				detailedErrorType: `matchExactValue`,
				schemaPropertySuffix: "",
			}
		}

		if (valueSchema.min && valueSchema.max) {
			if (value < valueSchema.min) {
				return {
					message: `must be more than ${valueSchema.min} and less than ${valueSchema.max}`,
					detailedErrorType: `matchMoreThanRangeMin`,
					schemaPropertySuffix: ".min",
				}
			}

			if (value > valueSchema.max) {
				return {
					message: `must be less than ${valueSchema.max} and more than ${valueSchema.min}`,
					detailedErrorType: `matchLessThanRangeMax`,
					schemaPropertySuffix: ".max",
				}
			}
		}

		if (valueSchema.min) {
			return {
				message: `must be more than ${valueSchema.min}`,
				detailedErrorType: `matchMoreThanRangeMin`,
				schemaPropertySuffix: ".min",
			}
		}

		if (valueSchema.max) {
			return {
				message: `must be less than ${valueSchema.max}`,
				detailedErrorType: `matchLessThanRangeMax`,
				schemaPropertySuffix: ".max",
			}
		}

		return {
			message: `has a number range error without either min or max, huh how did you got here?`,
			detailedErrorType: `unknown`,
			schemaPropertySuffix: ".unknown",
		}
	}
}

export class LengthError extends TypeValidationError {
	constructor(error: {
		type: SchemaTypes
		schema: string
		targetName: string
		targetValue: any
		value: number
		valueSchema:
			| number
			| number[]
			| {
					min?: number
					max?: number
			  }
			| {
					min?: number
					max?: number
			  }[]
	}) {
		const cause: TypeValidationCause = {
			errorType: "lengthNotSatisfied",
			originType: error.type,
			schemaProperty: "length",
			schema: error.schema,
			type: "validation",
			targetName: error.targetName,
			targetValue: error.targetValue,
		}

		const valueErr = handleValues(error.value, error.valueSchema)
		cause.detailedErrorType = valueErr.detailedErrorType
		cause.schemaProperty += valueErr.schemaPropertySuffix

		super(`${error.targetName} ${valueErr?.message}`, cause)
	}
}

export class ValueError extends TypeValidationError {
	constructor(error: {
		type: SchemaTypes
		schema: string
		targetName: string
		targetValue: any
		value: number
		valueSchema:
			| number
			| number[]
			| {
					min?: number
					max?: number
			  }
			| {
					min?: number
					max?: number
			  }[]
	}) {
		const cause: TypeValidationCause = {
			errorType: "valueNotSatisfied",
			originType: error.type,
			schemaProperty: "value",
			schema: error.schema,
			type: "validation",
			targetName: error.targetName,
			targetValue: error.targetValue,
		}

		const valueErr = handleValues(error.value, error.valueSchema)
		cause.detailedErrorType = valueErr.detailedErrorType
		cause.schemaProperty += valueErr.schemaPropertySuffix
		super(`${error.targetName} ${valueErr?.message}`, cause)
	}
}

export class MatchError extends TypeValidationError {
	constructor(error: {
		type: SchemaTypes
		schema: string
		targetName: string
		targetValue: any
		details: {
			type: "number"
			value: number
			valueSchema:
				| number
				| number[]
				| {
						min?: number
						max?: number
				  }
				| {
						min?: number
						max?: number
				  }[]
		}
	}) {
		switch (error.details?.type) {
			case "number": {
				const cause: TypeValidationCause = {
					errorType: "matchNotSatisfied",
					originType: error.type,
					schemaProperty: "match",
					schema: error.schema,
					type: "validation",
					targetName: error.targetName,
					targetValue: error.targetValue,
				}

				const valueErr = handleValues(
					error.details.value,
					error.details.valueSchema
				)
				cause.detailedErrorType = valueErr.detailedErrorType
				cause.schemaProperty += valueErr.schemaPropertySuffix
				super(`${error.targetName} ${valueErr?.message}`, cause)
			}
		}
	}
}
export class InstanceError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class PropertyError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class AmountError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class VariableValueError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}
