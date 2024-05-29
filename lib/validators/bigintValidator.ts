import DynamicSchema from "../dynamicSchema/dynamicSchema"
import resolveVar from "../dynamicSchema/resolveVar"
import { MatchError, RequiredError, SchemaError, TypeError } from "../Errors"
import { BigintSchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"

interface Options {
	targetName?: string
}

export default function bigintValidator(
	schema: BigintSchema,
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
				schemaType: "bigint",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "bigint") {
		throw new TypeError({
			schema: schema,
			schemaType: "bigint",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// match
	if (typeof schema.match === "bigint" || typeof schema.match === "string") {
		const matchValue = resolveVar<BigintSchema>(
			"match",
			schema,
			dynamicSchema
		) as bigint
		validate(matchValue, {
			type: "bigint",
		})

		if (target !== matchValue) {
			throw new MatchError({
				// what is wrong with schema here ? it's BigintSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "bigint",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (Array.isArray(schema.match)) {
		const match = schema.match.map((v) => {
			if (typeof v === "bigint" || typeof v === "string") {
				const matchValue = resolveVar<BigintSchema>(
					"match",
					schema,
					dynamicSchema
				) as bigint
				validate(matchValue, {
					type: "bigint",
				})

				return matchValue
			}

			if (typeof v === "object") {
				const min = resolveVar<BigintSchema>(
					"match",
					schema,
					dynamicSchema
				) as bigint
				validate(min, {
					type: "bigint",
				})

				const max = resolveVar<BigintSchema>(
					"match",
					schema,
					dynamicSchema
				) as bigint
				validate(max, {
					type: "bigint",
				})

				return {
					min: min,
					max: max,
				}
			}

			return v
		})

		if (
			match.some((v) => typeof v === "bigint") &&
			match.some((v) => typeof v === "object")
		) {
			throw new SchemaError(
				`You cannot mix bigints and ranges in single bigint match declaration`,
				{
					errorType: "mixedTypes",
					schema: schema,
					schemaProperty: "match",
					schemaType: "bigint",
					type: "schema",
				}
			)
		}

		if (
			match.every((v) => typeof v === "bigint") &&
			!match.includes(target)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's BigintSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "bigint",
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
					typeof matchEntry.min !== "undefined" &&
					target < matchEntry.min
				) {
					failedMatches++
					continue
				}

				if (
					typeof matchEntry.max !== "undefined" &&
					target > matchEntry.max
				) {
					failedMatches++
					continue
				}
			}
		}

		if (failedMatches === match.length) {
			throw new MatchError({
				// what is wrong with schema here ? it's BigintSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "bigint",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (typeof schema.match === "object" && !Array.isArray(schema.match)) {
		const min = resolveVar<BigintSchema>(
			"match",
			schema,
			dynamicSchema
		) as bigint
		validate(min, {
			type: "bigint",
		})
		if (typeof schema.match.min !== "undefined" && target < min) {
			throw new MatchError({
				// what is wrong with schema here ? it's BigintSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "bigint",
				target: {
					value: target,
					name: targetName,
				},
			})
		}

		const max = resolveVar<BigintSchema>(
			"match",
			schema,
			dynamicSchema
		) as bigint
		validate(max, {
			type: "bigint",
		})
		if (typeof schema.match.max !== "undefined" && target > max) {
			throw new MatchError({
				// what is wrong with schema here ? it's BigintSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "bigint",
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
