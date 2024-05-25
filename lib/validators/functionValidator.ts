import { RequiredError, TypeValidationError } from "../Errors"
import { FunctionSchema, NullSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function functionValidator(
	schema: FunctionSchema,
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

	if (typeof target !== "function") {
		throw new TypeValidationError(`${options.targetName} is not a function`)
	}

	return true
}
