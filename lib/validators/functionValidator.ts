import { RequiredError, TypeValidationError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { FunctionSchema, NullSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function functionValidator(
	schema: FunctionSchema,
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

	if (typeof target !== "function") {
		throw new TypeValidationError(`${options.targetName} is not a function`)
	}

	return true
}
