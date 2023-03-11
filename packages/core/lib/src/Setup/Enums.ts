import { isPopulatedString, isString } from "../Utility/Is"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"

export type AudioType = 'audio'
export const AudioType: AudioType = 'audio'
export type EffectType = 'effect'
export const EffectType: EffectType = 'effect'
export type FontType = 'font'
export const FontType: FontType = 'font'
export type ImageType = 'image'
export const ImageType: ImageType = 'image'
export type MashType = 'mash'
export const MashType: MashType = 'mash'
export type SequenceType = 'sequence'
export const SequenceType: SequenceType = 'sequence'
export type VideoType = 'video'
export const VideoType: VideoType = 'video'
export type AudioStreamType = 'audiostream'
export const AudioStreamType: AudioStreamType = 'audiostream'
export type VideoStreamType = 'videostream'
export const VideoStreamType: VideoStreamType = 'videostream'

export type JsonType = 'json'
export const JsonType: JsonType = 'json'

export type RecordType = 'record'
export const RecordType: RecordType = 'record'

export type RecordsType = 'records'
export const RecordsType: RecordsType = 'records'

export type StorableType = EffectType | MashType 
export type StorableTypes = StorableType[]
export const StorableTypes: StorableTypes = [EffectType, MashType]
export const isStorableType = (type?: any): type is StorableType => {
  return isString(type) && StorableTypes.includes(type as StorableType)
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

export type ContainingType = FontType | ImageType | SequenceType
export const ContainingTypes: ContainingType[] = [FontType, ImageType, SequenceType]
export const isContainingType = (type?: any): type is ContainingType => {
  return ContainingTypes.includes(type)
}

export type ContentingType = ImageType | VideoType | SequenceType | AudioType
export const ContentTypes: ContentingType[] = [ImageType, VideoType, SequenceType, AudioType]
export const isContentingType = (type?: any): type is ContentingType => {
  return ContentTypes.includes(type)
}


export enum DroppingPosition {
  At = 'at',
  After = 'after',
  Before = 'before',
  None = 'none'
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

export type ClipType = 'clip'
export const ClipType: ClipType = 'clip'

export type ContentType = 'content'
export const ContentType: ContentType = 'content'

export type ContainerType = 'container'
export const ContainerType: ContainerType = 'container'

export type NoneType = 'none'
export const NoneType: NoneType = 'none'


export type TrackType = 'track'
export const TrackType: TrackType = 'track'

export type SelectorType = ClipType | ContainerType | ContentType | EffectType | MashType | NoneType | TrackType

export type SelectorTypes = SelectorType[]
export const SelectorTypes: SelectorTypes = [ClipType, ContainerType, ContentType, MashType, NoneType, TrackType]
export const isSelectorType = (type?: any): type is SelectorType => {
  return SelectorTypes.includes(type)
}
export function assertSelectorType(value: any, name?: string): asserts value is SelectorType {
  if (!isSelectorType(value)) errorThrow(value, "SelectorType", name)
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









// TODO: remove enums

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
  Draw = 'draw',
  Duration = 'durationchange',
  Ended = 'ended',
  Fps = 'ratechange',
  Frame = 'frame',
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

