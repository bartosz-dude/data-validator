import { SchemaVariable, TypeSchema } from "./types/schemaTypes"
import validateType from "./validateType"

export type SchemaVariables = Map<SchemaVariable, any>

export default function validate(
	target: any,
	schema: TypeSchema,
	options: { throwErrors?: boolean } = { throwErrors: true }
): boolean {
	const schemaVariables = new Map<SchemaVariable, any>()

	if (options.throwErrors) {
		return validateType(schema, target, schemaVariables)
	}

	return false
}
