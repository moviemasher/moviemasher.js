import { StringObject } from "@moviemasher/moviemasher.js"

export const labels: StringObject = {

}

export const label = (id: string, context?: string): string => {

  return labels[id] || id
}