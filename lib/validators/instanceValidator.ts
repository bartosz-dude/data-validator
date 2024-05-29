import resolveVar from "../dynamicSchema/resolveVar"
import { RequiredError, TypeError, TypeValidationError } from "../Errors"
import { InstanceSchema } from "../types/schemaTypes"
import validate, { SchemaVariables } from "../validate"

interface Options {
	targetName?: string
}

export default function instanceValidator(
	schema: InstanceSchema,
	target: any,
	schemaVariables: SchemaVariables,
	options: Options = {}
) {
	options.targetName ??= JSON.stringify(target)
	const targetName = options.targetName as string

	// required
	if (typeof target === "undefined") {
		const required = resolveVar("required", schema, schemaVariables)
		validate(required, { type: "boolean" })

		if (required) {
			throw new RequiredError({
				schema: schema,
				schemaType: "instance",
				target: {
					value: target,
					name: targetName,
				},
			})
		}
		return true
	}

	// type
	if (typeof target !== "object") {
		throw new TypeError({
			schema: schema,
			schemaType: "instance",
			target: {
				value: target,
				name: targetName,
			},
		})
	}

	// instanceOf
	if (!(target instanceof schema.instanceOf)) {
		throw new TypeValidationError(
			`${options.targetName} is not an instance of ${schema.instanceOf}`,
			{
				errorType: "notSatisfied",
				schema: schema,
				schemaProperty: "instanceOf",
				schemaType: "instance",
				target: {
					value: target,
					name: targetName,
				},
				type: "validation",
			}
		)
	}

	return true
}
