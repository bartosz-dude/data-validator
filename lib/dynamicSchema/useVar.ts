import { DynamicSchemaError } from "../Errors"
import type { SchemaVariable, TypeSchema } from "../types/schemaTypes"
import type DynamicSchema from "./dynamicSchema"

export default function useVar<T, K extends TypeSchema>(
	target: unknown,
	schemaProperty: keyof K,
	schema: K,
	dynamicSchema: DynamicSchema
) {
	if (typeof target === "string" && (target as string).match(/\$.*/)) {
		const variable = dynamicSchema.get(target as SchemaVariable)

		if (typeof variable === "undefined") {
			throw new DynamicSchemaError(
				`Cannot use '${target}' before assignment`,
				{
					type: "dynamicSchema",
					errorType: "varNotAssigned",
					schema: schema,
					// idk why it's number | string | symbol, so I do this
					schemaProperty: schemaProperty as string,
					schemaPropertyValue: target,
					schemaType: schema.type,
					target: {},
				}
			)
		}

		return variable as T
	}
	return target as T
}
