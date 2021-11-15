

enum ActionType {
  AddTrack = 'addTrack',
  AddClipsToTrack = 'addClipsToTrack',
  MoveClips = 'moveClips',
  AddEffect = 'addEffect',
  Change = 'change',
  ChangeFrames = 'changeFrames',
  ChangeTrim = 'changeTrim',
  ChangeGain = 'changeGain',
  MoveEffects = 'moveEffects',
  Split = 'split',
  Freeze ='freeze',
  RemoveClips = 'removeClips',
}

enum TrackType {
  Audio = 'audio',
  Video = 'video',
}

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
  Mash = 'mash',
  Masher = 'masher',
  Theme = 'theme',
  Transition = 'transition',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  VideoStream = 'videostream',
  VideoSequence = 'videosequence',
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
  Time = 'timeupdate',
  Track = 'track',
  Volume = 'volumechange',
  Waiting = 'waiting',
}

enum MashType {
  Mash = DefinitionType.Mash,
}
const MashTypes = Object.values(MashType)

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
  Boolean = 'boolean',
  Direction4 = 'direction4',
  Direction8 = 'direction8',
  Font = 'font',
  Fontsize = 'fontsize',
  Integer = 'integer',
  Mode = 'mode',
  Number = 'number',
  Pixel = 'pixel',
  Rgb = 'rgb',
  Rgba = 'rgba',
  String = 'string',
  Text = 'text',
}
const DataTypes = Object.values(DataType)

enum TransformType {
  Merger = 'merger',
  Scaler = 'scaler'
}

const TransformTypes = Object.values(TransformType)

enum CommandType {
  File = 'file',
  Stream = 'stream'
}

const CommandTypes = Object.values(CommandType)

export {
  ActionType,
  ClipType,
  ClipTypes,
  CommandType,
  CommandTypes,
  DataType,
  DataTypes,
  DefinitionType,
  DefinitionTypes,
  EventType,
  LoadType,
  MashType,
  MashTypes,
  ModuleType,
  ModuleTypes,
  MoveType,
  TrackType,
  TransformType,
  TransformTypes,
}
