'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

const Default = {
    label: "Unlabeled",
    masher: {
        buffer: 10,
        fps: 30,
        loop: true,
        volume: 0.75,
        precision: 3,
        autoplay: false,
    },
    mash: {
        label: "Unlabeled Mash",
        quantize: 10,
        backcolor: "#00000000",
        gain: 0.75,
        buffer: 10,
    },
    instance: {
        audio: { gain: 1.0, trim: 0 },
        video: { speed: 1.0 }
    },
    definition: {
        frame: { duration: 2 },
        image: { duration: 2 },
        theme: { duration: 3 },
        transition: { duration: 1 },
        video: { pattern: '%.jpg', fps: 30, increment: 1, begin: 1 },
    },
};

const $invalid = "Invalid";
const $unknown = "Unknown";
const $expected = "Expected";
const $invalidArgument = `${$invalid} argument`;
const $invalidProperty = `${$invalid} property`;
const $invalidDefinitionProperty = `${$invalid} definition property`;
const $deprecated = "deprecated in 4.1";
const $internal = "Internal Error ";
const Errors = {
    eval: {
        sourceRect: `${$invalid} evaluation of source rect `,
        outputSize: `${$invalid} evaluation of output size `,
        conditionTruth: `${$expected} at least one condition to evaluate to true `,
        conditionValue: `${$expected} condition to have a value `,
        number: `${$expected} evaluated value to be a number `,
        get: `${$expected} to get evaluated value `,
    },
    composition: { mashUndefined: `${$internal}composition.mash undefined` },
    audibleContext: `${$expected} AudioContext`,
    mash: `${$expected} mash`,
    action: `${$expected} Action`,
    actions: `${$expected} Actions`,
    internal: $internal,
    argument: `${$invalidArgument} `,
    invalid: {
        canvas: `${$invalidArgument} canvas `,
        definition: {
            duration: `${$invalidDefinitionProperty} duration`,
            audio: `${$invalidDefinitionProperty} audio|url`,
            url: `${$invalidDefinitionProperty} url`,
            source: `${$invalidDefinitionProperty} source`,
            id: `${$invalidDefinitionProperty} id`,
            object: `${$invalidProperty} definition`,
        },
        track: `${$invalid} track `,
        trackType: `${$invalidProperty} trackType `,
        action: `${$invalid} action `,
        name: `${$invalidProperty} name `,
        value: `${$invalidProperty} value `,
        type: `${$invalidProperty} type `,
        url: `${$invalidProperty} url `,
        property: $invalidProperty,
        argument: $invalidArgument,
        object: `${$invalidArgument} object `,
        factory: `${$invalid} factory `,
        volume: `${$invalidArgument} volume`,
    },
    type: `${$unknown} type `,
    selection: `${$invalid} selection `,
    unknown: {
        type: `${$unknown} type `,
        merger: `${$unknown} merger `,
        effect: `${$unknown} effect `,
        filter: `${$unknown} filter `,
        font: `${$unknown} font `,
        scaler: `${$unknown} scalar `,
        mode: `${$unknown} mode `,
        definition: `${$unknown} definition `,
    },
    uncached: "Uncached URL ",
    object: `${$invalidArgument} object `,
    array: `${$invalidArgument} array `,
    media: `${$invalidArgument} media `,
    id: `${$invalidArgument} id `,
    frame: `${$invalidArgument} frame `,
    frames: `${$invalidProperty} frames `,
    fps: `${$invalidArgument} fps `,
    seconds: `${$invalidArgument} seconds `,
    url: `${$invalidArgument} url `,
    time: `${$invalidArgument} Time`,
    timeRange: `${$invalidArgument} TimeRange`,
    mainTrackOverlap: `${$internal}: main track clips overlap without transition`,
    unknownMash: `${$unknown} Mash property `,
    unimplemented: `${$expected} method to be overridden`,
    property: `${$invalidArgument} property `,
    deprecation: {
        property_types: `property_types ${$deprecated} - please get MovieMasher.Property.types instead`,
        addModulesOfType: `addModulesOfType ${$deprecated} for unsupported type `,
        configure: {
            get: `configure ${$deprecated} - please get MovieMasher.defaults instead`,
            set: `configure ${$deprecated} - please supply mash.quantize and media.duration instead`,
        },
        canvas_context: {
            get: `canvas_context ${$deprecated} - please get visibleContext instead`,
            set: `canvas_context ${$deprecated} - please set visibleContext instead`,
        }
    },
    wrongClass: `${$expected} instance of `,
};

class Parameter {
    constructor({ name, value }) {
        if (!name)
            throw Errors.invalid.name;
        if (typeof value === "undefined")
            throw Errors.invalid.value;
        this.name = String(name);
        this.value = value;
    }
    toJSON() {
        return { name: this.name, value: this.value };
    }
}

const objectType = (value) => typeof value === 'object';
const stringType = (value) => (typeof value === 'string');
const undefinedType = (value) => typeof value === 'undefined';
const numberType = (value) => typeof value === 'number';
const booleanType = (value) => typeof value === 'boolean';
const methodType = (value) => typeof value === 'function';
const isDefined = (value) => !undefinedType(value);
const isNan = (value) => numberType(value) && Number.isNaN(value);
const isNumber = (value) => numberType(value) && !Number.isNaN(value);
const isInteger = (value) => Number.isInteger(value);
const isFloat = (value) => numberType(value) && !isInteger(value);
const isPositive = (value) => numberType(value) && Number(value) >= 0;
const isAboveZero = (value) => isNumber(value) && Number(value) > 0;
const isArray = (value) => (isDefined(Array.isArray) ? Array.isArray(value) : value instanceof Array);
const length = (value) => !!value.length;
const isPopulatedString = (value) => stringType(value) && length(String(value));
const isPopulatedObject = (value) => (objectType(value) && length(Object.keys(value)));
const isPopulatedArray = (value) => isArray(value) && length(value);
const Is = {
    aboveZero: isAboveZero,
    array: isArray,
    boolean: booleanType,
    defined: isDefined,
    float: isFloat,
    integer: isInteger,
    method: methodType,
    nan: isNan,
    number: numberType,
    object: objectType,
    populatedArray: isPopulatedArray,
    populatedObject: isPopulatedObject,
    populatedString: isPopulatedString,
    positive: isPositive,
    string: stringType,
    undefined: undefinedType,
};

const boolean = {
  value: false
};
const direction4 = {
  values: [
    {
      id: 0,
      identifier: "top",
      label: "Top"
    },
    {
      id: 1,
      identifier: "right",
      label: "Right"
    },
    {
      id: 2,
      identifier: "bottom",
      label: "Bottom"
    },
    {
      id: 3,
      identifier: "left",
      label: "Left"
    }
  ],
  value: 0
};
const direction8 = {
  values: [
    {
      id: 0,
      identifier: "top",
      label: "Top"
    },
    {
      id: 1,
      identifier: "right",
      label: "Right"
    },
    {
      id: 2,
      identifier: "bottom",
      label: "Bottom"
    },
    {
      id: 3,
      identifier: "left",
      label: "Left"
    },
    {
      id: 4,
      identifier: "top_right",
      label: "Top Right"
    },
    {
      id: 5,
      identifier: "bottom_right",
      label: "Bottom Right"
    },
    {
      id: 6,
      identifier: "bottom_left",
      label: "Bottom Left"
    },
    {
      id: 7,
      identifier: "top_left",
      label: "Top Left"
    }
  ],
  value: 0
};
const font = {
  value: "com.moviemasher.font.default",
  modular: true
};
const fontsize = {
  value: 13
};
const integer = {
  value: 0
};
const mode = {
  value: "normal",
  values: [
    {
      id: "burn",
      identifier: "color-burn",
      label: "Color Burn"
    },
    {
      id: "dodge",
      identifier: "color-dodge",
      label: "Color Dodge"
    },
    {
      id: "darken",
      identifier: "darken",
      label: "Darken"
    },
    {
      id: "difference",
      identifier: "difference",
      label: "Difference"
    },
    {
      id: "exclusion",
      identifier: "exclusion",
      label: "Exclusion"
    },
    {
      id: "hardlight",
      identifier: "hard-light",
      label: "Hard Light"
    },
    {
      id: "lighten",
      identifier: "lighter",
      label: "Lighten"
    },
    {
      id: "multiply",
      identifier: "multiply",
      label: "Multiply"
    },
    {
      id: "normal",
      identifier: "normal",
      label: "Normal"
    },
    {
      id: "overlay",
      identifier: "overlay",
      label: "Overlay"
    },
    {
      id: "screen",
      identifier: "screen",
      label: "Screen"
    },
    {
      id: "softlight",
      identifier: "soft-light",
      label: "Soft Light"
    },
    {
      id: "xor",
      identifier: "xor",
      label: "Xor"
    }
  ]
};
const number = {
  value: 0
};
const pixel = {
  value: 0
};
const rgb = {
  value: "rgb(0, 0, 0)"
};
const hex = {
  value: "#000000"
};
const rgba = {
  value: "rgba(0, 0, 0, 1)"
};
const string = {
  value: ""
};
const text = {
  value: ""
};
var dataTypesJson = {
  boolean: boolean,
  direction4: direction4,
  direction8: direction8,
  font: font,
  fontsize: fontsize,
  integer: integer,
  mode: mode,
  number: number,
  pixel: pixel,
  rgb: rgb,
  hex: hex,
  rgba: rgba,
  string: string,
  text: text
};

exports.ActionType = void 0;
(function (ActionType) {
    ActionType["AddTrack"] = "addTrack";
    ActionType["AddClipsToTrack"] = "addClipsToTrack";
    ActionType["MoveClips"] = "moveClips";
    ActionType["AddEffect"] = "addEffect";
    ActionType["Change"] = "change";
    ActionType["ChangeFrames"] = "changeFrames";
    ActionType["ChangeTrim"] = "changeTrim";
    ActionType["ChangeGain"] = "changeGain";
    ActionType["MoveEffects"] = "moveEffects";
    ActionType["Split"] = "split";
    ActionType["Freeze"] = "freeze";
    ActionType["RemoveClips"] = "removeClips";
})(exports.ActionType || (exports.ActionType = {}));
exports.TrackType = void 0;
(function (TrackType) {
    TrackType["Audio"] = "audio";
    TrackType["Video"] = "video";
})(exports.TrackType || (exports.TrackType = {}));
exports.ClipType = void 0;
(function (ClipType) {
    ClipType["Audio"] = "audio";
    ClipType["Frame"] = "frame";
    ClipType["Image"] = "image";
    ClipType["Theme"] = "theme";
    ClipType["Transition"] = "transition";
    ClipType["Video"] = "video";
})(exports.ClipType || (exports.ClipType = {}));
const ClipTypes = Object.values(exports.ClipType);
// NOTE: order important here - determines initialization
exports.DefinitionType = void 0;
(function (DefinitionType) {
    DefinitionType["Filter"] = "filter";
    DefinitionType["Merger"] = "merger";
    DefinitionType["Scaler"] = "scaler";
    DefinitionType["Effect"] = "effect";
    DefinitionType["Audio"] = "audio";
    DefinitionType["Font"] = "font";
    DefinitionType["Image"] = "image";
    DefinitionType["Mash"] = "mash";
    DefinitionType["Masher"] = "masher";
    DefinitionType["Theme"] = "theme";
    DefinitionType["Transition"] = "transition";
    DefinitionType["Video"] = "video";
})(exports.DefinitionType || (exports.DefinitionType = {}));
const DefinitionTypes = Object.values(exports.DefinitionType);
exports.EventType = void 0;
(function (EventType) {
    EventType["Action"] = "action";
    EventType["Canvas"] = "canvaschange";
    EventType["Ended"] = "ended";
    EventType["Duration"] = "durationchange";
    EventType["Fps"] = "ratechange";
    EventType["Loaded"] = "loadeddata";
    EventType["Pause"] = "pause";
    EventType["Play"] = "play";
    EventType["Playing"] = "playing";
    EventType["Seeking"] = "seeking";
    EventType["Seeked"] = "seeked";
    EventType["Time"] = "timeupdate";
    EventType["Track"] = "track";
    EventType["Volume"] = "volumechange";
    EventType["Waiting"] = "waiting";
})(exports.EventType || (exports.EventType = {}));
exports.MashType = void 0;
(function (MashType) {
    MashType["Mash"] = "mash";
})(exports.MashType || (exports.MashType = {}));
const MashTypes = Object.values(exports.MashType);
exports.ModuleType = void 0;
(function (ModuleType) {
    ModuleType["Effect"] = "effect";
    ModuleType["Font"] = "font";
    ModuleType["Merger"] = "merger";
    ModuleType["Scaler"] = "scaler";
    ModuleType["Theme"] = "theme";
    ModuleType["Transition"] = "transition";
})(exports.ModuleType || (exports.ModuleType = {}));
const ModuleTypes = Object.values(exports.ModuleType);
exports.LoadType = void 0;
(function (LoadType) {
    LoadType["Audio"] = "audio";
    LoadType["Font"] = "font";
    LoadType["Image"] = "image";
    LoadType["Module"] = "module";
})(exports.LoadType || (exports.LoadType = {}));
exports.MoveType = void 0;
(function (MoveType) {
    MoveType["Audio"] = "audio";
    MoveType["Effect"] = "effect";
    MoveType["Video"] = "video";
})(exports.MoveType || (exports.MoveType = {}));
exports.DataType = void 0;
(function (DataType) {
    DataType["Boolean"] = "boolean";
    DataType["Direction4"] = "direction4";
    DataType["Direction8"] = "direction8";
    DataType["Font"] = "font";
    DataType["Fontsize"] = "fontsize";
    DataType["Hex"] = "hex";
    DataType["Integer"] = "integer";
    DataType["Mode"] = "mode";
    DataType["Number"] = "number";
    DataType["Pixel"] = "pixel";
    DataType["Rgb"] = "rgb";
    DataType["Rgba"] = "rgba";
    DataType["Scalar"] = "scalar";
    DataType["String"] = "string";
    DataType["Text"] = "text";
})(exports.DataType || (exports.DataType = {}));
const DataTypes = Object.values(exports.DataType);
exports.TransformType = void 0;
(function (TransformType) {
    TransformType["Merger"] = "merger";
    TransformType["Scaler"] = "scaler";
})(exports.TransformType || (exports.TransformType = {}));
const TransformTypes = Object.values(exports.TransformType);

class TypeValue {
    constructor(object) {
        const { id, identifier, label } = object;
        this.id = id;
        this.identifier = identifier;
        this.label = label;
    }
}

class Type {
    constructor(object) {
        this.modular = false;
        this.values = [];
        const { value, values, modular, id } = object;
        if (!id)
            throw Errors.id;
        if (typeof value === "undefined")
            throw Errors.invalid.value + JSON.stringify(object);
        this.value = value;
        this.id = id;
        if (modular)
            this.modular = modular;
        if (values)
            this.values.push(...values.map(value => new TypeValue(value)));
    }
}

class TypesClass {
    constructor(object) {
        this.propertyTypes = new Map();
        Object.entries(object).forEach(entry => {
            const [key, value] = entry;
            const dataType = key;
            if (!DataTypes.includes(dataType))
                throw Errors.type + 'DataTypes ' + key;
            this.propertyTypes.set(dataType, new Type({ ...value, id: dataType }));
        });
    }
    propertyType(type) {
        const instance = this.propertyTypes.get(type);
        if (!instance)
            throw Errors.type + 'propertyType ' + type;
        return instance;
    }
    propertyTypeDefault(type) {
        if (!(Is.populatedString(type) && DataTypes.includes(type)))
            throw Errors.type + 'propertyTypeDefault ' + type;
        const propertyType = this.propertyType(type);
        if (!Is.object(propertyType))
            return "";
        return propertyType.value;
    }
}
const TypesInstance = new TypesClass(dataTypesJson);

class Property {
    constructor(object) {
        const { type, name, value, custom } = object;
        if (!type)
            throw Errors.invalid.type;
        if (!name)
            throw Errors.invalid.name;
        if (typeof value === "undefined")
            throw Errors.invalid.value + JSON.stringify(object);
        this.type = TypesInstance.propertyType(type);
        this.name = name;
        this.value = value;
        this.custom = !!custom;
    }
    toJSON() {
        return { value: this.value, type: this.type.id };
    }
}

const Capitalize = (value) => {
    if (!isPopulatedString(value))
        return value;
    return `${value[0].toUpperCase()}${value.substr(1)}`;
};

const rgbValue = (value) => (Math.min(255, Math.max(0, Math.floor(Number(value)))));
const rgbNumeric = (rgb) => ({
    r: rgbValue(rgb.r), g: rgbValue(rgb.g), b: rgbValue(rgb.b)
});
const yuvNumeric = (rgb) => ({
    y: rgbValue(rgb.y), u: rgbValue(rgb.u), v: rgbValue(rgb.v)
});
const yuv2rgb = (yuv) => {
    const floats = yuvNumeric(yuv);
    return rgbNumeric({
        r: floats.y + 1.4075 * (floats.v - 128),
        g: floats.y - 0.3455 * (floats.u - 128) - (0.7169 * (floats.v - 128)),
        b: floats.y + 1.7790 * (floats.u - 128)
    });
};
const rgb2hex = (rgb) => {
    let r = rgb.r.toString(16);
    let g = rgb.g.toString(16);
    let b = rgb.b.toString(16);
    if (r.length < 2)
        r = `0${r}`;
    if (g.length < 2)
        g = `0${g}`;
    if (b.length < 2)
        b = `0${b}`;
    return `#${r}${g}${b}`;
};
const yuvBlend = (yuvs, yuv, match, blend) => {
    let diff = 0.0;
    const blendYuv = yuvNumeric(yuv);
    yuvs.forEach(yuvObject => {
        const numericYuv = yuvNumeric(yuvObject);
        const du = numericYuv.u - blendYuv.u;
        const dv = numericYuv.v - blendYuv.v;
        diff += Math.sqrt((du * du + dv * dv) / (255.0 * 255.0));
    });
    diff /= yuvs.length;
    if (blend > 0.0001) {
        return Math.min(1.0, Math.max(0.0, (diff - match) / blend)) * 255.0;
    }
    return (diff > match) ? 255 : 0;
};
const rgb2yuv = (rgb) => {
    const ints = rgbNumeric(rgb);
    return {
        y: ints.r * 0.299000 + ints.g * 0.587000 + ints.b * 0.114000,
        u: ints.r * -0.168736 + ints.g * -0.331264 + ints.b * 0.500000 + 128,
        v: ints.r * 0.500000 + ints.g * -0.418688 + ints.b * -0.081312 + 128
    };
};
const Color = {
    yuvBlend,
    rgb2yuv,
    yuv2rgb,
    rgb2hex, // unused after 4.1 refactor, but perhaps needed?
};

const ElementScrollProps = [
    'height',
    'width',
    'scrollPaddingleft',
    'scrollPaddingRight',
    'scrollPaddingTop',
    'scrollPaddingBottom',
    'x',
    'y',
];
const elementScrollMetrics = (element) => {
    if (!element)
        return;
    const style = getComputedStyle(element);
    const entries = ElementScrollProps.map(key => {
        const value = style.getPropertyValue(key) || '0px';
        const number = Number(value.slice(0, -2));
        return [key, isNaN(number) ? 0 : number];
    });
    const { scrollLeft, scrollTop } = element;
    entries.push(['scrollLeft', scrollLeft]);
    entries.push(['scrollTop', scrollTop]);
    return Object.fromEntries(entries);
};
const Element = {
    scrollMetrics: elementScrollMetrics,
};

const KEYS_SIZED = ['mm_width', 'mm_height'];
const KEYS_GETTERS = [
    "mm_dimensions",
    "mm_duration",
    "mm_fps",
    "mm_height",
    "mm_t",
    "mm_width",
    "t",
];
const KEYS = [
    "ceil",
    "floor",
    "mm_cmp",
    "mm_horz",
    "mm_max",
    "mm_min",
    "mm_vert",
    ...KEYS_GETTERS,
    ...KEYS_SIZED
];
const $evaluator = "evaluator";
const arrayFromElements = (elements) => {
    if (typeof elements === "string")
        return String(elements).split(',');
    return elements;
};
const conditionalExpression = (conditional) => {
    const { condition } = conditional;
    // not strict equality, since we may have strings and numbers
    if (Is.defined(conditional.is))
        return `${condition}==${conditional.is}`;
    const elements = conditional.in;
    if (Is.undefined(elements))
        return String(condition);
    // support supplying values as array or comma-delimited string
    const array = arrayFromElements(elements);
    const strings = Is.string(array[0]);
    const values = array.map(element => (strings ? `"${element}"` : element));
    const type = strings ? 'String' : 'Number';
    const expression = `([${values.join(',')}].includes(${type}(${condition})))`;
    return expression;
};
const replaceOperators = (string) => (string.replaceAll(' or ', ' || ').replaceAll(' and ', ' && '));
class Evaluator {
    constructor(timeRange, context, size, mergeContext) {
        this.ceil = Math.ceil;
        this.floor = Math.floor;
        this.map = new Map();
        this.mm_max = Math.max;
        this.mm_min = Math.min;
        this.timeRange = timeRange;
        this.context = context;
        this.mergeContext = mergeContext;
        this.size = size;
        this.setInputSize(this.size);
    }
    conditionalValue(conditionals) {
        // console.log(this.constructor.name, "conditionalValue", conditionals)
        const trueConditional = conditionals.find((conditional) => {
            const expression = replaceOperators(conditionalExpression(conditional));
            const result = this.evaluateExpression(expression);
            // console.log(this.constructor.name, "conditionalValue", expression, "=", result)
            return result;
        });
        if (typeof trueConditional === "undefined")
            throw Errors.eval.conditionTruth;
        const { value } = trueConditional;
        if (typeof value === "undefined")
            throw Errors.eval.conditionValue;
        // console.log(this.constructor.name, "conditionalValue", value.constructor.name, value)
        return value;
    }
    get duration() { return this.timeRange.lengthSeconds; }
    evaluate(value) {
        // console.log(this.constructor.name, "evaluate", value)
        if (typeof value === "number")
            return value;
        const expression = (typeof value === "string") ? String(value) : this.conditionalValue(value);
        if (typeof expression === "number")
            return expression;
        const result = this.evaluateExpression(expression);
        // console.log(this.constructor.name, "evaluate", expression, "=", result)
        return result;
    }
    evaluateExpression(expression) {
        const script = `return ${this.replaceKeys(expression)}`;
        try {
            // eslint-disable-next-line no-new-func
            const method = new Function($evaluator, script);
            const result = method(this);
            // console.log(this.constructor.name, "evaluateExpression", expression, result)
            return result;
        }
        catch (exception) {
            //console.warn(`Evaluator.evaluateExpression`, exception, expression, this.map)
            return expression;
        }
    }
    get(key) {
        if (this.map.has(key)) {
            // console.log("Evaluator.get returning value from map", key, this.map.get(key))
            return this.map.get(key);
        }
        if (!KEYS.includes(key))
            throw Errors.eval.get + key;
        const value = this[key];
        if (KEYS_GETTERS.includes(key))
            return value;
        if (typeof value === "function") {
            // console.log("Evaluator.get returning method", key)
            return value.bind(this);
        }
        throw Errors.eval.get + key;
        // return // unknown key
    }
    has(key) { return KEYS.includes(key) || this.map.has(key); }
    initialize(key, value) {
        if (this.has(key))
            return false;
        this.set(key, value);
        return true;
    }
    get inputSize() {
        return {
            width: Number(this.get("mm_input_width")),
            height: Number(this.get("mm_input_height"))
        };
    }
    get keys() { return [...new Set([...this.map.keys(), ...KEYS])]; }
    mm_cmp(a, b, x, y) {
        return ((a > b) ? x : y);
    }
    get mm_dimensions() { return `${this.mm_width}x${this.mm_height}`; }
    get mm_duration() { return this.duration; }
    get mm_fps() { return this.timeRange.fps; }
    get mm_height() { return this.size.height; }
    mm_horz(size, proud) {
        return this.sized(0, size, proud);
    }
    get mm_t() { return this.position; }
    mm_vert(size, proud) {
        return this.sized(1, size, proud);
    }
    get mm_width() { return this.size.width; }
    get position() { return this.timeRange.position; }
    replaceKeys(value) {
        let expression = value;
        const expressions = Object.fromEntries(this.keys.map(key => ([
            key, new RegExp(`\\b${key}\\b`, 'g')
        ])));
        Object.entries(expressions).forEach(([key, regExp]) => {
            expression = expression.replaceAll(regExp, `${$evaluator}.get("${key}")`);
        });
        return expression;
    }
    set(key, value) { this.map.set(key, value); }
    setInputSize({ width, height }) {
        this.set("in_h", height);
        this.set("mm_input_height", height);
        this.set("in_w", width);
        this.set("mm_input_width", width);
    }
    sized(vertical, size, proud) {
        const scale = Is.float(size) ? Number(size) : parseFloat(String(size));
        if (Is.nan(scale))
            throw Errors.eval.number + 'scale';
        const sizedKey = KEYS_SIZED[vertical];
        const sizedValue = this.get(sizedKey);
        const value = parseFloat(String(sizedValue));
        if (Is.nan(value))
            throw Errors.eval.number + `value ${sizedKey}=>${sizedValue}`;
        const scaled = value * scale;
        if (!proud)
            return scaled;
        const otherSizedKey = KEYS_SIZED[Math.abs(vertical - 1)];
        const otherValue = this.get(otherSizedKey);
        if (typeof otherValue === "undefined")
            throw Errors.internal + 'otherValue';
        const other = parseFloat(String(otherValue));
        if (Is.nan(other))
            throw Errors.eval.number + 'other';
        if (other <= value)
            return scaled;
        return value + (scale - 1.0) * other;
    }
    get t() { return this.mm_duration; }
}

const Id = () => {
    return `${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`;
};

const roundMethod = (rounding = '') => {
    switch (rounding) {
        case 'ceil': return Math.ceil;
        case 'floor': return Math.floor;
        default: return Math.round;
    }
};
const roundWithMethod = (number, method = '') => {
    const func = roundMethod(method);
    return func(number);
};
const Round = {
    method: roundMethod,
    withMethod: roundWithMethod,
};

