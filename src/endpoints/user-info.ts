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
            const user = await userService.getShortInfo(+params.id)
            if (!user) return null
            user.isSubscription = await userService.isSubscribed(tokenData.id, user.id as number)
            return user
        })
} as Endpoint
