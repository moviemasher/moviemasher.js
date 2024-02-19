import type { SvgElement, AVType, Asset, AssetObject, AssetObjects, AssetObjectsResponse, AssetParams, RawType, RawTypes, Assets, AudibleAsset, AudibleAssetObject, AudibleInstance, AudioAsset, AudioAssetObject, AudioInstance, ChangeEditObject, ChangePropertiesEditObject, ChangePropertyEditObject, EndpointRequest, Clip, ClipObject, ColorAsset, ColorAssetObject, ColorInstance, ContainerSvgItemArgs, ContentInstance, ContentSvgItemArgs, DataOrError, DataType, DecodeOptions, Decoding, DecodingType, Directions, EditArgs, EditObject, EncodeArgs, Encoding, Encodings, Exporter, Exporters, Identified, ImageAsset, ImageAssetObject, ClientImage, ImageInstance, Importer, Importers, Instance, ManageTypes, MashAsset, MashAssetObject, MashAudioAssetObject, MashDescription, MashDescriptionArgs, MashDescriptionOptions, MashVideoAssetObject, MaybeComplexSvgItem, Ordered, Panel, Propertied, Property, PropertyId, PropertyIds, RawAsset, RawAssetObject, Rect, Resource, Scalar, ScalarsById, SegmentDescription, SegmentDescriptionArgs, SelectorType, SelectorTypes, ShapeAsset, ShapeAssetObject, ShapeInstance, Size, Source, Sources, StringDataOrError, Strings, SvgItem, SvgItems, SvgItemsRecord, SvgVector, TargetId, TargetIds, TextAsset, TextAssetObject, TextInstance, Time, TimeRange, Track, TrackObject, TranscodeOptions, Transcoding, TranscodingType, ValueRecord, VideoAsset, VideoAssetObject, VideoInstance, VisibleAsset, VisibleAssetObject, VisibleInstance, ClientAudio, ClientFont, ClientVideo, ServerProgress, MashImageAssetObject } from '@moviemasher/shared-lib/types.js'
import type { ContainerInstance } from '@moviemasher/shared-lib/types.js'

export type ClientAction = string
export type ServerAction = string 


export interface TranslateArgs extends Identified {
  values?: ValueRecord
}

export interface PropertiedChangeHandler {
  (property: string, value?: Scalar): void
}

export interface SelectedProperty {
  propertyId: PropertyId
  property: Property
  value?: Scalar
  frame?: number
}

export interface SelectedProperties extends Array<SelectedProperty>{}

export type SelectedPropertyRecord = Record<string, SelectedProperty>

export interface Selectable extends Propertied { 
  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject
  changeScalars(scalars: ScalarsById): ChangeEditObject
}

export interface Selectables extends Array<Selectable>{}

export interface SelectorTypesObject extends Record<string, SelectorType[]> {}

export interface Masher {
  load(data: AssetObject): Promise<void>
  unload(): void
}

export interface ClipLocation {
  index?: number
  track?: number
  frame?: number
}

export interface MasherArgs {
  buffer: number
  fps: number
  loop: boolean
  mash?: MashAssetObject
}

export interface MasherOptions extends Partial<MasherArgs> {}


export interface Edits {
  canRedo: boolean
  canSave: boolean
  canUndo: boolean
  create(object: EditObject): void
  redo(): void
  save(): void
  undo(): void
}

export interface Edit {
  redo(): void
  undo(): void
  updateSelection(): void
  affects: PropertyIds
}



export interface ChangeEdit extends Edit {
  target: Propertied
  updateEdit(object: ChangeEditObject): void
}

export interface ChangePropertyEdit extends ChangeEdit {
  property: PropertyId
  value?: Scalar
  valueNumber?: number
  updateEdit(object: ChangePropertyEditObject): void
}

export interface ChangePropertiesEdit extends ChangeEdit {
  redoValues: ScalarsById
  undoValues: ScalarsById
  updateEdit(object: ChangePropertiesEditObject): void
}

export interface AddClipsEditObject extends AddTrackEditObject {
  clips: ClientClips
  insertIndex?: number
  trackIndex: number
  redoFrame?: number
}

export interface AddTrackEditObject extends EditArgs {
  mashAsset: ClientMashAsset
  createTracks: number
}

