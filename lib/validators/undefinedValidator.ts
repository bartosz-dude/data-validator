import { TypeError } from "../Errors"
import { UndefinedSchema } from "../types/schemaTypes"

interface Options {
	targetName?: string
}

export default function undefinedValidator(
	schema: UndefinedSchema,
	target: any,
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

	return true
}
