import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { postService } from "@services/post-service"
import { validationService } from "@services/validation-service"

export default {
    get: createHandler()
        .withAuth()
        .withJsonResponse()
        .getHandler(async ({ params, tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            validationService.validate(params, {
                idFrom: ['-', 'number', 'ID поста должен быть числом']
            }, badRequest)
            let idFrom
            if (params.idFrom) {
                idFrom = +params.idFrom
            }
            return await postService.getPostsForUser(tokenData.id, idFrom)
        })
} as Endpoint