const pixelFromPoint = (pt, width) => pt.y * width + pt.x;
const pixelToPoint = (index, width) => ({ x: index % width, y: Math.floor(index / width) });
const pixelToIndex = (pixel) => pixel * 4;
const pixelRgbaAtIndex = (index, pixels) => ({
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2],
    a: pixels[index + 3],
});
const pixelRgba = (pixel, data) => pixelRgbaAtIndex(pixelToIndex(pixel), data);
const pixelSafe = (pixel, offsetPoint, size) => {
    const { x, y } = offsetPoint;
    const { width, height } = size;
    const pt = pixelToPoint(pixel, width);
    pt.x = Math.max(0, Math.min(width - 1, pt.x + x));
    pt.y = Math.max(0, Math.min(height - 1, pt.y + y));
    return pixelFromPoint(pt, width);
};
const pixelNeighboringPixels = (pixel, size) => {
    const depth = 3; // should be 4, no?
    const pixels = [];
    const halfSize = Math.floor(depth / 2);
    for (let y = 0; y < depth; y += 1) {
        for (let x = 0; x < depth; x += 1) {
            const offsetPoint = { x: x - halfSize, y: y - halfSize };
            pixels.push(pixelSafe(pixel, offsetPoint, size));
        }
    }
    return pixels;
};
const pixelNeighboringRgbas = (pixel, data, size) => (pixelNeighboringPixels(pixel, size).map(p => pixelRgba(p, data)));
const pixelColor = (value) => {
    const string = String(value);
    if (string.slice(0, 2) === "0x")
        return `#${string.slice(2)}`;
    return string;
};
const pixelPerFrame = (frames, width, zoom) => {
    if (!(frames && width))
        return 0;
    const widthFrames = width / frames;
    const min = Math.min(1, widthFrames);
    const max = Math.max(1, widthFrames);
    if (zoom === 1)
        return max;
    if (!zoom)
        return min;
    return min + ((max - min) * zoom);
};
const pixelFromFrame = (frame, perFrame, rounding = 'ceil') => {
    if (!(frame && perFrame))
        return 0;
    const pixels = frame * perFrame;
    return roundWithMethod(pixels, rounding);
};
const pixelToFrame = (pixels, perFrame, rounding = 'round') => {
    if (!(pixels && perFrame))
        return 0;
    return roundWithMethod(pixels / perFrame, rounding);
};
const Pixel = {
    color: pixelColor,
    fromFrame: pixelFromFrame,
    neighboringRgbas: pixelNeighboringRgbas,
    perFrame: pixelPerFrame,
    rgbaAtIndex: pixelRgbaAtIndex,
    toFrame: pixelToFrame,
};

const Seconds = (seconds, fps, duration) => {
    let time, pad, do_rest, s = '';
    if (!duration)
        duration = seconds;
    time = 60 * 60; // an hour
    pad = 2;
    if (duration >= time) {
        if (seconds >= time) {
            s += String(Math.floor(seconds / time)).padStart(pad, '0');
            do_rest = true;
            seconds = seconds % time;
        }
        else
            s += '00:';
    }
    time = 60; // a minute
    if (do_rest || (duration >= time)) {
        if (do_rest)
            s += ':';
        if (seconds >= time) {
            s += String(Math.floor(seconds / time)).padStart(pad, '0');
            do_rest = true;
            seconds = seconds % time;
        }
        else
            s += '00:';
    }
    time = 1; // a second
    if (do_rest || (duration >= time)) {
        if (do_rest)
            s += ':';
        if (seconds >= time) {
            s += String(Math.floor(seconds / time)).padStart(pad, '0');
            do_rest = true;
            seconds = seconds % time;
        }
        else
            s += '00';
    }
    else
        s += '00';
    if (fps > 1) {
        if (fps === 10)
            pad = 1;
        s += '.';
        if (seconds) {
            if (pad === 1)
                seconds = Math.floor(seconds * 10) / 10;
            else
                seconds = Math.floor(100 * seconds) / 100;
            seconds = Number(String(seconds).substr(2, 2));
            s += String(seconds).padStart(pad, '0');
        }
        else
            s += '0'.padStart(pad, '0');
    }
    return s;
};

const byFrame = (a, b) => a.frame - b.frame;
const byTrack = (a, b) => a.track - b.track;
const byLabel = (a, b) => {
    if (a.label < b.label)
        return -1;
    if (a.label > b.label)
        return 1;
    return 0;
};
const Sort = { byFrame, byLabel, byTrack };

const greatestCommonDenominator = (fps1, fps2) => {
    let a = fps1;
    let b = fps2;
    let t = 0;
    while (b !== 0) {
        t = b;
        b = a % b;
        a = t;
    }
    return a;
};
const lowestCommonMultiplier = (a, b) => ((a * b) / greatestCommonDenominator(a, b));
const timeEqualizeRates = (time1, time2, rounding = '') => {
    if (time1.fps === time2.fps)
        return [time1, time2];
    const gcf = lowestCommonMultiplier(time1.fps, time2.fps);
    return [
        time1.scale(gcf, rounding),
        time2.scale(gcf, rounding)
    ];
};
class Time {
    constructor(frame = 0, fps = 1) {
        if (!Is.integer(frame) || frame < 0)
            throw Errors.frame;
        if (!Is.integer(fps) || fps < 1)
            throw Errors.fps;
        this.frame = frame;
        this.fps = fps;
    }
    add(time) {
        const [time1, time2] = timeEqualizeRates(this, time);
        return new Time(time1.frame + time2.frame, time1.fps);
    }
    addFrames(frames) {
        const time = this.copy;
        time.frame += frames;
        return time;
    }
    get copy() { return new Time(this.frame, this.fps); }
    get description() { return `${this.frame}@${this.fps}`; }
    divide(number, rounding = '') {
        if (!Is.number(number))
            throw Errors.argument + 'divide';
        return new Time(roundWithMethod(Number(this.frame) / number, rounding), this.fps);
    }
    equalsTime(time) {
        const [time1, time2] = timeEqualizeRates(this, time);
        return time1.frame === time2.frame;
    }
    min(time) {
        const [time1, time2] = timeEqualizeRates(this, time);
        return new Time(Math.min(time1.frame, time2.frame), time1.fps);
    }
    scale(fps, rounding = '') {
        if (this.fps === fps)
            return this;
        const frame = Number(this.frame / this.fps) * Number(fps);
        return new Time(roundWithMethod(frame, rounding), fps);
    }
    scaleToFps(fps) { return this.scaleToTime(new Time(0, fps)); }
    scaleToTime(time) {
        return timeEqualizeRates(this, time)[0];
    }
    get seconds() { return Number(this.frame) / Number(this.fps); }
    subtract(time) {
        const [time1, time2] = timeEqualizeRates(this, time);
        let subtracted = time2.frame;
        if (subtracted > time1.frame) {
            subtracted -= subtracted - time1.frame;
        }
        return new Time(time1.frame - subtracted, time1.fps);
    }
    subtractFrames(frames) {
        const time = this.copy;
        time.frame -= frames;
        return time;
    }
    toString() { return `[${this.description}]`; }
    withFrame(frame) {
        const time = this.copy;
        time.frame = frame;
        return time;
    }
    static fromArgs(frame = 0, fps = 1) {
        return new Time(frame, fps);
    }
    static fromSeconds(seconds = 0, fps = 1, rounding = '') {
        if (!Is.number(seconds) || seconds < 0)
            throw Errors.seconds;
        if (!Is.integer(fps) || fps < 1)
            throw Errors.fps;
        const rounded = roundWithMethod(seconds * fps, rounding);
        return this.fromArgs(rounded, fps);
    }
}

class TimeRange extends Time {
    constructor(frame = 0, fps = 1, frames = 1) {
        if (!(Is.integer(frames) && frames >= 0)) {
            throw Errors.argument + 'frames';
        }
        super(frame, fps);
        this.frames = frames;
    }
    get description() { return `${this.frame}-${this.frames}@${this.fps}`; }
    get end() { return this.frame + this.frames; }
    get endTime() { return Time.fromArgs(this.end, this.fps); }
    equalsTimeRange(timeRange) {
        const [range1, range2] = timeEqualizeRates(this, timeRange);
        return range1.frame === range2.frame && range1.frames === range2.frames;
    }
    get lengthSeconds() { return Number(this.frames) / Number(this.fps); }
    get position() { return Number(this.frame) / Number(this.frames); }
    get startTime() { return Time.fromArgs(this.frame, this.fps); }
    get copy() {
        return new TimeRange(this.frame, this.fps, this.frames);
    }
    scale(fps = 1, rounding = "") {
        if (this.fps === fps)
            return this.copy;
        const value = Number(this.frames) / (Number(this.fps) / Number(fps));
        const time = super.scale(fps, rounding);
        const frames = Math.max(1, roundWithMethod(value, rounding));
        return new TimeRange(time.frame, time.fps, frames);
    }
    intersects(timeRange) {
        const [range1, range2] = timeEqualizeRates(this, timeRange);
        if (range1.frame >= range2.end)
            return false;
        return range1.end > range2.frame;
    }
    intersectsTime(time) {
        const [time1, scaledTime] = timeEqualizeRates(this, time);
        const scaledRange = time1;
        return scaledTime.frame >= scaledRange.frame && scaledTime.frame < scaledRange.end;
    }
    minEndTime(endTime) {
        const [range, time] = timeEqualizeRates(this, endTime);
        range.frames = Math.min(range.frames, time.frame);
        return range;
    }
    withFrame(frame) {
        const range = this.copy;
        range.frame = frame;
        return range;
    }
    withFrames(frames) {
        const range = this.copy;
        range.frames = frames;
        return range;
    }
    static fromArgs(frame = 0, fps = 1, frames = 1) {
        return new TimeRange(frame, fps, frames);
    }
    static fromSeconds(start = 0, duration = 1) {
        return this.fromArgs(start, 1, duration);
    }
    static fromTime(time, frames = 1) {
        return this.fromArgs(time.frame, time.fps, frames);
    }
    static fromTimes(startTime, endTime) {
        const [time1, time2] = timeEqualizeRates(startTime, endTime);
        if (time2.frame <= time1.frame)
            throw Errors.argument;
        const frames = time2.frame - time1.frame;
        return this.fromArgs(time1.frame, time1.fps, frames);
    }
}

class TrackRange {
    constructor(first = 0, last = -1, type) {
        this.last = -1;
        this.first = 0;
        this.first = first;
        this.last = last;
        this.type = type;
    }
    get count() { return 1 + this.last - this.first; }
    get relative() { return this.last < 0; }
    equals(trackRange) {
        return this.last === trackRange.last && this.first === trackRange.first;
    }
    get tracks() {
        if (this.last < 0)
            return [];
        return Array(this.last - this.first + 1).fill(0).map((_, idx) => this.first + idx);
    }
    toString() { return `[${this.type || 'av'}-${this.first}-${this.last}]`; }
    withEnd(last) {
        return TrackRange.fromArgs(this.first, last, this.type);
    }
    withMax(max) { return this.withEnd(max + this.last); }
    static ofType(type, last = -1, first = 0) {
        return this.fromArgs(first, last, type);
    }
    static fromArgs(first = 0, last = -1, type) {
        return new TrackRange(first, last, type);
    }
}

class Action {
    constructor(object) {
        this.done = false;
        const { actions, mash, redoSelectedClips, redoSelectedEffects, type, undoSelectedClips, undoSelectedEffects, } = object;
        this.actions = actions;
        this.type = type;
        this.mash = mash;
        this.undoSelectedClips = undoSelectedClips;
        this.redoSelectedClips = redoSelectedClips;
        this.undoSelectedEffects = undoSelectedEffects;
        this.redoSelectedEffects = redoSelectedEffects;
    }
    get selectedClips() {
        if (this.done)
            return this.redoSelectedClips;
        return this.undoSelectedClips;
    }
    get selectedEffects() {
        if (this.done)
            return this.redoSelectedEffects;
        return this.undoSelectedEffects;
    }
    redo() {
        this.redoAction();
        this.done = true;
    }
    redoAction() {
        throw Errors.internal + 'redoAction';
    }
    undo() {
        this.undoAction();
        this.done = false;
    }
    undoAction() {
        throw Errors.internal + 'undoAction';
    }
}

class AddTrackAction extends Action {
    constructor(object) {
        super(object);
        const { trackType } = object;
        this.trackType = trackType;
    }
    redoAction() { this.mash.addTrack(this.trackType); }
    undoAction() { this.mash.removeTrack(this.trackType); }
}

class ChangeAction extends Action {
    constructor(object) {
        super(object);
        const { property, redoValue, target, undoValue } = object;
        this.property = property;
        this.redoValue = redoValue;
        this.target = target;
        this.undoValue = undoValue;
    }
    get redoValueNumeric() { return Number(this.redoValue); }
    get undoValueNumeric() { return Number(this.undoValue); }
    redoAction() {
        this.target[this.property] = this.redoValue;
    }
    undoAction() {
        this.target[this.property] = this.undoValue;
    }
    updateAction(value) {
        this.redoValue = value;
        this.redo();
    }
}

class FreezeAction extends Action {
    constructor(object) {
        super(object);
        const { frames, freezeClip, frozenClip, index, insertClip, trackClips } = object;
        this.frames = frames;
        this.freezeClip = freezeClip;
        this.frozenClip = frozenClip;
        this.index = index;
        this.insertClip = insertClip;
        this.trackClips = trackClips;
    }
    redoAction() {
        this.trackClips.splice(this.index, 0, this.insertClip, this.frozenClip);
        this.freezeClip.frames -= this.frames;
    }
    undoAction() {
        this.freezeClip.frames += this.frames;
        this.trackClips.splice(this.index, 2);
    }
}

class ChangeFramesAction extends ChangeAction {
    constructor(object) {
        super(object);
        this.clip = this.target;
    }
    redoAction() {
        this.mash.changeClipFrames(this.clip, this.redoValue);
    }
    undoAction() {
        this.mash.changeClipFrames(this.clip, this.undoValue);
    }
}

class ChangeTrimAction extends ChangeAction {
    constructor(object) {
        super(object);
        const { frames, target } = object;
        this.frames = frames;
        this.audibleClip = target;
    }
    redoAction() {
        this.mash.changeClipTrimAndFrames(this.audibleClip, this.redoValue, this.frames);
    }
    undoAction() {
        this.mash.changeClipTrimAndFrames(this.audibleClip, this.undoValue, this.frames);
    }
}

class AddEffectAction extends Action {
    constructor(object) {
        super(object);
        const { effect, effects, index } = object;
        this.effect = effect;
        this.effects = effects;
        this.index = index;
    }
    redoAction() { this.effects.splice(this.index, 0, this.effect); }
    undoAction() { this.effects.splice(this.index, 1); }
}

class AddClipToTrackAction extends AddTrackAction {
    constructor(object) {
        super(object);
        const { clip, createTracks, insertIndex, trackIndex } = object;
        this.clip = clip;
        this.createTracks = createTracks;
        this.insertIndex = insertIndex;
        this.trackIndex = trackIndex;
    }
    get clips() { return this.track.clips; }
    get track() { return this.mash[this.trackType][this.trackIndex]; }
    redoAction() {
        for (let i = 0; i < this.createTracks; i += 1) {
            super.redoAction();
        }
        this.mash.addClipsToTrack([this.clip], this.trackIndex, this.insertIndex);
    }
    undoAction() {
        this.mash.removeClipsFromTrack([this.clip]);
        for (let i = 0; i < this.createTracks; i += 1) {
            super.undoAction();
        }
    }
}

class MoveClipsAction extends Action {
    constructor(object) {
        super(object);
        const { clips, insertIndex, redoFrames, trackIndex, undoFrames, undoInsertIndex, undoTrackIndex } = object;
        this.clips = clips;
        this.insertIndex = insertIndex;
        this.redoFrames = redoFrames;
        this.trackIndex = trackIndex;
        this.undoFrames = undoFrames;
        this.undoInsertIndex = undoInsertIndex;
        this.undoTrackIndex = undoTrackIndex;
    }
    addClips(trackIndex, insertIndex) {
        this.mash.addClipsToTrack(this.clips, trackIndex, insertIndex);
    }
    setFrames(frames) {
        this.clips.forEach((clip, index) => { clip.frame = frames[index]; });
    }
    redoAction() {
        if (this.redoFrames)
            this.setFrames(this.redoFrames);
        this.addClips(this.trackIndex, this.insertIndex);
    }
    undoAction() {
        if (this.undoFrames)
            this.setFrames(this.undoFrames);
        this.addClips(this.undoTrackIndex, this.undoInsertIndex);
    }
}

class RemoveClipsAction extends Action {
    constructor(object) {
        super(object);
        const { clips, index, track } = object;
        this.clips = clips;
        this.index = index;
        this.track = track;
    }
    get trackIndex() { return this.track.index; }
    redoAction() {
        this.mash.removeClipsFromTrack(this.clips);
    }
    undoAction() {
        this.mash.addClipsToTrack(this.clips, this.trackIndex, this.index);
    }
}

class SplitAction extends Action {
    constructor(object) {
        super(object);
        const { index, insertClip, redoFrames, splitClip, trackClips, undoFrames } = object;
        this.index = index;
        this.insertClip = insertClip;
        this.redoFrames = redoFrames;
        this.splitClip = splitClip;
        this.trackClips = trackClips;
        this.undoFrames = undoFrames;
    }
    redoAction() {
        this.trackClips.splice(this.index, 0, this.insertClip);
        this.splitClip.frames = this.redoFrames;
    }
    undoAction() {
        this.splitClip.frames = this.undoFrames;
        this.trackClips.splice(this.index, 1);
    }
}

class MoveEffectsAction extends Action {
    constructor(object) {
        super(object);
        const { effects, redoEffects, undoEffects } = object;
        this.effects = effects;
        this.redoEffects = redoEffects;
        this.undoEffects = undoEffects;
    }
    redoAction() {
        this.effects.splice(0, this.effects.length, ...this.redoEffects);
    }
    undoAction() {
        this.effects.splice(0, this.effects.length, ...this.undoEffects);
    }
}

class Actions {
    constructor(object) {
        this.index = -1;
        this.instances = [];
        const { mash } = object;
        this.mash = mash;
    }
    get canRedo() { return this.index < this.instances.length - 1; }
    get canSave() { return this.canUndo; }
    get canUndo() { return this.index > -1; }
    get currentAction() { return this.instances[this.index]; }
    get currentActionLast() { return this.canUndo && !this.canRedo; }
    destroy() {
        this.index = -1;
        this.instances.splice(0, this.instances.length);
    }
    add(action) {
        const remove = this.instances.length - (this.index + 1);
        if (Is.positive(remove))
            this.instances.splice(this.index + 1, remove);
        this.instances.push(action);
    }
    redo() {
        this.index += 1;
        const action = this.currentAction;
        action.redo();
        return action;
    }
    save() {
        this.instances.splice(0, this.index + 1);
        this.index = -1;
    }
    undo() {
        const action = this.currentAction;
        this.index -= 1;
        action.undo();
        return action;
    }
}

const CacheKeyPrefix = 'cachekey';
class CacheClass {
    constructor() {
        this.cachedByKey = new Map();
        this.urlsByKey = new Map();
    }
    add(url, value) {
        // console.log(this.constructor.name, "add", url, value.constructor.name)
        const key = this.key(url);
        this.cachedByKey.set(key, value);
        this.urlsByKey.set(key, url);
    }
    cached(url) {
        if (!Is.populatedString(url))
            throw Errors.argument + 'url';
        return this.cachedByKey.has(this.key(url));
    }
    get(url) {
        return this.cachedByKey.get(this.key(url));
    }
    key(url) {
        if (!Is.populatedString(url))
            throw Errors.argument + 'url';
        return CacheKeyPrefix + url.replaceAll(/[^a-z0-9]/gi, '');
    }
    remove(url) {
        // console.log(this.constructor.name, "remove", url)
        const key = this.key(url);
        this.cachedByKey.delete(key);
        this.urlsByKey.delete(key);
    }
}
const Cache = new CacheClass();

const AudibleSampleRate = 44100;
const AudibleChannels = 2;
class AudibleContext {
    get context() {
        if (!this.__context) {
            const Klass = AudioContext || window.webkitAudioContext;
            if (!Klass)
                throw Errors.audibleContext;
            // console.log("AudibleContext context", Klass.name)
            this.__context = new Klass();
        }
        return this.__context;
    }
    createBuffer(seconds) {
        const length = AudibleSampleRate * seconds;
        // console.log(this.constructor.name, "createBuffer", length)
        return this.context.createBuffer(AudibleChannels, length, AudibleSampleRate);
    }
    createBufferSource() { return this.context.createBufferSource(); }
    createGain() { return this.context.createGain(); }
    decode(buffer) {
        return new Promise((resolve, reject) => (this.context.decodeAudioData(buffer, audioData => resolve(audioData), error => reject(error))));
    }
    get destination() { return this.context.destination; }
    get time() { return Time.fromSeconds(this.currentTime); }
    get currentTime() { return this.context.currentTime; }
}

const $canvas = 'canvas';
const $2d = '2d';
const Point0 = { x: 0, y: 0 };
class VisibleContext {
    constructor(object = {}) {
        const { context2d } = object;
        // console.trace("VisibleContext", "constructor", context2d)
        if (context2d)
            this._context2d = context2d;
    }
    get alpha() { return this.context2d.globalAlpha; }
    set alpha(value) { this.context2d.globalAlpha = value; }
    get canvas() { return this.context2d.canvas; }
    set canvas(value) {
        const { canvas } = this;
        const context2d = value.getContext("2d");
        if (!context2d)
            throw Errors.invalid.canvas;
        this.context2d = context2d;
        // have both the old and new canvas broadcast event
        this.emit(exports.EventType.Canvas, {}, canvas);
        this.emit(exports.EventType.Canvas);
    }
    clear() {
        return this.clearSize(this.size);
    }
    clearSize(size) {
        return this.clearRect({ ...Point0, ...size });
    }
    clearRect(rect) {
        const { x, y, width, height } = rect;
        this.context2d.clearRect(x, y, width, height);
        return this;
    }
    get composite() { return this.context2d.globalCompositeOperation; }
    set composite(value) { this.context2d.globalCompositeOperation = value; }
    get context2d() {
        if (!this._context2d) {
            // console.trace(this.constructor.name, "get context2d creating canvas")
            const canvas = globalThis.document.createElement($canvas);
            const context = canvas.getContext($2d);
            if (!context)
                throw Errors.internal;
            this._context2d = context;
        }
        return this._context2d;
    }
    set context2d(value) {
        // console.log(this.constructor.name, "set context2d", value)
        this._context2d = value;
    }
    get dataUrl() { return this.canvas.toDataURL(); }
    draw(source) {
        return this.drawAtPoint(source, Point0);
    }
    drawAtPoint(source, point) {
        const { x, y } = point;
        this.context2d.drawImage(source, x, y);
        return this;
    }
    drawFill(fill) {
        return this.drawFillToSize(fill, this.size);
    }
    drawFillInRect(fill, rect) {
        const { x, y, width, height } = rect;
        const fillOriginal = this.fill;
        this.fill = fill;
        this.context2d.fillRect(x, y, width, height);
        this.fill = fillOriginal;
        return this;
    }
    drawFillToSize(fill, size) {
        return this.drawFillInRect(fill, { ...Point0, ...size });
    }
    drawImageData(data) {
        return this.drawImageDataAtPoint(data, Point0);
    }
    drawImageDataAtPoint(data, point) {
        const { x, y } = point;
        this.context2d.putImageData(data, x, y);
        return this;
    }
    drawInRect(source, rect) {
        const { x, y, width, height } = rect;
        this.context2d.drawImage(source, x, y, width, height);
        return this;
    }
    drawInRectFromRect(source, inRect, fromRect) {
        const { x: xIn, y: yIn, width: wIn, height: hIn } = inRect;
        const { x, y, width: w, height: h } = fromRect;
        const { width: sourceWidth, height: sourceHeight } = source;
        if (xIn + wIn > sourceWidth || yIn + hIn > sourceHeight)
            throw Errors.eval.sourceRect + JSON.stringify(inRect) + ' ' + sourceWidth + 'x' + sourceHeight;
        this.context2d.drawImage(source, xIn, yIn, wIn, hIn, x, y, w, h);
        return this;
    }
    drawInRectFromSize(source, rect, size) {
        return this.drawInRectFromRect(source, rect, { ...Point0, ...size });
    }
    drawInSizeFromSize(source, inSize, fromSize) {
        const inRect = { ...Point0, ...inSize };
        const fromRect = { ...Point0, ...fromSize };
        return this.drawInRectFromRect(source, inRect, fromRect);
    }
    drawText(text, style) {
        return this.drawTextAtPoint(text, style, Point0);
    }
    drawTextAtPoint(text, style, point) {
        const { x, y } = point;
        const { height, family, color, shadow, shadowPoint } = style;
        const fillOriginal = this.fill;
        const fontOriginal = this.font;
        const shadowOriginal = this.shadow;
        const shadowPointOriginal = this.shadowPoint;
        if (shadow) {
            this.shadow = shadow;
            if (shadowPoint)
                this.shadowPoint = shadowPoint;
        }
        this.font = `${height}px "${family}"`;
        this.fill = color;
        this.context2d.fillText(text, x, y + height);
        this.font = fontOriginal;
        this.fill = fillOriginal;
        if (shadow) {
            this.shadow = shadowOriginal;
            if (shadowPoint)
                this.shadowPoint = shadowPointOriginal;
        }
        return this;
    }
    drawToSize(source, size) {
        return this.drawInRect(source, { ...Point0, ...size });
    }
    drawWithAlpha(source, alpha) {
        const original = this.alpha;
        this.alpha = alpha;
        const result = this.draw(source);
        this.alpha = original;
        return result;
    }
    drawWithComposite(source, composite) {
        const original = this.composite;
        this.composite = composite;
        const result = this.draw(source);
        this.composite = original;
        return result;
    }
    emit(type, detail = {}, target) {
        const element = target ? target : this.canvas;
        const event = { detail };
        // console.log("emit", type, this.canvas)
        element.dispatchEvent(new CustomEvent(type, event));
    }
    get fill() { return String(this.context2d.fillStyle); }
    set fill(value) { this.context2d.fillStyle = value; }
    get font() { return this.context2d.font; }
    set font(value) { this.context2d.font = value; }
    get imageData() { return this.imageDataFromSize(this.size); }
    get imageDataFresh() {
        const { width, height } = this.size;
        return this.context2d.createImageData(width, height);
    }
    imageDataFromRect(rect) {
        const { x, y, width, height } = rect;
        return this.context2d.getImageData(x, y, width, height);
    }
    imageDataFromSize(size) {
        return this.imageDataFromRect({ ...Point0, ...size });
    }
    get drawingSource() { return this.canvas; }
    get shadow() { return this.context2d.shadowColor; }
    set shadow(value) { this.context2d.shadowColor = value; }
    get shadowPoint() {
        return { x: this.context2d.shadowOffsetX, y: this.context2d.shadowOffsetY };
    }
    set shadowPoint(point) {
        this.context2d.shadowOffsetX = point.x;
        this.context2d.shadowOffsetY = point.y;
    }
    get size() { return { width: this.canvas.width, height: this.canvas.height }; }
    set size(value) {
        const { width, height } = value;
        if (Is.aboveZero(width))
            this.canvas.width = width;
        if (Is.aboveZero(height))
            this.canvas.height = height;
    }
}

