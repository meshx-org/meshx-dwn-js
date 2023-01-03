/* eslint-disable max-len */
/** Export everything that we want to be consumable */

export type { CollectionsQueryMessage, CollectionsWriteMessage } from './interfaces/collections/types.js'
export type { HooksWriteMessage } from './interfaces/hooks/types.js'
export type {
    ProtocolDefinition,
    ProtocolRuleSet,
    ProtocolsConfigureMessage,
    ProtocolsQueryMessage,
} from './interfaces/protocols/types.js'

export { DateSort } from './interfaces/collections/messages/collections-query.js'
export { PrivateJwk, PublicJwk } from './jose/types.js'

export { DWN } from './dwn.js'

export { CollectionsQuery, CollectionsQueryOptions } from './interfaces/collections/messages/collections-query.js'
export { CollectionsWrite, CollectionsWriteOptions } from './interfaces/collections/messages/collections-write.js'
export { HooksWrite, HooksWriteOptions } from './interfaces/hooks/messages/hooks-write.js'
export { ProtocolsConfigure, ProtocolsConfigureOptions } from './interfaces/protocols/messages/protocols-configure.js'
export { ProtocolsQuery, ProtocolsQueryOptions } from './interfaces/protocols/messages/protocols-query.js'

export type {
    DWNServiceEndpoint,
    Service,
    VerificationMethod,
    DIDDocument,
    DIDResolutionResult,
    DIDResolutionMetadata,
    DIDDocumentMetadata,
} from './did/types.js'
export { DIDKeyResolver } from './did/did-key-resolver.js'
export { DIDSidetreeResolver } from './did/did-sidetree-resolver.js'
export { DIDResolver } from './did/did-resolver.js'

export { Response } from './core/response.js'
export { Message } from './core/message.js'
export { MessageReply } from './core/message-reply.js'
export { Encoder } from './utils/encoder.js'
