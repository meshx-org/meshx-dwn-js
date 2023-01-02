import z from 'zod'
import { generalJws } from '../../general-jws'

export const permissionsRequestDescriptor = z.object({
    method: z.literal('PermissionsRequest'),
    // TODO
})

export const permissionsRequest = z.object({
    descriptor: permissionsRequestDescriptor,
    authorization: generalJws,
})

export type PermissionsRequestMessage = z.infer<typeof permissionsRequest>
export type PermissionsRequestDecriptor = z.infer<typeof permissionsRequestDescriptor>
