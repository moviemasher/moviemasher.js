import crypto from 'crypto'

export const idUnique = () => {
  return crypto.randomUUID()
}