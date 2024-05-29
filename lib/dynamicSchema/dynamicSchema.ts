import { DynamicSchemaError } from "../Errors"
import { SchemaVariable } from "../types/schemaTypes"

export default class DynamicSchema {
	#variables: Map<SchemaVariable, any> = new Map()
	#reservedNames: SchemaVariable[] = []

	get schemaFunctions() {
		return this.#reservedNames
	}

	get(variable: SchemaVariable) {
		return this.#variables.get(variable)
	}

	set(variable: SchemaVariable, value: any) {
		if (this.#reservedNames.includes(variable)) {
			throw new DynamicSchemaError(
				`'${variable}' can not be overwritten, it is a reserved variable name`,
				{
					errorType: "nameReserved",
					type: "dynamicSchema",
				}
			)
		}

		this.#variables.set(variable, value)
	}
}
