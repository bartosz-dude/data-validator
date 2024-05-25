import {
	RequiredError,
	SchemaError,
	TypeValidationError,
	ValueError,
} from "../Errors"
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

	if (Array.isArray(schema.match)) {
		const match = schema.match.map((v) => {
			if (typeof v === "bigint" || typeof v === "string") {
				return useVariable(
					v,
					schemaVariables,
					{
						type: "bigint",
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
							type: "bigint",
						},
						schema.use$
					),
					max: useVariable(
						v.max,
						schemaVariables,
						{
							type: "bigint",
						},
						schema.use$
					),
				}
			}

			return v
		})

		if (
			match.some((v) => typeof v === "number") &&
			match.some((v) => typeof v === "object")
		) {
			throw new SchemaError(
				`You cannot mix numbers and ranges in single bigint match declaration`
			)
		}

		if (
			match.every((v) => typeof v === "bigint") &&
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
