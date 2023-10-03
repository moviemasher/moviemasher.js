const length = (value) => !!value.length;
const isBoolean = (value) => typeof value === 'boolean';
const isString = (value) => (typeof value === 'string');
const isPopulatedString = (value) => (isString(value) && length(String(value)));
const isUndefined = (value) => typeof value === 'undefined';
const isDefined = (value) => !isUndefined(value);
const isObject = (value) => typeof value === 'object';
const isNumber = (value) => (isNumberOrNaN(value) && !Number.isNaN(value));
const isNumberOrNaN = (value) => typeof value === 'number';
const isNan = (value) => isNumberOrNaN(value) && Number.isNaN(value);
const isNumeric = (value) => ((isNumber(value) || isPopulatedString(value)) && !isNan(Number(value)));
function isArray(value) {
    return Array.isArray(value);
}
const isFunction = (value) => typeof value === 'function';

function arrayFromOneOrMore(value) {
    if (!isObject(value))
        return [];
    return isArray(value) ? value : [value];
}

const AUDIO = 'audio';
const IMAGE = 'image';
const VIDEO = 'video';
const ASSET_TYPES = [AUDIO, IMAGE, VIDEO];
const AUDIBLE_TYPES = [AUDIO, VIDEO];
const VISIBLE_TYPES = [IMAGE, VIDEO];

const isAssetType = (value) => (ASSET_TYPES.includes(value));
const isAudibleAssetType = (value) => (AUDIBLE_TYPES.includes(value));
const isVisibleAssetType = (value) => (VISIBLE_TYPES.includes(value));

const ERROR = {
    ClientDisabledDelete: 'client.disabled.delete',
    ClientDisabledGet: 'client.disabled.get',
    ClientDisabledList: 'client.disabled.list',
    ClientDisabledSave: 'client.disabled.save',
    DecodeProbe: 'decode.probe',
    Environment: 'error.environment',
    Evaluation: 'error.evaluation',
    FilterId: 'filter.id',
    Frame: 'error.frame',
    Ffmpeg: 'ffpmeg',
    ImportDuration: 'import.duration',
    ImportFile: 'import.file',
    ImportSize: 'import.size',
    ImportType: 'import.type',
    Internal: 'error.internal',
    AssetId: 'asset.id',
    OutputDimensions: 'output.dimensions',
    OutputDuration: 'output.duration',
    Range: 'error.range',
    Reference: 'error.reference',
    ServerAuthentication: 'server.authentication',
    ServerAuthorization: 'server.authorization',
    Syntax: 'error.syntax',
    Type: 'error.type',
    Unimplemented: 'error.unimplemented',
    Unknown: 'error.unknown',
    Url: 'error.url',
};
const ERROR_NAMES = Object.values(ERROR);

const isErrorName = (value) => ((isString(value)) && ERROR_NAMES.includes(value));
const errorMessage = (name, context) => (isString(context) ? context : name);
const errorObject = (message, name = ERROR.Internal, cause) => {
    const error = new Error(message);
    Object.assign(error, { name, cause });
    return error;
};
const errorObjectCaught = (error) => {
    if (isErrorName(error))
        return errorName(error);
    if (isString(error))
        return errorObject(error);
    const { message: errorMessage = '', name = ERROR.Internal } = error;
    const message = errorMessage || String(name);
    return errorObject(message, name, error);
};
const errorName = (name, context) => {
    // console.log('errorName', name, context)
    return { name, message: errorMessage(name, context), cause: context };
};
const errorCaught = (error) => {
    // console.error('errorCaught', error)
    return { error: errorObjectCaught(error) };
};
const errorPromise = (name, context) => (Promise.resolve(error(name, context)));
const errorExpected = (value, expected, prop) => {
    const type = typeof value;
    const isDefined = type !== 'undefined';
    const isObject = type === 'object';
    const name = prop || (isDefined ? type : 'value');
    const words = [name, 'is'];
    words.push(isObject ? value.constructor.name : type);
    if (isDefined)
        words.push(isObject ? JSON.stringify(value) : `'${value}'`);
    words.push('instead of', expected);
    return errorObject(words.join(' '), ERROR.Type);
};
const errorThrow = (value, type, property) => {
    const object = type ? errorExpected(value, type, property) : errorObjectCaught(value);
    const { message, name, cause } = object;
    const error = errorObject(message, name, cause);
    // console.trace(error.toString())
    throw error;
};
const error = (code, context) => ({ error: errorName(code, context) });
const isDefiniteError = (value) => {
    return isObject(value) && 'error' in value; // && isObject(value.error)
};

