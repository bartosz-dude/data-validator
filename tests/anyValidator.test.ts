import { describe, expect, test } from "vitest"
import anyValidator from "../lib/validators/anyValidator"
import DynamicSchema from "../lib/dynamicSchema/dynamicSchema"

describe("required", () => {
	test("undefined is accepted when value is not required", () => {
		expect(
			anyValidator(
				{
					type: "any",
					required: false,
				},
				undefined,
				new DynamicSchema()
			)
		).toBe(true)
	})
})

describe("type", () => {
	test("undefined is accepted", () => {
		expect(
			anyValidator(
				{
					type: "any",
				},
				undefined,
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string is accepted", () => {
		expect(
			anyValidator(
				{
					type: "any",
				},
				"",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("number is accepted", () => {
		expect(
			anyValidator(
				{
					type: "any",
				},
				1,
				new DynamicSchema()
			)
		).toBe(true)
	})
})
