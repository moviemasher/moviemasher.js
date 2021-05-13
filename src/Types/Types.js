const action = "action"
const add = "add"
const audio = "audio"
const frame = "frame"
const duration = "duration"
const effect = "effect"
const filter = "filter"
const font = "font"
const image = "image"
const load = "load"
const merger = "merger"
const module = "module"
const redo = "redo"
const scaler = "scaler"
const theme = "theme"
const transition = "transition"
const truncate = "truncate"
const undo = "undo"
const video = "video"

const ActionTypes = [
  'addTrack',
  'addClipsToTrack',
  'moveClips',
  'addEffect',
  'change',
  'changeFrames',
  'changeTrim',
  'changeGain',
  'moveEffects',
  'split',
  'freeze',
  'removeClips',
]
const ActionType = Object.fromEntries(ActionTypes.map(type => [type, type]))

const ClipTypes = [audio, video, image, theme, transition, frame]
const ClipType = Object.fromEntries(ClipTypes.map(type => [type, type]))

const CompositionType = { audio, video }
const CompositionTypes = Object.values(CompositionType)

const DoType = { undo, redo }
const DoTypes = Object.values(DoType)

const EventType = { action, load, duration, truncate, add, ...DoTypes }
const EventTypes = Object.values(EventType)

const FilterTypes = [
  "blend",
  "chromakey",
  "colorchannelmixer",
  "color",
  "convolution",
  "crop",
  "drawbox",
  "drawtext",
  "fade",
  "overlay",
  "scale",
  "setsar",
]
const FilterType = Object.fromEntries(FilterTypes.map(type => [type, type]))

const MediaType = {
  audio, image, video, theme, scaler, merger, effect, font, transition, filter
}
const MediaTypes = Object.values(MediaType)

const ModuleType = {
  font, effect, scaler, merger, theme, transition,
}
const ModuleTypes = Object.values(ModuleType)

const LoadType = { font, image, audio, module }
const LoadTypes = Object.values(LoadType)

const TrackType = { audio, video }
const TrackTypes = Object.values(TrackType)

const MoveType = { effect, ...TrackType }
const MoveTypes = Object.values(MoveType)

const TransformType = { merger, scaler }
const TransformTypes = Object.values(TransformType)

export {
  ActionType, ActionTypes,
  ClipType, ClipTypes,
  CompositionType, CompositionTypes,
  DoType, DoTypes,
  EventType, EventTypes,
  FilterType, FilterTypes,
  LoadType, LoadTypes,
  MediaType, MediaTypes,
  ModuleType, ModuleTypes,
  MoveType, MoveTypes,
  TrackType, TrackTypes,
  TransformType, TransformTypes,
}
