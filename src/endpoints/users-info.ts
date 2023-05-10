import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { userService } from "@services/user-service"
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
                ids: ['+', 'numList', 'Список id введён некорректно']
            }, badRequest)
            const ids = (params.ids as string).split(',').map(x => +x)
            return await userService.getUsersByIds(ids)
        })
} as Endpoint
