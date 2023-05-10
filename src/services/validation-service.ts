const ruleTesters = {
    login: (value: unknown) => typeof value === 'string' && /^[a-z][a-z0-9_-]+$/i.test(value),
    name: (value: unknown) => typeof value === 'string' && /^[А-ЯЁA-Z][а-яёa-z]+$/.test(value),
    surname: (value: unknown) => typeof value === 'string' && /^[А-ЯЁA-Z][а-яёa-z-]+$/.test(value),
    bdate: (value: unknown) => {
        if (typeof value !== 'string') return false
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return false
        const [d, m, y] = value.split('.').map(x => +x)
        let maxDay
        if (m === 2) {
            maxDay = y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 29 : 28
        } else {
            maxDay = [4, 6, 9, 11].includes(m) ? 30 : 31
        }
        return d >= 1 && d <= maxDay && m >= 1 && m <= 12 && y >= 1900 && y < new Date().getFullYear()
    },
    password: (value: unknown) => typeof value === 'string' && value.length >= 6,
    boolean: (value: unknown) => typeof value === 'boolean',
    any: (value: unknown) => true,
    number: (value: unknown) => typeof value === 'number' || typeof value === 'string' && /^[0-9]+$/.test(value),
    numList: (value: unknown) => typeof value === 'string' && /^[0-9]+(,[0-9]+)*$/.test(value)
}

type Rule = [
    required: '+' | '-',
    type: keyof typeof ruleTesters,
    message?: string,
    mappedName?: string
]
export const validationService = {
    validate: (payload: Record<string, unknown>, rules: Record<string, Rule>, errorCreator: (message?: string) => Error) => {
        const res: Record<string, unknown> = {}
        
        for (const [field, [required, type, message, mappedName]] of Object.entries(rules)) {
            const value = payload[field]
            if (required === '+' && !value) {
                throw errorCreator(message)
            }
            if (required === '-' && !value || ruleTesters[type](value)) {
                res[mappedName || field] = value
            }
            else {
                throw errorCreator(message)
            }
        }
        return res
    }
}
