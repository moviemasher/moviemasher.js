
// eslint-disable-next-line prefer-const
export let idPrefix = ''
export let idCount = 0

export const idCountReset = () => { idCount = 0 }

export const idGenerate = (): string => {
  const components:string[] = []
  if (idPrefix) components.push(idPrefix)
  idCount++
  components.push(String(idCount))
  // components.push(Date.now().toString(36))
  // components.push(Math.random().toString(36).slice(2))
  return components.join('-')
}

export const idPrefixSet = (prefix: string): void => { idPrefix = prefix }

/**
 * @category Utility
 */
export const Id = {
  generate: idGenerate,
  prefix: idPrefix,
  prefixSet: idPrefixSet
}
