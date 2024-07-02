import { RequiredError, TypeValidationError } from "../lib/Errors"
import DynamicSchema from "../lib/dynamicSchema/dynamicSchema"
import stringValidator from "../lib/validators/stringValidator"
import { test, expect, describe } from "vitest"

describe("required", () => {
	test("undefined is accepted when value is not required", () => {
		expect(
			stringValidator(
				{
					type: "string",
					required: false,
				},
				undefined,
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("undefined is not accepted when value is required", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					required: true,
				},
				undefined,
				new DynamicSchema()
			)
		).toThrowError(RequiredError)
	})
})

describe("type", () => {
	test("value other than string is not accepted", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
				},
				0,
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})

	test("string is accepted", () => {
		expect(
			stringValidator(
				{
					type: "string",
				},
				"",
				new DynamicSchema()
			)
		).toBe(true)
	})
})

describe("length", () => {
	test("string with correct length is accepted", () => {
		expect(
			stringValidator(
				{
					type: "string",
					length: 4,
				},
				"abcd",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string with incorrect length is not accepted", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					length: 4,
				},
				"abcde",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})

	test("string with length higher than min is accepted", () => {
		expect(
			stringValidator(
				{
					type: "string",
					length: {
						min: 4,
					},
				},
				"abcde",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string with length lower than max is accepted", () => {
		expect(
			stringValidator(
				{
					type: "string",
					length: {
						max: 4,
					},
				},
				"abc",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string with length between min and max is accepted", () => {
		expect(
			stringValidator(
				{
					type: "string",
					length: {
						max: 4,
						min: 2,
					},
				},
				"abc",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string with length higher than max is not accepted", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					length: {
						max: 4,
					},
				},
				"abcde",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})

	test("string with length lower than min is not accepted", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					length: {
						min: 4,
					},
				},
				"abc",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})

	test("string with length outside of min and max is not accepted", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					length: {
						max: 4,
						min: 2,
					},
				},
				"abcde",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})
})

describe("match", () => {
	test("exact string matches", () => {
		expect(
			stringValidator(
				{
					type: "string",
					match: "abc",
				},
				"abc",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("not exact string not matches", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					match: "abc",
				},
				"abcd",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})

	test("string matches one of string", () => {
		expect(
			stringValidator(
				{
					type: "string",
					match: ["abc", "abcd", "123"],
				},
				"abcd",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string not matches one of string", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					match: ["abc", "abcd", "123"],
				},
				"a2",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})

	test("string matches regex", () => {
		expect(
			stringValidator(
				{
					type: "string",
					match: /ab./,
				},
				"abc",
				new DynamicSchema()
			)
		).toBe(true)
	})

	test("string not matches regex", () => {
		expect(() =>
			stringValidator(
				{
					type: "string",
					match: /ad./,
				},
				"abc",
				new DynamicSchema()
			)
		).toThrowError(TypeValidationError)
	})
})
