import z from 'zod'
import { isEmptyObject } from '../../../utils/object.js'
import { did } from '../../definitions.js'
import { generalJws } from '../../general-jws.js'

export const protocolsQueryDescriptor = z.object({
    method: z.literal('ProtocolsQuery'),
    dateCreated: z.string(),
    filter: z
        .object({
            protocol: z.string(),
            recipient: did,
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
        })
        .optional(),
})

export const protocolsQuery = z.object({
    descriptor: protocolsQueryDescriptor,
    authorization: generalJws,
})

export type ProtocolsQueryMessage = z.infer<typeof protocolsQuery>
export type ProtocolsQueryDecriptor = z.infer<typeof protocolsQueryDescriptor>
