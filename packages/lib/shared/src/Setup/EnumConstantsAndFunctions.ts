import type { 
  Lock, Sizing, Timing, SequenceType, WaveformType,
  CornerDirection, DirectionsArray, SideDirection 
} from '@moviemasher/runtime-shared'
import type { 
  ClipType, ContainerType, ContentType, MashType, NoneType,
  SelectorType, SelectorTypes, TrackType,
  AddClipActionType, AddTrackActionType, ChangeActionType, 
  ChangeFrameActionType, ChangeMultipleActionType, MoveClipActionType, 
  RemoveClipActionType 
} from '@moviemasher/runtime-client'

import type { RedoClientAction, RemoveClientAction, RenderClientAction, 
  SaveClientAction, UndoClientAction 
} from './ClientAction.js'
import type { 
  ContainingType, 
  ContentingType, JsonType, 
  SizingMediaType, TimingMediaType, 
} from './Enums.js'
import type { EventType } from './EventType.js'
import type { OutputFormat } from './OutputFormat.js'

import { errorThrow, TypeAudio, TypeImage, TypeFont, TypeVideo } from '@moviemasher/runtime-shared'

export const TypeClip: ClipType = 'clip'
export const TypeContainer: ContainerType = 'container'
export const TypeContent: ContentType = 'content'

export const TypeJson: JsonType = 'json'
export const TypeMash: MashType = 'mash'
export const TypeNone: NoneType = 'none'
export const TypeTrack: TrackType = 'track'

export const TypeSequence: SequenceType = 'sequence'
export const TypeWaveform: WaveformType = 'waveform'


export const TypesSizingMedia: SizingMediaType[] = [TypeFont, TypeImage, TypeVideo]
export const isSizingMediaType = (type?: any): type is SizingMediaType => {
  return TypesSizingMedia.includes(type)
}
export const TypesTimingMedia: TimingMediaType[] = [TypeAudio, TypeVideo]
export const isTimingMediaType = (type?: any): type is TimingMediaType => {
  return TypesTimingMedia.includes(type)
}
export const TypesContaining: ContainingType[] = [TypeFont, TypeImage]
export const isContainingType = (type?: any): type is ContainingType => {
  return TypesContaining.includes(type)
}

export const TypesContenting: ContentingType[] = [TypeImage, TypeVideo, TypeAudio]
export const isContentingType = (type?: any): type is ContentingType => {
  return TypesContenting.includes(type)
}
export const ClientActionRedo: RedoClientAction = 'redo'
export const ClientActionRemove: RemoveClientAction = 'remove'
export const ClientActionRender: RenderClientAction = 'render'
export const ClientActionSave: SaveClientAction = 'save'
export const ClientActionUndo: UndoClientAction = 'undo'

export const DurationUnknown = -1
export const DurationUnlimited = -2
export const DurationNone = 0

export const LockWidth: Lock = 'width'
export const LockHeight: Lock = 'height'
export const LockNone: Lock = 'none'

export const Locks: Lock[] = [LockWidth, LockHeight, LockNone]

export const isLock = (value: any): value is Lock => (
  Locks.includes(value as Lock)
)

export function assertLock(value: any, name?: string): asserts value is Lock {
  if (!isLock(value))
    errorThrow(value, 'Lock', name)
}


export const TimingCustom: Timing = 'custom'
export const TimingContent: Timing = 'content'
export const TimingContainer: Timing = 'container'
export const Timings = [TimingCustom, TimingContent, TimingContainer]

export const SizingPreview: Sizing = 'preview'
export const SizingContent: Sizing = 'content'
export const SizingContainer: Sizing = 'container'

export const Sizings = [SizingPreview, SizingContent, SizingContainer]


export const TypesSelector: SelectorTypes = [TypeClip, TypeContainer, TypeContent, TypeMash, TypeNone, TypeTrack]
export const isSelectorType = (type?: any): type is SelectorType => {
  return TypesSelector.includes(type)
}
export function assertSelectorType(value: any, name?: string): asserts value is SelectorType {
  if (!isSelectorType(value))
    errorThrow(value, 'SelectorType', name)
}

