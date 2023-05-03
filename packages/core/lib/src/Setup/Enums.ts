import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'

export type AudioStreamType = 'audiostream'
export type AudioType = 'audio'
export type ClipType = 'clip'
export type ContainerType = 'container'
export type ContentType = 'content'
export type EffectType = 'effect'
export type FontType = 'font'
export type ImageType = 'image'
export type JsonType = 'json'
export type MashType = 'mash'
export type NoneType = 'none'
export type RecordsType = 'records'
export type RecordType = 'record'
export type SequenceType = 'sequence'
export type TrackType = 'track'
export type VideoStreamType = 'videostream'
export type VideoType = 'video'

export const TypeAudio: AudioType = 'audio'
export const TypeAudioStream: AudioStreamType = 'audiostream'
export const TypeClip: ClipType = 'clip'
export const TypeContainer: ContainerType = 'container'
export const TypeContent: ContentType = 'content'
export const TypeEffect: EffectType = 'effect'
export const TypeFont: FontType = 'font'
export const TypeImage: ImageType = 'image'
export const TypeJson: JsonType = 'json'
export const TypeMash: MashType = 'mash'
export const TypeNone: NoneType = 'none'
export const TypeRecord: RecordType = 'record'
export const TypeRecords: RecordsType = 'records'
export const TypeSequence: SequenceType = 'sequence'
export const TypeTrack: TrackType = 'track'
export const TypeVideo: VideoType = 'video'
export const TypeVideoStream: VideoStreamType = 'videostream'


export type StorableType = EffectType | MashType 
export type StorableTypes = StorableType[]
export const TypesStorable: StorableTypes = [TypeEffect, TypeMash]
export const isStorableType = (type?: any): type is StorableType => (
  TypesStorable.includes(type as StorableType)
)

export type SizingMediaType = FontType | ImageType | VideoType
export const TypesSizingMedia: SizingMediaType[] = [TypeFont, TypeImage, TypeVideo]
export const isSizingMediaType = (type?: any): type is SizingMediaType => {
  return TypesSizingMedia.includes(type)
}

export type TimingMediaType = AudioType | VideoType 
export const TypesTimingMedia: TimingMediaType[] = [TypeAudio, TypeVideo]
export const isTimingMediaType = (type?: any): type is TimingMediaType => {
  return TypesTimingMedia.includes(type)
}

export type ContainingType = FontType | ImageType 
export const TypesContaining: ContainingType[] = [TypeFont, TypeImage]
export const isContainingType = (type?: any): type is ContainingType => {
  return TypesContaining.includes(type)
}

export type ContentingType = ImageType | VideoType | AudioType
export const TypesContenting: ContentingType[] = [TypeImage, TypeVideo, TypeAudio]
export const isContentingType = (type?: any): type is ContentingType => {
  return TypesContenting.includes(type)
}

export type RedoClientAction = 'redo'
export type RemoveClientAction = 'remove'
export type RenderClientAction = 'render'
export type SaveClientAction = 'save'
export type UndoClientAction = 'undo'

export const ClientActionRedo: RedoClientAction = 'redo'
export const ClientActionRemove: RemoveClientAction = 'remove'
export const ClientActionRender: RenderClientAction = 'render'
export const ClientActionSave: SaveClientAction = 'save'
export const ClientActionUndo: UndoClientAction = 'undo'

export type ClientAction = RedoClientAction | RemoveClientAction | RenderClientAction | SaveClientAction | UndoClientAction


export const DurationUnknown = -1
export const DurationUnlimited = -2
export const DurationNone = 0

export type WidthLock = 'width'
export type HeightLock = 'height'
export type NoneLock = 'none'

export type Lock = WidthLock | HeightLock | NoneLock

export const LockWidth: Lock = 'width'
export const LockHeight: Lock = 'height'
export const LockNone: Lock = 'none'

export const Locks: Lock[] = [LockWidth, LockHeight, LockNone]
export const isLock = (value: any): value is Lock => (
  Locks.includes(value as Lock)
)

export function assertLock(value: any, name?: string): asserts value is Lock {
  if (!isLock(value)) errorThrow(value, 'Lock', name)
}



