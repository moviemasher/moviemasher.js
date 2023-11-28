export const jsonParse = <T = any>(json: string): T => JSON.parse(json)

export const jsonStringify = (value: any): string => JSON.stringify(value, null, 2)
