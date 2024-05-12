import {
	LengthError,
	RequiredError,
	TypeValidationError,
	ValueError,
} from "../Errors"
import { StringSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function stringValidator(
	schema: StringSchema,
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

	if (typeof target !== "string") {
		throw new TypeValidationError(`${options.targetName} is not a string`)
	}

	if (typeof schema.length === "number") {
		if (target.length !== schema.length) {
			throw new LengthError(
				`${options.targetName} must have length ${schema.length}`
			)
		}
	}

	if (typeof schema.length == "object") {
		if (schema.length.min && target.length < schema.length.min) {
			throw new LengthError(
				`${options.targetName} length must be at least ${schema.length.min}`
			)
		}
		if (schema.length.max && target.length > schema.length.max) {
			throw new LengthError(
				`${options.targetName} length must not exceed ${schema.length.max}`
			)
		}
	}

	if (Array.isArray(schema.match)) {
		if (!schema.match.some((v) => v === target)) {
			throw new ValueError(
				`${options.targetName} is not contained in ${JSON.stringify(
					schema.match
				)}`
			)
		}
	}

	if (typeof schema.match === "string") {
		if (target !== schema.match) {
			throw new ValueError(
				`${options.targetName} is not "${schema.match}"`
			)
		}
	}

	if (!Array.isArray(schema.match) && typeof schema.match === "object") {
		const regex = new RegExp(schema.match as RegExp)

		if (!regex.test(target)) {
			throw new ValueError(
				`${options.targetName} does not match ${JSON.stringify(
					schema.match
				)}`
			)
		}
	}

	return true
}
