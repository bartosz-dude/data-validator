import validate from "./validate"
import {
	TypeValidationError,
	SchemaError,
	DynamicSchemaError,
	CustomValidatorError,
} from "./Errors"
import { TypeSchema } from "./types/schemaTypes"

export {
	validate,
	TypeValidationError,
	SchemaError,
	DynamicSchemaError,
	CustomValidatorError,
}

export declare type Schema = TypeSchema

validate("a", {
	type: "string",
	$: "",
})
