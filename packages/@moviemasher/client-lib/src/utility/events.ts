import type { AssetObject, AssetParams, AssetPromiseEventDetail, AssetType, AssetTypes, ClientMediaRequest, DataType, DecodeOptions, DecodingType, DefiniteError, EncodeOptions, EncodingType, Exporters, Importers, MashAssetObject, PropertyId, PropertyIds, Rect, Scalar, ScalarsById, SelectorTypes, Size, Source, Sources, StringRecord, Strings, TargetId, TargetIds, Time, TimeRange, TranscodeOptions, TranscodingType } from '@moviemasher/shared-lib/types.js'
import type { ClientAction, ClientAsset, ClientAssetObject, ClientAssetObjects, ClientAssets, ClientMashAsset, ClientRawAsset, ClipLocation, Edit, EventClientImageUrlPromiseDetail, EventClipDetail, EventExportersDetail, EventImportFileDetail, EventImporterAddDetail, EventImporterNodeFunctionDetail, EventPickDetail, EventPickedDetail, EventSelectableDetail, NodeFunctionMap, SelectedProperties, ServerAction, ServerProgress } from '../types.js'

import { ASSET_TARGET, CLIP_TARGET, DECODE, ENCODE, TRANSCODE, isString } from '@moviemasher/shared-lib/runtime.js'
import { ICON, IMPORT, SAVE, TRANSLATE } from '../runtime.js'
import { AssetEventDetail, AssetObjectEventDetail, AssetObjectsParams, EventAddAssetsDetail, EventAssetElementDetail, EventAssetObjectsDetail, EventChangeScalarDetail, EventClientAudioPromiseDetail, EventClientDecodeDetail, EventClientEncodeDetail, EventClientFontPromiseDetail, EventClientImagePromiseDetail, EventClientTranscodeDetail, EventClientVideoPromiseDetail, EventClipElementDetail, EventClipIdDetail, EventControlDetail, EventControlGroupDetail, EventDataTypeDetail, EventDoServerActionDetail, EventEnabledClientActionDetail, EventEnabledServerActionDetail, EventIconDetail, EventImportDetail, EventImportersDetail, EventInspectorSelectorsDetail, EventManagedAssetIconDetail, EventManagedAssetIdDetail, EventManagedAssetsDetail, EventMoveClipDetail, EventPreviewsDetail, EventProgressDetail, EventPropertyIdsDetail, EventSaveDetail, EventScalarDetail, EventSelectedPropertiesDetail, EventTrackClipIconDetail, EventTranslateDetail, EventUploadDetail, TrackClipsEventDetail } from '../types.js'

export class NumberEvent extends CustomEvent<number> { }
export class StringEvent extends CustomEvent<string> { }

/**
 * Dispatch to initiate a decode request for an asset.
 * @category ClientEvents
 */
export class EventClientDecode extends CustomEvent<EventClientDecodeDetail> {
  static Type = DECODE
  constructor(asset: ClientRawAsset, decodingType: DecodingType, options?: DecodeOptions, progress?: ServerProgress) {
    super(EventClientDecode.Type, { detail: { asset, options, decodingType, progress } })
  }
}

/**
 * Dispatch to initiate an encode request for a mash.
 * @category ClientEvents
 */
export class EventClientEncode extends CustomEvent<EventClientEncodeDetail> {
  static Type = ENCODE
  constructor(mashAssetObject: MashAssetObject, encodingType?: EncodingType, encodeOptions?: EncodeOptions, progress?: ServerProgress) {
    super(EventClientEncode.Type, { detail: { mashAssetObject, encodingType, encodeOptions, progress } })
  }
}

/**
 * Dispatch to initiate a transcoding request for an asset.
 * @category ClientEvents
 */
export class EventClientTranscode extends CustomEvent<EventClientTranscodeDetail> {
  static Type = TRANSCODE
  constructor(asset: ClientRawAsset, transcodingType: TranscodingType, options?: TranscodeOptions, progress?: ServerProgress) {
    super(EventClientTranscode.Type, { detail: { asset, transcodingType, options, progress } })
  }
}

