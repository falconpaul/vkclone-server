import { basePathUrl } from "env"
import { rename } from "fs/promises"
import path from "path"

export const fileService = {
    getFileName: (src: string) => {
        return path.basename(src)
    },
    moveFileToUploads: async (src: string) => {
        const fileName = fileService.getFileName(src)
        const uploadPath = path.join(__dirname, '..', '..', 'files', 'uploads', fileName)
        await rename(src, uploadPath)
        return `${basePathUrl}files/uploads/${fileName}`
    }
}
