import { DASH } from '../Setup/Constants.js'
import { assertNumber } from '../Shared/SharedGuards.js'
import { IdTemporaryPrefix } from './IdConstants.js'

const IdCountsByPrefix = new Map<string, number> ()

export const idReset = () => IdCountsByPrefix.clear()

export const idGenerateString = (): string => {
  const components = [IdTemporaryPrefix]
  components.push(Date.now().toString(36))
  components.push(Math.random().toString(36).slice(2))
  return components.join(DASH)
}

export const idGenerate = (prefix: string): string => {
  const components:string[] = []
  components.push(prefix)
  if (!IdCountsByPrefix.has(prefix)) {
    IdCountsByPrefix.set(prefix, 0)
  }
  const count = IdCountsByPrefix.get(prefix)
  assertNumber(count)

  components.push(String(count))
  IdCountsByPrefix.set(prefix, count + 1)
  return components.join(DASH)
}

export const idTemporary = () => idGenerate(IdTemporaryPrefix)

export const idIsTemporary = (id: string) => id.startsWith(IdTemporaryPrefix)
