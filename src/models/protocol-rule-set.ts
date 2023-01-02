import z from 'zod'

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

export const protocolRuleSet: z.ZodType<ProtocolRuleSet> = z.lazy(() =>
    z.object({
        records: z.record(protocolRuleSet).optional(),
        allow: z
            .object({
                recipient: z.object({
                    of: z.string(),
                    to: z.array(z.enum(['write'])).min(1),
                }),
            })
            .or(
                z.object({
                    anyone: z.object({
                        to: z.array(z.enum(['write'])).min(1),
                    }),
                })
            )
            .optional(),
    })
)
