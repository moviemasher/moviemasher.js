import { isPopulatedString } from "../Utility/Is"
import { throwError } from "../Utility/Throw"

export enum DroppingPosition {
  At = 'at',
  After = 'after',
  Before = 'before',
  None = 'none'
}

export enum LayerType {
  Mash = 'mash',
  Folder = 'folder',
}
export const LayerTypes = Object.values(LayerType)
export const isLayerType = (value: any): value is LayerType => {
  return LayerTypes.includes(value as LayerType)
}
export function assertLayerType(value: any): asserts value is LayerType {
  if (!isLayerType(value)) throw new Error('expected LayerType')
}

export enum ActionType {
  AddClipToTrack = 'addClipToTrack',
  AddEffect = 'addEffect',
  AddLayer = 'addLayer',
  AddTrack = 'addTrack',
  Change = 'change',
  ChangeMultiple = 'changeMultiple',
  ChangeFrame = 'changeFrame',
  ChangeGain = 'changeGain',
  MoveClip = 'moveClip',
  MoveEffect = 'moveEffect',
  MoveLayer = 'moveLayer',
  RemoveClip = 'removeClip',
  RemoveLayer = 'removeLayer',
}

export enum EditType {
  Mash = 'mash',
  Cast = 'cast',
}
export const EditTypes = Object.values(EditType)
export const isEditType = (value?: any): value is EditType => {
  return EditTypes.includes(value as EditType)
}
export function assertEditType(value: any, name?: string): asserts value is EditType {
  if (!isEditType(value)) throwError(value, 'EditType', name)
}


export enum AVType {
  Audio = 'audio',
  Both = 'both',
  Video = 'video',
}

export enum SelectType {
  Cast = 'cast',
  Clip = 'clip',
  Container = 'container',
  Content = 'content',
  Effect = 'effect',
  Layer = 'layer',
  Mash = 'mash',
  None = 'none',
  Track = 'track',
}

export const SelectTypes = Object.values(SelectType)
export const isSelectType = (value?: any): value is SelectType => {
  return SelectTypes.includes(value as SelectType)
}
export function assertSelectType(value: any, name?: string): asserts value is SelectType {
  if (!isSelectType(value)) throwError(value, 'SelectType', name)
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


export enum OutputType {
  Audio = 'audio',
  Image = 'image',
  ImageSequence = 'imagesequence',
  Video = 'video',
  Waveform = 'waveform',
}
export const OutputTypes = Object.values(OutputType)

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

export enum LoadType {
  Audio = 'audio',
  Font = 'font',
  Image = 'image',
  Video = 'video',
}
export const LoadTypes = Object.values(LoadType)
export const isLoadType = (type?: any): type is LoadType => {
  return isPopulatedString(type) && LoadTypes.includes(type as LoadType)
}
export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) throwError(value, "LoadType", name)
}
export const UploadTypes = LoadTypes.filter(type => type !== LoadType.Font)
export const isUploadType = (type?: any): type is LoadType => {
  return isLoadType(type) && UploadTypes.includes(type)
}

export enum DefinitionType {
  Audio = 'audio',
  Clip = 'clip',
  Container = 'container',
  Content = 'content',
  Effect = 'effect',
  Filter = 'filter',
  Font = 'font',
  Image = 'image',
  Video = 'video',
  VideoSequence = 'videosequence',
}
export const DefinitionTypes = Object.values(DefinitionType)
export const isDefinitionType = (type?: any): type is DefinitionType => {
  return DefinitionTypes.includes(type as DefinitionType)
}
export function assertDefinitionType(value?: any, message = ''): asserts value is DefinitionType {
  if (!isDefinitionType(value)) throw new Error(`expected '${value}' to be DefinitionType ${message}`)
}
export type SizingDefinitionType = DefinitionType.Container | DefinitionType.Image | DefinitionType.Video | DefinitionType.VideoSequence
export const SizingDefinitionTypes = [DefinitionType.Container, DefinitionType.Image, DefinitionType.Video, DefinitionType.VideoSequence]
export const isSizingDefinitionType = (type?: any): type is SizingDefinitionType => {
  return isDefinitionType(type) && SizingDefinitionTypes.includes(type)
}


export type TimingDefinitionType = DefinitionType.Audio | DefinitionType.Video | DefinitionType.VideoSequence
export const TimingDefinitionTypes = [DefinitionType.Audio, DefinitionType.Video, DefinitionType.VideoSequence]
export const isTimingDefinitionType = (type?: any): type is TimingDefinitionType => {
  return isDefinitionType(type) && TimingDefinitionTypes.includes(type)
}

export type ContainerType = DefinitionType.Image | DefinitionType.Container | DefinitionType.VideoSequence
export const ContainerTypes = [DefinitionType.Image, DefinitionType.Container, DefinitionType.VideoSequence]
export const isContainerType = (type?: any): type is ContainerType => {
  return isDefinitionType(type) && ContainerTypes.includes(type)
}
export function assertContainerType(type?: any): asserts type is ContainerType {
  if (!isContainerType(type)) throw new Error("expected ContainerType")
}

export type ContentType = DefinitionType.Content | DefinitionType.Image | DefinitionType.Video | DefinitionType.VideoSequence | DefinitionType.Audio
export const ContentTypes = [DefinitionType.Content, DefinitionType.Image, DefinitionType.Video, DefinitionType.VideoSequence, DefinitionType.Audio]
export const isContentType = (type?: any): type is ContentType => {
  return isDefinitionType(type) && ContentTypes.includes(type)
}
export function assertContentType(type?: any): asserts type is ContentType {
  if (!isContentType(type)) throw new Error("expected ContentType")
}

export type DefinitionTypesObject = Record<string, DefinitionType[]>

export enum DataType {
  Boolean = 'boolean',
  ContainerId = 'containerid',
  ContentId = 'contentid',
  DefinitionId = 'definitionid',
  FontId = 'fontid',
  Frame = 'frame',
  Number = 'number',
  Percent = 'percent',
  Rgb = 'rgb',
  String = 'string',
  Timing = 'timing',
  Sizing = 'sizing',
}
export const DataTypes = Object.values(DataType)
export const isDataType = (type?: any): type is DataType => {
  return DataTypes.includes(type as DataType)
}
export function assertDataType(value: any, name?: string): asserts value is DataType {
  if (!isDataType(value)) throwError(value, "DataType", name)
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
  if (!isDirection(value)) throwError(value, "Direction", name)
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
  Fps = 'ratechange',
  Loaded = 'loadeddata',
  Mash = 'mash',
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

export enum GraphType {
  Mash = 'mash',
  Cast = 'cast',
}

export enum ServerType {
  Api = 'api',
  Data = 'data',
  File = 'file',
  Rendering = 'rendering',
  Streaming = 'streaming',
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