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
            await userService.unsubscribe(tokenData.id, payload.id as number)
            return 'ok'
        })
} as Endpoint
