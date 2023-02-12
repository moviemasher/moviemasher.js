import { isPopulatedString, isString } from "../Utility/Is"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"


export type AudioType = 'audio'
export type EffectType = 'effect'
export type FontType = 'font'
export type ImageType = 'image'
export type MashType = 'mash'
export type SequenceType = 'sequence'
export type VideoType = 'video'
export type AudioStreamType = 'audiostream'
export type VideoStreamType = 'videostream'
export type JsonType = 'json'

export const AudioType: AudioType = 'audio'
export const EffectType: EffectType = 'effect'
export const FontType: FontType = 'font'
export const ImageType: ImageType = 'image'
export const MashType: MashType = 'mash'
export const SequenceType: SequenceType = 'sequence'
export const VideoType: VideoType = 'video'
export const AudioStreamType: AudioStreamType = 'audiostream'
export const VideoStreamType: VideoStreamType = 'videostream'
export const JsonType: JsonType = 'json'

export type MediaType = AudioType | EffectType | FontType | ImageType | MashType | SequenceType | VideoType 
export const MediaTypes: MediaType[] = [AudioType, EffectType, FontType, ImageType, MashType, SequenceType, VideoType]
export const isMediaType = (value: any): value is MediaType => {
  return MediaTypes.includes(value)
}
export function assertMediaType(value?: any, name?: string): asserts value is MediaType {
  if (!isMediaType(value)) errorThrow(value, 'MediaType', name) 
}

export type TranscodeType = AudioType | FontType | ImageType | VideoType | SequenceType 
export const TranscodeTypes: MediaType[] = [FontType, ImageType, VideoType, SequenceType]
export const isTranscodeType = (type?: any): type is TranscodeType => {
  return TranscodeTypes.includes(type)
}
export function assertTranscodeType(value: any, name?: string): asserts value is TranscodeType {
  if (!isTranscodeType(value)) errorThrow(value, "TranscodeType", name)
}

// export enum TranscodeType {
//   Audio = 'audio',
//   Image = 'image',
//   ImageSequence = 'imagesequence',
//   Video = 'video',
//   Waveform = 'waveform',
// }
// export const TranscodeTypes = Object.values(TranscodeType)
// export const isTranscodeType = (type?: any): type is TranscodeType => {
//   return isPopulatedString(type) && TranscodeTypes.includes(type as TranscodeType)
// }
export type CookedType = EffectType | MashType 
export type CookedTypes = CookedType[]
export const CookedTypes: CookedTypes = [EffectType, MashType]
export const isCookedType = (type?: any): type is CookedType => {
  return isString(type) && CookedTypes.includes(type as CookedType)
}


export type RawType = AudioType | FontType | ImageType | VideoType
export type RawTypes = RawType[]
export const RawTypes: RawTypes = [AudioType, FontType, ImageType, VideoType]
export const isRawType = (type?: any): type is RawType => {
  return isString(type) && RawTypes.includes(type as RawType)
}

export type LoadType = RawType | JsonType
export const LoadTypes: LoadType[] = [...RawTypes, JsonType]
export const isLoadType = (type?: any): type is LoadType => {
  return LoadTypes.includes(type)
}
export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) errorThrow(value, "LoadType", name)
}


export type SizingMediaType = FontType | ImageType | VideoType | SequenceType
export const SizingMediaTypes: SizingMediaType[] = [FontType, ImageType, VideoType, SequenceType]
export const isSizingMediaType = (type?: any): type is SizingMediaType => {
  return SizingMediaTypes.includes(type)
}

export type TimingMediaType = AudioType | VideoType | SequenceType
export const TimingMediaTypes: TimingMediaType[] = [AudioType, VideoType, SequenceType]
export const isTimingMediaType = (type?: any): type is TimingMediaType => {
  return TimingMediaTypes.includes(type)
}

export type ContainerType = FontType | ImageType | SequenceType
export const ContainerTypes: ContainerType[] = [FontType, ImageType, SequenceType]
export const isContainerType = (type?: any): type is ContainerType => {
  return ContainerTypes.includes(type)
}
export function assertContainerType(value?: any, name?: string): asserts value is ContainerType {
  if (!isContainerType(value)) errorThrow(value, 'ContainerType', name) 
}