function assertAssetType(type, name) {
    if (!isAssetType(type))
        errorThrow(type, 'AssetType', name);
}

const isIdentified = (value) => {
    return isObject(value) && 'id' in value && isPopulatedString(value.id);
};
function assertIdentified(value, name) {
    if (!isIdentified(value))
        errorThrow(value, 'Identified', name);
}

const isTyped = (value) => {
    return isObject(value) &&
        'type' in value &&
        isPopulatedString(value.type);
};
function assertTyped(value, name) {
    if (!isTyped(value))
        errorThrow(value, 'Typed', name);
}

const isAsset = (value) => (isIdentified(value)
    && isTyped(value)
    && isAssetType(value.type)
    && 'isVector' in value);
function assertAsset(value, name) {
    assertIdentified(value, name);
    assertTyped(value, name);
    assertAssetType(value.type, name);
    if (!isAsset(value))
        errorThrow(value, 'Asset', name);
}
const isSourceAsset = (value) => (isAsset(value) && isPopulatedString(value.source));
function isAssetObject(value, type = undefined, source = undefined) {
    return (value && isIdentified(value)
        && isTyped(value) && isAssetType(value.type)
        && (!type || type === value.type)
        && 'source' in value && isPopulatedString(value.source)
        && (!source || source === value.source));
}

const VERSION = '5.1.2';

const BOOLEAN = 'boolean';
const NUMBER = 'number';
const STRING = 'string';

const PROBE = 'probe';

const isDecodingType = isPopulatedString;
const isDecoding = (value) => (isObject(value) && 'type' in value && isDecodingType(value.type));
function assertDecoding(value) {
    if (!isDecoding(value))
        errorThrow(value, 'Decoding');
}

const isListenerRecord = (value) => (isObject(value) && Object.values(value).every(isFunction));

const FONT = 'font';
const IMPORT_TYPES = [FONT, ...ASSET_TYPES];

const isImportType = (value) => (IMPORT_TYPES.includes(value));
const isImporter = (value) => (isIdentified(value)
    && 'source' in value && isPopulatedString(value.source)
    && 'types' in value && isArray(value.types));

const DECODE = 'decode';
const ENCODE = 'encode';
const TRANSCODE = 'transcode';

const RECORD = 'record';
const RECORDS = 'records';

const importPromise = (imports, eventDispatcher) => {
    const functions = Object.keys(imports).sort((a, b) => b.length - a.length);
    const moduleIds = [...new Set(Object.values(imports))];
    const byId = Object.fromEntries(moduleIds.map(id => ([id, functions.filter(key => imports[key] === id)])));
    const promises = moduleIds.map(moduleId => {
        return import(moduleId).then(module => {
            const importers = byId[moduleId];
            const potentialErrors = importers.map(importer => {
                const { [importer]: funktion } = module;
                if (!isFunction(funktion))
                    return error(ERROR.Url, importer);
                const listeners = funktion();
                if (!isListenerRecord(listeners))
                    return error(ERROR.Type, importer);
                eventDispatcher.listenersAdd(listeners);
                return {};
            });
            const definiteErrors = potentialErrors.filter(isDefiniteError);
            if (definiteErrors.length)
                return definiteErrors[0];
            return {};
        }).catch(error => errorCaught(error));
    });
    return Promise.all(promises).then(results => {
        results.filter(isDefiniteError).forEach(error => {
            console.error('importPromise', error);
        });
    });
};

const SEQUENCE = 'sequence';
const WAVEFORM = 'waveform';

