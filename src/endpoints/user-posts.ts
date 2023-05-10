import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { postService } from "@services/post-service"

export default {
    get: createHandler()
        .withAuth()
        .withJsonResponse()
        .getHandler(async ({ params, tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            return await postService.getPostsByUser(+params.id)
        })
} as Endpoint
