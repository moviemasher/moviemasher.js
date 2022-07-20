// import { generateUUIDv4 } from "@bitjourney/uuid-v4"
let idUniqueCounter = 0
export const idUnique = () => {
  return `idUnique-${idUniqueCounter++}` //generateUUIDv4()
}