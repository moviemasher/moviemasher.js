import type { ClientMediaType } from '../Helpers/ClientMedia/ClientMedia.js'
import { isClientMediaType } from '../Helpers/ClientMedia/ClientMediaFunctions.js'
import { SlashChar } from '../Setup/Constants.js'

export const mediaTypeFromMime = (mime?: string): ClientMediaType | undefined => {
  if (!mime) return 

  const [first] = mime.split(SlashChar)
  if (isClientMediaType(first)) return first
}
