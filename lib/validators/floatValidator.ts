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

	if (Array.isArray(schema.match)) {
		const match = schema.match.map((v) => {
			if (typeof v === "number" || typeof v === "string") {
				return useVariable(
					v,
					schemaVariables,
					{
						type: "number",
					},
					schema.use$
				)
			}

			if (typeof v === "object") {
				return {
					min: useVariable(
						v.min,
						schemaVariables,
						{
							type: "number",
						},
						schema.use$
					),
					max: useVariable(
						v.max,
						schemaVariables,
						{
							type: "number",
						},
						schema.use$
					),
				}
			}

			return v
		})

		if (
			match.every((v) => typeof v === "number") &&
			!match.includes(target)
		) {
			throw new ValueError(
				`${options.targetName} must be contained in '${JSON.stringify(
					match
				)}'`
			)
		}

		let failedMatches = 0
		if (match.every((v) => typeof v === "object")) {
			for (const matchEntry of match) {
				if (matchEntry.min && target < matchEntry.min) {
					failedMatches++
					continue
				}

				if (matchEntry.max && target > matchEntry.max) {
					failedMatches++
					continue
				}
			}
		}

		if (failedMatches === match.length) {
			throw new ValueError(
				`${options.targetName} must be contained in one of these ${match}`
			)
		}
	}

	if (typeof schema.match === "object" && !Array.isArray(schema.match)) {
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
