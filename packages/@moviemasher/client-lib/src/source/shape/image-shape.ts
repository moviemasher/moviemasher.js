
import type { ClientShapeAsset, ClientShapeInstance, Panel } from '../../types.js'
import type { DataOrError, InstanceArgs, InstanceCacheArgs, SvgItem, ListenersFunction, Rect, ShapeAssetObject, ShapeInstance, ShapeInstanceObject, Size, Time } from '@moviemasher/shared-lib/types.js'


import { centerPoint, sizeContain } from '@moviemasher/shared-lib/utility/rect.js'
import { EventAsset } from '../../utility/events.js'
import { DEFAULT_CONTAINER_ID, ERROR, IMAGE, SHAPE, errorPromise, isAssetObject, isPopulatedString } from '@moviemasher/shared-lib/runtime.js'
import { ClientVisibleAssetMixin } from '../../mixin/visible.js'
import { ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { ClientAssetClass } from '../../base/ClientAssetClass.js'
import { svgPolygonElement, svgSvgElement, svgPathElement, svgSetTransformRects } from '@moviemasher/shared-lib/utility/svg.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { ShapeAssetMixin, ShapeInstanceMixin } from '@moviemasher/shared-lib/mixin/shape.js'

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

    const coverSize = sizeContain(inSize, size)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(path)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve({ data: svgSvgElement(size, pathElement) })
  }

  override instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ClientShapeInstanceClass(args)
  }

  private static _defaultAsset?: ClientShapeAsset
  private static get defaultAsset(): ClientShapeAsset {
  return this._defaultAsset ||= new ClientShapeAssetClass({ 
      id: DEFAULT_CONTAINER_ID, type: IMAGE, 
      source: SHAPE, label: 'Rectangle'
    })
  }
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DEFAULT_CONTAINER_ID
    if (!(isDefault || isAssetObject(assetObject, IMAGE, SHAPE))) return
      
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

  override containerSvgItemPromise(containerRect: Rect, _time: Time, _component: Panel): Promise<DataOrError<SvgItem>> {
    return Promise.resolve({ data: this.pathElement(containerRect) })
  }

  override instanceCachePromise(_args: InstanceCacheArgs): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'instanceCachePromise', _args)
    return Promise.resolve({ data: 0 })
  }

}

