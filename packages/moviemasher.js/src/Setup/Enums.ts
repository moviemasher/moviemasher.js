import { isPopulatedString, isString } from "../Utility/Is"


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
  return isString(value) && LayerTypes.includes(value as LayerType)
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
  Freeze ='freeze',
  MoveClip = 'moveClip',
  MoveEffect = 'moveEffect',
  MoveLayer = 'moveLayer',
  RemoveClip = 'removeClip',
  RemoveLayer = 'removeLayer',
  Split = 'split',
}

export enum EditType {
  Mash = 'mash',
  Cast = 'cast',
}
export const EditTypes = Object.values(EditType)
export const isEditType = (value?: any): value is EditType => {
  return isString(value) && EditTypes.includes(value as EditType)
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
  Merger = 'merger',
  Scaler = 'scaler',
}


export const SelectTypes = Object.values(SelectType)
export type SelectTypes = SelectType[]
export enum SelectionType {
  Cast = 'cast',
  Mash = 'mash',
  Track = 'track',
  Layer = 'layer',
  Clip = 'clip',
  Effect = 'effect',
}



export const SelectionTypes = Object.values(SelectionType)

export const isSelectionType = (value?: any): value is SelectionType => {
  return isString(value) && SelectionTypes.includes(value as SelectionType)
}

export enum TrackType {
  Audio = 'audio',
  Transition = 'transition',
  Video = 'video',
  Matte = 'matte',
}
export const TrackTypes = Object.values(TrackType)
export const isTrackType = (value?: any): value is TrackType => {
  return isString(value) && TrackTypes.includes(value as TrackType)
}

export enum ClipType {
  Audio = 'audio',
  Frame = 'frame',
  Image = 'image',
  Theme = 'theme',
  Transition = 'transition',
  Video = 'video',
  VideoSequence = 'videosequence',
  VideoStream = 'videostream',
  // AudioStream = 'audiostream',
}
export const ClipTypes = Object.values(ClipType)

// TODO: migrate Ext* constants here
export enum Extension {
  Mpg = 'mpg',

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

export enum DefinitionType {
  Audio = 'audio',
  // AudioStream = 'audiostream',
  Effect = 'effect',
  Filter = 'filter',
  Font = 'font',
  Image = 'image',
  Merger = 'merger',
  Scaler = 'scaler',
  Theme = 'theme',
  Transition = 'transition',
  Video = 'video',
  VideoSequence = 'videosequence',
  VideoStream = 'videostream',
}
export const DefinitionTypes = Object.values(DefinitionType)
export const isDefinitionType = (type?: any): type is DefinitionType => {
  return isPopulatedString(type) && DefinitionTypes.includes(type as DefinitionType)
}

export function assertDefinitionType(type?: any): asserts type is DefinitionType {
  if (!isDefinitionType(type)) throw new Error("expected DefinitionType")
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

export enum ModuleType {
  Effect ='effect',
  Font = 'font',
  Merger = 'merger',
  Scaler = 'scaler',
  Theme = 'theme',
  Transition = 'transition',
}

export enum GraphFileType {
  Svg = 'svg',
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

export enum MoveType {
  Audio = 'audio',
  Effect = 'effect',
  Video = 'video',
}

export enum DataType {
  Boolean = 'boolean',
  Direction4 = 'direction4',
  Direction8 = 'direction8',
  Font = 'font',
  Frame = 'frame',
  Merger = 'merger',
  Mode = 'mode',
  Number = 'number',
  Rgb = 'rgb',
  Rgba = 'rgba',
  Scaler = 'scaler',
  String = 'string',
  Track = 'track',
}
export const DataTypes = Object.values(DataType)

export enum TransformType {
  Merger = 'merger',
  Scaler = 'scaler',
}

export const TransformTypes = Object.values(TransformType)

export enum MasherAction {
  Freeze = 'freeze',
  Redo = 'redo',
  Remove = 'remove',
  Render = 'render',
  Save = 'save',
  Split = 'split',
  Undo = 'undo',
}

export enum GraphType {
  Canvas = 'canvas',
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
