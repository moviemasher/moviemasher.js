import type { Constrained, IntrinsicOptions, Rect, ShapeAsset, ShapeInstance, ShapeInstanceObject, VisibleInstance } from '@moviemasher/runtime-shared'

import { END, POINT_ZERO, CONTAINER } from '@moviemasher/runtime-shared'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'


export function ShapeInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ShapeInstance> {
  return class extends Base implements ShapeInstance {

    declare asset: ShapeAsset

    hasIntrinsicSizing = true

    override initializeProperties(object: ShapeInstanceObject) {
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: 'width', type: DataTypePercent,
        min: 0, max: 2, step: 0.01,
        defaultValue: 1, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: `width${END}`,
        type: DataTypePercent, min: 0, max: 2, step: 0.01,
        undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: 'height', type: DataTypePercent,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 1,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: `height${END}`,
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
        min: 0, max: 2, step: 0.01,
      }))
      super.initializeProperties(object)
    }
    intrinsicRect(_editing = false): Rect {
      const { pathHeight: height, pathWidth: width } = this.asset
      // console.log(this.constructor.name, 'intrinsicRect', this.assetId)
      return { width, height, ...POINT_ZERO }
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}
