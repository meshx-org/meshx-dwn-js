import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'

import { DidKeyResolver } from '../src/did/did-key-resolver.js'
import { DIDMethodResolver, DIDResolutionResult } from '../src/did/did-resolver.js'
import { DID } from '../src/did/did.js'
import { DWN, DWNConfig } from '../src/dwn.js'
import { MessageStoreLevel } from '../src/store/message-store-level.js'
import { TestDataGenerator } from './utils/test-data-generator.js'

chai.use(chaiAsPromised)

describe('DWN', () => {
    describe('processMessage()', () => {
        let messageStore: MessageStoreLevel

        before(async () => {
            // important to follow this pattern to initialize the message store in tests
            // so that different suites can reuse the same block store and index location for testing
            messageStore = new MessageStoreLevel({
                blockstoreLocation: 'TEST-BLOCKSTORE',
                indexLocation: 'TEST-INDEX',
            })

            await messageStore.open()
        })

        beforeEach(async () => {
            await messageStore.clear()
            // clean up before each test rather than after so that a test does not depend on
            // other tests to do the clean up
        })

        after(async () => {
            await messageStore.close()
        })

        it('should process CollectionsWrite message signed by a `did:key` DID', async () => {
            // generate a `did:key` DID
            const alice = await DidKeyResolver.generate()

            const messageData = await TestDataGenerator.generateCollectionsWriteMessage({
                requester: alice,
                target: alice,
            })

            const dwnConfig: DWNConfig = { messageStore }
            const dwn = await DWN.create(dwnConfig)

            const reply = await dwn.processMessage(messageData.message)

            expect(reply.status.code).to.equal(202)
        })

        it('should process CollectionsQuery message', async () => {
            const { requester, message } = await TestDataGenerator.generateCollectionsQueryMessage()
            const generatedDidMethod = DID.getMethodName(requester.did)

            // setting up a stub method resolver
            const didResolutionResult = TestDataGenerator.createDidResolutionResult(requester)
            const resolveStub = sinon.stub<[string], Promise<DIDResolutionResult>>()
            resolveStub.withArgs(requester.did).resolves(didResolutionResult)

            const methodResolverStub = {
                method: () => {
                    return generatedDidMethod
                },
                resolve: resolveStub,
            } as DIDMethodResolver

            const dwnConfig: DWNConfig = {
                didMethodResolvers: [methodResolverStub],
                messageStore,
            }
            const dwn = await DWN.create(dwnConfig)

            const reply = await dwn.processMessage(message)

            expect(reply.status.code).to.equal(200)
            expect(reply.entries).to.be.empty
        })
    })
})
