import type { MaybeComplexSvgItem, ColorAsset, ColorInstance, ColorInstanceObject, Constrained, ContentSvgItemArgs, DataOrError, IntrinsicOptions, Rect, VisibleAsset, VisibleInstance, AssetManager, ServerVisibleInstance, ServerVisibleAsset, AssetFunction, ClientAsset, ClientClip, ClientInstance, Size } from '../types.js'

import { $CONTENT, $END, $IMAGE, RECT_ZERO, $RGB, RGB_GRAY, DEFAULT_CONTENT_ID, $COLOR, isAssetObject, namedError, ERROR, SLASH, MOVIE_MASHER, $CLIENT } from '../runtime.js'
import { isDefined } from '../utility/guard.js'
import { assertPopulatedString } from '../utility/guards.js'
import { svgOpacity, svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement } from '../utility/svg.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '../mixin/visible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/server-visible.js'
import { ServerAssetClass } from '../base/server-asset.js'
import { ServerInstanceClass } from '../base/server-instance.js'
import { ClientAssetClass } from '../base/client-asset.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../mixin/client-visible.js'
import { centerPoint, coverSize } from '../utility/rect.js'
import { ClientInstanceClass } from '../base/client-instance.js'


interface ClientColorAsset extends ColorAsset, ClientAsset {}

interface ClientColorInstance extends ColorInstance, ClientInstance {
  clip: ClientClip
  asset: ClientColorAsset
}

interface ServerColorAsset extends ColorAsset, ServerVisibleAsset {  }

interface ServerColorInstance extends ColorInstance, ServerVisibleInstance {
  asset: ServerColorAsset
}

const ImageColorPath = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ImageColorDimension = 512

export function ColorAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    canBeContainer = false
    canBeContent = true
    canBeFill = true
    hasIntrinsicSizing = false
    type = $IMAGE
  }
}

export function ColorInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ColorInstance> {
  return class extends Base implements ColorInstance {
    constructor(...args: any[]) {
      super(...args)
      this.properties.push(this.propertyInstance({
        targetId: $CONTENT, name: 'color', type: $RGB,
        defaultValue: RGB_GRAY, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTENT, name: `color${$END}`,
        type: $RGB, undefinedAllowed: true, tweens: true,
      }))
    }
    
    declare asset: ColorAsset

    override contentSvgItem(args: ContentSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const { time, timeRange, opacity, contentRect } = args
      const [color] = this.tweenValues('color', time, timeRange)
      assertPopulatedString(color)
      
      const string = color.startsWith('0x') ? `#${color.slice(2)}` : color
      const polygon = svgPolygonElement(contentRect, '', string)
      const data = svgOpacity(polygon, opacity)
      return { data }
    }

    override get intrinsicRect(): Rect { return RECT_ZERO }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

    override get tweening(): boolean { 
      let tweening = super.tweening
      
      const colorEnd = this.value('colorEnd')
      tweening ||= isDefined(colorEnd) && colorEnd !== this.value('color')
      
      return tweening
     }

  }
}

export class ServerColorAssetClass extends ColorAssetMixin(
  ServerVisibleAssetMixin(VisibleAssetMixin(ServerAssetClass))
) implements ServerColorAsset {
  override instanceFromObject(object?: ColorInstanceObject): ServerColorInstance {
    const args = this.instanceArgs(object)
    return new ServerColorInstanceClass(args)
  }

  private static _defaultAsset?: ServerColorAsset

  static defaultAsset(assetManager: AssetManager): ServerColorAsset {
    return this._defaultAsset ||= new ServerColorAssetClass({ 
      id: DEFAULT_CONTENT_ID, type: $IMAGE, 
      source: $COLOR, label: 'Color', assetManager
    })
  }
}

export class ServerColorInstanceClass extends ColorInstanceMixin(
  ServerVisibleInstanceMixin(VisibleInstanceMixin(ServerInstanceClass))
) implements ServerColorInstance { 
  declare asset: ServerColorAsset
}

export class ClientColorAssetClass extends ColorAssetMixin(
  ClientVisibleAssetMixin(VisibleAssetMixin(ClientAssetClass))
) implements ClientColorAsset {
  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    const inSize = { width: ImageColorDimension, height: ImageColorDimension }
    const coveredSize = coverSize(inSize, size, !cover)
    const outRect = { ...coveredSize, ...centerPoint(size, coveredSize) }
    const element = svgPathElement(ImageColorPath)
    svgSetTransformRects(element, inSize, outRect)
    return Promise.resolve({ data: svgSvgElement(size, element) })
  }

  override instanceFromObject(object?: ColorInstanceObject): ColorInstance {
    const args = this.instanceArgs(object)
    return new ClientColorInstanceClass(args)
  }

  private static _defaultAsset?: ClientColorAsset

  static defaultAsset(assetManager: AssetManager): ClientColorAsset {
    return this._defaultAsset ||= new ClientColorAssetClass({ 
      label: 'Color',id: DEFAULT_CONTENT_ID, 
      type: $IMAGE, source: $COLOR, assetManager,
    })
  }
}

export class ClientColorInstanceClass extends ColorInstanceMixin(
  ClientVisibleInstanceMixin( VisibleInstanceMixin(ClientInstanceClass))
) implements ClientColorInstance {
  declare asset: ClientColorAsset
}

export const imageColorAssetFunction: AssetFunction = object => {
  if (!isAssetObject(object, $IMAGE, $COLOR)) {
    return namedError(ERROR.Syntax, [$IMAGE, $COLOR].join(SLASH))
  }
  const { id, assetManager } = object
  const isDefault = id === DEFAULT_CONTENT_ID
  const { context } = MOVIE_MASHER
  const colorClass = context === $CLIENT ? ClientColorAssetClass : ServerColorAssetClass
  if (isDefault) return { data: colorClass.defaultAsset(assetManager) }

  return { data: new colorClass(object) }
}