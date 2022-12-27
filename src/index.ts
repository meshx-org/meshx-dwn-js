/* eslint-disable max-len */

/**
 * exports everything that we want to be consumable
 */

// yep, it's weird that we're exporting '.js' files when they're really
// '.ts' files. Long story. If you're interested as to why, check out:
//   - https://stackoverflow.com/questions/44979976/typescript-compiler-is-forgetting-to-add-file-extensions-to-es6-module-imports
//   - https://github.com/microsoft/TypeScript/issues/40878
//
export type { CollectionsQueryMessage, CollectionsWriteMessage } from './interfaces/collections/types.js'
export type { HooksWriteMessage } from './interfaces/hooks/types.js'
export type {
    ProtocolDefinition,
    ProtocolRuleSet,
    ProtocolsConfigureMessage,
    ProtocolsQueryMessage,
} from './interfaces/protocols/types.js'
export type {
    DWNServiceEndpoint as DwnServiceEndpoint,
    ServiceEndpoint,
    DIDDocument as DidDocument,
    DIDResolutionResult as DidResolutionResult,
    DIDResolutionMetadata as DidResolutionMetadata,
    DIDDocumentMetadata as DidDocumentMetadata,
    VerificationMethod,
} from './did/did-resolver.js'
export { CollectionsQuery, CollectionsQueryOptions } from './interfaces/collections/messages/collections-query.js'
export { CollectionsWrite, CollectionsWriteOptions } from './interfaces/collections/messages/collections-write.js'
export { DateSort } from './interfaces/collections/messages/collections-query.js'
export { DidKeyResolver } from './did/did-key-resolver.js'
export { DidIonResolver } from './did/did-ion-resolver.js'
export { DIDResolver as DidResolver } from './did/did-resolver.js'
export { DWN as Dwn } from './dwn.js'
export { Encoder } from './utils/encoder.js'
export { HooksWrite, HooksWriteOptions } from './interfaces/hooks/messages/hooks-write.js'
export { PrivateJwk, PublicJwk } from './jose/types.js'
export { ProtocolsConfigure, ProtocolsConfigureOptions } from './interfaces/protocols/messages/protocols-configure.js'
export { ProtocolsQuery, ProtocolsQueryOptions } from './interfaces/protocols/messages/protocols-query.js'
export { Response } from './core/response.js'