const OUTPUT_DEFAULTS = {
    [AUDIO]: {
        options: {},
        audioBitrate: 160,
        audioCodec: 'libmp3lame',
        audioChannels: 2,
        audioRate: 44100,
        extension: 'mp3',
    },
    [FONT]: {
        options: {},
        extension: 'woff2',
    },
    [SEQUENCE]: {
        options: {},
        format: 'image2',
        width: 320,
        height: 240,
        videoRate: 10,
        extension: 'jpg',
    },
    [WAVEFORM]: {
        options: {},
        width: 320,
        height: 240,
        forecolor: '#000000',
        backcolor: '#00000000',
        audioBitrate: 160,
        audioCodec: 'aac',
        audioChannels: 2,
        audioRate: 44100,
        extension: 'png',
    },
    [IMAGE]: {
        options: {},
        width: 320,
        height: 240,
        extension: 'jpg',
    },
    [VIDEO]: {
        options: {
            g: 60,
            level: 41,
            movflags: 'faststart'
        },
        width: 1920,
        height: 1080,
        videoRate: 30,
        videoBitrate: 2000,
        audioBitrate: 160,
        audioCodec: 'aac',
        videoCodec: 'libx264',
        audioChannels: 2,
        audioRate: 44100,
        g: 0,
        format: 'mp4',
    },
};
const ALPHA_OUTPUT_DETAULTS = {
    [IMAGE]: {
        options: {},
        width: 320,
        height: 240,
        extension: 'png',
        format: 'image2',
        offset: 0
    },
    [SEQUENCE]: {
        options: {},
        format: 'image2',
        width: 320,
        height: 240,
        videoRate: 10,
        extension: 'png',
    },
    [VIDEO]: {
        options: {
            g: 60,
            level: 41,
            movflags: 'faststart'
        },
        width: 1920,
        height: 1080,
        videoRate: 30,
        videoBitrate: 2000,
        audioBitrate: 160,
        audioCodec: 'aac',
        videoCodec: 'libx264',
        audioChannels: 2,
        audioRate: 44100,
        g: 0,
        format: 'mp4',
        extension: 'mp4',
    },
};

const POINT_ZERO = { x: 0, y: 0 };
const POINT_KEYS = ['x', 'y'];

const isProbing = (value) => {
    return isDecoding(value) && value.type === PROBE;
};
function assertProbing(value) {
    if (!isProbing(value))
        errorThrow(value, 'Probing');
}

// Note: these are all capitalized since they are suffixes
const END = 'End';
const CROP = 'Crop';
const ASPECT = 'Aspect';

const SIZE_ZERO = { width: 0, height: 0 };
const SIZE_OUTPUT = { width: 1920, height: 1080 };
const SIZE_KEYS = ['width', 'height'];

const RECT_ZERO = { ...POINT_ZERO, ...SIZE_ZERO };
const RECT_KEYS = [...POINT_KEYS, ...SIZE_KEYS];

const COLOR = 'color';
const MASH = 'mash';
const PROMPT = 'prompt';
const RAW = 'raw';
const SHAPE = 'shape';
const TEXT = 'text';

const ASSET = 'asset';
const CLIP = 'clip';
const CONTAINER = 'container';
const CONTENT = 'content';
const TARGET_IDS = [
    MASH, CLIP, CONTENT, CONTAINER, ASSET
];

export { ALPHA_OUTPUT_DETAULTS, ASPECT, ASSET, ASSET_TYPES, AUDIBLE_TYPES, AUDIO, BOOLEAN, CLIP, COLOR, CONTAINER, CONTENT, CROP, DECODE, ENCODE, END, ERROR, ERROR_NAMES, FONT, IMAGE, IMPORT_TYPES, MASH, NUMBER, OUTPUT_DEFAULTS, POINT_KEYS, POINT_ZERO, PROBE, PROMPT, RAW, RECORD, RECORDS, RECT_KEYS, RECT_ZERO, SEQUENCE, SHAPE, SIZE_KEYS, SIZE_OUTPUT, SIZE_ZERO, STRING, TARGET_IDS, TEXT, TRANSCODE, VERSION, VIDEO, VISIBLE_TYPES, WAVEFORM, arrayFromOneOrMore, assertAsset, assertAssetType, assertDecoding, assertIdentified, assertProbing, assertTyped, error, errorCaught, errorMessage, errorName, errorObject, errorObjectCaught, errorPromise, errorThrow, importPromise, isArray, isAsset, isAssetObject, isAssetType, isAudibleAssetType, isBoolean, isDecoding, isDecodingType, isDefined, isDefiniteError, isErrorName, isFunction, isIdentified, isImportType, isImporter, isListenerRecord, isNan, isNumber, isNumberOrNaN, isNumeric, isObject, isPopulatedString, isProbing, isSourceAsset, isString, isTyped, isUndefined, isVisibleAssetType, length };
