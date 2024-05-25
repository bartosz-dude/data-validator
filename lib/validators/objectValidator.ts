import {
	PropertyError,
	RequiredError,
	TypeValidationError,
	ValueError,
} from "../Errors"
import { ObjectSchema, TypeSchema } from "../types/schemaTypes"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function objectValidator(
	schema: ObjectSchema,
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

	if (typeof target !== "object") {
		throw new TypeValidationError(`${options.targetName} is not an object`)
	}

	if (schema.matchProperties) {
		const schemaProps = Object.keys(schema.matchProperties)
		const targetProps = Object.keys(target)

		const requiredProps = Object.entries(schema.matchProperties)
			.filter((v) => {
				const vSchema = v[1]
				if (Array.isArray(vSchema)) {
					return true
				} else {
					return vSchema.required
				}
			})
			.map((v) => {
				const vSchema = v[1]

				if (Array.isArray(vSchema)) {
					const filtered = vSchema.filter((vI) => vI.required)

					return filtered.length > 0
						? ([v[0], filtered] as typeof v)
						: undefined
				}

				return v
			})
			.filter((v) => v ?? false) as [string, TypeSchema | TypeSchema[]][]

		const requiredPropsNames = requiredProps.map((v) => v[0])

		for (const elem of requiredPropsNames) {
			if (!targetProps.includes(elem)) {
				throw new RequiredError(
					`${options.targetName} needs to contain ${elem} property`
				)
			}
		}

		for (const elem of schemaProps) {
			const prop = target[elem]
			const propSchema = schema.matchProperties[elem]

			if (Array.isArray(propSchema)) {
				let invalidCount = 0
				for (let i = 0; i < propSchema.length; i++) {
					try {
						validateType(propSchema[i], prop, {
							targetName: options.targetName,
						})
					} catch (error) {
						invalidCount++
						continue
					}
				}

				if (invalidCount >= propSchema.length) {
					throw new RequiredError(
						`${
							options.targetName
						} needs to be one of ${JSON.stringify(propSchema)}`
					)
				}
			} else {
				validateType(propSchema, prop, {
					targetName: elem,
				})
			}
		}
	}

	return true
}
