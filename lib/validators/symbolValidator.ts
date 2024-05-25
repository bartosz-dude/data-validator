import { RequiredError, TypeValidationError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { SymbolSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function symbolValidator(
	schema: SymbolSchema,
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

	if (typeof target !== "symbol") {
		throw new TypeValidationError(`${options.targetName} is not a symbol`)
	}

	return true
}
