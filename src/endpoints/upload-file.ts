import { createHandler } from "@help/handler-builder"
import { fileService } from "@services/file-service"

export default {
    post: createHandler()
        .withMulipartDataRequest()
        .withJsonResponse()
        .getHandler(async ({ files }) => {
            if (!files) return
            const downloadLink = await fileService.moveFileToUploads(files.file[0].path)
            return downloadLink
        })
} as Endpoint
