import { TypeSchema } from "./types/schemaTypes"
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
	options: Options = {}
) {
	switch (schema.type) {
		case "string":
			return stringValidator(schema, target, options)
		case "number":
			return numberValidator(schema, target, options)
		case "boolean":
			return booleanValidator(schema, target, options)
		case "undefined":
			return undefinedValidator(schema, target, options)
		case "null":
			return nullValidator(schema, target, options)
		case "instance":
			return instanceValidator(schema, target, options)
		case "array":
			return arrayValidator(schema, target, options)
		case "symbol":
			return symbolValidator(schema, target, options)
		case "any":
			return anyValidator(schema, target, options)
		case "object":
			return objectValidator(schema, target, options)
		case "integer":
			return integerValidator(schema, target, options)
		case "bigint":
			return bigintValidator(schema, target, options)
		case "function":
			return functionValidator(schema, target, options)
		case "float":
			return floatValidator(schema, target, options)
	}
}
