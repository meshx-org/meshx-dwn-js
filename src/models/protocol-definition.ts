import { z } from 'zod'
import { protocolRuleSet } from './protocol-rule-set'

export const protocolDefintion = z.strictObject({
    labels: z.record(
        z.strictObject({
            schema: z.string(),
        })
    ),
    records: z.record(z.string(), protocolRuleSet),
})

export type ProtocolDefintion = z.infer<typeof protocolDefintion>
