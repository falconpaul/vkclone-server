import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { userService } from "@services/user-service"

export default {
    get: createHandler()
        .withAuth()
        .withJsonResponse()
        .getHandler(async ({ params, tokenData }) => {
            if (!tokenData) {
                throw badRequest('Нужно авторизоваться')
            }
            return await userService.findByName(tokenData.id, params.query as string)
        })
} as Endpoint
