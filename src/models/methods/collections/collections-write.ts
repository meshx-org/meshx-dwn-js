import z from 'zod'
import { did, base64url } from '../../definitions.js'
import { generalJws } from '../../general-jws.js'

export const collectionsWriteDescriptor = z.strictObject({
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
    datePublished: z.string().optional()
})

export const collectionsWrite = z
    .strictObject({
        recordId: z.string(),
        descriptor: collectionsWriteDescriptor,
        authorization: generalJws,
        contextId: z.string().optional(),
        encodedData: base64url.optional(),
    })
    .superRefine((arg, ctx) => {
        if (arg.descriptor.published == true && !arg.descriptor.datePublished) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom, // customize your issue
                message: `must have required property 'datePublished'`,
            })
        }

        if ((arg.descriptor.published == false || !arg.descriptor.published) && arg.descriptor.datePublished) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom, // customize your issue
                message: `must have required property 'published'`,
            })
        }

        if (arg.descriptor.protocol && !arg.contextId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom, // customize your issue
                message: `must have a contextId when 'descriptor.protocol' is set`,
            })
        }

        if (!arg.descriptor.protocol && arg.contextId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom, // customize your issue
                message: `must have a 'descriptor.protocol' when 'contextId' is set`,
            })
        }

        return z.NEVER
    })

export type CollectionsWriteMessage = z.infer<typeof collectionsWrite>
export type CollectionsWriteDecriptor = z.infer<typeof collectionsWriteDescriptor>