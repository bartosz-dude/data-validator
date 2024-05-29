import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError, TypeError } from "../Errors"
import { FunctionSchema } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function functionValidator(
	schema: FunctionSchema,
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
				schemaType: "function",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "function") {
		throw new TypeError({
			schema: schema,
			schemaType: "function",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	return true
}
