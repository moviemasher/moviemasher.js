import type { AssetObject, AssetObjects, AssetParams, AssetType, Assets, DataOrError, DataType, DecodeOptions, DecodingObject, DecodingType, EncodeArgs, EncodeOptions, EncodingObject, EncodingType, EndpointRequest, Importers, ManageType, MashAssetObject, NumberSetter, Ordered, PropertyId, PropertyIds, Rect, Scalar, ScalarsById, SelectorTypes, Size, StringDataOrError, TargetIds, TimeRange, TranscodeOptions, TranscodingObject, TranscodingType } from '@moviemasher/runtime-shared'
import type { Action } from './ActionTypes.js'
import type { ClientAsset, ClientAssetObjects, ClientAssets } from './ClientAsset.js'
import type { ClientClip, ClientClips, ClientMashAsset, ClientTrack } from './ClientMashTypes.js'
import type { ClientAudioDataOrError, ClientFontDataOrError, ClientImageDataOrError, ClientMediaRequest, ClientVideoDataOrError } from './ClientMedia.js'
import type { ClipLocation } from './Masher.js'
import type { SelectedProperties } from './SelectedProperty.js'
import type { Previews, SvgOrImage } from './Svg.js'
import type { TranslateArgs } from './Translate.js'

import { ASSET, DECODE, ENCODE, TRANSCODE, assertAsset } from '@moviemasher/runtime-shared'
import { MovieMasher } from './MovieMasher.js'
import { ClientRawAsset } from './ClientRawTypes.js'

export class NumberEvent extends CustomEvent<number> {}
export class StringEvent extends CustomEvent<string> {}

export type ClientAction = string
export type ServerAction = string

export interface ServerProgress {
  do: NumberSetter
  did: NumberSetter
  done: VoidFunction
}

/**
 * Dispatch to initiate a decode request for an asset.
 */

export class EventClientDecode extends CustomEvent<EventClientDecodeDetail> {
  static Type = DECODE
  constructor(asset: ClientRawAsset, decodingType: DecodingType, options?: DecodeOptions, progress?: ServerProgress) {
    super(EventClientDecode.Type, { detail: { asset, options, decodingType, progress } })
  }
}

export interface EventClientDecodeDetail {
  options?: DecodeOptions
  decodingType: DecodingType
  asset: ClientRawAsset
  promise?: Promise<DataOrError<DecodingObject>>
  progress?: ServerProgress
}

/**
 * Dispatch to initiate an encode request for a mash.
 */
export class EventClientEncode extends CustomEvent<EventClientEncodeDetail> {
  static Type = ENCODE
  constructor(mashAssetObject: MashAssetObject, encodingType?: EncodingType, encodeOptions?: EncodeOptions, progress?: ServerProgress) { 
    super(EventClientEncode.Type, { detail: { mashAssetObject, encodingType, encodeOptions, progress } }) 
  }
}

export interface EventClientEncodeDetail extends EncodeArgs {
  promise?: Promise<DataOrError<EncodingObject>>
  progress?: ServerProgress
}

/**
 * Dispatch to initiate a transcoding request for an asset.
 */
export class EventClientTranscode extends CustomEvent<EventClientTranscodeDetail> {
  static Type = TRANSCODE
  constructor(asset: ClientRawAsset, transcodingType: TranscodingType, options?: TranscodeOptions, progress?: ServerProgress) {
    super(EventClientTranscode.Type, { detail: { asset, transcodingType, options, progress } })
  }
}

export interface EventClientTranscodeDetail {
  options?: TranscodeOptions
  transcodingType: TranscodingType
  asset: ClientRawAsset
  promise?: Promise<DataOrError<TranscodingObject>>
  progress?: ServerProgress
}

/**
 * Dispatch to initiate a save request for an asset.
 */
export class EventSave extends CustomEvent<EventSaveDetail> {
  static Type = 'save'
  constructor(asset: ClientAsset, progress?: ServerProgress) { 
    super(EventSave.Type, { detail: { asset, progress } }) 
  }
}

