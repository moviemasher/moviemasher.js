import type { Instance, AudibleInstance, TimeRange, VisibleInstance, Rect, Size, Time, AudioAsset, AudioInstanceObject, AudioInstance, InstanceArgs, ImageAsset, ImageInstanceObject, ImageInstance, VideoAsset, VideoInstanceObject, VideoInstance, Transcoding, ColorAsset, ColorInstance, ShapeAsset, ShapeInstance, TextAsset, TextInstance, TextAssetObject, MovieMasherRuntime, RequestObject, ContainerInstance, PropertySize } from '@moviemasher/runtime-shared'
import type { StartOptions } from './AudioPreview.js'
import type { ClientAsset } from './ClientAsset.js'
import type { ClientAudibleAsset, ClientVisibleAsset } from './ClientAssetTypes.js'
import type { ClientFont } from './ClientMedia.js'
import type { Panel } from './PanelTypes.js'
import type { Selectable } from './Selectable.js'
import type { Preview, SvgItem } from './Svg.js'
import { Masher } from './Masher.js'

export type Timeout = ReturnType<typeof setTimeout>
export type AnimationFrame = ReturnType<typeof requestAnimationFrame>

export interface ClientInstance extends Instance, Selectable {
  asset: ClientAsset
  unload(): void
}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
  asset: ClientAudibleAsset
}
export interface ClientVisibleInstance extends ClientInstance, VisibleInstance {
  asset: ClientVisibleAsset
  containedPreviewPromise(contentItem: SvgItem, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Panel): Promise<Preview> 
  clippedPreviewPromise(content: ClientVisibleInstance, containerRect: Rect, previewSize: Size, time: Time, component: Panel): Promise<Preview>
  containerSvgItemPromise(containerRect: Rect, time: Time, component: Panel): Promise<SvgItem>
  contentPreviewItemPromise(containerRect: Rect, shortest: PropertySize, time: Time, component: Panel): Promise<SvgItem>
  contentSvgFilter(container: ContainerInstance, contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined
  pathElement(rect: Rect): SvgItem 
  svgItemForPlayerPromise(rect: Rect, time: Time): Promise<SvgItem> 
  svgItemForTimelinePromise(rect: Rect, time: Time): Promise<SvgItem> 

}

export interface ClientAudioAsset extends AudioAsset, ClientAudibleAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs
}

export interface ClientImageAsset extends ImageAsset, ClientVisibleAsset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
}

export interface ClientVideoAsset extends VideoAsset, ClientAudibleAsset, ClientVisibleAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs
  previewTranscoding?: Transcoding
}

export interface ClientColorAsset extends ColorAsset, ClientAsset {}

export interface ClientColorInstance extends ColorInstance, ClientInstance {
  asset: ClientColorAsset
}


export interface ClientShapeAsset extends ShapeAsset, ClientAsset {}

export interface ClientShapeInstance extends ShapeInstance, ClientInstance {
  asset: ClientShapeAsset
}


export interface ClientTextAsset extends TextAsset, ClientAsset {}

export interface ClientTextInstance extends TextInstance, ClientInstance {
  asset: ClientTextAsset
}

export interface ClientTextAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}


export interface MovieMasherClientRuntime extends MovieMasherRuntime {
  masher?: Masher
  options: {
    assetObjectOptions?: RequestObject
    assetObjectsOptions?: RequestObject
    iconOptions?: RequestObject
  }
}

