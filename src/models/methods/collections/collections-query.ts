import z from 'zod'
import { did } from '../../definitions'
import { generalJws } from '../../general-jws'

export const collectionsQueryDescriptor = z.object({
    method: z.literal('CollectionsQuery'),
    dateCreated: z.string(),
    filter: z.object({
        protocol: z.string().optional(),
        recipient: did.optional(),
        contextId: z.string().optional(),
        schema: z.string().optional(),
        recordId: z.string().optional(),
        parentId: z.string().optional(),
        dataFormat: z.string().optional(),
    }),
    dateSort: z.enum(['createdAscending', 'createdDescending', 'publishedAscending', 'publishedDescending']).optional(),
})

export const collectionsQuery = z.object({
    descriptor: collectionsQueryDescriptor,
    authorization: generalJws,
})

export type CollectionsQueryMessage = z.infer<typeof collectionsQuery>
export type CollectionsQueryDecriptor = z.infer<typeof collectionsQueryDescriptor>
