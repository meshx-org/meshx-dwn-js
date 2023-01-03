import { collectionsWrite } from './collections/collections-write.js'
import { collectionsQuery } from './collections/collections-query.js'

import { protocolsConfigure } from './protocols/protocols-configure.js'
import { protocolsQuery } from './protocols/protocols-query.js'

import { permissionsGrant } from './permissions/permissions-grant.js'
import { permissionsRequest } from './permissions/permissions-request.js'

export const methodSchema = {
    CollectionsWrite: collectionsWrite,
    CollectionsQuery: collectionsQuery,
    // HooksWrite = 'HooksWrite',
    ProtocolsConfigure: protocolsConfigure,
    ProtocolsQuery: protocolsQuery,

    PermissionsGrant: permissionsGrant,
    PermissionsRequest: permissionsRequest,
}