export interface EventSaveDetail {
  asset: ClientAsset
  promise?: Promise<StringDataOrError>
  progress?: ServerProgress
}

/**
 * Dispatch to initiate an upload request, optionally replacing an existing asset.
 */
export class EventUpload extends CustomEvent<EventUploadDetail> {
  static Type = 'upload'
  constructor(request: ClientMediaRequest, progress?: ServerProgress, id?: string) { 
    super(EventUpload.Type, { detail: { request, progress, id } }) 
  }
}

export interface UploadResult {
  assetRequest: EndpointRequest
  id?: string
}

export interface EventUploadDetail {
  id?: string
  request: ClientMediaRequest
  promise?: Promise<DataOrError<UploadResult>>
  progress?: ServerProgress
}

/**
 * Dispatch to retrieve the time range of the mash's selected clip.
 */
export class EventTimeRange extends CustomEvent<{ timeRange?: TimeRange}> {
  static Type = 'time-range'
  constructor(..._: any[]) { super(EventTimeRange.Type, { detail: {} }) }
}

/**
 * Dispatch to retrieve the total number of frames in the mash.
 */
export class EventFrames extends CustomEvent<{ frames: number}> {
  static Type = 'frames'
  constructor() { 
    super(EventFrames.Type, { detail: { frames: 0 } }) 
  }
}
/**
 * Dispatched when the total number of frames in the mash changes.
 */
export class EventChangedFrames extends NumberEvent {
  static Type = 'changed-frames'
  constructor(frames: number) { super(EventChangedFrames.Type, { detail: frames }) }
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
  constructor(assetId: string, size: Size, cover?: boolean) { 
    super(EventManagedAssetIcon.Type, { detail: { assetId, size, cover } }) 
  }
}

export interface EventManagedAssetIconDetail {
  cover?: boolean
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
export class EventReleaseManagedAssets extends CustomEvent<ManageType | undefined> {
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
  constructor(assets: ClientAssets, mashIndex?: ClipLocation) { 
    super(EventAddAssets.Type, { detail: { assets, mashIndex } }) 
  }
}

export interface EventAddAssetsDetail {
  mashIndex?: ClipLocation
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

  static Detail(assetIdOrObject: string | AssetObject, manageType?: ManageType): AssetEventDetail {
    const event = new EventManagedAsset(assetIdOrObject, manageType)
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail
  }

