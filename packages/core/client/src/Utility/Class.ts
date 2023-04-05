import { ClassDisabled } from '@moviemasher/lib-core'

export const className = (condition: boolean, className = '', addClass = ClassDisabled) => {
  if (!condition) return className
  
  if (! className) return addClass

  return `${className} ${addClass}`
}

