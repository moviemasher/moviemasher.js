import type { AssetObject, AssetObjects, DataOrError, DataType, ManageType, MashAsset, Ordered, PropertyId, PropertyIds, Rect, Scalar, ScalarsById, SelectorTypes, Size, StringDataOrError, Strings, TargetIds, TimeRange } from '@moviemasher/runtime-shared'
import type { Action } from './ActionTypes.js'
import type { ClientAction } from './ClientAction.js'
import type { ClientAsset, ClientAssetObject, ClientAssets } from './ClientAsset.js'
import type { ClientClip, ClientClips, ClientTrack } from './ClientMashTypes.js'
import type { ClientAudioDataOrError, ClientFontDataOrError, ClientImageDataOrError, ClientVideoDataOrError, MediaRequest } from './ClientMedia.js'
import type { MashIndex } from './Masher.js'
import type { SelectedProperties } from './SelectedProperty.js'
import type { Previews, SvgOrImage } from './Svg.js'


export class NumberEvent extends CustomEvent<number> {}
export class StringEvent extends CustomEvent<string> {}


/**
 * Dispatch to initiate a save request.
 */
export class EventSave extends CustomEvent<EventSaveDetail> {
  static Type = 'save'
  constructor(assetObject: ClientAssetObject) { 
    super(EventSave.Type, { detail: { assetObject } }) 
  }
}
export interface EventSaveDetail {
  assetObject: ClientAssetObject
  promise?: Promise<StringDataOrError>
}

/**
 * Dispatch to retirve the time range of the mash's selected clip.
 */
export class EventTimeRange extends CustomEvent<{ timeRange?: TimeRange}> {
  static Type = 'time-range'
  constructor(..._: any[]) { super(EventTimeRange.Type, { detail: {} }) }
}

/**
 * Dispatch to retrieve the mash's current frame. 
 */
export class EventFrame extends CustomEvent<{ frame?: number }> {
  static Type = 'frame'
  constructor(..._: any[]) { super(EventFrame.Type, { detail: {} }) }
}

/**
 * Dispatch to change the mash's current frame.
 */
export class EventChangeFrame extends NumberEvent {
  static Type = 'change-frame'
  constructor(detail: number) { super(EventChangeFrame.Type, { detail }) }
}

/**
 * Dispatched when the mash's current frame has changed. 
 * Note that EventChangedFrame.Type value matches HTMLMediaElement.
 */
export class EventChangedFrame extends NumberEvent {
  // to match HTMLMediaElement
  static Type = 'timeupdate' 
  constructor(detail: number) { super(EventChangedFrame.Type, { detail }) }
}

/**
 * Dispatch to retrieve data type from a property id.
 */
export class EventDataType extends CustomEvent<EventDataTypeDetail> {
  static Type = 'data-type'
  constructor(propertyId: PropertyId) { 
    super(EventDataType.Type, { detail: { propertyId } }) 
  }
}

export interface EventDataTypeDetail {
  propertyId: PropertyId
  dataType?: DataType
}

/**
 * Dispatch to retrieve a property value from a managed asset.  
 */
export class EventManagedAssetScalar extends CustomEvent<EventManagedAssetScalarDetail> {
  static Type = 'managed-asset-scalar'
  constructor(assetId: string, propertyName: string) { 
    super(EventManagedAssetScalar.Type, { detail: { assetId, propertyName } }) 
  }
}
export interface EventManagedAssetScalarDetail {
  assetId: string
  propertyName: string
  scalar?: Scalar
}

/** 
 * Dispatch to retrieve a promise that returns a managed asset's icon.
 */
export class EventManagedAssetIcon extends CustomEvent<EventManagedAssetIconDetail> {
  static Type = 'managed-asset-icon'
  constructor(assetId: string, size: Size) { 
    super(EventManagedAssetIcon.Type, { detail: { assetId, size } }) 
  }
}

export interface EventManagedAssetIconDetail {
  assetId: string
  size: Size
  promise?: Promise<SVGSVGElement>
}

/** 
 * Dispatch when a managed asset's id has been changed.
 */
export class EventManagedAssetId extends CustomEvent<EventManagedAssetIdDetail> {
  static Type = 'managed-asset-id'
  constructor(previousId: string, currentId: string) {
    super(EventManagedAssetId.Type, { detail: { previousId, currentId } })
  }
}

export interface EventManagedAssetIdDetail {
  previousId: string
  currentId: string
}

/**
 * Dispatch to release managed assets.
 */
export class EventReleaseManagedAssets extends CustomEvent<string | undefined> {
  static Type = 'release-managed-assets'
  constructor(detail?: ManageType) { 
    super(EventReleaseManagedAssets.Type, { detail }) 
  }
}

