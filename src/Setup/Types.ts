const $action = "action"
const $add = "add"
const $audio = "audio"
const $frame = "frame"
const $duration = "duration"
const $effect = "effect"
const $filter = "filter"
const $font = "font"
const $image = "image"
const $load = "load"
const $merger = "merger"
const $module = "module"
const $redo = "redo"
const $scaler = "scaler"
const $theme = "theme"
const $transition = "transition"
const $truncate = "truncate"
const $undo = "undo"
const $video = "video"

const map = (type:string) => [type, type]

const ClipTypes = [$audio, $video, $image, $theme, $transition, $frame]
const ClipType = Object.fromEntries(ClipTypes.map(map))

const EventTypes = [$action, $load, $duration, $truncate, $add, $undo, $redo]
const EventType = Object.fromEntries(EventTypes.map(map))

const MediaTypes = [
  $audio, $image, $video,
  $theme, $transition,
  $scaler, $merger, $effect,
  $font, $filter
]

const MediaType = Object.fromEntries(MediaTypes.map(map))

const ModuleTypes = [$font, $effect, $scaler, $merger, $theme, $transition]
const ModuleType = Object.fromEntries(ModuleTypes.map(map))

const LoadTypes = [$font, $image, $audio, $module]
const LoadType = Object.fromEntries(LoadTypes.map(map))

const TrackTypes = [$audio, $video]
const TrackType = Object.fromEntries(TrackTypes.map(map))

const MoveTypes = [$effect, ...TrackTypes]
const MoveType = Object.fromEntries(MoveTypes.map(map))

const TransformTypes = [$merger, $scaler]
const TransformType = Object.fromEntries(TransformTypes.map(map))

export {
  LoadType, LoadTypes,
  ClipType, ClipTypes,
  EventType, EventTypes,
  MediaType, MediaTypes,
  ModuleType, ModuleTypes,
  MoveType, MoveTypes,
  TrackType, TrackTypes,
  TransformType, TransformTypes,
}
