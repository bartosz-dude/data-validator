import {
	AmountError,
	LengthError,
	RequiredError,
	TypeValidationError,
} from "../Errors"
import { ArraySchema, TypeSchema } from "../types/schemaTypes"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function arrayValidator(
	schema: ArraySchema,
	target: any,
	options: Options = {}
) {
	options.targetName ??= JSON.stringify(target)

	if (typeof target === "undefined") {
		if (schema.required) {
			throw new RequiredError(`${options.targetName} is required`)
		}
		return true
	}

	if (!Array.isArray(target)) {
		throw new TypeValidationError(`${options.targetName} is not an array`)
	}

	if (typeof schema.length === "number") {
		if (target.length !== schema.length) {
			throw new LengthError(
				`${options.targetName} array must have length ${schema.length}`
			)
		}
	}

	if (typeof schema.length == "object") {
		if (schema.length.min && target.length < schema.length.min) {
			throw new LengthError(
				`${options.targetName} array length must be at least ${schema.length.min}`
			)
		}
		if (schema.length.max && target.length > schema.length.max) {
			throw new LengthError(
				`${options.targetName} array length must not exceed ${schema.length.max}`
			)
		}
	}

	if (schema.match) {
		for (let i = 0; i < schema.match.length; i++) {
			// try {
			validateType(schema.match[i], target[i], {
				targetName: `${options.targetName}[${i}]`,
			})
			// } catch (error) {
			// 	if (
			// 		schema.match[i].required &&
			// 		error instanceof TypeValidationError
			// 	) {
			// 		throw error
			// 	}

			// 	continue
			// }
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

					return validateType(schema.contains[i], v, {
						targetName: `${options.targetName}[${vI}]`,
					})
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

			if (typeof schema.contains[i].amount === "number") {
				if (found.length !== schema.contains[i].amount) {
					throw new AmountError(
						`${JSON.stringify(
							schema.contains[i]
						)} must be included ${schema.contains[i].amount} times`
					)
				}
			}

			if (typeof schema.contains[i].amount == "object") {
				if (
					// @ts-ignore
					schema.contains[i].amount.min &&
					// @ts-ignore
					found.length < schema.contains[i].amount.min
				) {
					throw new AmountError(
						`${JSON.stringify(
							schema.contains[i]
						)} must be included at least ${
							// @ts-ignore
							schema.contains[i].amount.min
						} times`
					)
				}
				if (
					// @ts-ignore
					schema.contains[i].amount.max &&
					// @ts-ignore
					found.length > schema.contains[i].amount.max
				) {
					throw new AmountError(
						`${JSON.stringify(
							schema.contains[i]
						)} must be included not more than ${
							// @ts-ignore
							schema.contains[i].amount.max
						} times`
					)
				}
			}
		}
	}

	return true
}
