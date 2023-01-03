import { expect } from 'chai'
import { Message } from '../../../../src/core/message.js'

describe('CollectionsWrite schema definition', () => {
    it('should allow descriptor with only required properties', async () => {
        const validMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
        }
        Message.validateJsonSchema(validMessage)
    })

    it('should throw if `recordId` is missing', async () => {
        const message = {
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
        }

        expect(() => {
            Message.validateJsonSchema(message)
        }).throws('($recordId) Required')
    })

    it('should throw if `authorization` is missing', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws('($authorization) Required')
    })

    it('should throw if unknown property is given in message', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            unknownProperty: 'unknownProperty', // unknown property
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws(`($) Unrecognized key(s) in object: 'unknownProperty'`)
    })

    it('should throw if unknown property is given in the `descriptor`', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
                unknownProperty: 'unknownProperty', // unknown property
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws(`($descriptor) Unrecognized key(s) in object: 'unknownProperty'`)
    })

    it('should throw if `encodedData` is not using base64url character set', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'not-base64url-string!!', // incorrect value
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws('($encodedData) Invalid')
    })

    it('should pass if `contextId` and `protocol` are both present', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            contextId: 'someContext', // protocol must exist
            descriptor: {
                method: 'CollectionsWrite',
                protocol: 'someProtocolId', // contextId must exist
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        Message.validateJsonSchema(invalidMessage)
    })

    it('should pass if `contextId` and `protocol` are both not present', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        Message.validateJsonSchema(invalidMessage)
    })

    it('should throw if `contextId` is set but `protocol` is missing', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            contextId: 'invalid', // must have `protocol` to exist
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws(`must have a 'descriptor.protocol' when 'contextId' is set`)
    })

    it('should throw if `protocol` is set but `contextId` is missing', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                protocol: 'invalid', // must have `contextId` to exist
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws(`must have a contextId when 'descriptor.protocol' is set`)
    })

    it('should throw if published is false but datePublished is present', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
                published: false,
                datePublished: '2022-12-19T10:20:30.123456', // must not be present when not published
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws(`($) must have required property 'published'`)
    })

    it('should throw if published is true but datePublished is missing', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
                published: true, //datePublished must be present
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws('must have required property \'datePublished\'')
    })

    it('should throw if published is missing and datePublished is present', () => {
        const invalidMessage = {
            recordId: 'anyRecordId',
            descriptor: {
                method: 'CollectionsWrite',
                dataCid: 'anyCid',
                dataFormat: 'application/json',
                dateCreated: '2022-12-19T10:20:30.123456',
                datePublished: '2022-12-19T10:20:30.123456', //published must be present
            },
            authorization: {
                payload: 'anyPayload',
                signatures: [
                    {
                        protected: 'anyProtectedHeader',
                        signature: 'anySignature',
                    },
                ],
            },
            encodedData: 'anything',
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws('must have required property \'published\'')
    })
})
