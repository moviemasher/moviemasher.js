import { MovieMasherImportPromise, TypeAsset, TypeEncode, TypeDecode, TypeTranscode, isAsset } from '@moviemasher/runtime-shared';

const GraphFileTypeSvg = 'svg';
const GraphFileTypeSvgSequence = 'svgsequence';
const GraphFileTypeTxt = 'txt';

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
            ServerDecodeProbeListeners: '@moviemasher/lib-server/decode/probe.js',
            ServerEncodeAudioListeners: '@moviemasher/lib-server/encode/start.js',
            ServerEncodeImageListeners: '@moviemasher/lib-server/encode/start.js',
            ServerEncodeVideoListeners: '@moviemasher/lib-server/encode/start.js',
            // ServerEncodeProgressListeners: '@moviemasher/lib-server/progress.js',
            // ServerEncodeFinishListeners: '@moviemasher/lib-server/encode/finish.js',
            ServerAssetPromiseListeners: '@moviemasher/lib-server/asset/promise.js',
            ServerTranscodeListeners: '@moviemasher/lib-server/transcode/transcode.js',
        },
    },
    get importPromise() {
        const { options, eventDispatcher } = MovieMasher;
        const { imports } = options;
        return MovieMasherImportPromise(imports, eventDispatcher);
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
 * Dispatch to retrieve a managed asset from an asset id or object.
 */
class EventServerManagedAsset extends CustomEvent$1 {
    static Type = 'managedasset';
    constructor(assetIdOrObject) {
        const string = typeof assetIdOrObject === 'string';
        const assetId = string ? assetIdOrObject : assetIdOrObject.id;
        const assetObject = string ? undefined : assetIdOrObject;
        const detail = { assetId, assetObject };
        super(EventServerManagedAsset.Type, { detail });
    }
}
/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
class EventServerAsset extends CustomEvent$1 {
    static Type = TypeAsset;
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
 * Dispatch to retrieve a promise that encodes a mash asset.
 */
class EventServerEncode extends CustomEvent$1 {
    static Type = TypeEncode;
    constructor(encodingType, inputPath, outputPath, encodeOptions, encodingId) {
        super(EventServerEncode.Type, { detail: { outputPath, encodingType, inputPath, encodeOptions, encodingId } });
    }
}
/**
 * Dispatch to retrieve a promise that returns progress or encoding if finished.
 */
class EventServerEncodeFinish extends CustomEvent$1 {
    static Type = 'encode-finish';
    constructor(id) {
        super(EventServerEncodeFinish.Type, { detail: { id } });
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
 * Dispatch to retrieve a promise that decodes an asset.
 */
class EventServerDecode extends CustomEvent$1 {
    static Type = TypeDecode;
    constructor(decodingType, inputPath, outputPath, decodeOptions, decodingId) {
        super(EventServerDecode.Type, { detail: { inputPath, outputPath, decodingType, decodeOptions, decodingId } });
    }
}
/**
 * Dispatch to retrieve a promise that returns progress or decoding if finished.
 */
class EventServerDecodeFinish extends CustomEvent$1 {
    static Type = 'decode-finish';
    constructor(id) {
        super(EventServerDecodeFinish.Type, { detail: { id } });
    }
}
/**
 * Dispatch to retrieve a promise that transcodes an asset.
 */
class EventServerTranscode extends CustomEvent$1 {
    static Type = TypeTranscode;
    constructor(transcodingType, inputPath, outputPath, transcodeOptions, transcodingId) {
        super(EventServerTranscode.Type, { detail: { inputPath, transcodeOptions, outputPath, transcodingType, transcodingId } });
    }
}
/**
 * Dispatch to retrieve a promise that returns progress or transcoding if finished.
 */
class EventServerTranscodeFinish extends CustomEvent$1 {
    static Type = 'transcode-finish';
    constructor(id) {
        super(EventServerTranscodeFinish.Type, { detail: { id } });
    }
}
/**
 * Dispatch to retrieve server asset promise for request.
 */
class EventServerAssetPromise extends CustomEvent$1 {
    static Type = 'server-asset-promise';
    constructor(request, loadType) {
        super(EventServerAssetPromise.Type, { detail: { request, loadType } });
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
    return isAsset(value) && 'graphFiles' in value;
};

export { CustomEvent$1 as CustomEvent, EventReleaseServerManagedAssets, EventServerAsset, EventServerAssetPromise, EventServerDecode, EventServerDecodeFinish, EventServerEncode, EventServerEncodeFinish, EventServerEncodeProgress, EventServerManagedAsset, EventServerTextRect, EventServerTranscode, EventServerTranscodeFinish, GraphFileTypeSvg, GraphFileTypeSvgSequence, GraphFileTypeTxt, MovieMasher, ServerEventDispatcher, isServerAsset };
