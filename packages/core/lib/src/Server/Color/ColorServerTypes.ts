import type { Time, TimeRange } from '@moviemasher/runtime-shared'

import type { ColorTuple } from '../../Base/Code.js'
import type { ColorAsset } from '../../Shared/Color/ColorTypes.js'
import { isColorInstance } from '../../Shared/Color/ColorFunctions.js'

export interface ColorServerInstance extends ColorAsset {
  contentColors(time: Time, range: TimeRange): ColorTuple
}

export const isColorServerInstance = (value: any): value is ColorServerInstance => (
  isColorInstance(value) && 'contentColors' in value
)
