import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import chai, { expect } from 'chai'

import { DIDSidetreeResolver } from '../../src/did/did-sidetree-resolver.js'
import { DIDResolver } from '../../src/did/did-resolver.js'

// extends chai to test promises
chai.use(chaiAsPromised)

describe('DidResolver', () => {
    it('should cache the resolution result and use the cached result when available', async () => {
        const did = 'did:ion:unusedDid'
        const didIonResolver = new DIDSidetreeResolver('ion', ['unusedResolutionEndpoint'])
        const didResolver = new DIDResolver([didIonResolver])

        const mockResolution = {
            didDocument: 'any' as any,
            didDocumentMetadata: 'any' as any,
            didResolutionMetadata: 'any' as any,
        }
        const ionDidResolveSpy = sinon.stub(didIonResolver, 'resolve').resolves(mockResolution)

        const cacheGetSpy = sinon.spy(didResolver['cache'], 'get')

        // calling resolve twice
        const resolutionResult1 = await didResolver.resolve(did)
        expect(resolutionResult1).to.equal(mockResolution)
        const resolutionResult2 = await didResolver.resolve(did)
        expect(resolutionResult2).to.equal(mockResolution)

        sinon.assert.calledTwice(cacheGetSpy) // should try to fetch from cache both times
        sinon.assert.calledOnce(ionDidResolveSpy) // should only resolve using ION resolver once (the first time)
    })
})
