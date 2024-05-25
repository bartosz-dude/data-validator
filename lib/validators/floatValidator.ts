import { RequiredError, TypeValidationError, ValueError } from "../Errors"
import { FloatSchema, IntegerSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function floatValidator(
	schema: FloatSchema,
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

	if (typeof target !== "number") {
		throw new TypeValidationError(`${options.targetName} is not a number`)
	}

	if (schema.fractionRequired) {
		if (Math.trunc(target) === target) {
			throw new TypeValidationError(
				`${options.targetName} is not a float`
			)
		}
	}

	if (typeof schema.match == "number") {
		if (target !== schema.match) {
			throw new ValueError(
				`${options.targetName} must be ${schema.match}`
			)
		}
	}

	if (typeof schema.match === "object") {
		if (schema.match.min && target < schema.match.min) {
			throw new ValueError(
				`${options.targetName} must be higher than ${schema.match.min}`
			)
		}

		if (schema.match.max && target > schema.match.max) {
			throw new ValueError(
				`${options.targetName} must be lower than ${schema.match.max}`
			)
		}
	}

	return true
}
