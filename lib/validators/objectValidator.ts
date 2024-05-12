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
	options.targetName ??= target

	if (typeof target === "undefined") {
		if (schema.required) {
			throw new RequiredError(`${options.targetName} is required`)
		}
		return true
	}

	if (typeof target !== "object") {
		throw new TypeValidationError(`${options.targetName} is not an object`)
	}

	if (schema.properties) {
		const schemaProps = Object.keys(schema.properties)
		const targetProps = Object.keys(target)

		const requiredProps = Object.entries(schema.properties)
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
				throw new PropertyError(
					`${options.targetName} needs to contain ${elem} property`
				)
			}
		}

		for (const elem of schemaProps) {
			const prop = target[elem]
			const propSchema = schema.properties[elem]

			if (Array.isArray(propSchema)) {
				// ! here
			} else {
				validateType(propSchema, prop, {
					targetName: elem,
				})
			}
		}
	}

	return true
}