/**
 * Dispatch to initiate a save request for an asset.
 * @category ClientEvents
 */
export class EventSave extends CustomEvent<EventSaveDetail> {
  static Type = SAVE
  constructor(asset: ClientAsset, progress?: ServerProgress) {
    super(EventSave.Type, { detail: { asset, progress } })
  }
}

/**
 * Dispatch to initiate an upload request, optionally replacing an existing asset.
 * @category ClientEvents
 */
export class EventUpload extends CustomEvent<EventUploadDetail> {
  static Type = 'upload'
  constructor(request: ClientMediaRequest, progress?: ServerProgress, id?: string) {
    super(EventUpload.Type, { detail: { request, progress, id } })
  }
}

/**
 * Dispatch to retrieve the time range of the mash's selected clip.
 * @category ClientEvents
 */
export class EventTimeRange extends CustomEvent<{ timeRange?: TimeRange }> {
  static Type = 'time-range'
  constructor(..._: any[]) { super(EventTimeRange.Type, { detail: {} }) }
}

/**
 * Dispatch to retrieve the total number of frames in the mash.
 * @category ClientEvents
 */
export class EventFrames extends CustomEvent<{ frames: number }> {
  static Type = 'frames'
  constructor() {
    super(EventFrames.Type, { detail: { frames: 0 } })
  }
}

/**
 * Dispatched when the total number of frames in the mash changes.
 * @category ClientEvents
 */
export class EventChangedFrames extends NumberEvent {
  static Type = 'changed-frames'
  constructor(frames: number) { super(EventChangedFrames.Type, { detail: frames }) }
}

/**
 * Dispatch to retrieve the mash's current frame.
 * @category ClientEvents
 */
export class EventMashTime extends CustomEvent<{ time?: Time }> {
  static Type = 'mash-time'
  constructor(..._: any[]) { super(EventMashTime.Type, { detail: {} }) }
}

/**
 * Dispatch to change the mash's current frame.
 * @category ClientEvents
 */
export class EventChangeFrame extends NumberEvent {
  static Type = 'change-frame'
  constructor(detail: number) { super(EventChangeFrame.Type, { detail }) }
}

/**
 * Dispatched when the mash's current frame has changed.
 * Note that EventChangedFrame.Type value matches HTMLMediaElement.
 * @category ClientEvents
 */
export class EventChangedFrame extends NumberEvent {
  // to match HTMLMediaElement
  static Type = 'timeupdate'
  constructor(detail: number) { super(EventChangedFrame.Type, { detail }) }
}

/**
 * Dispatch to retrieve data type from a property id.
 * @category ClientEvents
 */
export class EventDataType extends CustomEvent<EventDataTypeDetail> {
  static Type = 'data-type'
  constructor(propertyId: PropertyId) {
    super(EventDataType.Type, { detail: { propertyId } })
  }
}

/**
 * Dispatch to retrieve a promise that returns a managed asset's icon.
 * @category ClientEvents
 */
export class EventManagedAssetIcon extends CustomEvent<EventManagedAssetIconDetail> {
  static Type = 'managed-asset-icon'
  constructor(assetId: string, size: Size, cover?: boolean) {
    super(EventManagedAssetIcon.Type, { detail: { assetId, size, cover } })
  }
}

/**
 * Dispatch when a managed asset's id has been changed.
 * @category ClientEvents
 */
export class EventManagedAssetId extends CustomEvent<EventManagedAssetIdDetail> {
  static Type = 'managed-asset-id'
  constructor(previousId: string, currentId: string) {
    super(EventManagedAssetId.Type, { detail: { previousId, currentId } })
  }
}

/**
 * Dispatch to add clips to mash for assets.
 * @category ClientEvents
 */
