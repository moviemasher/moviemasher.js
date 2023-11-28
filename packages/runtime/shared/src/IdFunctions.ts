import { DASH, TEMPORARY } from './Constants.js'

const Counts = new Map<string, number> ()

export const idReset = () => Counts.clear()

export const idGenerateString = (): string => {
  return [
    TEMPORARY, Date.now().toString(36), Math.random().toString(36).slice(2)
  ].join(DASH)
}

export const idGenerate = (prefix: string): string => {
  const count = Counts.get(prefix) || 0
  Counts.set(prefix, count + 1)
  return [prefix, String(count)].join(DASH)
}

export const idTemporary = () => idGenerate(TEMPORARY)

export const idIsTemporary = (id: string) => id.startsWith(TEMPORARY)
