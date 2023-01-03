import z from 'zod'

export const generalJws = z.strictObject({
    payload: z.string().optional(),
    signatures: z
        .array(
            z.object({
                protected: z.string(),
                signature: z.string(),
            })
        )
        .min(1)
        .optional(),
})

export type GeneralJws = z.infer<typeof generalJws>
