import z from 'zod'
import { did, uuid } from '../../definitions.js'
import { GeneralJws, generalJws } from '../../general-jws.js'
import { conditions, scope } from './definitions.js'

export const permissionsGrantDescriptor = z
    .strictObject({
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
    .required()

export type PermissionsGrantDecriptor = z.infer<typeof permissionsGrantDescriptor>

// We can't infer this https://github.com/colinhacks/zod#recursive-types
export type PermissionsGrantMessage = {
    descriptor: PermissionsGrantDecriptor
    delegationChain: PermissionsGrantMessage
    authorization: GeneralJws
}

// TODO: when we enable strict mode we can just use z.ZodType<PermissionsGrantMessage> instead of any
export const permissionsGrant: any = z.strictObject({
    descriptor: permissionsGrantDescriptor,
    delegationChain: z.lazy(() => permissionsGrant),
    authorization: generalJws,
})
