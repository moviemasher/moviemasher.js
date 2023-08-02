import type { AssetObject, BooleanRecord, DataOrError, DataType, ManageType, MashAsset, Ordered, PropertyId, PropertyIds, Rect, Scalar, SelectorTypes, Size, TargetIds, Time, TimeRange } from '@moviemasher/runtime-shared'
import type { Action } from './Action.js'
import type { ClientAction } from './ClientAction.js'
import type { ClientAsset, ClientAssets } from './ClientAsset.js'
import type { ClientClip, ClientClips, ClientTrack } from './ClientMashTypes.js'
import type { MashIndex } from './Masher.js'
import type { SelectedProperties } from './SelectedProperty.js'
import type { Previews, SvgOrImage } from './Svg.js'


export class NumberEvent extends CustomEvent<number> {}
export class StringEvent extends CustomEvent<string> {}

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
 * Dispatch to retireve data type from a property id.
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
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
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
  assetId: string
  assetObject?: AssetObject
  asset?: ClientAsset
}

export interface EventPreviewsDetail {
  disabled?: boolean
  maxDimension?: number
  promise?: Promise<Previews>
}

export interface EventActionEnabledDetail {
  clientAction: ClientAction
  enabled?: boolean
}

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
 * Dispatch to retrieve an asset object node.
 */
export class EventAssetObjectNode extends CustomEvent<EventAssetObjectNodeDetail> {
  static Type = 'asset-object-node'
  constructor(assetObject: AssetObject, size: Size, icons?: boolean,  labels?: boolean) { 
    super(EventAssetObjectNode.Type, { detail: { assetObject, size, labels, icons } }) 
  }
}

export interface EventAssetObjectNodeDetail {
  size: Size
  labels?: boolean
  icons?: boolean
  assetObject: AssetObject
  node?: Node
}

/**
 * Dispatch to change the mash's selected asset object.
 */
export class EventChangeAssetObject extends CustomEvent<AssetObject | undefined> {
  static Type = 'change-asset-object'
  constructor(detail?: AssetObject) { 
    super(EventChangeAssetObject.Type, { detail }) 
  }
}

/**
 * Dispatched when the mash's selected asset object has changed.
 */
export class EventChangedAssetObject extends CustomEvent<AssetObject | undefined> {
  static Type = 'changed-asset-object'
  constructor(detail?: AssetObject) { 
    super(EventChangedAssetObject.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve the mash's selected asset object.
 */
export class EventAssetObject extends CustomEvent<{ assetObject?: AssetObject}> {  
  static Type = 'asset-object'
  constructor(..._: any[]) { 
    super(EventAssetObject.Type, { detail: {} }) 
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
 * Dispatch to initiate a simple change.
 */
export class EventAction extends StringEvent {
  static Type = 'action'
  constructor(clientAction: ClientAction) { 
    super(EventAction.Type, { detail: clientAction }) 
  }
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

export type SelectedPropertiesEvent = CustomEvent<SelectedPropertiesEventDetail>


/**
 * Dispatch to retrieve the mash's current Previews.
 */
export class EventActionEnabled extends CustomEvent<EventActionEnabledDetail> {
  static Type = 'action-enabled'
  constructor(clientAction: ClientAction) { 
    super(EventActionEnabled.Type, { detail: { clientAction } }) 
  }
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

/**
 * Dispatch to retrieve a value from one of the mash's current targets.
 */
export class EventValue extends CustomEvent<EventValueDetail> {
  static Type = 'value'
  constructor(propertyId: PropertyId) { 
    super(EventValue.Type, { detail: { propertyId } }) 
  }
}

export interface EventValueDetail {
  propertyId: PropertyId
  value?: Scalar
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

export interface EventInspectorSelectorsDetail {
  filter?: string
  selectorTypes: SelectorTypes
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
 * Dispatched when mash length has changed.
 */
export const EventTypeDuration = 'durationchange'
/**
 * Dispatched when non-looping mash has reached last frame.
 */
export const EventTypeEnded = 'ended'


export const EventTypeFps = 'ratechange'

export const EventTypeLoaded = 'loadeddata'
export const EventTypePause = 'pause'
export const EventTypePlay = 'play'
export const EventTypePlaying = 'playing'
export const EventTypeRender = 'render'
export const EventTypeSave = 'save'
export const EventTypeSeeked = 'seeked'
export const EventTypeSeeking = 'seeking'
export const EventTypeTrack = 'track'
export const EventTypeTracks = 'tracks'
export const EventTypeVolume = 'volumechange'
export const EventTypeWaiting = 'waiting'

export const EventTypeZoom = 'zoom'
export const EventTypeScale = 'scale'


export const EventTypeImporterChange = 'importer-change'
export const EventTypeImporterComplete = 'importer-complete'
export const EventTypeImportAssetObjects = 'import-asset-objects'


export const EventTypeAssetType = 'asset-type'
export const EventTypeSourceType = 'source-type'


export const EventTypeAdded = 'added'

export const EventTypeMashRemoveTrack = 'mash-remove-track'
export const EventTypeMashMoveClip = 'mash-move-clip'
export const EventTypeMashRemoveClip = 'mash-remove-clip'


export const EventTypeImportRaw = 'import-raw'

export const EventTypeDragHandled = 'drag-handled'

export const EventTypeExportParts = 'export-parts'


export const EventTypeAssetObjectFromId = 'asset-object-from-id'


export const EventTypeClientAudio = 'client-audio'
export const EventTypeClientFont = 'client-font'
export const EventTypeClientImage = 'client-image'
export const EventTypeClientVideo = 'client-video'

export const EventTypeClipFromId = 'clip-from-id'

/**
 * dispatch to retrieve scrolling element from parent
 */
export const EventTypeScrollRoot = 'scroll-root'

/**
 * dispatch to retrieve clips of a track from mash from eventDispatcher
 */
export const EventTypeTrackClips = 'track-clips'


export const EventTypeAssetObjects = 'fetch-asset-objects'
export const EventTypeAssetObject = 'fetch-asset-object'

export const EventTypeIconFromId = 'icon-from-id'
export const EventTypeIconFromFrame = 'icon-from-frame'