import type { Cache } from '../utils/types.js'
import type { DIDMethodResolver, DIDResolutionResult } from './types.js'

import { DID } from './did.js'
import { DIDSidetreeResolver } from './did-sidetree-resolver.js'
import { DIDKeyResolver } from './did-key-resolver.js'
import { MemoryCache } from '../utils/memory-cache.js'

/** A DID resolver that by default supports `did:key` and `did:ion` DIDs. */
export class DIDResolver {
    private didResolvers: Map<string, DIDMethodResolver>
    private cache: Cache

    constructor(resolvers?: DIDMethodResolver[], cache?: Cache) {
        this.cache = cache || new MemoryCache(600)

        // construct default DID method resolvers if none given
        if (resolvers === undefined || resolvers.length === 0) {
            resolvers = [new DIDSidetreeResolver('ion'), new DIDKeyResolver()]
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
