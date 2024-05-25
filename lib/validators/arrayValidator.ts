import {
	AmountError,
	LengthError,
	RequiredError,
	TypeValidationError,
} from "../Errors"
import { ArraySchema, TypeSchema } from "../types/schemaTypes"
import validateType from "../validateType"
import { SchemaVariables } from "../validate"
import useVariable from "../schemaVariables/useVariable"

interface Options {
	targetName?: string
}

export default function arrayValidator(
	schema: ArraySchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= JSON.stringify(target)

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

	if (!Array.isArray(target)) {
		throw new TypeValidationError(`${options.targetName} is not an array`)
	}

	if (
		typeof schema.length === "number" ||
		typeof schema.length === "string"
	) {
		if (
			target.length !==
			useVariable(
				schema.length,
				schemaVariables,
				{
					type: "number",
				},
				schema.use$
			)
		) {
			throw new LengthError(
				`${options.targetName} array must have length ${schema.length}`
			)
		}
	}

	if (typeof schema.length == "object") {
		if (
			schema.length.min &&
			target.length <
				useVariable(
					schema.length.min,
					schemaVariables,
					{
						type: "number",
					},
					schema.use$
				)
		) {
			throw new LengthError(
				`${options.targetName} array length must be at least ${schema.length.min}`
			)
		}
		if (
			schema.length.max &&
			target.length >
				useVariable(
					schema.length.max,
					schemaVariables,
					{
						type: "number",
					},
					schema.use$
				)
		) {
			throw new LengthError(
				`${options.targetName} array length must not exceed ${schema.length.max}`
			)
		}
	}

	function match(schemaMatch: (TypeSchema | TypeSchema[])[]) {
		for (let i = 0; i < schemaMatch.length; i++) {
			const topMatch = schemaMatch[i]

			if (Array.isArray(topMatch)) {
				let invalidCount = 0
				for (let j = 0; j < topMatch.length; j++) {
					const midMatch = topMatch[j]

					try {
						validateType(midMatch, target[i], schemaVariables, {
							targetName: `${options.targetName}[${i}]`,
						})
					} catch (error) {
						invalidCount++
						continue
					}
				}

				if (invalidCount >= topMatch.length) {
					throw new RequiredError(
						`${
							options.targetName
						} needs to contain one of ${JSON.stringify(
							schemaMatch[i]
						)}`
					)
				}

				continue
			}

			validateType(topMatch, target[i], schemaVariables, {
				targetName: `${options.targetName}[${i}]`,
			})
		}
	}

	if (schema.match) {
		match(schema.match)
	}

	if (schema.matchOneOf) {
		let invalidCount = 0
		for (let i = 0; i < schema.matchOneOf.length; i++) {
			try {
				match(schema.matchOneOf[i])
			} catch (error) {
				invalidCount++
				continue
			}
		}

		if (invalidCount >= schema.matchOneOf.length) {
			throw new RequiredError(
				`${options.targetName} needs to contain one of ${JSON.stringify(
					schema.matchOneOf
				)}`
			)
		}
	}

	if (schema.contains) {
		for (let i = 0; i < schema.contains.length; i++) {
			if (!schema.contains[i].required) {
				continue
			}

			const found = (target as any[]).filter((v, vI) => {
				try {
					if (!schema.contains) {
						return false
					}

					return validateType(
						schema.contains[i],
						v,
						schemaVariables,
						{
							targetName: `${options.targetName}[${vI}]`,
						}
					)
				} catch (error) {
					if (!schema.contains) {
						return false
					}

					return false
				}
			})

			if (found.length == 0) {
				throw new RequiredError(
					`${options.targetName} needs to contain ${JSON.stringify(
						schema.contains[i]
					)}`
				)
			}

			if (
				typeof schema.contains[i].amount === "number" ||
				typeof schema.contains[i].amount === "string"
			) {
				if (
					found.length !==
					useVariable(
						schema.contains[i].amount,
						schemaVariables,
						{
							type: "number",
						},
						schema.use$
					)
				) {
					throw new AmountError(
						`${JSON.stringify(
							schema.contains[i]
						)} must be included ${schema.contains[i].amount} times`
					)
				}
			}

			const amount = schema.contains[i].amount
			if (typeof amount === "object") {
				if (
					amount.min &&
					found.length <
						useVariable(
							amount.min,
							schemaVariables,
							{
								type: "number",
							},
							schema.use$
						)
				) {
					throw new AmountError(
						`${JSON.stringify(
							schema.contains[i]
						)} must be included at least ${amount.min} times`
					)
				}
				if (
					amount.max &&
					found.length >
						useVariable(
							amount.max,
							schemaVariables,
							{
								type: "number",
							},
							schema.use$
						)
				) {
					throw new AmountError(
						`${JSON.stringify(
							schema.contains[i]
						)} must be included not more than ${amount.max} times`
					)
				}
			}
		}
	}

	return true
}
