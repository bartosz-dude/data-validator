import { RequiredError, TypeValidationError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { NullSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function nullValidator(
	schema: NullSchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= target

	if (typeof target === "undefined") {
		if (
			useVariable(
				schema.required,
				schemaVariables,
				{
					type: "boolean",
				},
				schema.use$
			)
		) {
			throw new RequiredError(`${options.targetName} is required`)
		}
		return true
	}

	if (target !== null) {
		throw new TypeValidationError(`${options.targetName} is not a null`)
	}

	return true
}
