import { SchemaError, TypeValidationError } from "../Errors"
import { SchemaVariable, TypeSchema } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"

export default function useVariable<T extends unknown>(
	target: T | SchemaVariable,
	schemaVariables: SchemaVariables,
	schema?: TypeSchema,
	useVariable = false
): Exclude<T, SchemaVariable> {
	if (useVariable && typeof target === "string" && target.match(/\$.*/)) {
		const variable = schemaVariables.get(target as SchemaVariable)

		if (typeof variable === "undefined") {
			throw new ReferenceError(
				`Cannot use '${target}' before assignment in schema`
			)
		}
		if (schema) validate(variable, schema)

		return variable
	}

	if (
		!useVariable &&
		typeof target === "string" &&
		(schema?.type ?? "") !== "string"
	) {
		throw new SchemaError(
			`'${target}' variable cannot be used without 'use$' being true`
		)
	}

	return target as Exclude<T, SchemaVariable>
}
