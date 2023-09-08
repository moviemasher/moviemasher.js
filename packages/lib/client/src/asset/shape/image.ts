
import type { ClientShapeAsset, ClientShapeInstance, Panel, SvgItem } from '@moviemasher/runtime-client'
import type { InstanceArgs, InstanceCacheArgs, Rect, ShapeAssetObject, ShapeInstance, ShapeInstanceObject, Size, Time } from '@moviemasher/runtime-shared'

import { DefaultContainerId, ShapeAssetMixin, ShapeInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, centerPoint, sizeAboveZero, sizeContain } from '@moviemasher/lib-shared'
import { EventAsset } from '@moviemasher/runtime-client'
import { SourceShape, IMAGE, isAssetObject, isPopulatedString } from '@moviemasher/runtime-shared'
import { svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement } from '../../Client/SvgFunctions.js'
import { ClientVisibleAssetMixin } from '../../Client/Visible/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../Client/Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientAssetClass } from '../ClientAssetClass.js'

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithClientAsset)

export class ClientShapeAssetClass extends WithShapeAsset implements ClientShapeAsset {
  constructor(args: ShapeAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  override assetIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { id, pathHeight: height, pathWidth: width, path } = this
    if (id === DefaultContainerId) {
      return Promise.resolve(svgSvgElement(size, svgPolygonElement(size, '', 'currentColor')))
    }
    const inSize = { width, height }
    if (!(sizeAboveZero(inSize) && isPopulatedString(path))) return

    const coverSize = sizeContain(inSize, size)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(path)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }

  override instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ClientShapeInstanceClass(args)
  }

  private static _defaultAsset?: ClientShapeAsset
  private static get defaultAsset(): ClientShapeAsset {
  return this._defaultAsset ||= new ClientShapeAssetClass({ 
      id: DefaultContainerId, type: IMAGE, 
      source: SourceShape, label: 'Rectangle'
    })
  }
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DefaultContainerId
    if (!(isDefault || isAssetObject(assetObject, IMAGE, SourceShape))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ClientShapeAssetClass.defaultAsset
    else detail.asset = new ClientShapeAssetClass(assetObject as ShapeAssetObject) 
  }
}

// listen for image/shape asset event
export const ClientShapeImageListeners = () => ({
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

  override containerSvgItemPromise(containerRect: Rect, _time: Time, _component: Panel): Promise<SvgItem> {
    return Promise.resolve(this.pathElement(containerRect))
  }

  override instanceCachePromise(_args: InstanceCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  override pathElement(rect: Rect, forecolor = ''): SvgItem {
    const inRect = this.intrinsicRect(true)
    if (!sizeAboveZero(inRect)) {
      const polygonElement = svgPolygonElement(rect, '', forecolor)
      return polygonElement
    }
    const { asset } = this
    const { path } = asset
    const pathElement = svgPathElement(path, '')
    svgSetTransformRects(pathElement, inRect, rect)
    return pathElement
  }
}

