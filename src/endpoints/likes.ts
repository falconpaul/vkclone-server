import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { postService } from "@services/post-service"
import { validationService } from "@services/validation-service"

export default {
    post: createHandler()
        .withAuth()
        .withJsonRequest()
        .withJsonResponse()
        .getHandler(async ({ payload, tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            if (!payload) return
            validationService.validate(payload, {
                idPost: ['+', 'number', 'ID поста указан неправильно'],
                action: ['+', 'any', 'Не указано действие']
            }, badRequest)
            if (payload.action === 'add') {
                await postService.addLike(tokenData.id, payload.idPost as number)
            } else if (payload.action === 'remove') {
                await postService.removeLike(tokenData.id, payload.idPost as number)
            } else {
                throw badRequest('Указано некорректное действие')
            }
            return 'ok'
        })
} as Endpoint
