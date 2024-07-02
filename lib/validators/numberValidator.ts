import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import resolveVar from "../dynamicSchema/resolveVar"
import useVar from "../dynamicSchema/useVar"
import { MatchError, RequiredError, SchemaError, TypeError } from "../Errors"
import { NumberSchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"

interface Options {
	targetName?: string
}

export default function numberValidator(
	schema: NumberSchema,
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
				schemaType: "number",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "number") {
		throw new TypeError({
			schema: schema,
			schemaType: "number",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// match
	if (typeof schema.match === "number" || typeof schema.match === "string") {
		const matchValue = resolveVar<NumberSchema>(
			"match",
			schema,
			dynamicSchema
		) as number
		validate(matchValue, {
			type: "number",
		})

		if (target !== matchValue) {
			throw new MatchError({
				// what is wrong with schema here ? it's NumberSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "number",
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
				const matchValue = useVar<number, NumberSchema>(
					v,
					"match",
					schema,
					dynamicSchema
				)
				validate(matchValue, {
					type: "number",
				})

				return matchValue
			}

			if (typeof v === "object") {
				const min = useVar<number, NumberSchema>(
					v.min,
					"match",
					schema,
					dynamicSchema
				)
				const max = useVar<number, NumberSchema>(
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
					schemaType: "number",
					type: "schema",
				}
			)
		}

		if (
			match.every((v) => typeof v === "number") &&
			!match.includes(target)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's NumberSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "number",
				target: {
					value: target,
					name: targetName,
				},
			})
		}

		let failedMatches = 0
		if (match.every((v) => typeof v === "object")) {
			for (const matchEntry of match) {
				console.log("matchEntry", matchEntry, match)
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
				// what is wrong with schema here ? it's NumberSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "number",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (typeof schema.match === "object" && !Array.isArray(schema.match)) {
		const match = resolveVar<NumberSchema>(
			"match",
			schema,
			dynamicSchema
		) as { min?: number; max?: number }
		if (
			typeof schema.match.min !== "undefined" &&
			target < (match.min ?? NaN)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's NumberSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "number",
				target: {
					value: target,
					name: targetName,
				},
			})
		}

		if (
			typeof schema.match.max !== "undefined" &&
			target > (match.max ?? NaN)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's NumberSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "number",
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
			schema as NumberSchema & {
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
