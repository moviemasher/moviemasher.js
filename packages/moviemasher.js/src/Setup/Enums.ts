

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
  Cast = 'cast',
}

enum AVType {
  Audio = 'audio',
  Both = 'both',
  Video = 'video',
}

enum RawType {
  Audio = 'audio',
  Video = 'video',
  Image = 'image',
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


enum OutputFormat {
  AudioConcat = 'wav',
  Dash = 'mdash',
  Flv = 'flv',
  Hls = 'hls',
  Jpeg = 'jpeg',
  Mp3 = 'mp3',
  Mp4 = 'mp4',
  Pipe = 'yuv4mpegpipe', // really an import format
  Png = 'png',
  Rtmp = 'rtmp',
  Rtmps = 'rtmps',
  VideoConcat = 'mpg',
}


enum OutputType {
  Audio = 'audio',
  Image = 'image',
  Video = 'video',
  VideoSequence = 'videosequence',
  Waveform = 'waveform',
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
  Cast = 'cast',
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

enum GraphFileType {
  Svg = 'svg',
  Png = 'png',
  Txt = 'txt',
}

enum LoadType {
  Audio = 'audio',
  Font = 'font',
  Image = 'image',
  Video = 'video',
}
const LoadTypes = Object.values(LoadType)

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

enum GraphType {
  Canvas = 'canvas',
  Mash = 'mash',
  Cast = 'cast',
}

const OutputFormats = Object.values(OutputFormat)

enum ServerType {
  Api = 'api',
  Data = 'data',
  File = 'file',
  Rendering = 'rendering',
  Streaming = 'streaming',
  Web = 'web',
}
const ServerTypes = Object.values(ServerType)

export {
  ActionType,
  AVType,
  ClipType,
  ClipTypes,
  GraphType,
  DataType,
  DataTypes,
  DefinitionType,
  DefinitionTypes,
  EditType,
  EventType,
  GraphFileType,
  LoadType,
  LoadTypes,
  MasherAction,
  ModuleType,
  ModuleTypes,
  MoveType,
  OutputFormat,
  OutputFormats,
  OutputType,
  RawType,
  ServerType,
  ServerTypes,
  TrackType,
  TrackTypes,
  TransformType,
  TransformTypes,
}
