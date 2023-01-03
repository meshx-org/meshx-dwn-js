import { expect } from 'chai'
import { signers } from '../../../src/jose/algorithms/signing/signers.js'
import { jwkVerificationMethod } from '../../../src/models/jwk-verification-method.js'
import { validateZodSchema } from '../../../src/validator.js'

const { secp256k1 } = signers

describe('JwkVerificationMethod', async () => {
    const { publicJwk } = await secp256k1.generateKeyPair()

    it('should not throw an exception if properly formatted verificationMethod', () => {
        expect(() =>
            validateZodSchema(jwkVerificationMethod, {
                id: 'did:jank:alice#key1',
                type: 'JsonWebKey2020',
                controller: 'did:jank:alice',
                publicKeyJwk: publicJwk,
            })
        ).to.not.throw()
    })

    it('should not throw if `id` does not have the DID as prefix', () => {
        expect(() =>
            validateZodSchema(jwkVerificationMethod, {
                id: '#key1',
                type: 'JsonWebKey2020',
                controller: 'did:jank:alice',
                publicKeyJwk: publicJwk,
            })
        ).to.not.throw()
    })

    it('should throw an exception if id isn\'t a string', () => {
        expect(() =>
            validateZodSchema(jwkVerificationMethod, {
                id: {},
                type: 'JsonWebKey2020',
                controller: 'did:jank:alice',
                publicKeyJwk: publicJwk,
            })
        ).to.throw('($id) Expected string, received object')
    })

    it('should throw an exception if controller isn\'t a did', () => {
        expect(() =>
            validateZodSchema(jwkVerificationMethod, {
                id: 'did:jank:alice#key1',
                type: 'JsonWebKey2020',
                controller: 'notadid:jank:alice',
                publicKeyJwk: publicJwk,
            })
        ).to.throw('($controller) must be a valid did')
    })

    it('should throw an exception if publicKeyJwk isn\'t present in verificationMethod', () => {
        expect(() =>
            validateZodSchema(jwkVerificationMethod, {
                id: 'did:jank:alice#key1',
                type: 'JsonWebKey2020',
                controller: 'did:jank:alice',
            })
        ).to.throw('publicKeyJwk')
    })

    it('should throw an exception if publicKeyJwk isn\'t an object', () => {
        expect(() =>
            validateZodSchema(jwkVerificationMethod, {
                id: 'did:jank:alice#key1',
                type: 'JsonWebKey2020',
                controller: 'did:jank:alice',
                publicKeyJwk: 'notAnObject',
            })
        ).to.throw('publicKeyJwk')
    })
})