export interface MoveClipEditObject extends AddTrackEditObject {
  clip: ClientClip
  insertIndex?: number
  redoFrame?: number
  trackIndex: number
  undoFrame?: number
  undoInsertIndex?: number
  undoTrackIndex: number
}

export interface RemoveClipEditObject extends EditArgs {
  clip: ClientClip
  index: number
  track: ClientTrack
}


export interface DropTarget {
  acceptsClip: boolean
  handleDragged(): void
  handleDropped(event: DragEvent): void 
  dropValid(dataTransfer: DataTransfer | null): boolean
  mashIndex(event: DragEvent): ClipLocation | undefined
  ondragenter(event: DragEvent): void 
  ondragleave(event: DragEvent): void 
  ondragover(event: DragEvent): void 
  ondrop(event: DragEvent): void
}

export interface Disablable {
  disabled: boolean
  handleChangedMashAsset(event: CustomEvent<ClientMashAsset | undefined>): void
}

export interface RectObserver {
  handleResize(): void
  rect?: Rect
}

export type ControlInput = HTMLInputElement | HTMLSelectElement

export interface ControlProperty {
  propertyId?: PropertyId
  selectedId?: string
  targetId?: TargetId
}

export interface SizeReactive {
  size?: Size
}

export interface ClientRawAsset extends RawAsset, ClientAsset {
  assetObject: ClientRawAssetObject
}

export interface ClientRawAudioAsset extends ClientRawAsset, ClientAudioAsset, ClientAudibleAsset {
  assetObject: ClientRawAudioAssetObject
}

export interface ClientRawImageAsset extends ClientRawAsset, ClientImageAsset {
  assetObject: ClientRawImageAssetObject
}

export interface ClientRawVideoAsset extends ClientRawAsset, ClientVideoAsset {
  assetObject: ClientRawVideoAssetObject
  loadedImagePromise(assetTime: Time, size?: Size): Promise<DataOrError<ClientImage>>
  loadedImage(assetTime: Time, size?: Size): DataOrError<ClientImage>
}

export interface ClientRawInstance extends Instance, ClientInstance {
  asset: ClientRawAsset
  clip: ClientClip
}

export interface ClientRawAudioInstance extends AudioInstance, ClientInstance, AudibleInstance {
  asset: ClientRawAudioAsset
  clip: ClientClip
}

export interface ClientRawImageInstance extends ImageInstance, ClientInstance {
  asset: ClientRawImageAsset
  clip: ClientClip
}

export interface ClientRawVideoInstance extends VideoInstance, ClientInstance {
  clip: ClientClip
  asset: ClientRawVideoAsset
}



export type ClientAudioDataOrError = DataOrError<ClientAudio>

export type ClientFontDataOrError = DataOrError<ClientFont>


export type ClientImageDataOrError = DataOrError<ClientImage>



export type ClientVideoDataOrError = DataOrError<ClientVideo>


