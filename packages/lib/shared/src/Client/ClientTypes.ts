import type { ClientAudibleAsset, ClientVisibleAsset } from './Asset/ClientAsset.js'
import type { Panel } from "../Base/PanelTypes.js"
import type { Actions } from '../Plugin/Masher/Actions/Actions.js'
import type { Identified, Property, ValueRecord } from '@moviemasher/runtime-shared'
import type { SelectedProperties } from '../Helpers/Select/SelectedProperty.js'
import type { AudibleInstance, Instance, InstanceArgs, VisibleInstance } from '../Shared/Instance/Instance.js'
import type { Rect } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import type { PreviewItem, SvgItem } from '../Helpers/Svg/Svg.js'
import type { StartOptions } from '../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import type { Selectable } from '../Plugin/Masher/Selectable.js'
import type { Asset } from '../Shared/Asset/AssetTypes.js'
import type { AudioAsset } from '../Shared/Audio/AudioAsset.js'
import type { AudioInstance, AudioInstanceObject } from '../Shared/Audio/AudioInstance.js'
import type { ImageInstance, ImageInstanceObject } from '../Shared/Image/ImageInstance.js'
import type { VideoAsset } from '../Shared/Video/VideoAsset.js'
import type { ImageAsset } from '../Shared/Image/ImageAsset.js'
import type { VideoInstance, VideoInstanceObject } from '../Shared/Video/VideoInstance.js'
import type { Transcoding } from '../Plugin/Transcode/Transcoding/Transcoding.js'
import type { ClientEffect, ClientEffects } from '../Effect/Effect.js'
import type { TextAsset, TextAssetObject, TextInstance } from '../Shared/Text/TextTypes.js'
import type { ClientFont } from '../Helpers/ClientMedia/ClientMedia.js'
import type { ShapeAsset, ShapeInstance } from '../Shared/Shape/ShapeTypes.js'
import type { ColorAsset, ColorInstance } from '../Shared/Color/ColorTypes.js'

export interface ClientInstance extends Instance, Selectable {
  asset: ClientAsset
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  selectedProperty(property: Property): boolean
  unload(): void
  effects: ClientEffects
}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
  asset: ClientAudibleAsset
  effects: ClientEffect[]
}
export interface ClientVisibleInstance extends ClientInstance, VisibleInstance {
  asset: ClientVisibleAsset
  effects: ClientEffect[]

  svgItemForPlayerPromise(rect: Rect, time: Time): Promise<SvgItem> 
  svgItemForTimelinePromise(rect: Rect, time: Time): Promise<SvgItem> 

  contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time): SVGFilterElement | undefined
  pathElement(rect: Rect): SvgItem 

  /**
   * Called by ClientClip clipPreviewItemsPromise method 
   * @param content the ClientInstance that is being contained
   * @param containerRect the Rect to draw within 
   * @param previewSize the display Size of the preview itself
   * @param time 
   * @param range 
   * @param component 
   */
  clippedPreviewItemPromise(content: ClientVisibleInstance, containerRect: Rect, previewSize: Size, time: Time, component: Panel): Promise<PreviewItem>
  contentPreviewItemPromise(containerRect: Rect, time: Time, component: Panel): Promise<SvgItem>
  containerSvgItemPromise(containerRect: Rect, time: Time, component: Panel): Promise<SvgItem>

}


export interface ClientAsset extends Asset, Selectable {
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined

}

export type ClientAssets = ClientAsset[]

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
  effects: ClientEffects
  asset: ClientColorAsset
}


export interface ClientShapeAsset extends ShapeAsset, ClientAsset {}

export interface ClientShapeInstance extends ShapeInstance, ClientInstance {
  effects: ClientEffects
  asset: ClientShapeAsset
}


export interface ClientTextAsset extends TextAsset, ClientAsset {}

export interface ClientTextInstance extends TextInstance, ClientInstance {
  effects: ClientEffects
  asset: ClientTextAsset
}

export interface ClientTextAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}



export interface TranslateArgs extends Identified {
  values?: ValueRecord
}

export interface Icon {
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SVGSVGElement
  svgString?: string
}


