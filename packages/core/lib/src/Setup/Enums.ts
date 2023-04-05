import { isPopulatedString, isString } from '../Utility/Is.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'



export type AudioStreamType = 'audiostream'
export type AudioType = 'audio'
export type ClipType = 'clip'
export type ContainerType = 'container'
export type ContentType = 'content'
export type EffectType = 'effect'
export type FontType = 'font'
export type ImageType = 'image'
export type JsonType = 'json'
export type MashType = 'mash'
export type NoneType = 'none'
export type RecordsType = 'records'
export type RecordType = 'record'
export type SequenceType = 'sequence'
export type TrackType = 'track'
export type VideoStreamType = 'videostream'
export type VideoType = 'video'



export const TypeAudio: AudioType = 'audio'
export const TypeAudioStream: AudioStreamType = 'audiostream'
export const TypeClip: ClipType = 'clip'
export const TypeContainer: ContainerType = 'container'
export const TypeContent: ContentType = 'content'
export const TypeEffect: EffectType = 'effect'
export const TypeFont: FontType = 'font'
export const TypeImage: ImageType = 'image'
export const TypeJson: JsonType = 'json'
export const TypeMash: MashType = 'mash'
export const TypeNone: NoneType = 'none'
export const TypeRecord: RecordType = 'record'
export const TypeRecords: RecordsType = 'records'
export const TypeSequence: SequenceType = 'sequence'
export const TypeTrack: TrackType = 'track'
export const TypeVideo: VideoType = 'video'
export const TypeVideoStream: VideoStreamType = 'videostream'


export type StorableType = EffectType | MashType 
export type StorableTypes = StorableType[]
export const TypesStorable: StorableTypes = [TypeEffect, TypeMash]
export const isStorableType = (type?: any): type is StorableType => {
  return isString(type) && TypesStorable.includes(type as StorableType)
}

export type SizingMediaType = FontType | ImageType | VideoType
export const TypesSizingMedia: SizingMediaType[] = [TypeFont, TypeImage, TypeVideo]
export const isSizingMediaType = (type?: any): type is SizingMediaType => {
  return TypesSizingMedia.includes(type)
}

export type TimingMediaType = AudioType | VideoType 
export const TypesTimingMedia: TimingMediaType[] = [TypeAudio, TypeVideo]
export const isTimingMediaType = (type?: any): type is TimingMediaType => {
  return TypesTimingMedia.includes(type)
}

export type ContainingType = FontType | ImageType 
export const TypesContaining: ContainingType[] = [TypeFont, TypeImage]
export const isContainingType = (type?: any): type is ContainingType => {
  return TypesContaining.includes(type)
}

export type ContentingType = ImageType | VideoType | AudioType
export const TypesContenting: ContentingType[] = [TypeImage, TypeVideo, TypeAudio]
export const isContentingType = (type?: any): type is ContentingType => {
  return TypesContenting.includes(type)
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

export type SelectorType = ClipType | ContainerType | ContentType | MashType | NoneType | TrackType | EffectType
export type SelectorTypes = SelectorType[]
export const TypesSelector: SelectorTypes = [TypeClip, TypeContainer, TypeContent, TypeMash, TypeNone, TypeTrack, TypeEffect]
export const isSelectorType = (type?: any): type is SelectorType => {
  return TypesSelector.includes(type)
}
export function assertSelectorType(value: any, name?: string): asserts value is SelectorType {
  if (!isSelectorType(value)) errorThrow(value, 'SelectorType', name)
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
  if (!isDataType(value)) errorThrow(value, 'DataType', name)
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
  if (!isDirection(value)) errorThrow(value, 'Direction', name)
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

