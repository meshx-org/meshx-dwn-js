import type { BaseMessage } from '../core/types.js'
import type { MessageReply } from '../core/message-reply.js'
import type { MessageStore } from '../store/types.js'

import { DIDResolver } from '../did/did-resolver.js'

export type MethodHandler = (
    message: BaseMessage,
    messageStore: MessageStore,
    didResolver: DIDResolver
) => Promise<MessageReply>

export interface Interface {
    methodHandlers: MethodHandler[]
    schemas: { [key: string]: object }
}
