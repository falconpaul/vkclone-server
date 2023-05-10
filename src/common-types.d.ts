type QueryParams = Record<string, string | string[]>

type HttpMethod = 'get' | 'post' | 'put' | 'delete'

type HttpRequestContext = {
    params: QueryParams,
    headers: Record<string, string>,
    method: HttpMethod,
    req: http.IncomingMessage
}

type HttpResponse = {
    status: number,
    headers: Record<string, string>,
    body: unknown
}

type Handler = (req: HttpRequestContext) => Promise<HttpResponse>

type Endpoint = Record<HttpMethod, Handler>
