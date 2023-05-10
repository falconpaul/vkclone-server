import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { postService } from "@services/post-service"
import { validationService } from "@services/validation-service"

export default {
    delete: createHandler()
        .withAuth()
        .withJsonResponse()
        .getHandler(async ({ params, tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            validationService.validate(params, {
                id: ['+', 'number', 'ID поста должно быть числом']
            }, badRequest)
            await postService.deletePost(tokenData.id, +params.id)
            return 'ok'
        })
} as Endpoint
