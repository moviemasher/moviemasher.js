import type { ColorContent } from './ColorContent.js'

import {isContent} from '../ContentFunctions.js'

export const isColorContent = (value: any): value is ColorContent => {
  return isContent(value) && 'color' in value
}