export class EventAddAssets extends CustomEvent<EventAddAssetsDetail> {
  static Type = 'add-assets'
  constructor(assets: ClientAssets, mashIndex?: ClipLocation) {
    super(EventAddAssets.Type, { detail: { assets, mashIndex } })
  }
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 * @category ClientEvents
 */
export class EventManagedAsset extends CustomEvent<AssetEventDetail> {
  static Type = 'managed-asset'
  constructor(assetIdOrObject: string | AssetObject) {
    const string = isString(assetIdOrObject)
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail: AssetEventDetail = { assetId, assetObject }
    super(EventManagedAsset.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 * @category ClientEvents
 */
export class EventManagedAssetPromise extends CustomEvent<AssetPromiseEventDetail> {
  static Type = 'managed-asset-promise'
  constructor(assetIdOrObject: string | AssetObject) {
    const string = isString(assetIdOrObject)
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail: AssetPromiseEventDetail = { assetId, assetObject }
    super(EventManagedAssetPromise.Type, { detail })
  }
}


/**
 * Dispatch to retrieve an asset from an asset id or object.
 * @category ClientEvents
 */
export class EventAsset extends CustomEvent<AssetEventDetail> {
  static Type = ASSET_TARGET
  constructor(assetIdOrObject: string | AssetObject) {
    const string = isString(assetIdOrObject)
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventAsset.Type, { detail })
  }
}

/**
 * Dispatch to initiate a client action.
 * @category ClientEvents
 */
export class EventDoClientAction extends CustomEvent<ClientAction> {
  static Type = 'do-client-action'
  constructor(clientAction: ClientAction) {
    super(EventDoClientAction.Type, { detail: clientAction })
  }
}

/**
 * Dispatched when the enabled state of a particular client action has changed.
 * @category ClientEvents
 */
export class EventChangedClientAction extends CustomEvent<ClientAction> {
  static Type = 'changed-client-action'
  constructor(detail: ClientAction) { super(EventChangedClientAction.Type, { detail }) }
}

/**
 * Dispatch to retrieve current enabled state of a client action.
 * @category ClientEvents
 */
export class EventEnabledClientAction extends CustomEvent<EventEnabledClientActionDetail> {
  static Type = 'enabled-client-action'
  constructor(clientAction: ClientAction) {
    super(EventEnabledClientAction.Type, { detail: { clientAction } })
  }
}

/**
 * Dispatched as progress is made on a server action with provided id.
 * @category ClientEvents
 */
export class EventProgress extends CustomEvent<EventProgressDetail> {
  static Type = 'progress'
  constructor(id: string, progress: number) {
    super(EventProgress.Type, { detail: { id, progress } })
  }
}

/**
 * Dispatch to initiate a server action, optionally dispatching progress events.
 * @category ClientEvents
 */
export class EventDoServerAction extends CustomEvent<EventDoServerActionDetail> {
  static Type = 'do-server-action'
  constructor(serverAction: ServerAction, id?: string) {
    super(EventDoServerAction.Type, { detail: { serverAction, id } })
  }
}

/**
 * Dispatched when the enabled state of a particular server action has changed.
 * @category ClientEvents
 */
export class EventChangedServerAction extends CustomEvent<ServerAction> {
  static Type = 'changed-server-action'
  constructor(detail: ServerAction) { super(EventChangedServerAction.Type, { detail }) }
}

/**
 * Dispatch to retrieve current enabled state of a server action.
 * @category ClientEvents
 */
export class EventEnabledServerAction extends CustomEvent<EventEnabledServerActionDetail> {
  static Type = 'enabled-server-action'
  constructor(serverAction: ServerAction) {
    super(EventEnabledServerAction.Type, { detail: { serverAction } })
  }
}

/**
 * Dispatched when there's a new mash loaded.
 * @category ClientEvents
 */
export class EventChangedMashAsset extends CustomEvent<ClientMashAsset | undefined> {
  static Type = 'changed-mash-asset'
  constructor(detail?: ClientMashAsset) { super(EventChangedMashAsset.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash being edited.
 * @category ClientEvents
 */
export class EventMashAsset extends CustomEvent<{ mashAsset?: ClientMashAsset }> {
  static Type = 'mash-asset'
  constructor(..._: any[]) {
    super(EventMashAsset.Type, { detail: {} })
  }
}

/**
 * Dispatch to change the dragging state.
 * @category ClientEvents
 */
export class EventChangeDragging extends CustomEvent<boolean> {
  static Type = 'change-dragging'
  constructor(detail: boolean) { super(EventChangeDragging.Type, { detail }) }
}

/**
 * Dispatch to retrieve current dragging state.
 * @category ClientEvents
 */
export class EventDragging extends CustomEvent<{ dragging?: boolean }> {
  static Type = 'dragging'
  constructor() { super(EventDragging.Type, { detail: {} }) }
}

/**
 * Dispatch to retrieve a clip element for display.
 * @category ClientEvents
 */
export class EventClipElement extends CustomEvent<EventClipElementDetail> {
  static Type = 'clip-element'
  constructor(clipId: string, maxWidth: number, scale: number, trackIndex: number, trackWidth: number, width: number, left: number, label?: string, element?: Element, labels?: boolean, icons?: boolean) {
    super(EventClipElement.Type, {
      detail: { 
        clipId, maxWidth, scale, trackIndex, trackWidth, width, left, label, 
        element,
        labels, icons 
      }
    })
  }
}

/**
 * Dispatch to retrieve an asset's element for display.
 * @category ClientEvents
 */
export class EventAssetElement extends CustomEvent<EventAssetElementDetail> {
  static Type = 'asset-element'
  constructor(assetId: string, size: Size, cover?: boolean, label?: string, icons?: boolean, labels?: boolean) {
    super(EventAssetElement.Type, { detail: { assetId, size, cover, label, labels, icons } })
  }
}

/**
 * Dispatch to change the mash's selected asset id.
 * @category ClientEvents
 */
export class EventChangeAssetId extends CustomEvent<string | undefined> {
  static Type = 'change-asset-id'
  constructor(detail?: string) {
    super(EventChangeAssetId.Type, { detail })
  }
}

/**
 * Dispatched when the mash's selected asset id has changed.
 * @category ClientEvents
 */
export class EventChangedAssetId extends CustomEvent<string | undefined> {
  static Type = 'changed-asset-id'
  constructor(detail?: string) {
    super(EventChangedAssetId.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the mash's selected asset id.
 * @category ClientEvents
 */
export class EventAssetId extends CustomEvent<{ assetId?: string }> {
  static Type = 'asset-id'
  constructor(..._: any[]) {
    super(EventAssetId.Type, { detail: {} })
  }
}

/**
 * Dispatch when the preview rectangle has changed.
 * @category ClientEvents
 */
export class EventRect extends CustomEvent<{ rect?: Rect }> {
  static Type = 'change-rect'
  constructor() { super(EventRect.Type, { detail: {} }) }
}

/**
 * Dispatced when the mash's targets have changed.
 * @category ClientEvents
 */
export class EventChangedTargetIds extends CustomEvent<TargetIds> {
  static Type = 'changed-target-ids'
  constructor(detail: TargetIds) { super(EventChangedTargetIds.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash's current targets.
 * @category ClientEvents
 */
export class EventTargetIds extends CustomEvent<TargetIds> {
  static Type = 'target-ids'
  constructor(detail: TargetIds = []) { super(EventTargetIds.Type, { detail }) }
}

/**
 * Dispatched when the mash's size has changed.
 * @category ClientEvents
 */
export class EventChangedSize extends CustomEvent<Size> {
  static Type = 'changed-size'
  constructor(detail: Size) { super(EventChangedSize.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash's current size.
 * @category ClientEvents
 */
export class EventSize extends CustomEvent<{ size?: Size }> {
  static Type = 'size'
  constructor(..._: any[]) { super(EventSize.Type, { detail: {} }) }
}

/**
 * Dispatched when the mash has new previews to display.
 * @category ClientEvents
 */
export class EventChangedPreviews extends Event {
  static Type = 'changed-previews'
  constructor(_?: string) { super(EventChangedPreviews.Type) }
}

/** Dispatch to retrieve the mash's current target of type. */
export class EventSelectable extends CustomEvent<EventSelectableDetail> {
  static Type = 'selectable'
  constructor(targetId: TargetId) {
    super(EventSelectable.Type, { detail: { targetId } })
  }
}

/**
 * Dispatch to retreve the property ids of the mash's current targets.
 * @category ClientEvents
 */
export class EventPropertyIds extends CustomEvent<EventPropertyIdsDetail> {
  static Type = 'property-ids'
  constructor(targetIds: TargetIds = [], propertyIds: PropertyIds = []) {
    super(EventPropertyIds.Type, { detail: { targetIds, propertyIds } })
  }
}

/**
 * Dispatch to retrieve the id of the mash's currently selected clip.
 * @category ClientEvents
 */
export class EventClipId extends CustomEvent<EventClipIdDetail> {
  static Type = 'clip-id'
  constructor(..._: any[]) { super(EventClipId.Type, { detail: {} }) }
}

/**
 * Dispatch to set the currently selected clip.
 * @category ClientEvents
 */
export class EventChangeClipId extends StringEvent {
  static Type = 'change-clip-id'
  constructor(detail = '') { super(EventChangeClipId.Type, { detail }) }
}

/**
 * Dispatched when the mash's currently selected clip changes.
 * * @category ClientEvents
 */
export class EventChangedClipId extends StringEvent {
  static Type = 'changed-clip-id'
  constructor(detail = '') { super(EventChangedClipId.Type, { detail }) }
}

/**
 * Dispatched when a mash Edit has been done or undone.
 * @category ClientEvents
 */
export class EventEdited extends CustomEvent<Edit> {
  static Type = 'edited'
  constructor(detail: Edit) { super(EventEdited.Type, { detail }) }
}

/**
 * Dispatch to retrieve selected properties.
 * @category ClientEvents
 */
export class EventSelectedProperties extends CustomEvent<EventSelectedPropertiesDetail> {
  static Type = 'selected-properties'
  constructor(selectorTypes: SelectorTypes = [], selectedProperties: SelectedProperties = []) {
    super(EventSelectedProperties.Type, { detail: { selectorTypes, selectedProperties } })
  }
}

/**
 * Dispatch to retrieve the mash's current previews.
 * @category ClientEvents
 */
export class EventPreviews extends CustomEvent<EventPreviewsDetail> {
  static Type = 'previews'
  constructor(size?: Size | number) {
    super(EventPreviews.Type, { detail: { size } })
  }
}

/**
 * Dispatch to retrieve the scalar that corresponds to a property id.
 * @category ClientEvents
 */
export class EventScalar extends CustomEvent<EventScalarDetail> {
  static Type = 'scalar'
  constructor(propertyId: PropertyId) {
    super(EventScalar.Type, { detail: { propertyId } })
  }
}

/**
 * Dispatch to retrieve a clip for a clip id.
 */
export class EventClip extends CustomEvent<EventClipDetail> {
  static Type = CLIP_TARGET
  constructor(clipId: string) {
    super(EventClip.Type, { detail: { clipId } })
  }
}


/**
 * Dispatch to change the scalar that corresponds to a property id.
 * @category ClientEvents
 */
export class EventChangeScalar extends CustomEvent<EventChangeScalarDetail> {
  static Type = 'change-scalar'
  constructor(propertyId: PropertyId, value?: Scalar) {
    super(EventChangeScalar.Type, { detail: { propertyId, value } })
  }
}

/**
 * Dispatch to change multiple scalars that correspond to property ids.
 * @category ClientEvents
 */
export class EventChangeScalars extends CustomEvent<ScalarsById> {
  static Type = 'change-scalars'
  constructor(detail: ScalarsById) {
    super(EventChangeScalars.Type, { detail })
  }
}

/**
 * Dispatched when scalars that correspond to property ids have changed.
 * @category ClientEvents
 */
export class EventChangedScalars extends CustomEvent<PropertyIds> {
  static Type = 'changed-scalars'
  constructor(detail: PropertyIds) {
    super(EventChangedScalars.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a control group.
 * @category ClientEvents
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

/**
 * Dispatch to retrieve a control.
 * @category ClientEvents
 */
export class EventControl extends CustomEvent<EventControlDetail> {
  static Type = 'control'
  constructor(type: DataType, propertyId: PropertyId) {
    super(EventControl.Type, { detail: { type, propertyId } })
  }
}

/**
 * Dispatch to retrieve the inspector's filtered selectors.
 * @category ClientEvents
 */
export class EventInspectorSelectors extends CustomEvent<EventInspectorSelectorsDetail> {
  static Type = 'inspector-selectors'
  constructor(selectorTypes: SelectorTypes = [], filter?: string) {
    const detail: EventInspectorSelectorsDetail = { filter, selectorTypes }
    super(EventInspectorSelectors.Type, { detail })
  }
}

/**
 * Dispatch to set the inspector's filtered selectors.
 * @category ClientEvents
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
 * @category ClientEvents
 */
export class EventDialog extends StringEvent {
  static Type = 'dialog'
  constructor(detail = '') { super(EventDialog.Type, { detail }) }
}

/**
 * Dispatch to retrieve client audio promise for request.
 * @category ClientEvents
 */
export class EventClientAudioPromise extends CustomEvent<EventClientAudioPromiseDetail> {
  static Type = 'client-audio-promise'
  constructor(request: ClientMediaRequest) {
    super(EventClientAudioPromise.Type, { detail: { request } })
  }
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

/**
 * Dispatch to retrieve client image promise for request.
*/

export class EventClientImagePromise extends CustomEvent<EventClientImagePromiseDetail> {
  static Type = 'client-image-promise'
  constructor(request: ClientMediaRequest) {
    super(EventClientImagePromise.Type, { detail: { request } })
  }
}

/** Dispatch to retrieve client image URL promise for request. */
export class EventClientImageUrlPromise extends CustomEvent<EventClientImageUrlPromiseDetail> {
  static Type = 'client-image-url-promise'
  constructor(request: ClientMediaRequest) {
    super(EventClientImageUrlPromise.Type, { detail: { request } })
  }
}


/**
 * Dispatch to retrieve client video promise for request.
 * @category ClientEvents
 */
export class EventClientVideoPromise extends CustomEvent<EventClientVideoPromiseDetail> {
  static Type = 'client-video-promise'
  constructor(request: ClientMediaRequest) {
    super(EventClientVideoPromise.Type, { detail: { request } })
  }
}

/**
 * Dispatch to import file(s) and get promise for corresponding asset objects.
 * @category ClientEvents
 */
export class EventImport extends CustomEvent<EventImportDetail> {
  static Type = 'import-old'
  constructor(fileList: FileList) {
    super(EventImport.Type, { detail: { fileList } })
  }
}

/**
 * Dispatch to import a file and get promise for corresponding asset object.
 * @category ClientEvents
 */
export class EventImportFile extends CustomEvent<EventImportFileDetail> {
  static Type = IMPORT
  constructor(file: File, source?: Source) {
    super(EventImportFile.Type, { detail: { file, source } })
  }
}

/**
 * Dispatch to retrieve icon promise for an icon ID.
 * @category ClientEvents
 */
export class EventIcon extends CustomEvent<EventIconDetail> {
  static Type = ICON
  constructor(id: string, values?: StringRecord) {
    super(EventIcon.Type, { detail: { id, values } })
  }
}

/**
 * Dispatch to retrieve the mash asset object to edit.
 * @category ClientEvents
 */
export class EventAssetObject extends CustomEvent<AssetObjectEventDetail> {
  static Type = 'asset-object'
  constructor(assetType?: AssetType) {
    super(EventAssetObject.Type, { detail: { assetType } })
  }
}

/**
 * Dispatch to retrieve asset objects to display.
 * @category ClientEvents
 */
export class EventAssetObjects extends CustomEvent<EventAssetObjectsDetail> {
  static Type = 'asset-objects'
  constructor(detail: AssetParams) {
    super(EventAssetObjects.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the assets to display.
 * @category ClientEvents
 */
export class EventManagedAssets extends CustomEvent<EventManagedAssetsDetail> {
  static Type = 'managed-assets'
  constructor(detail: AssetObjectsParams) {
    super(EventManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a map with icon node and corresponding ui node promise.
 * @category ClientEvents
 */
export class EventImporterNodeFunction extends CustomEvent<EventImporterNodeFunctionDetail> {
  static Type = 'importer-node-function'
  constructor(types: AssetTypes = [], sources: Sources = [], map: NodeFunctionMap = new Map) {
    super(EventImporterNodeFunction.Type, { detail: { types, sources, map } })
  }
}

/**
 * Dispatch to retrieve an array of importers.
 * @category ClientEvents
 */
export class EventImporters extends CustomEvent<EventImportersDetail> {
  static Type = 'importers'
  constructor(importers: Importers = []) {
    super(EventImporters.Type, { detail: { importers } })
  }
}
/**
 * Dispatch to retrieve an array of exporters.
 * @category ClientEvents
 */
export class EventExporters extends CustomEvent<EventExportersDetail> {
  static Type = 'exporters'
  constructor(exporters: Exporters = []) {
    super(EventExporters.Type, { detail: { exporters } })
  }
}

/**
 * Dispatched when assets will be destroyed unless removed from detail array.
 */
export class EventWillDestroy extends CustomEvent<Strings> {
  static Type = 'will-destroy'
  constructor(detail: Strings) {
    super(EventWillDestroy.Type, { detail })
  }
}

/**
 * Dispatched when assets can be potentially destroyed if not referenced.
 */
export class EventCanDestroy extends CustomEvent<Strings> {
  static Type = 'can-destroy'
  constructor(detail: Strings) {
    super(EventCanDestroy.Type, { detail })
  }
}



/**
 * Dispatch to import managed assets from client asset objects.
 * @category ClientEvents
 */
export class EventImportManagedAssets extends CustomEvent<ClientAssetObjects> {
  static Type = 'import-asset-objects'
  constructor(detail: ClientAssetObjects) {
    super(EventImportManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the savable state of managed assets.
 * @category ClientEvents
 */
export class EventSavableManagedAsset extends CustomEvent<{ savable: boolean }> {
  static Type = 'savable-managed-asset'
  constructor() {
    super(EventSavableManagedAsset.Type, { detail: { savable: false } })
  }
}

/**
 * Dispatch to retrieve the clips for a track.
 * @category ClientEvents
 */
export class EventTrackClips extends CustomEvent<TrackClipsEventDetail> {
  static Type = 'track-clips'
  constructor(trackIndex: number) {
    super(EventTrackClips.Type, { detail: { trackIndex } })
  }
}

/**
 * Dispatch to retrieve the savable managed assets.
 * @category ClientEvents
 */
export class EventSavableManagedAssets extends CustomEvent<{ assets: ClientAssets }> {
  static Type = 'savable-managed-assets'
  constructor(assets: ClientAssets = []) {
    super(EventSavableManagedAssets.Type, { detail: { assets } })
  }
}

/**
 * Dispatched when managed assets have been imported.
 * @category ClientEvents
 */
export class EventChangedManagedAssets extends StringEvent {
  static Type = 'changed-managed-assets'
  constructor(detail = '') {
    super(EventChangedManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a track icon for a clip.
 * @category ClientEvents
 */
export class EventTrackClipIcon extends CustomEvent<EventTrackClipIconDetail> {
  static Type = 'track-clip-icon'
  constructor(clipId: string, clipSize: Size, scale: number, gap?: number) {
    super(EventTrackClipIcon.Type, { detail: { clipId, clipSize, scale, gap } })
  }
}

/**
 * Dispatched when an importer has finished importing.
 * @category ClientEvents
 */
export class EventImporterComplete extends Event {
  static Type = 'importer-complete'
  constructor() { super(EventImporterComplete.Type) }
}

/**
 * Dispatched when an importer has encountered an error.
 * @category ClientEvents
 */
export class EventImporterError extends CustomEvent<DefiniteError> {
  static Type = 'importer-error'
  constructor(detail: DefiniteError) { 
    super(EventImporterError.Type, { detail }) 
  }
}

/**
 * Dispatched when an importer has added asset objects.
 * @category ClientEvents
 */
export class EventImporterAdd extends CustomEvent<EventImporterAddDetail> {
  static Type = 'importer-add'
  constructor(assetObject: ClientAssetObject) {
    super(EventImporterAdd.Type, { detail: { assetObject } })
  }
}

/**
 * Dispatched when an importer has removed asset objects.
 * @category ClientEvents
 */
export class EventImporterRemove extends StringEvent {
  static Type = 'importer-remove'
  constructor(detail: string) {
    super(EventImporterRemove.Type, { detail })
  }
}

/**
 * Dispatch to move the selected clip within the mash.
 * @category ClientEvents
 */
export class EventMoveClip extends CustomEvent<EventMoveClipDetail> {
  static Type = 'move-clip'
  constructor(clipLocation: ClipLocation, clipId?: string) {
    super(EventMoveClip.Type, { detail: { clipLocation, clipId } })
  }
}

/**
 * Dispatch to remove a specific clip from the mash.
 * Alternatively, use EventDoClientAction to remove the selected clip.
 * @category ClientEvents
 */
export class EventRemoveClip extends CustomEvent<{ clipId: string }> {
  static Type = 'remove-clip'
  constructor(clipId: string) {
    super(EventRemoveClip.Type, { detail: { clipId } })
  }
}



/**
 * Dispatch to change the browser content.
 * @category ClientEvents
 */
export class EventPick extends CustomEvent<EventPickDetail> {
  static Type = 'pick'
  constructor(picker = '', picked: string) { 
    super(EventPick.Type, { detail: { picker, picked } }) 
}
}



/**
 * Dispatch to retrieve the browser content.
 * @category ClientEvents
 */
export class EventPicked extends CustomEvent<EventPickedDetail> {
  static Type = 'picked'
  constructor(picker: string) { 
    super(EventPicked.Type, { detail: { picker } }) 
  }
}
/**
 * Dispatch to change the mash's current zoom level.
 * @category ClientEvents
 */
export class EventZoom extends NumberEvent {
  static Type = 'zoom'
  constructor(detail: number) { super(EventZoom.Type, { detail }) }
}

/**
 * Dispatch to retrieve the root element that is scrolled.
 * @category ClientEvents
 */
export class EventScrollRoot extends CustomEvent<{ root?: Element }> {
  static Type = 'scroll-root'
  constructor() {
    super(EventScrollRoot.Type, {
      detail: {}, composed: true, bubbles: true, cancelable: true
    })
  }
}

/**
 * Dispatched to alert inspector target elements that they should update.
  * @category ClientEvents
  */
export class EventRequestUpdate extends Event {
  static Type = 'request-update'
  constructor() { super(EventRequestUpdate.Type, {
      composed: true, bubbles: true, cancelable: true
    }) 
  }
}

/**
 * Dispatched when the number of tracks in mash has changed.
 * @category ClientEvents
 */
export class EventChangedTracks extends NumberEvent {
  static Type = 'changed-tracks'
  constructor(detail: number) { super(EventChangedTracks.Type, { detail }) }
}

/**
 * Dispatch to translate a text string.
 * @category ClientEvents
 */
export class EventTranslate extends CustomEvent<EventTranslateDetail> {
  static Type = TRANSLATE
  constructor(id: string, values?: StringRecord) {
    super(EventTranslate.Type, { detail: { id, values } })
  }
}

