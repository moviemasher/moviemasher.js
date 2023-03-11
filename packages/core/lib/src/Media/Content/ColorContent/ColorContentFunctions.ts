import /* type */ { ColorContent } from "./ColorContent"

import { isContent } from "../ContentFunctions"

export const isColorContent = (value: any): value is ColorContent => {
  return isContent(value) && "color" in value
}
