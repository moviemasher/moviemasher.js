import type { AssetObject, AssetParams, AudioInstance, ChangeEdit, ChangePropertiesEditObject, ClientClip, ClientInstance, ClientMashAsset, ClientAsset, ClientTrack, Clip, Clips, ContainerAsset, ContainerInstance, EditObject, Exporter, Identified, ImageInstance, Importer, Instance, ManageTypes, MashAssetObject, MashAudioAssetObject, MashImageAssetObject, Property, PropertyId, Rect, Scalar, ScalarsById, Size, Strings, SvgElement, TargetId, TrackObject, ValueRecord, ClientAudioAsset, ClientImageAsset } from '@moviemasher/shared-lib/types.js'

declare global { 
  interface Window { webkitAudioContext: typeof AudioContext } 
}

export interface NodeFunction { (): Node }

export interface NodeFunctionMap extends Map<Node, NodeFunction> {}


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
  /** The id of the selected mash/asset/clip */
  selectedId?: string
  targetId?: TargetId
}

export interface SizeReactive {
  size?: Size
}

export interface ClientMashAudioAsset extends ClientMashAsset, ClientAudioAsset {
  assetObject: MashAudioAssetObject
}

export interface ClientMashImageAsset extends ClientMashAsset, ClientImageAsset {
  assetObject: MashImageAssetObject
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


export interface ClientContainerInstance extends ClientInstance, ContainerInstance {
  asset: ClientAsset & ContainerAsset
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


export type Timeout = ReturnType<typeof setTimeout>

export interface EventHandler<T=Event> {
  (event: T): void
}

export interface IconResponse {
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SvgElement
  svgString?: string
}

export interface AssetObjectsParams extends AssetParams {
  sorts?: Strings
  manageTypes?: ManageTypes
  ignoreCache?: boolean
}


