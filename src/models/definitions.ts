import z from 'zod'

export const base64url = z.string().regex(/^[A-Za-z0-9_-]+$/)

export const did = z
    .string()
    .regex(
        /^did:([a-z0-9 -.]+):((?:(?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))*:)*((?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))+))((;[a-zA-Z0-9_.:%-]+=[a-zA-Z0-9_.:%-]*)*)(\/[^#?]*)?([?][^#]*)?(#.*)?$/
    )

export const uuid = z.string()