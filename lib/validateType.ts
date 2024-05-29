import DynamicSchema from "./dynamicSchema/dynamicSchema"
import { TypeSchema } from "./types/schemaTypes"
import { SchemaVariables } from "./validate"
import anyValidator from "./validators/anyValidator"
import arrayValidator from "./validators/arrayValidator"
import bigintValidator from "./validators/bigintValidator"
import booleanValidator from "./validators/booleanValidator"
import floatValidator from "./validators/floatValidator"
import functionValidator from "./validators/functionValidator"
import instanceValidator from "./validators/instanceValidator"
import integerValidator from "./validators/integerValidator"
import nullValidator from "./validators/nullValidator"
import numberValidator from "./validators/numberValidator"
import objectValidator from "./validators/objectValidator"
import stringValidator from "./validators/stringValidator"
import symbolValidator from "./validators/symbolValidator"
import undefinedValidator from "./validators/undefinedValidator"

interface Options {
	targetName?: string
}

export default function validateType(
	schema: TypeSchema,
	target: any,
	dynamicSchema: DynamicSchema,
	options: Options = {}
) {
	switch (schema.type) {
		case "string":
			return stringValidator(schema, target, dynamicSchema, options)
		case "number":
			return numberValidator(schema, target, dynamicSchema, options)
		case "boolean":
			return booleanValidator(schema, target, dynamicSchema, options)
		case "undefined":
			return undefinedValidator(schema, target, options)
		case "null":
			return nullValidator(schema, target, dynamicSchema, options)
		case "instance":
			return instanceValidator(schema, target, dynamicSchema, options)
		case "array":
			return arrayValidator(schema, target, dynamicSchema, options)
		case "symbol":
			return symbolValidator(schema, target, dynamicSchema, options)
		case "any":
			return anyValidator(schema, target, dynamicSchema, options)
		case "object":
			return objectValidator(schema, target, dynamicSchema, options)
		case "integer":
			return integerValidator(schema, target, dynamicSchema, options)
		case "bigint":
			return bigintValidator(schema, target, dynamicSchema, options)
		case "function":
			return functionValidator(schema, target, dynamicSchema, options)
		case "float":
			return floatValidator(schema, target, dynamicSchema, options)
	}
}
