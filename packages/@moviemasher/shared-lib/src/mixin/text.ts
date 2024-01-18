import type { Constrained, EndpointRequest, InstanceArgs, IntrinsicOptions, RawAsset, Rect, SvgVector, TextAsset, TextAssetObject, TextInstance, TextInstanceObject, UnknownRecord, VisibleAsset, VisibleInstance } from '../types.js'

import { ASSET_TARGET, CONTAINER, END, HEIGHT, IMAGE, MAINTAIN, PERCENT, STRING, TEXT, TEXT_HEIGHT, WIDTH, isUndefined } from '../runtime.js'
import { isRect } from '../utility/guards.js'
import { rectTransformAttribute } from '../utility/rect.js'
import { svgText } from '../utility/svg.js'


export function TextAssetMixin<T extends Constrained<RawAsset & VisibleAsset>>(Base: T):
  T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
    override canBeContainer = true

    protected _family = ''
    get family(): string { return this._family }
    set family(value: string) { this._family = value }

    override initializeProperties(object: TextAssetObject): void {
      const { label } = object

      this.properties.push(this.propertyInstance({
        targetId: ASSET_TARGET, name: STRING, type: STRING,
        defaultValue: label,
      }))
      super.initializeProperties(object)
    }

    override instanceArgs(object?: TextInstanceObject): TextInstanceObject & InstanceArgs {
      const textObject = object || {}
      if (isUndefined(textObject.lock)) textObject.lock = WIDTH
      if (isUndefined(textObject.sizeAspect)) textObject.sizeAspect = MAINTAIN
      if (isUndefined(textObject.pointAspect)) textObject.pointAspect = MAINTAIN
      return super.instanceArgs(textObject)
    }

    isVector = true

    declare request: EndpointRequest

    declare string: string

    type = IMAGE
  }
}

export function TextInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<TextInstance> {
  return class extends Base implements TextInstance {
    declare asset: TextAsset

    hasIntrinsicSizing = true

    override initializeProperties(object: TextInstanceObject): void {
      const { intrinsic } = object
      if (isRect(intrinsic)) this.intrinsic = intrinsic

      object.lock ||= ''

      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: STRING, type: STRING,
        defaultValue: this.asset.string,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: HEIGHT, type: PERCENT,
        min: 0, max: 2, step: 0.01, defaultValue: 0.3, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: `${HEIGHT}${END}`,
        type: PERCENT, undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: WIDTH, type: PERCENT,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 0.8,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: `${WIDTH}${END}`,
        min: 0, max: 1, step: 0.01,
        type: PERCENT, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }

    override get instanceObject(): TextInstanceObject {
      const { intrinsic } = this
      return { ...super.instanceObject, intrinsic }
    }

    intrinsic?: Rect

    override get intrinsicRect(): Rect { return this.intrinsic! }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      const { size } = options
      if (!size) return true
      
      return isRect(this.intrinsic) || !!this.asset.family
    }

    override pathElement(rect: Rect, forecolor?: string): SvgVector {
      const { string, asset } = this
      const { family } = asset    
      const transform = rectTransformAttribute(this.intrinsicRect, rect)
      return svgText(string, forecolor, TEXT_HEIGHT, family, transform)
    }

    declare string: string

    toJSON(): UnknownRecord {
      console.debug(this.constructor.name, 'toJSON')
      const json = super.toJSON()
      json.intrinsic = this.intrinsicRect
      return json
    }
  }
}