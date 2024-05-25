import { RequiredError, TypeValidationError, ValueError } from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import {
	BigintSchema,
	NumberSchema,
	SchemaVariable,
} from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function bigintValidator(
	schema: BigintSchema,
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

	if (typeof target !== "bigint") {
		throw new TypeValidationError(`${options.targetName} is not an bigint`)
	}

	if (typeof schema.match === "bigint" || typeof schema.match === "string") {
		if (
			target !==
			useVariable(
				schema.match,
				schemaVariables,
				{
					type: "bigint",
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
						type: "bigint",
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
						type: "bigint",
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
