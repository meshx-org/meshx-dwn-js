import z from 'zod'
import { did, base64url } from '../../definitions'
import { generalJws } from '../../general-jws'

export const collectionsWriteDescriptor = z.object({
    method: z.literal('CollectionsWrite'),
    dataCid: z.string(),
    dateCreated: z.string(),
    dataFormat: z.string(),

    recipient: did.optional(),
    protocol: z.string().optional(),
    schema: z.string().optional(),
    lineageParent: z.string().optional(),
    parentId: z.string().optional(),
    published: z.boolean().optional(),
    datePublished: z.string().optional(),
})

export const collectionsWrite = z.object({
    recordId: z.string(),
    contextId: z.string().optional(),
    descriptor: collectionsWriteDescriptor,
    authorization: generalJws,
    encodedData: base64url.optional(),
})

export type CollectionsWriteMessage = z.infer<typeof collectionsWrite>
export type CollectionsWriteDecriptor = z.infer<typeof collectionsWriteDescriptor>
