

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
}

const ClipTypes = Object.values(ClipType)

// NOTE: order important here - determines initialization
enum DefinitionType {
  Filter = 'filter',
  Merger = 'merger',
  Scaler = 'scaler',
  Effect = 'effect',
  Audio = 'audio',
  Font = 'font',
  Image = 'image',
  Mash = 'mash',
  Masher = 'masher',
  Theme = 'theme',
  Transition = 'transition',
  Video = 'video',
}
const DefinitionTypes = Object.values(DefinitionType)

enum EventType {
  Action = 'action',
  Canvas = 'canvaschange',
  Ended = 'ended',
  Duration = 'durationchange',
  Fps = 'ratechange',
  Loaded = 'loadeddata',
  Pause = 'pause',
  Play = 'play',
  Playing = 'playing',
  Seeking = 'seeking',
  Seeked = 'seeked',
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
  Hex = 'hex',
  Integer = 'integer',
  Mode = 'mode',
  Number = 'number',
  Pixel = 'pixel',
  Rgb = 'rgb',
  Rgba = 'rgba',
  Scalar = 'scalar',
  String = 'string',
  Text = 'text',
}
const DataTypes = Object.values(DataType)

enum TransformType {
  Merger = 'merger',
  Scaler = 'scaler'
}

const TransformTypes = Object.values(TransformType)

export {
  ActionType,
  ClipType,
  ClipTypes,
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
