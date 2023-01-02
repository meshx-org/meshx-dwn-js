import z from 'zod'

export const generalJws = z.object({
    payload: z.string(),
    signatures: z
        .array(
            z.object({
                protected: z.string(),
                signature: z.string(),
            })
        )
        .min(1),
})

export type GeneralJws = z.infer<typeof generalJws>