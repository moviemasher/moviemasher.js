import { importPromise, DECODE, ENCODE, TRANSCODE, assertAsset, ASSET, isAsset } from '@moviemasher/runtime-shared';

const ClassDisabled = 'disabled';
const ClassButton = 'button';
const ClassSelected = 'selected';
const ClassRow = 'row';
const ClassDropping = 'dropping';
const ClassTrack = 'track';
const ClassOutline = 'outline';
const ClassOutlines = 'outlines';
const ClassBounds = 'bounds';
const ClassBack = 'back';
const ClassLine = 'line';
const ClassHandle = 'handle';
const ClassFore = 'fore';
const ClassAnimate = 'animate';

const ClientActionAdd = 'add';
const ClientActionAddTrack = 'add-track';
const ClientActionFlip = 'flip';
const ClientActionRedo = 'redo';
const ClientActionRemove = 'remove';
const ClientActionTogglePaused = 'toggle-paused';
const ClientActionUndo = 'undo';
const ServerActionSave = 'save';
const ServerActionEncode = 'encode';
const ServerActionDecode = 'decode';
const ServerActionTranscode = 'transcode';

class ClientEventDispatcher extends EventTarget {
    addDispatchListener(type, listener, options) {
        this.addEventListener(type, listener, options);
        return this;
    }
    dispatch(typeOrEvent) {
        const event = typeof typeOrEvent === 'string' ? new CustomEvent(typeOrEvent) : typeOrEvent;
        return this.dispatchEvent(event);
    }
    listenersAdd(record) {
        Object.entries(record).forEach(([type, listener]) => {
            this.addDispatchListener(type, listener);
        });
    }
    listenersRemove(record) {
        Object.entries(record).forEach(([type, listener]) => {
            this.removeDispatchListener(type, listener);
        });
    }
    removeDispatchListener(type, listener, options) {
        this.removeEventListener(type, listener, options);
        return this;
    }
}

const MovieMasher = {
    eventDispatcher: new ClientEventDispatcher(),
    options: {
        imports: {
            ClientColorImageListeners: '@moviemasher/lib-client/asset/color/image.js',
            ClientMashVideoListeners: '@moviemasher/lib-client/asset/mash/video.js',
            ClientRawAudioListeners: '@moviemasher/lib-client/asset/raw/audio.js',
            ClientRawImageListeners: '@moviemasher/lib-client/asset/raw/image.js',
            ClientRawVideoListeners: '@moviemasher/lib-client/asset/raw/video.js',
            ClientShapeImageListeners: '@moviemasher/lib-client/asset/shape/image.js',
            ClientTextImageListeners: '@moviemasher/lib-client/asset/text/image.js',
            ClientAssetManagerListeners: '@moviemasher/lib-client/asset/manager.js',
        },
    },
    get importPromise() {
        const { options, eventDispatcher } = MovieMasher;
        const { imports } = options;
        return importPromise(imports, eventDispatcher);
    },
};

class NumberEvent extends CustomEvent {
}
class StringEvent extends CustomEvent {
}
/**
 * Dispatch to initiate a decode request for an asset.
 */
class EventClientDecode extends CustomEvent {
    static Type = DECODE;
    constructor(asset, decodingType, options, progress) {
        super(EventClientDecode.Type, { detail: { asset, options, decodingType, progress } });
    }
}
/**
 * Dispatch to initiate an encode request for a mash.
 */
class EventClientEncode extends CustomEvent {
    static Type = ENCODE;
    constructor(mashAssetObject, encodingType, encodeOptions, progress) {
        super(EventClientEncode.Type, { detail: { mashAssetObject, encodingType, encodeOptions, progress } });
    }
}
/**
 * Dispatch to initiate a transcoding request for an asset.
 */
class EventClientTranscode extends CustomEvent {
    static Type = TRANSCODE;
    constructor(asset, transcodingType, options, progress) {
        super(EventClientTranscode.Type, { detail: { asset, transcodingType, options, progress } });
    }
}
/**
 * Dispatch to initiate a save request for an asset.
 */
