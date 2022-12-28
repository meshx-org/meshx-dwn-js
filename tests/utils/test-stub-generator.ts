import sinon from 'sinon';
import { DIDResolutionResult, DIDResolver } from '../../src/did/did-resolver.js';
import { Persona, TestDataGenerator } from './test-data-generator.js';

/**
 * Utility class for generating stub for testing.
 */
export class TestStubGenerator {
    /**
   * Creates a {DidResolver} stub for testing.
   */
    public static createDidResolverStub(persona: Persona): DIDResolver {

        // setting up a stub did resolver & message store
        const didResolutionResult = TestDataGenerator.createDidResolutionResult(persona);
        const resolveStub = sinon.stub<[string], Promise<DIDResolutionResult>>();
        resolveStub.withArgs(persona.did).resolves(didResolutionResult);
        const didResolverStub = sinon.createStubInstance(DIDResolver, { resolve: resolveStub });

        return didResolverStub;
    }
}