  static asset(assetIdOrObject: string | AssetObject, manageType?: ManageType): ClientAsset {
    const detail = EventManagedAsset.Detail(assetIdOrObject, manageType)
    const { asset } = detail
    assertAsset(asset)

    return asset
  }
}


/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
export class EventAsset extends CustomEvent<AssetEventDetail> {
  static Type = ASSET
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
export class EventDoClientAction extends CustomEvent<ClientAction> {
  static Type = 'do-client-action'
  constructor(clientAction: ClientAction) { 
    super(EventDoClientAction.Type, { detail: clientAction }) 
  }
}

/** 
 * Dispatched when the enabled state of a particular client action has changed.
 */
export class EventChangedClientAction extends CustomEvent<ClientAction> {
  static Type = 'changed-client-action'
  constructor(detail: ClientAction) { super(EventChangedClientAction.Type, { detail }) }
}

/**
 * Dispatch to retrieve current enabled state of a client action.
 */
export class EventEnabledClientAction extends CustomEvent<EventEnabledClientActionDetail> {
  static Type = 'enabled-client-action'
  constructor(clientAction: ClientAction) { 
    super(EventEnabledClientAction.Type, { detail: { clientAction } }) 
  }
}

export interface EventEnabledClientActionDetail {
  clientAction: ClientAction
  enabled?: boolean
}


/**
 * Dispatched as progress is made on a server action with provided id.
 */
export class EventProgress extends CustomEvent<EventProgressDetail> {
  static Type = 'progress'
  constructor(id: string, progress: number) { 
    super(EventProgress.Type, { detail: { id, progress } }) 
  }
}

export interface EventProgressDetail {
  id: string
  progress: number
}

/**
 * Dispatch to initiate a server action, optionally dispatching progress events.
 */
export class EventDoServerAction extends CustomEvent<EventDoServerActionDetail> {
  static Type = 'do-server-action'
  constructor(serverAction: ServerAction, id?: string) { 
    super(EventDoServerAction.Type, { detail: { serverAction, id } }) 
  }
}

export interface EventDoServerActionDetail {
  serverAction: ServerAction
  id?: string
  promise?: Promise<void>
}

/** 
 * Dispatched when the enabled state of a particular server action has changed.
 */
export class EventChangedServerAction extends CustomEvent<ServerAction> {
  static Type = 'changed-server-action'
  constructor(detail: ServerAction) { super(EventChangedServerAction.Type, { detail }) }
}

/**
 * Dispatch to retrieve current enabled state of a server action.
 */
export class EventEnabledServerAction extends CustomEvent<EventEnabledServerActionDetail> {
  static Type = 'enabled-server-action'
  constructor(serverAction: ServerAction) { 
    super(EventEnabledServerAction.Type, { detail: { serverAction } }) 
  }
}

export interface EventEnabledServerActionDetail {
  serverAction: ServerAction
  enabled?: boolean
}

/**
 * Dispatched when there's a new mash loaded.
 */
export class EventChangedMashAsset extends CustomEvent<ClientMashAsset | undefined> {
  static Type = 'changed-mash-asset'
  constructor(detail?: ClientMashAsset) { super(EventChangedMashAsset.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash being edited.
 */
export class EventMashAsset extends CustomEvent<{ mashAsset?: ClientMashAsset}> {
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
 * Dispatch to retrieve a clip element for display.
 */
export class EventClipElement extends CustomEvent<EventClipElementDetail> {
  static Type = 'clip-element'
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
 * Dispatch to retrieve an asset element for display.
 */
export class EventAssetElement extends CustomEvent<EventAssetElementDetail> {
  static Type = 'asset-element'
  constructor(assetId: string, size: Size, cover?: boolean, label?: string, icons?: boolean, labels?: boolean) { 
    super(EventAssetElement.Type, { detail: { assetId, size, cover, label, labels, icons } }) 
  }
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
  static Type = 'change-clip-id'
  constructor(detail = '') { super(EventChangeClipId.Type, { detail }) }
}

/** 
 * Dispatched when the mash's currently selected clip changes.  
 * */
export class EventChangedClipId extends StringEvent {
  static Type = 'changed-clip-id'
  constructor(detail = '') { super(EventChangedClipId.Type, { detail }) }
}

/**
 * Dispatched when a mash action has been done or undone.
 */

export class EventChanged extends CustomEvent<Action | undefined> {
  static Type = 'changed'
  constructor(action?: Action) { super(EventChanged.Type, { detail: action }) }
}

/**
 * Dispatch to retrieve selected properties.
 */

export class EventSelectedProperties extends CustomEvent<EventSelectedPropertiesDetail> {
  static Type = 'selected-properties'
  constructor(selectorTypes: SelectorTypes = [], selectedProperties: SelectedProperties = [], ) { 
    super(EventSelectedProperties.Type, { detail: { selectorTypes, selectedProperties } }) 
  }
}

export interface EventSelectedPropertiesDetail {
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
  constructor(request: ClientMediaRequest) { 
    super(EventClientAudioPromise.Type, { detail: { request } }) 
  }
}

export interface EventClientAudioPromiseDetail {
  request: ClientMediaRequest
  promise?: Promise<ClientAudioDataOrError>
}

/**
 * Dispatch to retrieve client font promise for request.
*/
export class EventClientFontPromise extends CustomEvent<EventClientFontPromiseDetail> {
  static Type = 'client-font-promise'
  constructor(request: ClientMediaRequest) {
    super(EventClientFontPromise.Type, { detail: { request } })
  }
}

export interface EventClientFontPromiseDetail {
  request: ClientMediaRequest
  promise?: Promise<ClientFontDataOrError>
}

/**
 * Dispatch to retrieve client image promise for request.
*/
export class EventClientImagePromise extends CustomEvent<EventClientImagePromiseDetail> {
  static Type = 'client-image-promise'
  constructor(request: ClientMediaRequest) {
    super(EventClientImagePromise.Type, { detail: { request } })
  }
}

export interface EventClientImagePromiseDetail {
  request: ClientMediaRequest
  promise?: Promise<ClientImageDataOrError>
}

/**
 * Dispatch to retrieve client video promise for request.
 */
export class EventClientVideoPromise extends CustomEvent<EventClientVideoPromiseDetail> {
  static Type = 'client-video-promise'
  constructor(request: ClientMediaRequest) { 
    super(EventClientVideoPromise.Type, { detail: { request } })
  }
}

export interface EventClientVideoPromiseDetail {
  request: ClientMediaRequest
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

/**
 * Dispatch to retrieve icon promise for an icon ID.
 */
export class EventIcon extends CustomEvent<EventIconDetail> {
  static Type = 'icon'
  constructor(id: string) {
    super(EventIcon.Type, { detail: { id } })
  } 
}

export interface Icon {
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SVGSVGElement
  svgString?: string
}

export interface EventIconDetail extends TranslateArgs {
  promise?: Promise<DataOrError<Icon>>
}

/**
 * Dispatch to retrieve the mash asset object to edit.
 */
export class EventAssetObject extends CustomEvent<AssetObjectEventDetail> {
  static Type = 'asset-object'
  constructor(assetType?: AssetType) { 
    super(EventAssetObject.Type, { detail: { assetType } }) 
  }
}

export interface AssetObjectEventDetail {
  assetType?: AssetType
  promise?: Promise<DataOrError<AssetObject>>
}

/**
 * Dispatch to retrieve asset objects to display.
 */
export class EventAssetObjects extends CustomEvent<EventAssetObjectsDetail> {
  static Type = 'asset-objects'
  constructor(detail: AssetObjectsParams) { 
    super(EventAssetObjects.Type, { detail }) 
  }
}

export interface EventAssetObjectsDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<AssetObjects>>
}

/**
 * Dispatch to retrieve the assets to display.
 */
export class EventManagedAssets extends CustomEvent<EventManagedAssetsDetail> {
  static Type = 'managed-assets'
  constructor(detail: AssetObjectsParams) { 
    super(EventManagedAssets.Type, { detail }) 
  }
}

export interface AssetObjectsParams extends AssetParams {
  excludeManagedTypes?: ManageType[]
}

export interface EventManagedAssetsDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<Assets>>
}

/**
 * Dispatch to retrieve an array of importers.
 */
export class EventImporters extends CustomEvent<EventImportersDetail> {
  static Type = 'importers'
  constructor(importers: Importers = []) { 
    super(EventImporters.Type, { detail: { importers } }) 
  }
}

export interface EventImportersDetail {
  importers: Importers
}

/**
 * Dispatch to import managed assets from client asset objects.
 */

export class EventImportManagedAssets extends CustomEvent<ClientAssetObjects> {
  static Type = 'import-asset-objects'
  constructor(detail: ClientAssetObjects) {
    super(EventImportManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the savable state of managed assets.
 */
export class EventSavableManagedAsset extends CustomEvent<{savable: boolean}> {
  static Type = 'savable-managed-asset'
  constructor() { 
    super(EventSavableManagedAsset.Type, { detail: { savable: false } }) 
  }
}

/**
 * Dispatch to retrieve the clips for a track.
 */
export class EventTrackClips extends CustomEvent<TrackClipsEventDetail> {
  static Type = 'track-clips'
  constructor(trackIndex: number) {
    super(EventTrackClips.Type, { detail: { trackIndex } })
  }
}

export interface TrackClipsEventDetail {
  trackIndex: number
  clips?: ClientClips
  dense?: boolean
}

/**
 * Dispatch to retrieve the savable managed assets.
 */
export class EventSavableManagedAssets extends CustomEvent<{assets: ClientAssets}> {
  static Type = 'savable-managed-assets'
  constructor(assets: ClientAssets = []) { 
    super(EventSavableManagedAssets.Type, { detail: { assets } }) 
  }
}

/**
 * Dispatched when managed assets have been imported.
 */
export class EventImportedManagedAssets extends CustomEvent<ClientAssets> {
  static Type = 'imported-asset-objects'
  constructor(detail: ClientAssets) {
    super(EventImportedManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a track icon for a clip.
 */
export class EventTrackClipIcon extends CustomEvent<EventTrackClipIconDetail> {
  static Type = 'track-clip-icon'
  constructor(clipId: string, clipSize: Size, scale: number, gap?: number) {
    super(EventTrackClipIcon.Type, { detail: { clipId, clipSize, scale, gap } })
  }
}

export interface EventTrackClipIconDetail {
  clipSize: Size
  clipId: string
  gap?: number
  scale: number
  promise?: Promise<SvgOrImageDataOrError>
  background?: SVGElement
}

/**
 * Dispatched when an importer has finished importing.
 */
export class EventImporterComplete extends Event {
  static Type = 'importer-complete'
  constructor() { super(EventImporterComplete.Type) }
}

/**
 * Dispatched when an importer's asset objects have changed.
 */
export class EventImporterChange extends CustomEvent<ClientAssetObjects> {
  static Type = 'importer-change'
  constructor(detail: ClientAssetObjects) { 
    super(EventImporterChange.Type, { detail }) 
  }
}

/**
 * Dispatch to move the selected clip within the mash.
 */
export class EventMoveClip extends CustomEvent<EventMoveClipDetail> {
  static Type = 'move-clip'
  constructor(clipLocation: ClipLocation, clipId?: string) { 
    super(EventMoveClip.Type, { detail: {clipLocation, clipId} }) 
  }
}

export interface EventMoveClipDetail {
  clipId?: string
  clipLocation: ClipLocation
}

/**
 * Dispatch to remove a specific clip from the mash. 
 * Alternatively, use EventDoClientAction to remove the selected clip.
 */
export class EventRemoveClip extends CustomEvent<{ clipId: string }> {
  static Type = 'remove-clip'
  constructor(clipId: string) { 
    super(EventRemoveClip.Type, { detail: { clipId } }) 
  }
}

export const EventTypeMashRemoveTrack = 'mash-remove-track'
export interface MashRemoveTrackEventDetail {
  track: ClientTrack
}
export type MashRemoveTrackEvent = CustomEvent<MashRemoveTrackEventDetail>


export type RectEvent = CustomEvent<Rect>

export interface ScrollRootEventDetail {
  root?: Element
}
export type ScrollRootEvent = CustomEvent<ScrollRootEventDetail>

export type ClipFromIdEvent = CustomEvent<ClipFromIdEventDetail>
export interface ClipFromIdEventDetail {
  clipId: string
  clip?: ClientClip
}


export type SvgOrImageDataOrError = DataOrError<SvgOrImage>

export interface DroppedEventDetail {
  clip?: ClientClip
}


// used in components, dispatched via DOM
export const EventTypeExportParts = 'export-parts'
export const EventTypeScrollRoot = 'scroll-root'
export const EventTypeDragHandled = 'drag-handled'

// used just between components 
export const EventTypeZoom = 'zoom'
export const EventTypeAssetType = 'asset-type'

// TODO: dispatched by mash and used
export const EventTypeTracks = 'tracks'

// TODO: dispatched by mash and unused
export const EventTypePause = 'pause'
export const EventTypePlay = 'play'
export const EventTypePlaying = 'playing'
export const EventTypeSeeking = 'seeking'
export const EventTypeSeeked = 'seeked'
export const EventTypeEnded = 'ended'

// TODO: unused!
export const EventTypeWaiting = 'waiting'
export const EventTypeTrack = 'track'
export const EventTypeRender = 'render'
export const EventTypeLoaded = 'loadeddata'


// TODO: dispatched by masher but not used
export const EventTypeFps = 'ratechange'
export const EventTypeVolume = 'volumechange'
export const EventTypeAdded = 'added'

