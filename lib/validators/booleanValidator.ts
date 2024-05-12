import { RequiredError, TypeValidationError, ValueError } from "../Errors"
import { BooleanSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function booleanValidator(
	schema: BooleanSchema,
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

	if (typeof target !== "boolean") {
		throw new TypeValidationError(`${options.targetName} is not a boolean`)
	}

	if (typeof schema.match == "boolean") {
		if (target !== schema.match) {
			throw new ValueError(
				`${options.targetName} must be ${schema.match}`
			)
		}
	}

	return true
}