const ContextTypes = ["audible", "visible"];
const ContextType = Object.fromEntries(ContextTypes.map(type => [type, type]));
class ContextFactory {
    audible() { return new AudibleContext(); }
    fromCanvas(canvas) {
        const context = this.visible();
        context.canvas = canvas;
        return context;
    }
    fromContext2D(context2d) {
        return new VisibleContext({ context2d });
    }
    toSize(size) {
        const context = this.visible();
        context.size = size;
        return context;
    }
    get type() { return ContextType; }
    get types() { return ContextTypes; }
    visible() { return new VisibleContext(); }
}
const ContextFactoryInstance = new ContextFactory();

class Processor {
    process(_url, _buffer) {
        return Promise.resolve();
    }
}

class AudioProcessor extends Processor {
    constructor(object) {
        super();
        if (object && object.audibleContext) {
            this._audibleContext = object.audibleContext;
        }
        else
            this._audibleContext = ContextFactoryInstance.audible();
    }
    get audibleContext() { return this._audibleContext; }
    set audibleContext(value) { this._audibleContext = value; }
    process(_url, buffer) {
        return this.audibleContext.decode(buffer);
    }
}

class FontProcessor extends Processor {
    process(url, buffer) {
        const family = Cache.key(url);
        const face = new FontFace(family, buffer);
        const promise = face.load().then(() => {
            document.fonts.add(face);
            return { family };
        });
        return promise;
    }
}

class ModuleProcessor extends Processor {
    process(_url, _buffer) {
        return Promise.resolve();
    }
}

class Loader {
    async loadUrl(url) {
        if (Cache.cached(url)) {
            const promiseOrCached = Cache.get(url);
            if (promiseOrCached instanceof Promise)
                return promiseOrCached;
            return Promise.resolve();
        }
        const promise = this.requestUrl(url);
        Cache.add(url, promise);
        const processed = await promise;
        Cache.add(url, processed);
        return processed;
    }
    requestUrl(_url) { return Promise.resolve(); }
}

const classes$2 = {
    Audio: AudioProcessor,
    Font: FontProcessor,
    Module: ModuleProcessor,
};
class ProcessorClass {
    audio(object) {
        return new classes$2.Audio(object);
    }
    font() { return new classes$2.Font(); }
    install(type, loader) {
        classes$2[Capitalize(type)] = loader;
    }
    module() { return new classes$2.Module(); }
}
const ProcessorFactory = new ProcessorClass();

class AudioLoader extends Loader {
    constructor(object) {
        super();
        this.type = exports.LoadType.Audio;
        if (object && object.audibleContext) {
            this._audibleContext = object.audibleContext;
        }
        else
            this._audibleContext = ContextFactoryInstance.audible();
    }
    get audibleContext() { return this._audibleContext; }
    set audibleContext(value) { this._audibleContext = value; }
    async requestUrl(url) {
        return fetch(url).then(response => {
            return response.arrayBuffer();
        }).then(loaded => {
            const options = { audibleContext: this.audibleContext };
            const processor = ProcessorFactory.audio(options);
            return processor.process(url, loaded);
        });
    }
}

class FontLoader extends Loader {
    constructor() {
        super(...arguments);
        this.type = exports.LoadType.Font;
    }
    requestUrl(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => ProcessorFactory.font().process(url, buffer));
    }
}

class ImageLoader extends Loader {
    constructor() {
        super(...arguments);
        this.type = exports.LoadType.Image;
    }
    requestUrl(url) {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = url;
        return image.decode().then(() => Promise.resolve(image));
    }
}

class ModuleLoader extends Loader {
    constructor() {
        super(...arguments);
        this.type = exports.LoadType.Module;
    }
    async requestUrl(url) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(url)); }); }
}

class InstanceClass {
    constructor(...args) {
        const [object] = args;
        if (!Is.populatedObject(object))
            throw Errors.invalid.object + 'InstanceClass';
        const { definition, id, label } = object;
        if (!definition)
            throw Errors.invalid.definition.object + 'InstanceClass';
        this.definition = definition;
        if (id && id !== definition.id)
            this._id = id;
        if (label && label !== definition.label)
            this._label = label;
    }
    get copy() {
        return this.definition.instanceFromObject(this.toJSON());
    }
    get definitions() { return [this.definition]; }
    definitionTime(quantize, time) {
        return time.scaleToFps(quantize); // may have fps higher than quantize and time.fps
    }
    get id() { return this._id || this.definition.id; }
    get identifier() { return this._identifier || Id(); }
    get label() { return this._label || this.definition.label || this.id; }
    set label(value) { this._label = value; }
    load(quantize, start, end) {
        const startTime = this.definitionTime(quantize, start);
        const endTime = end ? this.definitionTime(quantize, end) : end;
        return this.definition.load(startTime, endTime);
    }
    loaded(quantize, start, end) {
        const startTime = this.definitionTime(quantize, start);
        const endTime = end ? this.definitionTime(quantize, end) : end;
        return this.definition.loaded(startTime, endTime);
    }
    get propertyNames() {
        return this.definition.properties.map(property => property.name);
    }
    get propertyValues() {
        return Object.fromEntries(this.definition.properties.map(property => {
            return [property.name, this.value(property.name)];
        }));
    }
    get type() { return this.definition.type; }
    toJSON() { return this.propertyValues; }
    value(key) {
        const value = this[key];
        if (typeof value === "undefined")
            throw Errors.property + "value " + this.propertyNames.includes(key) + " " + this[key];
        return value;
    }
}

class DefinitionClass {
    constructor(...args) {
        this.properties = [];
        this.retain = false;
        const [object] = args;
        const { id, label, icon } = object;
        if (!(id && Is.populatedString(id)))
            throw Errors.invalid.definition.id + JSON.stringify(object);
        this.id = id;
        if (label)
            this.label = label;
        if (icon)
            this.icon = icon;
        this.properties.push(new Property({ name: "label", type: exports.DataType.String, value: "" }));
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new InstanceClass({ ...this.instanceObject, ...object });
        return instance;
    }
    get instanceObject() {
        const object = {};
        object.definition = this;
        this.properties.forEach(property => {
            object[property.name] = property.value;
        });
        return object;
    }
    load(_start, _end) { return Promise.resolve(); }
    loaded(_start, _end) { return true; }
    loadedAudible(_time) { }
    loadedVisible(_time) { }
    get propertiesModular() { return this.properties.filter(property => property.type.modular); }
    property(name) {
        return this.properties.find(property => property.name === name);
    }
    toJSON() {
        const object = { id: this.id, type: this.type };
        if (this.icon)
            object.icon = this.icon;
        if (this.label)
            object.label = this.label;
        return object;
    }
    unload(_times = []) { }
    value(name) {
        const property = this.property(name);
        if (!property)
            return;
        return property.value;
    }
}

const AudibleGainDelimiter = ',';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function AudibleMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.audible = true;
            this.gain = Default.instance.audio.gain;
            this.gainPairs = [];
            this.trim = Default.instance.audio.trim;
            const [object] = args;
            const { gain, trim } = object;
            if (typeof gain !== "undefined") {
                if (typeof gain === "string") {
                    if (gain.includes(AudibleGainDelimiter)) {
                        const floats = gain.split(AudibleGainDelimiter).map(string => parseFloat(string));
                        const z = floats.length / 2;
                        for (let i = 0; i < z; i += 1) {
                            this.gainPairs.push([floats[i * 2], floats[i * 2 + 1]]);
                        }
                        this.gain = -1;
                    }
                    else
                        this.gain = Number(gain);
                }
                else
                    this.gain = gain;
            }
            // cnsole.log("AudibleMixin gain", typeof gain, gain, this.gain)
            if (typeof trim !== "undefined" && Is.integer(trim))
                this.trim = trim;
        }
        definitionTime(quantize, time) {
            const scaledTime = super.definitionTime(quantize, time);
            if (!Is.aboveZero(this.trim))
                return scaledTime;
            const trimTime = this.trimTime(quantize).scale(scaledTime.fps);
            return scaledTime.withFrame(scaledTime.frame + trimTime.frame);
        }
        get muted() {
            if (this.gain === 0)
                return true;
            if (Is.positive(this.gain))
                return false;
            return this.gainPairs === [[0, 0], [1, 0]];
        }
        maxFrames(quantize, trim) {
            const space = trim ? trim : this.trim;
            return Math.floor(this.definition.duration * quantize) - space;
        }
        toJSON() {
            const object = super.toJSON();
            if (this.trim !== Default.instance.audio.trim)
                object.trim = this.trim;
            if (this.gain !== Default.instance.audio.gain)
                object.gain = this.gain;
            return object;
        }
        trimTime(quantize) { return Time.fromArgs(this.trim, quantize); }
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ClipMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.audible = false;
            this.frame = 0;
            this.frames = -1;
            this.track = -1;
            this.trackType = exports.TrackType.Video;
            this.visible = false;
            const [object] = args;
            const { frame, frames, track } = object;
            if (typeof frame !== "undefined" && Is.positive(frame))
                this.frame = frame;
            if (frames && Is.aboveZero(frames))
                this.frames = frames;
            if (typeof track !== "undefined")
                this.track = track;
        }
        definitionTime(quantize, time) {
            const scaledTime = super.definitionTime(quantize, time);
            const startTime = this.time(quantize).scale(scaledTime.fps);
            const endTime = this.endTime(quantize).scale(scaledTime.fps);
            const frame = Math.max(Math.min(time.frame, endTime.frame), startTime.frame);
            return scaledTime.withFrame(frame - startTime.frame);
        }
        get endFrame() { return this.frame + this.frames; }
        endTime(quantize) {
            return Time.fromArgs(this.endFrame, quantize);
        }
        maxFrames(_quantize, _trim) { return 0; }
        time(quantize) { return Time.fromArgs(this.frame, quantize); }
        timeRange(quantize) {
            return TimeRange.fromArgs(this.frame, quantize, this.frames);
        }
        timeRangeRelative(time, quantize) {
            const range = this.timeRange(quantize).scale(time.fps);
            const frame = Math.max(0, time.frame - range.frame);
            return range.withFrame(frame);
        }
        toJSON() {
            const object = super.toJSON();
            object.id = this.id;
            return object;
        }
    };
}

const AudioWithClip = ClipMixin(InstanceClass);
const AudioWithAudible = AudibleMixin(AudioWithClip);
class AudioClass extends AudioWithAudible {
    constructor() {
        super(...arguments);
        this.trackType = exports.TrackType.Audio;
    }
}

const ClipPropertyObjects = [
    { name: "frame", type: exports.DataType.Integer, value: 0 },
    { name: "frames", type: exports.DataType.Integer, value: -1 },
    { name: "track", type: exports.DataType.Integer, value: -1 },
];
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ClipDefinitionMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.audible = false;
            this.visible = false;
            const properties = ClipPropertyObjects.map(object => new Property(object));
            this.properties.push(...properties);
        }
        get duration() {
            if (!this._duration) {
                const object = Default.definition;
                this._duration = Number(object[this.type].duration);
            }
            return this._duration;
        }
        set duration(value) { this._duration = value; }
    };
}

const classes$1 = {
    Audio: AudioLoader,
    Font: FontLoader,
    Image: ImageLoader,
    Module: ModuleLoader,
};
class LoaderClass {
    audio(object) {
        return new classes$1.Audio(object);
    }
    font() { return new classes$1.Font(); }
    image() { return new classes$1.Image(); }
    install(type, loader) {
        classes$1[Capitalize(type)] = loader;
    }
    module() { return new classes$1.Module(); }
}
const LoaderFactory = new LoaderClass();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function AudibleDefinitionMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.audible = true;
            this.loops = false;
            const [object] = args;
            const { loops, duration, url, audio, source, waveform } = object;
            if (!duration)
                throw Errors.invalid.definition.duration;
            this.duration = Number(duration);
            const urlAudible = audio || url || source || "";
            if (!urlAudible)
                throw Errors.invalid.definition.audio;
            this.urlAudible = urlAudible;
            if (loops)
                this.loops = !!loops;
            if (source)
                this.source = source;
            if (waveform)
                this.waveform = waveform;
            this.properties.push(new Property({ name: "gain", type: exports.DataType.Number, value: 1.0 }));
            this.properties.push(new Property({ name: "trim", type: exports.DataType.Integer, value: 0 }));
        }
        load(start, end) {
            const promises = [super.load(start, end)];
            if (end) {
                if (Cache.cached(this.urlAudible)) {
                    const cached = Cache.get(this.urlAudible);
                    if (cached instanceof Promise)
                        promises.push(cached);
                }
                else
                    promises.push(LoaderFactory.audio().loadUrl(this.urlAudible));
            }
            return Promise.all(promises).then();
        }
        loaded(start, end) {
            return super.loaded(start, end) && Cache.cached(this.urlAudible);
        }
        loadedAudible(_time) {
            return Cache.get(this.urlAudible);
        }
        toJSON() {
            const object = super.toJSON();
            object.duration = this.duration;
            object.audio = this.urlAudible;
            if (this.loops)
                object.loops = true;
            if (this.source)
                object.source = this.source;
            if (this.waveform)
                object.waveform = this.waveform;
            return object;
        }
        unload(times = []) {
            super.unload(times);
            if (times.length && times.some(maybePair => maybePair.length === 2)) {
                return; // don't unload if any times indicate audio needed
            }
            if (!Cache.cached(this.urlAudible))
                return;
            Cache.remove(this.urlAudible);
        }
    };
}

const definitionsMap = new Map();
const DefinitionsByType = new Map();
const definitionsByType = (type) => {
    const list = DefinitionsByType.get(type);
    if (list)
        return list;
    const definitionsList = [];
    DefinitionsByType.set(type, definitionsList);
    return definitionsList;
};
const definitionsClear = () => { definitionsMap.clear(); };
const definitionsFont = definitionsByType(exports.DefinitionType.Font);
const definitionsFromId = (id) => {
    if (!definitionsInstalled(id)) {
        console.trace(id);
        throw Errors.unknown.definition + 'definitionsFromId ' + id;
    }
    const definition = definitionsMap.get(id);
    if (!definition)
        throw Errors.internal;
    return definition;
};
const definitionsInstall = (definition) => {
    const { type, id } = definition;
    // console.log("definitionsInstall", type, id)
    definitionsMap.set(id, definition);
    definitionsByType(type).push(definition);
};
const definitionsInstalled = (id) => definitionsMap.has(id);
const definitionsMerger = definitionsByType(exports.DefinitionType.Merger);
const definitionsScaler = definitionsByType(exports.DefinitionType.Scaler);
const definitionsUninstall = (id) => {
    if (!definitionsInstalled(id)) {
        console.log("definitionsUninstall", id);
        return;
    }
    const definition = definitionsFromId(id);
    definitionsMap.delete(id);
    const { type } = definition;
    const definitions = definitionsByType(type);
    const index = definitions.indexOf(definition);
    if (index < 0)
        throw Errors.internal + 'definitionsUninstall';
    definitions.splice(index, 1);
    // console.log("uninstalled", id)
};
const Definitions = {
    byType: definitionsByType,
    clear: definitionsClear,
    font: definitionsFont,
    fromId: definitionsFromId,
    install: definitionsInstall,
    installed: definitionsInstalled,
    map: definitionsMap,
    merger: definitionsMerger,
    scaler: definitionsScaler,
    uninstall: definitionsUninstall,
};

const AudioDefinitionWithClip = ClipDefinitionMixin(DefinitionClass);
const AudioDefinitionWithAudible = AudibleDefinitionMixin(AudioDefinitionWithClip);
class AudioDefinitionClass extends AudioDefinitionWithAudible {
    constructor(...args) {
        super(...args);
        this.trackType = exports.TrackType.Audio;
        this.type = exports.DefinitionType.Audio;
        Definitions.install(this);
    }
    get instance() { return this.instanceFromObject(this.instanceObject); }
    instanceFromObject(object) {
        // console.log("instanceFromObject", object)
        const audioObject = { ...this.instanceObject, ...object };
        // console.log("instanceFromObject", typeof audioObject.gain, audioObject.gain, object)
        return new AudioClass(audioObject);
    }
}

const Factories = {};

/**
 * @internal
 */
const audioDefinition = (object) => {
    const { id } = object;
    if (!id)
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    return new AudioDefinitionClass(object);
};
/**
 * @internal
 */
const audioDefinitionFromId = (id) => {
    return audioDefinition({ id });
};
/**
 * @internal
 */
const audioInstance = (object) => {
    const definition = audioDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
/**
 * @internal
 */
const audioFromId = (id) => {
    return audioInstance({ id });
};
/**
 * @internal
 */
const audioInitialize = () => { };
/**
 * @internal
 */
const audioDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return audioDefinition(object);
};
const AudioFactoryImplementation = {
    define: audioDefine,
    definition: audioDefinition,
    definitionFromId: audioDefinitionFromId,
    fromId: audioFromId,
    initialize: audioInitialize,
    instance: audioInstance,
};
Factories.audio = AudioFactoryImplementation;

class FilterClass extends InstanceClass {
    constructor(...args) {
        super(...args);
        this.parameters = [];
        const [object] = args;
        if (!Is.populatedObject(object))
            throw Errors.invalid.object + 'filter';
        const { parameters } = object;
        if (parameters) {
            this.parameters.push(...parameters.map(parameter => new Parameter(parameter)));
        }
    }
    drawFilter(evaluator) {
        this.definition.scopeSet(evaluator);
        return this.definition.draw(evaluator, this.evaluated(evaluator));
    }
    evaluated(evaluator) {
        const evaluated = {};
        const parameters = [...this.parameters];
        // console.log(this.constructor.name, "evaluated", this.id, parameters.map(p => p.name))
        this.definition.parameters.forEach(parameter => {
            if (parameters.find(p => p.name === parameter.name))
                return;
            // console.log(this.constructor.name, "evaluated", this.id, "adding", parameter.name)
            parameters.push(parameter);
        });
        if (!Is.populatedArray(parameters))
            return evaluated;
        parameters.forEach(parameter => {
            const { name, value } = parameter;
            if (!Is.populatedString(name))
                return;
            const evaluatedValue = evaluator.evaluate(value);
            evaluated[name] = evaluatedValue;
            evaluator.set(name, evaluatedValue);
            return `${name}=>${evaluatedValue}`;
        });
        return evaluated;
    }
    toJSON() {
        const object = { id: this.id };
        if (this.parameters.length)
            object.parameters = this.parameters;
        return object;
    }
}

class FilterDefinitionClass extends DefinitionClass {
    constructor(...args) {
        super(...args);
        this.parameters = [];
        this.type = exports.DefinitionType.Filter;
        Definitions.install(this);
    }
    draw(_evaluator, _evaluated) {
        throw Errors.unimplemented;
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new FilterClass({ ...this.instanceObject, ...object });
        return instance;
    }
    scopeSet(_evaluator) { }
}

class BlendFilter extends FilterDefinitionClass {
    // eslint-disable-next-line camelcase
    draw(evaluator, evaluated) {
        const { context, mergeContext } = evaluator;
        if (typeof mergeContext === "undefined")
            throw Errors.internal + 'BlendFilter mergeContext';
        const modes = TypesInstance.propertyType(exports.DataType.Mode).values;
        if (typeof modes === "undefined")
            throw Errors.unknown.mode;
        const mode = modes.find(object => object.id === evaluated.all_mode);
        if (typeof mode === "undefined")
            throw Errors.unknown.mode;
        const { identifier } = mode;
        mergeContext.drawWithComposite(context.drawingSource, identifier);
        return mergeContext;
    }
}

class ChromaKeyFilter extends FilterDefinitionClass {
    constructor() {
        super(...arguments);
        // id = 'chromakey'
        this.parameters = [
            new Parameter({ name: "color", value: "color" }),
            new Parameter({ name: "similarity", value: "similarity" }),
            new Parameter({ name: "blend", value: "blend" }),
        ];
    }
    draw(evaluator, evaluated) {
        const { context } = evaluator;
        const { width, height } = context.size;
        const { accurate } = evaluated;
        const similarity = Number(evaluated.similarity);
        const blend = Number(evaluated.blend);
        const color = String(evaluated.color);
        const components = color.substr(4, color.length - 5).split(',');
        const colors = components.map(f => Number(f));
        const rgb = { r: colors[0], g: colors[1], b: colors[2] };
        const yuv = Color.rgb2yuv(rgb);
        const frame = context.imageData;
        const pixelsRgb = frame.data;
        const pixelsYuv = accurate ? (this.yuvsFromPixelsAccurate(pixelsRgb, width, height) // slow!
        ) : this.yuvsFromPixels(pixelsRgb);
        let offset = 0;
        pixelsYuv.reverse().forEach(matrix => {
            pixelsRgb[offset + 3] = Color.yuvBlend(matrix, yuv, similarity, blend);
            offset += 4;
        });
        context.drawImageData(frame);
        return context;
    }
    yuvsFromPixels(pixels) {
        const array = [];
        for (let index = pixels.length / 4 - 1; index > 0; index -= 1) {
            array.push([Color.rgb2yuv(Pixel.rgbaAtIndex(index * 4, pixels))]);
        }
        return array;
    }
    yuvsFromPixelsAccurate(pixels, width, height) {
        const array = [];
        for (let index = pixels.length / 4 - 1; index > 0; index -= 1) {
            const size = { width, height };
            array.push(Pixel.neighboringRgbas(index * 4, pixels, size).map(rgb => Color.rgb2yuv(rgb)));
        }
        return array;
    }
}

class ColorFilter extends FilterDefinitionClass {
    constructor() {
        super(...arguments);
        // id = 'color'
        this.parameters = [
            new Parameter({ name: "color", value: "color" }),
            new Parameter({ name: "size", value: "mm_dimensions" }),
            new Parameter({ name: "duration", value: "mm_duration" }),
            new Parameter({ name: "rate", value: "mm_fps" }),
        ];
    }
    draw(evaluator, evaluated) {
        const { context } = evaluator;
        const { color } = evaluated;
        if (!isPopulatedString(color))
            return context;
        context.drawFill(Pixel.color(color));
        return context;
    }
}

class ColorChannelMixerFilter extends FilterDefinitionClass {
    draw(evaluator, evaluated) {
        const map = Object.fromEntries(Object.entries(evaluated).map(entry => {
            const [key, value] = entry;
            return [key, Number(value)];
        }));
        const { context } = evaluator;
        const rgbas = 'rgba'.split('');
        rgbas.forEach(first => {
            rgbas.forEach(second => {
                const key = `${first}${second}`;
                if (map[key] === null)
                    map[key] = first === second ? 1.0 : 0.0;
            });
        });
        const { imageData } = context;
        const { data } = imageData;
        data.forEach((r, i) => {
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            data[i] = r * map.rr + g * map.rg + b * map.rb + a * map.ra;
            data[i + 1] = r * map.gr + g * map.gg + b * map.gb + a * map.ga;
            data[i + 2] = r * map.br + g * map.bg + b * map.bb + a * map.ba;
            data[i + 3] = r * map.ar + g * map.ag + b * map.ab + a * map.aa;
        });
        context.drawImageData(imageData);
        return context;
    }
}

const RBGA = 'rgba';
const parse = (evaluated) => {
    const result = { bias: {}, rdiv: {}, matrix: {} };
    RBGA.split('').forEach((channel, index) => {
        const matrixString = evaluated[`${index}m`];
        const matrix = matrixString.split(' ').map((i) => parseInt(i));
        result.matrix[channel] = matrix;
        result.rdiv[channel] = evaluated[`${index}rdiv`] || 1;
        if (String(result.rdiv[channel]).includes('/')) {
            const array = String(result.rdiv[channel]).split('/');
            result.rdiv[channel] = parseFloat(array[0]) / parseFloat(array[1]);
        }
        else
            result.rdiv[channel] = parseFloat(String(result.rdiv[channel]));
        result.bias[channel] = evaluated[`${index}bias`] || 0;
    });
    // console.log(ConvolutionFilter.name, "parse", evaluated, result)
    return result;
};
class ConvolutionFilter extends FilterDefinitionClass {
    draw(evaluator, evaluated) {
        const options = parse(evaluated);
        const { context } = evaluator;
        const { size } = context;
        const { width, height } = size;
        const input = context.imageData;
        // TODO: figure out if we actually need fresh data??
        const output = context.imageDataFresh;
        const inputData = input.data;
        const outputData = output.data;
        const area = width * height;
        for (let pixel = 0; pixel < area; pixel += 1) {
            const rgbas = pixelNeighboringRgbas(pixel, inputData, size);
            RBGA.split('').forEach((channel, index) => {
                const rdiv = options.rdiv[channel];
                const matrix = options.matrix[channel];
                const bias = options.bias[channel];
                let sum = 0;
                for (let y = 0; y < 9; y += 1)
                    sum += rgbas[y][channel] * matrix[y];
                sum = Math.floor(sum * rdiv + bias + 0.5);
                outputData[pixel * 4 + index] = sum;
            });
        }
        context.drawImageData(output);
        return context;
    }
}

