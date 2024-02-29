import type { AssetFunction, AssetManager, ClientAsset, ClientClip, ClientInstance, Constrained, DataOrError, IntrinsicOptions, Rect, Scalar, ServerVisibleAsset, ServerVisibleInstance, ShapeAsset, ShapeAssetObject, ShapeInstance, ShapeInstanceObject, Size, SvgVector, VisibleAsset, VisibleInstance } from '../types.js'

import { ClientAssetClass } from '../base/client-asset.js'
import { ClientInstanceClass } from '../base/client-instance.js'
import { ServerAssetClass } from '../base/server-asset.js'
import { ServerInstanceClass } from '../base/server-instance.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../mixin/client-visible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/server-visible.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '../mixin/visible.js'
import { $CLIENT, $CONTAINER, $END, $HEIGHT, $IMAGE, $NUMBER, $PERCENT, $SHAPE, $STRING, $WIDTH, CURRENT_COLOR, DEFAULT_CONTAINER_ID, ERROR, MOVIE_MASHER, POINT_ZERO, SIZE_ZERO, SLASH, errorPromise, isAssetObject, namedError } from '../runtime.js'
import { isAboveZero } from '../utility/guard.js'
import { assertPopulatedString } from '../utility/guards.js'
import { centerPoint, containSize, sizeNotZero } from '../utility/rect.js'
import { svgOpacity, svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement } from '../utility/svg.js'

interface ClientShapeAsset extends ShapeAsset, ClientAsset {
  assetObject: ShapeAssetObject
}

interface ClientShapeInstance extends ShapeInstance, ClientInstance {
  clip: ClientClip
  asset: ClientShapeAsset
}

interface ServerShapeAsset extends ShapeAsset, ServerVisibleAsset {}

interface ServerShapeInstance extends ShapeInstance, ServerVisibleInstance {
  asset: ServerShapeAsset
}

export function ShapeAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ShapeAsset> {
  return class extends Base implements ShapeAsset {
    constructor(...args: any[]) {
      super(...args)
      this.properties.push(
        this.propertyInstance({ name: 'pathWidth', type: $NUMBER }),
        this.propertyInstance({ name: 'pathHeight', type: $NUMBER }),
        this.propertyInstance({ name: 'path', type: $STRING }),
      )
      this.hasIntrinsicSizing = sizeNotZero(this.pathSize)
    }

    override canBeContainer = true

    override hasIntrinsicSizing = true

    override isVector = true

    get pathSize(): Size {
      const size: Size = { ...SIZE_ZERO }
      const width = this.value('pathWidth')
      const height = this.value('pathHeight')
      if (isAboveZero(width)) size.width = width
      if (isAboveZero(height)) size.height = height
      return size
    }

    override type = $IMAGE
  }
}

export function ShapeInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ShapeInstance> {
  return class extends Base implements ShapeInstance {
    constructor(...args: any[]) {
      super(...args)
      this.properties.push(
        {
          targetId: $CONTAINER, name: $WIDTH, type: $PERCENT,
          min: 0, max: 2, step: 0.01,
          defaultValue: 1, tweens: true,
        }, {
          targetId: $CONTAINER, name: `${$WIDTH}${$END}`,
          type: $PERCENT, min: 0, max: 2, step: 0.01,
          undefinedAllowed: true, tweens: true,
        }, {
          targetId: $CONTAINER, name: $HEIGHT, type: $PERCENT,
          min: 0, max: 2, step: 0.01, tweens: true,
          defaultValue: 1,
        }, {
          targetId: $CONTAINER, name: `${$HEIGHT}${$END}`,
          type: $PERCENT, undefinedAllowed: true, tweens: true,
          min: 0, max: 2, step: 0.01,
        }
      )
    }

    declare asset: ShapeAsset

    override get intrinsicRect(): Rect {
      return { ...POINT_ZERO, ...this.asset.pathSize }
    }

    override intrinsicsKnown(_: IntrinsicOptions): boolean { return true }

    override svgVector(rect: Rect, forecolor = '', opacity?: Scalar): SvgVector {
      const { intrinsicRect } = this
      if (!sizeNotZero(intrinsicRect)) {
        return svgOpacity(svgPolygonElement(rect, '', forecolor), opacity)
      }
      const { asset } = this
      const path  = asset.value('path')
      assertPopulatedString(path)
      
      const vector = svgPathElement(path, forecolor)
      svgSetTransformRects(vector, intrinsicRect, rect)
      return svgOpacity(vector, opacity)
    }
  }
}

export class ClientShapeAssetClass extends ShapeAssetMixin(
  ClientVisibleAssetMixin(VisibleAssetMixin(ClientAssetClass))
) implements ClientShapeAsset {
  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    if (this.id === DEFAULT_CONTAINER_ID) {
      const data = svgSvgElement(size, svgPolygonElement(size, '', CURRENT_COLOR)) 
      return Promise.resolve({ data })
    }
    const path = this.string('path')
    const { pathSize } = this
    if (!sizeNotZero(pathSize)) return errorPromise(ERROR.Unavailable)
    
    const coverSize = containSize(pathSize, size)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const element = svgPathElement(path)
    svgSetTransformRects(element, pathSize, outRect)
    return Promise.resolve({ data: svgSvgElement(size, element) })
  }

  override instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ClientShapeInstanceClass(args)
  }

  private static _defaultAsset?: ClientShapeAsset
  static defaultAsset(assetManager: AssetManager): ClientShapeAsset {
    return this._defaultAsset ||= new ClientShapeAssetClass({ 
      id: DEFAULT_CONTAINER_ID, type: $IMAGE, 
      source: $SHAPE, label: 'Rectangle', assetManager
    })
  }
}

export class ClientShapeInstanceClass extends ShapeInstanceMixin(
   ClientVisibleInstanceMixin(VisibleInstanceMixin(ClientInstanceClass))
) implements ClientShapeInstance {
  declare asset: ClientShapeAsset
}

export class ServerShapeAssetClass extends ShapeAssetMixin(
  ServerVisibleAssetMixin(VisibleAssetMixin(ServerAssetClass))
) implements ServerShapeAsset {
  override instanceFromObject(object?: ShapeInstanceObject): ServerShapeInstance {
    return new ServerShapeInstanceClass(this.instanceArgs(object))
  }

  private static _defaultAsset?: ServerShapeAsset
  static defaultAsset(assetManager: AssetManager): ServerShapeAsset {
    return this._defaultAsset ||= new ServerShapeAssetClass({ 
      id: DEFAULT_CONTAINER_ID, type: $IMAGE, 
      source: $SHAPE, label: 'Rectangle', assetManager
    })
  }
}

export class ServerShapeInstanceClass extends ShapeInstanceMixin(
  ServerVisibleInstanceMixin(VisibleInstanceMixin(ServerInstanceClass))
) implements ServerShapeInstance { 
  declare asset: ServerShapeAsset
}

export const imageShapeAssetFunction: AssetFunction = object => {
  if (!isAssetObject(object, $IMAGE, $SHAPE)) {
    return namedError(ERROR.Syntax, [$IMAGE, $SHAPE].join(SLASH))
  }
  const { context } = MOVIE_MASHER
  const shapeClass = context === $CLIENT ? ClientShapeAssetClass : ServerShapeAssetClass
  const { id, assetManager } = object
  const isDefault = id === DEFAULT_CONTAINER_ID
  if (isDefault) return { data: shapeClass.defaultAsset(assetManager) }

  return { data: new shapeClass(object) }
}