class EventSave extends CustomEvent {
    static Type = 'save';
    constructor(asset, progress) {
        super(EventSave.Type, { detail: { asset, progress } });
    }
}
/**
 * Dispatch to initiate an upload request, optionally replacing an existing asset.
 */
class EventUpload extends CustomEvent {
    static Type = 'upload';
    constructor(request, progress, id) {
        super(EventUpload.Type, { detail: { request, progress, id } });
    }
}
/**
 * Dispatch to retrieve the time range of the mash's selected clip.
 */
class EventTimeRange extends CustomEvent {
    static Type = 'time-range';
    constructor(..._) { super(EventTimeRange.Type, { detail: {} }); }
}
/**
 * Dispatch to retrieve the total number of frames in the mash.
 */
class EventFrames extends CustomEvent {
    static Type = 'frames';
    constructor() {
        super(EventFrames.Type, { detail: { frames: 0 } });
    }
}
/**
 * Dispatched when the total number of frames in the mash changes.
 */
class EventChangedFrames extends NumberEvent {
    static Type = 'changed-frames';
    constructor(frames) { super(EventChangedFrames.Type, { detail: frames }); }
}
/**
 * Dispatch to retrieve the mash's current frame.
 */
class EventFrame extends CustomEvent {
    static Type = 'frame';
    constructor(..._) { super(EventFrame.Type, { detail: {} }); }
}
/**
 * Dispatch to change the mash's current frame.
 */
class EventChangeFrame extends NumberEvent {
    static Type = 'change-frame';
    constructor(detail) { super(EventChangeFrame.Type, { detail }); }
}
/**
 * Dispatched when the mash's current frame has changed.
 * Note that EventChangedFrame.Type value matches HTMLMediaElement.
 */
class EventChangedFrame extends NumberEvent {
    // to match HTMLMediaElement
    static Type = 'timeupdate';
    constructor(detail) { super(EventChangedFrame.Type, { detail }); }
}
/**
 * Dispatch to retrieve data type from a property id.
 */
class EventDataType extends CustomEvent {
    static Type = 'data-type';
    constructor(propertyId) {
        super(EventDataType.Type, { detail: { propertyId } });
    }
}
/**
 * Dispatch to retrieve a property value from a managed asset.
 */
class EventManagedAssetScalar extends CustomEvent {
    static Type = 'managed-asset-scalar';
    constructor(assetId, propertyName) {
        super(EventManagedAssetScalar.Type, { detail: { assetId, propertyName } });
    }
}
/**
 * Dispatch to retrieve a promise that returns a managed asset's icon.
 */
class EventManagedAssetIcon extends CustomEvent {
    static Type = 'managed-asset-icon';
    constructor(assetId, size, cover) {
        super(EventManagedAssetIcon.Type, { detail: { assetId, size, cover } });
    }
}
/**
 * Dispatch when a managed asset's id has been changed.
 */
class EventManagedAssetId extends CustomEvent {
    static Type = 'managed-asset-id';
    constructor(previousId, currentId) {
        super(EventManagedAssetId.Type, { detail: { previousId, currentId } });
    }
}
/**
 * Dispatch to release managed assets.
 */
class EventReleaseManagedAssets extends CustomEvent {
    static Type = 'release-managed-assets';
    constructor(detail) {
        super(EventReleaseManagedAssets.Type, { detail });
    }
}
/**
 * Dispatch to add clips to mash for assets.
 */
