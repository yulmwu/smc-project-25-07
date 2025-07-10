export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}

export enum InvalidType {
    Password = 'password',
    Other = 'other'
}

export class Invalid extends Error {
    constructor(message: string, public type: InvalidType = InvalidType.Other) {
        super(message)
        this.name = 'InvalidError'
        this.type = type
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BadRequestError'
    }
}
