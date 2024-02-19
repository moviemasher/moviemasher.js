import type { DataOrError, InstanceArgs, InstanceCacheArgs, ListenersFunction, ShapeAssetObject, ShapeInstance, ShapeInstanceObject, Size } from '@moviemasher/shared-lib/types.js'
import type { ClientShapeAsset, ClientShapeInstance } from '../../types.js'

import { ShapeAssetMixin, ShapeInstanceMixin } from '@moviemasher/shared-lib/mixin/shape.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $IMAGE, $SHAPE, DEFAULT_CONTAINER_ID, ERROR, errorPromise, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { containSize } from '@moviemasher/shared-lib/utility/rect.js'
import { svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { ClientAssetClass } from '../../base/ClientAssetClass.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { centerPoint } from '../../runtime.js'
import { EventAsset } from '../../utility/events.js'

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithClientAsset)

export class ClientShapeAssetClass extends WithShapeAsset implements ClientShapeAsset {
  constructor(args: ShapeAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const { id, pathHeight: height, pathWidth: width, path } = this
    if (id === DEFAULT_CONTAINER_ID) {
      return Promise.resolve({ data: svgSvgElement(size, svgPolygonElement(size, '', 'currentColor')) })
    }
    const inSize = { width, height }
    if (!isPopulatedString(path)) return errorPromise(ERROR.Unavailable, 'path')

    const coverSize = containSize(inSize, size)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const element = svgPathElement(path)
    svgSetTransformRects(element, inSize, outRect)
    return Promise.resolve({ data: svgSvgElement(size, element) })
  }

  override instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ClientShapeInstanceClass(args)
  }

  private static _defaultAsset?: ClientShapeAsset
  private static get defaultAsset(): ClientShapeAsset {
  return this._defaultAsset ||= new ClientShapeAssetClass({ 
      id: DEFAULT_CONTAINER_ID, type: $IMAGE, 
      source: $SHAPE, label: 'Rectangle'
    })
  }
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DEFAULT_CONTAINER_ID
    if (!(isDefault || isAssetObject(assetObject, $IMAGE, $SHAPE))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ClientShapeAssetClass.defaultAsset
    else detail.asset = new ClientShapeAssetClass(assetObject as ShapeAssetObject) 
  }
}

// listen for image/shape asset event
export const ClientShapeImageListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientShapeAssetClass.handleAsset
})

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithShapeInstance = ShapeInstanceMixin(WithClientInstance)

export class ClientShapeInstanceClass extends WithShapeInstance implements ClientShapeInstance {
  constructor(args: ShapeInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientShapeAsset



  override instanceCachePromise(_args: InstanceCacheArgs): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'instanceCachePromise', _args)
    return Promise.resolve({ data: 0 })
  }

}

