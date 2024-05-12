import { RequiredError, TypeValidationError } from "../Errors"
import { NullSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function nullValidator(
	schema: NullSchema,
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

	if (target !== null) {
		throw new TypeValidationError(`${options.targetName} is not a null`)
	}

	return true
}
