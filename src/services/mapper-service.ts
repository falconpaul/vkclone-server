export const mapperService = {
    mapBy: <T> (list: T[], key: keyof T) => {
        const o: Record<string, T> = {}
        for (const item of list) {
            o[item[key] as unknown as string] = item
        }
        return o
    },
    groupBy: <T> (list: T[], key: keyof T) => {
        const o: Record<string, T[]> = {}
        for (const item of list) {
            const k = item[key] as unknown as string
            if (!o[k]) {
                o[k] = []
            }
            o[k].push(item)
        }
        return o
    }
}
