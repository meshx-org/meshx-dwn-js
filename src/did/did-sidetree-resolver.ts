import type { DIDMethodResolver, DIDResolutionResult } from './types.js'
import crossFetch from 'cross-fetch'

/** Resolver for Sidetree DIDs. */
export class DIDSidetreeResolver implements DIDMethodResolver {
    private fetch = crossFetch

    /**
     * @param resolutionEndpoint optional custom URL to send DID resolution request to
     */
    constructor(
        private sidetreeMethod = 'ion',
        private resolutionEndpoints = ['https://discover.did.msidentity.com/1.0/identifiers/']
    ) {}

    method(): string {
        return this.sidetreeMethod
    }

    async resolve(did: string): Promise<DIDResolutionResult> {
        // using `URL` constructor to handle both existence and absence of trailing slash '/' in resolution endpoint
        // appending './' to DID so 'did' in 'did:ion:abc' doesn't get
        // interpreted as a URL scheme(e.g.like 'http') due to the colon
        for (const endpoint of this.resolutionEndpoints) {
            const url = new URL('./' + did, endpoint).toString()
            try {
                const response = await this.fetch(url)
                if (response.ok) {
                    return response.json()
                }
            } catch (error) {
                console.error(error)
            }
        }

        throw new Error(
            `unable to resolve ${did} from any of the following URLs: ${this.resolutionEndpoints.join(', ')}`
        )
    }
}
