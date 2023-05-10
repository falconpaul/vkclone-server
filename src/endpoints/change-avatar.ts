import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { userService } from "@services/user-service"

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
            let url: string | null
            if (payload.url === null) {
                url = null
            } else if (typeof payload.url === 'string') {
                url = payload.url
            } else {
                throw badRequest('Некорректно указана ссылка')
            }
            userService.changeAvatar(tokenData.id, url)
            return 'ok'
        })
} as Endpoint
