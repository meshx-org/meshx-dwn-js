import z from 'zod'

export const request = z.strictObject({
    messages: z.array(z.object({})).min(1),
})

export type Request = z.infer<typeof request>