export interface ClientMashAsset extends ClientAsset, MashAsset {
  assetObject: ClientMashAssetObject
  actions: Edits
  addClipToTrack(clip : ClientClip | ClientClips, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(object?: TrackObject): Track
  buffer: number
  changeTiming(propertied: Propertied, property: string, value : number) : void
  clearPreview(): void
  clipInstance(clipObject: ClipObject): ClientClip
  clips: ClientClips
  clipsInTimeOfType(time: Time, avType?: AVType): ClientClips
  composition: AudioPreview
  dispatchChanged(action: Edit): void
  draw() : void
  drawnTime? : Time
  encoding: string
  encodings: Encodings
  frame: number
  framesHaveChanged(frames?: number): void 
  loading: boolean
  elementsPromise(size?: Size | number, selectedClip?: ClientClip): Promise<SvgItems>
  paused: boolean
  putPromise(): Promise<void>
  mashDescription(options: ClientMashDescriptionOptions, selectedClip?: ClientClip): ClientMashDescription

  reload(): Promise<void> | undefined
  removeClipFromTrack(clip : ClientClip | ClientClips) : void
  removeTrack(index?: number): void
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeRange: TimeRange
  timeToBuffer: Time
  tracks: ClientTracks
  updateAssetId(oldId: string, newId: string): void
}

export interface ClientMashAudioAsset extends ClientMashAsset, ClientAudioAsset {
  assetObject: MashAudioAssetObject
}

export interface ClientMashImageAsset extends ClientMashAsset, ClientImageAsset {
  assetObject: MashImageAssetObject
}

export interface ClientMashVideoAsset extends ClientMashAsset, ClientVideoAsset {
  assetObject: MashVideoAssetObject
}

export interface ClientMashInstance extends ClientInstance, Instance {
  asset: ClientMashAsset
  clip: ClientClip
}

export interface ClientMashAudioInstance extends AudioInstance, ClientInstance {
  asset: ClientMashAudioAsset
  clip: ClientClip
}

export interface ClientMashImageInstance extends ImageInstance, ClientInstance {
  asset: ClientMashImageAsset
  clip: ClientClip
}

export interface ClientMashVideoInstance extends VideoInstance, ClientInstance {
  asset: ClientMashVideoAsset
  clip: ClientClip
}

export interface ClipIconArgs {
  clipSize: Size
  scale: number
  width?: number
  gap?: number
  audible: boolean
  visible: boolean
  audibleHeight: number
  visibleHeight: number
}

export interface ClientClip extends Selectable, Clip {
  svgItemPromise(args: ClipIconArgs): Promise<DataOrError<SvgElement>>
  elementPromise(size: Size, time: Time, component: Panel): Promise<DataOrError<SvgItemsRecord>>
  container?: ClientVisibleInstance & ContainerInstance
  content: ClientInstance & ContentInstance | ClientAudioInstance
  track: ClientTrack
  updateAssetId(oldId: string, newId: string): void
}
export interface ClientClips extends Array<ClientClip>{}

export interface ClientTrack extends Track {
  addClips(clip: ClientClips, insertIndex?: number): void
  clips: ClientClips
  frameForClipNearFrame(clip: ClientClip, frame?: number): number
  mash: ClientMashAsset
  removeClips(clip: ClientClips): void
}

export interface ClientTracks extends Array<ClientTrack>{}

export interface ClientTrackArgs extends TrackObject {
  mashAsset: ClientMashAsset
}

export interface ClientMashAssetObject extends MashAssetObject {
  encodings?: Encodings
  encoding?: string
}

export interface ClientImporter extends Importer {}

export interface ClientImporters extends Array<ClientImporter>{}

export interface ClientExporter extends Exporter {
  icon: Node
  ui: Node
}

export interface ClientExporters extends Array<ClientExporter>{}

export interface ClientAudibleAsset extends ClientAsset, AudibleAsset {
  assetObject: AudibleAssetObject
  audibleSource(): AudioBufferSourceNode | undefined
  loadedAudio?: ClientAudio
}

export interface ClientVisibleAsset extends ClientAsset, VisibleAsset {
  assetObject: VisibleAssetObject
}


export interface ClientRawAssetObject extends ClientRawAudioAssetObject, ClientRawImageAssetObject, ClientRawVideoAssetObject {}

export interface ClientRawAudioAssetObject extends RawAssetObject {
  loadedAudio?: ClientAudio
}

export interface ClientRawImageAssetObject extends RawAssetObject {
  loadedImage?: ClientImage
}

export interface ClientRawVideoAssetObject extends RawAssetObject {
  loadedVideo?: ClientVideo
}

export interface ClientAsset extends Asset, Selectable {
  assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> 
  assetIconPromise(resource: Resource, options: Rect | Size, cover?: boolean): Promise<DataOrError<SvgItem>>
  imagePromise(resource: Resource): Promise<ClientImageDataOrError>
  saveNeeded: boolean
  savePromise(progress?: ServerProgress): Promise<StringDataOrError>
  unload(): void
}

export interface ClientAssets extends Array<ClientAsset>{}

export interface ClientAssetObject extends AssetObject {
}

export interface ClientAssetObjects extends Array<ClientAssetObject>{}

export interface AudioPreview {
  adjustClipGain(clip: Clip, quantize: number): void
  buffer: number
  bufferClips(clips: Clip[], quantize: number): boolean 
  seconds: number
  setGain(value : number, quantize: number): void
  startContext(): void
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean 
  stopContext(): void
  stopPlaying(): void  
}

export interface AudioPreviewArgs {
  buffer? : number
  gain? : number
}

export interface StartOptions {
  duration: number
  offset?: number
  start: number
}

export type Timeout = ReturnType<typeof setTimeout>

export interface ClientInstance extends Instance, Selectable {
  asset: ClientAsset
  clip: ClientClip
  directions: Directions
  unload(): void
}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  audiblePreviewPromise(outputSize: Size, scale?: number): Promise<DataOrError<SvgItem>>
  asset: ClientAudibleAsset
  clip: ClientClip
}

