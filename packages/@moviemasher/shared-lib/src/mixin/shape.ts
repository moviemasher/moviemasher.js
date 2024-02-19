import type { Constrained, IntrinsicOptions, Rect, Scalar, ShapeAsset, ShapeAssetObject, ShapeInstance, ShapeInstanceObject, Size, SvgItem, SvgVector, UnknownRecord, VisibleAsset, VisibleInstance } from '../types.js'

import { $CONTAINER, $END, $HEIGHT, $IMAGE, $PERCENT, POINT_ZERO, $WIDTH } from '../runtime.js'
import { isAboveZero } from '../utility/guard.js'
import { sizeNotZero, sizeSvgD } from '../utility/rect.js'
import { svgOpacity, svgPathElement, svgPolygonElement, svgSetTransformRects } from '../utility/svg.js'

export function ShapeAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ShapeAsset> {
  return class extends Base implements ShapeAsset {
    override get assetObject(): ShapeAssetObject {
      const { path, pathHeight, pathWidth } = this
      return { ...super.assetObject, path, pathHeight, pathWidth }
    }

    canBeContainer = true

    container = true

    override initializeProperties(object: ShapeAssetObject) {
      const { path, pathHeight, pathWidth } = object as ShapeAssetObject
      this.pathWidth = isAboveZero(pathWidth) ? pathWidth : 100
      this.pathHeight = isAboveZero(pathHeight) ? pathHeight : 100
      this.path = path || sizeSvgD(this.pathSize)
      super.initializeProperties(object)
    }
    
    override hasIntrinsicSizing = true

    isVector = true

    declare path: string

    declare pathHeight: number

    declare pathWidth: number

    get pathSize(): Size {
      return { width: this.pathWidth, height: this.pathHeight }
    }

    toJSON(): UnknownRecord {
      console.debug(this.constructor.name, 'toJSON')
      const object = super.toJSON()
      if (this.path) object.path = this.path
      if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
      if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
      return object
    }

    type = $IMAGE
  }
}

export function ShapeInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ShapeInstance> {
  return class extends Base implements ShapeInstance {
    declare asset: ShapeAsset

  
    override initializeProperties(object: ShapeInstanceObject) {
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: $WIDTH, type: $PERCENT,
        min: 0, max: 2, step: 0.01,
        defaultValue: 1, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: `${$WIDTH}${$END}`,
        type: $PERCENT, min: 0, max: 2, step: 0.01,
        undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: $HEIGHT, type: $PERCENT,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 1,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: `${$HEIGHT}${$END}`,
        type: $PERCENT, undefinedAllowed: true, tweens: true,
        min: 0, max: 2, step: 0.01,
      }))
      super.initializeProperties(object)
    }

    override get intrinsicRect(): Rect {
      const { pathHeight: height, pathWidth: width } = this.asset
      // console.log(this.constructor.name, 'intrinsicRect', this.assetId)
      return { width, height, ...POINT_ZERO }
    }

    override intrinsicsKnown(_: IntrinsicOptions): boolean { return true }

    override svgVector(rect: Rect, forecolor = '', opacity?: Scalar): SvgVector {
      const { intrinsicRect } = this
      if (!sizeNotZero(intrinsicRect)) {
        return svgOpacity(svgPolygonElement(rect, '', forecolor), opacity)
      }
      const { asset } = this
      const { path } = asset
      const vector = svgPathElement(path, forecolor)
      svgSetTransformRects(vector, intrinsicRect, rect)
      return svgOpacity(vector, opacity)
    }
  }
}

