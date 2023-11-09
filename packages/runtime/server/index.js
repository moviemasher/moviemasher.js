import { importPromise, assertAsset, TARGET_ASSET, JOB_DECODE, JOB_ENCODE, JOB_TRANSCODE, isAsset } from '@moviemasher/runtime-shared';

const SVG = 'svg';
const SVG_SEQUENCE = 'svgsequence';
const TXT = 'txt';

/**
 * Uses the global object as the event dispatcher.
 */
class ServerEventDispatcher {
    addDispatchListener(type, listener, options) {
        addEventListener(type, listener, options);
    }
    dispatch(typeOrEvent) {
        const isString = typeof typeOrEvent === 'string';
        isString ? typeOrEvent : typeOrEvent.type;
        const event = isString ? new CustomEvent(typeOrEvent) : typeOrEvent;
        return dispatchEvent(event);
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
        removeEventListener(type, listener, options);
    }
}

const MovieMasher = {
    eventDispatcher: new ServerEventDispatcher(),
    options: {
        imports: {
            ServerColorImageListeners: '@moviemasher/lib-server/asset/color/image.js',
            ServerMashVideoListeners: '@moviemasher/lib-server/asset/mash/video.js',
            ServerRawAudioListeners: '@moviemasher/lib-server/asset/raw/audio.js',
            ServerRawImageListeners: '@moviemasher/lib-server/asset/raw/image.js',
            ServerRawVideoListeners: '@moviemasher/lib-server/asset/raw/video.js',
            ServerShapeImageListeners: '@moviemasher/lib-server/asset/shape/image.js',
            ServerTextImageListeners: '@moviemasher/lib-server/asset/text/image.js',
            ServerAssetManagerListeners: '@moviemasher/lib-server/asset/manager.js',
            ServerAssetPromiseListeners: '@moviemasher/lib-server/asset/promise.js',
            ServerEncodeAudioListeners: '@moviemasher/lib-server/encode/encode.js',
            ServerEncodeImageListeners: '@moviemasher/lib-server/encode/encode.js',
            ServerEncodeVideoListeners: '@moviemasher/lib-server/encode/encode.js',
            ServerEncodeStatusListeners: '@moviemasher/lib-server/encode/encode.js',
            ServerDecodeProbeListeners: '@moviemasher/lib-server/decode/probe.js',
            ServerDecodeStatusListeners: '@moviemasher/lib-server/decode/probe.js',
            ServerTranscodeListeners: '@moviemasher/lib-server/transcode/transcode.js',
            ServerTranscodeStatusListeners: '@moviemasher/lib-server/transcode/transcode.js',
        },
    },
    get importPromise() {
        const { options, eventDispatcher } = MovieMasher;
        const { imports } = options;
        return importPromise(imports, eventDispatcher);
    },
};

let CustomEvent$1 = class CustomEvent extends Event {
    constructor(message, data) {
        super(message, data);
        this.detail = data.detail;
    }
    detail;
};
/**
 * Dispatch to retrieve server asset promise for request.
 */
class EventServerAssetPromise extends CustomEvent$1 {
    static Type = 'server-asset-promise';
    constructor(request, loadType, validDirectories) {
        super(EventServerAssetPromise.Type, { detail: { request, loadType, validDirectories } });
    }
}
/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 */
class EventServerManagedAsset extends CustomEvent$1 {
    static Type = 'managed-asset';
    constructor(assetIdOrObject) {
        const string = typeof assetIdOrObject === 'string';
        const assetId = string ? assetIdOrObject : assetIdOrObject.id;
        const assetObject = string ? undefined : assetIdOrObject;
        const detail = { assetId, assetObject };
        super(EventServerManagedAsset.Type, { detail });
    }
    static Detail(assetIdOrObject) {
        const event = new EventServerManagedAsset(assetIdOrObject);
        MovieMasher.eventDispatcher.dispatch(event);
        return event.detail;
    }
    static asset(assetIdOrObject) {
        const detail = EventServerManagedAsset.Detail(assetIdOrObject);
        const { asset } = detail;
        assertAsset(asset, JSON.stringify(assetIdOrObject));
        return asset;
    }
}
/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
class EventServerAsset extends CustomEvent$1 {
    static Type = TARGET_ASSET;
    constructor(assetIdOrObject) {
        const string = typeof assetIdOrObject === 'string';
        const assetId = string ? assetIdOrObject : assetIdOrObject.id;
        const assetObject = string ? undefined : assetIdOrObject;
        const detail = { assetId, assetObject };
        super(EventServerAsset.Type, { detail });
    }
}
/**
 * Dispatch to release managed assets.
 */