/**
 * Dispatch to add clips to mash for assets.
 */
export class EventAddAssets extends CustomEvent<EventAddAssetsDetail> {
  static Type = 'add-assets'
  constructor(assets: ClientAssets, mashIndex?: MashIndex) { 
    super(EventAddAssets.Type, { detail: { assets, mashIndex } }) 
  }
}

export interface EventAddAssetsDetail {
  mashIndex?: MashIndex
  assets: ClientAssets
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 */
export class EventManagedAsset extends CustomEvent<AssetEventDetail> {
  static Type = 'managed-asset'
  constructor(assetIdOrObject: string | AssetObject, manageType?: ManageType) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject, manageType }
    super(EventManagedAsset.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
export class EventAsset extends CustomEvent<AssetEventDetail> {
  static Type = 'asset'
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventAsset.Type, { detail }) 
  }
}

export interface AssetEventDetail {
  manageType?: ManageType
  assetId: string
  assetObject?: AssetObject
  asset?: ClientAsset
}


/**
 * Dispatch to initiate a client action.
 */
export class EventAction extends StringEvent {
  static Type = 'action'
  constructor(clientAction: ClientAction) { 
    super(EventAction.Type, { detail: clientAction }) 
  }
}

/** 
 * Dispatched when the enabled state of a particular action has changed.
 */
export class EventChangedActionEnabled extends StringEvent {
  static Type = 'changed-action-enabled'
  constructor(detail: ClientAction) { super(EventChangedActionEnabled.Type, { detail }) }
}



/**
 * Dispatch to retrieve current enabled state of a client action.
 */
export class EventActionEnabled extends CustomEvent<EventActionEnabledDetail> {
  static Type = 'action-enabled'
  constructor(clientAction: ClientAction) { 
    super(EventActionEnabled.Type, { detail: { clientAction } }) 
  }
}


export interface EventActionEnabledDetail {
  clientAction: ClientAction
  enabled?: boolean
}

/**
 * Dispatched when there's a new mash loaded.
 */
