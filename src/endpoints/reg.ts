import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { dateService } from "@services/date-service"
import { UserCreationData, userService } from "@services/user-service"
import { validationService } from "@services/validation-service"

export default {
    post: createHandler()
        .withJsonRequest()
        .withJsonResponse()
        .getHandler(async ({ payload }) => {
            if (!payload) return
            const regData = validationService.validate(payload, {
                login: ['+', 'login', 'Логин введён неправильно'],
                name: ['+', 'name', 'Имя введено неправильно'],
                surname: ['+', 'surname', 'Фамилия введена неправильно'],
                patronymic: ['-', 'name', 'Отчество введено неправильно'],
                bdate: ['+', 'bdate', 'Дата рождения введена неправильно'],
                city: ['-', 'any'],
                university: ['-', 'any'],
                avatar: ['-', 'any'],
                password: ['+', 'password', 'Пароль должен содержать не менее 6 символов'],
            }, badRequest) as UserCreationData
            regData.bdate = dateService.convertForDb(regData.bdate)
            return await userService.reg(regData)
        })
} as Endpoint
