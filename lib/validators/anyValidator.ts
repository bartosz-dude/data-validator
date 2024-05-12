import { RequiredError } from "../Errors"
import { AnySchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function anyValidator(
	schema: AnySchema,
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

	return true
}
