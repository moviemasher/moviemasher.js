import { isPopulatedString, isString } from "../Utility/Is"
import { errorsThrow } from "../Utility/Errors"

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
export function assertLayerType(value: any, name?: string): asserts value is LayerType {
  if (!isLayerType(value)) errorsThrow(value, 'LayerType', name) 
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
  Move = 'move',
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
  if (!isEditType(value)) errorsThrow(value, 'EditType', name)
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
  if (!isSelectType(value)) errorsThrow(value, 'SelectType', name)
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


export enum OutputType {
  Audio = 'audio',
  Image = 'image',
  Video = 'video',
  Font = 'font',
}
export const OutputTypes = Object.values(OutputType)


export enum TranscodeType {
  Audio = 'audio',
  Image = 'image',
  ImageSequence = 'imagesequence',
  Video = 'video',
  Waveform = 'waveform',
}
export const TranscodeTypes = Object.values(TranscodeType)
export const isTranscodeType = (type?: any): type is TranscodeType => {
  return isPopulatedString(type) && TranscodeTypes.includes(type as TranscodeType)
}


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
  if (!isLoadType(value)) errorsThrow(value, "LoadType", name)
}
export const UploadTypes = LoadTypes.filter(type => type !== LoadType.Font)
export const isUploadType = (type?: any): type is LoadType => {
  return isLoadType(type) && UploadTypes.includes(type)
}

export type AudioMediaType = 'audio'
export type EffectMediaType = 'effect'
export type FontMediaType = 'font'
export type ImageMediaType = 'image'
export type MashMediaType = 'mash'
export type SequenceMediaType = 'sequence'
export type VideoMediaType = 'video'

export const AudioType: AudioMediaType = 'audio'
export const EffectType: EffectMediaType = 'effect'
export const FontType: FontMediaType = 'font'
export const ImageType: ImageMediaType = 'image'
export const MashType: MashMediaType = 'mash'
export const SequenceType: SequenceMediaType = 'sequence'
export const VideoType: VideoMediaType = 'video'


export type MediaType = AudioMediaType | EffectMediaType | FontMediaType | ImageMediaType | MashMediaType | SequenceMediaType | VideoMediaType 
export const MediaTypes: MediaType[] = [AudioType, EffectType, FontType, ImageType, MashType, SequenceType, VideoType]
export const isMediaType = (value: any): value is MediaType => {
  return isString(value) && MediaTypes.includes(value as MediaType)
}
export function assertMediaType(value?: any, name?: string): asserts value is MediaType {
  if (!isMediaType(value)) errorsThrow(value, 'MediaType', name) 
}

export enum DefinitionType {
  Audio = 'audio',
  Effect = 'effect',
  Font = 'font',
  Image = 'image',
  Mash = 'mash',
  Sequence = 'sequence',
  Video = 'video',
}
const DefinitionTypes = Object.values(DefinitionType)
export const isDefinitionType = (type?: any): type is DefinitionType => {
  return DefinitionTypes.includes(type as DefinitionType)
}
export function assertDefinitionType(value?: any, name?: string): asserts value is DefinitionType {
  if (!isDefinitionType(value)) errorsThrow(value, 'DefinitionType', name) 
}

export type SizingDefinitionType = DefinitionType.Font | DefinitionType.Image | DefinitionType.Video | DefinitionType.Sequence
export const SizingDefinitionTypes = [DefinitionType.Font, DefinitionType.Image, DefinitionType.Video, DefinitionType.Sequence]
export const isSizingDefinitionType = (type?: any): type is SizingDefinitionType => {
  return isDefinitionType(type) && SizingDefinitionTypes.includes(type)
}

export type TimingDefinitionType = DefinitionType.Audio | DefinitionType.Video | DefinitionType.Sequence
export const TimingDefinitionTypes = [DefinitionType.Audio, DefinitionType.Video, DefinitionType.Sequence]
export const isTimingDefinitionType = (type?: any): type is TimingDefinitionType => {
  return isDefinitionType(type) && TimingDefinitionTypes.includes(type)
}

export type ContainerType = DefinitionType.Font | DefinitionType.Image | DefinitionType.Sequence
export const ContainerTypes = [DefinitionType.Font, DefinitionType.Image, DefinitionType.Sequence]
export const isContainerType = (type?: any): type is ContainerType => {
  return isDefinitionType(type) && ContainerTypes.includes(type)
}
export function assertContainerType(value?: any, name?: string): asserts value is ContainerType {
  if (!isContainerType(value)) errorsThrow(value, 'ContainerType', name) 
}

export type ContentType = DefinitionType.Image | DefinitionType.Video | DefinitionType.Sequence | DefinitionType.Audio
export const ContentTypes = [DefinitionType.Image, DefinitionType.Video, DefinitionType.Sequence, DefinitionType.Audio]
export const isContentType = (type?: any): type is ContentType => {
  return isDefinitionType(type) && ContentTypes.includes(type)
}
export function assertContentType(value?: any, name?: string): asserts value is ContentType {
  if (!isContentType(value)) errorsThrow(value, 'ContentType', name) 
}

export type DefinitionTypesObject = Record<string, DefinitionType[]>

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
  if (!isDataType(value)) errorsThrow(value, "DataType", name)
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
  if (!isDirection(value)) errorsThrow(value, "Direction", name)
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

export enum Clicking {
  Show = 'show',
  Hide = 'hide',
  Play = 'play',
}
export const Clickings = Object.values(Clicking)

