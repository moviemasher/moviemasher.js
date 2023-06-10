import type { ShapeAssetObject } from './ShapeTypes.js'

import { SourceShape } from '@moviemasher/runtime-shared'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isAssetObject } from '../Asset/AssetGuards.js'

export const isShapeAssetObject = (value: any): value is ShapeAssetObject => (
  isAssetObject(value) && value.source === SourceShape
)

export function assertShapeAssetObject(value: any, name?: string): asserts value is ShapeAssetObject {
  if (!isShapeAssetObject(value)) errorThrow(value, 'ShapeAssetObject', name)
}
