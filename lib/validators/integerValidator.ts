import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import resolveVar from "../dynamicSchema/resolveVar"
import useVar from "../dynamicSchema/useVar"
import { MatchError, RequiredError, SchemaError, TypeError } from "../Errors"
import { IntegerSchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"

interface Options {
	targetName?: string
}

export default function integerValidator(
	schema: IntegerSchema,
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
				schemaType: "integer",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (Math.trunc(target) !== target) {
		throw new TypeError({
			schema: schema,
			schemaType: "integer",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// match
	if (typeof schema.match === "number" || typeof schema.match === "string") {
		const matchValue = resolveVar<IntegerSchema>(
			"match",
			schema,
			dynamicSchema
		) as number
		validate(matchValue, {
			type: "integer",
		})

		if (target !== matchValue) {
			throw new MatchError({
				// what is wrong with schema here ? it's IntegerSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "integer",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (Array.isArray(schema.match)) {
		const match = schema.match.map((v) => {
			if (typeof v === "number" || typeof v === "string") {
				const matchValue = useVar<number, IntegerSchema>(
					v,
					"match",
					schema,
					dynamicSchema
				)
				validate(matchValue, {
					type: "integer",
				})

				return matchValue
			}

			if (typeof v === "object") {
				const min = useVar<number, IntegerSchema>(
					v.min,
					"match",
					schema,
					dynamicSchema
				)
				const max = useVar<number, IntegerSchema>(
					v.max,
					"match",
					schema,
					dynamicSchema
				)
				return {
					min: min,
					max: max,
				}
			}

			return v
		})

		if (
			match.some((v) => typeof v === "number") &&
			match.some((v) => typeof v === "object")
		) {
			throw new SchemaError(
				`You cannot mix numbers and ranges in single number match declaration`,
				{
					errorType: "mixedTypes",
					schema: schema,
					schemaProperty: "match",
					schemaType: "integer",
					type: "schema",
				}
			)
		}

		if (
			match.every((v) => typeof v === "number") &&
			!match.includes(target)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's IntegerSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "integer",
				target: {
					value: target,
					name: targetName,
				},
			})
		}

		let failedMatches = 0
		if (match.every((v) => typeof v === "object")) {
			for (const matchEntry of match) {
				if (
					// @ts-ignore
					typeof matchEntry.min !== "undefined" &&
					// @ts-ignore
					target < matchEntry.min
				) {
					failedMatches++
					continue
				}

				if (
					// @ts-ignore
					typeof matchEntry.max !== "undefined" &&
					// @ts-ignore
					target > matchEntry.max
				) {
					failedMatches++
					continue
				}
			}
		}

		if (failedMatches === match.length) {
			throw new MatchError({
				// what is wrong with schema here ? it's IntegerSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "integer",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (typeof schema.match === "object" && !Array.isArray(schema.match)) {
		const match = resolveVar<IntegerSchema>(
			"match",
			schema,
			dynamicSchema
		) as { min?: number; max?: number }
		// validate(min, {
		// 	type: "integer",
		// })
		if (
			typeof schema.match.min !== "undefined" &&
			target < (match.min ?? NaN)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's IntegerSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "integer",
				target: {
					value: target,
					name: targetName,
				},
			})
		}

		const max = resolveVar<IntegerSchema>(
			"match",
			schema,
			dynamicSchema
		) as number
		validate(max, {
			type: "integer",
		})
		if (
			typeof schema.match.max !== "undefined" &&
			target > (match.max ?? NaN)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's IntegerSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "integer",
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
			schema as IntegerSchema & {
				customValidator: SchemaVariable | SchemaVariable[]
			},
			dynamicSchema
		)
	}

	if (typeof schema.$ === "string") {
		dynamicSchema.set(("$" + schema.$) as SchemaVariable, target)
	}

	return true
}
