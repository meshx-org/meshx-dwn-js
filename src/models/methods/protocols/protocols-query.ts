import z from 'zod'
import { did } from '../../definitions'
import { generalJws } from '../../general-jws'

export const protocolsQueryDescriptor = z.object({
    method: z.literal('ProtocolsQuery'),
    dateCreated: z.string(),
    filter: z.object({
        protocol: z.string(),
        recipient: did,
    }).optional(),
})

export const protocolsQuery = z.object({
    descriptor: protocolsQueryDescriptor,
    authorization: generalJws,
})

export type ProtocolsQueryMessage = z.infer<typeof protocolsQuery>
export type ProtocolsQueryDecriptor = z.infer<typeof protocolsQueryDescriptor>
