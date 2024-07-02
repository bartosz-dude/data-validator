import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import resolveVar from "../dynamicSchema/resolveVar"
import {
	DynamicSchemaError,
	MatchError,
	RequiredError,
	SchemaError,
	TypeError,
	TypeValidationError,
} from "../Errors"
import {
	SchemaVariable,
	StringSchema,
	type TypeSchema,
} from "../types/schemaTypes"
import validate from "../validate"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function stringValidator(
	schema: StringSchema,
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
	if (typeof target !== "string") {
		throw new TypeError({
			schema: schema,
			schemaType: "string",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// length
	if (typeof schema.length !== "undefined") {
		try {
			validateType(
				// @ts-ignore
				{
					type: "number",
					match: schema.length,
					use$: schema.use$,
				},
				target.length,
				dynamicSchema,
				{
					targetName: `${options.targetName} length`,
				}
			)
		} catch (error) {
			if (error instanceof MatchError) {
				throw new TypeValidationError(
					`${targetName} length does not match`,
					{
						type: "validation",
						errorType: "notSatisfied",
						schema: schema,
						schemaProperty: "length",
						schemaType: "string",
						target: {
							value: target,
							name: targetName,
						},
					}
				)
			}

			throw error
		}
	}

	// match
	if (Array.isArray(schema.match)) {
		if (schema.use$ && schema.match.some((v) => v.match(/\$.*/))) {
			throw new SchemaError(
				`variables can not be used in string array match`,
				{
					errorType: "wrongUsage",
					type: "schema",
					schema: schema,
					schemaProperty: "match",
					schemaType: "string",
				}
			)
		}
		if (!schema.match.some((v) => v === target)) {
			throw new MatchError({
				schema: schema,
				schemaType: "string",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (typeof schema.match === "string") {
		const matchVal = resolveVar<StringSchema>(
			"match",
			schema,
			dynamicSchema
		) as string | string[]

		validate(matchVal, [
			{
				type: "string",
			},
			{
				type: "array",
				contains: {
					required: true,
					type: "string",
				},
			},
		])

		if (schema.use$ && target.match(/\$.*/) && Array.isArray(matchVal)) {
			if (!matchVal.every((v) => typeof v === "string")) {
				throw new MatchError({
					schema: schema,
					schemaType: "string",
					target: {
						value: target,
						name: targetName,
					},
				})
			}

			if (!matchVal.some((v) => v === target)) {
				throw new MatchError({
					schema: schema,
					schemaType: "string",
					target: {
						value: target,
						name: targetName,
					},
				})
			}
		}

		if (!Array.isArray(matchVal) && target !== matchVal) {
			throw new MatchError({
				schema: schema,
				schemaType: "string",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (!Array.isArray(schema.match) && typeof schema.match === "object") {
		const regex = new RegExp(schema.match as RegExp)

		if (!regex.test(target)) {
			throw new MatchError({
				schema: schema,
				schemaType: "string",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	// customValidator
	if (schema.use$ && typeof schema.customValidator !== "undefined") {
		handleCustomValidators(
			target,
			schema as StringSchema & {
				customValidator: SchemaVariable | SchemaVariable[]
			},
			dynamicSchema
		)
	}

	return true
}
