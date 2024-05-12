import { describe, test, expect } from "vitest"
import {
	AmountError,
	LengthError,
	RequiredError,
	TypeValidationError,
} from "../lib/Errors"
import arrayValidator from "../lib/validators/arrayValidator"
import stringValidator from "../lib/validators/stringValidator"

describe("required", () => {
	test("undefined is accepted when value is not required", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					required: false,
				},
				undefined
			)
		).toBe(true)
	})

	test("undefined is not accepted when value is required", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					required: true,
				},
				undefined
			)
		).toThrowError(RequiredError)
	})
})

describe("type", () => {
	test("array is accepted", () => {
		expect(
			arrayValidator(
				{
					type: "array",
				},
				[]
			)
		).toBe(true)
	})

	test("value other than array is not accepted", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
				},
				0
			)
		).toThrowError(TypeValidationError)
	})
})

describe("length", () => {
	test("array with correct length is accepted", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					length: 4,
				},
				[1, 2, 3, 4]
			)
		).toBe(true)
	})

	test("array with incorrect length is not accepted", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					length: 4,
				},
				[1, 2, 3, 4, 5]
			)
		).toThrowError(LengthError)
	})

	test("array with length higher than min is accepted", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					length: {
						min: 4,
					},
				},
				[1, 2, 3, 4, 5]
			)
		).toBe(true)
	})

	test("array with length lower than max is accepted", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					length: {
						max: 4,
					},
				},
				[1, 2, 3]
			)
		).toBe(true)
	})

	test("array with length between min and max is accepted", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					length: {
						max: 4,
						min: 2,
					},
				},
				[1, 2, 3]
			)
		).toBe(true)
	})

	test("array with length higher than max is not accepted", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					length: {
						max: 4,
					},
				},
				[1, 2, 3, 4, 5]
			)
		).toThrowError(LengthError)
	})

	test("array with length lower than min is not accepted", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					length: {
						min: 4,
					},
				},
				[1, 2, 3]
			)
		).toThrowError(LengthError)
	})

	test("array with length outside of min and max is not accepted", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					length: {
						max: 4,
						min: 2,
					},
				},
				[1, 2, 3, 4, 5]
			)
		).toThrowError(LengthError)
	})
})

describe("match", () => {
	test("exact items match", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					match: [
						{
							type: "string",
						},
						{
							type: "number",
						},
					],
				},
				["a", 1]
			)
		).toBe(true)
	})

	test("not exact items not match", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					match: [
						{
							type: "string",
							required: true,
						},
						{
							type: "number",
							required: true,
						},
					],
				},
				["a"]
			)
		).toThrowError(RequiredError)
	})
})

describe("contains", () => {
	test("array contains required value", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					contains: [
						{
							type: "string",
							required: true,
						},
					],
				},
				["a"]
			)
		).toBe(true)
	})

	test("array not contains required value", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					contains: [
						{
							type: "number",
							required: true,
						},
					],
				},
				["a"]
			)
		).toThrowError(RequiredError)
	})

	describe("amount", () => {
		test("array contains required value with amount", () => {
			expect(
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: 2,
							},
						],
					},
					["a", "a"]
				)
			).toBe(true)
		})

		test("array not contains required value with amount", () => {
			expect(() =>
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: 2,
							},
						],
					},
					["a"]
				)
			).toThrowError(AmountError)
		})

		test("array contains required value with min amount", () => {
			expect(
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: {
									min: 2,
								},
							},
						],
					},
					["a", "a", "a"]
				)
			).toBe(true)
		})

		test("array contains required value with max amount", () => {
			expect(
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: {
									max: 3,
								},
							},
						],
					},
					["a", "a"]
				)
			).toBe(true)
		})

		test("array contains required value with min and max amount", () => {
			expect(
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: {
									min: 1,
									max: 3,
								},
							},
						],
					},
					["a", "a"]
				)
			).toBe(true)
		})

		test("array contains required value with less than min amount", () => {
			expect(() =>
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: {
									min: 2,
								},
							},
						],
					},
					["a"]
				)
			).toThrowError(AmountError)
		})

		test("array contains required value with more than max amount", () => {
			expect(() =>
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: {
									max: 3,
								},
							},
						],
					},
					["a", "a", "a", "a"]
				)
			).toThrowError(AmountError)
		})

		test("array contains required value with beyond min and max amount", () => {
			expect(() =>
				arrayValidator(
					{
						type: "array",
						contains: [
							{
								type: "string",
								required: true,
								amount: {
									min: 1,
									max: 3,
								},
							},
						],
					},
					["a", "a", "a", "a"]
				)
			).toThrowError(AmountError)
		})
	})
})

describe("match with contains", () => {
	test("array with exact match and contains is valid", () => {
		expect(
			arrayValidator(
				{
					type: "array",
					match: [
						{
							type: "any",
						},
						{
							type: "string",
						},
						{
							type: "any",
						},
					],
					contains: [
						{
							type: "number",
							match: 1,
							required: true,
						},
					],
				},
				[1, "abc", 2]
			)
		).toBe(true)
	})

	test("array with exact match and not contains is not valid", () => {
		expect(() =>
			arrayValidator(
				{
					type: "array",
					match: [
						{
							type: "any",
						},
						{
							type: "string",
						},
						{
							type: "any",
						},
					],
					contains: [
						{
							type: "number",
							match: 1,
							required: true,
						},
					],
				},
				[3, "abc", 2]
			)
		).toThrowError(RequiredError)
	})
})
