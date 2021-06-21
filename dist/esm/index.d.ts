/// <reference types="node" />
/* eslint-disable @typescript-eslint/no-namespace */
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
type EventsCallback = EventHandlerNonNull;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type ScalarValue = number | string;
type ScalarArray = unknown[];
type UnknownObject = Record<string, unknown>;
type ObjectUnknown = Record<string, UnknownObject>;
type ValueObject = Record<string, ScalarValue>;
type ScalarRaw = boolean | ScalarValue;
type Scalar = ScalarRaw | ScalarArray | UnknownObject;
type ScalarMethod = (_?: ScalarValue) => ScalarValue;
type JsonValue = Scalar;
type JsonObject = Record<string, JsonValue | JsonValue[]>;
type SelectionValue = ScalarValue | ValueObject;
type SelectionObject = Record<string, SelectionValue>;
type EvaluatorValue = ScalarValue | ScalarMethod;
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
    // [index : string] : (...args: Any[]) => Any
    define(object: DEFINITIONOBJECT): DEFINITION;
    definitionFromId(id: string): DEFINITION;
    definition(object: DEFINITIONOBJECT): DEFINITION;
    instance(object: INSTANCEOBJECT): INSTANCE;
    initialize(): void;
    fromId(id: string): INSTANCE;
}
type LoadPromise = Promise<void>;
type LoadFontPromise = Promise<{
    family: string;
}>;
type LoadImagePromise = Promise<DrawingSource>;
declare const Default: {
    buffer: number;
    fps: number;
    loop: boolean;
    volume: number;
    precision: number;
    autoplay: boolean;
    mash: {
        label: string;
        quantize: number;
        backcolor: string;
    };
    clip: {
        audio: {
            gain: number;
            trim: number;
        };
        video: {
            speed: number;
        };
    };
    media: {
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
        definition: {
            duration: string;
            audio: string;
            url: string;
            source: string;
            id: string;
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
declare enum DefinitionType {
    Audio = "audio",
    Effect = "effect",
    Filter = "filter",
    Font = "font",
    Image = "image",
    Mash = "mash",
    Merger = "merger",
    Scaler = "scaler",
    Theme = "theme",
    Transition = "transition",
    Video = "video"
}
declare const DefinitionTypes: DefinitionType[];
declare enum EventType {
    Action = "action",
    Add = "add",
    Duration = "duration",
    Redo = "redo",
    Truncate = "truncate",
    Undo = "undo"
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
    Module = "module"
}
declare enum MoveType {
    Audio = "audio",
    Effect = "effect",
    Video = "video"
}
declare enum DataType {
    Direction4 = "direction4",
    Direction8 = "direction8",
    Font = "font",
    Fontsize = "fontsize",
    Hex = "hex",
    Integer = "integer",
    Mode = "mode",
    Number = "number",
    Pixel = "pixel",
    Rgb = "rgb",
    Rgba = "rgba",
    Scalar = "scalar",
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
    value?: ScalarValue;
    values?: TypeValueObject[];
    modular?: boolean;
}
declare class Type {
    constructor(object: TypeObject);
    id: DataType;
    modular: boolean;
    value: ScalarValue;
    values: TypeValueObject[];
}
interface PropertyObject {
    type?: DataType;
    name?: string;
    value?: ScalarValue;
    custom?: boolean;
}
declare class Property {
    constructor(object: PropertyObject);
    custom: boolean;
    name: string;
    toJSON(): JsonObject;
    type: Type;
    value: ScalarValue;
}
declare const scaleTimes: (time1: Time, time2: Time, rounding?: string) => Time[];
declare const roundWithMethod: (number: number, method?: string) => number;
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
    get id(): string;
    private _label?;
    get label(): string;
    set label(value: string);
    load(quantize: number, start: Time, end?: Time): LoadPromise;
    loaded(quantize: number, start: Time, end?: Time): boolean;
    get propertyNames(): string[];
    get propertyValues(): SelectionObject;
    get type(): DefinitionType;
    toJSON(): JsonObject;
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
    value(name: string): ScalarValue | undefined;
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
    mediaTime(time: Time): Time;
    mediaTimeRange(timeRange: TimeRange): TimeRange;
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
    duration?: ScalarValue;
    url?: string;
    audio?: string;
    source?: string;
    loops?: boolean;
    waveform?: string;
}
interface AudibleDefinition extends ClipDefinition {
    audible: boolean;
    duration: number;
    loops: boolean;
    loadedAudible(_time?: Time): AudioBuffer | undefined;
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
        value(name: string): ScalarValue | undefined;
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
        value(name: string): ScalarValue | undefined;
    };
} & typeof DefinitionClass;
declare class AudioDefinitionClass extends AudioDefinitionWithAudible {
    constructor(...args: Any[]);
    get instance(): Audio;
    instanceFromObject(object: AudioObject): Audio;
    trackType: TrackType;
    type: DefinitionType;
}
declare const audioDefinition: (object: AudioDefinitionObject) => AudioDefinition;
declare const audioDefinitionFromId: (id: string) => AudioDefinition;
declare const audioInstance: (object: AudioObject) => Audio;
declare const audioFromId: (id: string) => Audio;
declare const audioInitialize: () => void;
declare const audioDefine: (object: AudioDefinitionObject) => AudioDefinition;
declare const AudioFactoryImplementation: {
    define: (object: AudioDefinitionObject) => AudioDefinition;
    definition: (object: AudioDefinitionObject) => AudioDefinition;
    definitionFromId: (id: string) => AudioDefinition;
    fromId: (id: string) => Audio;
    initialize: () => void;
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
        mediaTime(time: Time, addOneFrame?: boolean): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class AudioClass extends AudioWithAudible {
    definition: AudioDefinition;
    trackType: TrackType;
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
declare class VisibleContext {
    constructor(object?: {
        context2d?: Context2D;
    });
    get alpha(): number;
    set alpha(value: number);
    get canvas(): ContextElement;
    clear(): VisibleContext;
    clearSize(size: Size): VisibleContext;
    clearRect(rect: Rect): VisibleContext;
    get composite(): string;
    set composite(value: string);
    get context2d(): Context2D;
    set context2d(value: Context2D);
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
    get fill(): string;
    set fill(value: string);
    get font(): string;
    set font(value: string);
    get imageData(): ContextData;
    get imageDataFresh(): ContextData;
    imageDataFromRect(rect: Rect): ContextData;
    imageDataFromSize(size: Size): ContextData;
    // TODO: rename method to match return type
    get imageSource(): DrawingSource;
    get shadow(): string;
    set shadow(value: string);
    get shadowPoint(): Point;
    set shadowPoint(point: Point);
    get size(): Size;
    set size(value: Size);
    private __context2d?;
}
declare class AudibleContext {
    __context?: AudioContext;
    get context(): AudioContext;
    createBuffer(seconds: number): AudioBuffer;
    createBufferSource(): AudioBufferSourceNode;
    createGain(): GainNode;
    decode(buffer: ArrayBuffer): Promise<AudioBuffer>;
    get destination(): AudioDestinationNode;
    get time(): Time;
    get currentTime(): number;
}
declare class ContextFactory {
    toSize(size: Size): VisibleContext;
    audible(): AudibleContext;
    fromContext2D(context2d: Context2D): VisibleContext;
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
        retain: boolean;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): ScalarValue | undefined;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
type MergerFactory = GenericFactory<Merger, MergerObject, MergerDefinition, MergerDefinitionObject>;
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
declare class TrackClass {
    constructor(object: TrackObject);
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
declare class Events {
    constructor(object?: {
        target?: EventsTarget;
    });
    methods: Set<EventsCallback>;
    get target(): EventsTarget | undefined;
    set target(value: EventsTarget | undefined);
    addListener(method: EventsCallback): void;
    emit(type: string, info?: {}): void;
    removeListener(method: EventsCallback): void;
    static get type(): string;
    __target?: EventsTarget;
}
interface EventsDetail {
    action?: Action;
    type: string;
}
type EventsType = CustomEvent<EventsDetail>;
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
    audibleContext?: AudibleContext;
    buffer?: number;
    events?: Events;
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
    addClipsToTrack(clips: Clip[], trackIndex?: number, insertIndex?: number): void;
    addTrack(trackType: TrackType): Track;
    audio: Track[];
    backcolor?: string;
    duration: number;
    endTime: Time;
    events: Events;
    changeClipFrames(clip: Clip, value: number): void;
    changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void;
    clipTrack(clip: Clip): Track;
    clipsInTracks: Clip[];
    compositeVisible(): void;
    definition: MashDefinition;
    destroy(): void;
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
    trackOfTypeAtIndex(type: TrackType, index?: number): Track;
    tracks: Track[];
    video: Track[];
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
type ThemeFactory = GenericFactory<Theme, ThemeObject, ThemeDefinition, ThemeDefinitionObject>;
type TransitionObject = ModularObject & VisibleObject;
interface Transition extends Modular, Visible {
    definition: TransitionDefinition;
    mergeClipsIntoContextAtTime(clips: Visible[], context: VisibleContext, time: Time, quantize: number, color?: string): void;
}
interface TransitionDefinitionTransformObject {
    filters?: FilterObject[];
}
interface TransitionDefinitionObject extends ModularDefinitionObject, ClipDefinitionObject {
    to?: TransitionDefinitionTransformObject;
    from?: TransitionDefinitionTransformObject;
}
interface TransitionDefinition extends Omit<ModularDefinition, "loadedVisible">, VisibleDefinition {
    drawVisibleFilters(clips: Visible[], modular: Modular, time: Time, quantize: number, context: VisibleContext, color?: string): void;
    instance: Transition;
    instanceFromObject(object: TransitionObject): Transition;
}
type TransitionFactory = GenericFactory<Transition, TransitionObject, TransitionDefinition, TransitionDefinitionObject>;
declare const Color: {
    yuvBlend: (yuvs: YuvObject[], yuv: YuvObject, match: number, blend: number) => number;
    rgb2yuv: (rgb: RgbObject) => Yuv;
    yuv2rgb: (yuv: YuvObject) => Rgb;
    rgb2hex: (rgb: RgbObject) => string;
};
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
declare const Pixel: {
    color: (value: ScalarValue) => string;
    rgbaAtIndex: (index: number, pixels: Pixels) => Rgba;
    rgbs: (pixel: number, data: Pixels, size: Size) => Rgba[];
};
declare const byFrame: (a: WithFrame, b: WithFrame) => number;
declare const byTrack: (a: WithTrack, b: WithTrack) => number;
declare const byLabel: (a: WithLabel, b: WithLabel) => number;
declare const Sort: {
    byFrame: (a: WithFrame, b: WithFrame) => number;
    byLabel: (a: WithLabel, b: WithLabel) => number;
    byTrack: (a: WithTrack, b: WithTrack) => number;
};
declare const Capitalize: (value: string) => string;
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
type FactoryObject = {
    [DefinitionType.Audio]?: AudioFactory;
    [DefinitionType.Effect]?: EffectFactory;
    [DefinitionType.Filter]?: FilterFactory;
    [DefinitionType.Font]?: FontFactory;
    [DefinitionType.Image]?: ImageFactory;
    [DefinitionType.Mash]?: MashFactory;
    [DefinitionType.Merger]?: MergerFactory;
    [DefinitionType.Scaler]?: ScalerFactory;
    [DefinitionType.Theme]?: ThemeFactory;
    [DefinitionType.Transition]?: TransitionFactory;
    [DefinitionType.Video]?: VideoFactory;
};
declare const Factories: FactoryObject;
declare class FactoryClass implements Readonly<Required<FactoryObject>> {
    get [DefinitionType.Audio](): AudioFactory;
    get [DefinitionType.Effect](): EffectFactory;
    get [DefinitionType.Filter](): FilterFactory;
    get [DefinitionType.Font](): FontFactory;
    get [DefinitionType.Image](): ImageFactory;
    get [DefinitionType.Mash](): MashFactory;
    get [DefinitionType.Merger](): MergerFactory;
    get [DefinitionType.Scaler](): ScalerFactory;
    get [DefinitionType.Theme](): ThemeFactory;
    get [DefinitionType.Transition](): TransitionFactory;
    get [DefinitionType.Video](): VideoFactory;
}
declare const Factory: FactoryClass;
declare class FilterDefinitionClass extends DefinitionClass {
    constructor(...args: Any[]);
    draw(_evaluator: Evaluator, _evaluated: ValueObject): VisibleContext;
    get instance(): Filter;
    instanceFromObject(object: FilterObject): Filter;
    parameters: Parameter[];
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
    definition: (object: FontDefinitionObject) => FontDefinition;
    definitionFromId: (id: string) => FontDefinition;
    fromId: (id: string) => Font;
    initialize: () => void;
    instance: (object: FontObject) => Font;
};
declare class FontClass extends InstanceClass {
    definition: FontDefinition;
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
        value(name: string): ScalarValue | undefined;
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
        value(name: string): ScalarValue | undefined;
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
declare const ImageFactoryImplementation: {
    define: (object: ImageDefinitionObject) => ImageDefinition;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class ImageClass extends ImageWithTransformable {
    definition: ImageDefinition;
}
interface CompositionObject {
    audibleContext?: AudibleContext;
    buffer?: number;
    gain?: number;
    quantize?: number;
    backcolor?: string;
    visibleContext?: VisibleContext;
}
declare class Composition {
    constructor(object: CompositionObject);
    adjustSourceGain(clip: Audible): void;
    private _audibleContext;
    get audibleContext(): AudibleContext;
    set audibleContext(value: AudibleContext);
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
declare class MashClass extends InstanceClass implements Mash {
    constructor(...args: Any[]);
    addClipsToTrack(clips: Clip[], trackIndex?: number, insertIndex?: number): void;
    addTrack(trackType: TrackType): Track;
    private _audibleContext?;
    get audibleContext(): AudibleContext;
    set audibleContext(value: AudibleContext);
    audio: Track[];
    private _backcolor;
    get backcolor(): string;
    set backcolor(value: string);
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    get bufferFrames(): number;
    private get bufferTime();
    private __bufferTimer?;
    changeClipFrames(clip: Clip, value: number): void;
    changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void;
    clipIntersects(clip: Clip, range: TimeRange): boolean;
    clipTrack(clip: Clip): Track;
    clipTrackAtIndex(clip: Clip, index?: number): Track;
    private clips;
    get clipsInTracks(): Clip[];
    private clipsAudible;
    private get clipsAudibleInTracks();
    private clipsAudibleInTimeRange;
    private get clipsVideo();
    private clipsVisible;
    private clipsVisibleAtTime;
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
    private drawnTime?;
    private drawTime;
    get duration(): number;
    private emitDuration;
    private emitIfFramesChange;
    get endTime(): Time;
    private _events?;
    get events(): Events;
    set events(value: Events);
    get frame(): number;
    get frames(): number;
    private _gain;
    get gain(): number;
    set gain(value: number);
    handleEvent(event: Event): void;
    get startAndEnd(): Time[];
    load(): LoadPromise;
    loadAndComposite(): void;
    get loadedDefinitions(): DefinitionTimes;
    loop: boolean;
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
    stopAndLoad(): LoadPromise;
    get time(): Time;
    get timeRangeToBuffer(): TimeRange;
    toJSON(): JsonObject;
    trackOfTypeAtIndex(type: TrackType, index?: number): Track;
    get tracks(): Track[];
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
declare const MashFactoryImplementation: {
    define: (object: MashDefinitionObject) => MashDefinition;
    definition: (object: MashDefinitionObject) => MashDefinition;
    definitionFromId: (id: string) => MashDefinition;
    fromId: (id: string) => Mash;
    initialize: () => void;
    instance: (object: MashOptions) => Mash;
};
declare class MashDefinitionClass extends DefinitionClass {
    constructor(...args: Any[]);
    get instance(): Mash;
    instanceFromObject(object: MashObject): Mash;
    type: DefinitionType;
}
declare const MergerDefinitionWithModular: {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
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
        retain: boolean;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): ScalarValue | undefined;
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
declare const mergerInstance: (object: MergerDefinitionObject) => Merger;
declare const mergerFromId: (id: string) => Merger;
declare const mergerInitialize: () => void;
declare const mergerDefine: (object: MergerDefinitionObject) => MergerDefinition;
type MergerFactory$0 = GenericFactory<Merger, MergerObject, MergerDefinition, MergerDefinitionObject>;
declare const MergerFactoryImplementation: MergerFactory$0;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
        value(key: string): SelectionValue;
    };
} & typeof InstanceClass;
declare class MergerClass extends MergerWithModular {
    definition: MergerDefinition;
    get id(): string;
    set id(value: string);
}
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
        value(name: string): ScalarValue | undefined;
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
        value(name: string): ScalarValue | undefined;
    };
} & {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
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
        retain: boolean;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): ScalarValue | undefined;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
        value(name: string): ScalarValue | undefined;
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
        value(name: string): ScalarValue | undefined;
    };
} & {
    new (...args: any[]): {
        drawFilters(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, outContext?: VisibleContext | undefined): VisibleContext;
        evaluator(modular: Modular, range: TimeRange, context: VisibleContext, size: Size, mergerContext?: VisibleContext | undefined): Evaluator;
        filters: Filter[];
        readonly propertiesCustom: Property[];
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
        retain: boolean;
        type: DefinitionType;
        unload(_times?: Times[]): void;
        value(name: string): ScalarValue | undefined;
    };
} & typeof DefinitionClass;
declare class TransitionDefinitionClass extends TransitionDefinitionWithVisible {
    constructor(...args: Any[]);
    drawVisibleFilters(clips: Visible[], modular: Modular, time: Time, quantize: number, context: VisibleContext, color?: string): void;
    private fromFilters;
    get instance(): Transition;
    instanceFromObject(object: TransitionObject): Transition;
    private toFilters;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
    propertyTypeDefault(type: DataType): ScalarValue;
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
        value(name: string): ScalarValue | undefined;
    };
} & {
    new (...args: any[]): {
        audible: boolean;
        load(start: Time, end?: Time | undefined): LoadPromise;
        loaded(start: Time, end?: Time | undefined): boolean;
        loadedAudible(_time?: Time | undefined): AudioBuffer | undefined;
        loops: boolean;
        source?: string | undefined;
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
        value(name: string): ScalarValue | undefined;
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
        value(name: string): ScalarValue | undefined;
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
declare const VideoFactoryImplementation: {
    define: (object: VideoDefinitionObject) => VideoDefinition;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        trackType: TrackType;
        visible: boolean;
        readonly copy: Instance;
        definition: Definition;
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
        time(quantize: number): Time;
        timeRange(quantize: number): TimeRange;
        timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
        track: number;
        readonly copy: Instance;
        definition: Definition;
        readonly definitions: Definition[];
        definitionTime(quantize: number, time: Time): Time;
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
        readonly type: DefinitionType;
        toJSON(): JsonObject;
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
        mediaTime(time: Time, addOneFrame?: boolean): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
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
        mediaTime(time: Time): Time;
        mediaTimeRange(timeRange: TimeRange): TimeRange;
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
        readonly id: string;
        _label?: string | undefined;
        label: string;
        load(quantize: number, start: Time, end?: Time | undefined): LoadPromise;
        loaded(quantize: number, start: Time, end?: Time | undefined): boolean;
        readonly propertyNames: string[];
        readonly propertyValues: SelectionObject;
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
    do(action: Action): Action[];
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
    get events(): Events | undefined;
    get selectedClips(): Clip[];
    get selectedEffects(): Effect[];
    redo(): void;
    redoAction(): void;
    type: string;
    undo(): void;
    undoAction(): void;
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
    redoValue: string | number;
    target: Mash | Clip | Effect;
    undoValue: string | number;
}
declare class ChangeAction extends Action {
    constructor(object: ChangeActionObject);
    property: string;
    redoValue: string | number;
    target: Mash | Clip | Effect;
    undoValue: string | number;
    get redoValueNumeric(): number;
    get undoValueNumeric(): number;
    redoAction(): void;
    undoAction(): void;
    updateAction(value: string | number): void;
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
    addClips(trackIndex: number, insertIndex: number): void;
    setFrames(frames: number[]): void;
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
type ClipOrEffect = Clip | Effect;
interface MasherObject {
    autoplay?: boolean;
    precision?: number;
    loop?: boolean;
    fps?: number;
    volume?: number;
    buffer?: number;
    visibleContext?: VisibleContext;
    audibleContext?: AudibleContext;
    mash?: Mash;
}
type AddPromise = Promise<ClipOrEffect>;
declare class MasherClass {
    [index: string]: unknown;
    constructor(object?: MasherObject);
    actionCreate(object: UnknownObject): void;
    private _actions?;
    get actions(): Actions;
    add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): AddPromise;
    addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): LoadPromise;
    addEffect(effect: Effect, insertIndex?: number): LoadPromise;
    addTrack(trackType?: TrackType): void;
    private _audibleContext?;
    get audibleContext(): AudibleContext;
    set audibleContext(value: AudibleContext);
    autoplay: boolean;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    can(method: string): boolean;
    get canvas(): ContextElement;
    set canvas(value: ContextElement);
    change(property: string): void;
    changeClip(property: string): void;
    changeEffect(property: string): void;
    changeMash(property: string): void;
    clipCanBeSplit(clip: Clip, time: Time, quantize: number): boolean;
    private _context2D?;
    get context2d(): Context2D;
    set context2d(value: Context2D);
    get configured(): boolean;
    currentActionReusable(target: unknown, property: string): boolean;
    // time, but in seconds
    get currentTime(): number;
    set currentTime(seconds: number);
    get definitions(): Definition[];
    delayedDraw(): void;
    private _delayedTimer?;
    // call when player removed from DOM
    destroy(): void;
    draw(): void;
    get duration(): number;
    get endTime(): Time;
    __events?: Events;
    get events(): Events;
    filterClipSelection(value: Clip | Clip[]): Clip[];
    private _fps;
    get fps(): number;
    set fps(value: number);
    get frame(): number;
    set frame(value: number);
    get frames(): number;
    freeze(): void;
    get gain(): number;
    handleGainChange(): void;
    handleMasher(event: Event): Any;
    loadMash(): LoadPromise;
    loadMashAndDraw(): LoadPromise;
    get loadedDefinitions(): DefinitionTimes;
    private _loop;
    get loop(): boolean;
    set loop(value: boolean);
    private _mash?;
    get mash(): Mash;
    set mash(object: Mash);
    mashOptions(mashObject?: MashObject): MashOptions;
    media(clip: Clip): Definition;
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
    private _pristineEffect?;
    get properties(): string[];
    redo(): void;
    remove(objectOrArray: ClipOrEffect | ClipOrEffect[], moveType: MoveType): void;
    removeClips(clipOrArray: Clip | Clip[]): void;
    removeEffects(effectOrArray: Effect | Effect[]): void;
    save(): void;
    select(object: ClipOrEffect | undefined, toggleSelected?: boolean): void;
    selectClip(clip: Clip | undefined, toggleSelected: boolean): void;
    selectEffect(effect: Effect | undefined, toggleSelected: boolean): void;
    selectMash(): void;
    selected(object: ClipOrEffect): boolean;
    get selectedClip(): Clip | UnknownObject;
    set selectedClip(value: Clip | UnknownObject);
    selectedClipObject: {};
    get selectedClipOrMash(): Clip | Mash;
    get selectedClipOrThrow(): Clip;
    private _selectedClips;
    get selectedClips(): Clip[];
    set selectedClips(value: Clip[]);
    get selectedEffect(): Effect | undefined;
    set selectedEffect(value: Effect | undefined);
    private _selectedEffects;
    get selectedEffects(): Effect[];
    set selectedEffects(value: Effect[]);
    get silenced(): boolean;
    split(): void;
    get stalling(): boolean;
    private _time;
    get time(): Time;
    set time(value: Time);
    type: string;
    undo(): void;
    private _visibleContext?;
    get visibleContext(): VisibleContext;
    set visibleContext(value: VisibleContext);
    private _volume;
    get volume(): number;
    set volume(value: number);
}
interface Masher extends MasherClass {
}
declare class MasherFactory {
    interval?: Timeout;
    mashers: Masher[];
    create(object?: {}): Masher;
    addMasher(masher: Masher): void;
    destroy(masher: Masher): void;
    handleInterval(): void;
    start(): void;
    stop(): void;
    get type(): {
        [k: string]: string;
    };
    get types(): string[];
}
declare const MasherFactoryInstance: MasherFactory;
declare class CacheClass {
    add(url: string, value: Any): void;
    cached(url: string): boolean;
    private cachedByKey;
    get(url: string): Any | undefined;
    key(url: string): string;
    remove(url: string): void;
    private urlsByKey;
}
declare const Cache: CacheClass;
declare class Processor {
    process(_url: string, _buffer: ArrayBuffer): Promise<Any>;
}
declare class AudioProcessor extends Processor {
    constructor(object?: UnknownObject | undefined);
    get audibleContext(): AudibleContext;
    set audibleContext(value: AudibleContext);
    process(_url: string, buffer: ArrayBuffer): Promise<AudioBuffer>;
    _audibleContext: AudibleContext;
}
declare class FontProcessor extends Processor {
    process(url: string, buffer: ArrayBuffer): LoadFontPromise;
}
declare class ModuleProcessor extends Processor {
    process(_url: string, _buffer: ArrayBuffer): Promise<Any>;
}
declare class Loader {
    loadUrl(url: string): LoadPromise;
    requestUrl(_url: string): Promise<Any>;
}
declare class AudioLoader extends Loader {
    constructor(object?: UnknownObject | undefined);
    type: LoadType;
    get audibleContext(): AudibleContext;
    set audibleContext(value: AudibleContext);
    requestUrl(url: string): Promise<AudioBuffer>;
    _audibleContext: AudibleContext;
}
declare class FontLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadFontPromise;
}
declare class ImageLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadImagePromise;
}
declare class ModuleLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): Promise<Any>;
}
export { Action, ActionObject, AddTrackAction, AddTrackActionObject, ChangeAction, ChangeActionObject, FreezeAction, ChangeFramesAction, ChangeTrimAction, AddEffectAction, AddEffectActionObject, AddClipToTrackAction, MoveClipsAction, RemoveClipsAction, SplitAction, MoveEffectsAction, Actions, Events, EventsType, EventsDetail, Masher, MasherClass, MasherFactoryInstance as MasherFactory, Cache, AudioProcessor, FontProcessor, ModuleProcessor, Loader, AudioLoader, FontLoader, ImageLoader, ModuleLoader, Processor, Audio, AudioObject, AudioDefinition, AudioDefinitionObject, AudioFactory, AudioDefinitionClass, audioDefine, audioDefinition, audioDefinitionFromId, AudioFactoryImplementation, audioFromId, audioInitialize, audioInstance, AudioClass, Definition, DefinitionClass, DefinitionObject, DefinitionTimes, Definitions, definitionsByType, definitionsClear, definitionsFont, definitionsFromId, definitionsInstall, definitionsInstalled, definitionsMap, definitionsMerger, definitionsScaler, definitionsUninstall, EffectDefinitionClass, EffectClass, effectDefine, effectDefinition, effectDefinitionFromId, EffectFactoryImplementation, effectFromId, effectInitialize, effectInstance, Effect, EffectDefinition, EffectDefinitionObject, EffectFactory, EffectObject, Factories, FactoryObject, Factory, Filter, FilterDefinition, FilterDefinitionObject, FilterFactory, FilterObject, FilterDefinitionClass, filterDefine, filterDefinition, filterDefinitionFromId, FilterFactoryImplementation, filterFromId, filterInitialize, filterInstance, FilterClass, Font, FontDefinition, FontDefinitionObject, FontFactory, FontObject, FontDefinitionClass, fontDefine, fontDefinition, fontDefinitionFromId, FontFactoryImplementation, fontFromId, fontInitialize, fontInstance, FontClass, Image, ImageDefinition, ImageDefinitionObject, ImageFactory, ImageObject, ImageDefinitionClass, imageDefine, imageDefinition, imageDefinitionFromId, ImageFactoryImplementation, imageFromId, imageInitialize, imageInstance, ImageClass, MashClass, mashDefine, mashDefinition, mashDefinitionFromId, MashFactoryImplementation, mashFromId, mashInitialize, mashInstance, MashDefinitionClass, Mash, MashObject, MashOptions, MashFactory, MashDefinition, MashDefinitionObject, Merger, MergerDefinition, MergerDefinitionObject, MergerFactory, MergerObject, MergerDefinitionClass, mergerDefine, mergerDefaultId, mergerDefinition, mergerDefinitionFromId, MergerFactoryImplementation, mergerFromId, mergerInitialize, mergerInstance, MergerClass, Theme, ThemeDefinition, ThemeDefinitionObject, ThemeFactory, ThemeObject, ThemeDefinitionClass, themeDefine, themeDefinition, themeDefinitionFromId, ThemeFactoryImplementation, themeFromId, themeInitialize, themeInstance, ThemeClass, Track, TrackClass, TrackObject, Transition, TransitionDefinition, TransitionDefinitionObject, TransitionDefinitionTransformObject, TransitionFactory, TransitionObject, TransitionDefinitionClass, transitionDefine, transitionDefinition, transitionDefinitionFromId, TransitionFactoryImplementation, transitionFromId, transitionInitialize, transitionInstance, TransitionClass, Type, TypeObject, TypeValue, TypeValueObject, TypesInstance as Types, Video, VideoDefinition, VideoDefinitionObject, VideoFactory, VideoObject, VideoDefinitionClass, videoDefine, videoDefinition, videoDefinitionFromId, VideoFactoryImplementation, videoFromId, videoInitialize, videoInstance, VideoClass, AudibleContext, VisibleContext, ContextFactoryInstance as ContextFactory, Context2D, ContextElement, DrawingSource, ContextData, Pixels, Timeout, Interval, EventsTarget, EventsCallback, Any, ScalarValue, ScalarArray, UnknownObject, ObjectUnknown, ValueObject, ScalarRaw, Scalar, ScalarMethod, JsonValue, JsonObject, SelectionValue, SelectionObject, EvaluatorValue, WithFrame, WithTrack, WithLabel, Rgb, Rgba, WithType, WithId, WithTypeAndId, WithTypeAndValue, Size, EvaluatedSize, EvaluatedPoint, Point, EvaluatedRect, Rect, TextStyle, RgbObject, YuvObject, Yuv, Constructor, Constrained, GenericFactory, LoadPromise, LoadFontPromise, LoadImagePromise, Default, Errors, Parameter, ParameterObject, Property, PropertyObject, ActionType, ClipType, ClipTypes, DataType, DataTypes, DefinitionType, DefinitionTypes, EventType, LoadType, MashType, MashTypes, ModuleType, ModuleTypes, MoveType, TrackType, TransformType, TransformTypes, Color, Is, isAboveZero, isArray, booleanType as isBoolean, isDefined, isFloat, isInteger, methodType as isMethod, isNan, numberType as isNumber, objectType as isObject, isPopulatedArray, isPopulatedObject, isPopulatedString, isPositive, stringType as isString, undefinedType as isUndefined, Pixel, Sort, byFrame, byLabel, byTrack, Evaluator, Time, Times, scaleTimes, roundWithMethod, TimeRange, Capitalize };
//# sourceMappingURL=index.d.ts.map