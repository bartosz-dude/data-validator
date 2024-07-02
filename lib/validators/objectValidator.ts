import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError, TypeError, TypeValidationError } from "../Errors"
import { ObjectSchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function objectValidator(
	schema: ObjectSchema,
	target: any,
	dynamicSchema: DynamicSchema,
	options: Options = {}
) {
	schema.strict ??= true
	options.targetName ??= JSON.stringify(target)
	const targetName = options.targetName as string

	// required
	if (typeof target === "undefined") {
		const required = resolveVar("required", schema, dynamicSchema)
		validate(required, { type: "boolean" })

		if (required) {
			throw new RequiredError({
				schema: schema,
				schemaType: "object",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "object") {
		throw new TypeError({
			schema: schema,
			schemaType: "object",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// matchProperties
	if (schema.matchProperties) {
		const schemaProps = Object.keys(schema.matchProperties)
		const targetProps = Object.keys(target)

		// this is pointless (?)
		// next loop just does validateType which should check required
		// though not sure
		/*
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

		for (const requiredPropName of requiredPropsNames) {
			if (!targetProps.includes(requiredPropName)) {
				throw new RequiredError({
					schema: schema.matchProperties[
						requiredPropName
					] as TypeSchema,
					schemaType: (
						schema.matchProperties[requiredPropName] as TypeSchema
					).type,
					target: {
						value: undefined,
						name: requiredPropName,
					},
				})
			}
		}*/

		let matchedProps = 0
		for (const schemaPropName of schemaProps) {
			const prop = target[schemaPropName]
			const propSchema = schema.matchProperties[schemaPropName]

			if (Array.isArray(propSchema)) {
				let invalidCount = 0
				for (let i = 0; i < propSchema.length; i++) {
					try {
						validateType(propSchema[i], prop, dynamicSchema, {
							targetName: options.targetName,
						})
					} catch (error) {
						invalidCount++
						continue
					}
				}

				if (invalidCount >= propSchema.length) {
					throw new TypeValidationError(
						`${schemaPropName} property must match one of the provided types`,
						{
							errorType: "notSatisfied",
							schema: schema,
							schemaProperty: `matchProperties`,
							schemaType: "object",
							target: {
								name: schemaPropName,
								value: prop,
							},
							type: "validation",
						}
					)
				}
				matchedProps++
			} else {
				validateType(propSchema, prop, dynamicSchema, {
					targetName: schemaPropName,
				})
				matchedProps++
			}
		}

		if (schema.strict && matchedProps < targetProps.length) {
			throw new TypeValidationError(
				`${options.targetName} can only have properties defined in matchProperties`,
				{
					errorType: "notSatisfied",
					schema: schema,
					schemaProperty: `matchProperties`,
					schemaType: "object",
					target: {
						name: options.targetName,
						value: target,
					},
					type: "validation",
				}
			)
		}
	}

	// customValidator
	if (schema.use$ && typeof schema.customValidator !== "undefined") {
		handleCustomValidators(
			target,
			schema as ObjectSchema & {
				customValidator: SchemaVariable | SchemaVariable[]
			},
			dynamicSchema
		)
	}

	return true
}
