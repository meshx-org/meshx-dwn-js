import z from 'zod'
import { did } from './definitions.js'
import { publicJwk } from './jwk/jwk.js'

export const jwkVerificationMethod = z.strictObject({
    id: z.string(),
    type: z.literal('JsonWebKey2020'),
    controller: did,
    publicKeyJwk: publicJwk,
})
