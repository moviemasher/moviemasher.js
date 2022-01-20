

enum ActionType {
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

enum EditType {
  Mash = 'mash',
  Stream = 'stream',
}


enum TrackType {
  Audio = 'audio',
  Transition = 'transition',
  Video = 'video',
}
const TrackTypes = Object.values(TrackType)

enum ClipType {
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

const ClipTypes = Object.values(ClipType)

// NOTE: order important here - determines initialization
enum DefinitionType {
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
const DefinitionTypes = Object.values(DefinitionType)

enum EventType {
  Action = 'action',
  Duration = 'durationchange',
  Draw = 'draw',
  Ended = 'ended',
  Fps = 'ratechange',
  Loaded = 'loadeddata',
  Mash = 'mashchange',
  Pause = 'pause',
  Play = 'play',
  Playing = 'playing',
  Seeked = 'seeked',
  Seeking = 'seeking',
  Selection = 'selection',
  Stream = 'stream',
  Time = 'timeupdate',
  Track = 'track',
  Volume = 'volumechange',
  Waiting = 'waiting',
}

enum ModuleType {
  Effect ='effect',
  Font = 'font',
  Merger = 'merger',
  Scaler = 'scaler',
  Theme = 'theme',
  Transition = 'transition',
}
const ModuleTypes = Object.values(ModuleType)

enum LoadType {
  Audio = 'audio',
  Font = 'font',
  Image = 'image',
  Module = 'module',
  Video = 'video',
}

enum MoveType {
  Audio = 'audio',
  Effect = 'effect',
  Video = 'video',
}

enum DataType {
  String = 'string',
  Number = 'number',
  Numbers = 'numbers',

  Frame = 'frame',
  Track = 'track',

  Rgb = 'rgb',
  Rgba = 'rgba',

  Scaler = 'scaler',
  Merger = 'merger',
  Font = 'font',
  Effects = 'effects',
  Boolean = 'boolean',
  Direction4 = 'direction4',
  Direction8 = 'direction8',
  Mode = 'mode',
  Object = 'object'
}
const DataTypes = Object.values(DataType)

enum TransformType {
  Merger = 'merger',
  Scaler = 'scaler',
}

const TransformTypes = Object.values(TransformType)

enum MasherAction {
  Freeze = 'freeze',
  Redo = 'redo',
  Remove = 'remove',
  Save = 'save',
  Split = 'split',
  Undo = 'undo',
}

enum RenderType {
  Canvas = 'canvas',
  File = 'file',
  Stream = 'stream',
}

enum OutputFormat {
  Flv = 'flv',
  Hls = 'hls',
  Mdash = 'mdash',
  Rtmp = 'rtmp',
  Rtmps = 'rtmps',
  Mp4 = 'mp4',
  Mp3 = 'mp3',
}

enum ServerType {
  Api = 'api',
  Content = 'content',
  Encode = 'encode',
  Hls = 'hls',
  Rtmp = 'rtmp',
  Storage = 'storage',
  Webrtc = 'webrtc',
}
const ServerTypes = Object.values(ServerType)

const OutputFormats = Object.values(OutputFormat)

export {
  ActionType,
  ClipType,
  ClipTypes,
  RenderType,
  DataType,
  DataTypes,
  DefinitionType,
  DefinitionTypes,
  EditType,
  EventType,
  LoadType,
  MasherAction,
  ModuleType,
  ModuleTypes,
  MoveType,
  OutputFormat,
  OutputFormats,
  ServerType,
  ServerTypes,
  TrackType,
  TrackTypes,
  TransformType,
  TransformTypes,
}
