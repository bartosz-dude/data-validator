import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError } from "../Errors"
import { AnySchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function anyValidator(
	schema: AnySchema,
	target: any,
	dynamicSchema: DynamicSchema,
	options: Options = {}
) {
	options.targetName ??= target
	const targetName = options.targetName as string

	// required
	if (typeof target === "undefined") {
		const required = resolveVar("required", schema, dynamicSchema) as
			| boolean
			| undefined
		// validate(required, { type: "boolean" })
		// validateType({type: "number"}, required, dynamicSchema)
		// console.log("required", required)
		if (required) {
			throw new RequiredError({
				schema: schema,
				schemaType: "any",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	// customValidator
	if (schema.use$ && typeof schema.customValidator !== "undefined") {
		handleCustomValidators(
			target,
			schema as AnySchema & {
				customValidator: SchemaVariable | SchemaVariable[]
			},
			dynamicSchema
		)
	}

	return true
}
