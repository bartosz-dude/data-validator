import resolveVar from "../dynamicSchema/resolveVar"
import {
	MatchError,
	RequiredError,
	TypeError,
	TypeValidationError,
} from "../Errors"
import { ArraySchema, SchemaVariable, TypeSchema } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function arrayValidator(
	schema: ArraySchema,
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
				schemaType: "array",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (!Array.isArray(target)) {
		throw new TypeError({
			schema: schema,
			schemaType: "array",
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
				{
					type: "number",
					match: schema.length,
					use$: true,
				},
				target.length,
				schemaVariables,
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
						schemaType: "array",
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

	// if (
	// 	typeof schema.length === "number" ||
	// 	typeof schema.length === "string"
	// ) {
	// 	if (
	// 		target.length !==
	// 		useVariable(
	// 			schema.length,
	// 			schemaVariables,
	// 			{
	// 				type: "number",
	// 			},
	// 			schema.use$
	// 		)
	// 	) {
	// 		throw new LengthError(
	// 			`${options.targetName} array must have length ${schema.length}`
	// 		)
	// 	}
	// }

	// if (typeof schema.length == "object") {
	// 	if (
	// 		schema.length.min &&
	// 		target.length <
	// 			useVariable(
	// 				schema.length.min,
	// 				schemaVariables,
	// 				{
	// 					type: "number",
	// 				},
	// 				schema.use$
	// 			)
	// 	) {
	// 		throw new LengthError(
	// 			`${options.targetName} array length must be at least ${schema.length.min}`
	// 		)
	// 	}
	// 	if (
	// 		schema.length.max &&
	// 		target.length >
	// 			useVariable(
	// 				schema.length.max,
	// 				schemaVariables,
	// 				{
	// 					type: "number",
	// 				},
	// 				schema.use$
	// 			)
	// 	) {
	// 		throw new LengthError(
	// 			`${options.targetName} array length must not exceed ${schema.length.max}`
	// 		)
	// 	}
	// }

	// match
	function match(schemaMatch: (TypeSchema | TypeSchema[])[]) {
		for (let i = 0; i < schemaMatch.length; i++) {
			const topMatch = schemaMatch[i]

			if (Array.isArray(topMatch)) {
				let invalidCount = 0
				for (let j = 0; j < topMatch.length; j++) {
					const midMatch = topMatch[j]

					try {
						validateType(midMatch, target[i], schemaVariables, {
							targetName: `${options.targetName}[${i}]`,
						})
					} catch (error) {
						invalidCount++
						continue
					}
				}

				if (invalidCount >= topMatch.length) {
					throw new MatchError({
						schemaType: "array",
						target: {
							value: target,
							name: targetName,
						},
						// @ts-expect-error
						schema: schema,
					})
				}

				continue
			}

			validateType(topMatch, target[i], schemaVariables, {
				targetName: `${options.targetName}[${i}]`,
			})
		}
	}

	if (schema.match) {
		match(schema.match)
	}

	if (schema.matchOneOf) {
		let invalidCount = 0
		for (let i = 0; i < schema.matchOneOf.length; i++) {
			try {
				match(schema.matchOneOf[i])
			} catch (error) {
				invalidCount++
				continue
			}
		}

		if (invalidCount >= schema.matchOneOf.length) {
			throw new TypeValidationError(
				`${options.targetName} must match one of the provided types`,
				{
					errorType: "notSatisfied",
					schema: schema,
					schemaProperty: "matchOneOf",
					schemaType: "array",
					target: {
						value: target,
						name: targetName,
					},
					type: "validation",
				}
			)
		}
	}

	function matchContain(contain: Exclude<typeof schema.contains, undefined>) {
		if (Array.isArray(contain)) {
			return 0
		}

		// if (!contain.required) {
		// 	return 0
		// }

		const found = (target as any[]).filter((v, vI) => {
			try {
				if (!contain) {
					return false
				}

				return validateType(contain, v, schemaVariables, {
					targetName: `${options.targetName}[${vI}]`,
				})
			} catch (error) {
				if (!contain) {
					return false
				}

				return false
			}
		})

		const amount = contain.amount
		if (typeof amount !== "undefined") {
			validateType(
				{
					type: "number",
					match: amount,
					use$: contain.required,
				},
				found.length,
				schemaVariables,
				{
					targetName: `${JSON.stringify(contain)} amount`,
				}
			)
		}

		return found.length
	}

	const contains = schema.contains
	if (contains) {
		let foundCount = 0

		if (Array.isArray(contains)) {
			for (let i = 0; i < contains.length; i++) {
				if (!contains[i].required) {
					continue
				}

				foundCount += matchContain(contains[i])
			}
		} else {
			foundCount += matchContain(contains)
		}

		if (schema.strict && foundCount < target.length) {
			throw new TypeValidationError(
				`Not all array entries match contain schema`,
				{
					type: "validation",
					schemaType: "array",
					errorType: "notSatisfied",
					schemaProperty: "strict",
					schema: schema,
					target: {
						value: target,
						name: targetName,
					},
				}
			)
		}
	}

	if (typeof schema.$ === "string") {
		schemaVariables.set(("$" + schema.$) as SchemaVariable, target)
	}

	return true
}
