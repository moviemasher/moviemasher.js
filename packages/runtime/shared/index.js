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
// export const StandardErrorName = {
//   Error: ERROR.Unknown,
//   EvalError: ERROR.Evaluation,
//   InternalError: ERROR.Internal,
//   RangeError: ERROR.Range,
//   ReferenceError: ERROR.Reference,
//   SyntaxError: ERROR.Syntax,
//   TypeError: ERROR.Type,
//   URIError: ERROR.Url,
// }
// export type StandardErrorName = typeof StandardErrorName[keyof typeof StandardErrorName]

const isErrorName = (value) => ((typeof value === 'string') && ERROR_NAMES.includes(value));
const errorMessage = (name, context) => (typeof context === 'string' ? context : name);
const errorObject = (message, name = ERROR.Internal, cause) => {
    const error = new Error(message);
    Object.assign(error, { name, cause });
    return error;
};
const errorObjectCaught = (error) => {
    if (isErrorName(error))
        return errorName(error);
    if (typeof error === 'string')
        return errorObject(error);
    const { message: errorMessage = '', name = ERROR.Internal } = error;
    const message = errorMessage || String(name);
    return errorObject(message, name, error);
};
const errorName = (name, context) => {
    // console.log('errorName', name, context)
    return { name, message: errorMessage(name, context), cause: context };
};
const errorCaught = (error) => ({ error: errorObjectCaught(error) });
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
    return isObject(value) && 'error' in value && isObject(value.error);
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

const BOOLEAN = 'boolean';
const NUMBER = 'number';
const STRING = 'string';

const PROBE = 'probe';

const isListenerRecord = (value) => (isObject(value) && Object.values(value).every(isFunction));

const EventTypeAsset = 'asset';

const TypeFont = 'font';
const TypesImport = [TypeFont, ...ASSET_TYPES];

const isImportType = (value) => (TypesImport.includes(value));
const isImporter = (value) => (isIdentified(value)
    && 'source' in value && isPopulatedString(value.source)
    && 'types' in value && isArray(value.types));

const TypeRecord = 'record';
const TypeRecords = 'records';

const TypeDecode = 'decode';
const TypeEncode = 'encode';
const TypeTranscode = 'transcode';

const POINT_ZERO = { x: 0, y: 0 };
const POINT_KEYS = ['x', 'y'];

const End = 'End';
const Crop = 'Crop';
const Aspect = 'Aspect';

const SIZE_ZERO = { width: 0, height: 0 };
const SIZE_OUTPUT = { width: 1920, height: 1080 };
const SIZE_KEYS = ['width', 'height'];

const RECT_ZERO = { ...POINT_ZERO, ...SIZE_ZERO };
const RECT_KEYS = [...POINT_KEYS, ...SIZE_KEYS];

const MovieMasherImportPromise = (imports, eventDispatcher) => {
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
            console.error('MovieMasherImportPromise', error);
        });
    });
};

const COLOR = 'color';
const SourceMash = 'mash';
const SourcePrompt = 'prompt';
const SourceRaw = 'raw';
const SourceShape = 'shape';
const SourceText = 'text';

const SEQUENCE = 'sequence';
const WAVEFORM = 'waveform';

const TypeAsset = 'asset';
const TypeClip = 'clip';
const TypeContainer = 'container';
const TypeContent = 'content';
const TypeMash = 'mash';
const TypesTarget = [
    TypeMash, TypeClip, TypeContent, TypeContainer, TypeAsset
];

const OutputEncodeDefaults = {
    audio: {
        options: {},
        audioBitrate: 160,
        audioCodec: 'libmp3lame',
        audioChannels: 2,
        audioRate: 44100,
        extension: 'mp3',
    },
    font: {
        options: {},
        extension: 'woff2',
    },
    sequence: {
        options: {},
        format: 'image2',
        width: 320,
        height: 240,
        videoRate: 10,
        extension: 'jpg',
    },
    waveform: {
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
    image: {
        options: {},
        width: 320,
        height: 240,
        extension: 'jpg',
    },
    video: {
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
const OutputAlphaDefaults = {
    image: {
        options: {},
        width: 320,
        height: 240,
        extension: 'png',
        format: 'image2',
        offset: 0
    },
    sequence: {
        options: {},
        format: 'image2',
        width: 320,
        height: 240,
        videoRate: 10,
        extension: 'png',
    },
    video: {
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

export { ASSET_TYPES, AUDIBLE_TYPES, AUDIO, Aspect, BOOLEAN, COLOR, Crop, ERROR, ERROR_NAMES, End, EventTypeAsset, IMAGE, MovieMasherImportPromise, NUMBER, OutputAlphaDefaults, OutputEncodeDefaults, POINT_KEYS, POINT_ZERO, PROBE, RECT_KEYS, RECT_ZERO, SEQUENCE, SIZE_KEYS, SIZE_OUTPUT, SIZE_ZERO, STRING, SourceMash, SourcePrompt, SourceRaw, SourceShape, SourceText, TypeAsset, TypeClip, TypeContainer, TypeContent, TypeDecode, TypeEncode, TypeFont, TypeMash, TypeRecord, TypeRecords, TypeTranscode, TypesImport, TypesTarget, VIDEO, VISIBLE_TYPES, WAVEFORM, arrayFromOneOrMore, assertAsset, assertAssetType, assertIdentified, assertTyped, error, errorCaught, errorMessage, errorName, errorObject, errorObjectCaught, errorPromise, errorThrow, isArray, isAsset, isAssetObject, isAssetType, isAudibleAssetType, isBoolean, isDefined, isDefiniteError, isErrorName, isFunction, isIdentified, isImportType, isImporter, isListenerRecord, isNan, isNumber, isNumberOrNaN, isNumeric, isObject, isPopulatedString, isSourceAsset, isString, isTyped, isUndefined, isVisibleAssetType, length };
