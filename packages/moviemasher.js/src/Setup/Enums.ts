
export enum ActionType {
  AddTrack = 'addTrack',
  AddClipToTrack = 'addClipToTrack',
  MoveClip = 'moveClip',
  AddEffect = 'addEffect',
  Change = 'change',
  ChangeFrames = 'changeFrames',
  ChangeTrim = 'changeTrim',
  ChangeGain = 'changeGain',
  MoveEffect = 'moveEffect',
  Split = 'split',
  Freeze ='freeze',
  RemoveClip = 'removeClip',
}

export enum EditType {
  Mash = 'mash',
  Cast = 'cast',
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
  Clip = 'clip',
  Effect = 'effect',
  Merger = 'merger',
  Scaler = 'scaler',
}

export enum TrackType {
  Audio = 'audio',
  Transition = 'transition',
  Video = 'video',
}
export const TrackTypes = Object.values(TrackType)

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

// export const StreamingFormats = Object.values(StreamingFormat).map(String)

export enum OutputType {
  Audio = 'audio',
  Image = 'image',
  Video = 'video',
  ImageSequence = 'imagesequence',
  Waveform = 'waveform',
}

export const OutputTypes = Object.values(OutputType)

// NOTE: order important here - determines initialization
export enum DefinitionType {
  Filter = 'filter',
  Merger = 'merger',
  Scaler = 'scaler',
  Effect = 'effect',
  Font = 'font',
  Theme = 'theme',
  Transition = 'transition',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  VideoStream = 'videostream',
  VideoSequence = 'videosequence',
  // Track = 'track',
  // AudioStream = 'audiostream',
}
export const DefinitionTypes = Object.values(DefinitionType)

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
