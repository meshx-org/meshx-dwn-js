import * as precompiledValidators from '../generated/precompiled-validators.js'
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

/**
 * Validates the given payload using JSON schema keyed by the given schema name.
 * @throws if the given payload fails validation.
 * @param schemaName the schema name use to look up the JSON schema to be used for schema validation.
 *                   The list of schema names can be found in compile-validators.js
 * @param payload javascript object to be validated
 */
export function validateJsonSchema(schemaName: string, payload: any): void {
    // const validateFn = validator.getSchema(schemaName);
    const validateFn = precompiledValidators[schemaName]

    if (!validateFn) {
        throw new Error(`schema for ${schemaName} not found.`)
    }

    validateFn(payload)

    if (!validateFn.errors) {
        return
    }

    // AJV is configured by default to stop validating after the 1st error is encountered which means
    // there will only ever be one error;
    const [errorObj] = validateFn.errors
    let { instancePath, message } = errorObj

    if (!instancePath) {
        instancePath = schemaName
    }

    throw new Error(`${instancePath}: ${message}`)
}
