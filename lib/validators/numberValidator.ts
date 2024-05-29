import resolveVar from "../dynamicSchema/resolveVar"
import { MatchError, RequiredError, SchemaError, TypeError } from "../Errors"
import { NumberSchema, SchemaVariable } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function numberValidator(
	schema: NumberSchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= target
	const targetName = options.targetName as string

	// required
	if (typeof target === "undefined") {
		const required = resolveVar("required", schema, schemaVariables)
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
			schemaVariables
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
				const matchValue = resolveVar<NumberSchema>(
					"match",
					schema,
					schemaVariables
				) as number
				validate(matchValue, {
					type: "number",
				})

				return matchValue
			}

			if (typeof v === "object") {
				const min = resolveVar<NumberSchema>(
					"match",
					schema,
					schemaVariables
				) as number
				validate(min, {
					type: "number",
				})

				const max = resolveVar<NumberSchema>(
					"match",
					schema,
					schemaVariables
				) as number
				validate(max, {
					type: "number",
				})

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
		const min = resolveVar<NumberSchema>(
			"match",
			schema,
			schemaVariables
		) as number
		validate(min, {
			type: "number",
		})
		if (typeof schema.match.min !== "undefined" && target < min) {
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

		const max = resolveVar<NumberSchema>(
			"match",
			schema,
			schemaVariables
		) as number
		validate(max, {
			type: "number",
		})
		if (typeof schema.match.max !== "undefined" && target > max) {
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

	if (typeof schema.$ === "string") {
		schemaVariables.set(("$" + schema.$) as SchemaVariable, target)
	}

	return true
}
