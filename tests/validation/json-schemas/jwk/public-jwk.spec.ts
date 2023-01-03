import { expect } from 'chai'
import { signers } from '../../../../src/jose/algorithms/signing/signers.js'
import { publicJwk } from '../../../../src/models/jwk/jwk.js'
import { validateZodSchema } from '../../../../src/validator.js'

const { Ed25519, secp256k1 } = signers

describe('PublicJwk Schema', async () => {
    const { publicJwk: publicJwkSecp256k1 } = await secp256k1.generateKeyPair()
    const { publicJwk: publicJwkEd25519 } = await Ed25519.generateKeyPair()

    const publicJwkRsa = {
        kty: 'RSA',
        e: 'AQAB',
        use: 'sig',
        alg: 'RS256',
        n: 'abcd1234',
    }

    it('should not throw an exception if properly formatted publicJwk', () => {
        expect(() => validateZodSchema(publicJwk, publicJwkSecp256k1)).to.not.throw()
        expect(() => validateZodSchema(publicJwk, publicJwkEd25519)).to.not.throw()
        expect(() => validateZodSchema(publicJwk, publicJwkRsa)).to.not.throw()
    })

    it('should throw an exception if publicJwk has private property', () => {
        expect(() => validateZodSchema(publicJwk, { ...publicJwkSecp256k1, d: 'supersecret' })).to.throw()
        expect(() => validateZodSchema(publicJwk, { ...publicJwkEd25519, d: 'supersecret' })).to.throw()
        expect(() => validateZodSchema(publicJwk, { ...publicJwkRsa, oth: {} })).to.throw()
        expect(() => validateZodSchema(publicJwk, { ...publicJwkRsa, d: 'supersecret', oth: {} })).to.throw()
    })
})
