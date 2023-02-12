import { NumberRecord } from "../declarations"

const IdTemporaryPrefix = 'temporary'
const IdCountsByPrefix: NumberRecord = {} 


export const idGenerateString = (): string => {
  const components = [IdTemporaryPrefix]

  components.push(Date.now().toString(36))
  components.push(Math.random().toString(36).slice(2))
  return components.join('-')
}

export const idGenerate = (prefix: string): string => {
  const components:string[] = []
  components.push(prefix)
  IdCountsByPrefix[prefix] ||= 0
  components.push(String(IdCountsByPrefix[prefix]++))
  return components.join('-')
}

export const idTemporary = () => idGenerate(IdTemporaryPrefix)

export const idIsTemporary = (id: string) => id.startsWith(IdTemporaryPrefix)