class EventAddAssets extends CustomEvent {
    static Type = 'add-assets';
    constructor(assets, mashIndex) {
        super(EventAddAssets.Type, { detail: { assets, mashIndex } });
    }
}
/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 */
class EventManagedAsset extends CustomEvent {
    static Type = 'managed-asset';
    constructor(assetIdOrObject, manageType) {
        const string = typeof assetIdOrObject === 'string';
        const assetId = string ? assetIdOrObject : assetIdOrObject.id;
        const assetObject = string ? undefined : assetIdOrObject;
        const detail = { assetId, assetObject, manageType };
        super(EventManagedAsset.Type, { detail });
    }
    static Detail(assetIdOrObject, manageType) {
        const event = new EventManagedAsset(assetIdOrObject, manageType);
        MovieMasher.eventDispatcher.dispatch(event);
        return event.detail;
    }
    static asset(assetIdOrObject, manageType) {
        const detail = EventManagedAsset.Detail(assetIdOrObject, manageType);
        const { asset } = detail;
        assertAsset(asset);
        return asset;
    }
}
/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
class EventAsset extends CustomEvent {
    static Type = ASSET;
    constructor(assetIdOrObject) {
        const string = typeof assetIdOrObject === 'string';
        const assetId = string ? assetIdOrObject : assetIdOrObject.id;
        const assetObject = string ? undefined : assetIdOrObject;
        const detail = { assetId, assetObject };
        super(EventAsset.Type, { detail });
    }
}
/**
 * Dispatch to initiate a client action.
 */
class EventDoClientAction extends CustomEvent {
    static Type = 'do-client-action';
    constructor(clientAction) {
        super(EventDoClientAction.Type, { detail: clientAction });
    }
}
/**
 * Dispatched when the enabled state of a particular client action has changed.
 */
class EventChangedClientAction extends CustomEvent {
    static Type = 'changed-client-action';
    constructor(detail) { super(EventChangedClientAction.Type, { detail }); }
}
/**
 * Dispatch to retrieve current enabled state of a client action.
 */
class EventEnabledClientAction extends CustomEvent {
    static Type = 'enabled-client-action';
    constructor(clientAction) {
        super(EventEnabledClientAction.Type, { detail: { clientAction } });
    }
}
/**
 * Dispatched as progress is made on a server action with provided id.
 */
class EventProgress extends CustomEvent {
    static Type = 'progress';
    constructor(id, progress) {
        super(EventProgress.Type, { detail: { id, progress } });
    }
}
/**
 * Dispatch to initiate a server action, optionally dispatching progress events.
 */
class EventDoServerAction extends CustomEvent {
    static Type = 'do-server-action';
    constructor(serverAction, id) {
        super(EventDoServerAction.Type, { detail: { serverAction, id } });
    }
}
/**
 * Dispatched when the enabled state of a particular server action has changed.
 */
class EventChangedServerAction extends CustomEvent {
    static Type = 'changed-server-action';
    constructor(detail) { super(EventChangedServerAction.Type, { detail }); }
}
/**
 * Dispatch to retrieve current enabled state of a server action.
 */
class EventEnabledServerAction extends CustomEvent {
    static Type = 'enabled-server-action';
    constructor(serverAction) {
        super(EventEnabledServerAction.Type, { detail: { serverAction } });
    }
}
/**
 * Dispatched when there's a new mash loaded.
 */
class EventChangedMashAsset extends CustomEvent {
    static Type = 'changed-mash-asset';
    constructor(detail) { super(EventChangedMashAsset.Type, { detail }); }
}
/**
 * Dispatch to retrieve the mash being edited.
 */
class EventMashAsset extends CustomEvent {
    static Type = 'mash-asset';
    constructor(..._) {
        super(EventMashAsset.Type, { detail: {} });
    }
}
/**
 * Dispatch to change the dragging state.
 */
class EventChangeDragging extends CustomEvent {
    static Type = 'change-dragging';
    constructor(detail) { super(EventChangeDragging.Type, { detail }); }
}
/**
 * Dispatch to retrieve current dragging state.
 */
class EventDragging extends CustomEvent {
    static Type = 'dragging';
    constructor() { super(EventDragging.Type, { detail: {} }); }
}
/**
 * Dispatch to retrieve a clip element for display.
 */
class EventClipElement extends CustomEvent {
    static Type = 'clip-element';
    constructor(clipId, maxWidth, scale, trackIndex, trackWidth, width, x, label, labels, icons) {
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
            } });
    }
}
/**
 * Dispatch to retrieve an asset element for display.
 */
