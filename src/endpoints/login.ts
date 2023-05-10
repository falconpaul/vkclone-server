import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { userService } from "@services/user-service"
import { validationService } from "@services/validation-service"

export default {
    post: createHandler()
        .withJsonRequest()
        .withJsonResponse()
        .getHandler(async ({ payload }) => {
            if (!payload) return
            const { login, password } = validationService.validate(payload, {
                login: ['+', 'login', 'Логин введён неправильно'],
                password: ['+', 'password', 'Пароль введён неправильно'],
            }, badRequest)
            return await userService.getToken(login as string, password as string)
        })
} as Endpoint
