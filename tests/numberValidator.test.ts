import { describe, expect, test } from "vitest"
import anyValidator from "../lib/validators/anyValidator"
import numberValidator from "../lib/validators/numberValidator"
import { RequiredError, TypeValidationError, ValueError } from "../lib/Errors"

describe("required", () => {
	test("undefined is accepted when value is not required", () => {
		expect(
			numberValidator(
				{
					type: "number",
					required: false,
				},
				undefined,
				new Map()
			)
		).toBe(true)
	})

	test("undefined is not accepted when value is required", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
					required: true,
				},
				undefined,
				new Map()
			)
		).toThrowError(RequiredError)
	})
})

describe("type", () => {
	test("number is accepted", () => {
		expect(
			numberValidator(
				{
					type: "number",
				},
				1,
				new Map()
			)
		).toBe(true)
	})

	test("not number is not accepted", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
				},
				"",
				new Map()
			)
		).toThrowError(TypeValidationError)
	})
})

describe("match", () => {
	test("exact number is accepted", () => {
		expect(
			numberValidator(
				{
					type: "number",
					match: 1,
				},
				1,
				new Map()
			)
		).toBe(true)
	})

	test("not exact number is not accepted", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
					match: 1,
				},
				2,
				new Map()
			)
		).toThrowError(ValueError)
	})

	test("number more than min is accepted", () => {
		expect(
			numberValidator(
				{
					type: "number",
					match: {
						min: 1,
					},
				},
				2,
				new Map()
			)
		).toBe(true)
	})

	test("number less than max is accepted", () => {
		expect(
			numberValidator(
				{
					type: "number",
					match: {
						max: 2,
					},
				},
				1,
				new Map()
			)
		).toBe(true)
	})

	test("number between less and max is accepted", () => {
		expect(
			numberValidator(
				{
					type: "number",
					match: {
						min: 1,
						max: 3,
					},
				},
				2,
				new Map()
			)
		).toBe(true)
	})

	test("number more than max is not accepted", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
					match: {
						max: 1,
					},
				},
				2,
				new Map()
			)
		).toThrowError(ValueError)
	})

	test("number less than min is not accepted", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
					match: {
						min: 2,
					},
				},
				1,
				new Map()
			)
		).toThrowError(ValueError)
	})

	test("number outside less and max is not accepted", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
					match: {
						min: 1,
						max: 3,
					},
				},
				4,
				new Map()
			)
		).toThrowError(ValueError)
	})

	test("number in one of the ranges is accepted", () => {
		expect(
			numberValidator(
				{
					type: "number",
					match: [
						{
							min: 1,
							max: 3,
						},
						{
							min: 5,
							max: 8,
						},
					],
				},
				6,
				new Map()
			)
		).toBe(true)
	})

	test("number outside of the ranges is not accepted", () => {
		expect(() =>
			numberValidator(
				{
					type: "number",
					match: [
						{
							min: 1,
							max: 3,
						},
						{
							min: 5,
							max: 8,
						},
					],
				},
				4,
				new Map()
			)
		).toThrowError(ValueError)
	})
})