class EventAssetElement extends CustomEvent {
    static Type = 'asset-element';
    constructor(assetId, size, cover, label, icons, labels) {
        super(EventAssetElement.Type, { detail: { assetId, size, cover, label, labels, icons } });
    }
}
/**
 * Dispatch to change the mash's selected asset id.
 */
class EventChangeAssetId extends CustomEvent {
    static Type = 'change-asset-id';
    constructor(detail) {
        super(EventChangeAssetId.Type, { detail });
    }
}
/**
 * Dispatched when the mash's selected asset id has changed.
 */
class EventChangedAssetId extends CustomEvent {
    static Type = 'changed-asset-id';
    constructor(detail) {
        super(EventChangedAssetId.Type, { detail });
    }
}
/**
 * Dispatch to retrieve the mash's selected asset id.
 */
class EventAssetId extends CustomEvent {
    static Type = 'asset-id';
    constructor(..._) {
        super(EventAssetId.Type, { detail: {} });
    }
}
/**
 * Dispatch when the preview rectangle has changed.
 */
class EventRect extends CustomEvent {
    static Type = 'change-rect';
    constructor() { super(EventRect.Type, { detail: {} }); }
}
/**
 * Dispatced when the mash's targets have changed.
 */
class EventChangedTargetIds extends CustomEvent {
    static Type = 'changed-target-ids';
    constructor(detail) { super(EventChangedTargetIds.Type, { detail }); }
}
/**
 * Dispatch to retrieve the mash's current targets.
 */
class EventTargetIds extends CustomEvent {
    static Type = 'target-ids';
    constructor(detail = []) { super(EventTargetIds.Type, { detail }); }
}
/**
 * Dispatched when the mash's size has changed.
 */
class EventChangedSize extends CustomEvent {
    static Type = 'changed-size';
    constructor(detail) { super(EventChangedSize.Type, { detail }); }
}
/**
 * Dispatch to retrieve the mash's current size.
 */
class EventSize extends CustomEvent {
    static Type = 'size';
    constructor(..._) { super(EventSize.Type, { detail: {} }); }
}
/**
 * Dispatched when the mash has new Previews to display.
 */
class EventChangedPreviews extends Event {
    static Type = 'changed-previews';
    constructor(_) { super(EventChangedPreviews.Type); }
}
/**
 * Dispatch to retreve the property ids of the mash's current targets.
 */
class EventPropertyIds extends CustomEvent {
    static Type = 'property-ids';
    constructor(targetIds = [], propertyIds = []) {
        super(EventPropertyIds.Type, { detail: { targetIds, propertyIds } });
    }
}
/**
 * Dispatch to retrieve the id of the mash's currently selected clip.
 */
class EventClipId extends CustomEvent {
    static Type = 'clip-id';
    constructor(..._) { super(EventClipId.Type, { detail: {} }); }
}
/**
 * Dispatch to set the currently selected clip.
 */
class EventChangeClipId extends StringEvent {
    static Type = 'change-clip-id';
    constructor(detail = '') { super(EventChangeClipId.Type, { detail }); }
}
/**
 * Dispatched when the mash's currently selected clip changes.
 * */
class EventChangedClipId extends StringEvent {
    static Type = 'changed-clip-id';
    constructor(detail = '') { super(EventChangedClipId.Type, { detail }); }
}
/**
 * Dispatched when a mash action has been done or undone.
 */
class EventChanged extends CustomEvent {
    static Type = 'changed';
    constructor(action) { super(EventChanged.Type, { detail: action }); }
}
/**
 * Dispatch to retrieve selected properties.
 */
class EventSelectedProperties extends CustomEvent {
    static Type = 'selected-properties';
    constructor(selectorTypes = [], selectedProperties = []) {
        super(EventSelectedProperties.Type, { detail: { selectorTypes, selectedProperties } });
    }
}
/**
 * Dispatch to retrieve the mash's current Previews.
 */
