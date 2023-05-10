import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { userService } from "@services/user-service"

export default {
    get: createHandler()
        .withAuth()
        .withJsonResponse()
        .getHandler(async ({ tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            return await userService.getShortInfo(tokenData.id)
        })
} as Endpoint
