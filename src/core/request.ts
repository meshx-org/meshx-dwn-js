import { RequestSchema } from './types.js'
import { validateZodSchema } from '../validator.js'
import { request } from '../models/request.js'

export class Request {
    /**
     * parses the provided payload into a `RequestSchema`.
     */
    static parse(requestObj: object): RequestSchema {
        // throws an error if validation fails
        validateZodSchema(request, requestObj)

        return requestObj as RequestSchema
    }
}
