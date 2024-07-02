import { DynamicSchemaError, SchemaError } from "../Errors"
import { SchemaVariable, TypeSchema } from "../types/schemaTypes"
import DynamicSchema from "./dynamicSchema"

export default function resolveVar<T extends TypeSchema>(
	schemaProperty: keyof T,
	schema: T,
	dynamicSchema: DynamicSchema
) {
	if (
		schema.use$ &&
		typeof schema[schemaProperty] === "string" &&
		(schema[schemaProperty] as string).match(/\$.*/)
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
		schemaProperty.some((v) => v.match(/\$.*/) && typeof v !== "object")
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

	if (
		schema.use$ &&
		Array.isArray(schemaProperty) &&
		schemaProperty.every((v) => typeof v === "object")
	) {
		const parsedProp = schemaProperty.map((entry) => {
			const props = Object.entries(entry as object)

			const parsedProps = props.map(([k, v]) => {
				if (typeof v === "string" && (v as string).match(/\$.*/)) {
					const variable = dynamicSchema.get(v as SchemaVariable)

					if (typeof variable === "undefined") {
						throw new DynamicSchemaError(
							`Cannot use '${v}' before assignment`,
							{
								type: "dynamicSchema",
								errorType: "varNotAssigned",
								schema: schema,
								// idk why it's number | string | symbol, so I do this
								schemaProperty: schemaProperty as string,
								schemaPropertyValue: v,
								schemaType: schema.type,
								target: {},
							}
						)
					}

					return [k, variable]
				}
				return [k, v]
			})

			return Object.fromEntries(parsedProps)
		})

		return parsedProp as T[typeof schemaProperty]
	}

	if (schema.use$ && typeof schema[schemaProperty] === "object") {
		const props = Object.entries(schema[schemaProperty] as object)

		const parsedProps = props.map(([k, v]) => {
			if (typeof v === "string" && (v as string).match(/\$.*/)) {
				const variable = dynamicSchema.get(v as SchemaVariable)

				if (typeof variable === "undefined") {
					throw new DynamicSchemaError(
						`Cannot use '${v}' before assignment`,
						{
							type: "dynamicSchema",
							errorType: "varNotAssigned",
							schema: schema,
							// idk why it's number | string | symbol, so I do this
							schemaProperty: schemaProperty as string,
							schemaPropertyValue: v,
							schemaType: schema.type,
							target: {},
						}
					)
				}

				return [k, variable]
			}
			return [k, v]
		})

		return Object.fromEntries(parsedProps) as T[typeof schemaProperty]
	}

	return schema[schemaProperty]
}