export interface ClientVisibleInstance extends VisibleInstance, ClientInstance {
  asset: ClientVisibleAsset
  clip: ClientClip
  clippedElementPromise(content: ClientVisibleInstance, args: ContainerSvgItemArgs): Promise<DataOrError<SvgItemsRecord>>
  containerSvgItemPromise(args: ContainerSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>>
  contentSvgItemPromise(args: ContentSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>>
}

export interface ClientImageAsset extends ImageAsset, ClientVisibleAsset {
  assetObject: ImageAssetObject
}

export interface ClientVideoAsset extends VideoAsset, ClientAudibleAsset, ClientVisibleAsset {
  assetObject: VideoAssetObject
  // previewTranscoding?: Resource
}

export interface ClientColorAsset extends ColorAsset, ClientAsset {
  assetObject: ColorAssetObject
}

export interface ClientShapeAsset extends ShapeAsset, ClientAsset {
  assetObject: ShapeAssetObject
}

export interface ClientColorInstance extends ColorInstance, ClientInstance {
  clip: ClientClip
  asset: ClientColorAsset
}

export interface ClientAudioAsset extends AudioAsset, ClientAsset, AudibleAsset {
  assetObject: AudioAssetObject
}

export interface ClientAudioInstance extends AudioInstance, ClientInstance, AudibleInstance {
  asset: ClientAudioAsset
  clip: ClientClip
}

export interface ClientShapeInstance extends ShapeInstance, ClientInstance {
  clip: ClientClip
  asset: ClientShapeAsset
}

export interface ClientTextAsset extends TextAsset, ClientAsset {
  assetObject: TextAssetObject
}

export interface ClientTextInstance extends TextInstance, ClientInstance {
  clip: ClientClip
  asset: ClientTextAsset
}

export interface ClientTextAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}

export interface EventFunction<T=Event> {
  (event: T): void
}


export interface EventEnabledClientActionDetail {
  clientAction: ClientAction
  enabled?: boolean
}

export interface EventClientDecodeDetail {
  options?: DecodeOptions
  decodingType: DecodingType
  asset: ClientRawAsset
  promise?: Promise<DataOrError<Decoding>>
  progress?: ServerProgress
}

export interface EventClientEncodeDetail extends EncodeArgs {
  promise?: Promise<DataOrError<Encoding>>
  progress?: ServerProgress
}

export interface EventClientTranscodeDetail {
  options?: TranscodeOptions
  transcodingType: TranscodingType
  asset: ClientRawAsset
  promise?: Promise<DataOrError<Transcoding>>
  progress?: ServerProgress
}

export interface EventSaveDetail {
  asset: ClientAsset
  promise?: Promise<StringDataOrError>
  progress?: ServerProgress
}

export interface UploadResult {
  assetRequest: EndpointRequest
  id?: string
}

export interface EventUploadDetail {
  id?: string
  request: EndpointRequest
  promise?: Promise<DataOrError<UploadResult>>
  progress?: ServerProgress
}

export interface EventDataTypeDetail {
  propertyId: PropertyId
  dataType?: DataType
}

export interface EventManagedAssetIconDetail {
  cover?: boolean
  assetId: string
  size: Size
  promise?: Promise<DataOrError<Element>>
}

export interface EventManagedAssetIdDetail {
  previousId: string
  currentId: string
}

export interface EventAddAssetsDetail {
  mashIndex?: ClipLocation
  assets: ClientAssets
}

export interface AssetEventDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ClientAsset
}
export interface EventProgressDetail {
  id: string
  progress: number
}

export interface EventDoServerActionDetail {
  serverAction: ServerAction
  id?: string
  promise?: Promise<void>
}

export interface EventEnabledServerActionDetail {
  serverAction: ServerAction
  enabled?: boolean
}

export interface EventClipElementDetail {
  maxWidth: number
  scale: number
  trackIndex: number
  trackWidth: number
  width: number
  left: number

  label?: string

  labels?: boolean
  icons?: boolean
  clipId: string
  element?: Element
}

