import { propertiesAudible } from "./propertiesAudible"
import { urlsAudible } from "./urlsAudible"

export const audible = { 
  audible: { value: true },
  ...propertiesAudible,
  ...urlsAudible,
}