import type { AssetObject, Edit, AssetParams, ClientAssets, ClientMashAsset, AssetPromiseEventDetail, RawType, RawTypes, DataType, DefiniteError, Exporters, Importers, PropertyId, PropertyIds, Rect, Scalar, ScalarsById, SelectorTypes, Size, Source, Sources, StringRecord, Strings, TargetId, TargetIds, Time, TimeRange, AssetObjects } from '@moviemasher/shared-lib/types.js'
import type { ClipLocation, EventClipDetail, EventExportersDetail, EventImportFileDetail, EventImporterAddDetail, EventImporterNodeFunctionDetail, EventPickDetail, EventPickedDetail, EventSelectableDetail, NodeFunctionMap, SelectedProperties } from '../types.js'

import { $CHANGE_FRAME, $CLIP, $FRAMES, customEventClass } from '@moviemasher/shared-lib/runtime.js'
import { ICON, IMPORT, TRANSLATE } from '../runtime.js'
import { AssetEventDetail, AssetObjectEventDetail, AssetObjectsParams, EventAddAssetsDetail, EventAssetElementDetail, EventAssetObjectsDetail, EventChangeScalarDetail, EventClipElementDetail, EventClipIdDetail, EventControlDetail, EventControlGroupDetail, EventDataTypeDetail, EventDoServerActionDetail, EventEnabledClientActionDetail, EventEnabledServerActionDetail, EventIconDetail, EventImportDetail, EventImportersDetail, EventInspectorSelectorsDetail, EventManagedAssetIconDetail, EventManagedAssetIdDetail, EventManagedAssetsDetail, EventMoveClipDetail, EventPreviewsDetail, EventProgressDetail, EventPropertyIdsDetail, EventScalarDetail, EventSelectedPropertiesDetail, EventTrackClipIconDetail, EventTranslateDetail, TrackClipsEventDetail } from '../types.js'
import { isString } from '@moviemasher/shared-lib/utility/guard.js'

export class NumberEvent extends customEventClass<number>() {}
export class StringEvent extends customEventClass<string>() {}

/**
 * Dispatch to retrieve the time range of the mash's selected clip.
 * @category ClientEvents
 */
export class EventTimeRange extends customEventClass<{ timeRange?: TimeRange }>() {
  static Type = 'time-range'
  constructor(..._: any[]) { super(EventTimeRange.Type, { detail: {} }) }
}

/**
 * Dispatch to retrieve the total number of frames in the mash.
 * @category ClientEvents
 */