class EventPreviews extends CustomEvent {
    static Type = 'previews';
    constructor(maxDimension, disabled = false) {
        super(EventPreviews.Type, { detail: { disabled, maxDimension } });
    }
}
/**
 * Dispatch to retrieve the scalar that corresponds to a property id.
 */
class EventScalar extends CustomEvent {
    static Type = 'scalar';
    constructor(propertyId) {
        super(EventScalar.Type, { detail: { propertyId } });
    }
}
/**
 * Dispatch to change the scalar that corresponds to a property id.
 */
class EventChangeScalar extends CustomEvent {
    static Type = 'change-scalar';
    constructor(propertyId, value) {
        super(EventChangeScalar.Type, { detail: { propertyId, value } });
    }
}
/**
 * Dispatch to change multiple scalars that correspond to property ids.
 */
class EventChangeScalars extends CustomEvent {
    static Type = 'change-scalars';
    constructor(detail) {
        super(EventChangeScalars.Type, { detail });
    }
}
/**
 * Dispatched when scalars that correspond to property ids have changed.
 */
class EventChangedScalars extends CustomEvent {
    static Type = 'changed-scalars';
    constructor(detail) {
        super(EventChangedScalars.Type, { detail });
    }
}
/**
 * Dispatch to retrieve a control group.
 */
class EventControlGroup extends CustomEvent {
    static Type = 'control-group';
    constructor(propertyIds, groupedPropertyIds = []) {
        const detail = {
            propertyIds, groupedPropertyIds
        };
        super(EventControlGroup.Type, { detail });
    }
}
/**
 * Dispatch to retrieve a control.
 */
class EventControl extends CustomEvent {
    static Type = 'control';
    constructor(type, propertyId) {
        super(EventControl.Type, { detail: { type, propertyId } });
    }
}
/**
 * Dispatch to retrieve the inspector's filtered selectors.
 */
class EventInspectorSelectors extends CustomEvent {
    static Type = 'inspector-selectors';
    constructor(selectorTypes, filter) {
        const detail = { filter, selectorTypes };
        super(EventInspectorSelectors.Type, { detail });
    }
}
/**
 * Dispatch to set the inspector's filtered selectors.
 */
class EventChangedInspectorSelectors extends CustomEvent {
    static Type = 'changed-inspector-selectors';
    constructor(selectorTypes, filter) {
        const detail = { filter, selectorTypes };
        super(EventChangedInspectorSelectors.Type, { detail });
    }
}
/**
 * Dispatch to close current dialog (no detail), or open with a supported section.
 */
class EventDialog extends StringEvent {
    static Type = 'dialog';
    constructor(detail = '') { super(EventDialog.Type, { detail }); }
}
/**
 * Dispatch to retrieve client audio promise for request.
 */
class EventClientAudioPromise extends CustomEvent {
    static Type = 'client-audio-promise';
    constructor(request) {
        super(EventClientAudioPromise.Type, { detail: { request } });
    }
}
/**
 * Dispatch to retrieve client font promise for request.
*/
class EventClientFontPromise extends CustomEvent {
    static Type = 'client-font-promise';
    constructor(request) {
        super(EventClientFontPromise.Type, { detail: { request } });
    }
}
/**
 * Dispatch to retrieve client image promise for request.
*/
class EventClientImagePromise extends CustomEvent {
    static Type = 'client-image-promise';
    constructor(request) {
        super(EventClientImagePromise.Type, { detail: { request } });
    }
}
/**
 * Dispatch to retrieve client video promise for request.
 */
class EventClientVideoPromise extends CustomEvent {
    static Type = 'client-video-promise';
    constructor(request) {
        super(EventClientVideoPromise.Type, { detail: { request } });
    }
}
/**
 * Dispatch to import file(s) and get promise for corresponding asset objects.
 */
class EventImport extends CustomEvent {
    static Type = 'import';
    constructor(fileList) {
        super(EventImport.Type, { detail: { fileList } });
    }
}
/**
 * Dispatch to retrieve icon promise for an icon ID.
 */
