import DynamicSchema from "../dynamicSchema/dynamicSchema"
import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError } from "../Errors"
import { AnySchema } from "../types/schemaTypes"
import validate from "../validate"

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
		const required = resolveVar("required", schema, dynamicSchema)
		validate(required, { type: "boolean" })

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
		return true
	}

	return true
}
