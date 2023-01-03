import { expect } from 'chai'
import { Message } from '../../../../src/core/message.js'

describe('CollectionsQuery schema definition', () => {
    it('should allow descriptor with only required properties', async () => {
        const validMessage = {
            descriptor: {
                method: 'CollectionsQuery',
                dateCreated: '123',
                filter: { schema: 'anySchema' },
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

    it('should throw if `authorization` is missing', () => {
        const invalidMessage = {
            descriptor: {
                method: 'CollectionsQuery',
                dateCreated: '123',
                filter: { schema: 'anySchema' },
            },
        }

        expect(() => {
            Message.validateJsonSchema(invalidMessage)
        }).throws('($authorization) Required')
    })

    it('should throw if unknown property is given in message', () => {
        const invalidMessage = {
            descriptor: {
                method: 'CollectionsQuery',
                dateCreated: '123',
                filter: { schema: 'anySchema' },
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
            descriptor: {
                method: 'CollectionsQuery',
                dateCreated: '123',
                filter: { schema: 'anySchema' },
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

    it('should throw if empty `filter` property is given in the `descriptor`', () => {
        const invalidMessage = {
            descriptor: {
                method: 'CollectionsQuery',
                dateCreated: '123',
                filter: {},
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
        }).throws('($descriptor.filter) must not have fewer than 1 properties')
    })

    it('should only allows string values from the spec for `dateSort`', () => {
        // test all valid values of `dateSort`
        const allowedDateSortValues = [
            'createdAscending',
            'createdDescending',
            'publishedAscending',
            'publishedAscending',
        ]
        for (const dateSortValue of allowedDateSortValues) {
            const validMessage = {
                descriptor: {
                    method: 'CollectionsQuery',
                    dateCreated: '123',
                    filter: { schema: 'anySchema' },
                    dateSort: dateSortValue,
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
        }

        // test an invalid values of `dateSort`
        const invalidMessage = {
            descriptor: {
                method: 'CollectionsQuery',
                dateCreated: '123',
                filter: { schema: 'anySchema' },
                dateSort: 'unacceptable', // bad value
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
        }).throws(`($descriptor.dateSort) Invalid enum value. Expected 'createdAscending' | 'createdDescending' | 'publishedAscending' | 'publishedDescending', received 'unacceptable'`)
    })
})
