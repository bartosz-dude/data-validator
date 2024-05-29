import { DynamicSchemaError } from "../Errors"
import { SchemaVariable, TypeSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"

export default function resolveVar<T extends TypeSchema>(
	schemaProperty: keyof T,
	schema: T,
	dynamicSchema: SchemaVariables
) {
	if (
		schema.use$ &&
		typeof schema[schemaProperty] === "string" &&
		schema[schemaProperty].match(/\$.*/)
	) {
		const variable = dynamicSchema.get(
			schema[schemaProperty] as SchemaVariable
		)

		if (typeof variable === "undefined") {
			throw new DynamicSchemaError(
				`Cannot use '${schema[schemaProperty]}' before assignment`,
				{
					type: "dynamicSchema",
					errorType: "varNotAssigned",
					schema: schema,
					// idk why it's number | string | symbol, so I do this
					schemaProperty: schemaProperty as string,
					schemaPropertyValue: schema[schemaProperty],
					schemaType: schema.type,
					target: {},
				}
			)
		}

		return variable as T[typeof schemaProperty]
	}

	if (
		schema.use$ &&
		Array.isArray(schemaProperty) &&
		schemaProperty.some((v) => v.match(/\$.*/))
	) {
		const parsedProp = schemaProperty.map((v) => {
			if (v.match(/\$.*/)) {
				const variable = dynamicSchema.get(
					schema[schemaProperty] as SchemaVariable
				)

				if (typeof variable === "undefined") {
					throw new DynamicSchemaError(
						`Cannot use '${schema[schemaProperty]}' before assignment`,
						{
							type: "dynamicSchema",
							errorType: "varNotAssigned",
							schema: schema,
							// idk why it's number | string | symbol, so I do this
							schemaProperty: schemaProperty as string,
							schemaPropertyValue: JSON.stringify(
								schema[schemaProperty]
							),
							schemaType: schema.type,
							target: {},
						}
					)
				}
			}

			return v
		})

		return parsedProp as T[typeof schemaProperty]
	}

	return schema[schemaProperty]
}