export type ContentType = ImageType | VideoType | SequenceType | AudioType
export const ContentTypes: ContentType[] = [ImageType, VideoType, SequenceType, AudioType]
export const isContentType = (type?: any): type is ContentType => {
  return ContentTypes.includes(type)
}
export function assertContentType(value?: any, name?: string): asserts value is ContentType {
  if (!isContentType(value)) errorThrow(value, 'ContentType', name) 
}

export type MediaTypesObject = Record<string, MediaType[]>

export const StreamKind = 'stream'

export type EditType = ImageType | VideoType | SequenceType | AudioType | VideoStreamType | AudioStreamType
export const EditTypes: EditType[] = [ImageType, VideoType, SequenceType, AudioType]
export const isEditType = (type?: any): type is EditType => {
  return EditTypes.includes(type)
}
export function assertEditType(value: any, name?: string): asserts value is EditType {
  if (!isEditType(value)) errorThrow(value, 'EditType', name)
}


export enum DroppingPosition {
  At = 'at',
  After = 'after',
  Before = 'before',
  None = 'none'
}
export type FolderType = 'folder'
export const FolderType: FolderType = 'folder'
export type TrackType = 'track'
export const TrackType: TrackType = 'track'

export type LayerType = MashType | FolderType | TrackType
export const LayerTypes: LayerType[] = [MashType, FolderType, TrackType]
export const isLayerType = (value: any): value is LayerType => {
  return LayerTypes.includes(value)
}
export function assertLayerType(value: any, name?: string): asserts value is LayerType {
  if (!isLayerType(value)) errorThrow(value, 'LayerType', name) 
}


export enum ActionType {
  AddClipToTrack = 'addClipToTrack',
  AddTrack = 'addTrack',
  Change = 'change',
  ChangeFrame = 'changeFrame',
  ChangeMultiple = 'changeMultiple',
  Move = 'move',
  MoveClip = 'moveClip',
  RemoveClip = 'removeClip',
}


export enum AVType {
  Audio = 'audio',
  Both = 'both',
  Video = 'video',
}

export enum SelectType {
  Clip = 'clip',
  Container = 'container',
  Content = 'content',
  Mash = 'mash',
  None = 'none',
  Track = 'track',
}

export const SelectTypes = Object.values(SelectType)
export const isSelectType = (value?: any): value is SelectType => {
  return SelectTypes.includes(value as SelectType)
}
export function assertSelectType(value: any, name?: string): asserts value is SelectType {
  if (!isSelectType(value)) errorThrow(value, 'SelectType', name)
}

export type ClipSelectType = SelectType.Content | SelectType.Container
export const ClipSelectTypes = [SelectType.Content, SelectType.Container]
export const isClipSelectType = (type?: any): type is ClipSelectType => {
  return isSelectType(type) && ClipSelectTypes.includes(type)
}

export enum OutputFormat {
  AudioConcat = 'wav',
  Flv = 'flv',
  Hls = 'hls',
  Jpeg = 'jpeg',
  Mdash = 'mdash',
  Mp3 = 'mp3',
  Mp4 = 'mp4',
  Png = 'image2',
  Rtmp = 'rtmp',
  VideoConcat = 'yuv4mpegpipe',
}

export enum StreamingFormat {
  Hls = 'hls',
  Mdash = 'mdash',
  Rtmp = 'rtmp',
}

export enum ProbeType {
  Alpha = 'alpha',
  Audio = 'audio',
  Duration = 'duration',
  Size = 'size',
}
export enum DecodeType {
  Probe = 'probe',
}
export const DecodeTypes = Object.values(DecodeType)
export const isDecodeType = (type?: any): type is DecodeType => {
  return isPopulatedString(type) && DecodeTypes.includes(type as DecodeType)
}


export type EncodeType = AudioType | ImageType | VideoType | FontType | SequenceType

export const EncodeTypes: EncodeType[] = [AudioType, ImageType, VideoType, FontType]

export enum FillType {
  Color = 'color',
  Fill = 'fill',
}
export const FillTypes = Object.values(FillType)
export const isFillType = (type?: any): type is FillType => {
  return FillTypes.includes(type as FillType)
}