export type CustomTiming = 'custom'
export type ContentTiming = 'content'
export type ContainerTiming = 'container'
export type Timing = CustomTiming | ContentTiming | ContainerTiming


export const TimingCustom: Timing = 'custom'
export const TimingContent: Timing = 'content'
export const TimingContainer: Timing = 'container'



export const Timings = [TimingCustom, TimingContent, TimingContainer]

export type PreviewSizing = 'preview' 
export type ContentSizing = 'content'
export type ContainerSizing = 'container'
export type Sizing = PreviewSizing | ContentSizing | ContainerSizing

export const SizingPreview: Sizing = 'preview'
export const SizingContent: Sizing = 'content'
export const SizingContainer: Sizing = 'container'

export const Sizings = [SizingPreview, SizingContent, SizingContainer]


export type SelectorType = ClipType | ContainerType | ContentType | MashType | NoneType | TrackType | EffectType
export type SelectorTypes = SelectorType[]
export const TypesSelector: SelectorTypes = [TypeClip, TypeContainer, TypeContent, TypeMash, TypeNone, TypeTrack, TypeEffect]
export const isSelectorType = (type?: any): type is SelectorType => {
  return TypesSelector.includes(type)
}
export function assertSelectorType(value: any, name?: string): asserts value is SelectorType {
  if (!isSelectorType(value)) errorThrow(value, 'SelectorType', name)
}

export type AddClipActionType = 'add-clip'
export type AddTrackActionType = 'add-track'
export type ChangeActionType = 'change'
export type ChangeFrameActionType = 'change-frame'
export type ChangeMultipleActionType = 'change-multiple'
export type MoveActionType = 'move'
export type MoveClipActionType = 'move-clip'
export type RemoveClipActionType = 'remove-clip'

export type ActionType = AddClipActionType | AddTrackActionType | ChangeActionType | ChangeFrameActionType | ChangeMultipleActionType | MoveActionType | MoveClipActionType | RemoveClipActionType

export const ActionTypeAddClip: ActionType = 'add-clip'
export const ActionTypeAddTrack: ActionType = 'add-track'
export const ActionTypeChange: ActionType = 'change'
export const ActionTypeChangeFrame: ActionType = 'change-frame'
export const ActionTypeChangeMultiple: ActionType = 'change-multiple'
export const ActionTypeMove: ActionType = 'move'
export const ActionTypeMoveClip: ActionType = 'move-clip'
export const ActionTypeRemoveClip: ActionType = 'remove-clip'

export type ActionEventType = 'action'
export type ActiveEventType = 'active'
export type AddedEventType = 'added'
export type DrawEventType = 'draw'
export type DurationEventType = 'durationchange'
export type EndedEventType = 'ended'
export type FpsEventType = 'ratechange'
export type FrameEventType = 'frame'
export type LoadedEventType = 'loadeddata'
export type PauseEventType = 'pause'
export type PlayEventType = 'play'
export type PlayingEventType = 'playing'
export type RenderEventType = 'render'
export type ResizeEventType = 'resize'
export type SaveEventType = 'save'
export type SeekedEventType = 'seeked'
export type SeekingEventType = 'seeking'
export type SelectionEventType = 'selection'
export type TimeEventType = 'timeupdate'
export type TrackEventType = 'track'
export type VolumeEventType = 'volumechange'
export type WaitingEventType = 'waiting'

export type EventType = ActionEventType | ActiveEventType | AddedEventType | DrawEventType | DurationEventType | EndedEventType | FpsEventType | FrameEventType | LoadedEventType | PauseEventType | PlayEventType | PlayingEventType | RenderEventType | ResizeEventType | SaveEventType | SeekedEventType | SeekingEventType | SelectionEventType | TimeEventType | TrackEventType | VolumeEventType | WaitingEventType

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

export type BooleanDataType = 'boolean'
export type ContainerIdDataType = 'containerid'
export type ContentIdDataType = 'contentid'
export type DefinitionIdDataType = 'definitionid'
export type FontIdDataType = 'fontid'
export type FrameDataType = 'frame'
export type IconDataType = 'icon'
export type NumberDataType = 'number'
export type OptionDataType = 'option'
export type PercentDataType = 'percent'
export type RgbDataType = 'rgb'
export type StringDataType = 'string'

