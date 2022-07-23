import { isPopulatedString, throwError } from "../Utility/Is"

export enum Phase {
  Initialize = 'initialize',
  Populate = 'populate',
  Finalize = 'finalize',
}
export const Phases = Object.values(Phase)
export const isPhase = (value: any): value is Phase => {
  return isPopulatedString(value) && Phases.includes(value as Phase)
}

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
  return isPopulatedString(value) && LayerTypes.includes(value as LayerType)
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
  ChangeFrames = 'changeFrames',
  ChangeGain = 'changeGain',
  ChangeTrim = 'changeTrim',
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
  return isPopulatedString(value) && EditTypes.includes(value as EditType)
}

export enum AVType {
  Audio = 'audio',
  Both = 'both',
  Video = 'video',
}

export enum SelectType {
  Cast = 'cast',
  Mash = 'mash',
  Track = 'track',
  Layer = 'layer',
  Clip = 'clip',
  Effect = 'effect',
  Content = 'content',
  Container = 'container',
}

export const SelectTypes = Object.values(SelectType)
export const isSelectType = (value?: any): value is SelectType => {
  return isPopulatedString(value) && SelectTypes.includes(value as SelectType)
}
export type ClipSelectType = SelectType.Content | SelectType.Container
export const ClipSelectTypes = [SelectType.Content, SelectType.Container]
export const isClipSelectType = (type?: any): type is ClipSelectType => {
  return isSelectType(type) && ClipSelectTypes.includes(type)
}



export enum TrackType {
  Audio = 'audio',
  Video = 'video',
}
export const TrackTypes = Object.values(TrackType)
export const isTrackType = (value?: any): value is TrackType => {
  return isPopulatedString(value) && TrackTypes.includes(value as TrackType)
}

export enum OutputFormat {
  AudioConcat = 'wav',
  Mdash = 'mdash',
  Flv = 'flv',
  Hls = 'hls',
  Jpeg = 'jpeg',
  Mp3 = 'mp3',
  Mp4 = 'mp4',
  VideoConcat = 'yuv4mpegpipe',
  Png = 'image2',
  Rtmp = 'rtmp',
}

export enum StreamingFormat {
  Hls = 'hls',
  Rtmp = 'rtmp',
  Mdash = 'mdash',
}


export enum OutputType {
  Audio = 'audio',
  Image = 'image',
  Video = 'video',
  ImageSequence = 'imagesequence',
  Waveform = 'waveform',
}
export const OutputTypes = Object.values(OutputType)

export enum FillType {
  Color = 'color',
  Fill = 'fill',
}
export const FillTypes = Object.values(FillType)
export const isFillType = (type?: any): type is FillType => {
  return isPopulatedString(type) && FillTypes.includes(type as FillType)
}


export enum DefinitionType {
  Audio = 'audio',
  ColorContent = 'colorcontent',
  Effect = 'effect',
  Filter = 'filter',
  Font = 'font',
  Image = 'image',
  ShapeContainer = 'shapecontainer',
  TextContainer = 'textcontainer',
  Video = 'video',
  VideoSequence = 'videosequence',
  Visible = 'visible',
  Container = 'container',
  Content = 'content',
  Clip = 'clip',
}
export const DefinitionTypes = Object.values(DefinitionType)
export const isDefinitionType = (type?: any): type is DefinitionType => {
  return isPopulatedString(type) && DefinitionTypes.includes(type as DefinitionType)
}
export function assertDefinitionType(value?: any, message = ''): asserts value is DefinitionType {
  if (!isDefinitionType(value)) throw new Error(`expected '${value}' to be DefinitionType ${message}`)
}

export type ContainerType = DefinitionType.Image | DefinitionType.ShapeContainer | DefinitionType.Video | DefinitionType.TextContainer | DefinitionType.VideoSequence
export const ContainerTypes = [DefinitionType.Image, DefinitionType.ShapeContainer, DefinitionType.Video, DefinitionType.TextContainer, DefinitionType.VideoSequence]
export const isContainerType = (type?: any): type is ContainerType => {
  return isDefinitionType(type) && ContainerTypes.includes(type)
}
export function assertContainerType(type?: any): asserts type is ContainerType {
  if (!isContainerType(type)) throw new Error("expected ContainerType")
}

export type ContentType = DefinitionType.ColorContent | DefinitionType.Image | DefinitionType.Video | DefinitionType.VideoSequence | DefinitionType.Audio
export const ContentTypes = [DefinitionType.ColorContent, DefinitionType.Image, DefinitionType.Video, DefinitionType.VideoSequence, DefinitionType.Audio]
export const isContentType = (type?: any): type is ContentType => {
  return isDefinitionType(type) && ContentTypes.includes(type)
}
export function assertContentType(type?: any): asserts type is ContentType {
  if (!isContentType(type)) throw new Error("expected ContentType")
}
export enum DataType {
  Boolean = 'boolean',
  Direction4 = 'direction4',
  Direction8 = 'direction8',
  FontId = 'fontid',
  ContainerId = 'containerid',
  ContentId = 'contentid',
  DefinitionId = 'definitionid',
  Frame = 'frame',
  Mode = 'mode',
  Number = 'number',
  Percent = 'percent',
  Rgb = 'rgb',
  Rgba = 'rgba',
  String = 'string',
  Orientation = 'orientation',
  Track = 'track',
}
export const DataTypes = Object.values(DataType)
export const isDataType = (type?: any): type is DataType => {
  return isPopulatedString(type) && DataTypes.includes(type as DataType)
}

export enum Orientation {
  H = 'H',
  V = 'V',
}
export const Orientations = Object.values(Orientation)
export const isOrientation = (value: any): value is any => {
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
  return isPopulatedString(value) && Directions.includes(value as Direction)
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



export type PropertyType = DataType // | DefinitionType
export const isPropertyType = (value: any): value is PropertyType => {
  return isDataType(value) //|| isDefinitionType(value)
}
export function assertPropertyType(value: any, name?: string): asserts value is PropertyType {
  if (!isPropertyType(value)) throwError(value, "PropertyType", name)
}

export enum TriggerType {
  Init = 'init',
  Stop = 'stop',
  Start = 'start',
}
export const TriggerTypes = Object.values(TriggerType)
export const isTriggerType = (type?: any): type is TriggerType => {
  return isPopulatedString(type) && TriggerTypes.includes(type as TriggerType)
}

export enum TransformType {
  Scale = 'scale',
  Translate = 'translate',
}

export enum EventType {
  Action = 'action',
  Cast = 'cast',
  Draw = 'draw',
  Duration = 'durationchange',
  Ended = 'ended',
  Fps = 'ratechange',
  Loaded = 'loadeddata',
  Mash = 'mashchange',
  Pause = 'pause',
  Play = 'play',
  Playing = 'playing',
  Render = 'render',
  Save = 'save',
  Seeked = 'seeked',
  Seeking = 'seeking',
  Selection = 'selection',
  Time = 'timeupdate',
  Track = 'track',
  Volume = 'volumechange',
  Waiting = 'waiting',
}

export enum GraphFileType {
  Svg = 'svg',
  SvgSequence = 'svgsequence',
  Png = 'png',
  Txt = 'txt',
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
