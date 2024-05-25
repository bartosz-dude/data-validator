type ValueType =
	| "string" // ✔️
	| "number" // ✔️
	| "boolean" // ✔️
	| "object" // ✔️
	| "array" // ✔️
	| "symbol" // ✔️
	| "bigint" // ✔️
	| "function" // ✔️
	| "null" // ✔️
	| "undefined" // ✔️
	| "instance" // ✔️
	| "integer" // ✔️
	| "float" // ✔️
	| "any" // ✔️

interface GenericSchema {
	required?: boolean
	type: ValueType
}

export interface StringSchema extends GenericSchema {
	type: "string"
	match?: RegExp | string | string[]
	length?:
		| number
		| {
				min?: number
				max?: number
		  }
}

export interface NumberSchema extends GenericSchema {
	type: "number"
	match?:
		| number
		| {
				min?: number
				max?: number
		  }
}

export interface BooleanSchema extends GenericSchema {
	type: "boolean"
	match?: boolean
}

export interface NullSchema extends GenericSchema {
	type: "null"
}

export interface UndefinedSchema extends GenericSchema {
	type: "undefined"
}

export interface SymbolSchema extends GenericSchema {
	type: "symbol"
}

export interface AnySchema extends GenericSchema {
	type: "any"
}

export interface InstanceSchema extends GenericSchema {
	type: "instance"
	instanceOf: any
}

export interface ArraySchema extends GenericSchema {
	type: "array"
	/**
	 * Matches elements at exact indexes
	 */
	match?: (TypeSchema | TypeSchema[])[]
	/**
	 * Matches one of arrays with elements at an exact indexes
	 */
	matchOneOf?: (TypeSchema | TypeSchema[])[][]
	/**
	 * Determines if all of these are contained in the array
	 */
	contains?: (TypeSchema & {
		required: true
		amount?:
			| number
			| {
					min?: number
					max?: number
			  }
	})[]
	length?:
		| number
		| {
				min?: number
				max?: number
		  }
}

export interface ObjectSchema extends GenericSchema {
	type: "object"
	matchProperties?: {
		[key: string]: TypeSchema | TypeSchema[]
	}
}

export interface BigintSchema extends GenericSchema {
	type: "bigint"
	match?:
		| bigint
		| {
				min?: bigint
				max?: bigint
		  }
}

export interface FunctionSchema extends GenericSchema {
	type: "function"
}

export interface IntegerSchema extends GenericSchema {
	type: "integer"
	match?:
		| number
		| {
				min?: number
				max?: number
		  }
}

export interface FloatSchema extends GenericSchema {
	type: "float"
	fractionRequired?: boolean
	match?:
		| number
		| {
				min?: number
				max?: number
		  }
}

export type TypeSchema =
	| StringSchema
	| NumberSchema
	| BooleanSchema
	| NullSchema
	| UndefinedSchema
	| InstanceSchema
	| ArraySchema
	| SymbolSchema
	| AnySchema
	| ObjectSchema
	| BigintSchema
	| FunctionSchema
	| IntegerSchema
	| FloatSchema
