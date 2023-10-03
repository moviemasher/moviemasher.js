import type { Constrained, IntrinsicOptions, Rect, TextAsset, TextInstance, TextInstanceObject, UnknownRecord, VisibleInstance } from '@moviemasher/runtime-shared'

import { END, CONTAINER } from '@moviemasher/runtime-shared'
import { DataTypePercent, DataTypeString } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { isRect } from '../../Utility/RectFunctions.js'


export function TextInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<TextInstance> {
  return class extends Base implements TextInstance {
    constructor(...args: any[]) {
      const [object] = args
      object.lock ||= ''
      super(object)

      const { intrinsic } = object as TextInstanceObject
      if (isRect(intrinsic)) this.intrinsic = intrinsic
    }

    declare asset: TextAsset

    hasIntrinsicSizing = true

    override initializeProperties(object: TextInstanceObject): void {
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: 'string', type: DataTypeString,
        defaultValue: this.asset.string,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: 'height', type: DataTypePercent,
        min: 0, max: 2, step: 0.01, defaultValue: 0.3, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: `height${END}`,
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: 'width', type: DataTypePercent,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 0.8,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTAINER, name: `width${END}`,
        min: 0, max: 1, step: 0.01,
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }

    intrinsic?: Rect

    intrinsicRect(_ = false): Rect { return this.intrinsic! }


    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const { size } = options
      if (!size || isRect(this.intrinsic) || this.asset.family) {
        // console.log(this.constructor.name, 'intrinsicsKnown', this.intrinsic, this.asset.family)
        return true
      }
      return false
    }

    declare string: string

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      json.intrinsic = this.intrinsicRect(true)
      return json
    }

  }
}
