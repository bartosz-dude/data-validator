import DynamicSchema from "../dynamicSchema/dynamicSchema"
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
	/**
	 * Type of the target value
	 */
	type: ValueType
} & (
	| {
			/**
			 * Whether the target value can be undefined
			 */
			required?: boolean
			/**
			 * When true you can use schema variables in schema
			 */
			use$?: false
	  }
	| {
			/**
			 * Whether the target value can be undefined
			 */
			required?: boolean | SchemaVariable
			/**
			 * Custom validation function accessible via schema variable
			 */
			customValidator?: SchemaVariable | SchemaVariable[]
			/**
			 * When true you can use schema variables in schema
			 */
			use$: true
	  }
)

export type SchemaVariable = `$${string}`

type NumberMatch =
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

type NumberMatchWithVariables =
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

export type StringSchema =
	| GenericSchema & {
			/**
			 * Type of the target value
			 */
			type: "string"
			/**
			 * Name for a schema variable which uses this value
			 */
			$?: string
	  } & (
				| {
						match?: RegExp | string | string[]

						length?: NumberMatch
						use$?: false
				  }
				| {
						match?: RegExp | string | string[] | SchemaVariable
						length?: NumberMatchWithVariables
						use$: true
				  }
			)

export type NumberSchema =
	| GenericSchema & {
			/**
			 * Type of the target value
			 */
			type: "number"
			/**
			 * Name for a schema variable which uses this value
			 */
			$?: string
	  } & (
				| {
						match?: NumberMatch
						use$?: false
				  }
				| {
						match?: NumberMatchWithVariables
						use$: true
				  }
			)

export type BooleanSchema =
	| GenericSchema & {
			/**
			 * Type of the target value
			 */
			type: "boolean"
			/**
			 * Name for a schema variable which uses this value
			 */
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
	/**
	 * Type of the target value
	 */
	type: "null"
}

export type UndefinedSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "undefined"
}

export type SymbolSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "symbol"
}

export type AnySchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "any"
}

export type InstanceSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "instance"
	instanceOf: any
}

export type ArraySchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "array"
	/**
	 * Matches elements of an array at exact indexes
	 */
	match?: (TypeSchema | TypeSchema[])[]
	/**
	 * Matches one of arrays with elements at an exact indexes
	 */
	matchOneOf?: (TypeSchema | TypeSchema[])[][]
	/**
	 * Name for a schema variable which uses this value
	 */
	$?: string
	/**
	 * Determines if these are contained in the array
	 *
	 * When `strict` is `true` all elements of the target array must match `contains`
	 *
	 * When `strict` is `false` at least one schema in `contains` must match
	 */
	contains?:
		| (TypeSchema & {
				required: true
				amount?: NumberMatch
				use$?: false
		  })
		| (TypeSchema & {
				required: true
				amount?: NumberMatchWithVariables
				use$: true
		  })
		| (TypeSchema & {
				required: true
				amount?: NumberMatch
				use$?: false
		  })[]
		| (TypeSchema & {
				required: true
				amount?: NumberMatchWithVariables
				use$: true
		  })[]
} & (
		| {
				/**
				 * @default true
				 */
				strict?: boolean
				length?: NumberMatch
				use$?: false
		  }
		| {
				/**
				 * @default true
				 */
				strict?: boolean | SchemaVariable
				length?: NumberMatchWithVariables
				use$: true
		  }
	)

export type ObjectSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "object"
	matchProperties?: {
		[key: string]: TypeSchema | TypeSchema[]
	}
}

export type BigintSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
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
	/**
	 * Type of the target value
	 */
	type: "function"
}

export type IntegerSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "integer"
	$?: string
	use$?: boolean
} & (
		| {
				match?: NumberMatch
				use$?: false
		  }
		| {
				match?: NumberMatchWithVariables
				use$: true
		  }
	)

export type FloatSchema = GenericSchema & {
	/**
	 * Type of the target value
	 */
	type: "float"
	fractionRequired?: boolean
	$?: string
	use$?: boolean
} & (
		| {
				match?: NumberMatch
				use$?: false
		  }
		| {
				match?: NumberMatchWithVariables
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

export type CustomValidator = (
	target: any,
	dynamicSchema: DynamicSchema
) => void
