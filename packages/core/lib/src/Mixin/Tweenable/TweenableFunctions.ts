import type {Tweenable, TweenableDefinition} from './Tweenable.js'
import {isMedia, isMediaInstance} from '../../Media/MediaFunctions.js'

export const isTweenableDefinition = (value?: any): value is TweenableDefinition => {
  return isMedia(value) 
}

export function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition {
  if (!isTweenableDefinition(value)) throw new Error('expected TweenableDefinition')
}

export const isTweenable = (value?: any): value is Tweenable => {
  return isMediaInstance(value) && isMedia(value.definition)
}
export function assertTweenable(value?: any): asserts value is Tweenable {
  if (!isTweenable(value)) throw new Error('expected Tweenable')
}