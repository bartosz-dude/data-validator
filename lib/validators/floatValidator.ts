import DynamicSchema from "../dynamicSchema/dynamicSchema"
import handleCustomValidators from "../dynamicSchema/handleCustomValidators"
import resolveVar from "../dynamicSchema/resolveVar"
import {
	MatchError,
	RequiredError,
	SchemaError,
	TypeError,
	TypeValidationError,
} from "../Errors"
import { FloatSchema, SchemaVariable } from "../types/schemaTypes"
import validate from "../validate"

interface Options {
	targetName?: string
}

export default function floatValidator(
	schema: FloatSchema,
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
				schemaType: "float",
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
			schemaType: "float",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// fraction required
	if (schema.fractionRequired) {
		if (Math.trunc(target) === target) {
			throw new TypeValidationError(
				`${options.targetName} is not a fraction`,
				{
					errorType: "notSatisfied",
					schema: schema,
					schemaProperty: "fractionRequired",
					schemaType: "float",
					target: {
						value: target,
						name: targetName,
					},
					type: "validation",
				}
			)
		}
	}

	// match
	if (typeof schema.match === "number" || typeof schema.match === "string") {
		const matchValue = resolveVar<FloatSchema>(
			"match",
			schema,
			dynamicSchema
		) as number
		validate(matchValue, {
			type: "float",
		})

		if (target !== matchValue) {
			throw new MatchError({
				// what is wrong with schema here ? it's FloatSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "float",
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
				const matchValue = resolveVar<FloatSchema>(
					"match",
					schema,
					dynamicSchema
				) as number
				validate(matchValue, {
					type: "float",
				})

				return matchValue
			}

			if (typeof v === "object") {
				const min = resolveVar<FloatSchema>(
					"match",
					schema,
					dynamicSchema
				) as number
				validate(min, {
					type: "float",
				})

				const max = resolveVar<FloatSchema>(
					"match",
					schema,
					dynamicSchema
				) as number
				validate(max, {
					type: "float",
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
					schemaType: "float",
					type: "schema",
				}
			)
		}

		if (
			match.every((v) => typeof v === "number") &&
			!match.includes(target)
		) {
			throw new MatchError({
				// what is wrong with schema here ? it's FloatSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "float",
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
				// what is wrong with schema here ? it's FloatSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "float",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
	}

	if (typeof schema.match === "object" && !Array.isArray(schema.match)) {
		const min = resolveVar<FloatSchema>(
			"match",
			schema,
			dynamicSchema
		) as number
		validate(min, {
			type: "float",
		})
		if (typeof schema.match.min !== "undefined" && target < min) {
			throw new MatchError({
				// what is wrong with schema here ? it's FloatSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "float",
				target: {
					value: target,
					name: targetName,
				},
			})
		}

		const max = resolveVar<FloatSchema>(
			"match",
			schema,
			dynamicSchema
		) as number
		validate(max, {
			type: "float",
		})
		if (typeof schema.match.max !== "undefined" && target > max) {
			throw new MatchError({
				// what is wrong with schema here ? it's FloatSchema so why the complaining
				// @ts-ignore
				schema: schema,
				schemaType: "float",
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
			schema as FloatSchema & {
				customValidator: SchemaVariable | SchemaVariable[]
			},
			dynamicSchema
		)
	}

	// $
	if (typeof schema.$ === "string") {
		dynamicSchema.set(("$" + schema.$) as SchemaVariable, target)
	}

	return true
}