class EventReleaseServerManagedAssets extends CustomEvent$1 {
    static Type = 'release-assets';
    constructor(detail) {
        super(EventReleaseServerManagedAssets.Type, { detail });
    }
}
/**
 * Dispatch to retrieve a promise that decodes an asset.
 */
class EventServerDecode extends CustomEvent$1 {
    static Type = JOB_DECODE;
    constructor(decodingType, assetType, request, user, id, decodeOptions) {
        super(EventServerDecode.Type, { detail: { assetType, request, user, decodingType, id, decodeOptions } });
    }
}
/**
 * Dispatch to retrieve a promise that returns progress or decoding if finished.
 */
class EventServerDecodeStatus extends CustomEvent$1 {
    static Type = 'decode-status';
    constructor(id) {
        super(EventServerDecodeStatus.Type, { detail: { id } });
    }
}
/**
 * Dispatch to retrieve a promise that encodes a mash asset.
 */
class EventServerEncode extends CustomEvent$1 {
    static Type = JOB_ENCODE;
    constructor(encodingType, mashAssetObject, user, id, encodeOptions, relativeRoot) {
        super(EventServerEncode.Type, { detail: { encodingType, mashAssetObject, encodeOptions, user, id, relativeRoot } });
    }
}
/**
 * Dispatch to retrieve a promise that returns encoding if finished.
 */
class EventServerEncodeStatus extends CustomEvent$1 {
    static Type = 'encode-status';
    constructor(id) {
        super(EventServerEncodeStatus.Type, { detail: { id } });
    }
}
/**
 * Dispatched when progress is made on an encoding.
 */
class EventServerEncodeProgress extends CustomEvent$1 {
    static Type = 'encode-progress';
    constructor(id, progress) {
        super(EventServerEncodeProgress.Type, { detail: { id, progress } });
    }
}
/**
 * Dispatch to retrieve a promise that transcodes an asset.
 */
class EventServerTranscode extends CustomEvent$1 {
    static Type = JOB_TRANSCODE;
    constructor(transcodingType, assetType, request, user, id, transcodeOptions, relativeRoot) {
        super(EventServerTranscode.Type, { detail: { assetType, transcodeOptions, request, transcodingType, user, id, relativeRoot } });
    }
}
/**
 * Dispatch to retrieve a promise that returns progress or transcoding if finished.
 */
class EventServerTranscodeStatus extends CustomEvent$1 {
    static Type = 'transcode-status';
    constructor(id) {
        super(EventServerTranscodeStatus.Type, { detail: { id } });
    }
}
/**
 * Dispatch to retrieve a rect for some text in a font.
 */
class EventServerTextRect extends CustomEvent$1 {
    static Type = 'text-rect';
    constructor(text, font, height) {
        super(EventServerTextRect.Type, { detail: { text, font, height } });
    }
}

const isServerAsset = (value) => {
    return isAsset(value) && 'assetGraphFiles' in value;
};

export { CustomEvent$1 as CustomEvent, EventReleaseServerManagedAssets, EventServerAsset, EventServerAssetPromise, EventServerDecode, EventServerDecodeStatus, EventServerEncode, EventServerEncodeProgress, EventServerEncodeStatus, EventServerManagedAsset, EventServerTextRect, EventServerTranscode, EventServerTranscodeStatus, MovieMasher, SVG, SVG_SEQUENCE, ServerEventDispatcher, TXT, isServerAsset };
