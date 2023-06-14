import type { AudioAsset } from '@moviemasher/runtime-shared'
import type { AudioInstance, AudioInstanceObject } from '@moviemasher/runtime-shared'
import type { ImageInstance, ImageInstanceObject } from '@moviemasher/runtime-shared'
import type { VideoAsset } from '@moviemasher/runtime-shared'
import type { ImageAsset } from '@moviemasher/runtime-shared'
import type { VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { Transcoding } from '@moviemasher/runtime-shared'
import type { Rect } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'
import type { Identified, Property, ValueRecord } from '@moviemasher/runtime-shared'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import type { AudibleInstance, Instance, InstanceArgs, VisibleInstance } from '@moviemasher/runtime-shared'


import type { Panel } from "../Base/PanelTypes.js"
import type { Actions } from "@moviemasher/runtime-client"
import type { SelectedProperties } from '@moviemasher/runtime-client'

import type { PreviewItem, SvgItem } from '../Helpers/Svg/Svg.js'
import type { StartOptions } from '../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import type { Selectable } from '@moviemasher/runtime-client'

import type { TextAsset, TextAssetObject, TextInstance } from '@moviemasher/runtime-shared'
import type { ClientFont } from '../Helpers/ClientMedia/ClientMedia.js'
import type { ShapeAsset, ShapeInstance } from '@moviemasher/runtime-shared'
import type { ColorAsset, ColorInstance } from '@moviemasher/runtime-shared'
import type { ClientAudibleAsset, ClientVisibleAsset } from './Asset/ClientAssetTypes.js'
import { ClientAsset } from '@moviemasher/runtime-client'


export interface ClientInstance extends Instance, Selectable {
  asset: ClientAsset
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  selectedProperty(property: Property): boolean
  unload(): void
}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
  asset: ClientAudibleAsset
}
export interface ClientVisibleInstance extends ClientInstance, VisibleInstance {
  asset: ClientVisibleAsset
  clippedPreviewItemPromise(content: ClientVisibleInstance, containerRect: Rect, previewSize: Size, time: Time, component: Panel): Promise<PreviewItem>
  containerSvgItemPromise(containerRect: Rect, time: Time, component: Panel): Promise<SvgItem>
  contentPreviewItemPromise(containerRect: Rect, time: Time, component: Panel): Promise<SvgItem>
  contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time): SVGFilterElement | undefined
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


