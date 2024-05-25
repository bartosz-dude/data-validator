import {
	LengthError,
	RequiredError,
	TypeValidationError,
	ValueError,
} from "../Errors"
import useVariable from "../schemaVariables/useVariable"
import { StringSchema } from "../types/schemaTypes"
import { SchemaVariables } from "../validate"
import validateType from "../validateType"

interface Options {
	targetName?: string
}

export default function stringValidator(
	schema: StringSchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= target

	if (typeof target === "undefined") {
		if (
			useVariable(
				schema.required,
				schemaVariables,
				{
					type: "boolean",
				},
				schema.use$
			)
		) {
			throw new RequiredError(`${options.targetName} is required`)
		}
		return true
	}

	if (typeof target !== "string") {
		throw new TypeValidationError(`${options.targetName} is not a string`)
	}

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
			if (error instanceof ValueError) {
				throw new LengthError(error.message)
			}
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
	// 			`${options.targetName} must have length ${schema.length}`
	// 		)
	// 	}
	// }

	// if (typeof schema.length == "object") {
	// 	validateType(
	// 		{
	// 			type: "number",
	// 			match: schema.length,
	// 			use$: true,
	// 		},
	// 		target.length,
	// 		schemaVariables,
	// 		{
	// 			targetName: `${options.targetName} length`,
	// 		}
	// 	)
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
	// 			`${options.targetName} length must be at least ${schema.length.min}`
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
	// 			`${options.targetName} length must not exceed ${schema.length.max}`
	// 		)
	// 	}
	// }

	if (Array.isArray(schema.match)) {
		if (!schema.match.some((v) => v === target)) {
			throw new ValueError(
				`${options.targetName} is not contained in ${JSON.stringify(
					schema.match
				)}`
			)
		}
	}

	if (typeof schema.match === "string") {
		if (
			target !==
			useVariable(
				schema.match,
				schemaVariables,
				{
					type: "string",
				},
				schema.use$
			)
		) {
			throw new ValueError(
				`${options.targetName} is not "${schema.match}"`
			)
		}
	}

	if (!Array.isArray(schema.match) && typeof schema.match === "object") {
		const regex = new RegExp(schema.match as RegExp)

		if (!regex.test(target)) {
			throw new ValueError(
				`${options.targetName} does not match ${JSON.stringify(
					schema.match
				)}`
			)
		}
	}

	return true
}