class CropFilter extends FilterDefinitionClass {
    draw(evaluator, evaluated) {
        const { context } = evaluator;
        const x = evaluated.x || 0;
        const y = evaluated.y || 0;
        const inSize = evaluator.inputSize;
        let width = evaluated.w || evaluated.out_w || 0;
        let height = evaluated.h || evaluated.out_h || 0;
        // console.log(this.constructor.name, width, height, evaluated)
        if (width + height < 2)
            throw Errors.eval.outputSize;
        if (width === -1)
            width = inSize.width * (height / inSize.height);
        if (height === -1)
            height = inSize.height * (width / inSize.width);
        const fromSize = { width, height };
        const inRect = { x, y, ...fromSize };
        const drawing = ContextFactoryInstance.toSize(fromSize);
        // console.log(this.constructor.name, "draw", inRect, fromSize)
        drawing.drawInRectFromSize(context.drawingSource, inRect, fromSize);
        return drawing;
    }
    // id = 'crop'
    scopeSet(evaluator) {
        evaluator.setInputSize(evaluator.context.size);
        evaluator.initialize("x", '((in_w - out_w) / 2)');
        evaluator.initialize("y", '((in_h - out_h) / 2)');
    }
}

class DrawBoxFilter extends FilterDefinitionClass {
    draw(evaluator, evaluated) {
        const { context } = evaluator;
        const color = isPopulatedString(evaluated.color) ? evaluated.color : 'black';
        const x = evaluated.x || 0;
        const y = evaluated.y || 0;
        const width = evaluated.width || context.size.width;
        const height = evaluated.height || context.size.height;
        context.drawFillInRect(Pixel.color(color), { x, y, width, height });
        return context;
    }
}

const label$j = "Baloo Tammudu 2";
const id$j = "com.moviemasher.font.default";
const type$j = "font";
const source = "Assets/BlackoutTwoAM.ttf";
var fontDefaultJson = {
  label: label$j,
  id: id$j,
  type: type$j,
  source: source
};

class FontClass extends InstanceClass {
}

class FontDefinitionClass extends DefinitionClass {
    constructor(...args) {
        super(...args);
        this.retain = true;
        this.type = exports.DefinitionType.Font;
        const [object] = args;
        const { source } = object;
        if (!source)
            throw Errors.invalid.definition.source + JSON.stringify(object);
        this.source = source;
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new FontClass({ ...this.instanceObject, ...object });
        return instance;
    }
    load(start, end) {
        const promises = [super.load(start, end)];
        if (Cache.cached(this.source)) {
            const cached = Cache.get(this.source);
            if (cached instanceof Promise)
                promises.push(cached);
        }
        else
            promises.push(LoaderFactory.font().loadUrl(this.source));
        return Promise.all(promises).then();
    }
    loaded(start, end) {
        return super.loaded(start, end) && Cache.cached(this.source);
    }
    loadedVisible(_time) { return Cache.get(this.source); }
    toJSON() {
        return { ...super.toJSON(), source: this.source };
    }
}

const fontDefaultId = "com.moviemasher.font.default";
const fontDefinition = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) ? id : fontDefaultId;
    if (!Definitions.installed(idString)) {
        new FontDefinitionClass({ ...object, type: exports.DefinitionType.Font, id: idString });
    }
    return Definitions.fromId(idString);
};
const fontDefinitionFromId = (id) => {
    return fontDefinition({ id });
};
const fontInstance = (object) => {
    return fontDefinition(object).instanceFromObject(object);
};
const fontFromId = (id) => {
    return fontInstance({ id });
};
const fontInitialize = () => {
    fontDefinition(fontDefaultJson);
};
const fontDefine = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) ? id : fontDefaultId;
    Definitions.uninstall(idString);
    return fontDefinition(object);
};
const FontFactoryImplementation = {
    define: fontDefine,
    definition: fontDefinition,
    definitionFromId: fontDefinitionFromId,
    fromId: fontFromId,
    initialize: fontInitialize,
    instance: fontInstance,
};
Factories.font = FontFactoryImplementation;

const mmFontFile = (id) => {
    if (!Is.populatedString(id))
        throw Errors.id;
    return FontFactoryImplementation.definitionFromId(id).source;
};
const mmTextFile = (text) => String(text);
const mmFontFamily = (id) => Cache.key(mmFontFile(id));
class DrawTextFilter extends FilterDefinitionClass {
    constructor() {
        super(...arguments);
        // id = 'drawtext'
        this.parameters = [
            new Parameter({ name: "fontcolor", value: "#000000" }),
            new Parameter({ name: "shadowcolor", value: "#FFFFFF" }),
            new Parameter({ name: "fontsize", value: "mm_vert(20)" }),
            new Parameter({ name: "x", value: "0" }),
            new Parameter({ name: "y", value: "0" }),
            new Parameter({ name: "shadowx", value: "mm_horz(5)" }),
            new Parameter({ name: "shadowy", value: "mm_vert(5)" }),
            new Parameter({ name: "fontfile", value: "mmFontFile('com.moviemasher.font.default')" }),
            new Parameter({ name: "textfile", value: "Hello World" }),
        ];
    }
    draw(evaluator, evaluated) {
        const { context } = evaluator;
        const fontface = String(evaluator.get("fontface"));
        const family = mmFontFamily(fontface);
        const { x, y, fontsize, fontcolor, text, textfile, shadowcolor, shadowx, shadowy } = evaluated;
        if (!(fontsize && Is.aboveZero(fontsize)))
            throw Errors.eval.number + " fontsize";
        const height = Number(fontsize);
        const textStyle = {
            height,
            family,
            color: String(fontcolor || 'black'),
            shadow: String(shadowcolor || ""),
            shadowPoint: { x: Number(shadowx || 0), y: Number(shadowy || 0) },
        };
        const point = { x: Number(x || 0), y: Number(y || 0) };
        const string = String(text || textfile);
        context.drawTextAtPoint(string, textStyle, point);
        return context;
    }
    scopeSet(evaluator) {
        evaluator.set("text_w", 0); // width of the text to draw
        evaluator.set("text_h", 0); // height of the text to draw
        evaluator.set("mmFontFamily", mmFontFamily);
        evaluator.set("mmTextFile", mmTextFile);
        evaluator.set("mmFontFile", mmFontFile);
        // support deprecated snake case
        evaluator.set("mm_fontfamily", mmFontFamily);
        evaluator.set("mm_textfile", mmTextFile);
        evaluator.set("mm_fontfile", mmFontFile);
    }
}

class FadeFilter extends FilterDefinitionClass {
    draw(evaluator) {
        const { context } = evaluator;
        const drawing = ContextFactoryInstance.toSize(context.size);
        const alpha = Number(evaluator.get('alpha') || evaluator.position);
        const type = String(evaluator.get('type') || 'in');
        const typedAlpha = type === 'in' ? alpha : 1.0 - alpha;
        drawing.drawWithAlpha(context.drawingSource, typedAlpha);
        return drawing;
    }
}

class OverlayFilter extends FilterDefinitionClass {
    draw(evaluator, evaluated) {
        const { x, y } = evaluated;
        const { context, mergeContext } = evaluator;
        if (typeof mergeContext === "undefined")
            throw Errors.internal + 'OverlayFilter mergeContext';
        mergeContext.drawAtPoint(context.drawingSource, { x: x || 0, y: y || 0 });
        return mergeContext;
    }
    // id = 'overlay'
    scopeSet(evaluator) {
        const { width, height } = evaluator.context.size;
        evaluator.set("overlay_w", width);
        evaluator.set("overlay_h", height);
    }
}

class ScaleFilter extends FilterDefinitionClass {
    draw(evaluator, evaluated) {
        const { context } = evaluator;
        let outWidth = evaluated.w || evaluated.width || 0;
        let outHeight = evaluated.h || evaluated.height || 0;
        if (outWidth + outHeight < 2)
            return context;
        const inSize = {
            width: Number(evaluator.get("mm_in_w")), height: Number(evaluator.get("mm_in_h"))
        }; //evaluator.inputSize
        if (outWidth === -1)
            outWidth = inSize.width * (outHeight / inSize.height);
        else if (outHeight === -1)
            outHeight = inSize.height * (outWidth / inSize.width);
        const fromSize = { width: outWidth, height: outHeight };
        const drawing = ContextFactoryInstance.toSize(fromSize);
        // console.log(this.constructor.name, "draw", inSize, fromSize)
        drawing.drawInSizeFromSize(context.drawingSource, inSize, fromSize);
        return drawing;
    }
    // id = 'scale'
    scopeSet(evaluator) {
        const { width, height } = evaluator.context.size;
        evaluator.set("in_h", height);
        evaluator.set("mm_in_h", height);
        evaluator.set("in_w", width);
        evaluator.set("mm_in_w", width);
    }
}

class SetSarFilter extends FilterDefinitionClass {
    draw(evaluator, _evaluated) {
        return evaluator.context;
    }
}

const filterDefinition = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    throw Errors.invalid.definition.id + ' filterDefinition ' + id;
};
const filterDefinitionFromId = (id) => {
    return filterDefinition({ id });
};
const filterInstance = (object) => {
    return filterDefinition(object).instanceFromObject(object);
};
const filterFromId = (id) => { return filterInstance({ id }); };
const filterInitialize = () => {
    new ConvolutionFilter({ id: 'convolution', type: exports.DefinitionType.Filter });
    new SetSarFilter({ id: 'setsar', type: exports.DefinitionType.Filter });
    new BlendFilter({ id: 'blend', type: exports.DefinitionType.Filter });
    new ChromaKeyFilter({ id: 'chromakey', type: exports.DefinitionType.Filter });
    new ColorFilter({ id: 'color', type: exports.DefinitionType.Filter });
    new ColorChannelMixerFilter({ id: 'colorchannelmixer', type: exports.DefinitionType.Filter });
    new CropFilter({ id: 'crop', type: exports.DefinitionType.Filter });
    new DrawBoxFilter({ id: 'drawbox', type: exports.DefinitionType.Filter });
    new DrawTextFilter({ id: 'drawtext', type: exports.DefinitionType.Filter });
    new FadeFilter({ id: 'fade', type: exports.DefinitionType.Filter });
    new OverlayFilter({ id: 'overlay', type: exports.DefinitionType.Filter });
    new ScaleFilter({ id: 'scale', type: exports.DefinitionType.Filter });
};
const filterDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.invalid.definition.id + 'filterDefine';
    Definitions.uninstall(id);
    return filterDefinition(object);
};
const FilterFactoryImplementation = {
    define: filterDefine,
    definition: filterDefinition,
    definitionFromId: filterDefinitionFromId,
    fromId: filterFromId,
    initialize: filterInitialize,
    instance: filterInstance,
};
Factories.filter = FilterFactoryImplementation;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ModularDefinitionMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.filters = [];
            this.retain = true;
            const [object] = args;
            const { properties, filters } = object;
            if (properties) {
                const propertyInstances = Object.entries(properties).map(entry => {
                    const [name, propertyObject] = entry;
                    if (!Is.object(propertyObject))
                        throw Errors.invalid.property + "name " + name;
                    const property = Object.assign(propertyObject, { name, custom: true });
                    return new Property(property);
                });
                this.properties.push(...propertyInstances);
                //console.log("ModularDefinition", this.id, "properties", this.properties.map(p => `${p.name} => ${p.value}`))
            }
            if (filters) {
                const filterInstances = filters.map(filter => {
                    const { id } = filter;
                    if (!id)
                        throw Errors.id;
                    return filterInstance(filter);
                });
                this.filters.push(...filterInstances);
            }
        }
        drawFilters(modular, range, context, size, outContext) {
            // range's frame is offset of draw time in clip = frames is duration
            let contextFiltered = context;
            this.filters.forEach(filter => {
                const evaluator = this.evaluator(modular, range, contextFiltered, size, outContext);
                contextFiltered = filter.drawFilter(evaluator);
            });
            return contextFiltered;
        }
        evaluator(modular, range, context, size, mergerContext) {
            const instance = new Evaluator(range, context, size, mergerContext);
            this.propertiesCustom.forEach(property => {
                const value = modular.value(property.name);
                instance.set(property.name, value);
            });
            return instance;
        }
        get propertiesCustom() {
            return this.properties.filter(property => property.custom);
        }
        toJSON() {
            const object = super.toJSON();
            if (this.filters.length)
                object.filters = this.filters;
            const entries = this.propertiesCustom.map(property => [property.name, property]);
            if (entries.length)
                object.properties = Object.fromEntries(entries);
            return object;
        }
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ModularMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            const [object] = args;
            this.constructProperties(object);
        }
        constructProperties(object = {}) {
            // console.log(this.constructor.name, "constructProperties", object, this.propertyNames)
            this.definition.properties.forEach(property => {
                const { name } = property;
                if (typeof object[name] !== "undefined")
                    this[name] = object[name];
                else if (typeof this[name] === "undefined")
                    this[name] = property.value;
            });
        }
        get definitions() {
            return [...super.definitions, ...this.modularDefinitions];
        }
        load(quantize, start, end) {
            const promises = [super.load(quantize, start, end)];
            const startTime = this.definitionTime(quantize, start);
            const endTime = end ? this.definitionTime(quantize, end) : end;
            this.modularDefinitions.forEach(definition => {
                promises.push(definition.load(startTime, endTime));
            });
            return Promise.all(promises).then();
        }
        loaded(quantize, start, end) {
            if (!super.load(quantize, start, end))
                return false;
            const startTime = this.definitionTime(quantize, start);
            const endTime = end ? this.definitionTime(quantize, end) : end;
            return this.modularDefinitions.every(definition => definition.loaded(startTime, endTime));
        }
        get modularDefinitions() {
            const modular = this.definition.propertiesModular;
            const ids = modular.map(property => String(this.value(property.name)));
            return ids.map(id => Definitions.fromId(id));
        }
    };
}

const EffectWithModular = ModularMixin(InstanceClass);
class EffectClass extends EffectWithModular {
    toJSON() {
        const object = super.toJSON();
        object.id = this.id;
        return object;
    }
}

const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionClass);
class EffectDefinitionClass extends EffectDefinitionWithModular {
    constructor(...args) {
        super(...args);
        this.type = exports.DefinitionType.Effect;
        Definitions.install(this);
    }
    get instance() { return this.instanceFromObject(this.instanceObject); }
    instanceFromObject(object) {
        return new EffectClass({ ...this.instanceObject, ...object });
    }
}

const label$i = "Blur";
const type$i = "effect";
const id$i = "com.moviemasher.effect.blur";
const properties$e = {
};
const filters$h = [
  {
    id: "convolution",
    parameters: [
      {
        name: "0m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "1m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "2m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "3m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "0rdiv",
        value: "1/9"
      },
      {
        name: "1rdiv",
        value: "1/9"
      },
      {
        name: "2rdiv",
        value: "1/9"
      },
      {
        name: "3rdiv",
        value: "1/9"
      }
    ]
  }
];
var effectBlurJson = {
  label: label$i,
  type: type$i,
  id: id$i,
  properties: properties$e,
  filters: filters$h
};

const label$h = "Chromakey";
const type$h = "effect";
const id$h = "com.moviemasher.effect.chromakey";
const properties$d = {
  accurate: {
    type: "number",
    value: 0
  },
  chroma_blend: {
    type: "number",
    value: 0.01
  },
  chroma_similarity: {
    type: "number",
    value: 0.5
  },
  chroma_color: {
    type: "rgb",
    value: "rgb(0,255,0)"
  }
};
const filters$g = [
  {
    id: "chromakey",
    parameters: [
      {
        name: "color",
        value: "chroma_color"
      },
      {
        name: "blend",
        value: "chroma_blend"
      },
      {
        name: "similarity",
        value: "chroma_similarity"
      }
    ]
  }
];
var effectChromaKeyJson = {
  label: label$h,
  type: type$h,
  id: id$h,
  properties: properties$d,
  filters: filters$g
};

const label$g = "Emboss";
const type$g = "effect";
const id$g = "com.moviemasher.effect.emboss";
const properties$c = {
};
const filters$f = [
  {
    id: "convolution",
    parameters: [
      {
        name: "0m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      },
      {
        name: "1m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      },
      {
        name: "2m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      },
      {
        name: "3m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      }
    ]
  }
];
var effectEmbossJson = {
  label: label$g,
  type: type$g,
  id: id$g,
  properties: properties$c,
  filters: filters$f
};

const label$f = "Grayscale";
const type$f = "effect";
const id$f = "com.moviemasher.effect.grayscale";
const properties$b = {
};
const filters$e = [
  {
    id: "colorchannelmixer",
    parameters: [
      {
        name: "rr",
        value: 0.3
      },
      {
        name: "rg",
        value: 0.4
      },
      {
        name: "rb",
        value: 0.3
      },
      {
        name: "ra",
        value: 0
      },
      {
        name: "gr",
        value: 0.3
      },
      {
        name: "gg",
        value: 0.4
      },
      {
        name: "gb",
        value: 0.3
      },
      {
        name: "ga",
        value: 0
      },
      {
        name: "br",
        value: 0.3
      },
      {
        name: "bg",
        value: 0.4
      },
      {
        name: "bb",
        value: 0.3
      },
      {
        name: "ba",
        value: 0
      },
      {
        name: "ar",
        value: 0
      },
      {
        name: "ag",
        value: 0
      },
      {
        name: "ab",
        value: 0
      },
      {
        name: "aa",
        value: 1
      }
    ]
  }
];
var effectGrayscaleJson = {
  label: label$f,
  type: type$f,
  id: id$f,
  properties: properties$b,
  filters: filters$e
};

const label$e = "Sepia";
const type$e = "effect";
const id$e = "com.moviemasher.effect.sepia";
const properties$a = {
};
const filters$d = [
  {
    id: "colorchannelmixer",
    parameters: [
      {
        name: "rr",
        value: 0.393
      },
      {
        name: "rg",
        value: 0.769
      },
      {
        name: "rb",
        value: 0.189
      },
      {
        name: "ra",
        value: 0
      },
      {
        name: "gr",
        value: 0.349
      },
      {
        name: "gg",
        value: 0.686
      },
      {
        name: "gb",
        value: 0.168
      },
      {
        name: "ga",
        value: 0
      },
      {
        name: "br",
        value: 0.272
      },
      {
        name: "bg",
        value: 0.534
      },
      {
        name: "bb",
        value: 0.131
      },
      {
        name: "ba",
        value: 0
      },
      {
        name: "ar",
        value: 0
      },
      {
        name: "ag",
        value: 0
      },
      {
        name: "ab",
        value: 0
      },
      {
        name: "aa",
        value: 1
      }
    ]
  }
];
var effectSepiaJson = {
  label: label$e,
  type: type$e,
  id: id$e,
  properties: properties$a,
  filters: filters$d
};

const label$d = "Sharpen";
const type$d = "effect";
const id$d = "com.moviemasher.effect.sharpen";
const properties$9 = {
};
const filters$c = [
  {
    id: "convolution",
    parameters: [
      {
        name: "0m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      },
      {
        name: "1m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      },
      {
        name: "2m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      },
      {
        name: "3m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      }
    ]
  }
];
var effectSharpenJson = {
  label: label$d,
  type: type$d,
  id: id$d,
  properties: properties$9,
  filters: filters$c
};

const label$c = "Text Box";
const type$c = "effect";
const id$c = "com.moviemasher.effect.textbox";
const properties$8 = {
  string: {
    type: "string",
    value: "Text Box"
  },
  size: {
    type: "fontsize",
    value: 0.2
  },
  color: {
    type: "rgba",
    value: "rgba(255,0,0,1)"
  },
  fontface: {
    type: "font",
    value: "com.moviemasher.font.default"
  },
  shadowcolor: {
    type: "rgba",
    value: "rgba(0,0,0,0)"
  },
  shadowx: {
    type: "number",
    value: 0.015
  },
  shadowy: {
    type: "number",
    value: 0.015
  },
  x: {
    type: "number",
    value: 0
  },
  y: {
    type: "number",
    value: 0
  }
};
const filters$b = [
  {
    id: "drawtext",
    parameters: [
      {
        name: "fontcolor",
        value: "color"
      },
      {
        name: "shadowcolor",
        value: "shadowcolor"
      },
      {
        name: "fontsize",
        value: "mm_vert(size)"
      },
      {
        name: "x",
        value: "mm_horz(x)"
      },
      {
        name: "y",
        value: "mm_vert(y)"
      },
      {
        name: "shadowx",
        value: "mm_horz(shadowx)"
      },
      {
        name: "shadowy",
        value: "mm_vert(shadowy)"
      },
      {
        name: "fontfile",
        value: "mm_fontfile(fontface)"
      },
      {
        name: "textfile",
        value: "mm_textfile(string)"
      }
    ]
  }
];
var effectTextJson = {
  label: label$c,
  type: type$c,
  id: id$c,
  properties: properties$8,
  filters: filters$b
};

const effectDefinition = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    return new EffectDefinitionClass({ ...object, type: exports.DefinitionType.Effect });
};
const effectDefinitionFromId = (id) => {
    return effectDefinition({ id });
};
const effectInstance = (object) => {
    const definition = effectDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const effectFromId = (id) => {
    return effectInstance({ id });
};
const effectInitialize = () => {
    new EffectDefinitionClass(effectBlurJson);
    new EffectDefinitionClass(effectChromaKeyJson);
    new EffectDefinitionClass(effectEmbossJson);
    new EffectDefinitionClass(effectGrayscaleJson);
    new EffectDefinitionClass(effectSepiaJson);
    new EffectDefinitionClass(effectSharpenJson);
    new EffectDefinitionClass(effectTextJson);
};
const effectDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return effectDefinition(object);
};
const EffectFactoryImplementation = {
    define: effectDefine,
    definition: effectDefinition,
    definitionFromId: effectDefinitionFromId,
    fromId: effectFromId,
    initialize: effectInitialize,
    instance: effectInstance,
};
Factories.effect = EffectFactoryImplementation;

/**
 * Provides access to factory objects that create all other object definitions and instances.
 *
 * @example Create {@link Masher} instance and bind to a CANVAS element
 * ```ts
 * const canvas : ContextElement = document.getElementById('moviemasher-canvas')
 * const masher : Masher = MovieMasher.masher.instance({ canvas })
 * ```
 * @sealed
 */
class MovieMasher {
    /**
     * Object with methods to create audio definitions and instances
     */
    static get [exports.DefinitionType.Audio]() {
        const factory = Factories[exports.DefinitionType.Audio];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Audio;
        return factory;
    }
    /**
     * Object with methods to create effect definitions and instances
     */
    static get [exports.DefinitionType.Effect]() {
        const factory = Factories[exports.DefinitionType.Effect];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Effect;
        return factory;
    }
    /**
     * Object with methods to create audio definitions and instances
     */
    static get [exports.DefinitionType.Filter]() {
        const factory = Factories[exports.DefinitionType.Filter];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Filter;
        return factory;
    }
    static get [exports.DefinitionType.Font]() {
        const factory = Factories[exports.DefinitionType.Font];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Font;
        return factory;
    }
    static get [exports.DefinitionType.Image]() {
        const factory = Factories[exports.DefinitionType.Image];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Image;
        return factory;
    }
    static get [exports.DefinitionType.Mash]() {
        const factory = Factories[exports.DefinitionType.Mash];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Mash;
        return factory;
    }
    static get [exports.DefinitionType.Masher]() {
        const factory = Factories[exports.DefinitionType.Masher];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Masher;
        return factory;
    }
    static get [exports.DefinitionType.Merger]() {
        const factory = Factories[exports.DefinitionType.Merger];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Merger;
        return factory;
    }
    static get [exports.DefinitionType.Scaler]() {
        const factory = Factories[exports.DefinitionType.Scaler];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Scaler;
        return factory;
    }
    static get [exports.DefinitionType.Theme]() {
        const factory = Factories[exports.DefinitionType.Theme];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Theme;
        return factory;
    }
    static get [exports.DefinitionType.Transition]() {
        const factory = Factories[exports.DefinitionType.Transition];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Transition;
        return factory;
    }
    static get [exports.DefinitionType.Video]() {
        const factory = Factories[exports.DefinitionType.Video];
        if (!factory)
            throw Errors.invalid.factory + exports.DefinitionType.Video;
        return factory;
    }
    constructor() { }
}

const MergerWithModular = ModularMixin(InstanceClass);
class MergerClass extends MergerWithModular {
    get id() { return this.definition.id; }
    set id(value) {
        this.definition = MovieMasher.merger.definitionFromId(value);
        this.constructProperties();
    }
}

const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionClass);
class MergerDefinitionClass extends MergerDefinitionWithModular {
    constructor(...args) {
        super(...args);
        this.retain = true;
        this.type = exports.DefinitionType.Merger;
        this.properties.push(new Property({ name: "id", type: exports.DataType.String, value: "" }));
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new MergerClass({ ...this.instanceObject, ...object });
        return instance;
    }
}

const label$b = "Blend";
const id$b = "com.moviemasher.merger.blend";
const type$b = "merger";
const properties$7 = {
  mode: {
    type: "mode",
    value: "normal"
  }
};
const filters$a = [
  {
    id: "blend",
    parameters: [
      {
        name: "all_mode",
        value: "mode"
      },
      {
        name: "repeatlast",
        value: "0"
      }
    ]
  }
];
var mergerBlendJson = {
  label: label$b,
  id: id$b,
  type: type$b,
  properties: properties$7,
  filters: filters$a
};

const label$a = "Center";
const id$a = "com.moviemasher.merger.center";
const type$a = "merger";
const filters$9 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "floor((mm_width - overlay_w) / 2)"
      },
      {
        name: "y",
        value: "floor((mm_height - overlay_h) / 2)"
      }
    ]
  }
];
var mergerCenterJson = {
  label: label$a,
  id: id$a,
  type: type$a,
  filters: filters$9
};

const label$9 = "Constrained";
const type$9 = "merger";
const id$9 = "com.moviemasher.merger.constrained";
const properties$6 = {
  left: {
    type: "pixel",
    value: 0
  },
  top: {
    type: "pixel",
    value: 0
  }
};
const filters$8 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "left*(mm_width-overlay_w)"
      },
      {
        name: "y",
        value: "top*(mm_height-overlay_h)"
      }
    ]
  }
];
var mergerConstrainedJson = {
  label: label$9,
  type: type$9,
  id: id$9,
  properties: properties$6,
  filters: filters$8
};

