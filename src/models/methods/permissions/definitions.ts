import z from 'zod'

export const conditions = z.object({
    encryption: z.enum(['optional', 'required']).optional(),
    attestation: z.enum(['optional', 'required']).optional(),
    delegation: z.boolean().optional(),
    publication: z.boolean().optional(),
    sharedAccess: z.boolean().optional(),
})

export const scope = z.object({
    method: z.string().optional(), // TODO: restrinct this more to supported methods
    objectId: z.string().optional(),
    schema: z.string().optional(),
})

export type GrantConditions = z.infer<typeof conditions>
export type GrantScope = z.infer<typeof scope>