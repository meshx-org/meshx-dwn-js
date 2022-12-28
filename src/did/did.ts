export const DID_REGEX =
    /^did:([a-z0-9 -.]+):((?:(?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))*:)*((?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))+))((;[a-zA-Z0-9_.:%-]+=[a-zA-Z0-9_.:%-]*)*)(\/[^#?]*)?([?][^#]*)?(#.*)?$/

/** DID related operations. */
export class DID {
    /** Gets the method specific ID segment of a DID. ie. did:<method-name>:<method-specific-id> */
    public static getMethodSpecificId(did: string): string {
        const secondColonIndex = did.indexOf(':', 4) // start search for : from the method portion
        const methodSpecificId = did.substring(secondColonIndex + 1)
        return methodSpecificId
    }

    /**
     * @param did - the DID to validate
     */
    public static validate(did: unknown): void {
        if (typeof did !== 'string') {
            throw new Error(`DID is not string: ${did}`)
        }

        if (!DID_REGEX.test(did)) {
            throw new TypeError(`DID is not a valid DID: ${did}`)
        }
    }

    /** Gets the method name from a DID. ie. did:<method-name>:<method-specific-id> */
    public static getMethodName(did: string): string {
        const secondColonIndex = did.indexOf(':', 4) // start search for : from the method portion
        const methodName = did.substring(4, secondColonIndex)
        return methodName
    }
}