const label$8 = "Top Left";
const id$8 = "com.moviemasher.merger.default";
const type$8 = "merger";
const filters$7 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "0"
      },
      {
        name: "y",
        value: "0"
      }
    ]
  }
];
var mergerDefaultJson = {
  label: label$8,
  id: id$8,
  type: type$8,
  filters: filters$7
};

const label$7 = "Overlay";
const id$7 = "com.moviemasher.merger.overlay";
const type$7 = "merger";
const properties$5 = {
  left: {
    type: "pixel",
    value: 0.5
  },
  top: {
    type: "pixel",
    value: 0.5
  }
};
const filters$6 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "((mm_width + overlay_w) * left) - overlay_w"
      },
      {
        name: "y",
        value: "((mm_height + overlay_h) * top) - overlay_h"
      }
    ]
  }
];
var mergerOverlayJson = {
  label: label$7,
  id: id$7,
  type: type$7,
  properties: properties$5,
  filters: filters$6
};

const mergerDefaultId = "com.moviemasher.merger.default";
const mergerDefinition = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) ? id : mergerDefaultId;
    if (Definitions.installed(idString))
        return Definitions.fromId(idString);
    return new MergerDefinitionClass({ ...object, type: exports.DefinitionType.Merger, id: idString });
};
const mergerDefinitionFromId = (id) => {
    return mergerDefinition({ id });
};
const mergerInstance = (object) => {
    const definition = mergerDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const mergerFromId = (id) => {
    return mergerInstance({ id });
};
const mergerInitialize = () => {
    new MergerDefinitionClass(mergerBlendJson);
    new MergerDefinitionClass(mergerCenterJson);
    new MergerDefinitionClass(mergerConstrainedJson);
    new MergerDefinitionClass(mergerDefaultJson);
    new MergerDefinitionClass(mergerOverlayJson);
};
const mergerDefine = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) ? id : mergerDefaultId;
    Definitions.uninstall(idString);
    return mergerDefinition(object);
};
const MergerFactoryImplementation = {
    define: mergerDefine,
    definition: mergerDefinition,
    definitionFromId: mergerDefinitionFromId,
    fromId: mergerFromId,
    initialize: mergerInitialize,
    instance: mergerInstance,
};
Factories.merger = MergerFactoryImplementation;

const ScalerWithModular = ModularMixin(InstanceClass);
class ScalerClass extends ScalerWithModular {
    get id() { return this.definition.id; }
    set id(value) {
        this.definition = MovieMasher.scaler.definitionFromId(value);
        this.constructProperties();
    }
}

const ScalerDefinitionWithModular = ModularDefinitionMixin(DefinitionClass);
class ScalerDefinitionClass extends ScalerDefinitionWithModular {
    constructor(...args) {
        super(...args);
        this.retain = true;
        this.type = exports.DefinitionType.Scaler;
        this.properties.push(new Property({ name: "id", type: exports.DataType.String, value: "" }));
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new ScalerClass({ ...this.instanceObject, ...object });
        return instance;
    }
}

const label$6 = "Stretch";
const id$6 = "com.moviemasher.scaler.default";
const type$6 = "scaler";
const filters$5 = [
  {
    id: "scale",
    parameters: [
      {
        name: "width",
        value: "mm_width"
      },
      {
        name: "height",
        value: "mm_height"
      }
    ]
  },
  {
    id: "setsar",
    parameters: [
      {
        name: "sar",
        value: "1"
      },
      {
        name: "max",
        value: "1"
      }
    ]
  }
];
var scalerDefaultJson = {
  label: label$6,
  id: id$6,
  type: type$6,
  filters: filters$5
};

const label$5 = "Pan";
const type$5 = "scaler";
const id$5 = "com.moviemasher.scaler.pan";
const properties$4 = {
  scale: {
    type: "number",
    value: 1.25
  },
  direction: {
    type: "direction8",
    value: 1
  }
};
const filters$4 = [
  {
    id: "crop",
    description: "crop down diagonals and center",
    parameters: [
      {
        name: "out_w",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_width"
          },
          {
            condition: "true",
            value: "mm_horz(scale, true) / mm_max(mm_horz(scale, true) / mm_input_width, mm_vert(scale, true) / mm_input_height)"
          }
        ]
      },
      {
        name: "out_h",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_height"
          },
          {
            condition: "true",
            value: "mm_vert(scale, true) / mm_max(mm_horz(scale, true) / mm_input_width, mm_vert(scale, true) / mm_input_height)"
          }
        ]
      },
      {
        name: "x",
        value: "(mm_input_width-out_w)/2"
      },
      {
        name: "y",
        value: "(mm_input_height-out_h)/2"
      }
    ]
  },
  {
    id: "scale",
    description: "scale (proudly for diagonals)",
    parameters: [
      {
        name: "w",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_width * mm_max(mm_horz(scale) / mm_input_width, mm_vert(scale) / mm_input_height)"
          },
          {
            condition: "true",
            value: "mm_horz(scale, true)"
          }
        ]
      },
      {
        name: "h",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_height * mm_max(mm_horz(scale) / mm_input_width, mm_vert(scale) / mm_input_height)"
          },
          {
            condition: "true",
            value: "mm_vert(scale, true)"
          }
        ]
      }
    ]
  },
  {
    id: "crop",
    description: "crop down and position over time",
    parameters: [
      {
        name: "w",
        value: "mm_width"
      },
      {
        name: "h",
        value: "mm_height"
      },
      {
        name: "x",
        value: [
          {
            condition: "direction",
            "in": [
              0,
              2
            ],
            value: "(in_w-mm_width)/2"
          },
          {
            condition: "direction",
            "in": [
              1,
              5
            ],
            value: "(in_w-mm_width)*mm_t"
          },
          {
            condition: "direction",
            is: 4,
            value: "(in_w-mm_width)*mm_t"
          },
          {
            condition: "direction",
            "in": [
              3,
              7
            ],
            value: "(in_w-mm_width)-((in_w-mm_width)*mm_t)"
          },
          {
            condition: "direction",
            is: 6,
            value: "floor(((in_w-mm_width)*(1.0-mm_t)))"
          }
        ]
      },
      {
        name: "y",
        value: [
          {
            condition: "direction",
            "in": [
              1,
              3
            ],
            value: "(in_h-mm_height)/2"
          },
          {
            condition: "direction",
            "in": [
              2,
              5
            ],
            value: "(in_h-mm_height)*mm_t"
          },
          {
            condition: "direction",
            is: 6,
            value: "ceil((in_h-mm_height)*mm_t)"
          },
          {
            condition: "direction",
            "in": [
              0,
              7
            ],
            value: "(in_h-mm_height)-((in_h-mm_height)*mm_t)"
          },
          {
            condition: "direction",
            is: 4,
            value: "(in_h-mm_height)-((in_h-mm_height) * mm_t)"
          }
        ]
      }
    ]
  },
  {
    id: "setsar",
    parameters: [
      {
        name: "sar",
        value: "1"
      },
      {
        name: "max",
        value: "1"
      }
    ]
  }
];
var scalerPanJson = {
  label: label$5,
  type: type$5,
  id: id$5,
  properties: properties$4,
  filters: filters$4
};

const label$4 = "Scale";
const type$4 = "scaler";
const id$4 = "com.moviemasher.scaler.scale";
const properties$3 = {
  scale: {
    type: "number",
    value: 1
  }
};
const filters$3 = [
  {
    id: "scale",
    parameters: [
      {
        name: "width",
        value: "scale * mm_input_width * mm_max(mm_width / mm_input_width, mm_height / mm_input_height)"
      },
      {
        name: "height",
        value: "scale * mm_input_height * mm_max(mm_width / mm_input_width, mm_height / mm_input_height)"
      }
    ]
  },
  {
    id: "setsar",
    parameters: [
      {
        name: "sar",
        value: "1"
      },
      {
        name: "max",
        value: "1"
      }
    ]
  }
];
var scalerScaleJson = {
  label: label$4,
  type: type$4,
  id: id$4,
  properties: properties$3,
  filters: filters$3
};

const scalerDefaultId = "com.moviemasher.scaler.default";
const scalerDefinition = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) ? id : scalerDefaultId;
    if (Definitions.installed(idString))
        return Definitions.fromId(idString);
    return new ScalerDefinitionClass({ ...object, type: exports.DefinitionType.Scaler, id: idString });
};
const scalerDefinitionFromId = (id) => {
    return scalerDefinition({ id });
};
const scalerInstance = (object) => {
    return scalerDefinition(object).instanceFromObject(object);
};
const scalerFromId = (id) => {
    return scalerInstance({ id });
};
const scalerInitialize = () => {
    new ScalerDefinitionClass(scalerDefaultJson);
    new ScalerDefinitionClass(scalerPanJson);
    new ScalerDefinitionClass(scalerScaleJson);
};
const scalerDefine = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) ? id : scalerDefaultId;
    Definitions.uninstall(idString);
    return scalerDefinition(object);
};
const ScalerFactoryImplementation = {
    define: scalerDefine,
    definitionFromId: scalerDefinitionFromId,
    definition: scalerDefinition,
    instance: scalerInstance,
    fromId: scalerFromId,
    initialize: scalerInitialize,
};
Factories.scaler = ScalerFactoryImplementation;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function TransformableMixin(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.effects = [];
            const [object] = args;
            const { merger, effects, scaler } = object;
            this.merger = mergerInstance(merger || {});
            this.scaler = scalerInstance(scaler || {});
            if (effects) {
                const effectInstances = effects.map(effect => effectInstance(effect));
                this.effects.push(...effectInstances);
            }
        }
        get definitions() {
            return [
                ...super.definitions,
                ...this.merger.definitions,
                ...this.scaler.definitions,
                ...this.effects.flatMap(effect => effect.definitions)
            ];
        }
        effectedContextAtTimeToSize(mashTime, quantize, dimensions) {
            const scaledContext = this.scaledContextAtTimeToSize(mashTime, quantize, dimensions);
            if (!scaledContext)
                return;
            let context = scaledContext;
            if (!this.effects)
                return context;
            const clipTimeRange = this.timeRangeRelative(mashTime, quantize);
            if (!clipTimeRange)
                return;
            this.effects.reverse().every(effect => (context = effect.definition.drawFilters(effect, clipTimeRange, context, dimensions)));
            return context;
        }
        load(quantize, start, end) {
            const promises = [super.load(quantize, start, end)];
            promises.push(this.merger.load(quantize, start, end));
            promises.push(this.scaler.load(quantize, start, end));
            this.effects.forEach(effect => {
                promises.push(effect.load(quantize, start, end));
            });
            return Promise.all(promises).then();
        }
        mergeContextAtTime(mashTime, quantize, context) {
            const effected = this.effectedContextAtTimeToSize(mashTime, quantize, context.size);
            if (!effected)
                return;
            const range = this.timeRangeRelative(mashTime, quantize);
            this.merger.definition.drawFilters(this.merger, range, effected, context.size, context);
        }
        get propertyValues() {
            const merger = this.merger.propertyValues;
            const scaler = this.scaler.propertyValues;
            const combined = { merger, scaler, ...super.propertyValues };
            // console.log(this.constructor.name, "get propertyValues", combined)
            return combined;
        }
        scaledContextAtTimeToSize(mashTime, quantize, dimensions) {
            const context = this.contextAtTimeToSize(mashTime, quantize, dimensions);
            if (!context)
                return;
            const clipTimeRange = this.timeRangeRelative(mashTime, quantize);
            if (Is.undefined(clipTimeRange))
                return context;
            // console.log(this.constructor.name, "scaledContextAtTimeToSize", clipTimeRange)
            return this.scaler.definition.drawFilters(this.scaler, clipTimeRange, context, dimensions);
        }
        toJSON() {
            const object = super.toJSON(); // gets merger and scaler from propertyValues
            if (this.effects.length)
                object.effects = this.effects;
            return object;
        }
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VisibleMixin(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.trackType = exports.TrackType.Video;
            this.visible = true;
        }
        contextAtTimeToSize(mashTime, quantize, _dimensions) {
            const definitionTime = this.definitionTime(quantize, mashTime);
            const visibleDefinition = this.definition;
            const image = visibleDefinition.loadedVisible(definitionTime);
            if (!image)
                return;
            const width = Number(image.width);
            const height = Number(image.height);
            const context = ContextFactoryInstance.toSize({ width, height });
            context.draw(image);
            return context;
        }
        mergeContextAtTime(_time, _quantize, _context) { }
    };
}

const ImageWithClip = ClipMixin(InstanceClass);
const ImageWithVisible = VisibleMixin(ImageWithClip);
const ImageWithTransformable = TransformableMixin(ImageWithVisible);
class ImageClass extends ImageWithTransformable {
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VisibleDefinitionMixin(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.trackType = exports.TrackType.Video;
            this.visible = true;
        }
    };
}

const ImageDefinitionWithClip = ClipDefinitionMixin(DefinitionClass);
const ImageDefinitionWithVisible = VisibleDefinitionMixin(ImageDefinitionWithClip);
class ImageDefinitionClass extends ImageDefinitionWithVisible {
    constructor(...args) {
        super(...args);
        this.source = '';
        this.type = exports.DefinitionType.Image;
        const [object] = args;
        if (!object)
            throw Errors.unknown.definition;
        // console.log("ImageDefinition", object)
        const { url, source } = object;
        if (!url)
            throw Errors.invalid.definition.url;
        this.urlVisible = url;
        if (source)
            this.source = source;
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new ImageClass({ ...this.instanceObject, ...object });
        return instance;
    }
    load(start, end) {
        const promises = [super.load(start, end)];
        if (Cache.cached(this.urlVisible)) {
            const cached = Cache.get(this.urlVisible);
            if (cached instanceof Promise)
                promises.push(cached);
        }
        else
            promises.push(LoaderFactory.image().loadUrl(this.urlVisible));
        return Promise.all(promises).then();
    }
    loaded(start, end) {
        return super.loaded(start, end) && Cache.cached(this.urlVisible);
    }
    loadedVisible(_time) { return Cache.get(this.urlVisible); }
    toJSON() {
        const object = super.toJSON();
        object.url = this.urlVisible;
        if (this.source)
            object.source = this.source;
        return object;
    }
    unload(times = []) {
        super.unload(times);
        if (times.length)
            return; // don't unload since any times indicate image needed
        if (!Cache.cached(this.urlVisible))
            return; // we're not loaded
        Cache.remove(this.urlVisible);
    }
}

const imageDefinition = (object) => {
    const { id } = object;
    if (!id)
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    return new ImageDefinitionClass(object);
};
const imageDefinitionFromId = (id) => {
    return imageDefinition({ id });
};
const imageInstance = (object) => {
    const definition = imageDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const imageFromId = (id) => {
    return imageInstance({ id });
};
const imageInitialize = () => { };
const imageDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return imageDefinition(object);
};
const ImageFactoryImplementation = {
    define: imageDefine,
    definition: imageDefinition,
    definitionFromId: imageDefinitionFromId,
    fromId: imageFromId,
    initialize: imageInitialize,
    instance: imageInstance,
};
Factories.image = ImageFactoryImplementation;

class TrackClass {
    constructor(object) {
        this.clips = [];
        this.index = 0;
        this.type = exports.TrackType.Video;
        const { clips, index, type } = object;
        if (index)
            this.index = index;
        if (type)
            this.type = type;
        if (clips)
            this.clips.push(...clips);
    }
    get frames() {
        if (!this.clips.length)
            return 0;
        const clip = this.clips[this.clips.length - 1];
        return clip.frame + clip.frames;
    }
    get isMainVideo() { return !this.index && this.type === exports.TrackType.Video; }
    addClips(clips, insertIndex = 0) {
        // console.log("addClips", clips.length, insertIndex, this.index)
        let clipIndex = insertIndex || 0;
        if (!this.isMainVideo)
            clipIndex = 0; // ordered by clip.frame values
        const origIndex = clipIndex; // note original, since it may decrease...
        const movingClips = []; // build array of clips already in this.clips
        // build array of my clips excluding the clips we're inserting
        const spliceClips = this.clips.filter((clip, index) => {
            const moving = clips.includes(clip);
            if (moving)
                movingClips.push(clip);
            // insert index should be decreased when clip is moving and comes before
            if (origIndex && moving && index < origIndex)
                clipIndex -= 1;
            return !moving;
        });
        // insert the clips we're adding at the correct index, then sort properly
        spliceClips.splice(clipIndex, 0, ...clips);
        this.sortClips(spliceClips);
        // set the track of clips we aren't moving
        const newClips = clips.filter(clip => !movingClips.includes(clip));
        newClips.forEach(clip => { clip.track = this.index; });
        // remove all my current clips and replace with new ones in one step
        this.clips.splice(0, this.clips.length, ...spliceClips);
    }
    frameForClipsNearFrame(clips, frame = 0) {
        if (this.isMainVideo)
            return frame;
        const others = this.clips.filter(clip => !clips.includes(clip) && clip.endFrame > frame);
        if (!others.length)
            return frame;
        const startFrame = Math.min(...clips.map(clip => clip.frame));
        const endFrame = Math.max(...clips.map(clip => clip.endFrame));
        const frames = endFrame - startFrame;
        let lastFrame = frame;
        others.find(clip => {
            if (clip.frame >= lastFrame + frames)
                return true;
            lastFrame = clip.endFrame;
        });
        return lastFrame;
    }
    removeClips(clips) {
        const spliceClips = this.clips.filter(clip => !clips.includes(clip));
        if (spliceClips.length === this.clips.length) {
            // console.trace("removeClips", this.type, this.index, this.clips)
            throw Errors.internal + 'removeClips';
        }
        clips.forEach(clip => { clip.track = -1; });
        this.sortClips(spliceClips);
        this.clips.splice(0, this.clips.length, ...spliceClips);
    }
    sortClips(clips) {
        if (this.isMainVideo) {
            let frame = 0;
            clips.forEach((clip, i) => {
                const isTransition = clip.type === exports.DefinitionType.Transition;
                if (i && isTransition)
                    frame -= clip.frames;
                clip.frame = frame;
                if (!isTransition)
                    frame += clip.frames;
            });
        }
        clips.sort(byFrame);
    }
    toJSON() {
        return { type: this.type, index: this.index, clips: this.clips };
    }
}

class Composition {
    constructor(object) {
        this.buffer = Default.mash.buffer;
        this.contextSeconds = 0;
        this._gain = Default.mash.gain;
        this.mashSeconds = 0;
        this.playing = false;
        this.quantize = Default.mash.quantize;
        this.sourcesByClip = new Map();
        // console.trace("Composition constructor")
        const { audibleContext, backcolor, buffer, gain, quantize, visibleContext } = object;
        if (backcolor)
            this.backcolor = backcolor;
        if (quantize && Is.aboveZero(quantize))
            this.quantize = quantize;
        if (audibleContext)
            this._audibleContext = audibleContext;
        else
            this._audibleContext = ContextFactoryInstance.audible();
        if (visibleContext)
            this._visibleContext = visibleContext;
        else
            this._visibleContext = ContextFactoryInstance.visible();
        if (typeof gain !== "undefined" && Is.positive(gain))
            this._gain = gain;
        if (buffer && Is.aboveZero(buffer))
            this.buffer = buffer;
    }
    adjustSourceGain(clip) {
        const source = this.sourcesByClip.get(clip);
        if (!source)
            return;
        const { gainNode } = source;
        if (this.gain === 0.0) {
            gainNode.gain.value = 0.0;
            return;
        }
        const gain = clip.gain;
        if (Is.positive(gain)) {
            gainNode.gain.value = this.gain * gain;
            return;
        }
        // position/gain pairs...
        const timing = this.clipTiming(clip);
        const { start, duration } = timing;
        gainNode.gain.cancelScheduledValues(0);
        clip.gainPairs.forEach(pair => {
            const [position, value] = pair;
            gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration);
        });
    }
    get audibleContext() { return this._audibleContext; }
    set audibleContext(value) { this._audibleContext = value; }
    clipTiming(clip) {
        const range = clip.timeRange(this.quantize);
        const zeroSeconds = this.contextSeconds - this.mashSeconds;
        let offset = 0;
        let start = zeroSeconds + range.seconds;
        let duration = range.lengthSeconds;
        if (clip.trim) {
            range.frame = clip.trim;
            offset = range.seconds;
        }
        const now = this.audibleContext.currentTime;
        if (now > start) {
            const dif = now - start;
            start = now;
            offset += dif;
            duration -= dif;
        }
        return { duration, offset, start };
    }
    compositeAudible(clips) {
        if (!this.createSources(clips))
            return false;
        this.destroySources(clips);
        return true;
    }
    compositeVisible(time, clips) {
        // console.trace(this.constructor.name, "compositeVisible", this.visibleContext.size)
        // console.log(this.constructor.name, "compositeVisible", time, clips.length)
        const main = clips.filter(clip => clip.track === 0);
        this.drawBackground(); // clear and fill with mash background color if defined
        if (main.length > 1) {
            const transitionClip = main.find(clip => clip.type === exports.DefinitionType.Transition);
            if (!transitionClip)
                throw Errors.mainTrackOverlap;
            const transitioned = main.filter(clip => clip.type !== exports.DefinitionType.Transition);
            const transition = transitionClip;
            transition.mergeClipsIntoContextAtTime(transitioned, this.visibleContext, time, this.quantize, this.backcolor);
        }
        else {
            const [mainClip] = main;
            if (mainClip)
                mainClip.mergeContextAtTime(time, this.quantize, this.visibleContext);
        }
        const tracked = clips.filter(clip => !main.includes(clip)).sort(byTrack);
        tracked.forEach(clip => {
            clip.mergeContextAtTime(time, this.quantize, this.visibleContext);
        });
    }
    compositeVisibleRequest(time, clips) {
        if (Is.populatedArray(clips)) {
            // console.log(this.constructor.name, "compositeVisibleRequest calling requestAnimationFrame", time, clips.length)
            requestAnimationFrame(() => this.compositeVisible(time, clips));
            return;
        }
        this.drawBackground();
    }
    createSources(clips) {
        const filtered = clips.filter(clip => !this.sourcesByClip.has(clip));
        return filtered.every(clip => {
            const { definition } = clip;
            const buffer = definition.loadedAudible();
            if (!buffer)
                return false;
            const timing = this.clipTiming(clip);
            const { start, duration, offset } = timing;
            if (Is.positive(start) && Is.aboveZero(duration)) {
                const gainSource = this.audibleContext.createBufferSource();
                gainSource.buffer = buffer;
                gainSource.loop = clip.definition.loops;
                const gainNode = this.audibleContext.createGain();
                gainSource.connect(gainNode);
                gainNode.connect(this.audibleContext.destination);
                gainSource.start(start, offset, duration);
                this.sourcesByClip.set(clip, { gainSource, gainNode });
                this.adjustSourceGain(clip);
            }
            return true;
        });
    }
    destroySources(clipsToKeep = []) {
        this.sourcesByClip.forEach((source, clip) => {
            if (clipsToKeep.includes(clip))
                return;
            const { gainSource, gainNode } = source;
            gainNode.disconnect(this.audibleContext.destination);
            gainSource.disconnect(gainNode);
            this.sourcesByClip.delete(clip);
        });
    }
    drawBackground() {
        this.visibleContext.clear();
        if (!this.backcolor)
            return;
        this.visibleContext.drawFill(pixelColor(this.backcolor));
    }
    get gain() { return this._gain; }
    set gain(value) {
        if (this._gain === value)
            return;
        this._gain = value;
        if (this.playing) {
            [...this.sourcesByClip.keys()].forEach(clip => this.adjustSourceGain(clip));
        }
        this.visibleContext.emit(exports.EventType.Volume);
    }
    get seconds() {
        if (!this.audibleContext)
            throw Errors.internal + 'audibleContext';
        const ellapsed = this.audibleContext.currentTime - this.contextSeconds;
        return ellapsed + this.mashSeconds;
    }
    startContext() {
        if (this.bufferSource)
            throw Errors.internal + 'bufferSource';
        if (this.playing)
            throw Errors.internal + 'playing';
        this.bufferSource = this.audibleContext.createBufferSource();
        this.bufferSource.loop = true;
        this.bufferSource.buffer = this.audibleContext.createBuffer(this.buffer);
        this.bufferSource.connect(this.audibleContext.destination);
        this.bufferSource.start(0);
    }
    startPlaying(time, clips) {
        // console.log(this.constructor.name, "startPlaying")
        if (!this.bufferSource)
            throw Errors.internal + 'bufferSource';
        if (this.playing)
            throw Errors.internal + 'playing';
        const { seconds } = time;
        this.playing = true;
        this.mashSeconds = seconds;
        this.contextSeconds = this.audibleContext.currentTime;
        if (!this.createSources(clips)) {
            this.stopPlaying();
            return false;
        }
        // console.log(this.constructor.name, "startPlaying", this.mashSeconds, this.contextSeconds)
        return true;
    }
    stopPlaying() {
        // console.log(this.constructor.name, "stopPlaying")
        if (!this.playing)
            return;
        this.playing = false;
        if (this.bufferSource)
            this.bufferSource.stop();
        this.destroySources();
        this.mashSeconds = 0;
        this.contextSeconds = 0;
        if (!this.bufferSource)
            return;
        this.bufferSource.disconnect(this.audibleContext.destination);
        delete this.bufferSource;
    }
    get visibleContext() { return this._visibleContext; }
    set visibleContext(value) { this._visibleContext = value; }
}

