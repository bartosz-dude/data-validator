import DynamicSchema from "../dynamicSchema/dynamicSchema"
import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError, TypeError } from "../Errors"
import { SymbolSchema } from "../types/schemaTypes"
import validate from "../validate"

interface Options {
	targetName?: string
}

export default function symbolValidator(
	schema: SymbolSchema,
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
				schemaType: "symbol",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "symbol") {
		throw new TypeError({
			schema: schema,
			schemaType: "symbol",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	return true
}
