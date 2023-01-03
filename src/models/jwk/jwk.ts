import z from 'zod'

export const jwkBase = z.strictObject({
    kty: z.enum(['EC', 'RSA', 'oct', 'OKP']),
    use: z.enum(['sig', 'enc']).optional(),
    key_ops: z.string().optional(),
    alg: z.string().optional(),
    // Key ID
    kid: z.string().optional(),
    //  X.509 URL
    x5u: z.string().optional(),
    //  X.509 Certificate Chain
    x5c: z.string().optional(),
    // X.509 Certificate SHA-1 Thumbprint
    x5t: z.string().optional(),
    // X.509 Certificate SHA-256 Thumbprint
    'x5t#S256': z.string().optional(),
})

export const rsaPublicKey = jwkBase.extend({
    kty: z.literal('RSA'),
    alg: z.enum(['RS256', 'RS284', 'RS512', 'PS256', 'PS284', 'PS512']),
    n: z.string(),
    e: z.string(),
})

export const rsaPrivateKey = rsaPublicKey.extend({
    d: z.string(),
    p: z.string(),
    q: z.string(),
    dp: z.string(),
    dq: z.string(),
    qi: z.string(),
    //oth: z.array(
    //    z.strictObject({
    //        r: z.string(),
    //        d: z.string(),
    //        t: z.string(),
    //    })
    //).optional(),
})

export const ecPublicKey = jwkBase.extend({
    kty: z.enum(['EC', 'OKP']),
    crv: z.string(),
    alg: z.enum(['P-256', 'P-384', 'P-521', 'ES256', 'ES384', 'ES512', 'ES256K', 'EdDSA']),
    x: z.string(),
    y: z.string().optional(), // only for P-256, P-384, P-521
})

export const ecPrivateKey = ecPublicKey.extend({
    d: z.string(),
})

export const publicJwk = z.union([ecPublicKey, rsaPublicKey])
export const anyJwk = z.union([ecPrivateKey, ecPublicKey, rsaPrivateKey, rsaPublicKey])

export type ECPublicJwk = z.infer<typeof ecPublicKey>
export type ECPrivateJwk = z.infer<typeof ecPrivateKey>

export type RSAPublicJwk = z.infer<typeof rsaPublicKey>
export type RSAPrivateJwk = z.infer<typeof rsaPrivateKey>

export type AnyJWK = z.infer<typeof anyJwk>
export type PublicJwk = z.infer<typeof publicJwk>
