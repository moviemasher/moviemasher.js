

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

enum DefinitionType {
  Audio = 'audio',
  Effect = 'effect',
  Filter = 'filter',
  Font = 'font',
  Image = 'image',
  Mash = 'mash',
  Merger = 'merger',
  Scaler = 'scaler',
  Theme = 'theme',
  Transition = 'transition',
  Video = 'video',
}
const DefinitionTypes = Object.values(DefinitionType)

enum EventType {
  Action = 'action',
  Add = 'add',
  Duration = 'duration',
  Redo = 'redo',
  Truncate = 'truncate',
  Undo = 'undo',
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
