import {
	CustomValidatorError,
	DynamicSchemaDisabledError,
	TypeValidationError,
} from "../Errors"
import {
	CustomValidator,
	SchemaVariable,
	TypeSchema,
} from "../types/schemaTypes"
import validate from "../validate"
import DynamicSchema from "./dynamicSchema"

export default function handleCustomValidators(
	target: any,
	schema: TypeSchema & { customValidator: SchemaVariable | SchemaVariable[] },
	dynamicSchema: DynamicSchema
) {
	if (!schema.use$) {
		throw new DynamicSchemaDisabledError({
			schema: schema,
			schemaProperty: "customValidator",
			schemaPropertyValue: schema.customValidator,
			schemaType: schema.type,
		})
	}

	if (Array.isArray(schema.customValidator)) {
		const customValidators = schema.customValidator.map((v) =>
			dynamicSchema.get(v)
		) as CustomValidator[]

		validate(customValidators, {
			type: "array",
			strict: true,
			contains: {
				type: "function",
				required: true,
			},
		})

		for (const customValidator of customValidators) {
			try {
				customValidator(target, dynamicSchema)
			} catch (error) {
				if (error instanceof CustomValidatorError) {
					throw new TypeValidationError(error.message, {
						errorType: "notSatisfied",
						schema: schema,
						schemaProperty: "customValidator",
						schemaType: schema.type,
						target: {
							value: target,
						},
						type: "validation",
					})
				}

				throw error
			}
		}
	} else {
		const customValidator = dynamicSchema.get(
			schema.customValidator
		) as CustomValidator

		validate(customValidator, {
			type: "function",
		})

		try {
			customValidator(target, dynamicSchema)
		} catch (error) {
			if (error instanceof CustomValidatorError) {
				throw new TypeValidationError(error.message, {
					errorType: "notSatisfied",
					schema: schema,
					schemaProperty: "customValidator",
					schemaType: schema.type,
					target: {
						value: target,
					},
					type: "validation",
				})
			}

			throw error
		}
	}
}