class MashClass extends InstanceClass {
    constructor(...args) {
        super(...args);
        this.audio = [];
        this._backcolor = Default.mash.backcolor;
        this._buffer = Default.mash.buffer;
        this._gain = Default.mash.gain;
        this.loop = false;
        this._paused = true;
        this._playing = false;
        this.quantize = Default.mash.quantize;
        this.video = [];
        this._id ||= Id();
        // console.log("Mash constructor", this.id)
        const object = args[0] || {};
        const { audio, backcolor, label, loop, media, quantize, video, audibleContext, buffer, gain, visibleContext, } = object;
        if (typeof loop === "boolean")
            this.loop = loop;
        if (quantize && Is.aboveZero(quantize))
            this.quantize = quantize;
        if (label && Is.populatedString(label))
            this.label = label;
        if (backcolor && Is.populatedString(backcolor))
            this._backcolor = backcolor;
        if (media)
            media.forEach(definition => {
                const { id: definitionId, type } = definition;
                if (!(type && Is.populatedString(type)))
                    throw Errors.type + 'Mash.constructor media';
                const definitionType = type;
                if (!DefinitionTypes.includes(definitionType))
                    throw Errors.type + definitionType;
                if (!(definitionId && Is.populatedString(definitionId))) {
                    throw Errors.invalid.definition.id + JSON.stringify(definition);
                }
                return MovieMasher[definitionType].definition(definition);
            });
        if (audio)
            this.audio.push(...audio.map((track, index) => new TrackClass(this.trackOptions(track, index, exports.TrackType.Audio))));
        else
            this.audio.push(new TrackClass({ type: exports.TrackType.Audio }));
        if (video)
            this.video.push(...video.map((track, index) => new TrackClass(this.trackOptions(track, index, exports.TrackType.Video))));
        else
            this.video.push(new TrackClass({ type: exports.TrackType.Video }));
        if (buffer && Is.aboveZero(buffer))
            this.buffer = buffer;
        if (typeof gain !== "undefined" && Is.positive(gain))
            this._gain = gain;
        if (audibleContext)
            this._audibleContext = audibleContext;
        if (visibleContext) {
            // console.log("Mash constructor visibleContext")
            this._visibleContext = visibleContext;
        }
    }
    addClipsToTrack(clips, trackIndex = 0, insertIndex = 0) {
        // console.log(this.constructor.name, "addClipsToTrack", trackIndex, insertIndex)
        this.assureClipsHaveFrames(clips);
        const [clip] = clips;
        const newTrack = this.clipTrackAtIndex(clip, trackIndex);
        if (!newTrack)
            throw Errors.invalid.track;
        const oldTrack = Is.positive(clip.track) && this.clipTrack(clip);
        this.emitIfFramesChange(() => {
            if (oldTrack && oldTrack !== newTrack) {
                // console.log("addClipsToTrack", newTrack.index, oldTrack.index)
                oldTrack.removeClips(clips);
            }
            newTrack.addClips(clips, insertIndex);
        });
    }
    addTrack(trackType) {
        const array = this[trackType];
        // console.log("addTrack", trackType, array.length)
        const options = { type: trackType, index: array.length };
        const track = new TrackClass(options);
        array.push(track);
        this.visibleContext.emit(exports.EventType.Track);
        return track;
    }
    assureClipsHaveFrames(clips) {
        clips.filter(clip => !Is.positive(clip.frames)).forEach(clip => {
            const definition = clip.definition;
            const duration = definition.duration;
            clip.frames = Time.fromSeconds(duration, this.quantize, 'floor').frame;
        });
    }
    get audibleContext() {
        if (!this._audibleContext) {
            this._audibleContext = ContextFactoryInstance.audible();
            if (this._composition)
                this.composition.audibleContext = this._audibleContext;
        }
        return this._audibleContext;
    }
    set audibleContext(value) {
        if (this._audibleContext !== value) {
            this._audibleContext = value;
            if (this._composition)
                this.composition.audibleContext = value;
        }
    }
    get backcolor() { return this._backcolor; }
    set backcolor(value) {
        this._backcolor = value;
        if (this._composition)
            this.composition.backcolor = value;
    }
    get buffer() { return this._buffer; }
    set buffer(value) {
        if (!Is.aboveZero(value))
            throw Errors.invalid.argument + 'buffer ' + value;
        if (this._buffer !== value) {
            this._buffer = value;
            if (this._composition)
                this.composition.buffer = value;
        }
    }
    get bufferFrames() { return this.buffer * this.quantize; }
    get bufferTime() { return Time.fromSeconds(this.buffer); }
    changeClipFrames(clip, value) {
        let limitedValue = Math.max(1, value); // frames value must be > 0
        const max = clip.maxFrames(this.quantize); // only audible returns nonzero
        if (Is.aboveZero(max))
            limitedValue = Math.min(max, limitedValue);
        const track = this.clipTrack(clip);
        this.emitIfFramesChange(() => {
            clip.frames = limitedValue;
            track.sortClips(track.clips);
        });
    }
    changeClipTrimAndFrames(clip, value, frames) {
        let limitedValue = Math.max(0, value);
        const max = clip.maxFrames(this.quantize, 1); // do not remove last frame
        if (Is.aboveZero(max))
            limitedValue = Math.min(max, limitedValue);
        const newFrames = frames - limitedValue;
        const track = this.clipTrack(clip);
        this.emitIfFramesChange(() => {
            clip.trim = limitedValue;
            clip.frames = newFrames;
            track.sortClips(track.clips);
        });
    }
    clipIntersects(clip, range) {
        return clip.timeRange(this.quantize).intersects(range);
    }
    clipTrack(clip) {
        return this.clipTrackAtIndex(clip, clip.track);
    }
    clipTrackAtIndex(clip, index = 0) {
        return this.trackOfTypeAtIndex(clip.trackType, index);
    }
    clips(timeRange, trackRange) {
        const rangeTracks = this.tracksInRange(trackRange);
        const inTracks = this.clipsInTracks(rangeTracks);
        if (!timeRange)
            return inTracks;
        return this.filterIntersecting(inTracks, timeRange);
    }
    clipsAtTimes(start, end) {
        const objects = this.clipsVisible(start, end);
        if (end)
            objects.push(...this.clipsAudible(start, end));
        return [...new Set(objects)];
    }
    clipsAudible(start, end) {
        const range = end && TimeRange.fromTimes(start, end);
        return this.clipsAudibleInTracks.filter(clip => {
            const clipRange = clip.timeRange(this.quantize);
            if (range)
                return clipRange.intersects(range);
            return clipRange.intersectsTime(start);
        });
    }
    clipsInTracks(tracks) {
        const clipTracks = tracks || this.tracks;
        return clipTracks.map(track => track.clips).flat();
    }
    filterIntersecting(clips, timeRange) {
        const range = timeRange.scale(this.quantize);
        return clips.filter(clip => this.clipIntersects(clip, range));
    }
    get clipsAudibleInTracks() {
        return this.clipsInTracks().filter(clip => clip.audible && !clip.muted);
    }
    clipsAudibleInTimeRange(timeRange) {
        return this.filterIntersecting(this.clipsAudibleInTracks, timeRange);
    }
    get clipsVideo() { return this.video.flatMap(track => track.clips); }
    clipsVisible(start, end) {
        const range = end && TimeRange.fromTimes(start, end);
        return this.clipsVideo.filter(clip => {
            const clipRange = clip.timeRange(this.quantize);
            if (range)
                return clipRange.intersects(range);
            return clipRange.intersectsTime(start);
        });
    }
    clipsVisibleAtTime(time) {
        return this.clipsVisibleInTimeRange(TimeRange.fromTime(time));
    }
    clipsVisibleSlice(frame, frames) {
        const range = TimeRange.fromArgs(frame, this.quantize, frames);
        return this.clipsVisibleInTimeRange(range);
    }
    clipsVisibleInTimeRange(timeRange) {
        const range = timeRange.scale(this.quantize);
        return this.clipsVideo.filter(clip => this.clipIntersects(clip, range));
    }
    compositeAudible() {
        const clips = this.clipsAudibleInTimeRange(this.timeRangeToBuffer);
        return this.composition.compositeAudible(clips);
    }
    get composition() {
        if (!this._composition) {
            const options = {
                audibleContext: this.audibleContext,
                backcolor: this.backcolor,
                buffer: this.buffer,
                gain: this.gain,
                quantize: this.quantize,
                visibleContext: this.visibleContext,
            };
            this._composition = new Composition(options);
        }
        return this._composition;
    }
    compositeVisible() {
        const { time } = this;
        this.composition.compositeVisible(time, this.clipsVisibleAtTime(time));
    }
    compositeVisibleRequest() {
        const { time } = this;
        this.composition.compositeVisibleRequest(time, this.clipsVisibleAtTime(time));
    }
    destroy() {
        delete this._visibleContext;
        delete this._audibleContext;
        delete this._composition;
    }
    drawAtInterval() {
        // console.log(this.constructor.name, "drawAtInterval playing: ", this._playing)
        if (!this._playing)
            return;
        const time = this.time.withFrame(this.time.frame + 1);
        const seconds = this.playing ? this.composition.seconds : time.seconds;
        if (seconds < this.endTime.seconds) {
            if (seconds >= time.seconds)
                this.drawTime(time);
        }
        else {
            // console.log(this.constructor.name, "drawAtInterval finished at", seconds, this.endTime.seconds)
            if (this.loop)
                this.seekToTime(this.time.withFrame(0));
            else {
                this.paused = true;
                this.visibleContext.emit(exports.EventType.Ended);
            }
        }
    }
    drawTime(time) {
        const timeChange = time !== this.time;
        this.drawnTime = time;
        this.compositeVisibleRequest();
        this.visibleContext.emit(timeChange ? exports.EventType.Time : exports.EventType.Loaded);
    }
    get duration() { return Time.fromArgs(this.frames, this.quantize).seconds; }
    emitIfFramesChange(method) {
        const origFrames = this.frames;
        method();
        const { frames } = this;
        if (origFrames !== frames) {
            this.visibleContext.emit(exports.EventType.Duration);
            if (this.frame > frames)
                this.seekToTime(Time.fromArgs(frames, this.quantize));
        }
    }
    get endTime() { return Time.fromArgs(this.frames, this.quantize); }
    get frame() { return this.time.scale(this.quantize, "floor").frame; }
    get frames() {
        return Math.max(0, ...this.tracks.map(track => track.frames));
    }
    get gain() { return this._gain; }
    set gain(value) {
        if (!Is.positive(value))
            throw Errors.invalid.argument + 'gain ' + value;
        if (this._gain !== value) {
            this._gain = value;
            this.composition.gain = value;
        }
    }
    handleAction(action) {
        this.visibleContext.emit(exports.EventType.Action, { action });
        if (action instanceof ChangeAction) {
            const changeAction = action;
            const { property } = changeAction;
            if (property === "gain") {
                if (this.playing && Is.aboveZero(this.gain)) {
                    this.composition.adjustSourceGain(changeAction.target);
                }
                return;
            }
        }
        this.stopLoadAndDraw();
    }
    get startAndEnd() {
        const { time } = this;
        const times = [time];
        if (!this.paused)
            times.push(time.add(this.bufferTime));
        return times;
    }
    load() {
        const [start, end] = this.startAndEnd;
        // console.log(this.constructor.name, "load", start, end)
        const promises = this.clipsAtTimes(start, end).map(clip => clip.load(this.quantize, start, end));
        return Promise.all(promises).then();
    }
    loadAndComposite() { this.load().then(() => { this.compositeVisibleRequest(); }); }
    get loadedDefinitions() {
        const map = new Map();
        const [start, end] = this.startAndEnd;
        this.clipsAtTimes(start, end).forEach(clip => {
            const { definitions } = clip;
            const times = [clip.definitionTime(this.quantize, start)];
            if (end)
                times.push(clip.definitionTime(this.quantize, end));
            definitions.forEach(definition => {
                if (!map.has(definition))
                    map.set(definition, []);
                const definitionTimes = map.get(definition);
                if (!definitionTimes)
                    throw Errors.internal;
                definitionTimes.push(times);
            });
        });
        return map;
    }
    maxTracks(type) {
        return type ? this[type].length : this.audio.length + this.video.length;
    }
    get media() {
        return [...new Set(this.clipsInTracks().flatMap(clip => clip.definitions))];
    }
    get paused() { return this._paused; }
    set paused(value) {
        const forcedValue = value || !this.frames;
        // console.log(this.constructor.name, "set paused", forcedValue)
        if (this._paused === forcedValue)
            return;
        this._paused = forcedValue;
        if (forcedValue) {
            this.playing = false;
            if (this._bufferTimer) {
                clearInterval(this._bufferTimer);
                delete this._bufferTimer;
            }
            // console.log("Mash emit", EventType.Pause)
            this.visibleContext.emit(exports.EventType.Pause);
        }
        else {
            this.composition.startContext();
            if (!this._bufferTimer) {
                this._bufferTimer = setInterval(() => { this.load(); }, Math.round(this.buffer / 2));
            }
            this.load().then(() => { this.playing = true; });
            // console.log("Mash emit", EventType.Play)
            this.visibleContext.emit(exports.EventType.Play);
        }
    }
    get playing() { return this._playing; }
    set playing(value) {
        // console.log(this.constructor.name, "set playing", value)
        if (this._playing !== value) {
            if (value) {
                const clips = this.clipsAudibleInTimeRange(this.timeRangeToBuffer);
                if (!this.composition.startPlaying(this.time, clips)) {
                    // console.log(this.constructor.name, "set playing", value, "audio not cached", this.time, clips.length)
                    // audio was not cached
                    return;
                }
                this._drawAtInterval = setInterval(() => { this.drawAtInterval(); }, 500 / this.time.fps);
                this.visibleContext.emit(exports.EventType.Playing);
            }
            else {
                this.composition.stopPlaying();
                if (this._drawAtInterval) {
                    clearInterval(this._drawAtInterval);
                    delete this._drawAtInterval;
                }
            }
            this._playing = value;
        }
    }
    removeClipsFromTrack(clips) {
        const [clip] = clips;
        const track = this.clipTrack(clip);
        this.emitIfFramesChange(() => { track.removeClips(clips); });
    }
    removeTrack(trackType) {
        const array = this[trackType];
        this.emitIfFramesChange(() => { array.pop(); });
        this.visibleContext.emit(exports.EventType.Track);
    }
    seekToTime(time) {
        if (this.seekTime !== time) {
            this.seekTime = time;
            // console.log("seekToTime", time)
            this.visibleContext.emit(exports.EventType.Seeking);
            this.visibleContext.emit(exports.EventType.Time);
        }
        return this.stopLoadAndDraw(true);
    }
    get stalled() { return !this.paused && !this.playing; }
    stopLoadAndDraw(seeking) {
        const { time, paused, playing } = this;
        if (playing)
            this.playing = false;
        return this.load().then(() => {
            if (time === this.time) { // otherwise we must have gotten a seek call
                if (seeking) {
                    delete this.seekTime;
                    this.visibleContext.emit(exports.EventType.Seeked);
                }
                this.drawTime(time);
                if (!paused) {
                    this.composition.startContext();
                    this.playing = true;
                }
            }
        });
    }
    get time() {
        return this.seekTime || this.drawnTime || Time.fromArgs(0, this.quantize);
    }
    get timeRange() {
        const time = Time.fromArgs(this.frames, this.quantize);
        return TimeRange.fromTime(this.time, time.scale(this.time.fps).frame);
    }
    get timeRangeToBuffer() {
        const { time, quantize, buffer, paused } = this;
        if (paused) {
            const singleFrame = TimeRange.fromArgs(time.scale(quantize, 'floor').frame, quantize, 1);
            // console.log(this.constructor.name, "timeRangeToBuffer paused", singleFrame)
            return singleFrame;
        }
        const frames = TimeRange.fromTimes(time, Time.fromSeconds(buffer + time.seconds, time.fps));
        // console.log(this.constructor.name, "timeRangeToBuffer !PAUSED", frames)
        return frames;
    }
    toJSON() {
        return {
            label: this.label,
            quantize: this.quantize,
            backcolor: this.backcolor || "",
            id: this.id,
            media: this.media,
            audio: this.audio,
            video: this.video,
        };
    }
    trackOfTypeAtIndex(type, index = 0) {
        if (!Is.positive(index)) {
            console.error(Errors.invalid.track, index, index?.constructor.name);
            throw Errors.invalid.track;
        }
        // console.log("trackOfTypeAtIndex", type, index)
        return this[type][index];
    }
    trackOptions(object, index, type) {
        const { clips } = object;
        if (!(clips && Is.populatedArray(clips)))
            return { type, index };
        const objects = clips.map(clip => {
            const { id } = clip;
            if (!id)
                throw Errors.id;
            const definition = Definitions.fromId(id);
            const clipWithTrack = { track: index, ...clip };
            return definition.instanceFromObject(clipWithTrack);
        });
        this.assureClipsHaveFrames(objects);
        return { type, index, clips: objects };
    }
    get tracks() { return Object.values(exports.TrackType).map(av => this[av]).flat(); }
    tracksInRange(trackRange) {
        if (!trackRange)
            return;
        const { type } = trackRange;
        const tracksMax = this.maxTracks(type);
        const range = trackRange.relative ? trackRange.withMax(tracksMax) : trackRange;
        const inRange = [];
        if (type !== exports.TrackType.Video) {
            inRange.push(...this.audio.slice(range.first, range.count));
        }
        if (type !== exports.TrackType.Audio) {
            inRange.push(...this.video.slice(range.first, range.count));
        }
        // console.log(`tracksInRange ${trackRange} -> ${range}`, tracksMax, type, inRange.length)
        return inRange;
    }
    get visibleContext() {
        if (!this._visibleContext) {
            // console.log("Mash get visibleContext creating")
            this._visibleContext = ContextFactoryInstance.visible();
            if (this._composition)
                this.composition.visibleContext = this._visibleContext;
        }
        return this._visibleContext;
    }
    set visibleContext(value) {
        // console.log("Mash set visibleContext", value)
        if (this._visibleContext !== value) {
            this._visibleContext = value;
            if (this._composition)
                this.composition.visibleContext = value;
        }
    }
}

class MashDefinitionClass extends DefinitionClass {
    constructor(...args) {
        super(...args);
        this.id = "com.moviemasher.mash.default";
        this.retain = true;
        this.type = exports.DefinitionType.Mash;
        this.properties.push(new Property({ name: "backcolor", type: exports.DataType.Rgba, value: "#00000000" }));
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new MashClass({ ...this.instanceObject, ...object });
        return instance;
    }
}

const MashDefaultId = "com.moviemasher.mash.default";
const mashDefinition = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) && Definitions.installed(id) ? id : MashDefaultId;
    return Definitions.fromId(idString);
};
const mashDefinitionFromId = (id) => {
    return mashDefinition({ id });
};
const mashInstance = (object) => {
    const definition = mashDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const mashFromId = (id) => {
    return mashInstance({ id });
};
const mashInitialize = () => {
    new MashDefinitionClass({ id: MashDefaultId });
};
const mashDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return mashDefinition(object);
};
const MashFactoryImplementation = {
    define: mashDefine,
    definition: mashDefinition,
    definitionFromId: mashDefinitionFromId,
    fromId: mashFromId,
    initialize: mashInitialize,
    instance: mashInstance,
};
Factories.mash = MashFactoryImplementation;

const classes = {
    AddTrack: AddTrackAction,
    AddClipsToTrack: AddClipToTrackAction,
    MoveClips: MoveClipsAction,
    AddEffect: AddEffectAction,
    Change: ChangeAction,
    ChangeFrames: ChangeFramesAction,
    ChangeTrim: ChangeTrimAction,
    Split: SplitAction,
    Freeze: FreezeAction,
    MoveEffects: MoveEffectsAction,
    RemoveClips: RemoveClipsAction,
};
class ActionFactoryClass {
    createFromObject(object) {
        const { type } = object;
        if (typeof type !== "string")
            throw Errors.type + JSON.stringify(object);
        return new classes[Capitalize(type)](object);
    }
}
const ActionFactory = new ActionFactoryClass();

