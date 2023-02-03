import crypto from 'crypto'

export const hashMd5 = (inputUrl: string): string => (
  crypto.createHash('md5').update(inputUrl).digest("hex")
)
