import { describe, expect, test } from "vitest"
import anyValidator from "../lib/validators/anyValidator"
import objectValidator from "../lib/validators/objectValidator"
import { RequiredError, TypeValidationError } from "../lib/Errors"

describe("required", () => {
	test("undefined is accepted when value is not required", () => {
		expect(
			objectValidator(
				{
					type: "object",
					required: false,
				},
				undefined,
				new Map()
			)
		).toBe(true)
	})

	test("undefined is not accepted when value is required", () => {
		expect(() =>
			objectValidator(
				{
					type: "object",
					required: true,
				},
				undefined,
				new Map()
			)
		).toThrowError(RequiredError)
	})
})

describe("type", () => {
	test("object is accepted", () => {
		expect(
			objectValidator(
				{
					type: "object",
				},
				{},
				new Map()
			)
		).toBe(true)
	})

	test("not object is not accepted", () => {
		expect(() =>
			objectValidator(
				{
					type: "object",
				},
				"a",
				new Map()
			)
		).toThrowError(TypeValidationError)
	})
})

describe("matchProperties", () => {
	test("required property", () => {
		expect(
			objectValidator(
				{
					type: "object",
					matchProperties: {
						test: {
							required: true,
							type: "string",
							match: "test",
						},
						abc: {
							required: true,
							type: "string",
						},
					},
				},
				{
					test: "test",
					abc: "test",
				},
				new Map()
			)
		).toBe(true)

		expect(() =>
			objectValidator(
				{
					type: "object",
					matchProperties: {
						test: {
							required: true,
							type: "string",
							match: "test",
						},
					},
				},
				{
					test2: "test2",
				},
				new Map()
			)
		).toThrowError(RequiredError)
	})
})
