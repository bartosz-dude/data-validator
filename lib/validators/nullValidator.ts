import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError, TypeError } from "../Errors"
import { NullSchema } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function nullValidator(
	schema: NullSchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= target
	const targetName = options.targetName as string

	// required
	if (typeof target === "undefined") {
		const required = resolveVar("required", schema, schemaVariables)
		validate(required, { type: "boolean" })

		if (required) {
			throw new RequiredError({
				schema: schema,
				schemaType: "string",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (target !== null) {
		throw new TypeError({
			schema: schema,
			schemaType: "string",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	return true
}
