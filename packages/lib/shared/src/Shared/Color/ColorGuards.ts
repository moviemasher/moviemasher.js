import type { ColorInstance } from '@moviemasher/runtime-shared'


import {isContentInstance} from '../../Helpers/Content/ContentGuards.js'

export const isColorInstance = (value: any): value is ColorInstance => {
  return isContentInstance(value) && 'color' in value
}
