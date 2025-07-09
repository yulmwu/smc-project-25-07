export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}

export class Invalid extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidError'
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BadRequestError'
    }
}
