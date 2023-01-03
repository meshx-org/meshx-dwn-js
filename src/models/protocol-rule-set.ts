import z from 'zod'

const allow = z.union([
    z.strictObject({
        recipient: z.strictObject({
            of: z.string(),
            to: z.array(z.enum(['write'])).min(1),
        }),
    }),
    z.strictObject({
        anyone: z.object({
            to: z.array(z.enum(['write'])).min(1),
        }),
    }),
])

// TODO: when we enable strict mode we can just use z.ZodType<ProtocolRuleSet> instead of any
export const protocolRuleSet: any = z.strictObject({
    records: z.record(z.lazy(() => protocolRuleSet)).optional(),
    allow: allow.optional(),
})

export type ProtocolRuleSet = {
    allow?: {
        anyone?: {
            to: 'write'[]
        }
        recipient?: {
            of: string
            to: 'write'[]
        }
    }
    records?: {
        [key: string]: ProtocolRuleSet
    }
}

export type RuleSetAllow = z.infer<typeof allow>
