import z from 'zod'
import { did, uuid } from '../../definitions'
import { GeneralJws, generalJws } from '../../general-jws'
import { conditions, scope } from './definitions'

export const permissionsGrantDescriptor = z.object({
    method: z.literal('PermissionsGrant'),
    dateCreated: z.string(),
    // optional fields
    conditions: conditions.optional(),
    delegatedFrom: z.string().optional().describe('CID of the parent grant'),
    description: z.string().optional(),
    grantedTo: did.optional().describe('DID of the grantee'),
    grantedBy: did.optional().describe('DID of the grantor'),
    scope: scope.optional(),
    objectId: uuid.optional(),
})

export type PermissionsGrantDecriptor = z.infer<typeof permissionsGrantDescriptor>

// We can't infer this https://github.com/colinhacks/zod#recursive-types
export type PermissionsGrantMessage = {
    descriptor: PermissionsGrantDecriptor
    delegationChain: PermissionsGrantMessage
    authorization: GeneralJws
}

export const permissionsGrant: z.ZodType<PermissionsGrantMessage> = z.lazy(() =>
    z.object({
        descriptor: permissionsGrantDescriptor,
        delegationChain: permissionsGrant,
        authorization: generalJws,
    })
)
