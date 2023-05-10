import { TokenPayload, userService } from "@services/user-service"
import { File } from "multiparty"
import { HttpError, serverError } from "./errors"
import { getBodyBuffer, getMultipartDataBody } from "./utils"

export type ResponseData = {
    status: number,
    headers: Record<string, string>,
    body: unknown
}

type ExtendedHttpRequestContext = HttpRequestContext & {
    payload?: Record<string, unknown>,
    tokenData?: TokenPayload,
    fields?: Record<string, unknown>,
    files?: Record<string, File[]>
}

export const createHandler = () => {
    let requestTransformer: (request: HttpRequestContext) => Promise<ExtendedHttpRequestContext> = async (r) => r
    let responseTransformer: (response: ResponseData, data: unknown) => Promise<HttpResponse>

    const builder = {
        withJsonRequest() {
            const topTransformer = requestTransformer
            requestTransformer = async (request) => {
                if (request.method === 'post' || request.method === 'put') {
                    return Object.assign(await topTransformer(request), {
                        payload: JSON.parse((await getBodyBuffer(request.req)).toString() || '{}')
                    })
                }
                return await topTransformer(request)
            }
            return builder
        },
        withMulipartDataRequest() {
            const topTransformer = requestTransformer
            requestTransformer = async (request) => {
                const { fields, files } = await getMultipartDataBody(request.req)
                return Object.assign(await topTransformer(request), {
                    fields,
                    files
                })
            }
            return builder
        },
        withAuth() {
            const topTransformer = requestTransformer
            requestTransformer = async (request) => {
                return Object.assign(await topTransformer(request), {
                    tokenData: userService.getTokenData(request.headers['access-token'])
                })
            }
            return builder
        },
        withJsonResponse() {
            responseTransformer = async (response, data) => {
                response.headers['Content-type'] = 'application/json'
                if (data instanceof Error) {
                    const error = data instanceof HttpError ? data : serverError(data.message)
                    return {
                        status: error.status,
                        headers: response.headers,
                        body: JSON.stringify({
                            status: 'error',
                            payload: data.message
                        })
                    }
                }
                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'ok',
                        payload: data
                    })
                }
            }
            return builder
        },
        getHandler(simpleHandler: (request: ExtendedHttpRequestContext, resp: ResponseData) => Promise<unknown>) {
            return async (request: HttpRequestContext) => {
                const baseResponse = {
                    status: 200,
                    headers: {},
                    body: ''
                } as ResponseData
                try {
                    const transformedRequest = await requestTransformer(request)
                    const data = await simpleHandler(transformedRequest, baseResponse)
                    const response = responseTransformer(baseResponse, data)
                    return response
                }
                catch (err) {
                    const response = responseTransformer(baseResponse, err)
                    return response
                }
            }
        }
    }
    return builder
}
