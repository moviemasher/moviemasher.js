/// <reference types="node" />
/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}
type Context2D = CanvasRenderingContext2D;
type ContextElement = HTMLCanvasElement;
type DrawingSource = CanvasImageSource;
type ContextData = ImageData;
type Pixels = Uint8ClampedArray;
type Timeout = ReturnType<typeof setTimeout>;
type Interval = ReturnType<typeof setInterval>;
type EventsTarget = EventTarget;
type ScalarValue = number | string;
type ScalarArray = unknown[];
type NumberObject = Record<string, number>;
type UnknownObject = Record<string, unknown>;
type ObjectUnknown = Record<string, UnknownObject>;
type ValueObject = Record<string, ScalarValue>;
type ScalarRaw = boolean | ScalarValue;
type Scalar = ScalarRaw | ScalarArray | UnknownObject;
type ScalarConverter = (value?: ScalarValue) => ScalarValue;
type NumberConverter = (value: number) => number;
type StringSetter = (value: string) => void;
type NumberSetter = (value: number) => void;
type BooleanSetter = (value: boolean) => void;
type JsonValue = Scalar;
type JsonObject = Record<string, JsonValue | JsonValue[]>;
type SelectionObject = Record<string, SelectionValue>;
type SelectionValue = ScalarRaw | ValueObject;
type EvaluatorValue = ScalarValue | ScalarConverter;
interface WithFrame {
    frame: number;
}
interface WithTrack {
    track: number;
}
interface WithLabel {
    label: string;
}
interface Rgb {
    [index: string]: number;
    r: number;
    g: number;
    b: number;
}
interface Rgba extends Rgb {
    a: number;
}
interface WithType {
    type: string;
}
interface WithId {
    id: string;
}
interface WithTypeAndId extends WithType, WithId {
}
interface WithTypeAndValue extends WithType {
    value: number;
}
interface Size {
    width: number;
    height: number;
}
interface EvaluatedSize {
    w?: number;
    h?: number;
    width?: number;
    height?: number;
}
interface EvaluatedPoint {
    x?: number;
    y?: number;
}
interface Point {
    x: number;
    y: number;
}
interface EvaluatedRect {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    // eslint-disable-next-line camelcase
    out_w?: number;
    // eslint-disable-next-line camelcase
    out_h?: number;
}
interface Rect extends Size, Point {
}
interface TextStyle {
    height: number;
    family: string;
    color: string;
    shadow?: string;
    shadowPoint?: Point;
}
interface RgbObject {
    r: string | number;
    g: string | number;
    b: string | number;
}
interface Rgb {
    r: number;
    g: number;
    b: number;
}
interface YuvObject {
    y: string | number;
    u: string | number;
    v: string | number;
}
interface Yuv {
    y: number;
    u: number;
    v: number;
}
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type Constrained<T = UnknownObject> = new (...args: any[]) => T;
interface GenericFactory<INSTANCE, INSTANCEOBJECT, DEFINITION, DEFINITIONOBJECT> {
    define(object: DEFINITIONOBJECT): DEFINITION;
    definitionFromId(id: string): DEFINITION;
    definition(object: DEFINITIONOBJECT): DEFINITION;
    install(object: DEFINITIONOBJECT): DEFINITION;
    instance(object: INSTANCEOBJECT): INSTANCE;
    initialize(): void;
    fromId(id: string): INSTANCE;
}
type LoadPromise = Promise<void>;
type LoadFontPromise = Promise<{
    family: string;
}>;
type LoadImagePromise = Promise<DrawingSource>;
type LoadVideoPromise = Promise<DrawingSource>;
interface ScrollMetrics {
    height: number;
    width: number;
    scrollPaddingleft: number;
    scrollPaddingRight: number;
    scrollPaddingTop: number;
    scrollPaddingBottom: number;
    scrollLeft: number;
    scrollTop: number;
    x: number;
    y: number;
}
type MasherChangeHandler = (property: string, value?: SelectionValue) => void;
declare const Default: {
    label: string;
    masher: {
        buffer: number;
        fps: number;
        loop: boolean;
        volume: number;
        precision: number;
        autoplay: boolean;
    };
    mash: {
        label: string;
        quantize: number;
        backcolor: string;
        gain: number;
        buffer: number;
    };
    instance: {
        audio: {
            gain: number;
            trim: number;
        };
        video: {
            speed: number;
        };
    };
    definition: {
        frame: {
            duration: number;
        };
        image: {
            duration: number;
        };
        theme: {
            duration: number;
        };
        transition: {
            duration: number;
        };
        video: {
            pattern: string;
            fps: number;
            increment: number;
            begin: number;
        };
    };
};
declare const Errors: {
    eval: {
        sourceRect: string;
        outputSize: string;
        conditionTruth: string;
        conditionValue: string;
        number: string;
        get: string;
    };
    composition: {
        mashUndefined: string;
    };
    audibleContext: string;
    mash: string;
    action: string;
    actions: string;
    internal: string;
    argument: string;
    invalid: {
        canvas: string;
        definition: {
            duration: string;
            audio: string;
            url: string;
            source: string;
            id: string;
            object: string;
        };
        track: string;
        trackType: string;
        action: string;
        name: string;
        value: string;
        type: string;
        url: string;
        property: string;
        argument: string;
        object: string;
        factory: string;
        volume: string;
    };
    type: string;
    selection: string;
    unknown: {
        type: string;
        merger: string;
        effect: string;
        filter: string;
        font: string;
        scaler: string;
        mode: string;
        definition: string;
    };
    uncached: string;
    object: string;
    array: string;
    media: string;
    id: string;
    frame: string;
    frames: string;
    fps: string;
    seconds: string;
    url: string;
    time: string;
    timeRange: string;
    mainTrackOverlap: string;
    unknownMash: string;
    unimplemented: string;
    property: string;
    deprecation: {
        property_types: string;
        addModulesOfType: string;
        configure: {
            get: string;
            set: string;
        };
        canvas_context: {
            get: string;
            set: string;
        };
    };
    wrongClass: string;
};
interface ParameterObject {
    name?: string;
    value?: ScalarValue | ValueObject[];
}
declare class Parameter {
    constructor({ name, value }: ParameterObject);
    name: string;
    toJSON(): JsonObject;
    value: ScalarValue | ValueObject[];
}
declare enum ActionType {
    AddTrack = "addTrack",
    AddClipsToTrack = "addClipsToTrack",
    MoveClips = "moveClips",
    AddEffect = "addEffect",
    Change = "change",
    ChangeFrames = "changeFrames",
    ChangeTrim = "changeTrim",
    ChangeGain = "changeGain",
    MoveEffects = "moveEffects",
    Split = "split",
    Freeze = "freeze",
    RemoveClips = "removeClips"
}
declare enum TrackType {
    Audio = "audio",
    Video = "video"
}
declare enum ClipType {
    Audio = "audio",
    Frame = "frame",
    Image = "image",
    Theme = "theme",
    Transition = "transition",
    Video = "video"
}
declare const ClipTypes: ClipType[];
// NOTE: order important here - determines initialization
declare enum DefinitionType {
    Filter = "filter",
    Merger = "merger",
    Scaler = "scaler",
    Effect = "effect",
    Audio = "audio",
    Font = "font",
    Image = "image",
    Mash = "mash",
    Masher = "masher",
    Theme = "theme",
    Transition = "transition",
    Video = "video"
}
declare const DefinitionTypes: DefinitionType[];
declare enum EventType {
    Action = "action",
    Canvas = "canvaschange",
    Duration = "durationchange",
    Ended = "ended",
    Fps = "ratechange",
    Loaded = "loadeddata",
    Mash = "mashchange",
    Pause = "pause",
    Play = "play",
    Playing = "playing",
    Seeked = "seeked",
    Seeking = "seeking",
    Selection = "selection",
    Time = "timeupdate",
    Track = "track",
    Volume = "volumechange",
    Waiting = "waiting"
}
declare enum MashType {
    Mash = "mash"
}
declare const MashTypes: (string | MashType)[];
declare enum ModuleType {
    Effect = "effect",
    Font = "font",
    Merger = "merger",
    Scaler = "scaler",
    Theme = "theme",
    Transition = "transition"
}
declare const ModuleTypes: ModuleType[];
declare enum LoadType {
    Audio = "audio",
    Font = "font",
    Image = "image",
    Module = "module",
    Video = "video"
}
declare enum MoveType {
    Audio = "audio",
    Effect = "effect",
    Video = "video"
}
declare enum DataType {
    Boolean = "boolean",
    Direction4 = "direction4",
    Direction8 = "direction8",
    Font = "font",
    Fontsize = "fontsize",
    Integer = "integer",
    Mode = "mode",
    Number = "number",
    Pixel = "pixel",
    Rgb = "rgb",
    Rgba = "rgba",
    String = "string",
    Text = "text"
}
declare const DataTypes: DataType[];
declare enum TransformType {
    Merger = "merger",
    Scaler = "scaler"
}
declare const TransformTypes: TransformType[];
interface TypeValueObject {
    id: ScalarValue;
    identifier: string;
    label: string;
}
declare class TypeValue {
    constructor(object: TypeValueObject);
    id: ScalarValue;
    identifier: string;
    label: string;
}
interface TypeObject {
    id?: DataType;
    value?: ScalarRaw;
    values?: TypeValueObject[];
    modular?: boolean;
}
declare class Type {
    constructor(object: TypeObject);
    coerce(value: SelectionValue): ScalarRaw | undefined;
    id: DataType;
    modular: boolean;
    value: ScalarRaw;
    values: TypeValueObject[];
}
interface PropertyObject {
    type?: DataType;
    name?: string;
    value?: ScalarRaw;
    custom?: boolean;
}
declare class Property {
    constructor(object: PropertyObject);
    custom: boolean;
    name: string;
    toJSON(): JsonObject;
    type: Type;
    value: ScalarRaw;
}
declare const Capitalize: (value: string) => string;
declare const colorYuv2rgb: (yuv: YuvObject) => Rgb;
declare const colorRgb2hex: (rgb: RgbObject) => string;
declare const colorYuvBlend: (yuvs: YuvObject[], yuv: YuvObject, match: number, blend: number) => number;
declare const colorRgb2yuv: (rgb: RgbObject) => Yuv;
declare const colorStrip: (color: string) => string;
declare const colorValid: (color: string) => boolean;
declare const colorTransparent = "#00000000";
declare const Color: {
    valid: (color: string) => boolean;
    yuvBlend: (yuvs: YuvObject[], yuv: YuvObject, match: number, blend: number) => number;
    rgb2yuv: (rgb: RgbObject) => Yuv;
    yuv2rgb: (yuv: YuvObject) => Rgb;
    rgb2hex: (rgb: RgbObject) => string;
    transparent: string;
    strip: (color: string) => string;
};
declare const elementScrollMetrics: (element?: Element | null | undefined) => ScrollMetrics | undefined;
declare const Element: {
    scrollMetrics: (element?: Element | null | undefined) => ScrollMetrics | undefined;
};
declare const timeEqualizeRates: (time1: Time, time2: Time, rounding?: string) => Time[];
declare class Time implements Time {
    frame: number;
    fps: number;
    constructor(frame?: number, fps?: number);
    add(time: Time): Time;
    addFrames(frames: number): Time;
    get copy(): Time;
    get description(): string;
    divide(number: number, rounding?: string): Time;
    equalsTime(time: Time): boolean;
    min(time: Time): Time;
    scale(fps: number, rounding?: string): Time;
    scaleToFps(fps: number): Time;
    scaleToTime(time: Time): Time;
    get seconds(): number;
    subtract(time: Time): Time;
    subtractFrames(frames: number): Time;
    toString(): string;
    withFrame(frame: number): Time;
    static fromArgs(frame?: number, fps?: number): Time;
    static fromSeconds(seconds?: number, fps?: number, rounding?: string): Time;
}
type Times = Time[];
declare class TimeRange extends Time {
    frames: number;
    constructor(frame?: number, fps?: number, frames?: number);
    get description(): string;
    get end(): number;
    get endTime(): Time;
    equalsTimeRange(timeRange: TimeRange): boolean;
    get lengthSeconds(): number;
    get position(): number;
    get startTime(): Time;
    get copy(): TimeRange;
    scale(fps?: number, rounding?: string): TimeRange;
    intersects(timeRange: TimeRange): boolean;
    intersectsTime(time: Time): boolean;
    minEndTime(endTime: Time): TimeRange;
    withFrame(frame: number): TimeRange;
    withFrames(frames: number): TimeRange;
    static fromArgs(frame?: number, fps?: number, frames?: number): TimeRange;
    static fromSeconds(start?: number, duration?: number): TimeRange;
    static fromTime(time: Time, frames?: number): TimeRange;
    static fromTimes(startTime: Time, endTime: Time): TimeRange;
}
declare class AudibleContext {
    constructor();
    __context?: AudioContext;
    get context(): AudioContext;
    createBuffer(seconds: number): AudioBuffer;
    createBufferSource(): AudioBufferSourceNode;
    createGain(): GainNode;
    get currentTime(): number;
    decode(buffer: ArrayBuffer): Promise<AudioBuffer>;
    get destination(): AudioDestinationNode;
    get time(): Time;
}
interface InstanceObject {
    [index: string]: unknown;
    definition?: Definition;
    id?: string;
    label?: string;
}
declare class InstanceClass {
    [index: string]: unknown;
    constructor(...args: Any[]);
    get copy(): Instance;
    definition: Definition;
    get definitions(): Definition[];
    definitionTime(quantize: number, time: Time): Time;
    protected _id?: string;
    get id(): string;
    private _identifier?;
    get identifier(): string;
    protected _label?: string;
    get label(): string;
    set label(value: string);
    load(quantize: number, start: Time, end?: Time): LoadPromise;
    loaded(quantize: number, start: Time, end?: Time): boolean;
    get propertyNames(): string[];
    get propertyValues(): SelectionObject;
    setValue(key: string, value: SelectionValue): boolean;
    toJSON(): JsonObject;
    get type(): DefinitionType;
    value(key: string): SelectionValue;
}
interface Instance extends InstanceClass {
}
interface DefinitionObject {
    [index: string]: unknown;
    id?: string;
    type?: string;
    label?: string;
    icon?: string;
}
declare class DefinitionClass {
    constructor(...args: Any[]);
    icon?: string;
    id: string;
    get instance(): Instance;
    instanceFromObject(object: InstanceObject): Instance;
    get instanceObject(): InstanceObject;
    label: string;
    load(_start: Time, _end?: Time): LoadPromise;
    loaded(_start: Time, _end?: Time): boolean;
    loadedAudible(_time?: Time): Any;
    loadedVisible(_time?: Time): Any;
    properties: Property[];
    get propertiesModular(): Property[];
    property(name: string): Property | undefined;
    retain: boolean;
    toJSON(): JsonObject;
    type: DefinitionType;
    unload(_times?: Times[]): void;
    value(name: string): SelectionValue | undefined;
}
interface Definition extends DefinitionClass {
}
type DefinitionTimes = Map<Definition, Times[]>;
interface ClipObject extends InstanceObject {
    frame?: number;
    frames?: number;
    track?: number;
}
interface Clip extends Instance {
    audible: boolean;
    endFrame: number;
    frame: number;
    frames: number;
    maxFrames(quantize: number, trim?: number): number;
    time(quantize: number): Time;
    timeRange(quantize: number): TimeRange;
    timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
    track: number;
    trackType: TrackType;
    visible: boolean;
}
interface ClipDefinitionObject extends DefinitionObject {
}
interface ClipDefinition extends Definition {
    visible: boolean;
    audible: boolean;
    duration: number;
}
interface AudibleObject extends ClipObject {
    gain?: ScalarValue;
    trim?: number;
}
interface Audible extends Clip {
    definition: AudibleDefinition;
    gain: number;
    gainPairs: number[][];
    muted: boolean;
    trim: number;
}
interface AudibleDefinitionObject extends ClipDefinitionObject {
    audio?: string;
    duration?: ScalarValue;
    loops?: boolean;
    source?: string;
    stream?: boolean;
    url?: string;
    waveform?: string;
}
interface AudibleDefinition extends ClipDefinition {
    audible: boolean;
    duration: number;
    loops: boolean;
    loadedAudible(_time?: Time): AudioBuffer | undefined;
    stream: boolean;
    waveform?: string;
}
type AudioObject = AudibleObject;
interface Audio extends Audible {
    definition: AudioDefinition;
}
type AudioDefinitionObject = AudibleDefinitionObject;
interface AudioDefinition extends AudibleDefinition {
    instance: Audio;
    instanceFromObject(object: AudioObject): Audio;
}
type AudioFactory = GenericFactory<Audio, AudioObject, AudioDefinition, AudioDefinitionObject>;
declare const AudioDefinitionWithAudible: {
    new (...args: any[]): {
        audible: boolean;
        load(start: Time, end?: Time | undefined): LoadPromise;
        loaded(start: Time, end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): AudioBuffer | undefined;
        loops: boolean;
        source?: string | undefined;
        stream: boolean;
        toJSON(): JsonObject;
        unload(times?: Times[]): void;
        urlAudible: string;
        waveform?: string | undefined;
        visible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        type: DefinitionType;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        _duration?: number | undefined;
        duration: number;
        visible: boolean;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class AudioDefinitionClass extends AudioDefinitionWithAudible {
    constructor(...args: Any[]);
    get instance(): Audio;
    instanceFromObject(object: AudioObject): Audio;
    trackType: TrackType;
    type: DefinitionType;
}
/**
 * @internal
 */
declare const audioDefinition: (object: AudioDefinitionObject) => AudioDefinition;
/**
 * @internal
 */
declare const audioDefinitionFromId: (id: string) => AudioDefinition;
/**
 * @internal
 */
declare const audioInstance: (object: AudioObject) => Audio;
/**
 * @internal
 */
declare const audioFromId: (id: string) => Audio;
/**
 * @internal
 */
declare const audioInitialize: () => void;
/**
 * @internal
 */
declare const audioDefine: (object: AudioDefinitionObject) => AudioDefinition;
/**
 * @internal
 */
declare const audioInstall: (object: AudioDefinitionObject) => AudioDefinition;
declare const AudioFactoryImplementation: {
    define: (object: AudioDefinitionObject) => AudioDefinition;
    definition: (object: AudioDefinitionObject) => AudioDefinition;
    definitionFromId: (id: string) => AudioDefinition;
    fromId: (id: string) => Audio;
    initialize: () => void;
    install: (object: AudioDefinitionObject) => AudioDefinition;
    instance: (object: AudioObject) => Audio;
};
declare const AudioWithAudible: {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definition: AudibleDefinition;
        definitionTime(quantize: number, time: Time): Time;
        gain: number;
        gainPairs: number[][];
        readonly muted: boolean;
        maxFrames(quantize: number, trim?: number | undefined): number;
        toJSON(): JsonObject;
        trim: number;
        trimTime(quantize: number): Time;
        endFrame: number;
        frame: number;
        frames: number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definitionTime(quantize: number, time: Time): Time;
        readonly endFrame: number;
        endTime(quantize: number): Time;
        frame: number;
        frames: number;
        maxFrames(_quantize: number, _trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(time: Time, quantize: number): TimeRange;
        toJSON(): JsonObject;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class AudioClass extends AudioWithAudible {
    definition: AudioDefinition;
    trackType: TrackType;
}
declare class Loader {
    loadUrl(url: string): LoadPromise;
    requestUrl(_url: string): Promise<Any>;
}
declare class AudioLoader extends Loader {
    // constructor(object? : UnknownObject | undefined) {
    //   super()
    //   if (object && object.audibleContext) {
    //     this._audibleContext = <AudibleContext> object.audibleContext
    //   }
    //   else this._audibleContext = ContextFactory.audible()
    // }
    type: LoadType;
    // get audibleContext() : AudibleContext { return this._audibleContext }
    // set audibleContext(value : AudibleContext) { this._audibleContext = value }
    requestUrl(url: string): Promise<AudioBuffer>;
}
declare class Processor {
    process(_url: string, _buffer: ArrayBuffer): Promise<Any>;
}
declare class AudioProcessor extends Processor {
    // constructor(object? : UnknownObject | undefined) {
    //   super()
    //   if (object && object.audibleContext) {
    //     this._audibleContext = <AudibleContext> object.audibleContext
    //   }
    //   else {
    //     console.log(this.constructor.name, "constructor initializing audibleContext")
    //     this._audibleContext = ContextFactory.audible()
    //   }
    // }
    // get audibleContext() : AudibleContext { return this._audibleContext }
    // set audibleContext(value : AudibleContext) { this._audibleContext = value }
    process(_url: string, buffer: ArrayBuffer): Promise<AudioBuffer>;
}
type DefinitionsList = Definition[];
declare const definitionsMap: Map<string, Definition>;
declare const definitionsByType: (type: DefinitionType) => DefinitionsList;
declare const definitionsClear: () => void;
declare const definitionsFont: DefinitionsList;
declare const definitionsFromId: (id: string) => Definition;
declare const definitionsInstall: (definition: Definition) => void;
declare const definitionsInstalled: (id: string) => boolean;
declare const definitionsMerger: DefinitionsList;
declare const definitionsScaler: DefinitionsList;
declare const definitionsUninstall: (id: string) => void;
declare const Definitions: {
    byType: (type: DefinitionType) => DefinitionsList;
    clear: () => void;
    font: DefinitionsList;
    fromId: (id: string) => Definition;
    install: (definition: Definition) => void;
    installed: (id: string) => boolean;
    map: Map<string, Definition>;
    merger: DefinitionsList;
    scaler: DefinitionsList;
    uninstall: (id: string) => void;
};
interface FilterDefinitionObject extends DefinitionObject {
}
interface FilterDefinition extends Definition {
    draw(evaluator: Evaluator, evaluated: ValueObject): VisibleContext;
    instance: Filter;
    instanceFromObject(object: FilterObject): Filter;
    parameters: Parameter[];
    scopeSet(evaluator: Evaluator): void;
}
interface FilterObject extends InstanceObject {
    parameters?: ParameterObject[];
}
interface Filter extends Instance {
    definition: FilterDefinition;
    drawFilter(evaluator: Evaluator): VisibleContext;
    evaluated(evaluator: Evaluator): ValueObject;
    parameters: Parameter[];
}
type FilterFactory = GenericFactory<Filter, FilterObject, FilterDefinition, FilterDefinitionObject>;
type ModularObject = InstanceObject;
interface Modular extends Instance {
    definition: ModularDefinition;
}
// JSON is hash { PROPERTY_NAME: PROPERTY_OBJECT }
interface ModularDefinitionObject extends DefinitionObject {
    filters?: UnknownObject[];
    properties?: ObjectUnknown;
}
// but Definition uses an array of properties to ease filtering/sorting
interface ModularDefinition extends Definition {
    filters: Filter[];
    drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext): VisibleContext;
    evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext): Evaluator;
}
type EffectObject = ModularObject;
interface Effect extends Modular {
    definition: EffectDefinition;
}
type EffectDefinitionObject = ModularDefinitionObject;
interface EffectDefinition extends ModularDefinition {
    instance: Effect;
    instanceFromObject(object: EffectObject): Effect;
}
type EffectFactory = GenericFactory<Effect, EffectObject, EffectDefinition, EffectDefinitionObject>;
declare const EffectDefinitionWithModular: {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
        retain: boolean;
        toJSON(): JsonObject;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class EffectDefinitionClass extends EffectDefinitionWithModular {
    constructor(...args: Any[]);
    get instance(): Effect;
    instanceFromObject(object: EffectObject): Effect;
    type: DefinitionType;
}
declare const EffectWithModular: {
    new (...args: any[]): {
        [index: string]: unknown;
        constructProperties(object?: any): void;
        definition: ModularDefinition;
        readonly definitions: Definition[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly modularDefinitions: Definition[];
        readonly copy: Instance;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class EffectClass extends EffectWithModular {
    definition: EffectDefinition;
    toJSON(): JsonObject;
}
declare const effectDefinition: (object: EffectDefinitionObject) => EffectDefinition;
declare const effectDefinitionFromId: (id: string) => EffectDefinition;
declare const effectInstance: (object: EffectObject) => Effect;
declare const effectFromId: (id: string) => Effect;
declare const effectInitialize: () => void;
declare const effectDefine: (object: EffectDefinitionObject) => EffectDefinition;
declare const EffectFactoryImplementation: {
    define: (object: EffectDefinitionObject) => EffectDefinition;
    definition: (object: EffectDefinitionObject) => EffectDefinition;
    definitionFromId: (id: string) => EffectDefinition;
    fromId: (id: string) => Effect;
    initialize: () => void;
    install: (object: EffectDefinitionObject) => EffectDefinition;
    instance: (object: EffectObject) => Effect;
};
type FontObject = InstanceObject;
interface Font extends Instance {
    definition: FontDefinition;
}
interface FontDefinitionObject extends DefinitionObject {
    source?: string;
}
interface FontDefinition extends Definition {
    instance: Font;
    instanceFromObject(object: FontObject): Font;
    source: string;
}
type FontFactory = GenericFactory<Font, FontObject, FontDefinition, FontDefinitionObject>;
type MergerObject = ModularObject;
interface Merger extends Modular {
    definition: MergerDefinition;
}
type MergerDefinitionObject = ModularDefinitionObject;
interface MergerDefinition extends ModularDefinition {
    instance: Merger;
    instanceFromObject(object: MergerObject): Merger;
}
interface MergerFactory extends GenericFactory<Merger, MergerObject, MergerDefinition, MergerDefinitionObject> {
}
type ScalerObject = ModularObject;
interface Scaler extends Modular {
    definition: ScalerDefinition;
}
interface ScalerDefinitionObject extends ModularDefinitionObject {
}
interface ScalerDefinition extends ModularDefinition {
    instance: Scaler;
    instanceFromObject(object: ScalerObject): Scaler;
}
type ScalerFactory = GenericFactory<Scaler, ScalerObject, ScalerDefinition, ScalerDefinitionObject>;
interface VisibleObject extends ClipObject {
}
interface Visible extends Clip {
    contextAtTimeToSize(time: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
    mergeContextAtTime(time: Time, quantize: number, context: VisibleContext): void;
}
interface VisibleDefinitionObject extends DefinitionObject {
}
interface VisibleDefinition extends ClipDefinition {
    trackType: TrackType;
    loadedVisible(_time?: Time): DrawingSource | undefined;
}
interface TransformableObject extends VisibleObject {
    effects?: EffectObject[];
    merger?: MergerObject;
    scaler?: ScalerObject;
}
interface Transformable extends Visible {
    effects: Effect[];
    merger: Merger;
    scaler: Scaler;
    effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
    mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void;
    scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
}
type ImageObject = TransformableObject;
interface Image extends Transformable {
    definition: ImageDefinition;
}
interface ImageDefinitionObject extends DefinitionObject {
    url?: string;
    source?: string;
}
interface ImageDefinition extends VisibleDefinition {
    instance: Image;
    instanceFromObject(object: ImageObject): Image;
}
type ImageFactory = GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject>;
interface TrackObject {
    clips?: ClipObject[];
    type?: TrackType;
    index?: number;
}
interface TrackOptions {
    clips?: Clip[];
    type?: TrackType;
    index?: number;
}
declare class TrackClass {
    constructor(object: TrackOptions);
    clips: Clip[];
    get frames(): number;
    index: number;
    get isMainVideo(): boolean;
    type: TrackType;
    addClips(clips: Clip[], insertIndex?: number): void;
    frameForClipsNearFrame(clips: Clip[], frame?: number): number;
    removeClips(clips: Clip[]): void;
    sortClips(clips: Clip[]): void;
    toJSON(): JsonObject;
}
interface Track extends TrackClass {
}
interface CompositionObject {
    // audibleContext? : AudibleContext
    buffer?: number;
    gain?: number;
    quantize?: number;
    backcolor?: string;
    visibleContext?: VisibleContext;
}
declare class Composition {
    constructor(object: CompositionObject);
    adjustSourceGain(clip: Audible): void;
    // private _audibleContext : AudibleContext
    // get audibleContext() : AudibleContext { return this._audibleContext }
    // set audibleContext(value : AudibleContext) { this._audibleContext = value }
    backcolor?: string;
    buffer: number;
    private bufferSource?;
    private clipTiming;
    compositeAudible(clips: Audible[]): boolean;
    compositeVisible(time: Time, clips: Visible[]): void;
    compositeVisibleRequest(time: Time, clips: Visible[]): void;
    private contextSeconds;
    private createSources;
    private destroySources;
    private drawBackground;
    private _gain;
    get gain(): number;
    set gain(value: number);
    private mashSeconds;
    playing: boolean;
    quantize: number;
    get seconds(): number;
    private sourcesByClip;
    startContext(): void;
    startPlaying(time: Time, clips: Audible[]): boolean;
    stopPlaying(): void;
    private _visibleContext;
    get visibleContext(): VisibleContext;
    set visibleContext(value: VisibleContext);
}
interface MashObject extends InstanceObject {
    audio?: TrackObject[];
    backcolor?: string;
    id?: string;
    label?: string;
    media?: DefinitionObject[];
    quantize?: number;
    video?: TrackObject[];
}
interface MashOptions extends MashObject {
    // audibleContext? : AudibleContext
    buffer?: number;
    gain?: number;
    loop?: boolean;
    time?: Time;
    visibleContext?: VisibleContext;
}
interface MashDefinition extends Definition {
    instance: Mash;
    instanceFromObject(object: MashObject): Mash;
}
interface Mash extends Instance {
    addClipsToTrack(clips: Clip[], trackIndex?: number, insertIndex?: number, frames?: number[]): void;
    addTrack(trackType: TrackType): Track;
    // audibleContext : AudibleContext
    audio: Track[];
    backcolor?: string;
    changeClipFrames(clip: Clip, value: number): void;
    changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void;
    clipTrack(clip: Clip): Track;
    clips: Clip[];
    clipsVisibleSlice(frame: number, frames: number): Visible[];
    compositeVisible(): void;
    composition: Composition;
    definition: MashDefinition;
    destroy(): void;
    drawnTime?: Time;
    duration: number;
    endTime: Time;
    frame: number;
    frames: number;
    handleAction(action: Action): void;
    load(): LoadPromise;
    loadedDefinitions: DefinitionTimes;
    loop: boolean;
    media: Definition[];
    paused: boolean;
    quantize: number;
    removeClipsFromTrack(clips: Clip[]): void;
    removeTrack(trackType: TrackType): void;
    seekToTime(time: Time): LoadPromise;
    time: Time;
    timeRange: TimeRange;
    trackOfTypeAtIndex(type: TrackType, index?: number): Track;
    tracks: Track[];
    video: Track[];
    visibleContext: VisibleContext;
}
type MashDefinitionObject = DefinitionObject;
type MashFactory = GenericFactory<Mash, MashObject, MashDefinition, MashDefinitionObject>;
type ThemeObject = ModularObject & TransformableObject;
interface Theme extends Modular, Transformable {
    definition: ThemeDefinition;
}
type ThemeDefinitionObject = ModularDefinitionObject & ClipDefinitionObject;
interface ThemeDefinition extends Omit<ModularDefinition, "loadedVisible">, VisibleDefinition {
    instance: Theme;
    instanceFromObject(object: ThemeObject): Theme;
}
interface ThemeFactory extends GenericFactory<Theme, ThemeObject, ThemeDefinition, ThemeDefinitionObject> {
}
declare const MergerDefinitionWithModular: {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
        retain: boolean;
        toJSON(): JsonObject;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class MergerDefinitionClass extends MergerDefinitionWithModular {
    constructor(...args: Any[]);
    get instance(): Merger;
    instanceFromObject(object: MergerObject): Merger;
    retain: boolean;
    type: DefinitionType;
}
declare const mergerDefaultId = "com.moviemasher.merger.default";
declare const mergerDefinition: (object: MergerDefinitionObject) => MergerDefinition;
declare const mergerDefinitionFromId: (id: string) => MergerDefinition;
declare const mergerInstance: (object: MergerObject) => Merger;
declare const mergerFromId: (id: string) => Merger;
declare const mergerInitialize: () => void;
declare const mergerDefine: (object: MergerDefinitionObject) => MergerDefinition;
declare const MergerFactoryImplementation: MergerFactory;
declare const MergerWithModular: {
    new (...args: any[]): {
        [index: string]: unknown;
        constructProperties(object?: any): void;
        definition: ModularDefinition;
        readonly definitions: Definition[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly modularDefinitions: Definition[];
        readonly copy: Instance;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class MergerClass extends MergerWithModular {
    definition: MergerDefinition;
    get id(): string;
    set id(value: string);
}
declare const ScalerDefinitionWithModular: {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
        retain: boolean;
        toJSON(): JsonObject;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class ScalerDefinitionClass extends ScalerDefinitionWithModular {
    constructor(...args: Any[]);
    get instance(): Scaler;
    instanceFromObject(object: ScalerObject): Scaler;
    retain: boolean;
    type: DefinitionType;
}
declare const scalerDefaultId = "com.moviemasher.scaler.default";
declare const scalerDefinition: (object: ScalerDefinitionObject) => ScalerDefinition;
declare const scalerDefinitionFromId: (id: string) => ScalerDefinition;
declare const scalerInstance: (object: ScalerObject) => Scaler;
declare const scalerFromId: (id: string) => Scaler;
declare const scalerInitialize: () => void;
declare const scalerDefine: (object: ScalerDefinitionObject) => ScalerDefinition;
declare const ScalerFactoryImplementation: {
    define: (object: ScalerDefinitionObject) => ScalerDefinition;
    install: (object: ScalerDefinitionObject) => ScalerDefinition;
    definitionFromId: (id: string) => ScalerDefinition;
    definition: (object: ScalerDefinitionObject) => ScalerDefinition;
    instance: (object: ScalerObject) => Scaler;
    fromId: (id: string) => Scaler;
    initialize: () => void;
};
declare const ScalerWithModular: {
    new (...args: any[]): {
        [index: string]: unknown;
        constructProperties(object?: any): void;
        definition: ModularDefinition;
        readonly definitions: Definition[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly modularDefinitions: Definition[];
        readonly copy: Instance;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class ScalerClass extends ScalerWithModular {
    definition: ScalerDefinition;
    get id(): string;
    set id(value: string);
}
type TransitionObject = ModularObject & VisibleObject;
interface Transition extends Modular, Visible {
    definition: TransitionDefinition;
    mergeClipsIntoContextAtTime(clips: Visible[], context: VisibleContext, time: Time, quantize: number, color?: string): void;
}
interface TransitionDefinitionTransformObject {
    filters?: FilterObject[];
    merger?: MergerObject;
    scaler?: ScalerObject;
}
interface TransitionDefinitionObject extends ModularDefinitionObject, ClipDefinitionObject {
    to?: TransitionDefinitionTransformObject;
    from?: TransitionDefinitionTransformObject;
}
interface TransitionDefinition extends Omit<ModularDefinition, "loadedVisible">, VisibleDefinition {
    drawVisibleFilters(clips: Visible[], modular: Transition, time: Time, quantize: number, context: VisibleContext, color?: string): void;
    instance: Transition;
    instanceFromObject(object: TransitionObject): Transition;
}
type TransitionFactory = GenericFactory<Transition, TransitionObject, TransitionDefinition, TransitionDefinitionObject>;
interface VideoObject extends AudibleObject, VisibleObject {
    speed?: number;
}
interface Video extends Audible, Transformable {
    definition: VideoDefinition;
    copy: Video;
    speed: number;
}
interface VideoDefinitionObject extends AudibleDefinitionObject {
    begin?: number;
    video_rate?: ScalarValue;
    fps?: ScalarValue;
    increment?: number;
    pattern?: string;
    source?: string;
    url?: string;
}
interface VideoDefinition extends Omit<AudibleDefinition, "loadedVisible">, Omit<VisibleDefinition, "loadedAudible"> {
    instance: Video;
    instanceFromObject(object: VideoObject): Video;
    urls(start: Time, end?: Time): string[];
}
type VideoFactory = GenericFactory<Video, VideoObject, VideoDefinition, VideoDefinitionObject>;
interface MasherObject extends InstanceObject {
    // audibleContext? : AudibleContext
    autoplay?: boolean;
    buffer?: number;
    canvas?: ContextElement;
    fps?: number;
    loop?: boolean;
    mash?: Mash;
    precision?: number;
    volume?: number;
}
type ClipOrEffect = Clip | Effect;
type MasherAddPromise = Promise<ClipOrEffect>;
interface Masher extends Instance {
    add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): MasherAddPromise;
    addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): LoadPromise;
    addEffect(effect: Effect, insertIndex?: number): LoadPromise;
    addTrack(trackType: TrackType): void;
    // audibleContext : AudibleContext
    autoplay: boolean;
    buffer: number;
    can(method: string): boolean;
    canvas: ContextElement;
    change: MasherChangeHandler;
    changeClip(property: string, value?: SelectionValue, clip?: Clip): void;
    changeEffect(property: string, value?: SelectionValue, effect?: Effect): void;
    changeMash(property: string, value?: SelectionValue): void;
    clips: Clip[];
    currentTime: number;
    definitions: Definition[];
    destroy(): void;
    draw(): void;
    duration: number;
    fps: number;
    // frame : number
    // frames : number
    freeze(): void;
    goToTime(value: Time): LoadPromise;
    isSelected(object: ClipOrEffect): boolean;
    loadedDefinitions: DefinitionTimes;
    loop: boolean;
    mash: Mash;
    move(objectOrArray: ClipOrEffect | ClipOrEffect[], moveType: MoveType, frameOrIndex?: number, trackIndex?: number): void;
    moveClips(clipOrArray: Clip | Clip[], frameOrIndex?: number, trackIndex?: number): void;
    moveEffects(effectOrArray: Effect | Effect[], index?: number): void;
    muted: boolean;
    pause(): void;
    paused: boolean;
    play(): void;
    position: number;
    positionStep: number;
    precision: number;
    redo(): void;
    remove(objectOrArray: ClipOrEffect | ClipOrEffect[], moveType: MoveType): void;
    removeClips(clipOrArray: Clip | Clip[]): void;
    removeEffects(effectOrArray: Effect | Effect[]): void;
    save(): void;
    select(object: ClipOrEffect | undefined, toggleSelected?: boolean): void;
    selectClip(clip: Clip | undefined, toggleSelected?: boolean): void;
    selectEffect(effect: Effect | undefined, toggleSelected?: boolean): void;
    selectMash(): void;
    selected: Clip | Effect | Mash;
    selectedClipsOrEffects: Clip[] | Effect[];
    selectedClip: Clip | UnknownObject;
    selectedClipOrMash: Clip | Mash;
    selectedClips: Clip[];
    selectedEffect: Effect | UnknownObject;
    selectedEffects: Effect[];
    selectionObjects: SelectionObject[];
    split(): void;
    time: Time;
    timeRange: TimeRange;
    undo(): void;
    visibleContext: VisibleContext; // for tests
    volume: number;
}
interface MasherDefinition extends Definition {
    instance: Masher;
    instanceFromObject(object: MasherObject): Masher;
}
type MasherDefinitionObject = DefinitionObject;
interface MasherFactory extends GenericFactory<Masher, MasherObject, MasherDefinition, MasherDefinitionObject> {
    destroy(masher: Masher): void;
    instance(object?: MasherObject): Masher;
}
type FactoryObject = {
    [DefinitionType.Filter]?: FilterFactory;
    [DefinitionType.Audio]?: AudioFactory;
    [DefinitionType.Effect]?: EffectFactory;
    [DefinitionType.Font]?: FontFactory;
    [DefinitionType.Image]?: ImageFactory;
    [DefinitionType.Mash]?: MashFactory;
    [DefinitionType.Masher]?: MasherFactory;
    [DefinitionType.Merger]?: MergerFactory;
    [DefinitionType.Scaler]?: ScalerFactory;
    [DefinitionType.Theme]?: ThemeFactory;
    [DefinitionType.Transition]?: TransitionFactory;
    [DefinitionType.Video]?: VideoFactory;
};
declare const Factories: FactoryObject;
declare class FilterDefinitionClass extends DefinitionClass {
    constructor(...args: Any[]);
    draw(_evaluator: Evaluator, _evaluated: ValueObject): VisibleContext;
    get instance(): Filter;
    instanceFromObject(object: FilterObject): Filter;
    parameters: Parameter[];
    retain: boolean;
    scopeSet(_evaluator: Evaluator): void;
    type: DefinitionType;
}
declare const filterDefinition: (object: FilterDefinitionObject) => FilterDefinition;
declare const filterDefinitionFromId: (id: string) => FilterDefinition;
declare const filterInstance: (object: FilterDefinitionObject) => Filter;
declare const filterFromId: (id: string) => Filter;
declare const filterInitialize: () => void;
declare const filterDefine: (object: FilterDefinitionObject) => FilterDefinition;
declare const FilterFactoryImplementation: {
    define: (object: FilterDefinitionObject) => FilterDefinition;
    install: (object: FilterDefinitionObject) => FilterDefinition;
    definition: (object: FilterDefinitionObject) => FilterDefinition;
    definitionFromId: (id: string) => FilterDefinition;
    fromId: (id: string) => Filter;
    initialize: () => void;
    instance: (object: FilterDefinitionObject) => Filter;
};
declare class FilterClass extends InstanceClass {
    constructor(...args: Any[]);
    definition: FilterDefinition;
    drawFilter(evaluator: Evaluator): VisibleContext;
    evaluated(evaluator: Evaluator): ValueObject;
    parameters: Parameter[];
    toJSON(): JsonObject;
}
declare class FontDefinitionClass extends DefinitionClass {
    constructor(...args: Any[]);
    get instance(): Font;
    instanceFromObject(object: FontObject): Font;
    load(start: Time, end?: Time): LoadPromise;
    loaded(start: Time, end?: Time): boolean;
    loadedVisible(_time?: Time): Any;
    retain: boolean;
    source: string;
    toJSON(): JsonObject;
    type: DefinitionType;
}
declare const fontDefinition: (object: FontDefinitionObject) => FontDefinition;
declare const fontDefinitionFromId: (id: string) => FontDefinition;
declare const fontInstance: (object: FontObject) => Font;
declare const fontFromId: (id: string) => Font;
declare const fontInitialize: () => void;
declare const fontDefine: (object: FontDefinitionObject) => FontDefinition;
declare const FontFactoryImplementation: {
    define: (object: FontDefinitionObject) => FontDefinition;
    install: (object: FontDefinitionObject) => FontDefinition;
    definition: (object: FontDefinitionObject) => FontDefinition;
    definitionFromId: (id: string) => FontDefinition;
    fromId: (id: string) => Font;
    initialize: () => void;
    instance: (object: FontObject) => Font;
};
declare class FontClass extends InstanceClass {
    definition: FontDefinition;
}
declare class FontLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadFontPromise;
}
declare class FontProcessor extends Processor {
    process(url: string, buffer: ArrayBuffer): LoadFontPromise;
}
declare const ImageDefinitionWithVisible: {
    new (...args: any[]): {
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        _duration?: number | undefined;
        duration: number;
        visible: boolean;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class ImageDefinitionClass extends ImageDefinitionWithVisible {
    constructor(...args: Any[]);
    get instance(): Image;
    instanceFromObject(object: ImageObject): Image;
    load(start: Time, end?: Time): LoadPromise;
    loaded(start: Time, end?: Time): boolean;
    loadedVisible(_time?: Time): DrawingSource | undefined;
    source: string;
    type: DefinitionType;
    toJSON(): JsonObject;
    unload(times?: Times[]): void;
    urlVisible: string;
}
declare const imageDefinition: (object: ImageDefinitionObject) => ImageDefinition;
declare const imageDefinitionFromId: (id: string) => ImageDefinition;
declare const imageInstance: (object: ImageObject) => Image;
declare const imageFromId: (id: string) => Image;
declare const imageInitialize: () => void;
declare const imageDefine: (object: ImageDefinitionObject) => ImageDefinition;
/**
 * @internal
 */
declare const imageInstall: (object: ImageDefinitionObject) => ImageDefinition;
declare const ImageFactoryImplementation: {
    define: (object: ImageDefinitionObject) => ImageDefinition;
    install: (object: ImageDefinitionObject) => ImageDefinition;
    definition: (object: ImageDefinitionObject) => ImageDefinition;
    definitionFromId: (id: string) => ImageDefinition;
    fromId: (id: string) => Image;
    initialize: () => void;
    instance: (object: ImageObject) => Image;
};
declare const ImageWithTransformable: {
    new (...args: any[]): {
        [index: string]: unknown;
        readonly definitions: Definition[];
        effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        effects: Effect[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void;
        merger: Merger;
        readonly propertyValues: SelectionObject;
        scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        scaler: Scaler;
        toJSON(): JsonObject;
        contextAtTimeToSize(time: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        contextAtTimeToSize(mashTime: Time, quantize: number, _dimensions: Size): VisibleContext | undefined;
        mergeContextAtTime(_time: Time, _quantize: number, _context: VisibleContext): void;
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definitionTime(quantize: number, time: Time): Time;
        readonly endFrame: number;
        endTime(quantize: number): Time;
        frame: number;
        frames: number;
        maxFrames(_quantize: number, _trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(time: Time, quantize: number): TimeRange;
        toJSON(): JsonObject;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class ImageClass extends ImageWithTransformable {
    definition: ImageDefinition;
}
declare class ImageLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadImagePromise;
}
declare class MashClass extends InstanceClass implements Mash {
    constructor(...args: Any[]);
    addClipsToTrack(clips: Clip[], trackIndex?: number, insertIndex?: number, frames?: number[]): void;
    addTrack(trackType: TrackType): Track;
    private assureClipsHaveFrames;
    private _audibleContext?;
    // get audibleContext(): AudibleContext {
    //   if (!this._audibleContext) {
    //     this._audibleContext = ContextFactory.audible()
    //     if (this._composition) this.composition.audibleContext = this._audibleContext
    //   }
    //   return this._audibleContext
    // }
    // set audibleContext(value: AudibleContext) {
    //   if (this._audibleContext !== value) {
    //     this._audibleContext = value
    //     if (this._composition) this.composition.audibleContext = value
    //   }
    // }
    audio: Track[];
    private _backcolor;
    get backcolor(): string;
    set backcolor(value: string);
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    get bufferFrames(): number;
    private get bufferTime();
    private _bufferTimer?;
    changeClipFrames(clip: Clip, value: number): void;
    changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void;
    clipIntersects(clip: Clip, range: TimeRange): boolean;
    clipTrack(clip: Clip): Track;
    clipTrackAtIndex(clip: Clip, index?: number): Track;
    get clips(): Clip[];
    //   const rangeTracks = this.tracksInRange(trackRange)
    //   const inTracks = this.clipsInTracks(rangeTracks)
    //   if (!timeRange) return inTracks
    //   return this.filterIntersecting(inTracks, timeRange)
    // }
    private clipsAtTimes;
    private clipsAudible;
    private clipsInTracks;
    private filterIntersecting;
    private get clipsAudibleInTracks();
    private clipsAudibleInTimeRange;
    private get clipsVideo();
    private clipsVisible;
    private clipsVisibleAtTime;
    clipsVisibleSlice(frame: number, frames: number): Visible[];
    private clipsVisibleInTimeRange;
    compositeAudible(): boolean;
    private _composition?;
    get composition(): Composition;
    compositeVisible(): void;
    compositeVisibleRequest(): void;
    definition: MashDefinition;
    destroy(): void;
    private _drawAtInterval?;
    private drawAtInterval;
    drawnTime?: Time;
    private drawTime;
    get duration(): number;
    private emitIfFramesChange;
    get endTime(): Time;
    get frame(): number;
    get frames(): number;
    private _gain;
    get gain(): number;
    set gain(value: number);
    handleAction(action: Action): void;
    get startAndEnd(): Time[];
    load(): LoadPromise;
    loadAndComposite(): void;
    get loadedDefinitions(): DefinitionTimes;
    loop: boolean;
    maxTracks(type?: TrackType): number;
    get media(): Definition[];
    private _paused;
    get paused(): boolean;
    set paused(value: boolean);
    private _playing;
    get playing(): boolean;
    set playing(value: boolean);
    removeClipsFromTrack(clips: Clip[]): void;
    removeTrack(trackType: TrackType): void;
    quantize: number;
    private seekTime?;
    seekToTime(time: Time): LoadPromise;
    get stalled(): boolean;
    private stopLoadAndDraw;
    get time(): Time;
    get timeRange(): TimeRange;
    get timeRangeToBuffer(): TimeRange;
    toJSON(): JsonObject;
    trackOfTypeAtIndex(type: TrackType, index?: number): Track;
    private trackOptions;
    get tracks(): Track[];
    // tracksInRange(trackRange?: TrackRange): Track[] | undefined {
    //   if (!trackRange) return
    //   const { type } = trackRange
    //   const range = trackRange.relative ? trackRange.withMax(this.maxTracks(type)) : trackRange
    //   const inRange = []
    //   if (type !== TrackType.Video) {
    //     inRange.push(...this.audio.slice(range.first, range.last))
    //   }
    //   if (type !== TrackType.Audio) {
    //     inRange.push(...this.video.slice(range.first, range.last))
    //   }
    //   return inRange
    // }
    video: Track[];
    private _visibleContext?;
    get visibleContext(): VisibleContext;
    set visibleContext(value: VisibleContext);
}
declare const mashDefinition: (object: MashDefinitionObject) => MashDefinition;
declare const mashDefinitionFromId: (id: string) => MashDefinition;
declare const mashInstance: (object: MashOptions) => Mash;
declare const mashFromId: (id: string) => Mash;
declare const mashInitialize: () => void;
declare const mashDefine: (object: MashDefinitionObject) => MashDefinition;
/**
 * @internal
 */
declare const mashInstall: (object: MashDefinitionObject) => MashDefinition;
declare const MashFactoryImplementation: {
    define: (object: MashDefinitionObject) => MashDefinition;
    install: (object: MashDefinitionObject) => MashDefinition;
    definition: (object: MashDefinitionObject) => MashDefinition;
    definitionFromId: (id: string) => MashDefinition;
    fromId: (id: string) => Mash;
    initialize: () => void;
    instance: (object: MashOptions) => Mash;
};
declare class MashDefinitionClass extends DefinitionClass {
    constructor(...args: Any[]);
    id: string;
    get instance(): Mash;
    instanceFromObject(object: MashObject): Mash;
    retain: boolean;
    type: DefinitionType;
}
declare const masherDestroy: (masher: Masher) => void;
declare const masherDefinition: (object: MasherDefinitionObject) => MasherDefinition;
declare const masherDefinitionFromId: (id: string) => MasherDefinition;
declare const masherInstance: (object?: MasherObject) => Masher;
declare const masherFromId: (id: string) => Masher;
declare const masherInitialize: () => void;
declare const masherDefine: (object: MasherDefinitionObject) => MasherDefinition;
declare const MasherFactoryImplementation: {
    define: (object: MasherDefinitionObject) => MasherDefinition;
    install: (object: MasherDefinitionObject) => MasherDefinition;
    definition: (object: MasherDefinitionObject) => MasherDefinition;
    definitionFromId: (id: string) => MasherDefinition;
    destroy: (masher: Masher) => void;
    fromId: (id: string) => Masher;
    initialize: () => void;
    instance: (object?: MasherObject) => Masher;
};
declare class MasherDefinitionClass extends DefinitionClass {
    constructor(...args: Any[]);
    id: string;
    get instance(): Masher;
    instanceFromObject(object: MasherObject): Masher;
    retain: boolean;
    type: DefinitionType;
}
declare class MasherClass extends InstanceClass implements Masher {
    [index: string]: unknown;
    constructor(...args: Any[]);
    private actionCreate;
    private _actions?;
    private get actions();
    add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): MasherAddPromise;
    addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): LoadPromise;
    addEffect(effect: Effect, insertIndex?: number): LoadPromise;
    addTrack(trackType?: TrackType): void;
    // private _audibleContext? : AudibleContext
    // get audibleContext() : AudibleContext {
    //   if (!this._audibleContext) {
    //     console.log(this.constructor.name, "audibleContext initializing")
    //     this._audibleContext = ContextFactory.audible()
    //     if (this._mash) this.mash.audibleContext = this._audibleContext
    //   }
    //   return this._audibleContext
    // }
    // set audibleContext(value : AudibleContext) {
    //   if (this._audibleContext !== value) {
    //     this._audibleContext = value
    //     if (this._mash) this.mash.audibleContext = value
    //   }
    // }
    autoplay: boolean;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    can(method: string): boolean;
    get canvas(): ContextElement;
    set canvas(value: ContextElement);
    change(property: string, value?: SelectionValue): void;
    changeClip(property: string, value?: SelectionValue, clip?: Clip): void;
    changeEffect(property: string, value?: SelectionValue, effect?: Effect): void;
    changeMash(property: string, value?: SelectionValue): void;
    changeTransformer(type: string, property: string, value?: SelectionValue): void;
    private clipCanBeSplit;
    get clips(): Clip[];
    private currentActionReusable;
    get currentTime(): number;
    get definitions(): Definition[];
    // call when player removed from DOM
    destroy(): void;
    draw(): void;
    get duration(): number;
    private get endTime();
    private filterClipSelection;
    private _fps;
    get fps(): number;
    set fps(value: number);
    get frame(): number;
    set frame(value: number);
    get frames(): number;
    freeze(): void;
    private get gain();
    goToTime(value: Time): LoadPromise;
    isSelected(object: ClipOrEffect): boolean;
    private handleAction;
    private loadMash;
    private loadMashAndDraw;
    get loadedDefinitions(): DefinitionTimes;
    private _loop;
    get loop(): boolean;
    set loop(value: boolean);
    private _mash?;
    get mash(): Mash;
    set mash(object: Mash);
    private mashOptions;
    move(objectOrArray: ClipOrEffect | ClipOrEffect[], moveType: MoveType, frameOrIndex?: number, trackIndex?: number): void;
    moveClips(clipOrArray: Clip | Clip[], frameOrIndex?: number, trackIndex?: number): void;
    moveEffects(effectOrArray: Effect | Effect[], index?: number): void;
    private _muted;
    get muted(): boolean;
    set muted(value: boolean);
    pause(): void;
    private _paused;
    get paused(): boolean;
    set paused(value: boolean);
    play(): void;
    get position(): number;
    set position(value: number);
    get positionStep(): number;
    precision: number;
    private _pristine?;
    private get pristineOrThrow();
    private _pristineEffect?;
    private get pristineEffectOrThrow();
    redo(): void;
    remove(objectOrArray: ClipOrEffect | ClipOrEffect[], moveType: MoveType): void;
    removeClips(clipOrArray: Clip | Clip[]): void;
    removeEffects(effectOrArray: Effect | Effect[]): void;
    save(): void;
    select(object: ClipOrEffect | undefined, toggleSelected?: boolean): void;
    get selectedClipsOrEffects(): Clip[] | Effect[];
    selectClip(clip: Clip | undefined, toggleSelected?: boolean): void;
    selectEffect(effect: Effect | undefined, toggleSelected?: boolean): void;
    selectMash(): void;
    get selected(): Clip | Effect | Mash;
    get selectedClip(): Clip | UnknownObject;
    set selectedClip(value: Clip | UnknownObject);
    private selectedClipObject;
    get selectedClipOrMash(): Clip | Mash;
    private get selectedClipOrThrow();
    private _selectedClips;
    get selectedClips(): Clip[];
    set selectedClips(value: Clip[]);
    get selectedEffect(): Effect | UnknownObject;
    set selectedEffect(value: Effect | UnknownObject);
    get selectedEffectOrThrow(): Effect;
    private _selectedEffects;
    get selectedEffects(): Effect[];
    set selectedEffects(value: Effect[]);
    get selectionObjects(): SelectionObject[];
    private get silenced();
    split(): void;
    get time(): Time;
    set time(value: Time);
    get timeRange(): TimeRange;
    undo(): void;
    visibleContext: VisibleContext;
    private _volume;
    get volume(): number;
    set volume(value: number);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function AudibleDefinitionMixin<TBase extends Constrained<ClipDefinition>>(Base: TBase): {
    new (...args: Any[]): {
        audible: boolean;
        load(start: Time, end?: Time | undefined): LoadPromise;
        loaded(start: Time, end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): AudioBuffer | undefined;
        loops: boolean;
        source?: string | undefined;
        stream: boolean;
        toJSON(): JsonObject;
        unload(times?: Times[]): void;
        urlAudible: string;
        waveform?: string | undefined;
        visible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        type: DefinitionType;
        value(name: string): SelectionValue | undefined;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function AudibleMixin<TBase extends Constrained<Clip>>(Base: TBase): {
    new (...args: Any[]): {
        [index: string]: unknown;
        audible: boolean;
        definition: AudibleDefinition;
        definitionTime(quantize: number, time: Time): Time;
        gain: number;
        gainPairs: number[][];
        readonly muted: boolean;
        maxFrames(quantize: number, trim?: number | undefined): number;
        toJSON(): JsonObject;
        trim: number;
        trimTime(quantize: number): Time;
        endFrame: number;
        frame: number;
        frames: number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function ClipDefinitionMixin<TBase extends Constrained<Definition>>(Base: TBase): {
    new (...args: Any[]): {
        audible: boolean;
        _duration?: number | undefined;
        duration: number;
        visible: boolean;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function ClipMixin<TBase extends Constrained<Instance>>(Base: TBase): {
    new (...args: Any[]): {
        [index: string]: unknown;
        audible: boolean;
        definitionTime(quantize: number, time: Time): Time;
        readonly endFrame: number;
        endTime(quantize: number): Time;
        frame: number;
        frames: number;
        maxFrames(_quantize: number, _trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(time: Time, quantize: number): TimeRange;
        toJSON(): JsonObject;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function ModularMixin<TBase extends Constrained<Instance>>(Base: TBase): {
    new (...args: Any[]): {
        [index: string]: unknown;
        constructProperties(object?: Any): void;
        definition: ModularDefinition;
        readonly definitions: Definition[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly modularDefinitions: Definition[];
        readonly copy: Instance;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function ModularDefinitionMixin<TBase extends Constrained<Definition>>(Base: TBase): {
    new (...args: Any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
        retain: boolean;
        toJSON(): JsonObject;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function TransformableMixin<TBase extends Constrained<Visible>>(Base: TBase): {
    new (...args: Any[]): {
        [index: string]: unknown;
        readonly definitions: Definition[];
        effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        effects: Effect[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void;
        merger: Merger;
        readonly propertyValues: SelectionObject;
        scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        scaler: Scaler;
        toJSON(): JsonObject;
        contextAtTimeToSize(time: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function VisibleDefinitionMixin<TBase extends Constrained<ClipDefinition>>(Base: TBase): {
    new (...args: any[]): {
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & TBase;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
declare function VisibleMixin<TBase extends Constrained<Clip>>(Base: TBase): {
    new (...args: any[]): {
        [index: string]: unknown;
        contextAtTimeToSize(mashTime: Time, quantize: number, _dimensions: Size): VisibleContext | undefined;
        mergeContextAtTime(_time: Time, _quantize: number, _context: VisibleContext): void;
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & TBase;
declare const ThemeDefinitionWithVisible: {
    new (...args: any[]): {
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        _duration?: number | undefined;
        duration: number;
        visible: boolean;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
        retain: boolean;
        toJSON(): JsonObject;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class ThemeDefinitionClass extends ThemeDefinitionWithVisible {
    constructor(...args: Any[]);
    get instance(): Theme;
    instanceFromObject(object: ThemeObject): Theme;
    type: DefinitionType;
}
declare const themeDefinition: (object: ThemeDefinitionObject) => ThemeDefinition;
declare const themeDefinitionFromId: (id: string) => ThemeDefinition;
declare const themeInstance: (object: ThemeObject) => Theme;
declare const themeFromId: (id: string) => Theme;
declare const themeInitialize: () => void;
declare const themeDefine: (object: ThemeDefinitionObject) => ThemeDefinition;
declare const ThemeFactoryImplementation: {
    define: (object: ThemeDefinitionObject) => ThemeDefinition;
    install: (object: ThemeDefinitionObject) => ThemeDefinition;
    definition: (object: ThemeDefinitionObject) => ThemeDefinition;
    definitionFromId: (id: string) => ThemeDefinition;
    fromId: (id: string) => Theme;
    initialize: () => void;
    instance: (object: ThemeObject) => Theme;
};
declare const ThemeWithTransformable: {
    new (...args: any[]): {
        [index: string]: unknown;
        readonly definitions: Definition[];
        effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        effects: Effect[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void;
        merger: Merger;
        readonly propertyValues: SelectionObject;
        scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        scaler: Scaler;
        toJSON(): JsonObject;
        contextAtTimeToSize(time: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        contextAtTimeToSize(mashTime: Time, quantize: number, _dimensions: Size): VisibleContext | undefined;
        mergeContextAtTime(_time: Time, _quantize: number, _context: VisibleContext): void;
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definitionTime(quantize: number, time: Time): Time;
        readonly endFrame: number;
        endTime(quantize: number): Time;
        frame: number;
        frames: number;
        maxFrames(_quantize: number, _trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(time: Time, quantize: number): TimeRange;
        toJSON(): JsonObject;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        constructProperties(object?: any): void;
        definition: ModularDefinition;
        readonly definitions: Definition[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly modularDefinitions: Definition[];
        readonly copy: Instance;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class ThemeClass extends ThemeWithTransformable {
    contextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
    definition: ThemeDefinition;
}
declare const TransitionDefinitionWithVisible: {
    new (...args: any[]): {
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        _duration?: number | undefined;
        duration: number;
        visible: boolean;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
        retain: boolean;
        toJSON(): JsonObject;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class TransitionDefinitionClass extends TransitionDefinitionWithVisible {
    constructor(...args: Any[]);
    drawVisibleFilters(clips: Visible[], transition: Transition, time: Time, quantize: number, context: VisibleContext, color?: string): void;
    private fromFilters;
    private fromMerger;
    private fromScaler;
    get instance(): Transition;
    instanceFromObject(object: TransitionObject): Transition;
    private toFilters;
    private toMerger;
    private toScaler;
    toJSON(): JsonObject;
    type: DefinitionType;
}
declare const transitionDefinition: (object: TransitionDefinitionObject) => TransitionDefinition;
declare const transitionDefinitionFromId: (id: string) => TransitionDefinition;
declare const transitionInstance: (object: TransitionObject) => Transition;
declare const transitionFromId: (id: string) => Transition;
declare const transitionInitialize: () => void;
declare const transitionDefine: (object: TransitionDefinitionObject) => TransitionDefinition;
declare const TransitionFactoryImplementation: {
    define: (object: TransitionDefinitionObject) => TransitionDefinition;
    install: (object: TransitionDefinitionObject) => TransitionDefinition;
    definition: (object: TransitionDefinitionObject) => TransitionDefinition;
    definitionFromId: (id: string) => TransitionDefinition;
    fromId: (id: string) => Transition;
    initialize: () => void;
    instance: (object: TransitionObject) => Transition;
};
declare const TransitionWithVisible: {
    new (...args: any[]): {
        [index: string]: unknown;
        contextAtTimeToSize(mashTime: Time, quantize: number, _dimensions: Size): VisibleContext | undefined;
        mergeContextAtTime(_time: Time, _quantize: number, _context: VisibleContext): void;
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definitionTime(quantize: number, time: Time): Time;
        readonly endFrame: number;
        endTime(quantize: number): Time;
        frame: number;
        frames: number;
        maxFrames(_quantize: number, _trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(time: Time, quantize: number): TimeRange;
        toJSON(): JsonObject;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        constructProperties(object?: any): void;
        definition: ModularDefinition;
        readonly definitions: Definition[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly modularDefinitions: Definition[];
        readonly copy: Instance;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class TransitionClass extends TransitionWithVisible {
    contextAtTimeToSize(_time: Time, _quantize: number, _dimensions: Size): VisibleContext | undefined;
    definition: TransitionDefinition;
    mergeClipsIntoContextAtTime(clips: Visible[], context: VisibleContext, time: Time, quantize: number, color?: string): void;
    trackType: TrackType;
}
interface TypesJson {
    [index: string]: TypeObject;
}
declare class TypesClass {
    constructor(object: TypesJson);
    propertyType(type: DataType): Type;
    propertyTypeDefault(type: DataType): ScalarRaw;
    propertyTypes: Map<DataType, Type>;
}
declare const TypesInstance: TypesClass;
declare const VideoDefinitionWithVisible: {
    new (...args: any[]): {
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        load(start: Time, end?: Time | undefined): LoadPromise;
        loaded(start: Time, end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): AudioBuffer | undefined;
        loops: boolean;
        source?: string | undefined;
        stream: boolean;
        toJSON(): JsonObject;
        unload(times?: Times[]): void;
        urlAudible: string;
        waveform?: string | undefined;
        visible: boolean;
        duration: number;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        type: DefinitionType;
        value(name: string): SelectionValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        _duration?: number | undefined;
        duration: number;
        visible: boolean;
        icon?: string | undefined;
        id: string;
        readonly instance: Instance;
        instanceFromObject(object: InstanceObject): Instance;
        readonly instanceObject: InstanceObject;
        label: string;
        load(_start: Time, _end?: Time | undefined): LoadPromise;
        loaded(_start: Time, _end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): any;
        loadedVisible(_time?: Time | undefined): any;
        properties: Property[];
        readonly propertiesModular: Property[];
        property(name: string): Property | undefined;
        retain: boolean;
        toJSON(): JsonObject;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): SelectionValue | undefined;
    };
} & typeof DefinitionClass;
declare class VideoDefinitionClass extends VideoDefinitionWithVisible {
    constructor(...args: Any[]);
    begin: number;
    fps: number;
    private frames;
    private get framesMax();
    increment: number;
    get instance(): Video;
    instanceFromObject(object: VideoObject): Video;
    load(start: Time, end?: Time): LoadPromise;
    loaded(start: Time, end?: Time): boolean;
    loadedVisible(time?: Time): DrawingSource | undefined;
    pattern: string;
    source: string;
    trackType: TrackType;
    type: DefinitionType;
    toJSON(): JsonObject;
    unload(times?: Times[]): void;
    url: string;
    urlForFrame(frame: number): string;
    urls(start: Time, end?: Time): string[];
    get zeropadding(): number;
    private __zeropadding?;
}
declare const videoDefinition: (object: VideoDefinitionObject) => VideoDefinition;
declare const videoDefinitionFromId: (id: string) => VideoDefinition;
declare const videoInstance: (object: VideoObject) => Video;
declare const videoFromId: (id: string) => Video;
declare const videoInitialize: () => void;
declare const videoDefine: (object: VideoDefinitionObject) => VideoDefinition;
/**
 * @internal
 */
declare const videoInstall: (object: VideoDefinitionObject) => VideoDefinition;
declare const VideoFactoryImplementation: {
    define: (object: VideoDefinitionObject) => VideoDefinition;
    install: (object: VideoDefinitionObject) => VideoDefinition;
    definition: (object: VideoDefinitionObject) => VideoDefinition;
    definitionFromId: (id: string) => VideoDefinition;
    fromId: (id: string) => Video;
    initialize: () => void;
    instance: (object: VideoObject) => Video;
};
declare const VideoWithTransformable: {
    new (...args: any[]): {
        [index: string]: unknown;
        readonly definitions: Definition[];
        effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        effects: Effect[];
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void;
        merger: Merger;
        readonly propertyValues: SelectionObject;
        scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        scaler: Scaler;
        toJSON(): JsonObject;
        contextAtTimeToSize(time: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        contextAtTimeToSize(mashTime: Time, quantize: number, _dimensions: Size): VisibleContext | undefined;
        mergeContextAtTime(_time: Time, _quantize: number, _context: VisibleContext): void;
        trackType: TrackType;
        visible: boolean;
        audible: boolean;
        endFrame: number;
        frame: number;
        frames: number;
        maxFrames(quantize: number, trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        toJSON(): JsonObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definition: AudibleDefinition;
        definitionTime(quantize: number, time: Time): Time;
        gain: number;
        gainPairs: number[][];
        readonly muted: boolean;
        maxFrames(quantize: number, trim?: number | undefined): number;
        toJSON(): JsonObject;
        trim: number;
        trimTime(quantize: number): Time;
        endFrame: number;
        frame: number;
        frames: number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & {
    new (...args: any[]): {
        [index: string]: unknown;
        audible: boolean;
        definitionTime(quantize: number, time: Time): Time;
        readonly endFrame: number;
        endTime(quantize: number): Time;
        frame: number;
        frames: number;
        maxFrames(_quantize: number, _trim?: number | undefined): number;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(time: Time, quantize: number): TimeRange;
        toJSON(): JsonObject;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        _id?: string | undefined;
        readonly id: string;
        _identifier?: string | undefined;
        readonly identifier: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        setValue(key: string, value: SelectionValue): boolean;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class VideoClass extends VideoWithTransformable {
    constructor(...args: Any[]);
    get copy(): Video;
    definition: VideoDefinition;
    definitionTime(quantize: number, time: Time): Time;
    speed: number;
    toJSON(): JsonObject;
}
declare class VideoLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadVideoPromise;
}
interface AddTrackActionObject extends ActionObject {
    trackType: TrackType;
}
declare class AddTrackAction extends Action {
    constructor(object: AddTrackActionObject);
    trackType: TrackType;
    redoAction(): void;
    undoAction(): void;
}
interface ChangeActionObject extends ActionObject {
    property: string;
    redoValue: SelectionValue;
    target: Mash | Clip | Effect;
    undoValue: SelectionValue;
}
declare class ChangeAction extends Action {
    constructor(object: ChangeActionObject);
    property: string;
    redoValue: SelectionValue;
    target: Mash | Clip | Effect;
    undoValue: SelectionValue;
    get redoValueNumeric(): number;
    get undoValueNumeric(): number;
    redoAction(): void;
    undoAction(): void;
    updateAction(value: SelectionValue): void;
}
interface FreezeActionObject extends ActionObject {
    frames: number;
    freezeClip: Clip;
    frozenClip: Clip;
    index: number;
    insertClip: Clip;
    trackClips: Clip[];
}
declare class FreezeAction extends Action {
    constructor(object: FreezeActionObject);
    frames: number;
    index: number;
    trackClips: Clip[];
    insertClip: Clip;
    freezeClip: Clip;
    frozenClip: Clip;
    redoAction(): void;
    undoAction(): void;
}
declare class ChangeFramesAction extends ChangeAction {
    constructor(object: ChangeActionObject);
    clip: Clip;
    redoAction(): void;
    undoAction(): void;
}
interface ChangeTrimActionObject extends ChangeActionObject {
    frames: number;
}
declare class ChangeTrimAction extends ChangeAction {
    constructor(object: ChangeTrimActionObject);
    audibleClip: Audible;
    frames: number;
    redoAction(): void;
    undoAction(): void;
}
interface AddEffectActionObject extends ActionObject {
    effect: Effect;
    effects: Effect[];
    index: number;
}
declare class AddEffectAction extends Action {
    constructor(object: AddEffectActionObject);
    effect: Effect;
    effects: Effect[];
    index: number;
    redoAction(): void;
    undoAction(): void;
}
interface AddClipToTrackActionObject extends AddTrackActionObject {
    clip: Clip;
    createTracks: number;
    insertIndex: number;
    trackIndex: number;
}
declare class AddClipToTrackAction extends AddTrackAction {
    constructor(object: AddClipToTrackActionObject);
    clip: Clip;
    createTracks: number;
    insertIndex: number;
    trackIndex: number;
    get clips(): Clip[];
    get track(): Track;
    redoAction(): void;
    undoAction(): void;
}
interface MoveClipsActionObject extends ActionObject {
    clips: Clip[];
    insertIndex: number;
    redoFrames?: number[];
    trackIndex: number;
    undoFrames?: number[];
    undoInsertIndex: number;
    undoTrackIndex: number;
}
declare class MoveClipsAction extends Action {
    constructor(object: MoveClipsActionObject);
    clips: Clip[];
    insertIndex: number;
    trackIndex: number;
    undoTrackIndex: number;
    undoInsertIndex: number;
    undoFrames?: number[];
    redoFrames?: number[];
    addClips(trackIndex: number, insertIndex: number, frames?: number[]): void;
    redoAction(): void;
    undoAction(): void;
}
interface RemoveClipsActionObject extends ActionObject {
    clips: Clip[];
    index: number;
    track: Track;
}
declare class RemoveClipsAction extends Action {
    constructor(object: RemoveClipsActionObject);
    track: Track;
    clips: Clip[];
    index: number;
    get trackIndex(): number;
    redoAction(): void;
    undoAction(): void;
}
interface SplitActionObject extends ActionObject {
    index: number;
    insertClip: Clip;
    redoFrames: number;
    splitClip: Clip;
    trackClips: Clip[];
    undoFrames: number;
}
declare class SplitAction extends Action {
    constructor(object: SplitActionObject);
    index: number;
    insertClip: Clip;
    redoFrames: number;
    splitClip: Clip;
    trackClips: Clip[];
    undoFrames: number;
    redoAction(): void;
    undoAction(): void;
}
interface MoveEffectsActionObject extends ActionObject {
    effects: Effect[];
    redoEffects: Effect[];
    undoEffects: Effect[];
}
declare class MoveEffectsAction extends Action {
    constructor(object: MoveEffectsActionObject);
    effects: Effect[];
    redoEffects: Effect[];
    undoEffects: Effect[];
    redoAction(): void;
    undoAction(): void;
}
interface ActionsObject {
    mash: Mash;
}
declare class Actions {
    constructor(object: ActionsObject);
    get canRedo(): boolean;
    get canSave(): boolean;
    get canUndo(): boolean;
    get currentAction(): Action;
    get currentActionLast(): boolean;
    destroy(): void;
    add(action: Action): void;
    index: number;
    instances: Action[];
    mash: Mash;
    redo(): Action;
    save(): void;
    undo(): Action;
}
interface ActionObject {
    actions: Actions;
    mash: Mash;
    redoSelectedClips: Clip[];
    redoSelectedEffects: Effect[];
    type: string;
    undoSelectedClips: Clip[];
    undoSelectedEffects: Effect[];
    redoAction(): void;
    undoAction(): void;
}
declare class Action {
    constructor(object: ActionObject);
    actions: Actions;
    mash: Mash;
    undoSelectedClips: Clip[];
    redoSelectedClips: Clip[];
    undoSelectedEffects: Effect[];
    redoSelectedEffects: Effect[];
    done: boolean;
    get selectedClips(): Clip[];
    get selectedEffects(): Effect[];
    redo(): void;
    redoAction(): void;
    type: string;
    undo(): void;
    undoAction(): void;
}
declare class VisibleContext {
    constructor(object?: {
        context2d?: Context2D;
    });
    get alpha(): number;
    set alpha(value: number);
    get canvas(): ContextElement;
    set canvas(value: ContextElement);
    clear(): VisibleContext;
    clearSize(size: Size): VisibleContext;
    clearRect(rect: Rect): VisibleContext;
    get composite(): string;
    set composite(value: string);
    private get context2d();
    private set context2d(value);
    get dataUrl(): string;
    draw(source: DrawingSource): VisibleContext;
    drawAtPoint(source: DrawingSource, point: Point): VisibleContext;
    drawFill(fill: string): VisibleContext;
    drawFillInRect(fill: string, rect: Rect): VisibleContext;
    drawFillToSize(fill: string, size: Size): VisibleContext;
    drawImageData(data: ImageData): VisibleContext;
    drawImageDataAtPoint(data: ImageData, point: Point): VisibleContext;
    drawInRect(source: DrawingSource, rect: Rect): VisibleContext;
    drawInRectFromRect(source: DrawingSource, inRect: Rect, fromRect: Rect): VisibleContext;
    drawInRectFromSize(source: DrawingSource, rect: Rect, size: Size): VisibleContext;
    drawInSizeFromSize(source: DrawingSource, inSize: Size, fromSize: Size): VisibleContext;
    drawText(text: string, style: TextStyle): VisibleContext;
    drawTextAtPoint(text: string, style: TextStyle, point: Point): VisibleContext;
    drawToSize(source: DrawingSource, size: Size): VisibleContext;
    drawWithAlpha(source: DrawingSource, alpha: number): VisibleContext;
    drawWithComposite(source: DrawingSource, composite: string): VisibleContext;
    emit(type: EventType, detail?: UnknownObject, target?: ContextElement): void;
    get fill(): string;
    set fill(value: string);
    get font(): string;
    set font(value: string);
    get imageData(): ContextData;
    get imageDataFresh(): ContextData;
    imageDataFromRect(rect: Rect): ContextData;
    imageDataFromSize(size: Size): ContextData;
    get drawingSource(): DrawingSource;
    get shadow(): string;
    set shadow(value: string);
    get shadowPoint(): Point;
    set shadowPoint(point: Point);
    get size(): Size;
    set size(value: Size);
    private _context2d?;
}
interface EventsDetail {
    action?: Action;
}
type EventsType = CustomEvent<EventsDetail>;
declare class ContextFactory {
    audible(): AudibleContext;
    fromCanvas(canvas: ContextElement): VisibleContext;
    fromContext2D(context2d: Context2D): VisibleContext;
    toSize(size: Size): VisibleContext;
    get type(): {
        [k: string]: string;
    };
    get types(): string[];
    visible(): VisibleContext;
}
declare const ContextFactoryInstance: ContextFactory;
declare class Evaluator {
    [index: string]: unknown;
    constructor(timeRange: TimeRange, context: VisibleContext, size: Size, mergeContext?: VisibleContext);
    ceil: (x: number) => number;
    conditionalValue(conditionals: ValueObject[]): ScalarValue;
    context: VisibleContext;
    get duration(): number;
    evaluate(value: ScalarValue | ValueObject[]): ScalarValue;
    private evaluateExpression;
    floor: (x: number) => number;
    get(key: string): EvaluatorValue | undefined;
    has(key: string): boolean;
    initialize(key: string, value: EvaluatorValue): boolean;
    get inputSize(): Size;
    get keys(): string[];
    private map;
    mergeContext?: VisibleContext;
    mm_cmp(a: number, b: number, x: number, y: number): number;
    get mm_dimensions(): string;
    get mm_duration(): number;
    get mm_fps(): number;
    get mm_height(): number;
    mm_horz(size: ScalarValue, proud: ScalarRaw): number;
    mm_max: (...values: number[]) => number;
    mm_min: (...values: number[]) => number;
    get mm_t(): number;
    mm_vert(size: ScalarValue, proud: ScalarRaw): number;
    get mm_width(): number;
    get position(): number;
    replaceKeys(value: string): string;
    set(key: string, value: EvaluatorValue): void;
    setInputSize({ width, height }: Size): void;
    size: Size;
    sized(vertical: number, size: ScalarValue, proud: ScalarRaw): number;
    get t(): number;
    timeRange: TimeRange;
}
declare const Id: () => string;
declare const objectType: (value: unknown) => boolean;
declare const stringType: (value: unknown) => boolean;
declare const undefinedType: (value: unknown) => boolean;
declare const numberType: (value: unknown) => boolean;
declare const booleanType: (value: unknown) => boolean;
declare const methodType: (value: unknown) => boolean;
declare const isDefined: (value: unknown) => boolean;
declare const isNan: (value: unknown) => boolean;
declare const isInteger: (value: unknown) => boolean;
declare const isFloat: (value: unknown) => boolean;
declare const isPositive: (value: unknown) => boolean;
declare const isAboveZero: (value: unknown) => boolean;
declare const isArray: (value: unknown) => boolean;
declare const isPopulatedString: (value: unknown) => boolean;
declare const isPopulatedObject: (value: unknown) => boolean;
declare const isPopulatedArray: (value: unknown) => boolean;
declare const Is: {
    aboveZero: (value: unknown) => boolean;
    array: (value: unknown) => boolean;
    boolean: (value: unknown) => boolean;
    defined: (value: unknown) => boolean;
    float: (value: unknown) => boolean;
    integer: (value: unknown) => boolean;
    method: (value: unknown) => boolean;
    nan: (value: unknown) => boolean;
    number: (value: unknown) => boolean;
    object: (value: unknown) => boolean;
    populatedArray: (value: unknown) => boolean;
    populatedObject: (value: unknown) => boolean;
    populatedString: (value: unknown) => boolean;
    positive: (value: unknown) => boolean;
    string: (value: unknown) => boolean;
    undefined: (value: unknown) => boolean;
};
declare const pixelRgbaAtIndex: (index: number, pixels: Pixels) => Rgba;
declare const pixelNeighboringRgbas: (pixel: number, data: Pixels, size: Size) => Rgba[];
declare const pixelColor: (value: ScalarValue) => string;
declare const pixelPerFrame: (frames: number, width: number, zoom: number) => number;
declare const pixelFromFrame: (frame: number, perFrame: number, rounding?: string) => number;
declare const pixelToFrame: (pixels: number, perFrame: number, rounding?: string) => number;
declare const Pixel: {
    color: (value: ScalarValue) => string;
    fromFrame: (frame: number, perFrame: number, rounding?: string) => number;
    neighboringRgbas: (pixel: number, data: Pixels, size: Size) => Rgba[];
    perFrame: (frames: number, width: number, zoom: number) => number;
    rgbaAtIndex: (index: number, pixels: Pixels) => Rgba;
    toFrame: (pixels: number, perFrame: number, rounding?: string) => number;
};
declare const roundMethod: (rounding?: string) => NumberConverter;
declare const roundWithMethod: (number: number, method?: string) => number;
declare const Round: {
    method: (rounding?: string) => NumberConverter;
    withMethod: (number: number, method?: string) => number;
};
declare const Seconds: (seconds: number, fps: number, duration: number) => string;
declare const byFrame: (a: WithFrame, b: WithFrame) => number;
declare const byTrack: (a: WithTrack, b: WithTrack) => number;
declare const byLabel: (a: WithLabel, b: WithLabel) => number;
declare const Sort: {
    byFrame: (a: WithFrame, b: WithFrame) => number;
    byLabel: (a: WithLabel, b: WithLabel) => number;
    byTrack: (a: WithTrack, b: WithTrack) => number;
};
declare class TrackRange {
    constructor(first?: number, last?: number, type?: TrackType);
    get count(): number;
    last: number;
    get relative(): boolean;
    equals(trackRange: TrackRange): boolean;
    first: number;
    get tracks(): number[];
    toString(): string;
    type?: TrackType;
    withEnd(last: number): TrackRange;
    withMax(max: number): TrackRange;
    static ofType(type: TrackType, last?: number, first?: number): TrackRange;
    static fromArgs(first?: number, last?: number, type?: TrackType): TrackRange;
}
declare class CacheClass {
    constructor();
    add(url: string, value: Any): void;
    audibleContext: AudibleContext;
    // audioContext: AudioContext
    cached(url: string): boolean;
    private cachedByKey;
    get(url: string): Any | undefined;
    key(url: string): string;
    remove(url: string): void;
    private urlsByKey;
}
declare const Cache: CacheClass;
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
declare class MovieMasher {
    /**
     * Object with methods to create audio definitions and instances
     */
    static get [DefinitionType.Audio](): AudioFactory;
    /**
     * Object with methods to create effect definitions and instances
     */
    static get [DefinitionType.Effect](): EffectFactory;
    /**
     * Object with methods to create audio definitions and instances
     */
    static get [DefinitionType.Filter](): FilterFactory;
    static get [DefinitionType.Font](): FontFactory;
    static get [DefinitionType.Image](): ImageFactory;
    static get [DefinitionType.Mash](): MashFactory;
    static get [DefinitionType.Masher](): MasherFactory;
    static get [DefinitionType.Merger](): MergerFactory;
    static get [DefinitionType.Scaler](): ScalerFactory;
    static get [DefinitionType.Theme](): ThemeFactory;
    static get [DefinitionType.Transition](): TransitionFactory;
    static get [DefinitionType.Video](): VideoFactory;
    private constructor();
}
export { Any, Context2D, ContextElement, DrawingSource, ContextData, Pixels, Timeout, Interval, EventsTarget, ScalarValue, ScalarArray, NumberObject, UnknownObject, ObjectUnknown, ValueObject, ScalarRaw, Scalar, ScalarConverter, NumberConverter, StringSetter, NumberSetter, BooleanSetter, JsonValue, JsonObject, SelectionObject, SelectionValue, EvaluatorValue, WithFrame, WithTrack, WithLabel, Rgb, Rgba, WithType, WithId, WithTypeAndId, WithTypeAndValue, Size, EvaluatedSize, EvaluatedPoint, Point, EvaluatedRect, Rect, TextStyle, RgbObject, YuvObject, Yuv, Constructor, Constrained, GenericFactory, LoadPromise, LoadFontPromise, LoadImagePromise, LoadVideoPromise, ScrollMetrics, MasherChangeHandler, Default, Errors, Parameter, ParameterObject, Property, PropertyObject, ActionType, ClipType, ClipTypes, DataType, DataTypes, DefinitionType, DefinitionTypes, EventType, LoadType, MashType, MashTypes, ModuleType, ModuleTypes, MoveType, TrackType, TransformType, TransformTypes, Capitalize, Color, colorStrip, colorValid, colorRgb2hex, colorYuv2rgb, colorRgb2yuv, colorYuvBlend, colorTransparent, Element, elementScrollMetrics, Evaluator, Id, Is, isAboveZero, isArray, booleanType as isBoolean, isDefined, isFloat, isInteger, methodType as isMethod, isNan, numberType as isNumber, objectType as isObject, isPopulatedArray, isPopulatedObject, isPopulatedString, isPositive, stringType as isString, undefinedType as isUndefined, Pixel, pixelColor, pixelFromFrame, pixelNeighboringRgbas, pixelPerFrame, pixelRgbaAtIndex, pixelToFrame, Round, roundMethod, roundWithMethod, Seconds, Sort, byFrame, byLabel, byTrack, Time, Times, timeEqualizeRates, TimeRange, TrackRange, Action, ActionObject, AddTrackAction, AddTrackActionObject, ChangeAction, ChangeActionObject, FreezeAction, ChangeFramesAction, ChangeTrimAction, AddEffectAction, AddEffectActionObject, AddClipToTrackAction, MoveClipsAction, RemoveClipsAction, SplitAction, MoveEffectsAction, Actions, Cache, Loader, Processor, Audio, AudioObject, AudioDefinition, AudioDefinitionObject, AudioFactory, AudioDefinitionClass, audioDefine, audioDefinition, audioDefinitionFromId, AudioFactoryImplementation, audioFromId, audioInstall, audioInitialize, audioInstance, AudioClass, AudioLoader, AudioProcessor, Definition, DefinitionClass, DefinitionObject, DefinitionTimes, Definitions, definitionsByType, definitionsClear, definitionsFont, definitionsFromId, definitionsInstall, definitionsInstalled, definitionsMap, definitionsMerger, definitionsScaler, definitionsUninstall, EffectDefinitionClass, EffectClass, effectDefine, effectDefine as effectInstall, effectDefinition, effectDefinitionFromId, EffectFactoryImplementation, effectFromId, effectInitialize, effectInstance, Effect, EffectDefinition, EffectDefinitionObject, EffectFactory, EffectObject, Factories, FactoryObject, Filter, FilterDefinition, FilterDefinitionObject, FilterFactory, FilterObject, FilterDefinitionClass, filterDefine, filterDefine as filterInstall, filterDefinition, filterDefinitionFromId, FilterFactoryImplementation, filterFromId, filterInitialize, filterInstance, FilterClass, Font, FontDefinition, FontDefinitionObject, FontFactory, FontObject, FontDefinitionClass, fontDefine, fontDefine as fontInstall, fontDefinition, fontDefinitionFromId, FontFactoryImplementation, fontFromId, fontInitialize, fontInstance, FontClass, FontLoader, FontProcessor, Image, ImageDefinition, ImageDefinitionObject, ImageFactory, ImageObject, ImageDefinitionClass, imageInstall, imageDefine, imageDefinition, imageDefinitionFromId, ImageFactoryImplementation, imageFromId, imageInitialize, imageInstance, ImageClass, ImageLoader, Instance, InstanceClass, InstanceObject, MashClass, mashInstall, mashDefine, mashDefinition, mashDefinitionFromId, MashFactoryImplementation, mashFromId, mashInitialize, mashInstance, MashDefinitionClass, Mash, MashObject, MashOptions, MashFactory, MashDefinition, MashDefinitionObject, Masher, MasherFactory, MasherDefinition, MasherObject, MasherDefinitionObject, MasherAddPromise, ClipOrEffect, masherDefine as masherInstall, masherDefine, masherDefinition, masherDefinitionFromId, masherDestroy, MasherFactoryImplementation, masherFromId, masherInitialize, masherInstance, MasherDefinitionClass, MasherClass, Merger, MergerDefinition, MergerDefinitionObject, MergerFactory, MergerObject, MergerDefinitionClass, mergerDefine, mergerDefine as mergerInstall, mergerDefaultId, mergerDefinition, mergerDefinitionFromId, MergerFactoryImplementation, mergerFromId, mergerInitialize, mergerInstance, MergerClass, Audible, AudibleDefinition, AudibleDefinitionObject, AudibleObject, AudibleDefinitionMixin, AudibleMixin, Clip, ClipDefinition, ClipDefinitionObject, ClipObject, ClipDefinitionMixin, ClipMixin, Modular, ModularDefinition, ModularDefinitionObject, ModularObject, ModularMixin, ModularDefinitionMixin, Transformable, TransformableObject, TransformableMixin, Visible, VisibleDefinition, VisibleDefinitionObject, VisibleObject, VisibleDefinitionMixin, VisibleMixin, Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerFactory, ScalerObject, ScalerDefinitionClass, scalerDefine, scalerDefine as scalerInstall, scalerDefaultId, scalerDefinition, scalerDefinitionFromId, ScalerFactoryImplementation, scalerFromId, scalerInitialize, scalerInstance, ScalerClass, Theme, ThemeDefinition, ThemeDefinitionObject, ThemeFactory, ThemeObject, ThemeDefinitionClass, themeDefine, themeDefine as themeInstall, themeDefinition, themeDefinitionFromId, ThemeFactoryImplementation, themeFromId, themeInitialize, themeInstance, ThemeClass, Track, TrackClass, TrackObject, TrackOptions, Transition, TransitionDefinition, TransitionDefinitionObject, TransitionDefinitionTransformObject, TransitionFactory, TransitionObject, TransitionDefinitionClass, transitionDefine, transitionDefine as transitionInstall, transitionDefinition, transitionDefinitionFromId, TransitionFactoryImplementation, transitionFromId, transitionInitialize, transitionInstance, TransitionClass, Type, TypeObject, TypesInstance as Types, TypeValue, TypeValueObject, Video, VideoDefinition, VideoDefinitionObject, VideoFactory, VideoObject, VideoDefinitionClass, videoInstall, videoDefine, videoDefinition, videoDefinitionFromId, VideoFactoryImplementation, videoFromId, videoInitialize, videoInstance, VideoClass, VideoLoader, AudibleContext, VisibleContext, EventsType, EventsDetail, ContextFactoryInstance as ContextFactory, MovieMasher };
//# sourceMappingURL=index.d.ts.map