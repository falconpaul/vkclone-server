import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { messageService } from "@services/message-service"

export default {
    get: createHandler()
        .withAuth()
        .withJsonResponse()
        .getHandler(async ({ tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            return await messageService.getChatsByUser(tokenData.id)
        })
} as Endpoint
