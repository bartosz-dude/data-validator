type ValueType =
	| "string" // ✔️
	| "number" // ✔️
	| "boolean" // ✔️
	| "object"
	| "array" // ✔️
	| "symbol" // ✔️
	| "bigint"
	| "function"
	| "null" // ✔️
	| "undefined" // ✔️
	| "instance" // ✔️
	| "integer"
	| "float"
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
	 * Matches each element at exact index
	 */
	match?: TypeSchema[]
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
	properties?: {
		[key: string]: TypeSchema | TypeSchema[]
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
