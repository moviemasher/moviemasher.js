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
type ContextElement = AudioContext;
type VisibleContextElement = HTMLCanvasElement;
type VisibleSource = CanvasImageSource;
type LoadedFont = {
    family: string;
}; // really a Font, but not in tests
// really a Font, but not in tests
type LoadedImage = HTMLImageElement;
type LoadedVideo = HTMLVideoElement;
type LoadedAudio = AudioBuffer;
type AudibleSource = AudioBufferSourceNode;
type LoadPromise = Promise<void>;
type LoadFontPromise = Promise<LoadedFont>;
type LoadImagePromise = Promise<LoadedImage>;
type Sequence = LoadPromise | VisibleSource;
type LoadVideoResult = {
    video: LoadedVideo;
    audio: LoadedAudio;
    sequence: Sequence[];
};
type LoadVideoPromise = Promise<LoadVideoResult>;
type LoadAudioPromise = Promise<LoadedAudio>;
type ContextData = ImageData;
type Pixels = Uint8ClampedArray;
type Timeout = ReturnType<typeof setTimeout>;
type Interval = ReturnType<typeof setInterval>;
type EventsTarget = EventTarget;
type ScalarValue = number | string;
type ScalarArray = unknown[];
type NumberObject = Record<string, number>;
type UnknownObject = Record<string, unknown>;
type StringObject = Record<string, string>;
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
type SelectionValue = ScalarRaw | ValueObject;
type SelectionObject = Record<string, SelectionValue>;
type EvaluatorValue = ScalarValue | ScalarConverter;
interface WithFrame {
    frame: number;
}
interface WithLayer {
    layer: number;
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
    r: ScalarValue;
    g: ScalarValue;
    b: ScalarValue;
}
interface Rgb {
    r: number;
    g: number;
    b: number;
}
interface YuvObject {
    y: ScalarValue;
    u: ScalarValue;
    v: ScalarValue;
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
// TODO: remove
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
interface StartOptions {
    duration: number;
    offset?: number;
    start: number;
}
interface InputParameter {
    key: string;
    value: ScalarValue;
}
interface InputFilter {
    filter: string;
    inputs?: string[];
    outputs?: string[];
    options: ValueObject;
}
interface InputOverlay extends Point {
    z?: number;
}
interface InputCommand {
    sources?: StringObject;
    filters: InputFilter[];
    merger?: InputFilter;
}
type InputCommands = InputCommand[];
type InputCommandsPromise = Promise<InputCommands[]>;
interface RemoteServer {
    protocol?: string;
    prefix?: string;
    host?: string;
    port?: ScalarValue;
}
interface RemoteServerProps {
    remoteServer?: RemoteServer;
}
type ClipState = InputCommand;
type MashStatePromise = Promise<MashState>;
type MashState = ClipState[];
type Options = string[] | ValueObject;
interface OutputOptions {
    options?: Options;
    audioCodec?: string;
    audioBitrate?: ScalarValue;
    audioChannels?: number;
    audioFrequency?: number;
    videoCodec?: string;
    width?: number;
    height?: number;
    videoBitrate?: ScalarValue;
    maxRate?: ScalarValue;
    bufSize?: ScalarValue;
    g?: number;
    fps?: number;
    format?: string;
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
    Transition = "transition",
    Video = "video"
}
declare const TrackTypes: TrackType[];
declare enum ClipType {
    Audio = "audio",
    Frame = "frame",
    Image = "image",
    Theme = "theme",
    Transition = "transition",
    Video = "video",
    VideoSequence = "videosequence",
    VideoStream = "videostream"
}
declare const ClipTypes: ClipType[];
// NOTE: order important here - determines initialization
declare enum DefinitionType {
    Filter = "filter",
    Merger = "merger",
    Scaler = "scaler",
    Effect = "effect",
    Font = "font",
    Theme = "theme",
    Transition = "transition",
    Image = "image",
    Video = "video",
    Audio = "audio",
    VideoStream = "videostream",
    VideoSequence = "videosequence"
}
declare const DefinitionTypes: DefinitionType[];
declare enum EventType {
    Action = "action",
    Duration = "durationchange",
    Draw = "draw",
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
declare enum MasherAction {
    Freeze = "freeze",
    Redo = "redo",
    Remove = "remove",
    Save = "save",
    Split = "split",
    Undo = "undo"
}
declare const MasherActions: MasherAction[];
declare enum CommandType {
    File = "file",
    Stream = "stream"
}
declare const CommandTypes: CommandType[];
declare enum OutputFormat {
    Flv = "flv",
    Hls = "hls",
    Mdash = "mdash",
    Rtmp = "rtmp",
    Rtmps = "rtmps"
}
declare const OutputFormats: OutputFormat[];
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
interface Propertied {
    property(key: string): Property | undefined;
    value(key: string): SelectionValue;
    setValue(key: string, value: SelectionValue): boolean;
    properties: Property[];
}
declare class PropertiedClass implements Propertied {
    [index: string]: unknown;
    constructor(..._args: Any[]);
    property(name: string): Property | undefined;
    private _properties;
    get properties(): Property[];
    set properties(value: Property[]);
    setValue(key: string, value: SelectionValue): boolean;
    value(key: string): SelectionValue;
}
declare const timeEqualizeRates: (time1: Time, time2: Time, rounding?: string) => Time[];
declare class Time implements Time {
    frame: number;
    fps: number;
    constructor(frame?: number, fps?: number);
    add(time: Time): Time;
    addFrame(frames: number): Time;
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
interface InstanceObject extends UnknownObject {
    definition?: Definition;
    definitionId?: string;
    id?: string;
    label?: string;
}
declare class InstanceBase extends PropertiedClass {
    constructor(...args: Any[]);
    get copy(): Instance;
    definition: Definition;
    get definitionId(): string;
    get definitions(): Definition[];
    definitionTime(quantize: number, time: Time): Time;
    private _id?;
    get id(): string;
    protected _label?: string;
    get label(): string;
    set label(value: string);
    get properties(): Property[];
    property(key: string): Property | undefined;
    get propertyNames(): string[];
    get propertyValues(): SelectionObject;
    toJSON(): JsonObject;
    get type(): DefinitionType;
}
interface Instance extends InstanceBase {
}
type InstanceClass = Constrained<InstanceBase>;
interface DefinitionObject extends UnknownObject {
    id?: string;
    type?: string;
    label?: string;
    icon?: string;
}
declare class DefinitionBase {
    constructor(...args: Any[]);
    icon?: string;
    id: string;
    get instance(): Instance;
    instanceFromObject(object: InstanceObject): Instance;
    get instanceObject(): InstanceObject;
    label: string;
    loadDefinition(_quantize: number, _start: Time, _end?: Time): LoadPromise | void;
    definitionUrls(_start: Time, _end?: Time): string[];
    properties: Property[];
    get propertiesModular(): Property[];
    property(name: string): Property | undefined;
    retain: boolean;
    toJSON(): JsonObject;
    type: DefinitionType;
    unload(_times?: Times[]): void;
    value(name: string): SelectionValue | undefined;
}
interface Definition extends DefinitionBase {
}
type DefinitionTimes = Map<Definition, Times[]>;
type DefinitionClass = Constrained<DefinitionBase>;
type DefinitionsList = Definition[];
declare const DefinitionsMap: Map<string, Definition>;
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
declare class TimeRange extends Time {
    frames: number;
    constructor(frame?: number, fps?: number, frames?: number);
    addFrames(frames: number): TimeRange;
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
    get times(): Time[];
    withFrame(frame: number): TimeRange;
    withFrames(frames: number): TimeRange;
    static fromArgs(frame?: number, fps?: number, frames?: number): TimeRange;
    static fromSeconds(start?: number, duration?: number): TimeRange;
    static fromTime(time: Time, frames?: number): TimeRange;
    static fromTimes(startTime: Time, endTime: Time): TimeRange;
}
interface ClipDefinitionObject extends DefinitionObject {
}
interface ClipDefinition extends Definition {
    audible: boolean;
    duration: number;
    frames(quantize: number): number;
    inputSource: string;
    streamable: boolean;
    visible: boolean;
}
interface ClipObject extends InstanceObject {
    frame?: number;
    frames?: number;
    track?: number;
}
interface Clip extends Instance {
    audible: boolean;
    clipState(quantize: number, time: Time, dimensions: Size): ClipState;
    clipUrls(quantize: number, start: Time, end?: Time): string[];
    commandAtTimeToSize(time: Time, quantize: number, dimensions: Size): InputCommand | undefined;
    definition: ClipDefinition;
    endFrame: number;
    frame: number;
    frames: number;
    inputCommandAtTimeToSize(time: Time, quantize: number, dimensions: Size): InputCommand | undefined;
    loadClip(quantize: number, start: Time, end?: Time): LoadPromise | void;
    maxFrames(quantize: number, trim?: number): number;
    time(quantize: number): Time;
    timeRange(quantize: number): TimeRange;
    timeRangeRelative(mashTime: Time, quantize: number): TimeRange;
    track: number;
    trackType: TrackType;
    visible: boolean;
}
type ClipClass = Constrained<Clip>;
type ClipDefinitionClass = Constrained<ClipDefinition>;
interface AudibleObject extends ClipObject {
    gain?: ScalarValue;
}
interface Audible extends Clip {
    definition: AudibleDefinition;
    gain: number;
    gainPairs: number[][];
    loadedAudible(): AudibleSource | undefined;
    muted: boolean;
    startOptions(seconds: number, quantize: number): StartOptions;
}
interface AudibleDefinitionObject extends ClipDefinitionObject {
    audio?: string;
    source?: string;
    stream?: boolean;
    url?: string;
    waveform?: string;
}
interface AudibleDefinition extends ClipDefinition {
    audible: boolean;
    loadedAudible(): AudibleSource | undefined;
    loops: boolean;
    stream: boolean;
    waveform?: string;
}
type AudibleClass = Constrained<Audible>;
type AudibleDefinitionClass = Constrained<AudibleDefinition>;
interface AudibleFileObject extends AudibleObject {
    trim?: number;
    loop?: number;
}
interface AudibleFile extends Audible {
    definition: AudibleFileDefinition;
    trim: number;
    loop: number;
}
interface AudibleFileDefinitionObject extends AudibleDefinitionObject {
    duration?: ScalarValue;
    loops?: boolean;
}
interface AudibleFileDefinition extends AudibleDefinition {
    duration: number;
    loops: boolean;
}
type AudibleFileClass = Constrained<AudibleFile>;
type AudibleFileDefinitionClass = Constrained<AudibleFileDefinition>;
type AudioObject = AudibleFileObject;
interface Audio extends AudibleFile {
    definition: AudioDefinition;
}
type AudioDefinitionObject = AudibleFileDefinitionObject;
interface AudioDefinition extends AudibleFileDefinition {
    instance: Audio;
    instanceFromObject(object: AudioObject): Audio;
}
type AudioFactory = GenericFactory<Audio, AudioObject, AudioDefinition, AudioDefinitionObject>;
declare const AudioDefinitionWithAudibleFile: AudibleFileDefinitionClass & AudibleDefinitionClass & ClipDefinitionClass & typeof DefinitionBase;
declare class AudioDefinitionClass extends AudioDefinitionWithAudibleFile {
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
declare const AudioWithAudibleFile: AudibleFileClass & AudibleClass & ClipClass & typeof InstanceBase;
declare class AudioClass extends AudioWithAudibleFile {
    definition: AudioDefinition;
    trackType: TrackType;
}
declare class Loader {
    arrayBufferPromiseFromUrl(url: string): Promise<ArrayBuffer>;
    arrayBufferPromiseFromBlob(blob: Blob): Promise<ArrayBuffer>;
    audioBufferPromiseFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
    loadUrl(url: string): LoadPromise;
    requestUrl(_url: string): Promise<Any>;
}
declare class AudioLoader extends Loader {
    requestUrl(url: string): LoadAudioPromise;
    type: LoadType;
}
declare const EffectDefinitionWithModular: ModularDefinitionClass & typeof DefinitionBase;
declare class EffectDefinitionClass extends EffectDefinitionWithModular {
    constructor(...args: Any[]);
    get instance(): Effect;
    instanceFromObject(object: EffectObject): Effect;
    type: DefinitionType;
}
declare const EffectWithModular: ModularClass & typeof InstanceBase;
declare class EffectClass extends EffectWithModular {
    definition: EffectDefinition;
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
interface AudibleContextSource {
    gainNode: GainNode;
    gainSource: AudibleSource;
}
// singleton owned by Cache
declare class AudibleContext {
    addSource(id: string, source: AudibleContextSource): void;
    private _context?;
    get context(): AudioContext;
    createBuffer(seconds: number): AudioBuffer;
    createBufferSource(buffer?: AudioBuffer): AudibleSource;
    createGain(): GainNode;
    get currentTime(): number;
    decode(buffer: ArrayBuffer): Promise<AudioBuffer>;
    deleteSource(id: string): void;
    get destination(): AudioDestinationNode;
    getSource(id: string): AudibleContextSource | undefined;
    hasSource(id: string): boolean;
    private sourcesByClipId;
    startAt(clipId: string, source: AudibleSource, start: number, duration: number, offset?: number, loops?: boolean): void;
}
interface VisibleDefinitionObject extends ClipDefinitionObject {
}
interface VisibleDefinition extends ClipDefinition {
    loadedVisible(quantize: number, definitionTime: Time): VisibleSource | undefined;
    trackType: TrackType;
}
interface VisibleObject extends ClipObject {
}
interface Visible extends Clip {
    contextAtTimeToSize(time: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
    loadedVisible(quantize: number, definitionTime: Time): VisibleSource | undefined;
    mergeContextAtTime(time: Time, quantize: number, context: VisibleContext): void;
}
type VisibleClass = Constrained<Visible>;
type VisibleDefinitionClass = Constrained<VisibleDefinition>;
declare class Emitter extends EventTarget {
    emit(type: EventType): void;
}
interface CompositionObject {
    buffer?: number;
    gain?: number;
    quantize?: number;
    backcolor?: string;
    emitter?: Emitter;
}
declare class Composition {
    constructor(object: CompositionObject);
    adjustSourceGain(clip: Audible): void;
    backcolor?: string;
    buffer: number;
    private bufferSource?;
    compositeAudible(clips: Audible[]): boolean;
    compositeVisible(time: Time, clips: Visible[]): void;
    compositeVisibleRequest(time: Time, clips: Visible[]): void;
    private createSources;
    private destroySources;
    private drawBackground;
    emitter?: Emitter;
    private _gain;
    get gain(): number;
    set gain(value: number);
    private playing;
    private playingClips;
    quantize: number;
    get seconds(): number;
    startContext(): void;
    // called when playhead starts moving
    startPlaying(time: Time, clips: Audible[]): boolean;
    // position of masher (in seconds) when startPlaying called
    private startedMashAt;
    // currentTime of context (in seconds) was created when startPlaying called
    private contextSecondsWhenStarted;
    stopPlaying(): void;
}
declare class ContextFactoryImplementation {
    audible(): AudibleContext;
    fromCanvas(canvas: VisibleContextElement): VisibleContext;
    fromContext2D(context2d: Context2D): VisibleContext;
    toSize(size: Size): VisibleContext;
    get type(): {
        [k: string]: string;
    };
    get types(): string[];
    visible(): VisibleContext;
}
declare const ContextFactory: ContextFactoryImplementation;
declare class Evaluator {
    [index: string]: unknown;
    constructor(timeRange: TimeRange, size: Size, context?: VisibleContext, mergeContext?: VisibleContext);
    ceil: (x: number) => number;
    conditionalValue(conditionals: ValueObject[]): ScalarValue;
    context?: VisibleContext;
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
    input(evaluator: Evaluator, evaluated: ValueObject): InputFilter;
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
    inputFilter(evaluator: Evaluator): InputFilter;
    evaluated(evaluator: Evaluator): ValueObject;
    parameters: Parameter[];
}
type FilterFactory = GenericFactory<Filter, FilterObject, FilterDefinition, FilterDefinitionObject>;
declare class FilterDefinitionClass extends DefinitionBase {
    constructor(...args: Any[]);
    draw(_evaluator: Evaluator, _evaluated: ValueObject): VisibleContext;
    input(_evaluator: Evaluator, _evaluated: ValueObject): InputFilter;
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
// eslint-disable-next-line prefer-const
declare let idPrefix: string;
declare const idGenerate: () => string;
declare const idPrefixSet: (prefix: string) => void;
declare const Id: {
    generate: () => string;
    prefix: string;
    prefixSet: (prefix: string) => void;
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
declare const sortByFrame: (a: WithFrame, b: WithFrame) => number;
declare const sortByLayer: (a: WithLayer, b: WithLayer) => number;
declare const sortByTrack: (a: WithTrack, b: WithTrack) => number;
declare const sortByLabel: (a: WithLabel, b: WithLabel) => number;
declare const Sort: {
    byFrame: (a: WithFrame, b: WithFrame) => number;
    byLabel: (a: WithLabel, b: WithLabel) => number;
    byTrack: (a: WithTrack, b: WithTrack) => number;
    byLayer: (a: WithLayer, b: WithLayer) => number;
};
declare const urlRemoteServer: () => RemoteServer;
declare const urlAbsolute: (url: string) => string;
declare const urlForRemoteServer: (remoteServer?: RemoteServer | undefined, suffix?: string | undefined) => string;
declare const Url: {
    absolute: (url: string) => string;
    forRemoteServer: (remoteServer?: RemoteServer | undefined, suffix?: string | undefined) => string;
    remoteServer: () => RemoteServer;
};
declare class FilterClass extends InstanceBase {
    constructor(...args: Any[]);
    definition: FilterDefinition;
    drawFilter(evaluator: Evaluator): VisibleContext;
    evaluated(evaluator: Evaluator): ValueObject;
    inputFilter(evaluator: Evaluator): InputFilter;
    parameters: Parameter[];
    toJSON(): JsonObject;
}
type FontObject = InstanceObject;
interface Font extends Instance {
    definition: FontDefinition;
}
interface FontDefinitionObject extends DefinitionObject {
    source?: string;
    url?: string;
}
interface FontDefinition extends Definition {
    absoluteUrl: string;
    instance: Font;
    instanceFromObject(object: FontObject): Font;
    source: string;
}
type FontFactory = GenericFactory<Font, FontObject, FontDefinition, FontDefinitionObject>;
declare class FontDefinitionClass extends DefinitionBase {
    constructor(...args: Any[]);
    get absoluteUrl(): string;
    get instance(): Font;
    instanceFromObject(object: FontObject): Font;
    loadDefinition(): LoadPromise | void;
    definitionUrls(_start: Time, _end?: Time): string[];
    loadedVisible(): Any;
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
declare class FontClass extends InstanceBase {
    definition: FontDefinition;
}
declare class FontLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadFontPromise;
}
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
interface TransformableObject extends VisibleObject {
    effects?: EffectObject[];
    merger?: MergerObject;
    scaler?: ScalerObject;
}
interface TransformableDefinition extends VisibleDefinition {
}
interface TransformableDefinitionObject extends VisibleDefinitionObject {
}
interface Transformable extends Visible {
    effects: Effect[];
    merger: Merger;
    scaler: Scaler;
    effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
    loadTransformable(quantize: number, start: Time, end?: Time): LoadPromise | void;
    mergeContextAtTime(mashTime: Time, quantize: number, context: VisibleContext): void;
    scaledContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
}
type TransformableClass = Constrained<Transformable>;
type TransformableDefinitionClass = Constrained<TransformableDefinition>;
type ImageObject = TransformableObject;
interface Image extends Transformable {
    definition: ImageDefinition;
}
interface ImageDefinitionObject extends TransformableDefinitionObject {
    url?: string;
    source?: string;
}
interface ImageDefinition extends TransformableDefinition {
    instance: Image;
    instanceFromObject(object: ImageObject): Image;
}
type ImageFactory = GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject>;
declare const ImageDefinitionWithTransformable: VisibleDefinitionClass & ClipDefinitionClass & typeof DefinitionBase;
declare class ImageDefinitionClass extends ImageDefinitionWithTransformable {
    constructor(...args: Any[]);
    get absoluteUrl(): string;
    get inputSource(): string;
    get instance(): Image;
    instanceFromObject(object: ImageObject): Image;
    loadDefinition(quantize: number, start: Time, end?: Time): LoadPromise | void;
    definitionUrls(_start: Time, _end?: Time): string[];
    loadedVisible(): VisibleSource | undefined;
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
declare const ImageWithTransformable: TransformableClass & VisibleClass & ClipClass & typeof InstanceBase;
declare class ImageClass extends ImageWithTransformable {
    definition: ImageDefinition;
}
declare class ImageLoader extends Loader {
    type: LoadType;
    requestUrl(url: string): LoadImagePromise;
}
interface TrackObject extends UnknownObject {
    clips?: ClipObject[];
    dense?: boolean;
    id?: string;
    layer?: number;
    trackType?: TrackType;
}
interface Track extends Propertied {
    addClips(clips: Clip[], insertIndex?: number): void;
    clips: Clip[];
    dense: boolean;
    frameForClipsNearFrame(clips: Clip[], frame?: number): number;
    frames: number;
    layer: number;
    removeClips(clips: Clip[]): void;
    sortClips(clips: Clip[]): void;
    trackType: TrackType;
}
declare const TrackFactory: {
    instance: (object: TrackObject) => Track;
};
declare class TrackClass extends PropertiedClass {
    constructor(...args: Any[]);
    addClips(clips: Clip[], insertIndex?: number): void;
    clips: Clip[];
    dense: boolean;
    frameForClipsNearFrame(clips: Clip[], frame?: number): number;
    get frames(): number;
    private _id?;
    get id(): string;
    layer: number;
    removeClips(clips: Clip[]): void;
    sortClips(clips: Clip[]): void;
    toJSON(): JsonObject;
    trackType: TrackType;
}
interface Job {
    definitions: Definition[];
    mash: Mash;
    remoteServer?: RemoteServer;
    outputs: OutputOptions[];
}
interface JobObject {
    definitions: DefinitionObject[];
    mash: MashObject;
    remoteServer?: RemoteServer;
    outputs: OutputOptions[];
}
interface MashObject extends UnknownObject {
    backcolor?: string;
    id?: string;
    label?: string;
    quantize?: number;
    tracks?: TrackObject[];
    createdAt?: string;
}
interface Mash {
    addClipsToTrack(clips: Clip[], trackIndex?: number, insertIndex?: number, frames?: number[]): void;
    addTrack(trackType: TrackType): Track;
    backcolor?: string;
    buffer: number;
    changeClipFrames(clip: Clip, value: number): void;
    changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void;
    clipTrack(clip: Clip): Track;
    clips: Clip[];
    clipsVisible(start: Time, end?: Time): Visible[];
    inputCommandPromise(type: CommandType, size: Size, start: Time, end?: Time): InputCommandsPromise;
    compositeVisible(): void;
    composition: Composition;
    definitions: Definition[];
    destroy(): void;
    drawnTime?: Time;
    duration: number;
    emitter?: Emitter;
    endTime: Time;
    frame: number;
    frames: number;
    gain: number;
    handleAction(action: Action): void;
    id: string;
    job: Job;
    loadPromise?: LoadPromise;
    loadUrls: string[];
    loadedDefinitions: DefinitionTimes;
    loop: boolean;
    mashState(time: Time, dimensions: Size): MashState;
    mashStatePromise(time: Time, dimensions: Size): MashStatePromise;
    paused: boolean;
    quantize: number;
    removeClipsFromTrack(clips: Clip[]): void;
    removeTrack(trackType: TrackType): void;
    seekToTime(time: Time): LoadPromise | undefined;
    time: Time;
    timeRange: TimeRange;
    toJSON(): UnknownObject;
    trackCount(type?: TrackType): number;
    trackOfTypeAtIndex(type: TrackType, index?: number): Track;
    tracks: Track[];
}
declare class MashFactoryImplementation {
    instance(object?: MashObject, definitions?: DefinitionObject[]): Mash;
}
declare const MashFactory: MashFactoryImplementation;
declare class MashClass implements Mash {
    constructor(...args: Any[]);
    addClipsToTrack(clips: Clip[], trackIndex?: number, insertIndex?: number, frames?: number[]): void;
    addTrack(trackType: TrackType): Track;
    private assureClipsHaveFrames;
    private _backcolor;
    get backcolor(): string;
    set backcolor(value: string);
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    get bufferFrames(): number;
    private bufferStart;
    private bufferStop;
    private get bufferTime();
    private _bufferTimer?;
    changeClipFrames(clip: Clip, value: number): void;
    changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void;
    clearDrawInterval(): void;
    clipIntersects(clip: Clip, range: TimeRange): boolean;
    clipTrack(clip: Clip): Track;
    clipTrackAtIndex(clip: Clip, index?: number): Track;
    get clips(): Clip[];
    private clipsAtTimes;
    private clipsAudible;
    private clipsInTracks;
    private filterIntersecting;
    private get clipsAudibleInTracks();
    private clipsAudibleInTimeRange;
    private get clipsVideo();
    clipsVisible(start: Time, end?: Time): Visible[];
    private clipsVisibleAtTime;
    private clipsVisibleInTimeRange;
    private compositeAudibleClips;
    private _composition?;
    get composition(): Composition;
    compositeVisible(): void;
    compositeVisibleRequest(): void;
    createdAt: string;
    data: UnknownObject;
    get definitions(): Definition[];
    destroy(): void;
    private drawInterval?;
    private drawTime;
    private drawWhileNotPlaying;
    private drawWhilePlaying;
    drawnSeconds: number;
    drawnTime?: Time;
    get duration(): number;
    private emitIfFramesChange;
    _emitter?: Emitter;
    get emitter(): Emitter | undefined;
    set emitter(value: Emitter | undefined);
    get endTime(): Time;
    get frame(): number;
    get frames(): number;
    private _gain;
    get gain(): number;
    set gain(value: number);
    handleAction(action: Action): void;
    private handleDrawInterval;
    private seqmentsAtTimes;
    private _id;
    get id(): string;
    private inputCommand;
    inputCommandPromise(type: CommandType, size: Size, start: Time, end?: Time): InputCommandsPromise;
    get job(): Job;
    label: string;
    get loadPromise(): LoadPromise | undefined;
    loadPromiseAtTimes(start: Time, end?: Time): LoadPromise | undefined;
    get loadUrls(): string[];
    get loadedDefinitions(): DefinitionTimes;
    loop: boolean;
    mashState(time: Time, dimensions: Size): MashState;
    mashStatePromise(time: Time, dimensions: Size): MashStatePromise;
    private _paused;
    get paused(): boolean;
    set paused(value: boolean);
    private _playing;
    get playing(): boolean;
    set playing(value: boolean);
    removeClipsFromTrack(clips: Clip[]): void;
    removeTrack(trackType: TrackType): void;
    private restartAfterStop;
    quantize: number;
    private seekTime?;
    seekToTime(time: Time): LoadPromise | undefined;
    setDrawInterval(): void;
    get stalled(): boolean;
    get startAndEnd(): Time[];
    private stopLoadAndDraw;
    get time(): Time;
    get timeRange(): TimeRange;
    get timeRangeToBuffer(): TimeRange;
    toJSON(): JsonObject;
    trackCount(type?: TrackType): number;
    trackOfTypeAtIndex(type: TrackType, index?: number): Track;
    private trackOptions;
    tracks: Track[];
    private tracksOfType;
}
declare const MergerDefinitionWithModular: ModularDefinitionClass & typeof DefinitionBase;
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
declare const mergerFromId: (definitionId: string) => Merger;
declare const mergerInitialize: () => void;
declare const mergerDefine: (object: MergerDefinitionObject) => MergerDefinition;
declare const MergerFactoryImplementation: MergerFactory;
declare const MergerWithModular: ModularClass & typeof InstanceBase;
declare class MergerClass extends MergerWithModular {
    definition: MergerDefinition;
}
// import { Property } from "../../Setup/Property"
declare const ScalerDefinitionWithModular: ModularDefinitionClass & typeof DefinitionBase;
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
declare const scalerFromId: (definitionId: string) => Scaler;
declare const scalerInitialize: () => void;
declare const scalerDefine: (object: ScalerDefinitionObject) => ScalerDefinition;
declare const ScalerFactoryImplementation: {
    define: (object: ScalerDefinitionObject) => ScalerDefinition;
    install: (object: ScalerDefinitionObject) => ScalerDefinition;
    definitionFromId: (id: string) => ScalerDefinition;
    definition: (object: ScalerDefinitionObject) => ScalerDefinition;
    instance: (object: ScalerObject) => Scaler;
    fromId: (definitionId: string) => Scaler;
    initialize: () => void;
};
declare const ScalerWithModular: ModularClass & typeof InstanceBase;
declare class ScalerClass extends ScalerWithModular {
    definition: ScalerDefinition;
}
type ThemeObject = ModularObject & TransformableObject;
interface Theme extends Modular, Transformable {
    definition: ThemeDefinition;
}
type ThemeDefinitionObject = ModularDefinitionObject & ClipDefinitionObject;
interface ThemeDefinition extends ModularDefinition, VisibleDefinition {
    instance: Theme;
    instanceFromObject(object: ThemeObject): Theme;
}
interface ThemeFactory extends GenericFactory<Theme, ThemeObject, ThemeDefinition, ThemeDefinitionObject> {
}
declare const WithTransformable: TransformableDefinitionClass & VisibleDefinitionClass & ClipDefinitionClass & ModularDefinitionClass & typeof DefinitionBase;
declare class ThemeDefinitionClass extends WithTransformable {
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
declare const ThemeWithTransformable: TransformableClass & VisibleClass & ClipClass & ModularClass & typeof InstanceBase;
declare class ThemeClass extends ThemeWithTransformable {
    commandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined;
    contextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined;
    clipUrls(quantize: number, start: Time): string[];
    definition: ThemeDefinition;
    inputCommandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined;
    loadClip(quantize: number, start: Time, end?: Time): LoadPromise | void;
}
interface TransitionObject extends ModularObject, VisibleObject {
    fromTrack?: number;
    toTrack?: number;
}
interface Transition extends Modular, Visible {
    definition: TransitionDefinition;
    mergeClipsIntoContextAtTime(clips: Visible[], context: VisibleContext, time: Time, quantize: number, color?: string): void;
    fromTrack: number;
    toTrack: number;
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
interface TransitionDefinition extends ModularDefinition, VisibleDefinition {
    drawVisibleFilters(clips: Visible[], modular: Transition, time: Time, quantize: number, context: VisibleContext, color?: string): void;
    instance: Transition;
    instanceFromObject(object: TransitionObject): Transition;
}
type TransitionFactory = GenericFactory<Transition, TransitionObject, TransitionDefinition, TransitionDefinitionObject>;
declare const TransitionDefinitionWithVisible: VisibleDefinitionClass & ClipDefinitionClass & ModularDefinitionClass & typeof DefinitionBase;
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
declare function VisibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T): VisibleDefinitionClass & T;
declare function VisibleMixin<T extends ClipClass>(Base: T): VisibleClass & T;
declare const TransitionWithVisible: VisibleClass & ClipClass & ModularClass & typeof InstanceBase;
declare class TransitionClass extends TransitionWithVisible implements Transition {
    constructor(...args: Any[]);
    contextAtTimeToSize(_time: Time, _quantize: number, _dimensions: Size): VisibleContext | undefined;
    definition: TransitionDefinition;
    fromTrack: number;
    mergeClipsIntoContextAtTime(clips: Visible[], context: VisibleContext, time: Time, quantize: number, color?: string): void;
    toTrack: number;
    trackType: TrackType;
}
interface VideoObject extends AudibleFileObject, TransformableObject {
    speed?: number;
}
interface Video extends AudibleFile, Transformable {
    definition: VideoDefinition;
    copy: Video;
    speed: number;
}
interface VideoDefinitionObject extends AudibleFileDefinitionObject, TransformableDefinitionObject {
    fps?: number;
    source?: string;
    url?: string;
}
interface VideoDefinition extends AudibleFileDefinition, TransformableDefinition {
    absoluteUrl: string;
    instance: Video;
    instanceFromObject(object: VideoObject): Video;
}
type VideoFactory = GenericFactory<Video, VideoObject, VideoDefinition, VideoDefinitionObject>;
type VideoClass = Constrained<Video>;
type VideoDefinitionClass = Constrained<VideoDefinition>;
declare const VideoDefinitionClassImplementation: VideoDefinitionClass;
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
declare const VideoClassImplementation: VideoClass;
interface StreamableObject extends AudibleObject {
    something?: string;
}
interface Streamable extends Audible {
    definition: StreamableDefinition;
    something?: string;
}
interface StreamableDefinitionObject extends AudibleDefinitionObject {
    format?: string;
}
interface StreamableDefinition extends AudibleDefinition {
    format: string;
}
type StreamableClass = Constrained<Streamable>;
type StreamableDefinitionClass = Constrained<StreamableDefinition>;
interface VideoStreamObject extends VisibleObject {
    gain?: ScalarValue;
}
interface VideoStream extends Audible, Streamable, Transformable {
    definition: VideoStreamDefinition;
    copy: VideoStream;
}
interface VideoStreamDefinitionObject extends AudibleDefinitionObject, StreamableDefinitionObject {
    source?: string;
    url?: string;
}
interface VideoStreamDefinition extends StreamableDefinition, AudibleDefinition, VisibleDefinition {
    instance: VideoStream;
    instanceFromObject(object: VideoStreamObject): VideoStream;
}
type VideoStreamFactory = GenericFactory<VideoStream, VideoStreamObject, VideoStreamDefinition, VideoStreamDefinitionObject>;
declare const WithStreamable: StreamableDefinitionClass & VisibleDefinitionClass & AudibleDefinitionClass & ClipDefinitionClass & typeof DefinitionBase;
declare class VideoStreamDefinitionClass extends WithStreamable {
    constructor(...args: Any[]);
    get absoluteUrl(): string;
    frames(quantize: number): number;
    get inputSource(): string;
    get instance(): VideoStream;
    instanceFromObject(object: VideoStreamObject): VideoStream;
    loadDefinition(): LoadPromise | void;
    definitionUrls(_start: Time, _end?: Time): string[];
    loadedVisible(): HTMLVideoElement | undefined;
    source: string;
    trackType: TrackType;
    type: DefinitionType;
    toJSON(): JsonObject;
    unload(times?: Times[]): void;
    url: string;
}
declare const videoStreamDefinition: (object: VideoStreamDefinitionObject) => VideoStreamDefinition;
declare const videoStreamDefinitionFromId: (id: string) => VideoStreamDefinition;
declare const videoStreamInstance: (object: VideoStreamObject) => VideoStream;
declare const videoStreamFromId: (id: string) => VideoStream;
declare const videoStreamInitialize: () => void;
declare const videoStreamDefine: (object: VideoStreamDefinitionObject) => VideoStreamDefinition;
/**
 * @internal
 */
declare const videoStreamInstall: (object: VideoStreamDefinitionObject) => VideoStreamDefinition;
declare const VideoStreamFactoryImplementation: {
    define: (object: VideoStreamDefinitionObject) => VideoStreamDefinition;
    install: (object: VideoStreamDefinitionObject) => VideoStreamDefinition;
    definition: (object: VideoStreamDefinitionObject) => VideoStreamDefinition;
    definitionFromId: (id: string) => VideoStreamDefinition;
    fromId: (id: string) => VideoStream;
    initialize: () => void;
    instance: (object: VideoStreamObject) => VideoStream;
};
declare const WithTransformable$0: TransformableClass & VisibleClass & StreamableClass & AudibleClass & ClipClass & typeof InstanceBase;
declare class VideoStreamClass extends WithTransformable$0 {
    constructor(...args: Any[]);
    get copy(): VideoStream;
    definition: VideoStreamDefinition;
    toJSON(): JsonObject;
}
declare class VideoLoader extends Loader {
    requestUrl(url: string): LoadVideoPromise;
    type: LoadType;
    videoPromiseFromUrl(url: string): Promise<LoadedVideo>;
    videoFromUrl(url: string): HTMLVideoElement;
}
interface VideoSequenceObject extends AudibleFileObject, TransformableObject {
    speed?: number;
}
interface VideoSequence extends AudibleFile, Transformable {
    definition: VideoSequenceDefinition;
    copy: VideoSequence;
    speed: number;
}
interface VideoSequenceDefinitionObject extends AudibleFileDefinitionObject, TransformableDefinitionObject {
    begin?: number;
    fps?: number;
    increment?: number;
    pattern?: string;
    source?: string;
    padding?: number;
    url?: string;
}
type AudibleOmitted = AudibleFileDefinition;
interface VideoSequenceDefinition extends AudibleOmitted, TransformableDefinition {
    instance: VideoSequence;
    instanceFromObject(object: VideoSequenceObject): VideoSequence;
}
type VideoSequenceClass = Constrained<VideoSequence>;
type VideoSequenceDefinitionClass = Constrained<VideoSequenceDefinition>;
type VideoSequenceFactory = GenericFactory<VideoSequence, VideoSequenceObject, VideoSequenceDefinition, VideoSequenceDefinitionObject>;
declare const WithVisible: VisibleDefinitionClass & AudibleFileDefinitionClass & AudibleDefinitionClass & ClipDefinitionClass & typeof DefinitionBase;
declare class VideoSequenceDefinitionClassImplementation extends WithVisible {
    constructor(...args: Any[]);
    begin: number;
    definitionUrls(start: Time, end?: Time): string[];
    fps: number;
    private framesArray;
    private get framesMax();
    increment: number;
    get inputSource(): string;
    get instance(): VideoSequence;
    instanceFromObject(object: VideoSequenceObject): VideoSequence;
    loadDefinition(quantize: number, start: Time, end?: Time): LoadPromise | void;
    loadedVisible(_quantize: number, time: Time): VisibleSource | undefined;
    pattern: string;
    source: string;
    toJSON(): JsonObject;
    trackType: TrackType;
    type: DefinitionType;
    unload(times?: Times[]): void;
    url: string;
    private urlForFrame;
    private urls;
    padding: number;
}
declare const videoSequenceDefinition: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
declare const videoSequenceDefinitionFromId: (id: string) => VideoSequenceDefinition;
declare const videoSequenceInstance: (object: VideoSequenceObject) => VideoSequence;
declare const videoSequenceFromId: (id: string) => VideoSequence;
declare const videoSequenceInitialize: () => void;
declare const videoSequenceDefine: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
/**
 * @internal
 */
declare const videoSequenceInstall: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
declare const VideoSequenceFactoryImplementation: {
    define: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
    install: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
    definition: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
    definitionFromId: (id: string) => VideoSequenceDefinition;
    fromId: (id: string) => VideoSequence;
    initialize: () => void;
    instance: (object: VideoSequenceObject) => VideoSequence;
};
declare const WithTransformable$1: TransformableClass & VisibleClass & AudibleFileClass & AudibleClass & ClipClass & typeof InstanceBase;
declare class VideoSequenceClassImplementation extends WithTransformable$1 {
    constructor(...args: Any[]);
    get copy(): VideoSequence;
    definition: VideoSequenceDefinition;
    definitionTime(quantize: number, time: Time): Time;
    speed: number;
    toJSON(): JsonObject;
}
declare class ActionFactoryClass {
    createFromObject(object: UnknownObject): Action;
}
declare const ActionFactory: ActionFactoryClass;
interface AddTrackActionObject extends ActionObject {
    trackType: TrackType;
}
declare class AddTrackAction extends Action {
    constructor(object: AddTrackActionObject);
    trackType: TrackType;
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
interface ChangeActionObject extends ActionObject {
    property: string;
    redoValue: SelectionValue;
    target: Clip | Effect;
    undoValue: SelectionValue;
}
declare class ChangeAction extends Action {
    constructor(object: ChangeActionObject);
    property: string;
    redoValue: SelectionValue;
    target: Clip | Effect;
    undoValue: SelectionValue;
    get redoValueNumeric(): number;
    get undoValueNumeric(): number;
    redoAction(): void;
    undoAction(): void;
    updateAction(value: SelectionValue): void;
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
interface Selection {
    track?: Track;
    clip?: Clip;
    effect?: Effect;
}
interface MasherObject extends UnknownObject {
    autoplay?: boolean;
    buffer?: number;
    fps?: number;
    loop?: boolean;
    mash?: Mash;
    precision?: number;
    volume?: number;
}
type ClipOrEffect = Clip | Effect;
type MasherAddPromise = Promise<ClipOrEffect>;
interface Masher extends UnknownObject {
    add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): MasherAddPromise;
    addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): LoadPromise;
    addEffect(effect: Effect, insertIndex?: number): LoadPromise;
    addTrack(trackType: TrackType): void;
    autoplay: boolean;
    buffer: number;
    can(method: string): boolean;
    change: MasherChangeHandler;
    changeClip(property: string, value?: SelectionValue, clip?: Clip): void;
    changeEffect(property: string, value?: SelectionValue, effect?: Effect): void;
    clips: Clip[];
    currentTime: number;
    duration: number;
    eventTarget: EventTarget;
    fps: number;
    freeze(): void;
    goToTime(value: Time): LoadPromise;
    imageData: ContextData;
    imageSize: Size;
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
    remove(): void;
    removeClips(clipOrArray: Clip | Clip[]): void;
    removeEffects(effectOrArray: Effect | Effect[]): void;
    save(): void;
    selectClip(clip: Clip | undefined): void;
    selectEffect(effect: Effect | undefined): void;
    selectTrack(track: Track | undefined): void;
    selection: Selection;
    split(): void;
    time: Time;
    timeRange: TimeRange;
    undo(): void;
    volume: number;
}
interface ActionObject {
    actions: Actions;
    mash: Mash;
    redoAction(): void;
    redoSelection: Selection;
    type: string;
    undoAction(): void;
    undoSelection: Selection;
}
declare class Action {
    constructor(object: ActionObject);
    actions: Actions;
    done: boolean;
    mash: Mash;
    redo(): void;
    redoAction(): void;
    redoSelection: Selection;
    get selection(): Selection;
    type: string;
    undo(): void;
    undoAction(): void;
    undoSelection: Selection;
}
declare class VisibleContext {
    constructor(object?: {
        context2d?: Context2D;
    });
    get alpha(): number;
    set alpha(value: number);
    get canvas(): VisibleContextElement;
    set canvas(value: VisibleContextElement);
    clear(): VisibleContext;
    clearSize(size: Size): VisibleContext;
    clearRect(rect: Rect): VisibleContext;
    get composite(): string;
    set composite(value: string);
    private get context2d();
    private set context2d(value);
    get dataUrl(): string;
    draw(source: VisibleSource): VisibleContext;
    drawAtPoint(source: VisibleSource, point: Point): VisibleContext;
    drawFill(fill: string): VisibleContext;
    drawFillInRect(fill: string, rect: Rect): VisibleContext;
    drawFillToSize(fill: string, size: Size): VisibleContext;
    drawImageData(data: ImageData): VisibleContext;
    drawImageDataAtPoint(data: ImageData, point: Point): VisibleContext;
    drawInRect(source: VisibleSource, rect: Rect): VisibleContext;
    drawInRectFromRect(source: VisibleSource, inRect: Rect, fromRect: Rect): VisibleContext;
    drawInRectFromSize(source: VisibleSource, rect: Rect, size: Size): VisibleContext;
    drawInSizeFromSize(source: VisibleSource, inSize: Size, fromSize: Size): VisibleContext;
    drawText(text: string, style: TextStyle): VisibleContext;
    drawTextAtPoint(text: string, style: TextStyle, point: Point): VisibleContext;
    drawToSize(source: VisibleSource, size: Size): VisibleContext;
    drawWithAlpha(source: VisibleSource, alpha: number): VisibleContext;
    drawWithComposite(source: VisibleSource, composite: string): VisibleContext;
    get fill(): string;
    set fill(value: string);
    get font(): string;
    set font(value: string);
    get imageData(): ContextData;
    get imageDataFresh(): ContextData;
    imageDataFromRect(rect: Rect): ContextData;
    imageDataFromSize(size: Size): ContextData;
    get drawingSource(): VisibleSource;
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
type ModularObject = InstanceObject;
interface Modular extends Instance {
    definition: ModularDefinition;
    constructProperties(object?: Any): void;
    loadModular(quantize: number, start: Time, end?: Time): LoadPromise | void;
    modularUrls(quantize: number, start: Time, end?: Time): string[];
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
    evaluator(modular: Modular, range: TimeRange, size: Size, context?: VisibleContext, mergerContext?: VisibleContext): Evaluator;
    inputFilters(modular: Modular, range: TimeRange, size: Size): InputFilter[];
}
type ModularClass = Constrained<Modular>;
type ModularDefinitionClass = Constrained<ModularDefinition>;
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
type FactoryObject = {
    [DefinitionType.Filter]?: FilterFactory;
    [DefinitionType.Audio]?: AudioFactory;
    [DefinitionType.Effect]?: EffectFactory;
    [DefinitionType.Font]?: FontFactory;
    [DefinitionType.Image]?: ImageFactory;
    [DefinitionType.Merger]?: MergerFactory;
    [DefinitionType.Scaler]?: ScalerFactory;
    [DefinitionType.Theme]?: ThemeFactory;
    [DefinitionType.Transition]?: TransitionFactory;
    [DefinitionType.Video]?: VideoFactory;
    [DefinitionType.VideoSequence]?: VideoSequenceFactory;
    [DefinitionType.VideoStream]?: VideoStreamFactory;
};
declare const Factories: FactoryObject;
declare class Factory {
    static get [DefinitionType.Audio](): AudioFactory;
    static get context(): typeof ContextFactory;
    static get [DefinitionType.Effect](): EffectFactory;
    static get [DefinitionType.Filter](): FilterFactory;
    static get [DefinitionType.Font](): FontFactory;
    static get [DefinitionType.Image](): ImageFactory;
    static get [DefinitionType.Merger](): MergerFactory;
    static get [DefinitionType.Scaler](): ScalerFactory;
    static get [DefinitionType.Theme](): ThemeFactory;
    static get [DefinitionType.Transition](): TransitionFactory;
    static get track(): typeof TrackFactory;
    static get [DefinitionType.Video](): VideoFactory;
    static get [DefinitionType.VideoSequence](): VideoSequenceFactory;
    static get [DefinitionType.VideoStream](): VideoStreamFactory;
    private constructor();
}
declare class CacheClass {
    add(url: string, value: Any): void;
    audibleContext: AudibleContext;
    cached(url: string): boolean;
    caching(url: string): boolean;
    private cachedByKey;
    flush(retainUrls: string[]): void;
    get(url: string): Any;
    getObject(url: string): Any;
    key(url: string): string;
    remove(url: string): void;
    private urlsByKey;
    visibleContext: VisibleContext;
}
declare const Cache: CacheClass;
type LoaderClassType = typeof Loader;
declare class LoaderClass {
    audio(): Loader;
    font(): Loader;
    image(): Loader;
    install(type: string, loader: LoaderClassType): void;
    video(): Loader;
}
declare const LoaderFactory: LoaderClass;
declare class MasherClass implements Masher {
    [index: string]: unknown;
    constructor(...args: Any[]);
    private actionCreate;
    private _actions?;
    private get actions();
    add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): MasherAddPromise;
    addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): LoadPromise;
    addEffect(effect: Effect, insertIndex?: number): LoadPromise;
    addTrack(trackType?: TrackType): void;
    autoplay: boolean;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    can(method: MasherAction): boolean;
    change(property: string, value?: SelectionValue): void;
    changeClip(property: string, value?: SelectionValue, clip?: Clip): void;
    changeEffect(property: string, value?: SelectionValue, effect?: Effect): void;
    changeTrack(property: string, value?: SelectionValue, track?: Track): void;
    changeTransformer(type: string, property: string, value?: SelectionValue): void;
    private clipCanBeSplit;
    get clips(): Clip[];
    private currentActionReusable;
    get currentTime(): number;
    get duration(): number;
    private get endTime();
    eventTarget: Emitter;
    private filterClipSelection;
    private _fps;
    get fps(): number;
    set fps(value: number);
    get frame(): number;
    set frame(value: number);
    get frames(): number;
    freeze(): void;
    private get gain();
    goToTime(value?: Time): LoadPromise;
    private handleAction;
    get imageData(): ContextData;
    get imageSize(): Size;
    set imageSize(value: Size);
    private loadMashAndDraw;
    get loadedDefinitions(): DefinitionTimes;
    private _loop;
    get loop(): boolean;
    set loop(value: boolean);
    private _mash?;
    get mash(): Mash;
    set mash(object: Mash);
    move(objectOrArray: ClipOrEffect | ClipOrEffect[], moveType: MoveType, frameOrIndex?: number, trackIndex?: number): void;
    moveClips(clipOrArray: Clip | Clip[], frameOrIndex?: number, trackIndex?: number): void;
    moveEffects(effectOrArray: Effect | Effect[], index?: number): void;
    private _muted;
    get muted(): boolean;
    set muted(value: boolean);
    pause(): void;
    get paused(): boolean;
    set paused(value: boolean);
    play(): void;
    get position(): number;
    set position(value: number);
    get positionStep(): number;
    precision: number;
    redo(): void;
    remove(): void;
    removeClips(clipOrArray: Clip | Clip[]): void;
    removeEffects(effectOrArray: Effect | Effect[]): void;
    save(): void;
    selectClip(clip: Clip | undefined): void;
    selectEffect(effect: Effect | undefined): void;
    selectTrack(track: Track | undefined): void;
    private _selection;
    get selection(): Selection;
    set selection(value: Selection);
    split(): void;
    get time(): Time;
    set time(value: Time);
    get timeRange(): TimeRange;
    undo(): void;
    private _volume;
    get volume(): number;
    set volume(value: number);
}
declare class MasherFactoryImplementation {
    private addMasher;
    // call when masher removed
    destroy(masher: Masher): void;
    private handleInterval;
    instance(object?: MasherObject): Masher;
    private interval;
    private masherStart;
    private masherStop;
    private mashers;
}
declare const MasherFactory: MasherFactoryImplementation;
declare function AudibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T): AudibleDefinitionClass & T;
declare function AudibleMixin<T extends ClipClass>(Base: T): AudibleClass & T;
declare function AudibleFileDefinitionMixin<T extends AudibleDefinitionClass>(Base: T): AudibleFileDefinitionClass & T;
declare function AudibleFileMixin<T extends AudibleClass>(Base: T): AudibleFileClass & T;
declare function ClipDefinitionMixin<T extends DefinitionClass>(Base: T): ClipDefinitionClass & T;
declare function ClipMixin<T extends InstanceClass>(Base: T): ClipClass & T;
declare function ModularMixin<T extends InstanceClass>(Base: T): ModularClass & T;
declare function ModularDefinitionMixin<T extends DefinitionClass>(Base: T): ModularDefinitionClass & T;
// import { DataType } from "../../../Setup/Enums"
// import { Property } from "../../../Setup/Property"
declare function StreamableDefinitionMixin<T extends AudibleDefinitionClass>(Base: T): StreamableDefinitionClass & T;
declare function StreamableMixin<T extends AudibleClass>(Base: T): StreamableClass & T;
declare function TransformableMixin<T extends VisibleClass>(Base: T): TransformableClass & T;
declare function TransformableDefinitionMixin<T extends VisibleDefinitionClass>(Base: T): TransformableDefinitionClass & T;
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
        output: {
            width: number;
            height: number;
            fps: number;
            videoBitrate: number;
            audioBitrate: number;
            audioCodec: string;
            videoCodec: string;
            audioChannels: number;
            audioFrequency: number;
        };
    };
    instance: {
        audio: {
            gain: number;
            trim: number;
            loop: number;
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
            fps: number;
        };
        videosequence: {
            pattern: string;
            fps: number;
            increment: number;
            begin: number;
            padding: number;
        };
        videostream: {
            duration: number;
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
        context: string;
        definition: {
            duration: string;
            audio: string;
            url: string;
            source: string;
            id: string;
            object: string;
        };
        size: string;
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
    wrongClass: string;
};
interface TypesJson {
    [index: string]: TypeObject;
}
declare class TypesClass {
    constructor(object: TypesJson);
    propertyType(type: DataType): Type;
    propertyTypeDefault(type: DataType): ScalarRaw;
    propertyTypes: Map<DataType, Type>;
}
declare const Types: TypesClass;
export { Any, Context2D, ContextElement, VisibleContextElement, VisibleSource, LoadedFont, LoadedImage, LoadedVideo, LoadedAudio, AudibleSource, LoadPromise, LoadFontPromise, LoadImagePromise, Sequence, LoadVideoResult, LoadVideoPromise, LoadAudioPromise, ContextData, Pixels, Timeout, Interval, EventsTarget, ScalarValue, ScalarArray, NumberObject, UnknownObject, StringObject, ObjectUnknown, ValueObject, ScalarRaw, Scalar, ScalarConverter, NumberConverter, StringSetter, NumberSetter, BooleanSetter, JsonValue, JsonObject, SelectionValue, SelectionObject, EvaluatorValue, WithFrame, WithLayer, WithTrack, WithLabel, Rgb, Rgba, WithType, WithId, WithTypeAndId, WithTypeAndValue, Size, EvaluatedSize, EvaluatedPoint, Point, EvaluatedRect, Rect, TextStyle, RgbObject, YuvObject, Yuv, Constructor, Constrained, GenericFactory, ScrollMetrics, MasherChangeHandler, StartOptions, InputParameter, InputFilter, InputOverlay, InputCommand, InputCommands, InputCommandsPromise, RemoteServer, RemoteServerProps, ClipState, MashStatePromise, MashState, Options, OutputOptions, Definition, DefinitionClass, DefinitionBase, DefinitionObject, DefinitionTimes, Instance, InstanceClass, InstanceBase, InstanceObject, Definitions, definitionsByType, definitionsClear, definitionsFont, definitionsFromId, definitionsInstall, definitionsInstalled, DefinitionsMap, definitionsMerger, definitionsScaler, definitionsUninstall, Factories, FactoryObject, Factory, Action, ActionObject, ActionFactory, AddClipToTrackAction, AddEffectAction, AddEffectActionObject, AddTrackAction, AddTrackActionObject, ChangeAction, ChangeActionObject, ChangeFramesAction, ChangeTrimAction, FreezeAction, MoveClipsAction, MoveEffectsAction, RemoveClipsAction, SplitAction, Actions, Job, JobObject, Cache, Loader, LoaderFactory, Audio, AudioObject, AudioDefinition, AudioDefinitionObject, AudioFactory, AudioDefinitionClass, audioDefine, audioDefinition, audioDefinitionFromId, AudioFactoryImplementation, audioFromId, audioInstall, audioInitialize, audioInstance, AudioClass, AudioLoader, EffectDefinitionClass, EffectClass, effectDefine, effectDefine as effectInstall, effectDefinition, effectDefinitionFromId, EffectFactoryImplementation, effectFromId, effectInitialize, effectInstance, Effect, EffectDefinition, EffectDefinitionObject, EffectFactory, EffectObject, Filter, FilterDefinition, FilterDefinitionObject, FilterFactory, FilterObject, FilterDefinitionClass, filterDefine, filterDefine as filterInstall, filterDefinition, filterDefinitionFromId, FilterFactoryImplementation, filterFromId, filterInitialize, filterInstance, FilterClass, Font, FontDefinition, FontDefinitionObject, FontFactory, FontObject, FontDefinitionClass, fontDefine, fontDefine as fontInstall, fontDefinition, fontDefinitionFromId, FontFactoryImplementation, fontFromId, fontInitialize, fontInstance, FontClass, FontLoader, Image, ImageDefinition, ImageDefinitionObject, ImageFactory, ImageObject, ImageDefinitionClass, imageInstall, imageDefine, imageDefinition, imageDefinitionFromId, ImageFactoryImplementation, imageFromId, imageInitialize, imageInstance, ImageClass, ImageLoader, Mash, MashObject, MashFactory, MashClass, Merger, MergerDefinition, MergerDefinitionObject, MergerFactory, MergerObject, MergerDefinitionClass, mergerDefine, mergerDefine as mergerInstall, mergerDefaultId, mergerDefinition, mergerDefinitionFromId, MergerFactoryImplementation, mergerFromId, mergerInitialize, mergerInstance, MergerClass, Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerFactory, ScalerObject, ScalerDefinitionClass, scalerDefine, scalerDefine as scalerInstall, scalerDefaultId, scalerDefinition, scalerDefinitionFromId, ScalerFactoryImplementation, scalerFromId, scalerInitialize, scalerInstance, ScalerClass, Theme, ThemeDefinition, ThemeDefinitionObject, ThemeFactory, ThemeObject, ThemeDefinitionClass, themeDefine, themeDefine as themeInstall, themeDefinition, themeDefinitionFromId, ThemeFactoryImplementation, themeFromId, themeInitialize, themeInstance, ThemeClass, Track, TrackObject, TrackFactory, TrackClass, Transition, TransitionDefinition, TransitionDefinitionObject, TransitionDefinitionTransformObject, TransitionFactory, TransitionObject, TransitionDefinitionClass, transitionDefine, transitionDefine as transitionInstall, transitionDefinition, transitionDefinitionFromId, TransitionFactoryImplementation, transitionFromId, transitionInitialize, transitionInstance, TransitionClass, Video, VideoClass, VideoDefinition, VideoDefinitionClass, VideoDefinitionObject, VideoFactory, VideoObject, VideoDefinitionClassImplementation, videoInstall, videoDefine, videoDefinition, videoDefinitionFromId, VideoFactoryImplementation, videoFromId, videoInitialize, videoInstance, VideoClassImplementation, VideoStream, VideoStreamDefinition, VideoStreamDefinitionObject, VideoStreamFactory, VideoStreamObject, VideoStreamDefinitionClass, videoStreamInstall, videoStreamDefine, videoStreamDefinition, videoStreamDefinitionFromId, VideoStreamFactoryImplementation, videoStreamFromId, videoStreamInitialize, videoStreamInstance, VideoStreamClass, VideoLoader, VideoSequence, VideoSequenceClass, VideoSequenceDefinition, VideoSequenceDefinitionClass, VideoSequenceDefinitionObject, VideoSequenceFactory, VideoSequenceObject, VideoSequenceDefinitionClassImplementation, videoSequenceInstall, videoSequenceDefine, videoSequenceDefinition, videoSequenceDefinitionFromId, VideoSequenceFactoryImplementation, videoSequenceFromId, videoSequenceInitialize, videoSequenceInstance, VideoSequenceClassImplementation, Masher, MasherObject, MasherAddPromise, ClipOrEffect, Selection, MasherClass, MasherFactory, Audible, AudibleClass, AudibleDefinition, AudibleDefinitionClass, AudibleDefinitionObject, AudibleObject, AudibleDefinitionMixin, AudibleMixin, AudibleFile, AudibleFileClass, AudibleFileDefinition, AudibleFileDefinitionClass, AudibleFileDefinitionObject, AudibleFileObject, AudibleFileDefinitionMixin, AudibleFileMixin, Clip, ClipClass, ClipDefinition, ClipDefinitionClass, ClipDefinitionObject, ClipObject, ClipDefinitionMixin, ClipMixin, Modular, ModularClass, ModularDefinition, ModularDefinitionClass, ModularDefinitionObject, ModularObject, ModularMixin, ModularDefinitionMixin, Streamable, StreamableClass, StreamableDefinition, StreamableDefinitionClass, StreamableDefinitionObject, StreamableObject, StreamableDefinitionMixin, StreamableMixin, Transformable, TransformableClass, TransformableDefinition, TransformableDefinitionObject, TransformableObject, TransformableDefinitionClass, TransformableMixin, TransformableDefinitionMixin, Visible, VisibleClass, VisibleDefinition, VisibleDefinitionClass, VisibleDefinitionObject, VisibleObject, VisibleDefinitionMixin, VisibleMixin, AudibleContext, Composition, ContextFactory, VisibleContext, EventsType, EventsDetail, Default, ActionType, ClipType, ClipTypes, CommandType, CommandTypes, DataType, DataTypes, DefinitionType, DefinitionTypes, EventType, LoadType, MasherAction, MasherActions, ModuleType, ModuleTypes, MoveType, OutputFormat, OutputFormats, TrackType, TrackTypes, TransformType, TransformTypes, Errors, Parameter, ParameterObject, Property, PropertyObject, Propertied, PropertiedClass, Type, TypeObject, Types, TypeValue, TypeValueObject, Capitalize, Color, colorStrip, colorValid, colorRgb2hex, colorYuv2rgb, colorRgb2yuv, colorYuvBlend, colorTransparent, Element, elementScrollMetrics, Emitter, Evaluator, Id, idGenerate, idPrefix, idPrefixSet, Is, isAboveZero, isArray, booleanType as isBoolean, isDefined, isFloat, isInteger, methodType as isMethod, isNan, numberType as isNumber, objectType as isObject, isPopulatedArray, isPopulatedObject, isPopulatedString, isPositive, stringType as isString, undefinedType as isUndefined, Pixel, pixelColor, pixelFromFrame, pixelNeighboringRgbas, pixelPerFrame, pixelRgbaAtIndex, pixelToFrame, Round, roundMethod, roundWithMethod, Seconds, Sort, sortByFrame, sortByLabel, sortByTrack, sortByLayer, Time, Times, timeEqualizeRates, TimeRange, Url, urlAbsolute, urlForRemoteServer, urlRemoteServer };
//# sourceMappingURL=index.d.ts.map