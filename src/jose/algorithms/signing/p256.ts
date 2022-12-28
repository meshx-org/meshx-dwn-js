import { P256 } from '@noble/curves/p256'
import { Encoder } from '../../../utils/encoder.js'
import { sha256 } from 'multiformats/hashes/sha2'

import type { PrivateJwk, PublicJwk, Signer } from '../../types.js'

function validateKey(jwk: PrivateJwk | PublicJwk): void {
    if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') {
        throw new Error('invalid jwk. kty MUST be EC. crv MUST be P-256')
    }
}

function publicKeyToJwk(publicKeyBytes: Uint8Array): PublicJwk {
    // ensure public key is in uncompressed format so we can convert it into both x and y value
    let uncompressedPublicKeyBytes
    if (publicKeyBytes.byteLength === 33) {
        // this means given key is compressed
        throw new Error('compressed secp256r1 keys not supported')
    } else {
        uncompressedPublicKeyBytes = publicKeyBytes
    }

    // the first byte is a header that indicates whether the key is uncompressed (0x04 if uncompressed),
    // we can safely ignore
    // bytes 1 - 32 represent X
    // bytes 33 - 64 represent Y

    // skip the first byte because it's used as a header to indicate whether the key is uncompressed
    const x = Encoder.bytesToBase64Url(uncompressedPublicKeyBytes.subarray(1, 33))
    const y = Encoder.bytesToBase64Url(uncompressedPublicKeyBytes.subarray(33, 65))

    const publicJwk: PublicJwk = {
        alg: 'ES256',
        kty: 'EC',
        crv: 'P-256',
        x,
        y,
    }

    return publicJwk
}

export const p256: Signer = {
    sign: async (content: Uint8Array, privateJwk: PrivateJwk): Promise<Uint8Array> => {
        validateKey(privateJwk)

        // the underlying lib expects us to hash the content ourselves:
        // https://github.com/paulmillr/noble-secp256k1/blob/97aa518b9c12563544ea87eba471b32ecf179916/index.ts#L1160
        const hashedContent = await sha256.encode(content)
        const privateKeyBytes = Encoder.base64UrlToBytes(privateJwk.d)

        const signature = P256.sign(hashedContent, privateKeyBytes)
        return signature.toDERRawBytes(false)
    },

    verify: async (content: Uint8Array, signature: Uint8Array, publicJwk: PublicJwk): Promise<boolean> => {
        validateKey(publicJwk)

        const xBytes = Encoder.base64UrlToBytes(publicJwk.x)
        const yBytes = Encoder.base64UrlToBytes(publicJwk.y!)

        const publicKeyBytes = new Uint8Array(xBytes.length + yBytes.length + 1)

        // create an uncompressed public key using the x and y values from the provided JWK.
        // a leading byte of 0x04 indicates that the public key is uncompressed
        // (e.g. x and y values are both present)
        publicKeyBytes.set([0x04], 0)
        publicKeyBytes.set(xBytes, 1)
        publicKeyBytes.set(yBytes, xBytes.length + 1)

        const hashedContent = await sha256.encode(content)

        return P256.verify(signature, hashedContent, publicKeyBytes)
    },

    generateKeyPair: async (): Promise<{ publicJwk: PublicJwk; privateJwk: PrivateJwk }> => {
        const privateKeyBytes = P256.utils.randomPrivateKey()
        const publicKeyBytes = P256.getPublicKey(privateKeyBytes)

        const d = Encoder.bytesToBase64Url(privateKeyBytes)
        const publicJwk: PublicJwk = publicKeyToJwk(publicKeyBytes)
        const privateJwk: PrivateJwk = { ...publicJwk, d }

        return { publicJwk, privateJwk }
    },

    publicKeyToJwk: async (publicKeyBytes: Uint8Array): Promise<PublicJwk> => {
        return publicKeyToJwk(publicKeyBytes)
    },
}
