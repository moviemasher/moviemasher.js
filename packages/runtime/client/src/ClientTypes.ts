import type { AudibleInstance, AudioAsset, AudioInstance, AudioInstanceObject, ColorAsset, ColorInstance, ContainerInstance, EndpointRequest, ImageAsset, ImageInstance, ImageInstanceObject, Instance, InstanceArgs, JsonRecord, MovieMasherOptions, MovieMasherRuntime, PropertySize, RawAsset, Rect, RequestObject, ShapeAsset, ShapeInstance, Size, TextAsset, TextAssetObject, TextInstance, Time, TimeRange, Transcoding, IMAGE, VideoAsset, VideoInstance, VideoInstanceObject, VisibleInstance, AssetObject, AssetObjects, StringRecord } from '@moviemasher/runtime-shared'
import type { StartOptions } from './AudioPreview.js'
import type { ClientAsset } from './ClientAsset.js'
import type { ClientAudibleAsset, ClientVisibleAsset } from './ClientAssetTypes.js'
import type { ClientClip } from './ClientMashTypes.js'
import type { ClientFont, ClientMediaRequest } from './ClientMedia.js'
import type { Panel } from './PanelTypes.js'
import type { Selectable } from './Selectable.js'
import type { PreviewElement, SvgItem } from './Svg.js'

export type Timeout = ReturnType<typeof setTimeout>

export interface ClientInstance extends Instance, Selectable {
  clip: ClientClip
  asset: ClientAsset
  unload(): void
}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
  asset: ClientAudibleAsset
  clip: ClientClip
}
export interface ClientVisibleInstance extends ClientInstance, VisibleInstance {
  asset: ClientVisibleAsset
  clip: ClientClip
  containedPreviewPromise(contentItem: SvgItem, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Panel): Promise<PreviewElement> 
  clippedPreviewPromise(content: ClientVisibleInstance, containerRect: Rect, previewSize: Size, time: Time, component: Panel): Promise<PreviewElement>
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
  clip: ClientClip
  asset: ClientColorAsset
}

export interface ClientShapeAsset extends ShapeAsset, ClientAsset {}

export interface ClientShapeInstance extends ShapeInstance, ClientInstance {
  clip: ClientClip
  asset: ClientShapeAsset
}

export interface ClientTextAsset extends TextAsset, ClientAsset, RawAsset {
  request: ClientMediaRequest
}

export interface ClientTextInstance extends TextInstance, ClientInstance {
  clip: ClientClip
  asset: ClientTextAsset
}

export interface ClientTextAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}

export interface MovieMasherClientOptions extends MovieMasherOptions {
  assetObject?: EndpointRequest | AssetObject
  assetObjects?: EndpointRequest | AssetObjects
  icons?: EndpointRequest | StringRecord
  browserOptions?: {
    
  } 
  transcodeOptions?: {
    auto: {
      [IMAGE]: []
    }
  }
}

export interface MovieMasherClientRuntime extends MovieMasherRuntime {
  options: MovieMasherClientOptions
  
}
