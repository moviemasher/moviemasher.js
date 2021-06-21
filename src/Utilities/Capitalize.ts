import { isPopulatedString } from "./Is"

export const Capitalize = (value : string) : string => {
  if (!isPopulatedString(value)) return value

  return `${value[0].toUpperCase()}${value.substr(1)}`
};