export class EventFrames extends customEventClass<{ frames: number }>() {
  static Type = $FRAMES
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
export class EventMashTime extends customEventClass<{ time?: Time }>() {
  static Type = 'mash-time'
  constructor(..._: any[]) { super(EventMashTime.Type, { detail: {} }) }
}

/**
 * Dispatch to change the mash's current frame.
 * @category ClientEvents
 */
export class EventChangeFrame extends NumberEvent {
  static Type = $CHANGE_FRAME
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
export class EventDataType extends customEventClass<EventDataTypeDetail>() {
  static Type = 'data-type'
  constructor(propertyId: PropertyId) {
    super(EventDataType.Type, { detail: { propertyId } })
  }
}

/**
 * Dispatch to initiate a client action.
 * @category ClientEvents
 */
export class EventDoClientAction extends customEventClass<string>() {
  static Type = 'do-client-action'
  constructor(clientAction: string) {
    super(EventDoClientAction.Type, { detail: clientAction })
  }
}

/**
 * Dispatched when the enabled state of a particular client action has changed.
 * @category ClientEvents
 */
export class EventChangedClientAction extends customEventClass<string>() {
  static Type = 'changed-client-action'
  constructor(detail: string) { super(EventChangedClientAction.Type, { detail }) }
}

/**
 * Dispatch to retrieve current enabled state of a client action.
 * @category ClientEvents
 */
export class EventEnabledClientAction extends customEventClass<EventEnabledClientActionDetail>() {
  static Type = 'enabled-client-action'
  constructor(clientAction: string) {
    super(EventEnabledClientAction.Type, { detail: { clientAction } })
  }
}

/**
 * Dispatched as progress is made on a server action with provided id.
 * @category ClientEvents
 */
export class EventProgress extends customEventClass<EventProgressDetail>() {
  static Type = 'progress'
  constructor(id: string, progress: number) {
    super(EventProgress.Type, { detail: { id, progress } })
  }
}

/**
 * Dispatch to initiate a server action, optionally dispatching progress events.
 * @category ClientEvents
 */
export class EventDoServerAction extends customEventClass<EventDoServerActionDetail>() {
  static Type = 'do-server-action'
  constructor(serverAction: string, id?: string) {
    super(EventDoServerAction.Type, { detail: { serverAction, id } })
  }
}

/**
 * Dispatched when the enabled state of a particular server action has changed.
 * @category ClientEvents
 */
export class EventChangedServerAction extends customEventClass<string>() {
  static Type = 'changed-server-action'
  constructor(detail: string) { super(EventChangedServerAction.Type, { detail }) }
}

/**
 * Dispatch to retrieve current enabled state of a server action.
 * @category ClientEvents
 */
export class EventEnabledServerAction extends customEventClass<EventEnabledServerActionDetail>() {
  static Type = 'enabled-server-action'
  constructor(serverAction: string) {
    super(EventEnabledServerAction.Type, { detail: { serverAction } })
  }
}

/**
 * Dispatched when there's a new mash loaded.
 * @category ClientEvents
 */
export class EventChangedMashAsset extends customEventClass<ClientMashAsset | undefined>() {
  static Type = 'changed-mash-asset'
  constructor(detail?: ClientMashAsset) { super(EventChangedMashAsset.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash being edited.
 * @category ClientEvents
 */
export class EventMashAsset extends customEventClass<{ mashAsset?: ClientMashAsset }>() {
  static Type = 'mash-asset'
  constructor(..._: any[]) {
    super(EventMashAsset.Type, { detail: {} })
  }
}

/**
 * Dispatch to change the dragging state.
 * @category ClientEvents
 */
export class EventChangeDragging extends customEventClass<boolean>() {
  static Type = 'change-dragging'
  constructor(detail: boolean) { super(EventChangeDragging.Type, { detail }) }
}

/**
 * Dispatch to retrieve current dragging state.
 * @category ClientEvents
 */
export class EventDragging extends customEventClass<{ dragging?: boolean }>() {
  static Type = 'dragging'
  constructor() { super(EventDragging.Type, { detail: {} }) }
}

/**
 * Dispatch to retrieve a clip element for display.
 * @category ClientEvents
 */
export class EventClipElement extends customEventClass<EventClipElementDetail>() {
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
export class EventAssetElement extends customEventClass<EventAssetElementDetail>() {
  static Type = 'asset-element'
  constructor(assetId: string, size: Size, cover?: boolean, label?: string, icons?: boolean, labels?: boolean) {
    super(EventAssetElement.Type, { detail: { assetId, size, cover, label, labels, icons } })
  }
}

/**
 * Dispatch to change the mash's selected asset id.
 * @category ClientEvents
 */
export class EventChangeAssetId extends customEventClass<string | undefined>() {
  static Type = 'change-asset-id'
  constructor(detail?: string) {
    super(EventChangeAssetId.Type, { detail })
  }
}

/**
 * Dispatched when the mash's selected asset id has changed.
 * @category ClientEvents
 */
export class EventChangedAssetId extends customEventClass<string | undefined>() {
  static Type = 'changed-asset-id'
  constructor(detail?: string) {
    super(EventChangedAssetId.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the mash's selected asset id.
 * @category ClientEvents
 */
export class EventAssetId extends customEventClass<{ assetId?: string }>() {
  static Type = 'asset-id'
  constructor(..._: any[]) {
    super(EventAssetId.Type, { detail: {} })
  }
}

/**
 * Dispatch when the preview rectangle has changed.
 * @category ClientEvents
 */
export class EventRect extends customEventClass<{ rect?: Rect }>() {
  static Type = 'change-rect'
  constructor() { super(EventRect.Type, { detail: {} }) }
}

/**
 * Dispatced when the mash's targets have changed.
 * @category ClientEvents
 */
export class EventChangedTargetIds extends customEventClass<TargetIds>() {
  static Type = 'changed-target-ids'
  constructor(detail: TargetIds) { super(EventChangedTargetIds.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash's current targets.
 * @category ClientEvents
 */
export class EventTargetIds extends customEventClass<TargetIds>() {
  static Type = 'target-ids'
  constructor(detail: TargetIds = []) { super(EventTargetIds.Type, { detail }) }
}

/**
 * Dispatched when the mash's size has changed.
 * @category ClientEvents
 */
export class EventChangedSize extends customEventClass<Size>() {
  static Type = 'changed-size'
  constructor(detail: Size) { super(EventChangedSize.Type, { detail }) }
}

/**
 * Dispatch to retrieve the mash's current size.
 * @category ClientEvents
 */
export class EventSize extends customEventClass<{ size?: Size }>() {
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
export class EventSelectable extends customEventClass<EventSelectableDetail>() {
  static Type = 'selectable'
  constructor(targetId: TargetId) {
    super(EventSelectable.Type, { detail: { targetId } })
  }
}

/**
 * Dispatch to retreve the property ids of the mash's current targets.
 * @category ClientEvents
 */
export class EventPropertyIds extends customEventClass<EventPropertyIdsDetail>() {
  static Type = 'property-ids'
  constructor(targetIds: TargetIds = [], propertyIds: PropertyIds = []) {
    super(EventPropertyIds.Type, { detail: { targetIds, propertyIds } })
  }
}

/**
 * Dispatch to retrieve the id of the mash's currently selected clip.
 * @category ClientEvents
 */
export class EventClipId extends customEventClass<EventClipIdDetail>() {
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
export class EventEdited extends customEventClass<Edit>() {
  static Type = 'edited'
  constructor(detail: Edit) { super(EventEdited.Type, { detail }) }
}

/**
 * Dispatch to retrieve selected properties.
 * @category ClientEvents
 */
export class EventSelectedProperties extends customEventClass<EventSelectedPropertiesDetail>() {
  static Type = 'selected-properties'
  constructor(selectorTypes: SelectorTypes = [], selectedProperties: SelectedProperties = []) {
    super(EventSelectedProperties.Type, { detail: { selectorTypes, selectedProperties } })
  }
}

/**
 * Dispatch to retrieve the mash's current previews.
 * @category ClientEvents
 */
export class EventPreviews extends customEventClass<EventPreviewsDetail>() {
  static Type = 'previews'
  constructor(size?: Size | number) {
    super(EventPreviews.Type, { detail: { size } })
  }
}

/**
 * Dispatch to retrieve the scalar that corresponds to a property id.
 * @category ClientEvents
 */
export class EventScalar extends customEventClass<EventScalarDetail>() {
  static Type = 'scalar'
  constructor(propertyId: PropertyId) {
    super(EventScalar.Type, { detail: { propertyId } })
  }
}

/**
 * Dispatch to retrieve a clip for a clip id.
 */
export class EventClip extends customEventClass<EventClipDetail>() {
  static Type = $CLIP
  constructor(clipId: string) {
    super(EventClip.Type, { detail: { clipId } })
  }
}


/**
 * Dispatch to change the scalar that corresponds to a property id.
 * @category ClientEvents
 */
export class EventChangeScalar extends customEventClass<EventChangeScalarDetail>() {
  static Type = 'change-scalar'
  constructor(propertyId: PropertyId, value?: Scalar) {
    super(EventChangeScalar.Type, { detail: { propertyId, value } })
  }
}

/**
 * Dispatch to change multiple scalars that correspond to property ids.
 * @category ClientEvents
 */
export class EventChangeScalars extends customEventClass<ScalarsById>() {
  static Type = 'change-scalars'
  constructor(detail: ScalarsById) {
    super(EventChangeScalars.Type, { detail })
  }
}

/**
 * Dispatched when scalars that correspond to property ids have changed.
 * @category ClientEvents
 */
export class EventChangedScalars extends customEventClass<PropertyIds>() {
  static Type = 'changed-scalars'
  constructor(detail: PropertyIds) {
    super(EventChangedScalars.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a control group.
 * @category ClientEvents
 */
export class EventControlGroup extends customEventClass<EventControlGroupDetail>() {
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
export class EventControl extends customEventClass<EventControlDetail>() {
  static Type = 'control'
  constructor(type: DataType, propertyId: PropertyId) {
    super(EventControl.Type, { detail: { type, propertyId } })
  }
}

/**
 * Dispatch to retrieve the inspector's filtered selectors.
 * @category ClientEvents
 */
export class EventInspectorSelectors extends customEventClass<EventInspectorSelectorsDetail>() {
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
export class EventChangedInspectorSelectors extends customEventClass<EventInspectorSelectorsDetail>() {
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
 * Dispatch to import file(s) and get promise for corresponding asset objects.
 * @category ClientEvents
 */
export class EventImport extends customEventClass<EventImportDetail>() {
  static Type = 'import-old'
  constructor(fileList: FileList) {
    super(EventImport.Type, { detail: { fileList } })
  }
}

/**
 * Dispatch to import a file and get promise for corresponding asset object.
 * @category ClientEvents
 */
export class EventImportFile extends customEventClass<EventImportFileDetail>() {
  static Type = IMPORT
  constructor(file: File, source?: Source) {
    super(EventImportFile.Type, { detail: { file, source } })
  }
}

/**
 * Dispatch to retrieve icon promise for an icon ID.
 * @category ClientEvents
 */
export class EventIcon extends customEventClass<EventIconDetail>() {
  static Type = ICON
  constructor(id: string, values?: StringRecord) {
    super(EventIcon.Type, { detail: { id, values } })
  }
}

/**
 * Dispatch to retrieve the mash asset object to edit.
 * @category ClientEvents
 */
export class EventAssetObject extends customEventClass<AssetObjectEventDetail>() {
  static Type = 'asset-object'
  constructor(assetType?: RawType) {
    super(EventAssetObject.Type, { detail: { assetType } })
  }
}

/**
 * Dispatch to retrieve asset objects to display.
 * @category ClientEvents
 */
export class EventAssetObjects extends customEventClass<EventAssetObjectsDetail>() {
  static Type = 'asset-objects'
  constructor(detail: AssetParams) {
    super(EventAssetObjects.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the assets to display.
 * @category ClientEvents
 */
export class EventManagedAssets extends customEventClass<EventManagedAssetsDetail>() {
  static Type = 'managed-assets'
  constructor(detail: AssetObjectsParams) {
    super(EventManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a map with icon node and corresponding ui node promise.
 * @category ClientEvents
 */
export class EventImporterNodeFunction extends customEventClass<EventImporterNodeFunctionDetail>() {
  static Type = 'importer-node-function'
  constructor(types: RawTypes = [], sources: Sources = [], map: NodeFunctionMap = new Map) {
    super(EventImporterNodeFunction.Type, { detail: { types, sources, map } })
  }
}

/**
 * Dispatch to retrieve an array of importers.
 * @category ClientEvents
 */
export class EventImporters extends customEventClass<EventImportersDetail>() {
  static Type = 'importers'
  constructor(importers: Importers = []) {
    super(EventImporters.Type, { detail: { importers } })
  }
}
/**
 * Dispatch to retrieve an array of exporters.
 * @category ClientEvents
 */
export class EventExporters extends customEventClass<EventExportersDetail>() {
  static Type = 'exporters'
  constructor(exporters: Exporters = []) {
    super(EventExporters.Type, { detail: { exporters } })
  }
}

/**
 * Dispatched when assets will be destroyed unless removed from detail array.
 */
export class EventWillDestroy extends customEventClass<Strings>() {
  static Type = 'will-destroy'
  constructor(detail: Strings) {
    super(EventWillDestroy.Type, { detail })
  }
}

/**
 * Dispatched when assets can be potentially destroyed if not referenced.
 */
export class EventCanDestroy extends customEventClass<Strings>() {
  static Type = 'can-destroy'
  constructor(detail: Strings) {
    super(EventCanDestroy.Type, { detail })
  }
}



/**
 * Dispatch to import managed assets from client asset objects.
 * @category ClientEvents
 */
export class EventImportManagedAssets extends customEventClass<AssetObjects>() {
  static Type = 'import-asset-objects'
  constructor(detail: AssetObjects) {
    super(EventImportManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve the savable state of managed assets.
 * @category ClientEvents
 */
export class EventSavableManagedAsset extends customEventClass<{ savable: boolean }>() {
  static Type = 'savable-managed-asset'
  constructor() {
    super(EventSavableManagedAsset.Type, { detail: { savable: false } })
  }
}

/**
 * Dispatch to retrieve the clips for a track.
 * @category ClientEvents
 */
export class EventTrackClips extends customEventClass<TrackClipsEventDetail>() {
  static Type = 'track-clips'
  constructor(trackIndex: number) {
    super(EventTrackClips.Type, { detail: { trackIndex } })
  }
}

/**
 * Dispatch to retrieve the savable managed assets.
 * @category ClientEvents
 */
export class EventSavableManagedAssets extends customEventClass<{ assets: ClientAssets }>() {
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
export class EventTrackClipIcon extends customEventClass<EventTrackClipIconDetail>() {
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
export class EventImporterError extends customEventClass<DefiniteError>() {
  static Type = 'importer-error'
  constructor(detail: DefiniteError) { 
    super(EventImporterError.Type, { detail }) 
  }
}

/**
 * Dispatched when an importer has added asset objects.
 * @category ClientEvents
 */
export class EventImporterAdd extends customEventClass<EventImporterAddDetail>() {
  static Type = 'importer-add'
  constructor(assetObject: AssetObject) {
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
export class EventMoveClip extends customEventClass<EventMoveClipDetail>() {
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
export class EventRemoveClip extends customEventClass<{ clipId: string }>() {
  static Type = 'remove-clip'
  constructor(clipId: string) {
    super(EventRemoveClip.Type, { detail: { clipId } })
  }
}



/**
 * Dispatch to change the browser content.
 * @category ClientEvents
 */
export class EventPick extends customEventClass<EventPickDetail>() {
  static Type = 'pick'
  constructor(picker = '', picked: string) { 
    super(EventPick.Type, { detail: { picker, picked } }) 
}
}



/**
 * Dispatch to retrieve the browser content.
 * @category ClientEvents
 */
export class EventPicked extends customEventClass<EventPickedDetail>() {
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
export class EventScrollRoot extends customEventClass<{ root?: Element }>() {
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
export class EventTranslate extends customEventClass<EventTranslateDetail>() {
  static Type = TRANSLATE
  constructor(id: string, values?: StringRecord) {
    super(EventTranslate.Type, { detail: { id, values } })
  }
}


/**
 * Dispatch to retrieve a promise that returns a managed asset's icon.
 * @category ClientEvents
 */
export class EventManagedAssetIcon extends customEventClass<EventManagedAssetIconDetail>() {
  static Type = 'managed-asset-icon'
  constructor(assetId: string, size: Size, cover?: boolean) {
    super(EventManagedAssetIcon.Type, { detail: { assetId, size, cover } })
  }
}

/**
 * Dispatch when a managed asset's id has been changed.
 * @category ClientEvents
 */
export class EventManagedAssetId extends customEventClass<EventManagedAssetIdDetail>() {
  static Type = 'managed-asset-id'
  constructor(previousId: string, currentId: string) {
    super(EventManagedAssetId.Type, { detail: { previousId, currentId } })
  }
}

/**
 * Dispatch to add clips to mash for assets.
 * @category ClientEvents
 */
export class EventAddAssets extends customEventClass<EventAddAssetsDetail>() {
  static Type = 'add-assets'
  constructor(assets: ClientAssets, mashIndex?: ClipLocation) {
    super(EventAddAssets.Type, { detail: { assets, mashIndex } })
  }
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 * @category ClientEvents
 */
export class EventManagedAsset extends customEventClass<AssetEventDetail>() {
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
export class EventManagedAssetPromise extends customEventClass<AssetPromiseEventDetail>() {
  static Type = 'managed-asset-promise'
  constructor(assetIdOrObject: string | AssetObject) {
    const string = isString(assetIdOrObject)
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    super(EventManagedAssetPromise.Type, { detail: { assetId, assetObject } })
  }
}