class EventIcon extends CustomEvent {
    static Type = 'icon';
    constructor(id) {
        super(EventIcon.Type, { detail: { id } });
    }
}
/**
 * Dispatch to retrieve the mash asset object to edit.
 */
class EventAssetObject extends CustomEvent {
    static Type = 'asset-object';
    constructor(assetType) {
        super(EventAssetObject.Type, { detail: { assetType } });
    }
}
/**
 * Dispatch to retrieve asset objects to display.
 */
class EventAssetObjects extends CustomEvent {
    static Type = 'asset-objects';
    constructor(detail) {
        super(EventAssetObjects.Type, { detail });
    }
}
/**
 * Dispatch to retrieve the assets to display.
 */
class EventManagedAssets extends CustomEvent {
    static Type = 'managed-assets';
    constructor(detail) {
        super(EventManagedAssets.Type, { detail });
    }
}
/**
 * Dispatch to retrieve an array of importers.
 */
class EventImporters extends CustomEvent {
    static Type = 'importers';
    constructor(importers = []) {
        super(EventImporters.Type, { detail: { importers } });
    }
}
/**
 * Dispatch to import managed assets from client asset objects.
 */
class EventImportManagedAssets extends CustomEvent {
    static Type = 'import-asset-objects';
    constructor(detail) {
        super(EventImportManagedAssets.Type, { detail });
    }
}
/**
 * Dispatch to retrieve the savable state of managed assets.
 */
class EventSavableManagedAsset extends CustomEvent {
    static Type = 'savable-managed-asset';
    constructor() {
        super(EventSavableManagedAsset.Type, { detail: { savable: false } });
    }
}
/**
 * Dispatch to retrieve the clips for a track.
 */
class EventTrackClips extends CustomEvent {
    static Type = 'track-clips';
    constructor(trackIndex) {
        super(EventTrackClips.Type, { detail: { trackIndex } });
    }
}
/**
 * Dispatch to retrieve the savable managed assets.
 */
class EventSavableManagedAssets extends CustomEvent {
    static Type = 'savable-managed-assets';
    constructor(assets = []) {
        super(EventSavableManagedAssets.Type, { detail: { assets } });
    }
}
/**
 * Dispatched when managed assets have been imported.
 */
class EventImportedManagedAssets extends CustomEvent {
    static Type = 'imported-asset-objects';
    constructor(detail) {
        super(EventImportedManagedAssets.Type, { detail });
    }
}
/**
 * Dispatch to retrieve a track icon for a clip.
 */
class EventTrackClipIcon extends CustomEvent {
    static Type = 'track-clip-icon';
    constructor(clipId, clipSize, scale, gap) {
        super(EventTrackClipIcon.Type, { detail: { clipId, clipSize, scale, gap } });
    }
}
/**
 * Dispatched when an importer has finished importing.
 */
class EventImporterComplete extends Event {
    static Type = 'importer-complete';
    constructor() { super(EventImporterComplete.Type); }
}
/**
 * Dispatched when an importer's asset objects have changed.
 */
class EventImporterChange extends CustomEvent {
    static Type = 'importer-change';
    constructor(detail) {
        super(EventImporterChange.Type, { detail });
    }
}
/**
 * Dispatch to move the selected clip within the mash.
 */
class EventMoveClip extends CustomEvent {
    static Type = 'move-clip';
    constructor(clipLocation, clipId) {
        super(EventMoveClip.Type, { detail: { clipLocation, clipId } });
    }
}
/**
 * Dispatch to remove a specific clip from the mash.
 * Alternatively, use EventDoClientAction to remove the selected clip.
 */
