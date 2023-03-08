import { ClientMediaType } from "../Helpers/ClientMedia/ClientMedia";
import { isClientMediaType } from "../Helpers/ClientMedia/ClientMediaFunctions";
import { EncodingType, isEncodingType } from "../Plugin/Encode/Encoding/Encoding";
import { SlashChar } from "../Setup/Constants";

export const mediaTypeFromMime = (mime?: string): ClientMediaType | undefined => {
  if (!mime) return 

  const [first] = mime.split(SlashChar)
  if (isClientMediaType(first)) return first
}