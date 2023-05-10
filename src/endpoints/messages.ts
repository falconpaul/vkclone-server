import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { messageService } from "@services/message-service"
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
                user: ['+', 'number', 'ID партнёра указан некорректно']
            }, badRequest)
            const idPartner = +(params.user as string)
            return await messageService.getChatingHistory(tokenData.id, idPartner)
        }),
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
                text: ['+', 'any', 'Текст не может быть пустым'],
                idUserTo: ['+', 'number', 'ID пользователя указан неправильно']
            }, badRequest)
            const id = await messageService.createMessage({
                id_user_from: tokenData.id,
                id_user_to: +(payload.idUserTo as string),
                text: payload.text as string
            })
            return Object.assign(
                await messageService.getMessageById(id) as object,
                { ownMessage: 1 }
            )
        })
} as Endpoint
