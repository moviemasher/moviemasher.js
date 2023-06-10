import type { ColorInstance } from './ColorTypes.js'


import {isContentInstance} from '../../Helpers/Content/ContentFunctions.js'

export const isColorInstance = (value: any): value is ColorInstance => {
  return isContentInstance(value) && 'color' in value
}
