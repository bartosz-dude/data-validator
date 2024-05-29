import DynamicSchema from "../dynamicSchema/dynamicSchema"
import resolveVar from "../dynamicSchema/resolveVar"
import { MatchError, RequiredError, TypeError } from "../Errors"
import { BooleanSchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"

interface Options {
	targetName?: string
}

export default function booleanValidator(
	schema: BooleanSchema,
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
				schemaType: "boolean",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "boolean") {
		throw new TypeError({
			schema: schema,
			schemaType: "boolean",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// match
	if (typeof schema.match !== "undefined") {
		const matchValue = resolveVar<BooleanSchema>(
			"match",
			schema,
			dynamicSchema
		) as boolean
		validate(matchValue, {
			type: "boolean",
		})

		if (target !== matchValue) {
			throw new MatchError({
				schema: schema,
				schemaType: "boolean",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (typeof schema.$ === "string") {
		dynamicSchema.set(("$" + schema.$) as SchemaVariable, target)
	}

	return true
}
