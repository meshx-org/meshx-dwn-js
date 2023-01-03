import z from 'zod'
import { generalJws } from '../../general-jws.js'
import { protocolDefintion } from '../../protocol-definition.js'

export const protocolsConfigureDescriptor = z.object({
    method: z.literal('ProtocolsConfigure'),
    protocol: z.string(),
    dateCreated: z.string(),
    definition: protocolDefintion,
})

export const protocolsConfigure = z.object({
    descriptor: protocolsConfigureDescriptor,
    authorization: generalJws,
})

export type ProtocolsConfigureMessage = z.infer<typeof protocolsConfigure>
export type ProtocolsConfigureDecriptor = z.infer<typeof protocolsConfigureDescriptor>
