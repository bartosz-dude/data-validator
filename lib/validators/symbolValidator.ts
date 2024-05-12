import { RequiredError, TypeValidationError } from "../Errors"
import { SymbolSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function symbolValidator(
	schema: SymbolSchema,
	target: any,
	options: Options = {}
) {
	options.targetName ??= target

	if (typeof target === "undefined") {
		if (schema.required) {
			throw new RequiredError(`${options.targetName} is required`)
		}
		return true
	}

	if (typeof target !== "symbol") {
		throw new TypeValidationError(`${options.targetName} is not a symbol`)
	}

	return true
}