class MasherClass extends InstanceClass {
    constructor(...args) {
        super(...args);
        this.autoplay = Default.masher.autoplay;
        this._buffer = Default.masher.buffer;
        this._fps = Default.masher.fps;
        this._loop = Default.masher.loop;
        this._muted = false;
        this._paused = true;
        this.precision = Default.masher.precision;
        this.selectedClipObject = {};
        this._selectedClips = [];
        this._selectedEffects = [];
        this._volume = Default.masher.volume;
        this._id ||= Id();
        // console.log("Masher constructor", this.id)
        const [object] = args;
        const { autoplay, precision, loop, fps, volume, buffer, audibleContext, mash, canvas, } = object;
        if (typeof autoplay !== "undefined")
            this.autoplay = autoplay;
        if (typeof precision !== "undefined")
            this.precision = precision;
        if (typeof loop !== "undefined")
            this._loop = loop;
        if (typeof audibleContext !== "undefined")
            this._audibleContext = audibleContext;
        if (canvas)
            this.visibleContext = ContextFactoryInstance.fromCanvas(canvas);
        else
            this.visibleContext = ContextFactoryInstance.visible();
        if (typeof fps !== "undefined")
            this._fps = fps;
        if (typeof volume !== "undefined")
            this._volume = volume;
        if (typeof buffer !== "undefined")
            this._buffer = buffer;
        if (mash)
            this.mash = mash;
    }
    actionCreate(object) {
        const mash = object.mash || this.mash;
        const actions = object.actions || this.actions;
        const undoSelectedClips = object.undoSelectedClips || this.selectedClips;
        const undoSelectedEffects = object.undoSelectedEffects || this.selectedEffects;
        const redoSelectedClips = object.redoSelectedClips || this.selectedClips;
        const redoSelectedEffects = object.redoSelectedEffects || this.selectedEffects;
        const clone = {
            ...object,
            actions,
            mash,
            undoSelectedClips,
            undoSelectedEffects,
            redoSelectedClips,
            redoSelectedEffects,
        };
        const action = ActionFactory.createFromObject(clone);
        this.actions.add(action);
        this.handleAction(this.actions.redo());
    }
    get actions() {
        if (!this._actions) {
            this._actions = new Actions({ mash: this.mash });
        }
        return this._actions;
    }
    add(object, frameOrIndex = 0, trackIndex = 0) {
        if (!Is.populatedObject(object))
            throw Errors.argument + 'add';
        const { id } = object;
        const definitionFromId = id && Definitions.installed(id) ? Definitions.fromId(id) : false;
        const type = object.type || (definitionFromId && definitionFromId.type);
        if (!type)
            throw Errors.type + 'Masher.add ' + id + JSON.stringify(definitionFromId);
        if (type === exports.DefinitionType.Effect) {
            const effectDefinition = MovieMasher.effect.definition(object);
            const effect = effectDefinition.instance;
            return this.addEffect(effect, frameOrIndex).then(() => effect);
        }
        const clipType = type;
        if (!ClipTypes.includes(clipType))
            throw Errors.type + type;
        const definitionType = type;
        const definition = MovieMasher[definitionType].definition(object);
        const clip = definition.instance;
        return this.addClip(clip, frameOrIndex, trackIndex).then(() => clip);
    }
    addClip(clip, frameOrIndex = 0, trackIndex = 0) {
        const { trackType } = clip;
        const clips = [clip];
        const options = {
            clip,
            type: exports.ActionType.AddClipsToTrack,
            redoSelectedClips: clips,
            trackType,
        };
        const track = this.mash.trackOfTypeAtIndex(trackType, trackIndex);
        const trackCount = this.mash[trackType].length;
        if (track.isMainVideo) {
            options.insertIndex = frameOrIndex;
            options.createTracks = Math.min(1, Math.max(0, 1 - trackCount));
        }
        else {
            options.trackIndex = trackIndex;
            clip.frame = track.frameForClipsNearFrame(clips, frameOrIndex);
            options.createTracks = Math.max(0, trackIndex + 1 - trackCount);
        }
        this.actionCreate(options);
        return this.loadMashAndDraw();
    }
    addEffect(effect, insertIndex = 0) {
        // console.log(this.constructor.name, "addEffect", object, index)
        const { effects } = this.selectedClipOrThrow;
        if (!effects)
            throw Errors.selection;
        const undoEffects = [...effects];
        const redoEffects = [...effects];
        const redoSelectedEffects = [effect];
        redoEffects.splice(insertIndex, 0, effect);
        const options = {
            effects,
            undoEffects,
            redoEffects,
            redoSelectedEffects,
            type: exports.ActionType.MoveEffects
        };
        this.actionCreate(options);
        return this.loadMashAndDraw();
    }
    addTrack(trackType = exports.TrackType.Video) {
        this.actionCreate({ trackType, type: exports.ActionType.AddTrack });
    }
    get audibleContext() {
        if (!this._audibleContext) {
            this._audibleContext = ContextFactoryInstance.audible();
            if (this._mash)
                this.mash.audibleContext = this._audibleContext;
        }
        return this._audibleContext;
    }
    set audibleContext(value) {
        if (this._audibleContext !== value) {
            this._audibleContext = value;
            if (this._mash)
                this.mash.audibleContext = value;
        }
    }
    get buffer() { return this._buffer; }
    set buffer(value) {
        if (this._buffer !== value) {
            this._buffer = value;
            this.mash.buffer = value;
        }
    }
    can(method) {
        const z = this._selectedClips.length;
        switch (method) {
            case 'save': return this.actions.canSave;
            case 'undo': return this.actions.canUndo;
            case 'redo': return this.actions.canRedo;
            case 'copy': return z > 0;
            case 'cut':
            case 'remove': return !!z; // TODO: check removing won't create transition problem
            case 'split': return z === 1 && this.clipCanBeSplit(this.selectedClipOrThrow, this.time, this.mash.quantize);
            case 'freeze': return (z === 1
                && exports.DefinitionType.Video === this.selectedClipOrThrow.type
                && this.clipCanBeSplit(this.selectedClipOrThrow, this.time, this.mash.quantize));
            default: throw Errors.argument;
        }
    }
    get canvas() { return this.visibleContext.canvas; }
    set canvas(value) {
        if (!value)
            throw Errors.invalid.canvas;
        // make sure canvas hasn't been stretched
        const style = window.getComputedStyle(value);
        const { width, height } = style;
        if (!(width && height))
            throw Errors.invalid.canvas;
        const widthTrimmed = Number(width.slice(0, -2));
        const heightTrimmed = Number(height.slice(0, -2));
        if (Is.nan(widthTrimmed) || Is.nan(heightTrimmed))
            throw Errors.invalid.canvas;
        value.width = widthTrimmed;
        value.height = heightTrimmed;
        // console.log("set canvas", widthTrimmed, 'x', heightTrimmed, value)
        this.visibleContext.canvas = value;
        this.mash.compositeVisible();
    }
    change(property, value) {
        if (Is.populatedObject(this.selectedClip)) {
            if (Is.populatedObject(this.selectedEffect))
                this.changeEffect(property, value, this.selectedEffect);
            else
                this.changeClip(property, value, this.selectedClipOrThrow);
        }
        else
            this.changeMash(property, value);
    }
    changeClip(property, value, clip) {
        // console.log(this.constructor.name, "changeClip", property)
        if (!Is.populatedString(property))
            throw Errors.property + "changeClip " + property;
        const [transform, transformProperty] = property.split(".");
        if (transformProperty) {
            this.changeTransformer(transform, transformProperty, value);
            return;
        }
        const target = clip || this.selectedClipOrThrow;
        const redoValue = typeof value === "undefined" ? target.value(property) : value;
        if (this.currentActionReusable(target, property)) {
            const changeAction = this.actions.currentAction;
            changeAction.updateAction(redoValue);
            this.handleAction(changeAction);
            return;
        }
        const undoValue = typeof value === "undefined" ? this.pristineOrThrow[property] : target.value(property);
        const options = { property, target, redoValue, undoValue };
        switch (options.property) {
            case 'frames': {
                options.type = exports.ActionType.ChangeFrames;
                break;
            }
            case 'trim': {
                options.type = exports.ActionType.ChangeTrim;
                // TODO: make sure there's a test for this
                // not sure where this was derived from - using original clip??
                options.frames = target.frames + options.undoValue;
                break;
            }
            default: options.type = exports.ActionType.Change;
        }
        this.actionCreate(options);
    }
    changeEffect(property, value, effect) {
        // console.log(this.constructor.name, "changeEffect", property)
        if (!Is.populatedString(property))
            throw Errors.property;
        const target = effect || this.selectedEffectOrThrow;
        const redoValue = typeof value === "undefined" ? target.value(property) : value;
        if (this.currentActionReusable(target, property)) {
            const changeAction = this.actions.currentAction;
            changeAction.updateAction(redoValue);
            this.handleAction(changeAction);
            return;
        }
        const undoValue = typeof value === "undefined" ? this.pristineEffectOrThrow[property] : target.value(property);
        const options = {
            type: exports.ActionType.Change, target, property, redoValue, undoValue
        };
        this.actionCreate(options);
    }
    changeMash(property, value) {
        if (!this.mash.propertyNames.includes(property))
            throw Errors.unknownMash;
        if (!this._pristine)
            throw Errors.internal;
        const target = this.mash;
        const redoValue = typeof value === "undefined" ? target.value(property) : value;
        if (this.currentActionReusable(target, property)) {
            const changeAction = this.actions.currentAction;
            changeAction.updateAction(redoValue);
            this.handleAction(changeAction);
            return;
        }
        const undoValue = typeof value === "undefined" ? this._pristine[property] : target.value(property);
        const options = {
            target,
            property,
            redoValue,
            undoValue,
            type: exports.ActionType.Change,
        };
        this.actionCreate(options);
    }
    changeTransformer(type, property, value) {
        // console.log(this.constructor.name, "changeTransformer", type, property)
        if (!Is.populatedString(type))
            throw Errors.type + "changeTransformer " + type;
        if (!Is.populatedString(property))
            throw Errors.property + "changeTransformer " + property;
        if (!this._pristine)
            throw Errors.internal + "changeTransformer _pristine";
        const target = this.selectedClipOrThrow;
        const transformType = type;
        const transformable = target;
        // make sure first component is merger or scaler
        if (!TransformTypes.includes(transformType))
            throw Errors.property + "type " + type;
        const transformTarget = transformable[transformType];
        const redoValue = typeof value === "undefined" ? transformTarget.value(property) : value;
        const pristineTarget = this._pristine[transformType];
        if (typeof pristineTarget !== "object")
            throw Errors.internal + JSON.stringify(this._pristine);
        const undoValue = pristineTarget[property];
        if (typeof undoValue === "undefined")
            throw Errors.property + 'pristine ' + property + JSON.stringify(pristineTarget);
        const options = { property, target: transformTarget, redoValue, undoValue, type: exports.ActionType.Change };
        if (this.currentActionReusable(transformTarget, property)) {
            const changeAction = this.actions.currentAction;
            changeAction.updateAction(redoValue);
            this.handleAction(changeAction);
            return;
        }
        this.actionCreate(options);
    }
    clipCanBeSplit(clip, time, quantize) {
        if (!Is.object(clip))
            return false;
        // true if now intersects clip time, but is not start or end frame
        const range = TimeRange.fromTime(time);
        const clipRange = clip.timeRange(quantize);
        // ranges must intersect
        if (!clipRange.intersects(range))
            return false;
        const scaled = range.scale(clipRange.fps);
        if (scaled.frame === clipRange.frame)
            return false;
        if (scaled.end === clipRange.end)
            return false;
        return true;
    }
    clips(timeRange, trackRange) {
        return this.mash.clips(timeRange, trackRange);
    }
    currentActionReusable(target, property) {
        if (!this.actions.currentActionLast)
            return false;
        const action = this.actions.currentAction;
        if (!(action instanceof ChangeAction))
            return false;
        return action.target === target && action.property === property;
    }
    get currentTime() { return this.mash.drawnTime ? this.mash.drawnTime.seconds : 0; }
    get definitions() { return this.mash.media; }
    // call when player removed from DOM
    destroy() { MovieMasher.masher.destroy(this); }
    draw() { this.mash.compositeVisible(); }
    get duration() { return this.mash.duration; }
    get endTime() { return this.mash.endTime.scale(this.fps, 'floor'); }
    filterClipSelection(value) {
        const clips = Array.isArray(value) ? value : [value];
        const [firstClip] = clips;
        if (!firstClip)
            return [];
        const { trackType, track } = firstClip;
        //  must all be on same track
        const trackClips = clips.filter(clip => (clip.track === track && clip.trackType === trackType)).sort(byFrame);
        if (track || trackType === exports.TrackType.Audio)
            return trackClips;
        // must be abutting each other on main track
        let abutting = true;
        return trackClips.filter((clip, index) => {
            if (!abutting)
                return false;
            if (index === trackClips.length - 1)
                return true;
            abutting = clip.frame + clip.frames === trackClips[index + 1].frame;
            return true;
        });
    }
    get fps() { return this._fps; }
    set fps(value) {
        if (!Is.aboveZero(value))
            throw Errors.fps;
        if (this._fps !== value) {
            this._fps = value;
            this.visibleContext.emit(exports.EventType.Fps);
            this.time = this.time.scale(value);
        }
    }
    get frame() { return this.time.frame; }
    set frame(value) { this.goToTime(Time.fromArgs(value, this.fps)); }
    get frames() { return this.endTime.frame; }
    freeze() {
        const clip = this.selectedClipOrThrow;
        if (!this.clipCanBeSplit(clip, this.time, this.mash.quantize)) {
            throw Errors.invalid.action;
        }
        if (exports.DefinitionType.Video !== clip.type) {
            throw Errors.invalid.action;
        }
        const freezeClip = clip;
        const scaled = this.time.scale(this.mash.quantize);
        const trackClips = this.mash.clipTrack(freezeClip).clips;
        const insertClip = freezeClip.copy;
        const frozenClip = freezeClip.copy;
        const options = {
            frames: freezeClip.frames - (scaled.frame - freezeClip.frame),
            freezeClip,
            frozenClip,
            insertClip,
            trackClips,
            redoSelectedClips: [frozenClip],
            index: 1 + trackClips.indexOf(freezeClip),
            type: exports.ActionType.Freeze,
        };
        frozenClip.frame = scaled.frame;
        frozenClip.frames = 1;
        frozenClip.trim = freezeClip.trim + (scaled.frame - freezeClip.frame);
        insertClip.frame = scaled.frame + 1;
        insertClip.frames = options.frames - 1;
        insertClip.trim = frozenClip.trim + 1;
        this.actionCreate(options);
    }
    get gain() { return this.muted ? 0.0 : this.volume; }
    goToTime(value) {
        return this.mash.seekToTime(value.scaleToFps(this.fps));
    }
    isSelected(object) {
        if (object instanceof EffectClass)
            return this.selectedEffects.includes(object);
        return this.selectedClips.includes(object);
    }
    handleAction(action) {
        this.mash.handleAction(action);
        this.selectedClips = action.selectedClips;
        this.selectedEffects = action.selectedEffects;
    }
    loadMash() { return this.mash.load(); }
    loadMashAndDraw() { return this.loadMash().then(() => { this.draw(); }); }
    get loadedDefinitions() { return this.mash.loadedDefinitions; }
    get loop() { return this._loop; }
    set loop(value) {
        this._loop = value;
        if (this._mash)
            this.mash.loop = value;
    }
    get mash() {
        if (!this._mash) {
            // console.trace("get mash")
            this._mash = MovieMasher.mash.instance(this.mashOptions());
        }
        return this._mash;
    }
    set mash(object) {
        if (this._mash === object)
            return;
        this.paused = true;
        if (this._mash)
            this._mash.destroy();
        this._selectedEffects = [];
        this._mash = object;
        // console.log("set mash getting visibleContext...")
        this._mash.visibleContext = this.visibleContext;
        // console.log("creating composition", this._mash.composition)
        // console.log("set mash got visibleContext!", this._visibleContext)
        this._mash.audibleContext = this.audibleContext;
        this._mash.buffer = this.buffer;
        this._mash.gain = this.gain;
        this._mash.loop = this.loop;
        if (this._actions) {
            this._actions.destroy();
            this._actions.mash = this._mash;
        }
        this.selectedClips = []; // so mash gets copied into _pristine
        this.goToTime(Time.fromArgs(0, this.fps));
        if (this.autoplay)
            this.paused = false;
    }
    mashOptions(mashObject = {}) {
        // console.log("mashOptions")
        return {
            ...mashObject,
            audibleContext: this.audibleContext,
            buffer: this.buffer,
            gain: this.gain,
            loop: this.loop,
            visibleContext: this.visibleContext,
        };
    }
    move(objectOrArray, moveType, frameOrIndex = 0, trackIndex = 0) {
        if (!Is.object(objectOrArray))
            throw Errors.argument + 'move';
        if (moveType === exports.MoveType.Effect) {
            this.moveEffects(objectOrArray, frameOrIndex);
            return;
        }
        this.moveClips(objectOrArray, frameOrIndex, trackIndex);
    }
    moveClips(clipOrArray, frameOrIndex = 0, trackIndex = 0) {
        // console.log("moveClips", "frameOrIndex", frameOrIndex, "trackIndex", trackIndex)
        if (!Is.positive(frameOrIndex))
            throw Errors.argument + 'moveClips frameOrIndex';
        if (!Is.positive(trackIndex))
            throw Errors.argument + 'moviClips trackIndex';
        const clips = this.filterClipSelection(clipOrArray);
        if (!Is.populatedArray(clips))
            throw Errors.argument + 'moviClips clips';
        const [firstClip] = clips;
        const { trackType, track: undoTrackIndex } = firstClip;
        const options = {
            clips,
            trackType,
            trackIndex,
            undoTrackIndex,
            type: exports.ActionType.MoveClips
        };
        const redoTrack = this.mash.trackOfTypeAtIndex(trackType, trackIndex);
        const undoTrack = this.mash.trackOfTypeAtIndex(trackType, undoTrackIndex);
        const currentIndex = redoTrack.clips.indexOf(firstClip);
        if (redoTrack.isMainVideo)
            options.insertIndex = frameOrIndex;
        if (undoTrack.isMainVideo) {
            options.undoInsertIndex = currentIndex;
            if (frameOrIndex < currentIndex)
                options.undoInsertIndex += clips.length;
        }
        if (!(redoTrack.isMainVideo && undoTrack.isMainVideo)) {
            const frames = clips.map(clip => clip.frame);
            const insertFrame = redoTrack.frameForClipsNearFrame(clips, frameOrIndex);
            const offset = insertFrame - firstClip.frame;
            if (!offset)
                return; // because there would be no change
            options.undoFrames = frames;
            options.redoFrames = frames.map(frame => frame + offset);
        }
        this.actionCreate(options);
    }
    moveEffects(effectOrArray, index = 0) {
        // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
        if (!Is.positive(index))
            throw Errors.argument;
        const array = Array.isArray(effectOrArray) ? effectOrArray : [effectOrArray];
        const moveEffects = array.filter(effect => effect instanceof EffectClass);
        if (!Is.populatedArray(moveEffects))
            throw Errors.argument;
        const { effects } = this.selectedClipOrThrow;
        const undoEffects = [...effects];
        const redoEffects = [];
        undoEffects.forEach((effect, i) => {
            if (i === index)
                redoEffects.push(...moveEffects);
            if (moveEffects.includes(effect))
                return;
            redoEffects.push(effect);
        });
        const options = {
            effects, undoEffects, redoEffects, type: exports.ActionType.MoveEffects
        };
        // console.log(this.constructor.name, "moveEffects", options)
        this.actionCreate(options);
    }
    get muted() { return this._muted; }
    set muted(value) {
        if (this._muted !== value) {
            this._muted = value;
            this.mash.gain = this.gain;
        }
    }
    pause() { this.paused = true; }
    get paused() { return this.mash.paused; }
    set paused(value) { if (this._mash)
        this.mash.paused = value; }
    play() { this.paused = false; }
    get position() {
        let per = 0;
        if (this.time.frame) {
            per = this.time.seconds / this.duration;
            if (per !== 1)
                per = parseFloat(per.toFixed(this.precision));
        }
        return per;
    }
    set position(value) {
        this.goToTime(Time.fromSeconds(this.duration * value, this.fps));
    }
    get positionStep() {
        return parseFloat(`0.${"0".repeat(this.precision - 1)}1`);
    }
    get pristineOrThrow() {
        if (!this._pristine)
            throw Errors.internal;
        return this._pristine;
    }
    get pristineEffectOrThrow() {
        if (!this._pristineEffect)
            throw Errors.internal;
        return this._pristineEffect;
    }
    redo() { if (this.actions.canRedo)
        this.handleAction(this.actions.redo()); }
    remove(objectOrArray, moveType) {
        if (!Is.object(objectOrArray))
            throw Errors.argument;
        if (moveType === exports.MoveType.Effect) {
            this.removeEffects(objectOrArray);
            return;
        }
        this.removeClips(objectOrArray);
    }
    removeClips(clipOrArray) {
        const clips = this.filterClipSelection(clipOrArray);
        if (!Is.populatedArray(clips))
            throw Errors.argument;
        const [firstClip] = clips;
        const track = this.mash.clipTrack(firstClip);
        const options = {
            redoSelectedClips: [],
            clips,
            track,
            index: track.clips.indexOf(firstClip),
            type: exports.ActionType.RemoveClips
        };
        this.actionCreate(options);
    }
    removeEffects(effectOrArray) {
        const array = Array.isArray(effectOrArray) ? effectOrArray : [effectOrArray];
        const removeEffects = array.filter(effect => effect instanceof EffectClass);
        if (!Is.populatedArray(removeEffects))
            throw Errors.argument;
        const { effects } = this.selectedClipOrThrow;
        const undoEffects = [...effects];
        const redoEffects = effects.filter(effect => !removeEffects.includes(effect));
        const options = {
            redoSelectedEffects: [],
            effects,
            undoEffects,
            redoEffects,
            type: exports.ActionType.MoveEffects
        };
        this.actionCreate(options);
    }
    save() { this.actions.save(); }
    select(object, toggleSelected = false) {
        if (!object) {
            this.selectedClips = [];
            return;
        }
        if (object instanceof EffectClass) {
            this.selectEffect(object, toggleSelected);
            return;
        }
        const { type } = object;
        if (type === exports.DefinitionType.Mash) {
            this.selectMash();
            return;
        }
        this.selectClip(object, toggleSelected);
    }
    get selectedClipsOrEffects() {
        return this.selectedEffects.length ? this.selectedEffects : this.selectedClips;
    }
    selectClip(clip, toggleSelected) {
        const array = [];
        if (clip) {
            if (toggleSelected) {
                array.push(...this.selectedClips);
                const index = this.selectedClips.indexOf(clip);
                if (index > -1)
                    array.splice(index, 1);
                else
                    array.push(clip);
            }
            else if (this.selectedClips.includes(clip))
                array.push(...this.selectedClips);
            else
                array.push(clip);
        }
        this.selectedClips = array;
    }
    selectEffect(effect, toggleSelected) {
        const array = [];
        if (effect) {
            if (toggleSelected) {
                array.push(...this.selectedEffects);
                const index = this.selectedEffects.indexOf(effect);
                if (index > -1)
                    array.splice(index, 1);
                else
                    array.push(effect);
            }
            else
                array.push(effect);
        }
        this.selectedEffects = array;
    }
    selectMash() {
        this.selectedClips = [];
    }
    get selectedClip() {
        if (this._selectedClips.length === 1)
            return this.selectedClipOrThrow;
        return this.selectedClipObject;
    }
    set selectedClip(value) {
        if (value && Is.populatedObject(value)) {
            const clip = value;
            const { type } = clip;
            const clipType = String(type);
            if (!ClipTypes.includes(clipType)) {
                // console.warn(this.constructor.name, "set selectedClip invalid type", value)
                return;
            }
            this.selectedClips = [clip];
        }
        else
            this.selectedClips = [];
    }
    get selectedClipOrMash() {
        const value = this.selectedClip;
        if (Is.populatedObject(value))
            return this.selectedClipOrThrow;
        return this.mash;
    }
    get selectedClipOrThrow() {
        const clip = this._selectedClips[0];
        if (!clip)
            throw Errors.selection;
        return clip;
    }
    get selectedClips() { return this._selectedClips; }
    set selectedClips(value) {
        this._selectedClips = this.filterClipSelection(value);
        this._pristine = this.selectedClipOrMash.propertyValues;
        this.selectedEffects = [];
    }
    get selectedEffect() {
        if (this._selectedEffects.length !== 1)
            return;
        return this._selectedEffects[0];
    }
    set selectedEffect(value) {
        if (value)
            this.selectedEffects = [value];
        else
            this.selectedEffects = [];
    }
    get selectedEffectOrThrow() {
        const effect = this.selectedEffect;
        if (!effect)
            throw Errors.selection;
        return effect;
    }
    get selectedEffects() { return this._selectedEffects; }
    set selectedEffects(value) {
        const { effects } = this.selectedClipOrMash;
        if (!effects) { // mash or multiple clips, or no effects
            this._selectedEffects = [];
            this._pristineEffect = {};
            return;
        }
        const array = effects;
        this._selectedEffects = value.filter(effect => array.includes(effect));
        this._pristineEffect = (this.selectedEffect && this.selectedEffect.propertyValues) || {};
    }
    get selectionObjects() {
        const selectedObjects = this.selectedClipsOrEffects;
        const object = selectedObjects.map((object) => object.propertyValues);
        return object;
    }
    get silenced() { return this._paused || this.muted || !this.gain; }
    split() {
        const splitClip = this.selectedClipOrThrow;
        if (!this.clipCanBeSplit(splitClip, this.time, this.mash.quantize)) {
            throw Errors.invalid.action;
        }
        const scaled = this.time.scale(this.mash.quantize);
        const undoFrames = splitClip.frames;
        const redoFrames = scaled.frame - splitClip.frame;
        const insertClip = splitClip.copy;
        insertClip.frames = undoFrames - redoFrames;
        insertClip.frame = scaled.frame;
        if (splitClip.propertyNames.includes("trim")) {
            insertClip.trim += redoFrames;
        }
        const trackClips = this.mash.clipTrack(splitClip).clips;
        const options = {
            type: exports.ActionType.Split,
            splitClip,
            insertClip,
            trackClips,
            redoFrames,
            undoFrames,
            index: 1 + trackClips.indexOf(splitClip),
            redoSelectedClips: [insertClip],
            undoSelectedClips: [splitClip],
        };
        this.actionCreate(options);
    }
    get time() { return this.mash.time; }
    set time(value) {
        if (value.equalsTime(this.time))
            return;
        this.goToTime(value);
    }
    get timeRange() { return this.mash.timeRange; }
    undo() { if (this.actions.canUndo)
        this.handleAction(this.actions.undo()); }
    get volume() { return this._volume; }
    set volume(value) {
        if (this._volume !== value) {
            if (!Is.positive(value))
                throw Errors.invalid.volume;
            this._volume = value;
            if (Is.aboveZero(value))
                this.muted = false;
            this.mash.gain = this.gain;
        }
    }
}

class MasherDefinitionClass extends DefinitionClass {
    constructor(...args) {
        super(...args);
        this.id = "com.moviemasher.masher.default";
        this.retain = true;
        this.type = exports.DefinitionType.Masher;
        this.properties.push(new Property({ name: "autoplay", type: exports.DataType.Boolean, value: Default.masher.autoplay }));
        this.properties.push(new Property({ name: "precision", type: exports.DataType.Number, value: Default.masher.precision }));
        this.properties.push(new Property({ name: "loop", type: exports.DataType.Boolean, value: Default.masher.loop }));
        this.properties.push(new Property({ name: "fps", type: exports.DataType.Number, value: Default.masher.fps }));
        this.properties.push(new Property({ name: "volume", type: exports.DataType.Number, value: Default.masher.volume }));
        this.properties.push(new Property({ name: "buffer", type: exports.DataType.Number, value: Default.masher.buffer }));
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const instance = new MasherClass({ ...this.instanceObject, ...object });
        return instance;
    }
}

const MasherIntervalTics = 10 * 1000;
const MasherDefaultId = "com.moviemasher.masher.default";
let MasherInterval;
const mashers = [];
const addMasher = (masher) => {
    if (!mashers.length)
        masherStart();
    mashers.push(masher);
};
const masherDestroy = (masher) => {
    const index = mashers.indexOf(masher);
    if (index < 0)
        return;
    mashers.splice(index, 1);
    if (!mashers.length)
        masherStop();
};
const handleInterval = () => {
    // console.log(constructor.name, "handleInterval")
    const map = new Map();
    const definitions = new Set();
    mashers.forEach(masher => {
        masher.definitions.forEach(definition => { definitions.add(definition); });
        const masherMap = masher.loadedDefinitions;
        masherMap.forEach((times, definition) => {
            if (!map.has(definition))
                map.set(definition, []);
            const definitionTimes = map.get(definition);
            if (!definitionTimes)
                throw Errors.internal;
            definitionTimes.push(...times);
        });
    });
    map.forEach((times, definition) => {
        definition.unload(times);
    });
    Definitions.map.forEach(definition => {
        if (definitions.has(definition)) {
            // definition used in a masher (masher.mash.media)
            if (map.has(definition)) {
                // definition needs to be at least partially loaded
                definition.unload(map.get(definition));
            }
            else {
                // definition can be completely unloaded, but not uninstalled
                definition.unload();
            }
        }
        else {
            // definition is not used anywhere - unload, and uninstall if not retained
            definition.unload();
            if (!definition.retain)
                Definitions.uninstall(definition.id);
        }
    });
};
const masherStart = () => {
    // console.log(constructor.name, "masherStart")
    if (MasherInterval)
        return;
    MasherInterval = setInterval(handleInterval, MasherIntervalTics);
};
const masherStop = () => {
    // console.log(constructor.name, "masherStop")
    if (!MasherInterval)
        return;
    clearInterval(MasherInterval);
    MasherInterval = undefined;
};
const masherDefinition = (object) => {
    const { id } = object;
    const idString = id && Is.populatedString(id) && Definitions.installed(id) ? id : MasherDefaultId;
    return Definitions.fromId(idString);
};
const masherDefinitionFromId = (id) => {
    return masherDefinition({ id });
};
const masherInstance = (object = {}) => {
    const definition = masherDefinition(object);
    const instance = definition.instanceFromObject(object);
    addMasher(instance);
    return instance;
};
const masherFromId = (id) => {
    return masherInstance({ id });
};
const masherInitialize = () => {
    new MasherDefinitionClass({ id: MasherDefaultId });
};
const masherDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.invalid.definition.id + 'masherDefine';
    Definitions.uninstall(id);
    return masherDefinition(object);
};
const MasherFactoryImplementation = {
    define: masherDefine,
    definition: masherDefinition,
    definitionFromId: masherDefinitionFromId,
    destroy: masherDestroy,
    fromId: masherFromId,
    initialize: masherInitialize,
    instance: masherInstance,
};
Factories.masher = MasherFactoryImplementation;

const ThemeWithModular = ModularMixin(InstanceClass);
const ThemeWithClip = ClipMixin(ThemeWithModular);
const ThemeWithVisible = VisibleMixin(ThemeWithClip);
const ThemeWithTransformable = TransformableMixin(ThemeWithVisible);
class ThemeClass extends ThemeWithTransformable {
    contextAtTimeToSize(mashTime, quantize, dimensions) {
        const context = ContextFactoryInstance.toSize(dimensions);
        const clipTimeRange = this.timeRangeRelative(mashTime, quantize);
        return this.definition.drawFilters(this, clipTimeRange, context, dimensions);
    }
}

const ThemeDefinitionWithModular = ModularDefinitionMixin(DefinitionClass);
const ThemeDefinitionWithClip = ClipDefinitionMixin(ThemeDefinitionWithModular);
const ThemeDefinitionWithVisible = VisibleDefinitionMixin(ThemeDefinitionWithClip);
class ThemeDefinitionClass extends ThemeDefinitionWithVisible {
    constructor(...args) {
        super(...args);
        this.type = exports.DefinitionType.Theme;
        Definitions.install(this);
    }
    get instance() {
        return this.instanceFromObject(this.instanceObject);
    }
    instanceFromObject(object) {
        const options = { ...this.instanceObject, ...object };
        // console.log("instanceFromObject", options)
        const instance = new ThemeClass(options);
        return instance;
    }
}

