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

type GenericSchema = {
	type: ValueType
} & (
	| {
			required?: boolean
			use$?: false
	  }
	| {
			required?: boolean | SchemaVariable
			use$: true
	  }
)

export type SchemaVariable = `$${string}`

export type StringSchema =
	| GenericSchema & {
			type: "string"
			$?: string
	  } & (
				| {
						match?: RegExp | string | string[]
						length?:
							| number
							| number[]
							| {
									min?: number
									max?: number
							  }
							| {
									min?: number
									max?: number
							  }[]
						use$?: false
				  }
				| {
						match?: RegExp | string | string[] | SchemaVariable
						length?:
							| number
							| (number | SchemaVariable)[]
							| SchemaVariable
							| {
									min?: number | SchemaVariable
									max?: number | SchemaVariable
							  }
							| {
									min?: number | SchemaVariable
									max?: number | SchemaVariable
							  }[]
						use$: true
				  }
			)

export type NumberSchema =
	| GenericSchema & {
			type: "number"
			$?: string
	  } & (
				| {
						match?:
							| number
							| number[]
							| {
									min?: number
									max?: number
							  }
							| {
									min?: number
									max?: number
							  }[]
						use$?: false
				  }
				| {
						match?:
							| number
							| (number | SchemaVariable)[]
							| SchemaVariable
							| {
									min?: number | SchemaVariable
									max?: number | SchemaVariable
							  }
							| {
									min?: number | SchemaVariable
									max?: number | SchemaVariable
							  }[]
						use$: true
				  }
			)

export type BooleanSchema =
	| GenericSchema & {
			type: "boolean"
			$?: string
	  } & (
				| {
						match?: boolean

						use$?: false
				  }
				| {
						match?: boolean | SchemaVariable
						use$: true
				  }
			)

export type NullSchema = GenericSchema & {
	type: "null"
}

export type UndefinedSchema = GenericSchema & {
	type: "undefined"
}

export type SymbolSchema = GenericSchema & {
	type: "symbol"
}

export type AnySchema = GenericSchema & {
	type: "any"
}

export type InstanceSchema = GenericSchema & {
	type: "instance"
	instanceOf: any
}

export type ArraySchema = GenericSchema & {
	type: "array"
	/**
	 * Matches elements at exact indexes
	 */
	match?: (TypeSchema | TypeSchema[])[]
	/**
	 * Matches one of arrays with elements at an exact indexes
	 */
	matchOneOf?: (TypeSchema | TypeSchema[])[][]

	$?: string
	/**
	 * Determines if all of these are contained in the array
	 */

	contains?:
		| (TypeSchema & {
				required: true
				amount?:
					| number
					| number[]
					| {
							min?: number
							max?: number
					  }
					| {
							min?: number
							max?: number
					  }[]
				use$?: false
		  })
		| (TypeSchema & {
				required: true
				amount?:
					| number
					| (number | SchemaVariable)[]
					| SchemaVariable
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }[]
				use$: true
		  })
		| (TypeSchema & {
				required: true
				amount?:
					| number
					| number[]
					| {
							min?: number
							max?: number
					  }
					| {
							min?: number
							max?: number
					  }[]
				use$?: false
		  })[]
		| (TypeSchema & {
				required: true
				amount?:
					| number
					| (number | SchemaVariable)[]
					| SchemaVariable
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }[]
				use$: true
		  })[]
} & (
		| {
				strict?: boolean
				length?:
					| number
					| number[]
					| {
							min?: number
							max?: number
					  }
					| {
							min?: number
							max?: number
					  }[]
				use$?: false
		  }
		| {
				strict?: boolean | SchemaVariable
				length?:
					| number
					| (number | SchemaVariable)[]
					| SchemaVariable
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }[]
				use$: true
		  }
	)

export type ObjectSchema = GenericSchema & {
	type: "object"
	matchProperties?: {
		[key: string]: TypeSchema | TypeSchema[]
	}
}

export type BigintSchema = GenericSchema & {
	type: "bigint"
	$?: string
	use$?: boolean
} & (
		| {
				match?:
					| bigint
					| bigint[]
					| {
							min?: bigint
							max?: bigint
					  }
					| {
							min?: bigint
							max?: bigint
					  }[]
				use$?: false
		  }
		| {
				match?:
					| bigint
					| (bigint | SchemaVariable)[]
					| SchemaVariable
					| {
							min?: bigint | SchemaVariable
							max?: bigint | SchemaVariable
					  }
					| {
							min?: bigint | SchemaVariable
							max?: bigint | SchemaVariable
					  }[]
				use$: true
		  }
	)

export type FunctionSchema = GenericSchema & {
	type: "function"
}

export type IntegerSchema = GenericSchema & {
	type: "integer"
	$?: string
	use$?: boolean
} & (
		| {
				match?:
					| number
					| number[]
					| {
							min?: number
							max?: number
					  }
					| {
							min?: number
							max?: number
					  }[]
				use$?: false
		  }
		| {
				match?:
					| number
					| (number | SchemaVariable)[]
					| SchemaVariable
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }[]
				use$: true
		  }
	)

export type FloatSchema = GenericSchema & {
	type: "float"
	fractionRequired?: boolean
	$?: string
	use$?: boolean
} & (
		| {
				match?:
					| number
					| number[]
					| {
							min?: number
							max?: number
					  }
					| {
							min?: number
							max?: number
					  }[]
				use$?: false
		  }
		| {
				match?:
					| number
					| (number | SchemaVariable)[]
					| SchemaVariable
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }
					| {
							min?: number | SchemaVariable
							max?: number | SchemaVariable
					  }[]
				use$: true
		  }
	)

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
