
let createIdCounter = 0
const createId = () : string => {
  createIdCounter += 1
  return `id-${createIdCounter}`
}

export { createId }
