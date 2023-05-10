import { badRequest } from "@help/errors"
import { createHandler } from "@help/handler-builder"
import { CreatingPost, postService } from "@services/post-service"
import { validationService } from "@services/validation-service"

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
            validationService.validate(payload, {
                text: ['+', 'any', 'Сообщение не может быть пустым'],
                photo: ['-', 'any'],
            }, badRequest)
            payload.id_user = tokenData.id
            const id = await postService.createPost(payload as CreatingPost)
            const post = await postService.getPostById(id) as Record<string, unknown>
            post.likes = 0
            return post
        })
} as Endpoint
