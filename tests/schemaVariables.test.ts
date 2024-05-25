import { describe, test, expect } from "vitest"
import anyValidator from "../lib/validators/anyValidator"
import validate from "../lib/validate"
import { RequiredError } from "../lib/Errors"

describe("boolean variable", () => {
	test("boolean variable used for required", () => {
		expect(
			validate(
				{
					a: true,
					b: 1,
				},
				{
					type: "object",
					required: true,
					matchProperties: {
						a: {
							type: "boolean",
							required: true,
							$: "check",
						},
						b: {
							type: "number",
							use$: true,
							required: "$check",
						},
					},
				}
			)
		).toBe(true)

		expect(() =>
			validate(
				{
					a: true,
				},
				{
					type: "object",
					required: true,
					matchProperties: {
						a: {
							type: "boolean",
							required: true,
							$: "check",
						},
						b: {
							type: "number",
							use$: true,
							required: "$check",
						},
					},
				}
			)
		).toThrowError(RequiredError)
	})
})
