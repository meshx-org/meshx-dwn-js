import type { Cache } from '../utils/types.js'
import type { PublicJwk } from '../jose/types.js'

import { DID } from './did.js'
import { DidIonResolver } from './did-ion-resolver.js'
import { DidKeyResolver } from './did-key-resolver.js'
import { MemoryCache } from '../utils/memory-cache.js'

/** A DID resolver that by default supports `did:key` and `did:ion` DIDs. */
export class DIDResolver {
    private didResolvers: Map<string, DIDMethodResolver>
    private cache: Cache

    constructor(resolvers?: DIDMethodResolver[], cache?: Cache) {
        this.cache = cache || new MemoryCache(600)

        // construct default DID method resolvers if none given
        if (resolvers === undefined || resolvers.length === 0) {
            resolvers = [new DidIonResolver(), new DidKeyResolver()]
        }

        this.didResolvers = new Map()

        for (const resolver of resolvers) {
            this.didResolvers.set(resolver.method(), resolver)
        }
    }

    /**
     * attempt to resolve the DID provided using the available DidMethodResolvers
     * @throws {Error} if DID is invalid
     * @throws {Error} if DID method is not supported
     * @throws {Error} if resolving DID fails
     * @param did - the DID to resolve
     * @returns {DIDResolutionResult}
     */
    public async resolve(did: string): Promise<DIDResolutionResult> {
        // naively validate requester DID
        DID.validate(did)
        const splitDID = did.split(':', 3)

        const didMethod = splitDID[1]
        const didResolver = this.didResolvers.get(didMethod)

        if (!didResolver) {
            throw new Error(`${didMethod} DID method not supported`)
        }

        // use cached result if exists
        const cachedResolutionResult = await this.cache.get(did)
        const resolutionResult = cachedResolutionResult ?? (await didResolver.resolve(did))
        if (cachedResolutionResult === undefined) {
            await this.cache.set(did, resolutionResult)
        }

        const { didDocument, didResolutionMetadata } = resolutionResult

        if (!didDocument || didResolutionMetadata?.error) {
            const { error } = didResolutionMetadata
            let errMsg = `Failed to resolve DID ${did}.`
            errMsg += error ? ` Error: ${error}` : ''

            throw new Error(errMsg)
        }

        return resolutionResult
    }
}

/**
 * A generalized interface that can be implemented for individual
 * DID methods
 */
export interface DIDMethodResolver {
    /**
     * @returns the DID method supported by {@link DIDMethodResolver.resolve}
     */
    method(): string

    /**
     * Attempts to resolve the DID provided into its respective DID Document.
     * More info on resolving DIDs can be found
     * {@link https://www.w3.org/TR/did-core/#resolution here}
     * @param did - the DID to resolve
     * @throws {Error} if unable to resolve the DID
     */
    resolve(did: string): Promise<DIDResolutionResult>
}

export type DIDDocument = {
    '@context'?: 'https://www.w3.org/ns/did/v1' | string | string[]
    id: string
    alsoKnownAs?: string[]
    controller?: string | string[]
    verificationMethod?: VerificationMethod[]
    service?: ServiceEndpoint[]
    authentication?: VerificationMethod[] | string[]
    assertionMethod?: VerificationMethod[] | string[]
    keyAgreement?: VerificationMethod[] | string[]
    capabilityInvocation?: VerificationMethod[] | string[]
    capabilityDelegation?: VerificationMethod[] | string[]
}

export type DWNServiceEndpoint = {
    nodes: string[]
}

export type ServiceEndpoint = {
    id: string
    type: string
    serviceEndpoint: string | DWNServiceEndpoint
    description?: string
}

export type VerificationMethod = {
    id: string
    // one of the valid verification method types as per
    // https://www.w3.org/TR/did-spec-registries/#verification-method-types
    type: string
    // DID of the key's controller
    controller: string
    // a JSON Web Key that conforms to https://datatracker.ietf.org/doc/html/rfc7517
    publicKeyJwk?: PublicJwk
}

export type DIDResolutionResult = {
    '@context'?: 'https://w3id.org/did-resolution/v1' | string | string[]
    didResolutionMetadata: DIDResolutionMetadata
    didDocument?: DIDDocument
    didDocumentMetadata: DIDDocumentMetadata
}

export type DIDResolutionMetadata = {
    contentType?: string
    error?: 'invalidDid' | 'notFound' | 'representationNotSupported' | 'unsupportedDidMethod' | string
}

export type DIDDocumentMetadata = {
    /** indicates the timestamp of the Create operation. ISO8601 timestamp */
    created?: string
    /**
     * indicates the timestamp of the last Update operation for the document version which was
     * resolved. ISO8601 timestamp
     */
    updated?: string
    /** indicates whether the DID has been deactivated */
    deactivated?: boolean
    // indicates the version of the last Update operation for the document version which
    // was resolved
    versionId?: string
    // indicates the timestamp of the next Update operation if the resolved document version
    // is not the latest version of the document.
    nextUpdate?: string
    // indicates the version of the next Update operation if the resolved document version
    // is not the latest version of the document.
    nextVersionId?: string
    // @see https://www.w3.org/TR/did-core/#dfn-equivalentid
    equivalentId?: string
    // @see https://www.w3.org/TR/did-core/#dfn-canonicalid
    canonicalId?: string
}