export enum GraphFileType {
  Svg = 'svg',
  SvgSequence = 'svgsequence',
  Txt = 'txt',
  // Object = 'object'
}

export const GraphFileTypes = Object.values(GraphFileType)
export const isGraphFileType = (type?: any): type is GraphFileType => {
  return isPopulatedString(type) && GraphFileTypes.includes(type as GraphFileType)
}


export enum DataType {
  Boolean = 'boolean',
  ContainerId = 'containerid',
  ContentId = 'contentid',
  DefinitionId = 'definitionid',
  FontId = 'fontid',
  Frame = 'frame',
  Icon = 'icon',
  Number = 'number',
  Percent = 'percent',
  Rgb = 'rgb',
  String = 'string',
  Option = 'option',
}
export const DataTypes = Object.values(DataType)
export const isDataType = (type?: any): type is DataType => {
  return DataTypes.includes(type as DataType)
}
export function assertDataType(value: any, name?: string): asserts value is DataType {
  if (!isDataType(value)) errorThrow(value, "DataType", name)
}

export enum Orientation {
  H = 'H',
  V = 'V',
}
export const Orientations = Object.values(Orientation)
export const isOrientation = (value: any): value is Orientation => {
  return isPopulatedString(value) && Orientations.includes(value as Orientation)
}

export enum Direction {
  E = 'E',
  N = 'N',
  S = 'S',
  W = 'W',
}
export const Directions = Object.values(Direction)
export const isDirection = (value?: any): value is Direction => {
  return Directions.includes(value as Direction)
}
export function assertDirection(value: any, name?: string): asserts value is Direction {
  if (!isDirection(value)) errorThrow(value, "Direction", name)
}

export type DirectionObject = {
  [index in Direction]?: boolean
}

export enum Anchor {
  E = 'E',
  N = 'N',
  NE = 'NE',
  NW = 'NW',
  S = 'S',
  SE = 'SE',
  SW = 'SW',
  W = 'W',
}
export const Anchors = Object.values(Anchor)


export enum TriggerType {
  Init = 'init',
  Stop = 'stop',
  Start = 'start',
}
export const TriggerTypes = Object.values(TriggerType)
export const isTriggerType = (type?: any): type is TriggerType => {
  return TriggerTypes.includes(type as TriggerType)
}

export enum TransformType {
  Scale = 'scale',
  Translate = 'translate',
}

export enum EventType {
  Action = 'action',
  Active = 'active',
  Added = 'added',
  Cast = 'cast',
  Draw = 'draw',
  Duration = 'durationchange',
  Ended = 'ended',
  Frame = 'frame',
  Fps = 'ratechange',
  Loaded = 'loadeddata',
  Pause = 'pause',
  Play = 'play',
  Playing = 'playing',
  Render = 'render',
  Resize = 'resize',
  Save = 'save',
  Seeked = 'seeked',
  Seeking = 'seeking',
  Selection = 'selection',
  Time = 'timeupdate',
  Track = 'track',
  Volume = 'volumechange',
  Waiting = 'waiting',

}
export const EventTypes = Object.values(EventType)
export const isEventType = (type?: any): type is EventType => {
  return EventTypes.includes(type as EventType)
}


export enum MoveType {
  Audio = 'audio',
  Effect = 'effect',
  Video = 'video',
}

export enum MasherAction {
  Redo = 'redo',
  Remove = 'remove',
  Render = 'render',
  Save = 'save',
  Undo = 'undo',
}

export enum ServerType {
  Api = 'api',
  Data = 'data',
  File = 'file',
  Rendering = 'rendering',
  Web = 'web',
}
export const ServerTypes = Object.values(ServerType)

export enum Duration {
  Unknown = -1,
  Unlimited = -2,
  None = 0,
}

export enum Timing {
  Custom = 'custom',
  Content = 'content',
  Container = 'container',
}
export const Timings = Object.values(Timing)

export enum Sizing {
  Preview = 'preview',
  Content = 'content',
  Container = 'container',
}
export const Sizings = Object.values(Sizing)

export enum Clicking {
  Show = 'show',
  Hide = 'hide',
  Play = 'play',
}
export const Clickings = Object.values(Clicking)

