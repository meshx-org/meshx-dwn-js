import { expect } from 'chai'
import { Request } from '../../src/core/request.js'

describe('Request', () => {
    describe('parse', () => {
        it('throws an exception if messages is missing', () => {
            expect(() => {
                const req = {}
                Request.parse(req)
            }).throws('($messages) Required')
        })

        it('throws an exception if messages is not an array', () => {
            const tests = [{}, 'messages', 1, true, null]

            for (const t of tests) {
                expect(() => {
                    const req = { messages: t }
                    Request.parse(req)
                }).to.throw('($messages) Expected array, received')
            }
        })

        it('throws an exception if messages is an empty array', () => {
            expect(() => {
                const req = { messages: [] }
                Request.parse(req)
            }).throws('($messages) Array must contain at least 1 element(s)')
        })

        it('returns a Request object if valid', () => {
            const request = { messages: [{}] }
            const req = Request.parse(request)

            expect(req.messages.length).to.equal(1)
        })
    })
})
