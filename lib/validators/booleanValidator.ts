import { RequiredError, TypeValidationError, ValueError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { BooleanSchema, SchemaVariable } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function booleanValidator(
	schema: BooleanSchema,
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

	if (typeof target !== "boolean") {
		throw new TypeValidationError(`${options.targetName} is not a boolean`)
	}

	if (typeof schema.match !== "undefined") {
		if (
			target !==
			useVariable(
				schema.match,
				schemaVariables,
				{
					type: "boolean",
				},
				schema.use$
			)
		) {
			throw new ValueError(
				`${options.targetName} must be ${schema.match}`
			)
		}
	}

	if (typeof schema.$ === "string") {
		schemaVariables.set(("$" + schema.$) as SchemaVariable, target)
	}

	return true
}
