class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
	}
}

export class TypeValidationError extends CustomError {
	constructor(message: string) {
		super(message)
	}
}

export class LengthError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class ValueError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class InstanceError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class PropertyError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class RequiredError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}

export class AmountError extends TypeValidationError {
	constructor(message: string) {
		super(message)
	}
}
