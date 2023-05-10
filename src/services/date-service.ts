export const dateService = {
    convertForDb(humanDate: string) {
        const [d, m, y] = humanDate.split('.')
        return `${y}-${m}-${d}`
    }
}