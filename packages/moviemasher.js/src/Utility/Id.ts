
// eslint-disable-next-line prefer-const
let idPrefix = ''

const idGenerate = (): string => {
  const components:string[] = []
  if (idPrefix) components.push(idPrefix)

  components.push(Date.now().toString(36))
  components.push(Math.random().toString(36).slice(2))
  return components.join('-')
}

const idPrefixSet = (prefix: string): void => { idPrefix = prefix }

/**
 * @category Utility
 */
const Id = {
  generate: idGenerate,
  prefix: idPrefix,
  prefixSet: idPrefixSet
}

export { Id, idGenerate, idPrefix, idPrefixSet }