export type DataType = BooleanDataType | ContainerIdDataType | ContentIdDataType | DefinitionIdDataType | FontIdDataType | FrameDataType | IconDataType | NumberDataType | OptionDataType | PercentDataType | RgbDataType | StringDataType
export const DataTypeBoolean: DataType = 'boolean'
export const DataTypeContainerId: DataType = 'containerid'
export const DataTypeContentId: DataType = 'contentid'
export const DataTypeDefinitionId: DataType = 'definitionid'
export const DataTypeFontId: DataType = 'fontid'
export const DataTypeFrame: DataType = 'frame'
export const DataTypeIcon: DataType = 'icon'
export const DataTypeNumber: DataType = 'number'
export const DataTypeOption: DataType = 'option'
export const DataTypePercent: DataType = 'percent'
export const DataTypeRgb: DataType = 'rgb'
export const DataTypeString: DataType = 'string'




export const DataTypes = [
  DataTypeBoolean,
  DataTypeContainerId,
  DataTypeContentId,
  DataTypeDefinitionId,
  DataTypeFontId,
  DataTypeFrame,
  DataTypeIcon,
  DataTypeNumber,
  DataTypeOption,
  DataTypePercent,
  DataTypeRgb,
  DataTypeString,
]
export const isDataType = (type?: any): type is DataType => {
  return DataTypes.includes(type as DataType)
}
export function assertDataType(value: any, name?: string): asserts value is DataType {
  if (!isDataType(value)) errorThrow(value, 'DataType', name)
}

export type EastDirection = 'east'
export type NorthDirection = 'north'
export type SouthDirection = 'south'
export type WestDirection = 'west'

export type SideDirection = EastDirection | NorthDirection | SouthDirection | WestDirection



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
  if (!isSideDirection(value)) errorThrow(value, 'SideDirection', name)
}

export type SideDirectionObject = {
  [index in SideDirection]?: boolean
}

export type NorthEastDirection = 'northeast'
export type NorthWestDirection = 'northwest'
export type SouthEastDirection = 'southeast'
export type SouthWestDirection = 'southwest'

export type CornerDirection = NorthEastDirection | NorthWestDirection | SouthEastDirection | SouthWestDirection
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

export type Direction = SideDirection | CornerDirection
export type DirectionsArray = Direction[]

export const Directions: DirectionsArray = [
  ...CornerDirections,
  ...SideDirections,
]

export type WavOutputFormat = 'wav'
export type FlvOutputFormat = 'flv'
export type HlsOutputFormat = 'hls'
export type JpegOutputFormat = 'jpeg'
export type MdashOutputFormat = 'mdash'
export type Mp3OutputFormat = 'mp3'
export type Mp4OutputFormat = 'mp4'
export type PngOutputFormat = 'image2'
export type RtmpOutputFormat = 'rtmp'
export type VideoConcatOutputFormat = 'yuv4mpegpipe'

export type OutputFormat = WavOutputFormat | FlvOutputFormat | HlsOutputFormat | JpegOutputFormat | MdashOutputFormat | Mp3OutputFormat | Mp4OutputFormat | PngOutputFormat | RtmpOutputFormat | VideoConcatOutputFormat

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

export type SvgGraphFileType = 'svg'
export type SvgSequenceGraphFileType = 'svgsequence'
export type TxtGraphFileType = 'txt'

export type GraphFileType = SvgGraphFileType | SvgSequenceGraphFileType | TxtGraphFileType

export const GraphFileTypeSvg: GraphFileType = 'svg'
export const GraphFileTypeSvgSequence: GraphFileType = 'svgsequence'
export const GraphFileTypeTxt: GraphFileType = 'txt'

export type AudioAVType = 'audio'
export type BothAVType = 'both'
export type VideoAVType = 'video'

export type AVType = AudioAVType | BothAVType | VideoAVType

export const AVTypeAudio: AVType = 'audio'
export const AVTypeBoth: AVType = 'both'
export const AVTypeVideo: AVType = 'video'
