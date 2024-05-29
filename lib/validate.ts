import { TypeValidationError } from "./Errors"
import { SchemaVariable, TypeSchema } from "./types/schemaTypes"
import validateType from "./validateType"

export type SchemaVariables = Map<SchemaVariable, any>

export default function validate(
	target: any,
	schema: TypeSchema | TypeSchema[],
	options: { throwErrors?: boolean } = { throwErrors: true }
): boolean {
	const schemaVariables = new Map<SchemaVariable, any>()

	try {
		if (Array.isArray(schema)) {
			let invalidCount = 0
			// idk why it throws an error for schema type, when I check that's an array
			// @ts-ignore
			for (const schemaEntry of schema) {
				try {
					validateType(schemaEntry, target, schemaVariables)
				} catch (error) {
					if (error instanceof TypeValidationError) {
						invalidCount++
						continue
					}

					throw error
				}
			}

			if (invalidCount >= schema.length) {
				// overwrites because it's a special case at the root of validation of accepting multiple schemas
				// errors by default do not support multi schemas
				throw new TypeValidationError(
					`Value does not satisfy any given schema`,
					{
						errorType: "notSatisfied",
						// @ts-expect-error
						schema: schema,
						schemaProperty: "*",
						// @ts-expect-error
						schemaType: schema.map((v) => v.type).join(", "),
						target: {
							value: target,
						},
						type: "validation",
					}
				)
			}

			return true
		} else {
			return validateType(schema, target, schemaVariables)
		}
	} catch (error) {
		if (!options.throwErrors) {
			return false
		}

		throw error
	}
}