class EventRemoveClip extends CustomEvent {
    static Type = 'remove-clip';
    constructor(clipId) {
        super(EventRemoveClip.Type, { detail: { clipId } });
    }
}
const EventTypeMashRemoveTrack = 'mash-remove-track';
// used in components, dispatched via DOM
const EventTypeExportParts = 'export-parts';
const EventTypeScrollRoot = 'scroll-root';
const EventTypeDragHandled = 'drag-handled';
// used just between components 
const EventTypeZoom = 'zoom';
const EventTypeAssetType = 'asset-type';
// TODO: dispatched by mash and used
const EventTypeTracks = 'tracks';
// TODO: dispatched by mash and unused
const EventTypePause = 'pause';
const EventTypePlay = 'play';
const EventTypePlaying = 'playing';
const EventTypeSeeking = 'seeking';
const EventTypeSeeked = 'seeked';
const EventTypeEnded = 'ended';
// TODO: unused!
const EventTypeWaiting = 'waiting';
const EventTypeTrack = 'track';
const EventTypeRender = 'render';
const EventTypeLoaded = 'loadeddata';
// TODO: dispatched by masher but not used
const EventTypeFps = 'ratechange';
const EventTypeVolume = 'volumechange';
const EventTypeAdded = 'added';

const isClientAsset = (value) => {
    return isAsset(value) && 'assetIcon' in value;
};

const DragSuffix = '/x-moviemasher';
const LastIndex = -1;
const CurrentIndex = -2;
const NextIndex = -3;

const eventStop = event => {
    event.preventDefault();
    event.stopPropagation();
};

export { ClassAnimate, ClassBack, ClassBounds, ClassButton, ClassDisabled, ClassDropping, ClassFore, ClassHandle, ClassLine, ClassOutline, ClassOutlines, ClassRow, ClassSelected, ClassTrack, ClientActionAdd, ClientActionAddTrack, ClientActionFlip, ClientActionRedo, ClientActionRemove, ClientActionTogglePaused, ClientActionUndo, ClientEventDispatcher, CurrentIndex, DragSuffix, EventAddAssets, EventAsset, EventAssetElement, EventAssetId, EventAssetObject, EventAssetObjects, EventChangeAssetId, EventChangeClipId, EventChangeDragging, EventChangeFrame, EventChangeScalar, EventChangeScalars, EventChanged, EventChangedAssetId, EventChangedClientAction, EventChangedClipId, EventChangedFrame, EventChangedFrames, EventChangedInspectorSelectors, EventChangedMashAsset, EventChangedPreviews, EventChangedScalars, EventChangedServerAction, EventChangedSize, EventChangedTargetIds, EventClientAudioPromise, EventClientDecode, EventClientEncode, EventClientFontPromise, EventClientImagePromise, EventClientTranscode, EventClientVideoPromise, EventClipElement, EventClipId, EventControl, EventControlGroup, EventDataType, EventDialog, EventDoClientAction, EventDoServerAction, EventDragging, EventEnabledClientAction, EventEnabledServerAction, EventFrame, EventFrames, EventIcon, EventImport, EventImportManagedAssets, EventImportedManagedAssets, EventImporterChange, EventImporterComplete, EventImporters, EventInspectorSelectors, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssetScalar, EventManagedAssets, EventMashAsset, EventMoveClip, EventPreviews, EventProgress, EventPropertyIds, EventRect, EventReleaseManagedAssets, EventRemoveClip, EventSavableManagedAsset, EventSavableManagedAssets, EventSave, EventScalar, EventSelectedProperties, EventSize, EventTargetIds, EventTimeRange, EventTrackClipIcon, EventTrackClips, EventTypeAdded, EventTypeAssetType, EventTypeDragHandled, EventTypeEnded, EventTypeExportParts, EventTypeFps, EventTypeLoaded, EventTypeMashRemoveTrack, EventTypePause, EventTypePlay, EventTypePlaying, EventTypeRender, EventTypeScrollRoot, EventTypeSeeked, EventTypeSeeking, EventTypeTrack, EventTypeTracks, EventTypeVolume, EventTypeWaiting, EventTypeZoom, EventUpload, LastIndex, MovieMasher, NextIndex, NumberEvent, ServerActionDecode, ServerActionEncode, ServerActionSave, ServerActionTranscode, StringEvent, eventStop, isClientAsset };
