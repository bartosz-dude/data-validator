import {
	LengthError,
	RequiredError,
	TypeValidationError,
	ValueError,
} from "../lib/Errors"
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
				undefined
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
				undefined
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
				0
			)
		).toThrowError(TypeValidationError)
	})

	test("string is accepted", () => {
		expect(
			stringValidator(
				{
					type: "string",
				},
				""
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
				"abcd"
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
				"abcde"
			)
		).toThrowError(LengthError)
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
				"abcde"
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
				"abc"
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
				"abc"
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
				"abcde"
			)
		).toThrowError(LengthError)
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
				"abc"
			)
		).toThrowError(LengthError)
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
				"abcde"
			)
		).toThrowError(LengthError)
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
				"abc"
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
				"abcd"
			)
		).toThrowError(ValueError)
	})

	test("string matches one of string", () => {
		expect(
			stringValidator(
				{
					type: "string",
					match: ["abc", "abcd", "123"],
				},
				"abcd"
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
				"a2"
			)
		).toThrowError(ValueError)
	})

	test("string matches regex", () => {
		expect(
			stringValidator(
				{
					type: "string",
					match: /ab./,
				},
				"abc"
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
				"abc"
			)
		).toThrowError(ValueError)
	})
})
