import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import { TypeError } from "../Errors"
import { SchemaVariable, UndefinedSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function undefinedValidator(
	schema: UndefinedSchema,
	target: any,
	dynamicSchema: DynamicSchema,
	options: Options = {}
) {
	options.targetName ??= target
	const targetName = options.targetName as string

	// type
	if (target !== undefined) {
		throw new TypeError({
			schema: schema,
			schemaType: "undefined",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// customValidator
	if (schema.use$ && typeof schema.customValidator !== "undefined") {
		handleCustomValidators(
			target,
			schema as UndefinedSchema & {
				customValidator: SchemaVariable | SchemaVariable[]
			},
			dynamicSchema
		)
	}

	return true
}
