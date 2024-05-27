import { SchemaError, SchemaTypes, TypeValidationError } from "../Errors"
import { SchemaVariable, TypeSchema } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"

export default function useVariable<T extends unknown>(
	target: T | SchemaVariable,
	schemaVariables: SchemaVariables,
	errorStuff: {
		type: SchemaTypes
		schemaProperty: string
		schema: string
	},
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
			`'${target}' variable cannot be used without 'use$' being true`,
			{
				errorType: "use$EnabledRequiredToUseDynamicSchema",
				originType: errorStuff.type,
				schemaProperty: errorStuff.schemaProperty,
				schema: errorStuff.schema,
				type: "schema",
				details: {
					expected: `use$ set to true`,
					got: `use$ unset or set to false`,
				},
			}
		)
	}

	return target as Exclude<T, SchemaVariable>
}
