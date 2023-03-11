import { ClassDisabled } from "@moviemasher/moviemasher.js"

export const className = (condition: boolean, className = '', addClass = ClassDisabled) => {
  if (!condition) return className
  
  if (! className) return addClass

  return `${className} ${addClass}`
}

