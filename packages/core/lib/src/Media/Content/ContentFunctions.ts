import /* type */ { Content, ContentDefinition } from "./Content"

import { isContentingType } from "../../Setup/Enums"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { isTweenable, isTweenableDefinition } from "../../Mixin/Tweenable/TweenableFunctions"

export const isContent = (value?: any): value is Content => {
  return isTweenable(value) && isContentingType(value.type)
}
export function assertContent(value?: any, name?: string): asserts value is Content {
  if (!isContent(value))
    errorThrow(value, 'Content', name)
}
export const isContentDefinition = (value?: any): value is ContentDefinition => {
  return isTweenableDefinition(value) && isContentingType(value.type)
}
