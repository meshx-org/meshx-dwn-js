import z, { SafeParseError } from 'zod'

export function validateZodSchema<T>(schema: z.ZodType<T>, payload: any): void {
    const result = schema.safeParse(payload)

    if (result.success) {
        return
    } else {
        const { error } = result as SafeParseError<T>
        const [errorObj] = error.errors
        const { path, message } = errorObj

        throw new Error(`($${path.join('.')}) ${message}`)
    }
}
