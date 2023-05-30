import type { LoaderType } from '../Helpers/ClientMedia/ClientMediaFunctions.js'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import type { Filter, FilterArgs } from '../Plugin/Filter/Filter.js'
import type { ValueRecord } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'
import type { RectTuple } from '@moviemasher/runtime-shared'
import type { EndpointRequest } from '../Helpers/Request/Request.js'
import type { Asset } from '../Shared/Asset/Asset.js'
import type { AVType } from "../Setup/AVType.js"


import { isObject } from '../Shared/SharedGuards.js'
import { isTyped } from "./TypedFunctions.js"

export interface CommandInput {
  source: string
  options?: ValueRecord
}
export type CommandInputs = CommandInput[]

export interface CommandFilter {
  avType?: AVType
  ffmpegFilter: string
  inputs: string[]
  outputs: string[]
  options: ValueRecord
}

export type CommandFilters = CommandFilter[]

export interface GraphFilter extends CommandFilter {
  filter: Filter
}
export type GraphFilters = GraphFilter[]

export interface FilterValueObject {
  filter: Filter
  valueObject: ValueRecord
}
export type FilterValueObjects = FilterValueObject[]


export interface CacheOptions {
  audible?: boolean
  visible?: boolean
  quantize?: number
  time?: Time
  size?: Size
}

export interface ClipCacheOptions extends CacheOptions {
}

export interface InstanceCacheOptions extends CacheOptions {

}

export interface AssetCacheOptions extends CacheOptions {

}

export interface InstanceCacheArgs extends CacheOptions {
  clipTime: TimeRange
  time: Time
  quantize: number
}

export interface AssetCacheArgs extends CacheOptions {
  assetTime: Time
}


export interface PreloadOptionsBase extends CacheOptions {}

export interface ServerPromiseArgs extends CacheOptions {}



export interface PreloadArgs extends CacheOptions {
  quantize: number
  clipTime: TimeRange
}

export interface PreloadOptions extends Partial<CacheOptions> {
  clipTime?: TimeRange
}

export type ColorTuple = [string, string]

export interface CommandFileOptions {
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  outputSize?: Size
  containerRects?: RectTuple
  contentColors?: ColorTuple
  videoRate: number
  clipTime?: TimeRange
}

export interface CommandFileArgs extends CommandFileOptions {
  clipTime: TimeRange
}
export interface VisibleCommandFileArgs extends CommandFileArgs {
  outputSize: Size
  containerRects: RectTuple
}
export interface CommandFilterArgs extends CommandFileArgs {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
}
export interface VisibleCommandFilterArgs extends CommandFilterArgs {
  outputSize: Size
  containerRects: RectTuple
  duration: number
}


export interface FilterCommandFilterArgs extends FilterArgs {
  commandFiles?: CommandFiles,
  chainInput?: string, 
  filterInput?: string
  dimensions?: Size
  videoRate: number
  duration: number
}

export interface FilterCommandFileArgs extends FilterArgs {
  outputSize: Size
  containerRects: RectTuple
  clipTime: TimeRange
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  contentColors?: ColorTuple
  videoRate: number
  duration: number
}

export interface FilterDefinitionArgs extends FilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFilterArgs extends FilterCommandFilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFileArgs extends FilterCommandFileArgs {
  filter: Filter
}

export interface GraphFile {
  type: LoaderType
  file: string
  content?: string
  input?: boolean
  definition: Asset
  resolved?: string
}
export type GraphFiles = GraphFile[]

export interface CommandFile extends GraphFile {
  options?: ValueRecord
  inputId: string
}

export type CommandFiles = CommandFile[]

export type BrowserComponent = 'browser'
export type PlayerComponent = 'player'
export type InspectorComponent = 'inspector'
export type TimelineComponent = 'timeline'
export type Component = BrowserComponent | PlayerComponent | InspectorComponent | TimelineComponent

export const ComponentBrowser: Component = 'browser'
export const ComponentPlayer: Component = 'player'
export const ComponentInspector: Component = 'inspector'
export const ComponentTimeline: Component = 'timeline'


export interface Output {
  request?: EndpointRequest
  type: string
}
export const isOutput = (value: any): value is Output => {
  return isObject(value) && isTyped(value)
}

