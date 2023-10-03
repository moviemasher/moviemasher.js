import type { ShapeAssetObject } from '@moviemasher/runtime-shared'

import { SHAPE } from '@moviemasher/runtime-shared'

import { errorThrow } from '@moviemasher/runtime-shared'
import { isAssetObject } from '@moviemasher/runtime-shared'

export const isShapeAssetObject = (value: any): value is ShapeAssetObject => (
  isAssetObject(value) && value.source === SHAPE
)

export function assertShapeAssetObject(value: any, name?: string): asserts value is ShapeAssetObject {
  if (!isShapeAssetObject(value)) errorThrow(value, 'ShapeAssetObject', name)
}
