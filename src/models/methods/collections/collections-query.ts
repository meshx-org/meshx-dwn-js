import z from 'zod'
import { isEmptyObject } from '../../../utils/object.js'
import { did } from '../../definitions.js'
import { generalJws } from '../../general-jws.js'

export const collectionsQueryDescriptor = z.strictObject({
    method: z.literal('CollectionsQuery'),
    dateCreated: z.string(),
    filter: z
        .strictObject({
            protocol: z.string(),
            recipient: did,
            contextId: z.string(),
            schema: z.string(),
            recordId: z.string(),
            parentId: z.string(),
            dataFormat: z.string(),
        })
        .partial()
        .superRefine((arg, ctx) => {
            if (isEmptyObject(arg)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom, // customize your issue
                    message: `must not have fewer than 1 properties`,
                })
            }

            return z.NEVER // The return value is not used, but we need to return something to satisfy the typing
        }),
    dateSort: z.enum(['createdAscending', 'createdDescending', 'publishedAscending', 'publishedDescending']).optional(),
})

export const collectionsQuery = z.strictObject({
    descriptor: collectionsQueryDescriptor,
    authorization: generalJws,
})

export type CollectionsQueryMessage = z.infer<typeof collectionsQuery>
export type CollectionsQueryDecriptor = z.infer<typeof collectionsQueryDescriptor>