export const ActionTypeAddClip: AddClipActionType = 'add-clip'
export const ActionTypeAddTrack: AddTrackActionType = 'add-track'
export const ActionTypeChange: ChangeActionType = 'change'
export const ActionTypeChangeFrame: ChangeFrameActionType = 'change-frame'
export const ActionTypeChangeMultiple: ChangeMultipleActionType = 'change-multiple'
export const ActionTypeMoveClip: MoveClipActionType = 'move-clip'
export const ActionTypeRemoveClip: RemoveClipActionType = 'remove-clip'

export const EventTypeAction: EventType = 'action'
export const EventTypeActive: EventType = 'active'
export const EventTypeAdded: EventType = 'added'
export const EventTypeDraw: EventType = 'draw'
export const EventTypeDuration: EventType = 'durationchange'
export const EventTypeEnded: EventType = 'ended'
export const EventTypeFps: EventType = 'ratechange'
export const EventTypeFrame: EventType = 'frame'
export const EventTypeLoaded: EventType = 'loadeddata'
export const EventTypePause: EventType = 'pause'
export const EventTypePlay: EventType = 'play'
export const EventTypePlaying: EventType = 'playing'
export const EventTypeRender: EventType = 'render'
export const EventTypeResize: EventType = 'resize'
export const EventTypeSave: EventType = 'save'
export const EventTypeSeeked: EventType = 'seeked'
export const EventTypeSeeking: EventType = 'seeking'
export const EventTypeSelection: EventType = 'selection'
export const EventTypeTime: EventType = 'timeupdate'
export const EventTypeTrack: EventType = 'track'
export const EventTypeVolume: EventType = 'volumechange'
export const EventTypeWaiting: EventType = 'waiting'

const EventTypes = [
  EventTypeAction,
  EventTypeActive,
  EventTypeAdded,
  EventTypeDraw,
  EventTypeDuration,
  EventTypeEnded,
  EventTypeFps,
  EventTypeFrame,
  EventTypeLoaded,
  EventTypePause,
  EventTypePlay,
  EventTypePlaying,
  EventTypeRender,
  EventTypeResize,
  EventTypeSave,
  EventTypeSeeked,
  EventTypeSeeking,
  EventTypeSelection,
  EventTypeTime,
  EventTypeTrack,
  EventTypeVolume,
  EventTypeWaiting,
]
export const isEventType = (type?: any): type is EventType => {
  return EventTypes.includes(type as EventType)
}

export const DirectionEast: SideDirection = 'east'
export const DirectionNorth: SideDirection = 'north'
export const DirectionSouth: SideDirection = 'south'
export const DirectionWest: SideDirection = 'west'


export const SideDirections = [
  DirectionEast,
  DirectionNorth,
  DirectionSouth,
  DirectionWest,
]

export const isSideDirection = (value?: any): value is SideDirection => {
  return Directions.includes(value as SideDirection)
}
export function assertSideDirection(value: any, name?: string): asserts value is SideDirection {
  if (!isSideDirection(value))
    errorThrow(value, 'SideDirection', name)
}

export const DirectionNorthEast: CornerDirection = 'northeast'
export const DirectionNorthWest: CornerDirection = 'northwest'
export const DirectionSouthEast: CornerDirection = 'southeast'
export const DirectionSouthWest: CornerDirection = 'southwest'

export const CornerDirections = [
  DirectionNorthEast,
  DirectionNorthWest,
  DirectionSouthEast,
  DirectionSouthWest,
]

export const Directions: DirectionsArray = [
  ...CornerDirections,
  ...SideDirections,
]

export const OutputFormatWav: OutputFormat = 'wav'
export const OutputFormatFlv: OutputFormat = 'flv'
export const OutputFormatHls: OutputFormat = 'hls'
export const OutputFormatJpeg: OutputFormat = 'jpeg'
export const OutputFormatMdash: OutputFormat = 'mdash'
export const OutputFormatMp3: OutputFormat = 'mp3'
export const OutputFormatMp4: OutputFormat = 'mp4'
export const OutputFormatPng: OutputFormat = 'image2'
export const OutputFormatRtmp: OutputFormat = 'rtmp'
export const OutputFormatVideoConcat: OutputFormat = 'yuv4mpegpipe'
export const OutputFormatAudioConcat: OutputFormat = 'wav'


