import { InstanceError, RequiredError, TypeValidationError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { InstanceSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function instanceValidator(
	schema: InstanceSchema,
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

	if (typeof target !== "object") {
		throw new TypeValidationError(`${options.targetName} is not an object`)
	}

	if (!(target instanceof schema.instanceOf)) {
		throw new InstanceError(
			`${options.targetName} is not an instance of ${schema.instanceOf}`
		)
	}

	return true
}
