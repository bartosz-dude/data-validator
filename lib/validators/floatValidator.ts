import { RequiredError, TypeValidationError, ValueError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { FloatSchema, IntegerSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function floatValidator(
	schema: FloatSchema,
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

	if (typeof schema.match === "number" || typeof schema.match === "string") {
		if (
			target !==
			useVariable(
				schema.match,
				schemaVariables,
				{
					type: "float",
				},
				schema.use$
			)
		) {
			throw new ValueError(
				`${options.targetName} must be ${schema.match}`
			)
		}
	}

	if (typeof schema.match === "object") {
		if (
			schema.match.min &&
			target <
				useVariable(
					schema.match.min,
					schemaVariables,
					{
						type: "float",
					},
					schema.use$
				)
		) {
			throw new ValueError(
				`${options.targetName} must be higher than ${schema.match.min}`
			)
		}

		if (
			schema.match.max &&
			target >
				useVariable(
					schema.match.max,
					schemaVariables,
					{
						type: "float",
					},
					schema.use$
				)
		) {
			throw new ValueError(
				`${options.targetName} must be lower than ${schema.match.max}`
			)
		}
	}

	return true
}