export interface EventAssetElementDetail {
  cover?: boolean
  size: Size
  label?: string
  labels?: boolean
  icons?: boolean
  assetId: string
  element?: Element
}

export interface EventPropertyIdsDetail {
  targetIds: TargetIds
  propertyIds: PropertyIds
}

export interface EventClipIdDetail {
  clipId?: string
}

export interface EventSelectedPropertiesDetail {
  selectorTypes?: SelectorTypes
  selectedProperties: SelectedProperties
}

export interface EventPreviewsDetail {
  size?: number | Size
  promise?: Promise<SvgItems>
  elements?: SvgItems
}

export interface EventScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

export interface EventSelectableDetail {
  targetId: TargetId
  selectable?: Selectable | false
}

export interface EventChangeScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

export interface EventClipDetail {
  clipId: string
  clip?: ClientClip
}

export interface EventControlGroupDetail extends Ordered {
  propertyIds: PropertyIds
  selectedProperties?: SelectedProperties
  controlGroup?: Node
  groupedPropertyIds: PropertyIds
}

export interface EventControlDetail {
  type: DataType
  propertyId: PropertyId
  control?: Node
}

export interface EventInspectorSelectorsDetail {
  filter?: string
  selectorTypes: SelectorTypes
}

export interface EventImportDetail {
  fileList: FileList
  promise?: Promise<AssetObjects>
}

export interface EventImportFileDetail {
  source?: Source
  file: File
  promise?: Promise<DataOrError<AssetObject>>
}


export interface IconResponse {
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SvgElement
  svgString?: string
}

export interface EventIconDetail extends TranslateArgs {
  promise?: Promise<DataOrError<IconResponse>>
}

export interface AssetObjectEventDetail {
  assetType?: RawType
  promise?: Promise<DataOrError<AssetObject>>
}
export interface EventAssetObjectsDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<AssetObjectsResponse>>
}

export interface AssetObjectsParams extends AssetParams {
  sorts?: Strings
  manageTypes?: ManageTypes
  ignoreCache?: boolean
}

export interface EventManagedAssetsDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<Assets>>
}

export interface NodeFunction { (): Node }

export interface NodeFunctionMap extends Map<Node, NodeFunction> {}

export interface EventImporterNodeFunctionDetail {
  map: NodeFunctionMap
  types: RawTypes
  sources: Sources
}

export interface EventImportersDetail {
  importers: Importers
}

export interface EventImporterAddDetail {
  assetObject: ClientAssetObject
  promise?: Promise<DataOrError<ClientAsset>>
}

export interface EventExportersDetail {
  exporters: Exporters
}

export interface TrackClipsEventDetail {
  trackIndex: number
  clips?: ClientClips
  dense?: boolean
}

export interface EventTrackClipIconDetail {
  clipSize: Size
  clipId: string
  gap?: number
  scale: number
  promise?: Promise<DataOrError<SvgElement>>
  background?: SVGElement
}

export interface EventMoveClipDetail {
  clipId?: string
  clipLocation: ClipLocation
}

export interface EventTranslateDetail extends TranslateArgs {
  promise?: Promise<DataOrError<string>>
}

export interface EventPickDetail extends Required<EventPickedDetail> {}

export interface EventPickedDetail {
  picker: string
  picked?: string
}

export interface ClientMashDescription extends MashDescription {
  size: Size
  svgItemsPromise: Promise<SvgItems>
  elementsPromise: Promise<SvgItems>
  time: Time
  selectedClip?: ClientClip
  mash: ClientMashAsset
}

export interface ClientMashDescriptionOptions extends MashDescriptionOptions {
  selectedClip?: ClientClip
  clip?: ClientClip
}

export interface ClientMashDescriptionArgs extends MashDescriptionArgs, ClientMashDescriptionOptions {
  selectedClip?: ClientClip
  clip?: ClientClip
  mash: ClientMashAsset
  time: Time
}

export interface ClientSegmentDescription extends SegmentDescription {
  clip: ClientClip
  /** Item for display of clip itself */
  svgVector(classes: string[], inactive?: boolean): SvgVector
  /** Items for display of clip's bounds and outline. */
  svgItems(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
}

export interface ClientSegmentDescriptions extends Array<ClientSegmentDescription>{}

export interface ClientSegmentDescriptionArgs extends SegmentDescriptionArgs {
  clip: ClientClip
  mashDescription: ClientMashDescription
}