export class EventChangedMashAsset extends CustomEvent<MashAsset | undefined> {
  static Type = 'changed-mash-asset'
  constructor(detail?: MashAsset) { super(EventChangedMashAsset.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash being edited.
 */
export class EventMashAsset extends CustomEvent<{ mashAsset?: MashAsset}> {
  static Type = 'mash-asset'
  constructor(..._: any[]) { 
    super(EventMashAsset.Type, { detail: {} }) 
  }
}

/**
 * Dispatch to change the dragging state.
 */
export class EventChangeDragging extends CustomEvent<boolean> {
  static Type = 'change-dragging'
  constructor(detail: boolean) { super(EventChangeDragging.Type, { detail }) }
}

/**
 * Dispatch to retrieve current dragging state.
 */
export class EventDragging extends CustomEvent<{ dragging?: boolean }> {
  static Type = 'dragging'
  constructor() { super(EventDragging.Type, { detail: {} }) }
}



/**
 * Dispatch to retrieve a clip node.
 */
export class EventClipElement extends CustomEvent<EventClipElementDetail> {
  static Type = 'clip-node'
  constructor(clipId: string, maxWidth: number, scale: number, trackIndex: number, trackWidth: number, width: number, x: number, label?: string, labels?: boolean, icons?: boolean) {
    super(EventClipElement.Type, { detail: { 
      clipId, maxWidth,
      scale,
      trackIndex,
      trackWidth,
      width,
      x,
      label, 
      labels, 
      icons 
    } })
  }
}

export interface EventClipElementDetail {
  maxWidth: number
  scale: number
  trackIndex: number
  trackWidth: number
  width: number
  x: number
  
  label?: string

  labels?: boolean
  icons?: boolean
  clipId: string
  node?: Element
}

/** 
 * Dispatch to retrieve an asset object node.
 */
export class EventAssetObjectNode extends CustomEvent<EventAssetObjectNodeDetail> {
  static Type = 'asset-object-node'
  constructor(assetId: string, size: Size, icons?: boolean, labels?: boolean) { 
    super(EventAssetObjectNode.Type, { detail: { assetId, size, labels, icons } }) 
  }
}

export interface EventAssetObjectNodeDetail {
  size: Size
  labels?: boolean
  icons?: boolean
  assetId: string
  element?: Element
}

/**
 * Dispatch to change the mash's selected asset id.
 */
export class EventChangeAssetId extends CustomEvent<string | undefined> {
  static Type = 'change-asset-id'
  constructor(detail?: string) {  
    super(EventChangeAssetId.Type, { detail })
  }
}

/**
 * Dispatched when the mash's selected asset id has changed.
 */
export class EventChangedAssetId extends CustomEvent<string | undefined> {
  static Type = 'changed-asset-id'
  constructor(detail?: string) {
    super(EventChangedAssetId.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the mash's selected asset id.
 */
export class EventAssetId extends CustomEvent<{ assetId?: string}> {
  static Type = 'asset-id'
  constructor(..._: any[]) {
    super(EventAssetId.Type, { detail: {} })
  }
}


/**
 * Dispatch when the preview rectangle has changed.
 */
export class EventRect extends CustomEvent<{ rect?: Rect }> {
  static Type = 'change-rect'
  constructor() { super(EventRect.Type, { detail: {} }) }
}


/**
 * Dispatced when the mash's targets have changed.
 */
export class EventChangedTargetIds extends CustomEvent<TargetIds> {
  static Type = 'changed-target-ids'
  constructor(detail: TargetIds) { super(EventChangedTargetIds.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash's current targets.
 */
export class EventTargetIds extends CustomEvent<TargetIds> {
  static Type = 'target-ids'
  constructor(detail: TargetIds = []) { super(EventTargetIds.Type, { detail }) }
}

/**
 * Dispatched when the mash's size has changed.
 */
export class EventChangedSize extends CustomEvent<Size> {
  static Type = 'changed-size'
  constructor(detail: Size) { super(EventChangedSize.Type, { detail }) }
}
/**
 * Dispatch to retrieve the mash's current size.
 */
export class EventSize extends CustomEvent<{ size?: Size }> {
  static Type = 'size'
  constructor(..._: any[]) { super(EventSize.Type, { detail: {} }) }
}

/**
 * Dispatched when the mash has new Previews to display.
 */
export class EventChangedPreviews extends Event {
  static Type = 'changed-previews'
  constructor(_?: string) { super(EventChangedPreviews.Type) }
}

/**
 * Dispatch to retreve the property ids of the mash's current targets.
 */
export class EventPropertyIds extends CustomEvent<EventPropertyIdsDetail> {
  static Type = 'property-ids'
  constructor(targetIds: TargetIds = [], propertyIds: PropertyIds = []) { 
    super(EventPropertyIds.Type, { detail: { targetIds, propertyIds } })
  }
}

export interface EventPropertyIdsDetail {
  targetIds: TargetIds
  propertyIds: PropertyIds
}

/**
 * Dispatch to retrieve the id of the mash's currently selected clip.
 */
export class EventClipId extends CustomEvent<EventClipIdDetail> {
  static Type = 'clip-id'
  constructor(..._: any[]) { super(EventClipId.Type, { detail: {} }) }
}

export interface EventClipIdDetail {
  clipId?: string
}



/**
 * Dispatch to set the currently selected clip.
 */
export class EventChangeClipId extends StringEvent {
  static Type = 'select-clip-id'
  constructor(detail = '') { super(EventChangeClipId.Type, { detail }) }
}

/** 
 * Dispatched when the mash's currently selected clip changes.  
 * */
export class EventChangedClipId extends StringEvent {
  static Type = 'selected-clip-id'
  constructor(detail = '') { super(EventChangedClipId.Type, { detail }) }
}

/**
 * Dispatched when a mash action has been done or undone.
 */

export class EventChanged extends CustomEvent<Action | undefined> {
  static Type = 'changed'
  constructor(action?: Action) { super(EventChanged.Type, { detail: action }) }
}

// RETRIEVERS

/**
 * Dispatch to retrieve selected properties.
 */

export class EventSelectedProperties extends CustomEvent<SelectedPropertiesEventDetail> {
  static Type = 'selected-properties'
  constructor(selectorTypes: SelectorTypes = [], selectedProperties: SelectedProperties = [], ) { 
    super(EventSelectedProperties.Type, { detail: { selectorTypes, selectedProperties } }) 
  }
}


export interface SelectedPropertiesEventDetail {
  selectorTypes?: SelectorTypes
  selectedProperties: SelectedProperties
}

/**
 * Dispatch to retrieve the mash's current Previews.
 */
export class EventPreviews extends CustomEvent<EventPreviewsDetail> {
  static Type = 'previews'
  constructor(maxDimension?: number, disabled = false) { 
    super(EventPreviews.Type, { detail: { disabled, maxDimension } }) 
  }
}
export interface EventPreviewsDetail {
  disabled?: boolean
  maxDimension?: number
  promise?: Promise<Previews>
}

/**
 * Dispatch to retrieve the scalar that corresponds to a property id.
 */
export class EventScalar extends CustomEvent<EventScalarDetail> {
  static Type = 'scalar'
  constructor(propertyId: PropertyId) { 
    super(EventScalar.Type, { detail: { propertyId } }) 
  }
}

export interface EventScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

/**
 * Dispatch to change the scalar that corresponds to a property id.
 */
export class EventChangeScalar extends CustomEvent<EventChangeScalarDetail> {
  static Type = 'change-scalar'
  constructor(propertyId: PropertyId, value?: Scalar) { 
    super(EventChangeScalar.Type, { detail: { propertyId, value } }) 
  }
}
export interface EventChangeScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

/**
 * Dispatch to change multiple scalars that correspond to property ids.
 */
export class EventChangeScalars extends CustomEvent<ScalarsById> {
  static Type = 'change-scalars'
  constructor(detail: ScalarsById) { 
    super(EventChangeScalars.Type, { detail }) 
  }
}

/**
 * Dispatched when scalars that correspond to property ids have changed.
 */
export class EventChangedScalars extends CustomEvent<PropertyIds> {
  static Type = 'changed-scalars'
  constructor(detail: PropertyIds) { 
    super(EventChangedScalars.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve a control group.
 */
export class EventControlGroup extends CustomEvent<EventControlGroupDetail> {
  static Type = 'control-group'
  constructor(propertyIds: PropertyIds, groupedPropertyIds: PropertyIds = []) {
    const detail: EventControlGroupDetail = { 
      propertyIds, groupedPropertyIds
    }
    super(EventControlGroup.Type, { detail })
  }
}

export interface EventControlGroupDetail extends Ordered {
  propertyIds: PropertyIds
  selectedProperties?: SelectedProperties
  controlGroup?: Node
  groupedPropertyIds: PropertyIds
}

/**
 * Dispatch to retrieve a control.
 */
export class EventControl extends CustomEvent<EventControlDetail> {
  static Type = 'control'
  constructor(type: DataType, propertyId: PropertyId) { 
    super(EventControl.Type, { detail: { type, propertyId } }) 
  }
}

export interface EventControlDetail {
  type: DataType
  propertyId: PropertyId
  control?: Node
}

/**
 * Dispatch to retrieve the inspector's filtered selectors.
 */
export class EventInspectorSelectors extends CustomEvent<EventInspectorSelectorsDetail> {
  static Type = 'inspector-selectors'
  constructor(selectorTypes: SelectorTypes, filter?: string) { 
    const detail: EventInspectorSelectorsDetail = { filter, selectorTypes }
    super(EventInspectorSelectors.Type, { detail }) 
  }
}

export interface EventInspectorSelectorsDetail {
  filter?: string
  selectorTypes: SelectorTypes
}

/**
 * Dispatch to set the inspector's filtered selectors.
 */
export class EventChangedInspectorSelectors extends CustomEvent<EventInspectorSelectorsDetail> {
  static Type = 'changed-inspector-selectors'
  constructor(selectorTypes: SelectorTypes, filter?: string) { 
    const detail: EventInspectorSelectorsDetail = { filter, selectorTypes }
    super(EventChangedInspectorSelectors.Type, { detail }) 
  }
}

/** 
 * Dispatch to close current dialog (no detail), or open with a supported section.
 */
export class EventDialog extends StringEvent {
  static Type = 'dialog'
  constructor(detail = '') { super(EventDialog.Type, { detail }) }
}

/**
 * Dispatch to retrieve client audio promise for request.
 */
export class EventClientAudioPromise extends CustomEvent<EventClientAudioPromiseDetail> {
  static Type = 'client-audio-promise'
  constructor(request: MediaRequest) { 
    super(EventClientAudioPromise.Type, { detail: { request } }) 
  }
}
export interface EventClientAudioPromiseDetail {
  request: MediaRequest
  promise?: Promise<ClientAudioDataOrError>
}

/**
 * Dispatch to retrieve client font promise for request.
*/
export class EventClientFontPromise extends CustomEvent<EventClientFontPromiseDetail> {
  static Type = 'client-font-promise'
  constructor(request: MediaRequest) {
    super(EventClientFontPromise.Type, { detail: { request } })
  }
}
export interface EventClientFontPromiseDetail {
  request: MediaRequest
  promise?: Promise<ClientFontDataOrError>
}

/**
 * Dispatch to retrieve client image promise for request.
*/
export class EventClientImagePromise extends CustomEvent<EventClientImagePromiseDetail> {
  static Type = 'client-image-promise'
  constructor(request: MediaRequest) {
    super(EventClientImagePromise.Type, { detail: { request } })
  }
}
export interface EventClientImagePromiseDetail {
  request: MediaRequest
  promise?: Promise<ClientImageDataOrError>
}

/**
 * Dispatch to retrieve client video promise for request.
 */
export class EventClientVideoPromise extends CustomEvent<EventClientVideoPromiseDetail> {
  static Type = 'client-video-promise'
  constructor(request: MediaRequest) { 
    super(EventClientVideoPromise.Type, { detail: { request } })
  }
}
export interface EventClientVideoPromiseDetail {
  request: MediaRequest
  promise?: Promise<ClientVideoDataOrError>
}

/**
 * Dispatch to import file(s) and get promise for corresponding asset objects.
 */
export class EventImport extends CustomEvent<EventImportDetail> {
  static Type = 'import'
  constructor(fileList: FileList) { 
    super(EventImport.Type, { detail: { fileList } }) 
  }
}
export interface EventImportDetail {
  fileList: FileList
  promise?: Promise<AssetObjects>
}



export interface ImportAssetObjectsEventDetail {
  assetObjects: AssetObjects
}
export class ImportAssetObjectsEvent extends CustomEvent<ImportAssetObjectsEventDetail> {
  static Type = 'import-asset-objects'
  constructor(assetObjects: AssetObjects) {
    super(ImportAssetObjectsEvent.Type, { detail: { assetObjects } })
  }
}

export class EventImporterChange extends CustomEvent<ImportAssetObjectsEventDetail> {
  static Type = 'importer-change'
  constructor(assetObjects: AssetObjects) { 
    super(EventImporterChange.Type, { detail: { assetObjects } }) 
  }
}

export const EventTypeImporterComplete = 'importer-complete'







export type MashMoveClipEvent = CustomEvent<MashIndex>

export interface MashRemoveTrackEventDetail {
  track: ClientTrack
}

export type MashRemoveTrackEvent = CustomEvent<MashRemoveTrackEventDetail>

export type RectEvent = CustomEvent<Rect>

export interface TrackClipsEventDetail {
  trackIndex: number
  clips?: ClientClips
  dense?: boolean
}

export type TrackClipsEvent = CustomEvent<TrackClipsEventDetail>

export interface ScrollRootEventDetail {
  root?: Element
}

export type ScrollRootEvent = CustomEvent<ScrollRootEventDetail>


export interface ClipFromIdEventDetail {
  clipId: string
  clip?: ClientClip
}

export type ClipFromIdEvent = CustomEvent<ClipFromIdEventDetail>

export type SvgOrImageDataOrError = DataOrError<SvgOrImage>

export interface IconFromFrameEventDetail {
  clipSize: Size
  clipId: string
  gap?: number
  scale: number
  promise?: Promise<SvgOrImageDataOrError>
  background?: SVGElement
}

export type IconFromFrameEvent = CustomEvent<IconFromFrameEventDetail>

export interface DroppedEventDetail {
  clip?: ClientClip
}

export type SelectedPropertiesEvent = CustomEvent<SelectedPropertiesEventDetail>

export const EventTypeDuration = 'durationchange'

export const EventTypeEnded = 'ended'


export const EventTypeFps = 'ratechange'

export const EventTypeLoaded = 'loadeddata'
export const EventTypePause = 'pause'
export const EventTypePlay = 'play'
export const EventTypePlaying = 'playing'
export const EventTypeRender = 'render'
export const EventTypeSeeked = 'seeked'
export const EventTypeSeeking = 'seeking'
export const EventTypeTrack = 'track'
export const EventTypeTracks = 'tracks'
export const EventTypeVolume = 'volumechange'
export const EventTypeWaiting = 'waiting'

export const EventTypeZoom = 'zoom'
export const EventTypeScale = 'scale'

export const EventTypeAssetType = 'asset-type'
export const EventTypeSourceType = 'source-type'


export const EventTypeAdded = 'added'

export const EventTypeMashRemoveTrack = 'mash-remove-track'
export const EventTypeMashMoveClip = 'mash-move-clip'
export const EventTypeMashRemoveClip = 'mash-remove-clip'


export const EventTypeDragHandled = 'drag-handled'

export const EventTypeExportParts = 'export-parts'


export const EventTypeScrollRoot = 'scroll-root'

export const EventTypeTrackClips = 'track-clips'

export const EventTypeAssetObjects = 'fetch-asset-objects'
export const EventTypeAssetObject = 'fetch-asset-object'

export const EventTypeIconFromId = 'icon-from-id'
export const EventTypeIconFromFrame = 'icon-from-frame'