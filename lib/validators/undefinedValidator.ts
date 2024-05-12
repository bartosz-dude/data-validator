import { RequiredError, TypeValidationError } from "../Errors"
import { UndefinedSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function undefinedValidator(
	schema: UndefinedSchema,
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

	if (target !== undefined) {
		throw new TypeValidationError(`${options.targetName} is not undefined`)
	}

	return true
}