const label$3 = "Color";
const type$3 = "theme";
const id$3 = "com.moviemasher.theme.color";
const properties$2 = {
  color: {
    type: "rgb",
    value: "#FFFF00"
  }
};
const filters$2 = [
  {
    id: "color"
  }
];
var themeColorJson = {
  label: label$3,
  type: type$3,
  id: id$3,
  properties: properties$2,
  filters: filters$2
};

const label$2 = "Text";
const type$2 = "theme";
const id$2 = "com.moviemasher.theme.text";
const properties$1 = {
  string: {
    type: "string",
    value: "Text"
  },
  size: {
    type: "fontsize",
    value: 0.3
  },
  x: {
    type: "number",
    value: 0
  },
  y: {
    type: "number",
    value: 0
  },
  color: {
    type: "rgba",
    value: "rgba(255,0,0,1)"
  },
  shadowcolor: {
    type: "rgba",
    value: "rgba(0,0,0,0)"
  },
  shadowx: {
    type: "number",
    value: 0.015
  },
  shadowy: {
    type: "number",
    value: 0.015
  },
  fontface: {
    type: "font",
    value: "com.moviemasher.font.default"
  }
};
const filters$1 = [
  {
    id: "drawtext",
    parameters: [
      {
        name: "fontcolor",
        value: "color"
      },
      {
        name: "shadowcolor",
        value: "shadowcolor"
      },
      {
        name: "fontsize",
        value: "mm_vert(size)"
      },
      {
        name: "x",
        value: "mm_horz(x)"
      },
      {
        name: "y",
        value: "mm_vert(y)"
      },
      {
        name: "shadowx",
        value: "mm_horz(shadowx)"
      },
      {
        name: "shadowy",
        value: "mm_vert(shadowy)"
      },
      {
        name: "fontfile",
        value: "mm_fontfile(fontface)"
      },
      {
        name: "textfile",
        value: "mm_textfile(string)"
      }
    ]
  }
];
var themeTextJson = {
  label: label$2,
  type: type$2,
  id: id$2,
  properties: properties$1,
  filters: filters$1
};

const label$1 = "Title";
const type$1 = "theme";
const id$1 = "com.moviemasher.theme.title";
const properties = {
  string: {
    type: "string",
    value: "Title"
  },
  size: {
    type: "fontsize",
    value: 0.3
  },
  x: {
    type: "number",
    value: 0
  },
  y: {
    type: "number",
    value: 0
  },
  color: {
    type: "rgba",
    value: "rgba(255,0,0,1)"
  },
  shadowcolor: {
    type: "rgba",
    value: "rgba(0,0,0,0)"
  },
  shadowx: {
    type: "number",
    value: 0.015
  },
  shadowy: {
    type: "number",
    value: 0.015
  },
  background: {
    type: "hex",
    value: "#ffffff"
  },
  fontface: {
    type: "font",
    value: "com.moviemasher.font.default"
  }
};
const filters = [
  {
    id: "color",
    parameters: [
      {
        name: "color",
        value: "background"
      },
      {
        name: "size",
        value: "mm_dimensions"
      },
      {
        name: "duration",
        value: "mm_duration"
      },
      {
        name: "rate",
        value: "mm_fps"
      }
    ]
  },
  {
    id: "drawtext",
    parameters: [
      {
        name: "fontcolor",
        value: "color"
      },
      {
        name: "shadowcolor",
        value: "shadowcolor"
      },
      {
        name: "fontsize",
        value: "mm_vert(size)"
      },
      {
        name: "x",
        value: "mm_horz(x)"
      },
      {
        name: "y",
        value: "mm_vert(y)"
      },
      {
        name: "shadowx",
        value: "mm_horz(shadowx)"
      },
      {
        name: "shadowy",
        value: "mm_vert(shadowy)"
      },
      {
        name: "fontfile",
        value: "mm_fontfile(fontface)"
      },
      {
        name: "textfile",
        value: "mm_textfile(string)"
      }
    ]
  }
];
var themeTitleJson = {
  label: label$1,
  type: type$1,
  id: id$1,
  properties: properties,
  filters: filters
};

const themeDefinition = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    return new ThemeDefinitionClass({ ...object, type: exports.DefinitionType.Theme });
};
const themeDefinitionFromId = (id) => {
    return themeDefinition({ id });
};
const themeInstance = (object) => {
    const definition = themeDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const themeFromId = (id) => {
    return themeInstance({ id });
};
const themeInitialize = () => {
    new ThemeDefinitionClass(themeColorJson);
    new ThemeDefinitionClass(themeTextJson);
    new ThemeDefinitionClass(themeTitleJson);
};
const themeDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return themeDefinition(object);
};
const ThemeFactoryImplementation = {
    define: themeDefine,
    definition: themeDefinition,
    definitionFromId: themeDefinitionFromId,
    fromId: themeFromId,
    initialize: themeInitialize,
    instance: themeInstance,
};
Factories.theme = ThemeFactoryImplementation;

const TransitionWithModular = ModularMixin(InstanceClass);
const TransitionWithClip = ClipMixin(TransitionWithModular);
const TransitionWithVisible = VisibleMixin(TransitionWithClip);
class TransitionClass extends TransitionWithVisible {
    constructor() {
        super(...arguments);
        this.trackType = exports.TrackType.Video;
    }
    contextAtTimeToSize(_time, _quantize, _dimensions) {
        return;
    }
    mergeClipsIntoContextAtTime(clips, context, time, quantize, color) {
        // console.log(this.constructor.name, "mergeClipsIntoContextAtTime", clips.length, time, quantize, color)
        if (!Is.aboveZero(clips.length))
            return;
        this.definition.drawVisibleFilters(clips, this, time, quantize, context, color);
    }
}

const TransitionDefinitionWithModular = ModularDefinitionMixin(DefinitionClass);
const TransitionDefinitionWithClip = ClipDefinitionMixin(TransitionDefinitionWithModular);
const TransitionDefinitionWithVisible = VisibleDefinitionMixin(TransitionDefinitionWithClip);
class TransitionDefinitionClass extends TransitionDefinitionWithVisible {
    constructor(...args) {
        super(...args);
        this.fromFilters = [];
        this.fromMerger = mergerInstance({});
        this.fromScaler = scalerInstance({});
        this.toFilters = [];
        this.toMerger = mergerInstance({});
        this.toScaler = scalerInstance({});
        this.type = exports.DefinitionType.Transition;
        const [object] = args;
        const { to, from } = object;
        if (to) {
            const { filters, merger, scaler } = to;
            if (filters) {
                this.toFilters.push(...filters.map(filter => filterInstance(filter)));
            }
            if (merger)
                this.toMerger = mergerInstance(merger);
            if (scaler)
                this.toScaler = scalerInstance(scaler);
        }
        if (from) {
            const { filters, merger, scaler } = from;
            if (filters) {
                this.fromFilters.push(...filters.map(filter => filterInstance(filter)));
            }
            if (merger)
                this.fromMerger = mergerInstance(merger);
            if (scaler)
                this.fromScaler = scalerInstance(scaler);
        }
        Definitions.install(this);
    }
    drawVisibleFilters(clips, transition, time, quantize, context, color) {
        // console.log(this.constructor.name, "drawVisibleFilters", clips.length, transition.id)
        const { size } = context;
        const sorted = [...clips].sort(byFrame);
        let fromClip = sorted[0];
        let toClip = sorted[1];
        if (!toClip && fromClip.frame >= transition.frame) {
            toClip = fromClip;
            fromClip = undefined;
        }
        let fromDrawing = ContextFactoryInstance.toSize(size);
        let toDrawing = ContextFactoryInstance.toSize(size);
        if (color) {
            fromDrawing.drawFill(color);
            toDrawing.drawFill(color);
        }
        const range = transition.timeRangeRelative(time, quantize);
        if (fromClip)
            fromClip.mergeContextAtTime(time, quantize, fromDrawing);
        this.filters = this.fromFilters;
        fromDrawing = this.drawFilters(transition, range, fromDrawing, size);
        if (toClip)
            toClip.mergeContextAtTime(time, quantize, toDrawing);
        this.filters = this.toFilters;
        toDrawing = this.drawFilters(transition, range, toDrawing, size);
        fromDrawing = this.fromScaler.definition.drawFilters(this.fromScaler, range, fromDrawing, size);
        this.fromMerger.definition.drawFilters(this.fromMerger, range, fromDrawing, size, context);
        toDrawing = this.toScaler.definition.drawFilters(this.toScaler, range, toDrawing, size);
        this.toMerger.definition.drawFilters(this.toMerger, range, toDrawing, size, context);
    }
    get instance() { return this.instanceFromObject(this.instanceObject); }
    instanceFromObject(object) {
        return new TransitionClass({ ...this.instanceObject, ...object });
    }
    toJSON() {
        return {
            ...super.toJSON(),
            to: { filters: this.toFilters },
            from: { filters: this.fromFilters },
        };
    }
}

const label = "Crossfade";
const type = "transition";
const id = "com.moviemasher.transition.crossfade";
const to = {
  filters: [
    {
      id: "fade",
      parameters: [
        {
          name: "alpha",
          value: "mm_t"
        },
        {
          name: "type",
          value: "in"
        },
        {
          name: "duration",
          value: "mm_duration"
        }
      ]
    }
  ]
};
var transitionCrossfadeJson = {
  label: label,
  type: type,
  id: id,
  to: to
};

const transitionDefinition = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    return new TransitionDefinitionClass(object);
};
const transitionDefinitionFromId = (id) => {
    return transitionDefinition({ id });
};
const transitionInstance = (object) => {
    const definition = transitionDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const transitionFromId = (id) => {
    return transitionInstance({ id });
};
const transitionInitialize = () => {
    transitionDefinition(transitionCrossfadeJson);
};
const transitionDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return transitionDefinition(object);
};
const TransitionFactoryImplementation = {
    define: transitionDefine,
    definition: transitionDefinition,
    definitionFromId: transitionDefinitionFromId,
    fromId: transitionFromId,
    initialize: transitionInitialize,
    instance: transitionInstance,
};
Factories.transition = TransitionFactoryImplementation;

const VideoWithClip = ClipMixin(InstanceClass);
const VideoWithAudible = AudibleMixin(VideoWithClip);
const VideoWithVisible = VisibleMixin(VideoWithAudible);
const VideoWithTransformable = TransformableMixin(VideoWithVisible);
class VideoClass extends VideoWithTransformable {
    constructor(...args) {
        super(...args);
        this.speed = Default.instance.video.speed;
        const [object] = args;
        const { speed } = object;
        if (speed && Is.aboveZero(speed))
            this.speed = speed;
    }
    get copy() { return super.copy; }
    definitionTime(quantize, time) {
        const scaledTime = super.definitionTime(quantize, time);
        if (this.speed === Default.instance.video.speed)
            return scaledTime;
        return scaledTime.divide(this.speed); //, 'ceil')
    }
    toJSON() {
        const object = super.toJSON();
        if (this.speed !== Default.instance.video.speed)
            object.speed = this.speed;
        return object;
    }
}

const VideoDefinitionWithClip = ClipDefinitionMixin(DefinitionClass);
const VideoDefinitionWithAudible = AudibleDefinitionMixin(VideoDefinitionWithClip);
const VideoDefinitionWithVisible = VisibleDefinitionMixin(VideoDefinitionWithAudible);
class VideoDefinitionClass extends VideoDefinitionWithVisible {
    constructor(...args) {
        super(...args);
        this.begin = Default.definition.video.begin;
        this.fps = Default.definition.video.fps;
        this.increment = Default.definition.video.increment;
        this.pattern = '%.jpg';
        this.source = '';
        this.trackType = exports.TrackType.Video;
        this.type = exports.DefinitionType.Video;
        const [object] = args;
        const { url, begin, fps, increment, pattern, video_rate, source } = object;
        if (!url)
            throw Errors.invalid.definition.url;
        this.url = url;
        if (source)
            this.source = source;
        if (typeof begin !== "undefined")
            this.begin = begin;
        if (fps || video_rate)
            this.fps = Number(fps || video_rate); // deprecated string
        if (increment)
            this.increment = increment;
        if (pattern)
            this.pattern = pattern;
        this.properties.push(new Property({ name: "speed", type: exports.DataType.Number, value: 1.0 }));
        Definitions.install(this);
    }
    frames(start, end) {
        const frames = [];
        const startFrame = Math.min(this.framesMax, start.scale(this.fps, "floor").frame);
        if (end) {
            const endFrame = Math.min(this.framesMax, end.scale(this.fps, "ceil").frame);
            for (let frame = startFrame; frame <= endFrame; frame += 1) {
                frames.push(frame);
            }
        }
        else
            frames.push(startFrame);
        return frames;
    }
    get framesMax() { return Math.floor(this.fps * this.duration) - 2; }
    get instance() { return this.instanceFromObject(this.instanceObject); }
    instanceFromObject(object) {
        return new VideoClass({ ...this.instanceObject, ...object });
    }
    load(start, end) {
        const promises = [super.load(start, end)];
        const frames = this.frames(start, end);
        frames.forEach(frame => {
            const url = this.urlForFrame(frame);
            if (Cache.cached(url)) {
                const cached = Cache.get(url);
                if (cached instanceof Promise)
                    promises.push(cached);
            }
            else
                promises.push(LoaderFactory.image().loadUrl(url));
        });
        return Promise.all(promises).then();
    }
    loaded(start, end) {
        if (!super.loaded(start, end))
            return false;
        return this.frames(start, end).every(frame => Cache.cached(this.urlForFrame(frame)));
    }
    loadedVisible(time) {
        if (!time)
            throw Errors.internal;
        const [url] = this.urls(time);
        return Cache.get(url);
    }
    toJSON() {
        const object = super.toJSON();
        object.url = this.url;
        if (this.source)
            object.source = this.source;
        if (this.pattern !== Default.definition.video.pattern)
            object.pattern = this.pattern;
        if (this.increment !== Default.definition.video.increment)
            object.increment = this.increment;
        if (this.begin !== Default.definition.video.begin)
            object.begin = this.begin;
        if (this.fps !== Default.definition.video.fps)
            object.fps = this.fps;
        return object;
    }
    unload(times) {
        const zeroTime = Time.fromArgs(0, this.fps);
        const allUrls = this.urls(zeroTime, zeroTime.withFrame(this.framesMax));
        const deleting = new Set(allUrls.filter(url => Cache.cached(url)));
        if (times) {
            times.forEach(maybePair => {
                const [start, end] = maybePair;
                const frames = this.frames(start, end);
                const urls = frames.map(frame => this.urlForFrame(frame));
                const needed = urls.filter(url => deleting.has(url));
                needed.forEach(url => { deleting.delete(url); });
            });
        }
        deleting.forEach(url => { Cache.remove(url); });
    }
    urlForFrame(frame) {
        let s = String((frame * this.increment) + this.begin);
        if (this.zeropadding)
            s = s.padStart(this.zeropadding, '0');
        return (this.url + this.pattern).replaceAll('%', s);
    }
    urls(start, end) {
        return this.frames(start, end).map(frame => this.urlForFrame(frame));
    }
    get zeropadding() {
        if (!this.__zeropadding) {
            const lastFrame = this.begin + (this.increment * this.framesMax - this.begin);
            this.__zeropadding = String(lastFrame).length;
        }
        return this.__zeropadding;
    }
}

const videoDefinition = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    if (Definitions.installed(id))
        return Definitions.fromId(id);
    return new VideoDefinitionClass(object);
};
const videoDefinitionFromId = (id) => {
    return videoDefinition({ id });
};
const videoInstance = (object) => {
    const definition = videoDefinition(object);
    const instance = definition.instanceFromObject(object);
    return instance;
};
const videoFromId = (id) => {
    return videoInstance({ id });
};
const videoInitialize = () => { };
const videoDefine = (object) => {
    const { id } = object;
    if (!(id && Is.populatedString(id)))
        throw Errors.id;
    Definitions.uninstall(id);
    return videoDefinition(object);
};
const VideoFactoryImplementation = {
    define: videoDefine,
    definition: videoDefinition,
    definitionFromId: videoDefinitionFromId,
    fromId: videoFromId,
    initialize: videoInitialize,
    instance: videoInstance,
};
Factories.video = VideoFactoryImplementation;

DefinitionTypes.forEach(type => { MovieMasher[type].initialize(); });

exports.Action = Action;
exports.Actions = Actions;
exports.AddClipToTrackAction = AddClipToTrackAction;
exports.AddEffectAction = AddEffectAction;
exports.AddTrackAction = AddTrackAction;
exports.AudibleContext = AudibleContext;
exports.AudibleDefinitionMixin = AudibleDefinitionMixin;
exports.AudibleMixin = AudibleMixin;
exports.AudioClass = AudioClass;
exports.AudioDefinitionClass = AudioDefinitionClass;
exports.AudioFactoryImplementation = AudioFactoryImplementation;
exports.AudioLoader = AudioLoader;
exports.AudioProcessor = AudioProcessor;
exports.Cache = Cache;
exports.Capitalize = Capitalize;
exports.ChangeAction = ChangeAction;
exports.ChangeFramesAction = ChangeFramesAction;
exports.ChangeTrimAction = ChangeTrimAction;
exports.ClipDefinitionMixin = ClipDefinitionMixin;
exports.ClipMixin = ClipMixin;
exports.ClipTypes = ClipTypes;
exports.Color = Color;
exports.ContextFactory = ContextFactoryInstance;
exports.DataTypes = DataTypes;
exports.Default = Default;
exports.DefinitionClass = DefinitionClass;
exports.DefinitionTypes = DefinitionTypes;
exports.Definitions = Definitions;
exports.EffectClass = EffectClass;
exports.EffectDefinitionClass = EffectDefinitionClass;
exports.EffectFactoryImplementation = EffectFactoryImplementation;
exports.Element = Element;
exports.Errors = Errors;
exports.Evaluator = Evaluator;
exports.Factories = Factories;
exports.FilterClass = FilterClass;
exports.FilterDefinitionClass = FilterDefinitionClass;
exports.FilterFactoryImplementation = FilterFactoryImplementation;
exports.FontClass = FontClass;
exports.FontDefinitionClass = FontDefinitionClass;
exports.FontFactoryImplementation = FontFactoryImplementation;
exports.FontLoader = FontLoader;
exports.FontProcessor = FontProcessor;
exports.FreezeAction = FreezeAction;
exports.Id = Id;
exports.ImageClass = ImageClass;
exports.ImageDefinitionClass = ImageDefinitionClass;
exports.ImageFactoryImplementation = ImageFactoryImplementation;
exports.ImageLoader = ImageLoader;
exports.InstanceClass = InstanceClass;
exports.Is = Is;
exports.Loader = Loader;
exports.MashClass = MashClass;
exports.MashDefinitionClass = MashDefinitionClass;
exports.MashFactoryImplementation = MashFactoryImplementation;
exports.MashTypes = MashTypes;
exports.MasherClass = MasherClass;
exports.MasherDefinitionClass = MasherDefinitionClass;
exports.MasherFactoryImplementation = MasherFactoryImplementation;
exports.MergerClass = MergerClass;
exports.MergerDefinitionClass = MergerDefinitionClass;
exports.MergerFactoryImplementation = MergerFactoryImplementation;
exports.ModularDefinitionMixin = ModularDefinitionMixin;
exports.ModularMixin = ModularMixin;
exports.ModuleLoader = ModuleLoader;
exports.ModuleProcessor = ModuleProcessor;
exports.ModuleTypes = ModuleTypes;
exports.MoveClipsAction = MoveClipsAction;
exports.MoveEffectsAction = MoveEffectsAction;
exports.MovieMasher = MovieMasher;
exports.Parameter = Parameter;
exports.Pixel = Pixel;
exports.Processor = Processor;
exports.Property = Property;
exports.RemoveClipsAction = RemoveClipsAction;
exports.Round = Round;
exports.ScalerClass = ScalerClass;
exports.ScalerDefinitionClass = ScalerDefinitionClass;
exports.ScalerFactoryImplementation = ScalerFactoryImplementation;
exports.Seconds = Seconds;
exports.Sort = Sort;
exports.SplitAction = SplitAction;
exports.ThemeClass = ThemeClass;
exports.ThemeDefinitionClass = ThemeDefinitionClass;
exports.ThemeFactoryImplementation = ThemeFactoryImplementation;
exports.Time = Time;
exports.TimeRange = TimeRange;
exports.TrackClass = TrackClass;
exports.TrackRange = TrackRange;
exports.TransformTypes = TransformTypes;
exports.TransformableMixin = TransformableMixin;
exports.TransitionClass = TransitionClass;
exports.TransitionDefinitionClass = TransitionDefinitionClass;
exports.TransitionFactoryImplementation = TransitionFactoryImplementation;
exports.Type = Type;
exports.TypeValue = TypeValue;
exports.Types = TypesInstance;
exports.VideoClass = VideoClass;
exports.VideoDefinitionClass = VideoDefinitionClass;
exports.VideoFactoryImplementation = VideoFactoryImplementation;
exports.VisibleContext = VisibleContext;
exports.VisibleDefinitionMixin = VisibleDefinitionMixin;
exports.VisibleMixin = VisibleMixin;
exports.audioDefine = audioDefine;
exports.audioDefinition = audioDefinition;
exports.audioDefinitionFromId = audioDefinitionFromId;
exports.audioFromId = audioFromId;
exports.audioInitialize = audioInitialize;
exports.audioInstance = audioInstance;
exports.byFrame = byFrame;
exports.byLabel = byLabel;
exports.byTrack = byTrack;
exports.definitionsByType = definitionsByType;
exports.definitionsClear = definitionsClear;
exports.definitionsFont = definitionsFont;
exports.definitionsFromId = definitionsFromId;
exports.definitionsInstall = definitionsInstall;
exports.definitionsInstalled = definitionsInstalled;
exports.definitionsMap = definitionsMap;
exports.definitionsMerger = definitionsMerger;
exports.definitionsScaler = definitionsScaler;
exports.definitionsUninstall = definitionsUninstall;
exports.effectDefine = effectDefine;
exports.effectDefinition = effectDefinition;
exports.effectDefinitionFromId = effectDefinitionFromId;
exports.effectFromId = effectFromId;
exports.effectInitialize = effectInitialize;
exports.effectInstance = effectInstance;
exports.elementScrollMetrics = elementScrollMetrics;
exports.filterDefine = filterDefine;
exports.filterDefinition = filterDefinition;
exports.filterDefinitionFromId = filterDefinitionFromId;
exports.filterFromId = filterFromId;
exports.filterInitialize = filterInitialize;
exports.filterInstance = filterInstance;
exports.fontDefine = fontDefine;
exports.fontDefinition = fontDefinition;
exports.fontDefinitionFromId = fontDefinitionFromId;
exports.fontFromId = fontFromId;
exports.fontInitialize = fontInitialize;
exports.fontInstance = fontInstance;
exports.imageDefine = imageDefine;
exports.imageDefinition = imageDefinition;
exports.imageDefinitionFromId = imageDefinitionFromId;
exports.imageFromId = imageFromId;
exports.imageInitialize = imageInitialize;
exports.imageInstance = imageInstance;
exports.isAboveZero = isAboveZero;
exports.isArray = isArray;
exports.isBoolean = booleanType;
exports.isDefined = isDefined;
exports.isFloat = isFloat;
exports.isInteger = isInteger;
exports.isMethod = methodType;
exports.isNan = isNan;
exports.isNumber = numberType;
exports.isObject = objectType;
exports.isPopulatedArray = isPopulatedArray;
exports.isPopulatedObject = isPopulatedObject;
exports.isPopulatedString = isPopulatedString;
exports.isPositive = isPositive;
exports.isString = stringType;
exports.isUndefined = undefinedType;
exports.mashDefine = mashDefine;
exports.mashDefinition = mashDefinition;
exports.mashDefinitionFromId = mashDefinitionFromId;
exports.mashFromId = mashFromId;
exports.mashInitialize = mashInitialize;
exports.mashInstance = mashInstance;
exports.masherDefine = masherDefine;
exports.masherDefinition = masherDefinition;
exports.masherDefinitionFromId = masherDefinitionFromId;
exports.masherDestroy = masherDestroy;
exports.masherFromId = masherFromId;
exports.masherInitialize = masherInitialize;
exports.masherInstance = masherInstance;
exports.mergerDefaultId = mergerDefaultId;
exports.mergerDefine = mergerDefine;
exports.mergerDefinition = mergerDefinition;
exports.mergerDefinitionFromId = mergerDefinitionFromId;
exports.mergerFromId = mergerFromId;
exports.mergerInitialize = mergerInitialize;
exports.mergerInstance = mergerInstance;
exports.pixelColor = pixelColor;
exports.pixelFromFrame = pixelFromFrame;
exports.pixelNeighboringRgbas = pixelNeighboringRgbas;
exports.pixelPerFrame = pixelPerFrame;
exports.pixelRgbaAtIndex = pixelRgbaAtIndex;
exports.pixelToFrame = pixelToFrame;
exports.roundMethod = roundMethod;
exports.roundWithMethod = roundWithMethod;
exports.scalerDefaultId = scalerDefaultId;
exports.scalerDefine = scalerDefine;
exports.scalerDefinition = scalerDefinition;
exports.scalerDefinitionFromId = scalerDefinitionFromId;
exports.scalerFromId = scalerFromId;
exports.scalerInitialize = scalerInitialize;
exports.scalerInstance = scalerInstance;
exports.themeDefine = themeDefine;
exports.themeDefinition = themeDefinition;
exports.themeDefinitionFromId = themeDefinitionFromId;
exports.themeFromId = themeFromId;
exports.themeInitialize = themeInitialize;
exports.themeInstance = themeInstance;
exports.timeEqualizeRates = timeEqualizeRates;
exports.transitionDefine = transitionDefine;
exports.transitionDefinition = transitionDefinition;
exports.transitionDefinitionFromId = transitionDefinitionFromId;
exports.transitionFromId = transitionFromId;
exports.transitionInitialize = transitionInitialize;
exports.transitionInstance = transitionInstance;
exports.videoDefine = videoDefine;
exports.videoDefinition = videoDefinition;
exports.videoDefinitionFromId = videoDefinitionFromId;
exports.videoFromId = videoFromId;
exports.videoInitialize = videoInitialize;
exports.videoInstance = videoInstance;
//# sourceMappingURL=index.js.map
