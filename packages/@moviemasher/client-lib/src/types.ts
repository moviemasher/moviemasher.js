import type { AssetObject, AssetObjects, AssetObjectsResponse, AssetParams, Assets, AudibleAsset, AudibleInstance, AudioAsset, AudioInstance, ChangeEdit, ChangePropertiesEditObject, ChangePropertyEditObject, ClientAssets, ClientAudibleAsset, ClientClip, ClientImage, ClientInstance, ClientMashAsset, ClientMashDescription, ClientMashDescriptionOptions, ClientAsset, ClientTrack, ClientVisibleAsset, Clip, Clips, ContainerAsset, ContainerInstance, DataOrError, DataType, DecodeOptions, Decoding, DecodingType, EditObject, EncodeArgs, Encoding, Exporter, Exporters, Identified, ImageAsset, ImageInstance, Importer, Importers, Instance, ManageTypes, MashAssetObject, MashAudioAssetObject, MashDescriptionArgs, MashImageAssetObject, MashVideoAssetObject, Ordered, Propertied, Property, PropertyId, PropertyIds, RawType, RawTypes, Rect, Scalar, ScalarsById, SegmentDescription, SegmentDescriptionArgs, SelectorTypes, ServerProgress, Size, Source, Sources, Strings, SvgElement, SvgItem, SvgItems, TargetId, TargetIds, Time, TrackObject, TranscodeOptions, Transcoding, TranscodingType, ValueRecord, VideoAsset, VideoInstance } from '@moviemasher/shared-lib/types.js'

declare global { 
  interface Window { webkitAudioContext: typeof AudioContext } 
}

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
  mash?: MashAssetObject
}

export interface MasherOptions extends Partial<MasherArgs> {}

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
  clips: Clips
  insertIndex?: number
  trackIndex: number
  redoFrame?: number
}

export interface AddTrackEditObject extends EditObject {
  mashAsset: ClientMashAsset
  createTracks: number
}

export interface MoveClipEditObject extends AddTrackEditObject {
  clip: Clip
  insertIndex?: number
  redoFrame?: number
  trackIndex: number
  undoFrame?: number
  undoInsertIndex?: number
  undoTrackIndex: number
}

export interface RemoveClipEditObject extends EditObject {
  clip: Clip
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


export interface ClientRawAudioAsset extends ClientAsset, ClientAudioAsset, ClientAudibleAsset {}

export interface ClientRawImageAsset extends ClientAsset, ClientImageAsset {}

export interface ClientRawVideoAsset extends ClientAsset, ClientVideoAsset {
  clientImagePromise(assetTime: Time, size?: Size): Promise<DataOrError<ClientImage>>
  clientImage(assetTime: Time, size?: Size): DataOrError<ClientImage>
}

export interface ClientRawInstance extends Instance, ClientInstance {
  asset: ClientAsset
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


export interface ClientTrackArgs extends TrackObject {
  mashAsset: ClientMashAsset
}

export interface ClientImporter extends Importer {}

export interface ClientImporters extends Array<ClientImporter>{}

export interface ClientExporter extends Exporter {
  icon: Node
  ui: Node
}

export interface ClientExporters extends Array<ClientExporter>{}

export interface AudioPreview {
  adjustGain(audible: AudibleInstance): void
  buffer: number
  bufferClips(clips: Clip[], quantize: number): boolean 
  seconds: number
  // setGain(value : number, quantize: number): void
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

export interface ClientImageAsset extends ImageAsset, ClientVisibleAsset {}

export interface ClientVideoAsset extends VideoAsset, ClientAudibleAsset, ClientVisibleAsset {}

export interface ClientAudioAsset extends AudioAsset, ClientAsset, AudibleAsset {}

export interface ClientAudioInstance extends AudioInstance, ClientInstance, AudibleInstance {
  asset: ClientAudioAsset
  clip: ClientClip
}

export interface EventFunction<T=Event> {
  (event: T): void
}

export interface EventEnabledClientActionDetail {
  clientAction: string
  enabled?: boolean
}

export interface EventClientDecodeDetail {
  options?: DecodeOptions
  decodingType: DecodingType
  asset: ClientAsset
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
  asset: ClientAsset
  promise?: Promise<DataOrError<Transcoding>>
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
  serverAction: string
  id?: string
  promise?: Promise<void>
}

export interface EventEnabledServerActionDetail {
  serverAction: string
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
  selectable?: Propertied | false
}

export interface EventChangeScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

export interface EventClipDetail {
  clipId: string
  clip?: Clip
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
  assetObject: AssetObject
  promise?: Promise<DataOrError<ClientAsset>>
}

export interface EventExportersDetail {
  exporters: Exporters
}

export interface TrackClipsEventDetail {
  trackIndex: number
  clips?: Clips
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

export interface ClientMashDescriptionArgs extends MashDescriptionArgs, ClientMashDescriptionOptions {
  selectedClip?: Clip
  clip?: Clip
  mash: ClientMashAsset
  time: Time
}

export interface ClientSegmentDescription extends SegmentDescription {
  clip: ClientClip
  /** Item for display of clip itself */
  svgItem(animate: boolean): SvgItem
  /** Items for display of clip's bounds and outline. */
  svgItems(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
}

export interface ClientSegmentDescriptions extends Array<ClientSegmentDescription>{}

export interface ClientSegmentDescriptionArgs extends SegmentDescriptionArgs {
  clip: ClientClip
  mashDescription: ClientMashDescription
}

export interface ClientContainerInstance extends ClientInstance, ContainerInstance {
  asset: ClientAsset & ContainerAsset
  clip: ClientClip
}
