import { RequiredError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { AnySchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function anyValidator(
	schema: AnySchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= target
	const targetName = options.targetName as string

	if (typeof target === "undefined") {
		if (
			useVariable(
				schema.required,
				schemaVariables,
				{
					schemaProperty: "required",
					schema: JSON.stringify(schema),
					type: "any",
				},
				{
					type: "boolean",
				},
				schema.use$
			)
		) {
			throw new RequiredError({
				type: "any",
				schema: JSON.stringify(schema),
				targetName: targetName,
				targetValue: target,
			})
		}
		return true
	}

	return true
}
