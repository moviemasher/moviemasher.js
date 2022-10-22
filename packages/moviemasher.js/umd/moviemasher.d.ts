/// <reference types="node" />
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}
type Value = number | string;
type Scalar = boolean | Value | undefined;
type PopulatedString = string & {
    isEmpty: never;
};
interface ValueObject extends Record<string, Value> {
}
interface NumberObject extends Record<string, number> {
}
interface BooleanObject extends Record<string, boolean> {
}
interface UnknownObject extends Record<string, unknown> {
}
interface StringObject extends Record<string, string> {
}
interface ScalarObject extends Record<string, Scalar> {
}
interface StringsObject extends Record<string, string[]> {
}
interface RegExpObject extends Record<string, RegExp> {
}
interface ObjectUnknown extends Record<string, UnknownObject> {
}
interface VisibleContextData extends ImageData {
}
interface VisibleContextElement extends HTMLCanvasElement {
}
interface AudibleContextData extends AudioContext {
}
interface Context2D extends CanvasRenderingContext2D {
}
interface Pixels extends Uint8ClampedArray {
}
interface LoadedImage extends HTMLImageElement {
} // limited Image API in tests!
// limited Image API in tests!
interface LoadedVideo extends HTMLVideoElement {
}
interface LoadedSvgImage extends SVGImageElement {
}
interface LoadedAudio extends AudioBuffer {
}
interface LoadedFont extends FontFace {
} // just { family: string } in tests!
// just { family: string } in tests!
interface AudibleSource extends AudioBufferSourceNode {
}
type FfmpegSvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement;
type SvgFilter = FfmpegSvgFilter | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement | SVGFEComponentTransferElement;
type SvgFilters = SvgFilter[];
type LoadedImageOrVideo = LoadedImage | LoadedVideo;
type SvgItem = SVGElement | LoadedImageOrVideo;
type SvgItems = SvgItem[];
type SvgItemsTuple = [
    SvgItems,
    SvgItems
];
type PreviewItem = SVGSVGElement | HTMLDivElement;
type PreviewItems = PreviewItem[];
type SvgOrImage = SVGSVGElement | LoadedImage;
type VisibleSource = HTMLVideoElement | HTMLImageElement | SVGImageElement | HTMLCanvasElement;
type CanvasVisibleSource = VisibleSource | ImageBitmap | CanvasImageSource;
type Timeout = ReturnType<typeof setTimeout>;
type Interval = ReturnType<typeof setInterval>;
type LoadFontPromise = Promise<LoadedFont>;
type LoadImagePromise = Promise<LoadedImage>;
type LoadVideoPromise = Promise<LoadedVideo>;
type LoadAudioPromise = Promise<LoadedAudio>;
interface NumberConverter {
    (value: number): number;
}
interface StringSetter {
    (value: string): void;
}
interface NumberSetter {
    (value: number): void;
}
interface BooleanSetter {
    (value: boolean): void;
}
interface BooleanGetter {
    (): boolean;
}
type EventHandler = (event: Event) => void;
type AnyArray = any[];
type JsonValue = Scalar | AnyArray | UnknownObject;
interface JsonObject extends Record<string, JsonValue | JsonValue[]> {
}
interface WithFrame {
    frame: number;
}
interface WithIndex {
    index: number;
}
interface WithTrack {
    trackNumber: number;
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
interface AlphaColor {
    color: string;
    alpha: number;
}
interface AndType {
    type: string;
}
interface AndId {
    id: string;
}
interface AndLabel {
    label: string;
}
interface LabelAndId extends AndId, AndLabel {
}
interface WithError {
    error?: string;
}
interface AndTypeAndId extends AndType, AndId {
}
interface AndTypeAndValue extends AndType {
    value: number;
}
interface RgbObject {
    r: Value;
    g: Value;
    b: Value;
}
interface RgbaObject extends RgbObject {
    a: Value;
}
interface Rgb {
    r: number;
    g: number;
    b: number;
}
interface YuvObject {
    y: Value;
    u: Value;
    v: Value;
}
interface Yuv {
    y: number;
    u: number;
    v: number;
}
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type Constrained<T = UnknownObject> = new (...args: any[]) => T;
interface GenericFactory<INSTANCE, INSTANCEOBJECT, DEFINITION, DEFINITIONOBJECT> {
    defaults?: DEFINITION[];
    definitionFromId(id: string): DEFINITION;
    definition(object: DEFINITIONOBJECT): DEFINITION;
    instance(object: INSTANCEOBJECT): INSTANCE;
    fromId(id: string): INSTANCE;
}
interface StartOptions {
    duration: number;
    offset?: number;
    start: number;
}
// TODO: rename prefix to path and add query string parameters?
interface Endpoint {
    protocol?: string;
    prefix?: string;
    host?: string;
    port?: number;
}
interface UploadDescription {
    name: string;
    type: string;
    size: number;
}
interface InputParameter {
    key: string;
    value: Value;
}
interface DescribedObject extends AndId, UnknownObject {
    icon?: string;
    label?: string;
}
interface Described extends AndId {
    createdAt: string;
    icon: string;
    label: string;
}
declare const isCustomEvent: (value: any) => value is CustomEvent<any>;
declare enum DroppingPosition {
    At = "at",
    After = "after",
    Before = "before",
    None = "none"
}
declare enum LayerType {
    Mash = "mash",
    Folder = "folder"
}
declare const LayerTypes: LayerType[];
declare const isLayerType: (value: any) => value is LayerType;
declare function assertLayerType(value: any): asserts value is LayerType;
declare enum ActionType {
    AddClipToTrack = "addClipToTrack",
    AddEffect = "addEffect",
    AddLayer = "addLayer",
    AddTrack = "addTrack",
    Change = "change",
    ChangeMultiple = "changeMultiple",
    ChangeFrame = "changeFrame",
    ChangeGain = "changeGain",
    MoveClip = "moveClip",
    MoveEffect = "moveEffect",
    MoveLayer = "moveLayer",
    RemoveClip = "removeClip",
    RemoveLayer = "removeLayer"
}
declare enum EditType {
    Mash = "mash",
    Cast = "cast"
}
declare const EditTypes: EditType[];
declare const isEditType: (value?: any) => value is EditType;
declare function assertEditType(value: any, name?: string): asserts value is EditType;
declare enum AVType {
    Audio = "audio",
    Both = "both",
    Video = "video"
}
declare enum SelectType {
    Cast = "cast",
    Clip = "clip",
    Container = "container",
    Content = "content",
    Effect = "effect",
    Layer = "layer",
    Mash = "mash",
    None = "none",
    Track = "track"
}
declare const SelectTypes: SelectType[];
declare const isSelectType: (value?: any) => value is SelectType;
declare function assertSelectType(value: any, name?: string): asserts value is SelectType;
type ClipSelectType = SelectType.Content | SelectType.Container;
declare const ClipSelectTypes: SelectType[];
declare const isClipSelectType: (type?: any) => type is ClipSelectType;
declare enum OutputFormat {
    AudioConcat = "wav",
    Flv = "flv",
    Hls = "hls",
    Jpeg = "jpeg",
    Mdash = "mdash",
    Mp3 = "mp3",
    Mp4 = "mp4",
    Png = "image2",
    Rtmp = "rtmp",
    VideoConcat = "yuv4mpegpipe"
}
declare enum StreamingFormat {
    Hls = "hls",
    Mdash = "mdash",
    Rtmp = "rtmp"
}
declare enum OutputType {
    Audio = "audio",
    Image = "image",
    ImageSequence = "imagesequence",
    Video = "video",
    Waveform = "waveform"
}
declare const OutputTypes: OutputType[];
declare enum FillType {
    Color = "color",
    Fill = "fill"
}
declare const FillTypes: FillType[];
declare const isFillType: (type?: any) => type is FillType;
declare enum GraphFileType {
    Svg = "svg",
    SvgSequence = "svgsequence",
    Txt = "txt"
}
declare const GraphFileTypes: GraphFileType[];
declare const isGraphFileType: (type?: any) => type is GraphFileType;
declare enum LoadType {
    Audio = "audio",
    Font = "font",
    Image = "image",
    Video = "video"
}
declare const LoadTypes: LoadType[];
declare const isLoadType: (type?: any) => type is LoadType;
declare function assertLoadType(value: any, name?: string): asserts value is LoadType;
declare const UploadTypes: LoadType[];
declare const isUploadType: (type?: any) => type is LoadType;
declare enum DefinitionType {
    Audio = "audio",
    Clip = "clip",
    Container = "container",
    Content = "content",
    Effect = "effect",
    Filter = "filter",
    Font = "font",
    Image = "image",
    Video = "video",
    VideoSequence = "videosequence"
}
declare const DefinitionTypes: DefinitionType[];
declare const isDefinitionType: (type?: any) => type is DefinitionType;
declare function assertDefinitionType(value?: any, message?: string): asserts value is DefinitionType;
type SizingDefinitionType = DefinitionType.Container | DefinitionType.Image | DefinitionType.Video | DefinitionType.VideoSequence;
declare const SizingDefinitionTypes: DefinitionType[];
declare const isSizingDefinitionType: (type?: any) => type is SizingDefinitionType;
type TimingDefinitionType = DefinitionType.Audio | DefinitionType.Video | DefinitionType.VideoSequence;
declare const TimingDefinitionTypes: DefinitionType[];
declare const isTimingDefinitionType: (type?: any) => type is TimingDefinitionType;
type ContainerType = DefinitionType.Image | DefinitionType.Container | DefinitionType.VideoSequence;
declare const ContainerTypes: DefinitionType[];
declare const isContainerType: (type?: any) => type is ContainerType;
declare function assertContainerType(type?: any): asserts type is ContainerType;
type ContentType = DefinitionType.Content | DefinitionType.Image | DefinitionType.Video | DefinitionType.VideoSequence | DefinitionType.Audio;
declare const ContentTypes: DefinitionType[];
declare const isContentType: (type?: any) => type is ContentType;
declare function assertContentType(type?: any): asserts type is ContentType;
type DefinitionTypesObject = Record<string, DefinitionType[]>;
declare enum DataType {
    Boolean = "boolean",
    ContainerId = "containerid",
    ContentId = "contentid",
    DefinitionId = "definitionid",
    FontId = "fontid",
    Frame = "frame",
    Number = "number",
    Percent = "percent",
    Rgb = "rgb",
    String = "string",
    Timing = "timing",
    Sizing = "sizing"
}
declare const DataTypes: DataType[];
declare const isDataType: (type?: any) => type is DataType;
declare function assertDataType(value: any, name?: string): asserts value is DataType;
declare enum Orientation {
    H = "H",
    V = "V"
}
declare const Orientations: Orientation[];
declare const isOrientation: (value: any) => value is Orientation;
declare enum Direction {
    E = "E",
    N = "N",
    S = "S",
    W = "W"
}
declare const Directions: Direction[];
declare const isDirection: (value?: any) => value is Direction;
declare function assertDirection(value: any, name?: string): asserts value is Direction;
type DirectionObject = {
    [index in Direction]?: boolean;
};
declare enum Anchor {
    E = "E",
    N = "N",
    NE = "NE",
    NW = "NW",
    S = "S",
    SE = "SE",
    SW = "SW",
    W = "W"
}
declare const Anchors: Anchor[];
declare enum TriggerType {
    Init = "init",
    Stop = "stop",
    Start = "start"
}
declare const TriggerTypes: TriggerType[];
declare const isTriggerType: (type?: any) => type is TriggerType;
declare enum TransformType {
    Scale = "scale",
    Translate = "translate"
}
declare enum EventType {
    Action = "action",
    Active = "active",
    Added = "added",
    Cast = "cast",
    Draw = "draw",
    Duration = "durationchange",
    Ended = "ended",
    Fps = "ratechange",
    Loaded = "loadeddata",
    Mash = "mash",
    Pause = "pause",
    Play = "play",
    Playing = "playing",
    Render = "render",
    Resize = "resize",
    Save = "save",
    Seeked = "seeked",
    Seeking = "seeking",
    Selection = "selection",
    Time = "timeupdate",
    Track = "track",
    Volume = "volumechange",
    Waiting = "waiting"
}
declare const EventTypes: EventType[];
declare const isEventType: (type?: any) => type is EventType;
declare enum MoveType {
    Audio = "audio",
    Effect = "effect",
    Video = "video"
}
declare enum MasherAction {
    Redo = "redo",
    Remove = "remove",
    Render = "render",
    Save = "save",
    Undo = "undo"
}
declare enum GraphType {
    Mash = "mash",
    Cast = "cast"
}
declare enum ServerType {
    Api = "api",
    Data = "data",
    File = "file",
    Rendering = "rendering",
    Streaming = "streaming",
    Web = "web"
}
declare const ServerTypes: ServerType[];
declare enum Duration {
    Unknown = -1,
    Unlimited = -2,
    None = 0
}
declare enum Timing {
    Custom = "custom",
    Content = "content",
    Container = "container"
}
declare const Timings: Timing[];
declare enum Sizing {
    Preview = "preview",
    Content = "content",
    Container = "container"
}
declare const Sizings: Sizing[];
interface Size {
    width: number;
    height: number;
}
declare const isSize: (value: any) => value is Size;
declare function assertSize(value: any, name?: string): asserts value is Size;
declare const sizesEqual: (size: Size, sizeEnd?: any) => boolean;
type Sizes = Size[];
type SizeTuple = [
    Size,
    Size
];
declare const SizeZero: {
    width: number;
    height: number;
};
declare const sizedEven: (number: number) => number;
declare const sizeEven: (size: Size) => Size;
declare const sizeRound: (point: Size) => Size;
declare const sizeCeil: (size: Size) => Size;
declare const sizeFloor: (size: Size) => Size;
declare const sizeScale: (size: Size, horizontally: number, vertically: number) => Size;
declare const sizeCover: (inSize: Size, outSize: Size, contain?: boolean) => Size;
declare const sizeAboveZero: (size: any) => size is Size;
declare function assertSizeAboveZero(size: any, name?: string): asserts size is Size;
declare const SizeOutput: Size;
declare const SizePreview: Size;
declare const SizeIcon: Size;
declare const sizeCopy: (size: any) => {
    width: any;
    height: any;
};
declare const sizeLock: (lockSize: Size, lock?: Orientation | undefined) => Size;
declare const sizeString: (size: Size) => string;
declare const sizeLockNegative: (size: Size, lock?: Orientation | undefined) => Size;
declare const sizeFromElement: (element: Element) => Size;
declare enum DataGroup {
    Point = "point",
    Size = "size",
    Opacity = "opacity",
    Color = "color",
    Effects = "effects",
    Timing = "timing",
    Sizing = "sizing"
}
declare const DataGroups: DataGroup[];
declare const isDataGroup: (value?: any) => value is DataGroup;
declare function assertDataGroup(value: any, name?: string): asserts value is DataGroup;
interface PropertyObject {
    custom?: boolean;
    defaultValue?: Scalar;
    max?: number;
    min?: number;
    name?: string;
    step?: number;
    tweenable?: boolean;
    type?: DataType | string;
    group?: DataGroup;
}
interface Property {
    custom?: boolean;
    defaultValue: Scalar;
    max?: number;
    min?: number;
    name: string;
    step?: number;
    tweenable?: boolean;
    group?: DataGroup;
    type: DataType;
}
declare const isProperty: (value: any) => value is Property;
declare function assertProperty(value: any, name?: string): asserts value is Property;
declare const propertyInstance: (object: PropertyObject) => Property;
interface Time {
    add(time: Time): Time;
    closest(timeRange: TimeRange): Time;
    copy: Time;
    divide(number: number, rounding?: string): Time;
    equalsTime(time: Time): boolean;
    fps: number;
    frame: number;
    durationFrames(duration: number, fps?: number): number[];
    lengthSeconds: number;
    isRange: boolean;
    min(time: Time): Time;
    scale(fps: number, rounding?: string): Time;
    scaleToFps(fps: number): Time;
    seconds: number;
    startTime: Time;
    timeRange: TimeRange;
    withFrame(frame: number): Time;
}
interface TimeRange extends Time {
    copy: TimeRange;
    end: number;
    endTime: Time;
    frames: number;
    includes(frame: number): boolean;
    intersects(time: Time): boolean;
    last: number;
    lastTime: Time;
    position: number;
    positionTime(position: number, rounding?: string): Time;
    scale(fps: number, rounding?: string): TimeRange;
    times: Times;
    withFrame(frame: number): TimeRange;
}
type Times = Time[];
type TimeRanges = TimeRange[];
declare const PropertyTweenSuffix = "End";
interface Propertied {
    addProperties(object: any, ...properties: Property[]): void;
    properties: Property[];
    setValue(value: Scalar, name: string, property?: Property): void;
    setValues(object: ScalarObject): void;
    toJSON(): UnknownObject;
    value(key: string): Scalar;
}
interface PropertiedChangeHandler {
    (property: string, value: Scalar): void;
}
declare class PropertiedClass implements Propertied {
    [index: string]: unknown;
    constructor(..._args: any[]);
    addProperties(object: any, ...properties: Property[]): void;
    properties: Property[];
    get propertiesCustom(): Property[];
    protected propertiesInitialize(object: any): void;
    propertyFind(name: string): Property | undefined;
    private propertyName;
    private propertySetOrDefault;
    protected propertyTweenSetOrDefault(object: any, property: Property): void;
    setValue(value: Scalar, name: string, property?: Property): void;
    setValues(object: ScalarObject): void;
    toJSON(): UnknownObject;
    value(key: string): Scalar;
}
declare const isPropertied: (value: any) => value is Propertied;
interface InstanceObject extends UnknownObject {
    definitionId?: string;
    definition?: Definition;
    label?: string;
}
declare const isInstanceObject: (value?: any) => value is InstanceObject;
interface Instance extends Propertied {
    copy(): Instance;
    definition: Definition;
    definitionId: string;
    definitionIds(): string[];
    propertiesCustom: Property[];
    id: string;
    label: string;
    propertyNames: string[];
    type: DefinitionType;
}
declare const isInstance: (value?: any) => value is Instance;
type InstanceClass = Constrained<Instance>;
declare const ExtHls = "m3u8";
declare const ExtTs = "ts";
declare const ExtRtmp = "flv";
declare const ExtDash = "dash";
declare const ExtJpeg = "jpg";
declare const ExtPng = "png";
declare const ExtJson = "json";
declare const ExtText = "txt";
declare const OutputFilterGraphPadding = 6;
declare const EmptyMethod: () => void;
// xmlns
declare const NamespaceSvg = "http://www.w3.org/2000/svg";
// xmlns:xhtml
declare const NamespaceXhtml = "http://www.w3.org/1999/xhtml";
// xmlns:xlink
declare const NamespaceLink = "http://www.w3.org/1999/xlink";
declare const IdPrefix = "com.moviemasher.";
declare const IdSuffix = ".default";
declare const ClassDisabled = "disabled";
declare const ClassButton = "button";
declare const ClassCollapsed = "collapsed";
declare const ClassSelected = "selected";
declare const ClassDropping = "dropping";
declare const ClassDroppingBefore = "dropping-before";
declare const ClassDroppingAfter = "dropping-after";
interface ParameterObject {
    name: string;
    value: Value | ValueObject[];
    values?: Value[];
    dataType?: DataType | string;
}
declare class Parameter {
    constructor({ name, value, dataType, values }: ParameterObject);
    dataType: DataType;
    name: string;
    toJSON(): UnknownObject;
    value: Value | ValueObject[];
    values?: Value[];
}
interface FilterObject extends InstanceObject {
    parameters?: ParameterObject[];
}
interface FilterDefinitionObject extends DefinitionObject {
}
interface Filter extends Instance {
    commandFilters(args: FilterCommandFilterArgs): CommandFilters;
    definition: FilterDefinition;
    parametersDefined: Parameter[];
    filterSvg(args?: FilterArgs): SvgItem;
    filterSvgFilter(): SvgFilters;
    scalarObject(tweening?: boolean): ScalarObject;
}
type Filters = Filter[];
interface FilterDefinition extends Definition {
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    instanceFromObject(object?: FilterObject): Filter;
    parameters: Parameter[];
    filterDefinitionSvg(args: FilterDefinitionArgs): SvgItem;
    filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters;
}
/**
 * @category Factory
 */
interface FilterFactory extends GenericFactory<Filter, FilterObject, FilterDefinition, FilterDefinitionObject> {
}
interface Point {
    x: number;
    y: number;
}
declare const isPoint: (value: any) => value is Point;
declare function assertPoint(value: any, name?: string): asserts value is Point;
type PointTuple = [
    Point,
    Point
];
declare const pointsEqual: (point: Point, pointEnd?: any) => boolean;
declare const PointZero: Point;
declare const pointCopy: (point: any) => Point;
declare const pointRound: (point: Point) => Point;
declare const pointString: (point: Point) => string;
declare const pointValueString: (point: Point) => string;
declare const pointNegate: (point: Point) => Point;
interface Rect extends Size, Point {
}
declare const isRect: (value: any) => value is Rect;
declare function assertRect(value: any, name?: string): asserts value is Rect;
type Rects = Rect[];
type RectTuple = [
    Rect,
    Rect
];
declare const rectsEqual: (rect: Rect, rectEnd: any) => boolean;
declare const RectZero: {
    width: number;
    height: number;
    x: number;
    y: number;
};
declare const rectFromSize: (size: Size, point?: Point | undefined) => Rect;
declare const rectsFromSizes: (sizes: SizeTuple, points?: PointTuple | undefined) => RectTuple;
declare const rectCopy: (rect: any) => {
    width: any;
    height: any;
    x: number;
    y: number;
};
declare const rectRound: (rect: Rect) => Rect;
declare const centerPoint: (size: Size, inSize: Size) => Point;
declare const rectString: (dimensions: any) => string;
interface CommandFilter {
    avType?: AVType;
    ffmpegFilter: string;
    inputs: string[];
    outputs: string[];
    options: ValueObject;
}
type CommandFilters = CommandFilter[];
interface GraphFilter extends CommandFilter {
    filter: Filter;
}
type GraphFilters = GraphFilter[];
interface FilterValueObject {
    filter: Filter;
    valueObject: ValueObject;
}
type FilterValueObjects = FilterValueObject[];
interface GraphFileBase {
    audible?: boolean;
    editing?: boolean;
    visible?: boolean;
    icon?: boolean;
    streaming?: boolean;
    time: Time;
}
interface GraphFileOptions extends Partial<GraphFileBase> {
    quantize?: number;
    clipTime?: TimeRange;
}
interface GraphFileArgs extends GraphFileBase {
    quantize: number;
    clipTime: TimeRange;
}
type ColorTuple = [
    string,
    string
];
interface CommandFileOptions {
    streaming?: boolean;
    visible?: boolean;
    time: Time;
    quantize: number;
    outputSize?: Size;
    containerRects?: RectTuple;
    contentColors?: ColorTuple;
    videoRate: number;
    clipTime?: TimeRange;
}
interface CommandFileArgs extends CommandFileOptions {
    clipTime: TimeRange;
}
interface VisibleCommandFileArgs extends CommandFileArgs {
    outputSize: Size;
    containerRects: RectTuple;
}
interface CommandFilterArgs extends CommandFileArgs {
    track: number;
    commandFiles: CommandFiles;
    chainInput: string;
    filterInput?: string;
    upload?: boolean;
}
interface VisibleCommandFilterArgs extends CommandFilterArgs {
    outputSize: Size;
    containerRects: RectTuple;
    duration: number;
}
interface FilterArgs {
    propertied?: Propertied;
}
interface FilterCommandFilterArgs extends FilterArgs {
    chainInput?: string;
    filterInput?: string;
    dimensions?: Size;
    videoRate: number;
    duration: number;
}
interface FilterDefinitionArgs extends FilterArgs {
    filter: Filter;
}
interface FilterDefinitionCommandFilterArgs extends FilterCommandFilterArgs {
    filter: Filter;
}
interface GraphFile {
    type: LoaderType;
    file: string;
    content?: string;
    input?: boolean;
    definition?: Definition;
    resolved?: string;
}
type GraphFiles = GraphFile[];
interface CommandFile extends GraphFile {
    options?: ValueObject;
    inputId: string;
}
type CommandFiles = CommandFile[];
interface DefinitionRecord extends Record<string, Definition> {
}
type VoidMethod = typeof EmptyMethod;
type LoadedMedia = LoadedImageOrVideo | LoadedAudio;
declare const isLoadedVideo: (value: any) => value is LoadedVideo;
declare const isLoadedImage: (value: any) => value is LoadedImage;
declare const isLoadedAudio: (value: any) => value is LoadedAudio;
interface ErrorObject {
    error: string;
    label: string;
    value?: Value;
}
type DefinitionOrErrorObject = DefinitionObject | ErrorObject;
type Loaded = LoadedFont | LoadedMedia | LoadedSvgImage | AudioBuffer;
interface CommandProbeStream {
    [key: string]: any;
    // avg_frame_rate?: string | undefined
    // bit_rate?: string | undefined
    // bits_per_raw_sample?: string | undefined
    // bits_per_sample?: number | undefined
    // channel_layout?: string | undefined
    // channels?: number | undefined
    // chroma_location?: string | undefined
    // codec_long_name?: string | undefined
    // codec_tag_string?: string | undefined
    // codec_tag?: string | undefined
    // codec_time_base?: string | undefined
    // coded_height?: number | undefined
    // coded_width?: number | undefined
    // color_primaries?: string | undefined
    // color_range?: string | undefined
    // color_space?: string | undefined
    // color_transfer?: string | undefined
    // display_aspect_ratio?: string | undefined
    // duration_ts?: string | undefined
    // field_order?: string | undefined
    // has_b_frames?: number | undefined
    // id?: string | undefined
    // level?: string | undefined
    // max_bit_rate?: string | undefined
    // nb_frames?: string | undefined
    // nb_read_frames?: string | undefined
    // nb_read_packets?: string | undefined
    // profile?: number | undefined
    // r_frame_rate?: string | undefined
    // refs?: number | undefined
    // sample_aspect_ratio?: string | undefined
    // sample_fmt?: string | undefined
    // sample_rate?: number | undefined
    // start_pts?: number | undefined
    // start_time?: number | undefined
    // time_base?: string | undefined
    // timecode?: string | undefined
    codec_name?: string | undefined;
    codec_type?: string | undefined;
    duration?: string | undefined;
    height?: number | undefined;
    pix_fmt?: string | undefined;
    rotation?: string | number | undefined;
    width?: number | undefined;
}
interface CommandProbeFormat {
    // filename?: string | undefined
    // nb_streams?: number | undefined
    // nb_programs?: number | undefined
    // format_name?: string | undefined
    format_long_name?: string | undefined;
    // start_time?: number | undefined
    duration?: number | undefined;
    // size?: number | undefined
    // bit_rate?: number | undefined
    probe_score?: number | undefined;
    tags?: Record<string, string | number> | undefined;
}
interface CommandProbeData {
    streams: CommandProbeStream[];
    format: CommandProbeFormat;
}
interface LoadedInfo extends Partial<ErrorObject> {
    audible?: boolean;
    duration?: number;
    family?: string;
    extension?: string;
    alpha?: boolean;
    fps?: number;
    height?: number;
    width?: number;
    info?: CommandProbeData;
}
type LoaderType = GraphFileType | LoadType;
declare const isLoaderType: (value: any) => value is LoaderType;
declare function assertLoaderType(value: any, name?: string): asserts value is LoaderType;
type LoaderPath = string;
declare const isLoaderPath: (value: any) => value is string;
declare function assertLoaderPath(value: any, name?: string): asserts value is LoaderPath;
interface LoaderFile {
    loaderPath: LoaderPath;
    loaderType: LoaderType;
    options?: ScalarObject;
    urlOrLoaderPath: LoaderPath;
}
type LoaderFiles = LoaderFile[];
interface LoaderCache {
    error?: any;
    definitions: Definition[];
    loaded: boolean;
    loadedInfo?: LoadedInfo;
    promise?: Promise<Loaded>;
    result?: Loaded;
}
interface Loader {
    flushFilesExcept(fileUrls?: GraphFiles): void;
    getCache(path: LoaderPath): LoaderCache | undefined;
    getError(graphFile: GraphFile): any;
    info(loaderPath: LoaderPath): LoadedInfo | undefined;
    key(graphFile: GraphFile): string;
    loadedFile(graphFile: GraphFile): boolean;
    loadFilesPromise(files: GraphFiles): Promise<void>;
    loadPromise(urlPath: string, definition?: Definition): Promise<any>;
    sourceUrl(graphFile: GraphFile): string;
}
interface DefinitionObject extends UnknownObject, Partial<Described> {
    type?: DefinitionType | string;
}
declare const isDefinitionObject: (value: any) => value is DefinitionObject;
type DefinitionObjects = DefinitionObject[];
interface Definition {
    definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined;
    id: string;
    instanceFromObject(object?: InstanceObject): Instance;
    instanceArgs(object?: InstanceObject): InstanceObject;
    label: string;
    properties: Property[];
    propertiesModular: Property[];
    toJSON(): UnknownObject;
    type: DefinitionType;
}
type Definitions = Definition[];
type DefinitionClass = Constrained<Definition>;
type DefinitionTimes = Map<Definition, Times[]>;
declare const isDefinition: (value: any) => value is Definition;
declare function assertDefinition(value: any, name?: string): asserts value is Definition;
interface ModularObject extends InstanceObject {
    id?: string;
}
interface Modular extends Instance {
    definition: ModularDefinition;
    svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters;
    commandFilters(args: CommandFilterArgs): CommandFilters;
}
interface ModularDefinitionObject extends DefinitionObject {
    initializeFilter?: FilterDefinitionObject;
    finalizeFilter?: FilterDefinitionObject;
    filters?: FilterDefinitionObject[];
    properties?: PropertyObject[];
}
interface ModularDefinition extends Definition {
    filters: Filter[];
}
type ModularClass = Constrained<Modular>;
type ModularDefinitionClass = Constrained<ModularDefinition>;
interface Selectable {
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    selectType: SelectType;
}
type Selectables = Selectable[];
type SelectableRecord = {
    [index in SelectType]?: Selectable;
};
interface SelectTypesObject extends Record<string, SelectType[]> {
}
type EffectObject = ModularObject;
interface Effect extends Modular, Selectable {
    definition: EffectDefinition;
    tweenable: Tweenable;
}
declare const isEffect: (value?: any) => value is Effect;
declare function assertEffect(value?: any): asserts value is Effect;
type Effects = Effect[];
type EffectDefinitionObject = ModularDefinitionObject;
interface EffectDefinition extends ModularDefinition {
    instanceFromObject(object?: EffectObject): Effect;
}
declare const isEffectDefinition: (value?: any) => value is EffectDefinition;
/**
 * @category Factory
 */
interface EffectFactory extends GenericFactory<Effect, EffectObject, EffectDefinition, EffectDefinitionObject> {
}
interface Selected {
    selectType: SelectType;
    name?: string;
}
type EffectAddHandler = (effect: Effect, insertIndex?: number) => void;
type EffectMoveHandler = (effect: Effect, index?: number) => void;
type EffectRemovehandler = (effect: Effect) => void;
interface SelectedProperty extends Selected {
    property: Property;
    changeHandler: PropertiedChangeHandler;
    value: Scalar;
}
declare const isSelectedProperty: (value: any) => value is SelectedProperty;
interface SelectedEffects extends Selected {
    value: Effects;
    moveHandler: EffectMoveHandler;
    removeHandler: EffectRemovehandler;
    addHandler: EffectAddHandler;
}
type SelectedItems = Array<SelectedProperty | SelectedEffects>;
type SelectedProperties = Array<SelectedProperty>;
type SelectedPropertyObject = Record<string, SelectedProperty>;
declare const selectedPropertyObject: (properties: SelectedItems, group: DataGroup, selectType: SelectType) => SelectedPropertyObject;
declare const selectedPropertiesScalarObject: (byName: SelectedPropertyObject) => ScalarObject;
declare class Emitter extends EventTarget {
    dispatch(type: EventType, detail?: UnknownObject): void;
    emit(type: EventType, detail?: UnknownObject): void;
    event(type: EventType, detail?: UnknownObject): CustomEvent;
    trap(type: EventType, listener?: EventListener): void;
    private trapped;
}
type FontObject = InstanceObject;
interface Font extends Instance {
    definition: FontDefinition;
    fileUrls(args: GraphFileArgs): GraphFiles;
}
interface FontDefinitionObject extends DefinitionObject {
    source?: string;
    url?: string;
}
interface FontDefinition extends Definition {
    instanceFromObject(object?: FontObject): Font;
    source: string;
    family: string;
    url: string;
    fileUrls(args: GraphFileArgs): GraphFiles;
}
declare const isFontDefinition: (value: any) => value is FontDefinition;
declare function assertFontDefinition(value: any): asserts value is FontDefinition;
/**
 * @category Factory
 */
interface FontFactory extends GenericFactory<Font, FontObject, FontDefinition, FontDefinitionObject> {
}
declare class LoaderClass implements Loader {
    constructor(endpoint?: Endpoint);
    protected absoluteUrl(path: string): string;
    protected browsing: boolean;
    protected cacheGet(graphFile: GraphFile, createIfNeeded?: boolean): LoaderCache | undefined;
    private cacheKey;
    protected cachePromise(key: string, graphFile: GraphFile, cache: LoaderCache): Promise<Loaded>;
    private cacheSet;
    endpoint: Endpoint;
    protected filePromise(file: LoaderFile): Promise<Loaded>;
    flushFilesExcept(fileUrls?: GraphFiles): void;
    getCache(path: LoaderPath): LoaderCache | undefined;
    getError(graphFile: GraphFile): any;
    private getLoaderCache;
    imagePromise(url: string): Promise<LoadedImage>;
    info(loaderPath: LoaderPath): LoadedInfo | undefined;
    key(graphFile: GraphFile): string;
    protected lastCssUrl(string: string): string;
    loadFilesPromise(graphFiles: GraphFiles): Promise<void>;
    protected loadGraphFilePromise(graphFile: GraphFile): Promise<any>;
    loadPromise(urlPath: string, definition?: Definition): Promise<any>;
    loadedFile(graphFile: GraphFile): boolean;
    private loaderCache;
    private loaderFilePromise;
    media(urlPath: LoaderPath): Loaded | undefined;
    parseUrlPath(id: LoaderPath | string): LoaderFiles;
    protected setLoaderCache(path: LoaderPath, cache: LoaderCache): void;
    sourceUrl(graphFile: GraphFile): string;
    private updateDefinitionDuration;
    private updateDefinitionSize;
    protected updateDefinitionFamily(definition: FontDefinition, family: string): void;
    protected updateCache(cache: LoaderCache, loadedInfo: LoadedInfo): void;
    protected updateLoaderFile(file: LoaderFile, info: LoadedInfo): void;
    protected updateDefinitions(graphFile: GraphFile, info: LoadedInfo): void;
    videoPromise(url: string): Promise<LoadedVideo>;
    private videoFromUrl;
}
declare class BrowserLoaderClass extends LoaderClass {
    constructor(endpoint?: Endpoint);
    protected absoluteUrl(path: string): string;
    private arrayBufferPromise;
    private audioBufferPromise;
    private audioInfo;
    private audioPromise;
    private blobAudioPromise;
    private svgImageEmitsLoadEvent;
    private canvas;
    private canvasContext;
    private copyVideoPromise;
    protected filePromise(file: LoaderFile): Promise<Loaded>;
    filePromises(files: File[], size?: Size): Promise<DefinitionOrErrorObject>[];
    protected fontFamily(url: string): string;
    imageInfo(size: Size): LoadedInfo;
    key(graphFile: GraphFile): string;
    private loadLocalFile;
    private mediaInfo;
    private mediaPromise;
    private requestAudio;
    protected requestFont(file: LoaderFile): Promise<LoadedFont>;
    protected requestImage(file: LoaderFile): Promise<LoadedImage>;
    private requestLoadedImage;
    private requestSvgImage;
    private requestVideo;
    private requestVideoAudio;
    private seek;
    private seekNeeded;
    private seekPromise;
    private seekingVideoPromise;
    private seekingVideoPromises;
    private seekingPromises;
    private seekingVideos;
    private sourcePromise;
    private _svgElement?;
    get svgElement(): SVGSVGElement;
    set svgElement(value: SVGSVGElement);
    private svgImagePromise;
    private videoInfo;
}
interface PreviewOptions {
    editor?: Editor;
    time?: Time;
    background?: string;
}
interface PreviewArgs extends PreviewOptions {
    selectedClip?: Clip;
    onlyClip?: Clip;
    size?: Size;
    time: Time;
    mash: Mash;
}
interface Preview extends GraphFileOptions {
    audible: boolean;
    duration: number;
    editing: boolean;
    editor?: Editor;
    preloader: Loader;
    quantize: number;
    selectedClip?: Clip;
    size: Size;
    svgItemsPromise: Promise<SvgItems>;
    previewItemsPromise: Promise<PreviewItems>;
    time: Time;
    visible: boolean;
}
interface EditedDescription extends UnknownObject, Described {
}
interface EditedObject extends Partial<EditedDescription> {
    color?: string;
    buffer?: number;
    quantize?: number;
}
interface EditedArgs extends EditedObject {
    preloader?: Loader;
}
interface Edited extends Described, Propertied, Selectable {
    color: string;
    buffer: number;
    destroy(): void;
    editor: Editor;
    emitter: Emitter;
    editedGraphFiles(args?: GraphFileOptions): GraphFiles;
    imageSize: Size;
    loading: boolean;
    loadPromise(args?: GraphFileOptions): Promise<void>;
    mashes: Mash[];
    readonly preloader: Loader;
    putPromise(): Promise<void>;
    quantize: number;
    reload(): Promise<void> | undefined;
    previewItems(options: PreviewOptions): Promise<PreviewItems>;
}
declare const isEdited: (value: any) => value is Edited;
declare function assertEdited(value: any): asserts value is Edited;
interface TrackObject extends UnknownObject {
    clips?: ClipObject[];
    dense?: boolean;
    index?: number;
}
interface TrackArgs extends TrackObject {
}
interface Track extends Propertied, Selectable, WithIndex {
    addClips(clip: Clips, insertIndex?: number): void;
    assureFrame(clips?: Clips): boolean;
    assureFrames(quantize: number, clips?: Clips): void;
    clips: Clips;
    dense: boolean;
    frameForClipNearFrame(clip: Clip, frame?: number): number;
    frames: number;
    identifier: string;
    mash: Mash;
    removeClips(clip: Clips): void;
    sortClips(clips?: Clips): boolean;
}
declare const isTrack: (value?: any) => value is Track;
declare function assertTrack(value: any, name?: string): asserts value is Track;
type Tracks = Track[];
interface CastObject extends EditedObject {
    layers?: LayerObjects;
}
interface CastArgs extends EditedArgs, CastObject {
}
interface Cast extends Edited {
    addLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void;
    createLayer(layerObject: LayerObject): Layer;
    layers: Layers;
    moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): LayerAndPosition;
    removeLayer(layer: Layer): LayerAndPosition;
    toJSON(): UnknownObject;
}
interface Trigger {
    type: TriggerType;
}
type Triggers = Trigger[];
interface LayerObject {
    type: LayerType;
    label?: string;
    mash?: MashObject;
    layers?: LayerObjects;
    preloader?: Loader;
}
declare const isLayerObject: (value: any) => value is LayerObject;
interface LayerFolderObject extends LayerObject {
    collapsed: boolean;
    layers: LayerObjects;
}
declare const isLayerFolderObject: (value: any) => value is LayerFolderObject;
interface LayerMashObject extends LayerObject {
    mash: MashObject;
}
declare const isLayerMashObject: (value: any) => value is LayerMashObject;
interface LayerArgs {
    label?: string;
}
interface LayerMashArgs extends LayerArgs {
    mash: Mash;
}
interface LayerFolderArgs extends LayerArgs {
    collapsed: boolean;
    layers: Layers;
}
type LayerObjects = LayerObject[];
interface LayerMash extends Layer, LayerMashArgs {
}
interface LayerFolder extends Layer, LayerFolderArgs {
}
interface Layer extends Propertied, LayerArgs, Selectable {
    id: string;
    mashes: Mashes;
    cast: Cast;
    type: LayerType;
    triggers: Triggers;
}
type Layers = Layer[];
interface LayersAndIndex {
    layers: Layers;
    index: number;
}
interface LayerAndPosition {
    layer?: Layer;
    position?: DroppingPosition | number;
}
declare function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T;
declare function ContainerDefinitionMixin<T extends DefinitionClass>(Base: T): ContainerDefinitionClass & T;
interface ShapeContainerObject extends ContainerObject {
}
interface ShapeContainerDefinitionObject extends ContainerDefinitionObject {
    pathWidth?: number;
    pathHeight?: number;
    path?: string;
}
interface ShapeContainer extends Container {
    definition: ShapeContainerDefinition;
}
declare const isShapeContainer: (value: any) => value is ShapeContainer;
interface ShapeContainerDefinition extends ContainerDefinition {
    path: string;
    pathWidth: number;
    pathHeight: number;
    instanceFromObject(object?: ShapeContainerObject): ShapeContainer;
}
/**
 * @category Factory
 */
interface ShapeContainerFactory extends GenericFactory<ShapeContainer, ShapeContainerObject, ShapeContainerDefinition, ShapeContainerDefinitionObject> {
}
declare class InstanceBase extends PropertiedClass implements Instance {
    constructor(...args: any[]);
    copy(): Instance;
    definition: Definition;
    get definitionId(): string;
    definitionIds(): string[];
    protected _id?: string;
    get id(): string;
    protected _label: string;
    get label(): string;
    //|| this.definition.label || this.id
    set label(value: string);
    get propertyNames(): string[];
    toJSON(): UnknownObject;
    get type(): DefinitionType;
}
interface Tweening {
    point?: boolean;
    size?: boolean;
    color?: boolean;
    canColor?: boolean;
}
declare const tweenPad: (outputDistance: number, scaledDistance: number, scale: number, offE?: boolean, offW?: boolean) => number;
declare const tweenNumberStep: (number: number, numberEnd: number, frame: number, frames: number) => number;
declare const tweenColorStep: (value: PopulatedString, valueEnd: PopulatedString, frame: number, frames: number) => string;
declare const tweenColors: (color: Scalar, colorEnd: Scalar, frames: number) => string[];
declare const tweenRects: (rect: Rect, rectEnd: Rect | undefined, frames: number) => Rect[];
declare const tweenMaxSize: (size: Size, sizeEnd?: any) => Size;
declare const tweenMinSize: (size: Size, sizeEnd?: any) => Size;
declare const tweenOption: (optionStart: Scalar, optionEnd: Scalar, pos: string, round?: boolean | undefined) => Value;
declare const tweenableRects: (rect: Rect, rectEnd?: Rect | undefined) => rectEnd is Rect;
declare const tweenPosition: (videoRate: number, duration: number, frame?: string) => string;
declare const tweenNumberObject: (object: any) => NumberObject;
declare const tweenOverRect: (rect: Rect, rectEnd?: any) => Rect;
declare const tweenOverPoint: (point: Point, pointEnd: any) => Point;
declare const tweenOverSize: (point: Size, pointEnd: any) => Size;
declare const tweenScaleSizeToRect: (size: Size | any, rect: Rect | any, offDirections?: DirectionObject) => Rect;
declare const tweenCoverSizes: (inSize: Size, outSize: Size | SizeTuple, scales: SizeTuple) => SizeTuple;
declare const tweenCoverPoints: (scaledSizes: SizeTuple, outSize: Size | SizeTuple, scales: PointTuple) => PointTuple;
declare const tweenRectLock: (rect: Rect, lock?: Orientation | undefined) => Rect;
declare const tweenRectsLock: (rects: RectTuple, lock?: Orientation | undefined) => RectTuple;
declare const tweenScaleSizeRatioLock: (scale: Rect, outputSize: Size, inRatio: number, lock?: string | undefined) => Rect;
declare const tweeningPoints: (tweenable?: Tweenable | undefined) => boolean;
declare const tweenMinMax: (value: number, min: number, max: number) => number;
declare const tweenInputTime: (timeRange: TimeRange, onEdge?: boolean | undefined, nearStart?: boolean | undefined, endDefined?: boolean | undefined, endSelected?: boolean | undefined) => Time | undefined;
declare const ShapeContainerWithContainer: ContainerClass & TweenableClass & typeof InstanceBase;
declare class ShapeContainerClass extends ShapeContainerWithContainer implements ShapeContainer {
    constructor(...args: any[]);
    canColor(args: CommandFilterArgs): boolean;
    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    definition: ShapeContainerDefinition;
    hasIntrinsicSizing: boolean;
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
    intrinsicRect(editing?: boolean): Rect;
    isTweeningColor(args: CommandFileArgs): boolean;
    isTweeningSize(args: CommandFileArgs): boolean;
    pathElement(rect: Rect, forecolor?: string): SvgItem;
    requiresAlpha(args: CommandFileArgs, tweeningSize?: boolean): boolean;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare class DefinitionBase implements Definition {
    constructor(...args: any[]);
    icon?: string;
    id: string;
    definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: InstanceObject): Instance;
    instanceArgs(object?: InstanceObject): InstanceObject;
    label: string;
    properties: Property[];
    get propertiesModular(): Property[];
    toJSON(): UnknownObject;
    toString(): string;
    type: DefinitionType;
    protected urlIcon(url: string, loader: Loader, size: Size): Promise<SVGSVGElement> | undefined;
    static fromObject(object: DefinitionObject): Definition;
}
declare const ShapeContainerDefinitionWithContainer: ContainerDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
    constructor(...args: any[]);
    definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: ShapeContainerObject): ShapeContainer;
    path: string;
    pathHeight: number;
    pathWidth: number;
    toJSON(): UnknownObject;
}
interface TextContainerObject extends ContainerObject {
    fontId?: string;
    string?: string;
    intrinsic?: Rect;
}
interface TextContainerDefinitionObject extends ContainerDefinitionObject {
}
interface TextContainer extends Container {
    definition: TextContainerDefinition;
    // font: FontDefinition
    fontId: string;
    string: string;
}
declare const isTextContainer: (value: any) => value is TextContainer;
declare function assertTextContainer(value: any): asserts value is TextContainer;
interface TextContainerDefinition extends ContainerDefinition {
    instanceFromObject(object?: TextContainerObject): TextContainer;
}
/**
 * @category Factory
 */
interface TextContainerFactory extends GenericFactory<TextContainer, TextContainerObject, TextContainerDefinition, TextContainerDefinitionObject> {
}
declare const TextContainerWithContainer: ContainerClass & TweenableClass & typeof InstanceBase;
declare class TextContainerClass extends TextContainerWithContainer implements TextContainer {
    constructor(...args: any[]);
    canColor(args: CommandFilterArgs): boolean;
    canColorTween(args: CommandFilterArgs): boolean;
    private _colorFilter?;
    get colorFilter(): Filter;
    definition: TextContainerDefinition;
    definitionIds(): string[];
    _font?: FontDefinition;
    get font(): FontDefinition;
    fontId: string;
    fileUrls(args: GraphFileArgs): GraphFiles;
    hasIntrinsicSizing: boolean;
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    protected _intrinsicRect?: Rect;
    intrinsicRect(_?: boolean): Rect;
    private intrinsicRectInitialize;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    pathElement(rect: Rect): SvgItem;
    setValue(value: Scalar, name: string, property?: Property): void;
    string: string;
    private _textFilter?;
    get textFilter(): Filter;
    toJSON(): UnknownObject;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare const TextContainerDefinitionWithContainer: ContainerDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class TextContainerDefinitionClass extends TextContainerDefinitionWithContainer implements TextContainerDefinition {
    constructor(...args: any[]);
    definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined;
    instanceArgs(object?: TextContainerObject): TextContainerObject;
    instanceFromObject(object?: TextContainerObject): TextContainer;
}
declare const containerDefaults: (ShapeContainerDefinitionClass | TextContainerDefinitionClass)[];
declare const containerDefinition: (object: ContainerDefinitionObject) => ContainerDefinition;
declare const containerDefinitionFromId: (id: string) => ContainerDefinition;
declare const containerInstance: (object: ContainerObject) => Container;
declare const containerFromId: (id: string) => Container;
declare const DefaultContentId: string;
interface ContentObject extends TweenableObject {
    effects?: EffectObject[];
}
interface ContentDefinitionObject extends TweenableDefinitionObject {
}
interface ContentRectArgs {
    containerRects: Rect | RectTuple;
    editing?: boolean;
    loading?: boolean;
    time: Time;
    timeRange: TimeRange;
}
interface Content extends Tweenable {
    audibleCommandFiles(args: CommandFileArgs): CommandFiles;
    audibleCommandFilters(args: CommandFilterArgs): CommandFilters;
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>;
    // contentRect(containerRect: Rect, time: Time, timeRange: TimeRange): Rect
    contentRects(args: ContentRectArgs): RectTuple;
    contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined;
    effectsCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    effects: Effects;
    itemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>;
}
declare const isContent: (value?: any) => value is Content;
declare function assertContent(value?: any, name?: string): asserts value is Content;
interface ContentDefinition extends TweenableDefinition {
}
declare const isContentDefinition: (value?: any) => value is ContentDefinition;
type ContentClass = Constrained<Content>;
type ContentDefinitionClass = Constrained<ContentDefinition>;
/**
 * @category Factory
 */
interface ContentFactory extends GenericFactory<Content, ContentObject, ContentDefinition, ContentDefinitionObject> {
}
type EditorSelectionObject = {
    [index in SelectType]?: Selectable;
};
interface EditorSelection extends EditorSelectionObject {
    clear(): void;
    editor: Editor;
    focus: SelectType;
    get(selectType: SelectType): Selectable | undefined;
    object: EditorSelectionObject;
    selectedItems(selectTypes?: SelectType[]): SelectedItems;
    selectTypes: SelectType[];
    set(selectable: Selectable): void;
    unset(selectionType: SelectType): void;
    [SelectType.Cast]: Cast | undefined;
    [SelectType.Clip]: Clip | undefined;
    [SelectType.Layer]: Layer | undefined;
    [SelectType.Mash]: Mash | undefined;
    [SelectType.Track]: Track | undefined;
    [SelectType.Content]: Content | undefined;
    [SelectType.Container]: Container | undefined;
    [SelectType.Effect]: Effect | undefined;
}
declare class EditorSelectionClass implements EditorSelection {
    get [SelectType.None](): Selectable | undefined;
    get [SelectType.Cast](): Cast | undefined;
    get [SelectType.Clip](): Clip | undefined;
    get [SelectType.Layer](): Layer | undefined;
    get [SelectType.Mash](): Mash | undefined;
    get [SelectType.Track](): Track | undefined;
    get [SelectType.Container](): Container | undefined;
    get [SelectType.Content](): Content | undefined;
    get [SelectType.Effect](): Effect | undefined;
    private _editor?;
    get editor(): Editor;
    set editor(value: Editor);
    _focus: SelectType;
    get focus(): SelectType;
    set focus(value: SelectType);
    get(selectType: SelectType): Selectable | undefined;
    unset(selectType: SelectType): void;
    set(selectable: Selectable): void;
    _object: EditorSelectionObject;
    get object(): EditorSelectionObject;
    set object(selection: EditorSelectionObject);
    clear(): void;
    private selectionFromSelectables;
    private selectionPopulated;
    get selectTypes(): SelectType[];
    selectedItems(types?: SelectType[]): SelectedItems;
}
declare const editorSelectionInstance: () => EditorSelection;
interface ActionOptions extends UnknownObject {
    redoSelection: EditorSelectionObject;
    type: ActionType;
    undoSelection: EditorSelectionObject;
}
type ActionObject = Partial<ActionOptions>;
type ActionMethod = (object: ActionObject) => void;
declare class Action {
    constructor(object: ActionOptions);
    protected get cast(): Cast;
    done: boolean;
    protected get mash(): Mash;
    redo(): void;
    protected redoAction(): void;
    protected redoSelection: EditorSelectionObject;
    get selection(): EditorSelectionObject;
    type: string;
    undo(): void;
    protected undoAction(): void;
    protected undoSelection: EditorSelectionObject;
}
declare const isAction: (value: any) => value is Action;
declare function assertAction(value: any): asserts value is Action;
interface ActionInit {
    action: Action;
}
declare const isActionInit: (value: any) => value is ActionInit;
interface ActionEvent extends CustomEvent<ActionInit> {
}
declare const isActionEvent: (value: any) => value is ActionEvent;
// extends Partial<NumberObject>
interface EditorIndex {
    layer?: number;
    clip?: number;
    track?: number;
    effect?: number;
}
interface EditorArgs {
    autoplay: boolean;
    buffer: number;
    editType?: EditType;
    endpoint?: Endpoint;
    edited?: EditedData;
    fps: number;
    loop: boolean;
    precision: number;
    preloader?: BrowserLoaderClass;
    readOnly?: boolean;
    dimensions?: Rect | Size | undefined;
    volume: number;
}
interface EditorOptions extends Partial<EditorArgs> {
}
type ClipOrEffect = Clip | Effect;
interface CastData extends Partial<DataCastGetResponse> {
}
interface MashData extends Partial<DataMashGetResponse> {
}
type EditedData = CastData | MashData;
declare const isCastData: (data: EditedData) => data is CastData;
declare const isMashData: (data: EditedData) => data is CastData;
declare function assertMashData(data: EditedData, name?: string): asserts data is MashData;
interface Editor {
    actions: Actions;
    add(object: DefinitionObject | DefinitionObjects, editorIndex?: EditorIndex): Promise<Definition[]>;
    addFiles(files: File[], editorIndex?: EditorIndex): Promise<Definition[]>;
    addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>;
    addEffect: EffectAddHandler;
    addFolder(label?: string, layerAndPosition?: LayerAndPosition): void;
    addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void;
    addTrack(): void;
    autoplay: boolean;
    buffer: number;
    can(action: MasherAction): boolean;
    clips: Clips;
    create(): void;
    currentTime: number;
    dataPutRequest(): Promise<DataPutRequest>;
    dragging: boolean;
    definitions: Definition[];
    definitionsUnsaved: Definition[];
    duration: number;
    readonly edited?: Edited;
    editing: boolean;
    editType: EditType;
    eventTarget: Emitter;
    fps: number;
    goToTime(value: Time): Promise<void>;
    handleAction(action: Action): void;
    rect: Rect;
    load(data: EditedData): Promise<void>;
    loop: boolean;
    move(object: ClipOrEffect, editorIndex?: EditorIndex): void;
    moveClip(clip: Clip, editorIndex?: EditorIndex): void;
    moveEffect: EffectMoveHandler;
    moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void;
    muted: boolean;
    pause(): void;
    paused: boolean;
    play(): void;
    position: number;
    positionStep: number;
    precision: number;
    preloader: BrowserLoaderClass;
    readOnly: boolean;
    redo(): void;
    redraw(): void;
    removeClip(clip: Clip): void;
    removeEffect: EffectRemovehandler;
    removeLayer(layer: Layer): void;
    removeTrack(track: Track): void;
    saved(temporaryIdLookup?: StringObject): void;
    readonly selection: EditorSelection;
    svgElement: SVGSVGElement;
    previewItems(enabled?: boolean): Promise<PreviewItems>;
    time: Time;
    timeRange: TimeRange;
    undo(): void;
    updateDefinition(definitionObject: DefinitionObject, definition?: Definition): Promise<void>;
    volume: number;
}
declare class Actions {
    editor: Editor;
    constructor(editor: Editor);
    add(action: Action): void;
    get canRedo(): boolean;
    get canSave(): boolean;
    get canUndo(): boolean;
    create(object: ActionObject): void;
    get currentAction(): Action | undefined;
    get currentActionLast(): boolean;
    destroy(): void;
    index: number;
    instances: Action[];
    redo(): Action;
    private reusableChangeAction;
    save(): void;
    get selection(): EditorSelectionObject;
    undo(): Action;
}
interface TweenableObject extends InstanceObject {
    container?: boolean;
    x?: number;
    xEnd?: number;
    y?: number;
    yEnd?: number;
    lock?: string;
}
interface TweenableDefinitionObject extends DefinitionObject {
}
interface Tweenable extends Instance, Selectable {
    alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters;
    amixCommandFilters(args: CommandFilterArgs): CommandFilters;
    canColor(args: CommandFilterArgs): boolean;
    canColorTween(args: CommandFilterArgs): boolean;
    clip: Clip;
    clipped: boolean;
    colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters;
    colorFilter: Filter;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
    commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
    container: boolean;
    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter;
    cropFilter: Filter;
    definitionTime(masherTime: Time, clipRange: TimeRange): Time;
    frames(quantize: number): number;
    fileCommandFiles(graphFileArgs: GraphFileArgs): CommandFiles;
    fileUrls(args: GraphFileArgs): GraphFiles;
    hasIntrinsicSizing: boolean;
    hasIntrinsicTiming: boolean;
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
    intrinsicRect(editing?: boolean): Rect;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    intrinsicGraphFile(options: IntrinsicOptions): GraphFile;
    isDefault: boolean;
    lock: Orientation;
    mutable(): boolean;
    muted: boolean;
    overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters;
    overlayFilter: Filter;
    scaleCommandFilters(args: CommandFilterArgs): CommandFilters;
    selectedProperties(actions: Actions, property: Property): SelectedProperties;
    selectedProperty(property: Property): boolean;
    tween(keyPrefix: string, time: Time, range: TimeRange): Scalar;
    tweenPoints(time: Time, range: TimeRange): PointTuple;
    tweenRects(time: Time, range: TimeRange): RectTuple;
    tweenSizes(time: Time, range: TimeRange): SizeTuple;
    tweenValues(key: string, time: Time, range: TimeRange): Scalar[];
}
declare const isTweenable: (value?: any) => value is Tweenable;
declare function assertTweenable(value?: any): asserts value is Tweenable;
interface TweenableDefinition extends Definition {
}
declare const isTweenableDefinition: (value?: any) => value is TweenableDefinition;
declare function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition;
type TweenableClass = Constrained<Tweenable>;
type TweenableDefinitionClass = Constrained<TweenableDefinition>;
declare const DefaultContainerId: string;
declare const TextContainerId: string;
interface ContainerObject extends TweenableObject {
    height?: number;
    heightEnd?: number;
    offN?: boolean;
    offS?: boolean;
    offE?: boolean;
    offW?: boolean;
    opacity?: number;
    opacityEnd?: number;
    width?: number;
    widthEnd?: number;
}
declare const isContainerObject: (value: any) => value is ContainerObject;
declare function assertContainerObject(value: any): asserts value is ContainerObject;
interface ContainerDefinitionObject extends TweenableDefinitionObject {
}
interface ContainerDefinition extends TweenableDefinition {
}
declare const isContainerDefinition: (value?: any) => value is ContainerDefinition;
interface ContainerRectArgs {
    size: Size;
    time: Time;
    timeRange: TimeRange;
    loading?: boolean;
    editing?: boolean;
}
interface Container extends Tweenable {
    colorizeCommandFilters(args: CommandFilterArgs): CommandFilters;
    colorMaximize: boolean;
    containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple;
    containerSvgFilter(svgItem: SvgItem, previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SVGFilterElement | undefined;
    containerPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>;
    directionObject: DirectionObject;
    directions: Anchor[];
    height: number;
    offE: boolean;
    offN: boolean;
    offS: boolean;
    offW: boolean;
    opacity: number;
    opacityCommandFilters(args: CommandFilterArgs): CommandFilters;
    opacityEnd?: number;
    pathElement(rect: Rect): SvgItem;
    containedContent(content: Content, containerRect: Rect, previewSize: Size, time: Time, range: TimeRange, icon?: boolean): Promise<PreviewItems>;
    translateCommandFilters(args: CommandFilterArgs): CommandFilters;
    width: number;
    x: number;
    y: number;
}
declare const isContainer: (value?: any) => value is Container;
declare function assertContainer(value?: any): asserts value is Container;
type ContainerClass = Constrained<Container>;
type ContainerDefinitionClass = Constrained<ContainerDefinition>;
/**
 * @category Factory
 */
interface ContainerFactory extends GenericFactory<Container, ContainerObject, ContainerDefinition, ContainerDefinitionObject> {
}
interface ClipObject extends InstanceObject {
    containerId?: string;
    contentId?: string;
    content?: ContentObject;
    container?: ContainerObject;
    frame?: number;
    timing?: string;
    sizing?: string;
    frames?: number;
}
declare const isClipObject: (value: any) => value is ClipObject;
interface IntrinsicOptions {
    editing?: boolean;
    size?: boolean;
    duration?: boolean;
}
interface ClipDefinitionObject extends DefinitionObject {
}
interface Clip extends Instance, Selectable {
    audible: boolean;
    clipFileUrls(args: GraphFileArgs): GraphFiles;
    clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined;
    clipCommandFiles(args: CommandFileArgs): CommandFiles;
    commandFilters(args: CommandFilterArgs): CommandFilters;
    container?: Container;
    containerId: string;
    content: Content;
    contentId: string;
    definition: ClipDefinition;
    endFrame: number;
    frame: number;
    frames: number;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles;
    maxFrames(quantize: number, trim?: number): number;
    mutable: boolean;
    muted: boolean;
    notMuted: boolean;
    rects(args: ContainerRectArgs): RectTuple;
    resetTiming(tweenable?: Tweenable, quantize?: number): void;
    sizing: Sizing;
    previewItemsPromise(size: Size, time?: Time, icon?: boolean): Promise<PreviewItems>;
    time(quantize: number): Time;
    timeRange(quantize: number): TimeRange;
    timeRangeRelative(mashTime: TimeRange, quantize: number): TimeRange;
    timing: Timing;
    track: Track;
    trackNumber: number;
    visible: boolean;
}
declare const isClip: (value: any) => value is Clip;
declare function assertClip(value: any, name?: string): asserts value is Clip;
type Clips = Clip[];
interface ClipDefinition extends Definition {
    instanceFromObject(object?: ClipObject): Clip;
    audible: boolean;
    // duration: number
    streamable: boolean;
    visible: boolean;
}
/**
 * @category Factory
 */
interface ClipFactory extends GenericFactory<Clip, ClipObject, ClipDefinition, ClipDefinitionObject> {
}
interface AudioPreviewArgs {
    buffer?: number;
    gain?: number;
    preloader: Loader;
}
declare class AudioPreview {
    constructor(object: AudioPreviewArgs);
    adjustClipGain(clip: Clip, quantize: number): void;
    private adjustSourceGain;
    buffer: number;
    bufferClips(clips: Clip[], quantize: number): boolean;
    private bufferSource?;
    clear(): void;
    private clipSources;
    private createSources;
    private destroySources;
    gain: number;
    setGain(value: number, quantize: number): void;
    private playing;
    private playingClips;
    preloader: Loader;
    get seconds(): number;
    startContext(): void;
    // called when playhead starts moving
    startPlaying(time: Time, clips: Clip[], quantize: number): boolean;
    // position of masher (in seconds) when startPlaying called
    private startedMashAt;
    // currentTime of context (in seconds) was created when startPlaying called
    private contextSecondsWhenStarted;
    stopContext(): void;
    stopPlaying(): void;
}
interface FilterGraphArgs {
    visible?: boolean;
    background: string;
    mash: Mash;
    size: Size;
    streaming?: boolean;
    time: Time;
    videoRate: number;
    upload?: boolean;
}
interface FilterGraph {
    background: string;
    filterGraphCommandFiles: CommandFiles;
    commandFilters: CommandFilters;
    commandInputs: CommandInputs;
    duration: number;
    preloader: Loader;
    quantize: number;
    size: Size;
    streaming: boolean;
    time: Time;
    videoRate: number;
    visible: boolean;
}
interface FilterGraphs {
    duration?: number;
    filterGraphAudible?: FilterGraph;
    filterGraphVisible: FilterGraph;
    filterGraphsVisible: FilterGraph[];
    fileUrls: GraphFiles;
    loadPromise: Promise<void>;
}
interface FilterGraphsOptions {
    avType?: AVType;
    graphType?: GraphType;
    size?: Size;
    time?: Time;
    videoRate?: number;
    background?: string;
    upload?: boolean;
}
interface FilterGraphsArgs {
    mash: Mash;
    times: Times;
    avType: AVType;
    graphType: GraphType;
    size: Size;
    videoRate: number;
    background: string;
    upload?: boolean;
}
interface DefinitionReferenceObject {
    definitionId: string;
    definitionType: DefinitionType;
    label: string;
}
interface MashDescription extends UnknownObject, Described {
}
interface MashObject extends EditedObject {
    definitionReferences?: DefinitionReferenceObjects;
    gain?: Value;
    tracks?: TrackObject[];
    frame?: number;
    rendering?: string;
}
type DefinitionReferenceObjects = DefinitionReferenceObject[];
interface MashAndDefinitionsObject {
    mashObject: MashObject;
    definitionObjects: DefinitionObjects;
}
declare const isMashAndDefinitionsObject: (value: any) => value is MashAndDefinitionsObject;
interface MashArgs extends EditedArgs, MashObject {
}
interface Mash extends Edited {
    /** this.time -> this.endTime in time's fps */
    addClipToTrack(clip: Clip | Clips, trackIndex?: number, insertIndex?: number, frame?: number): void;
    addTrack(object?: TrackObject): Track;
    changeTiming(propertied: Propertied, property: string, value: number): void;
    clearPreview(): void;
    clips: Clip[];
    clipsInTimeOfType(time: Time, avType?: AVType): Clip[];
    composition: AudioPreview;
    definitionIds: string[];
    draw(): void;
    drawnTime?: Time;
    duration: number;
    endTime: Time;
    filterGraphs(args?: FilterGraphsOptions): FilterGraphs;
    frame: number;
    frames: number;
    gain: number;
    layer: LayerMash;
    loop: boolean;
    paused: boolean;
    preloader: Loader;
    quantize: number;
    removeClipFromTrack(clip: Clip | Clips): void;
    removeTrack(index?: number): void;
    rendering: string;
    seekToTime(time: Time): Promise<void> | undefined;
    time: Time;
    timeRange: TimeRange;
    toJSON(): UnknownObject;
    tracks: Track[];
}
type Mashes = Mash[];
declare const isMash: (value: any) => value is Mash;
declare function assertMash(value: any, name?: string): asserts value is Mash;
type Streams = Stream[];
interface StreamObject {
    size?: Size;
}
interface Stream {
    size: Size;
}
interface DataPutResponse extends ApiResponse {
    temporaryIdLookup?: StringObject;
}
interface DataGetRequest extends ApiRequest, AndId {
}
interface DataPutRequest extends ApiRequest {
}
interface DataRetrieveResponse extends ApiResponse {
    described: DescribedObject[];
}
interface DataServerInit extends JsonObject {
    temporaryIdPrefix: string;
}
interface DataRetrieve {
    partial?: boolean;
}
interface DataDefinitionPutRequest extends ApiRequest {
    definition: DefinitionObject;
}
interface DataDefinitionPutResponse extends ApiResponse, AndId {
}
interface DataDefinitionRetrieveRequest extends ApiRequest, DataRetrieve {
    types: string[];
}
interface DataDefinitionRetrieveResponse extends ApiResponse {
    definitions: DefinitionObjects;
}
interface DataDefinitionDeleteRequest extends ApiRequest, AndId {
}
interface DataDefinitionDeleteResponse extends ApiResponse {
    /**
     * If error is defined, a list of mash ids that reference the definition.
     */
    mashIds?: string[];
}
// MASH
interface DataMashPutRequest extends DataPutRequest {
    definitionIds?: string[];
    mash: MashObject;
}
interface DataMashPutResponse extends DataPutResponse {
}
interface DataMashDefinitions {
    mash: MashObject;
    definitions: DefinitionObjects;
}
interface DataMashRetrieveRequest extends ApiRequest, DataRetrieve {
}
interface DataMashGetResponse extends ApiResponse, DataMashDefinitions {
}
interface DataMashDefaultRequest extends ApiRequest {
}
interface DataMashDefaultResponse extends ApiResponse, DataMashDefinitions {
    previewSize?: Size;
}
interface DataMashDeleteRequest extends ApiRequest, AndId {
}
interface DataMashDeleteResponse extends ApiResponse {
    /**
     * If error is defined, a list of cast ids that reference the mash.
     */
    castIds?: string[];
}
// CAST
interface DataCastDefinitions {
    definitions: DefinitionObjects;
}
interface DataCastRelations {
    cast: CastObject;
    definitions: DefinitionObjects;
}
interface DataCastDefaultRequest extends ApiRequest {
}
type DataDefaultRequest = DataMashDefaultRequest | DataCastDefaultRequest;
interface DataCastDefaultResponse extends ApiResponse, DataCastRelations {
    previewSize?: Size;
}
type DataDefaultResponse = DataMashDefaultResponse | DataCastDefaultResponse;
interface DataCastPutRequest extends DataPutRequest {
    cast: CastObject;
    definitionIds: StringsObject;
}
interface DataCastPutResponse extends DataPutResponse {
}
interface DataCastDeleteRequest extends ApiRequest, AndId {
}
interface DataCastDeleteResponse extends ApiResponse {
}
interface DataCastGetRequest extends DataGetRequest {
}
interface DataMashGetRequest extends DataGetRequest {
}
interface DataStreamGetRequest extends DataGetRequest {
}
interface DataCastGetResponse extends DataCastDefaultResponse {
    previewSize?: Size;
}
interface DataDefinitionGetRequest extends ApiRequest, AndId {
}
interface DataDefinitionGetResponse extends ApiResponse {
    definition: DefinitionObject;
}
interface DataCastRetrieveRequest extends ApiRequest, DataRetrieve {
}
interface DataMashRetrieveResponse extends DataRetrieveResponse {
}
interface DataCastRetrieveResponse extends DataRetrieveResponse {
}
interface DataStreamRetrieveResponse extends DataRetrieveResponse {
}
// STREAM
interface DataStreamDefinitions {
    stream: StreamObject;
    definitions: DefinitionObjects;
}
interface DataStreamPutRequest extends ApiRequest {
    stream: StreamObject;
}
interface DataStreamPutResponse extends ApiResponse, AndId {
}
interface DataStreamGetResponse extends ApiResponse, DataStreamDefinitions {
}
interface DataStreamRetrieveRequest extends ApiRequest, DataRetrieve {
}
interface DataStreamDeleteRequest extends ApiRequest, AndId {
}
interface DataStreamDeleteResponse extends ApiResponse {
}
declare const ApiVersion = "5.1.1";
interface ApiRequest {
    [index: string]: any;
    version?: string;
}
interface ApiResponse extends WithError {
}
interface ApiRequestInit {
    // extends RequestInit
    body?: any;
    headers?: StringObject;
    method?: string;
}
interface EndpointPromiser {
    (id: string, body?: JsonObject): Promise<any>;
}
interface ApiCallback {
    endpoint: Endpoint;
    request?: ApiRequestInit;
    expires?: string;
}
interface ApiCallbacks extends Record<string, ApiCallback> {
}
interface ApiServerInit extends JsonObject {
}
interface ApiCallbacksRequest extends ApiRequest, AndId {
}
interface ApiCallbacksResponse extends ApiResponse {
    apiCallbacks: ApiCallbacks;
}
interface ApiCallbackResponse extends ApiResponse {
    apiCallback?: ApiCallback;
}
interface ApiServersRequest extends ApiRequest {
}
interface ApiServersResponse extends ApiResponse {
    [ServerType.Api]?: ApiServerInit;
    [ServerType.Data]?: DataServerInit;
    [ServerType.File]?: JsonObject;
    [ServerType.Rendering]?: JsonObject;
    [ServerType.Streaming]?: JsonObject;
    [ServerType.Web]?: JsonObject;
}
declare const Endpoints: {
    api: StringObject;
    data: Record<string, StringObject>;
    file: StringObject;
    rendering: StringObject;
    streaming: StringObject;
};
interface FileStoreRequest extends ApiRequest {
    id?: string;
}
interface FileStoreResponse extends ApiResponse {
}
interface StreamingStartRequest extends ApiRequest {
    format?: StreamingFormat;
    width?: number;
    height?: number;
    videoRate?: number;
}
interface StreamingStartResponse extends ApiResponse, AndId {
    readySeconds: number;
    width: number;
    height: number;
    videoRate: number;
    format: StreamingFormat;
}
interface StreamingStatusRequest extends ApiRequest, AndId {
}
interface StreamingStatusResponse extends ApiRequest {
    streamUrl?: string;
}
interface StreamingPreloadRequest extends ApiRequest, AndId {
    files: GraphFiles;
}
interface StreamingPreloadResponse extends ApiResponse {
}
interface StreamingCutRequest extends ApiRequest {
    mashObjects: MashObject[];
    definitionObjects: DefinitionObjects;
}
interface StreamingCutResponse extends ApiResponse {
}
interface StreamingSaveRequest extends ApiRequest {
}
interface StreamingSaveResponse extends ApiResponse {
}
interface StreamingDeleteRequest extends ApiRequest, AndId {
}
interface StreamingDeleteResponse extends ApiResponse {
}
interface StreamingListRequest extends ApiRequest {
}
interface StreamingListResponse extends ApiResponse {
}
interface StreamingWebrtcRequest extends ApiRequest {
}
interface StreamingWebrtcResponse extends ApiResponse, AndId {
    localDescription: RTCSessionDescription;
}
interface StreamingRtmpRequest extends ApiRequest {
}
interface StreamingRtmpResponse extends ApiResponse {
}
interface StreamingRemoteRequest extends ApiRequest, AndId {
    localDescription: RTCSessionDescription;
}
interface StreamingRemoteResponse extends ApiResponse {
    localDescription: RTCSessionDescription;
}
interface StreamingLocalRequest extends ApiRequest, AndId {
    localDescription: RTCSessionDescription;
}
interface StreamingLocalResponse extends ApiResponse {
    localDescription: RTCSessionDescription;
}
interface StreamingDescription extends CommandDescription {
    commandOutput: CommandOutput;
}
interface CommandOutput extends UnknownObject, Partial<Size> {
    audioBitrate?: Value;
    audioChannels?: number;
    audioCodec?: string;
    audioRate?: number;
    extension?: string;
    format?: OutputFormat;
    options?: ValueObject;
    videoBitrate?: Value;
    videoCodec?: string;
    videoRate?: number;
}
interface RenderingCommandOutput extends CommandOutput {
    outputType: OutputType;
    basename?: string;
    optional?: boolean;
    cover?: boolean;
}
type CommandOutputs = RenderingCommandOutput[];
interface StreamingCommandOutput extends Required<CommandOutput> {
    // always singular
    streamingFormat: StreamingFormat;
}
interface OutputConstructorArgs {
    cacheDirectory: string;
}
interface StreamingOutputArgs extends OutputConstructorArgs {
    commandOutput: StreamingCommandOutput;
    mashes: Mashes;
}
interface RenderingOutputArgs extends OutputConstructorArgs {
    commandOutput: RenderingCommandOutput;
    mash: Mash;
    startTime?: Time;
    endTime?: Time;
    upload?: boolean;
}
interface RenderingOutput {
    renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription>;
    /** seconds between startTime and endTime, but zero for image outputs */
    duration: number;
    outputType: OutputType;
    avType: AVType;
    /** supplied time, or mash.time */
    startTime: Time;
    /** supplied time or mash.endTime, but undefined for image outputs  */
    endTime?: Time;
}
interface StreamingOutput {
    streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription>;
}
interface ImageOutputArgs extends RenderingOutputArgs {
    offset?: number;
    cover?: boolean;
}
interface ImageOutput extends RenderingOutput {
}
interface AudioOutputArgs extends RenderingOutputArgs {
    optional?: boolean;
}
interface AudioOutput extends RenderingOutput {
}
interface WaveformOutputArgs extends RenderingOutputArgs {
    backcolor?: string;
    forecolor?: string;
}
interface WaveformOutput extends RenderingOutput {
}
interface VideoOutputArgs extends RenderingOutputArgs {
    cover?: boolean;
    mute?: boolean;
}
interface VideoOutput extends RenderingOutput {
}
interface ImageSequenceOutputArgs extends RenderingOutputArgs {
    cover?: boolean;
}
interface ImageSequenceOutput extends RenderingOutput {
}
interface VideoStreamOutputArgs extends StreamingOutputArgs {
}
interface VideoStreamOutput extends StreamingOutput {
}
interface CommandInput {
    source: string;
    options?: ValueObject;
}
type CommandInputs = CommandInput[];
interface CommandOptions extends CommandDescription {
    output: CommandOutput;
}
interface CommandDescription {
    duration?: number;
    inputs?: CommandInputs;
    commandFilters?: CommandFilters;
    avType: AVType;
}
interface RenderingResult {
    error?: string;
    warning?: string;
    outputType: OutputType;
    destination?: string;
}
interface RenderingDescription {
    audibleCommandDescription?: CommandDescription;
    visibleCommandDescriptions?: CommandDescriptions;
    commandOutput: RenderingCommandOutput;
}
type CommandDescriptions = CommandDescription[];
interface RenderingState {
    total: number;
    completed: number;
}
type RenderingStatus = {
    [index in OutputType]?: RenderingState;
};
interface RenderingInput {
    definitions?: DefinitionObjects;
    mash: MashObject;
}
interface RenderingOptions extends RenderingInput {
    upload?: boolean;
    outputs: CommandOutputs;
}
/**
 * Start rendering a mash object
 * @swagger rendering/start
 */
interface RenderingStartRequest extends ApiRequest, RenderingOptions {
}
interface RenderingStartResponse extends ApiCallbackResponse {
}
interface RenderingStatusRequest extends ApiRequest, AndId {
    renderingId: string;
}
interface RenderingStatusResponse extends ApiCallbackResponse, RenderingStatus {
}
interface RenderingUploadRequest extends ApiRequest, UploadDescription {
}
interface RenderingUploadResponse extends ApiCallbackResponse {
    id?: string;
    fileProperty?: string;
    loadType?: LoadType;
    fileApiCallback?: ApiCallback;
}
declare class Defined {
    static byId: Map<string, Definition>;
    private static byIdAdd;
    static byType(type: DefinitionType): Definition[];
    static define(...objects: DefinitionObjects): Definition[];
    private static definitionDelete;
    private static definitionsByType;
    private static definitionsType;
    static fromId(id: string): Definition;
    static fromObject(object: DefinitionObject): Definition;
    static get ids(): string[];
    static install(definition: Definition): Definition;
    static installed(id: string): boolean;
    static predefined(id: string): boolean;
    static undefineAll(): void;
    static updateDefinition(oldDefinition: Definition, newDefinition: Definition): Definition;
    static updateDefinitionId(oldId: string, newId: string): void;
    static uninstall(definition: Definition): Definition;
}
declare function ContentDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContentDefinitionClass & T;
declare function ContentMixin<T extends TweenableClass>(Base: T): ContentClass & T;
interface ColorContentObject extends ContentObject {
    color?: string;
}
interface ColorContentDefinitionObject extends ContentDefinitionObject {
    color?: string;
}
interface ColorContent extends Content {
    definition: ColorContentDefinition;
    color: string;
    contentColors(time: Time, range: TimeRange): ColorTuple;
}
declare const isColorContent: (value: any) => value is ColorContent;
interface ColorContentDefinition extends ContentDefinition {
    color: string;
    instanceFromObject(object?: ColorContentObject): ColorContent;
}
/**
 * @category Factory
 */
interface ColorContentFactory extends GenericFactory<ColorContent, ColorContentObject, ColorContentDefinition, ColorContentDefinitionObject> {
}
declare const ColorContentWithContent: ContentClass & TweenableClass & typeof InstanceBase;
declare class ColorContentClass extends ColorContentWithContent implements ColorContent {
    constructor(...args: any[]);
    color: string;
    private _colorFilter?;
    get colorFilter(): Filter;
    contentColors(time: Time, range: TimeRange): ColorTuple;
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>;
    definition: ColorContentDefinition;
}
declare const ColorContentDefinitionWithContent: ContentDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class ColorContentDefinitionClass extends ColorContentDefinitionWithContent implements ColorContentDefinition {
    constructor(...args: any[]);
    color: string;
    instanceFromObject(object?: ColorContentObject): ColorContent;
}
declare const contentDefaults: ColorContentDefinitionClass[];
declare const contentDefinition: (object: ContentDefinitionObject) => ContentDefinition;
declare const contentDefinitionFromId: (id: string) => ContentDefinition;
declare const contentInstance: (object: ContentObject) => Content;
declare const contentFromId: (id: string) => Content;
interface AudibleContextSource {
    gainNode: GainNode;
    gainSource: AudibleSource;
}
declare class AudibleContext {
    private addSource;
    private _context?;
    private get context();
    createBuffer(seconds: number): AudioBuffer;
    createBufferSource(buffer?: AudioBuffer): AudibleSource;
    private createGain;
    get currentTime(): number;
    decode(buffer: ArrayBuffer): Promise<AudioBuffer>;
    deleteSource(id: string): void;
    get destination(): AudioDestinationNode;
    getSource(id: string): AudibleContextSource | undefined;
    hasSource(id: string): boolean;
    private sourcesById;
    startAt(id: string, source: AudibleSource, start: number, duration: number, offset?: number, loops?: boolean): void;
}
declare const AudibleContextInstance: AudibleContext;
declare const ContextFactory: {
    audible: () => AudibleContext;
};
interface PreloadableObject extends ContentObject {
}
interface PreloadableDefinitionObject extends ContentDefinitionObject {
    source?: string;
    bytes?: number;
    mimeType?: string;
    url?: string;
}
interface PreloadableDefinition extends ContentDefinition {
    loadType: LoadType;
    source: string;
    url: string;
    bytes: number;
    mimeType: string;
    info?: CommandProbeData;
}
declare const isPreloadableDefinition: (value?: any) => value is PreloadableDefinition;
declare function assertPreloadableDefinition(value?: any): asserts value is PreloadableDefinition;
interface Preloadable extends Content {
}
declare const isPreloadable: (value?: any) => value is Preloadable;
declare function assertPreloadable(value?: any): asserts value is Preloadable;
type PreloadableClass = Constrained<Preloadable>;
type PreloadableDefinitionClass = Constrained<PreloadableDefinition>;
declare const UpdatableDurationDefinitionTypes: DefinitionType[];
interface UpdatableDurationObject extends PreloadableObject {
    gain?: Value;
    muted?: boolean;
    loops?: number;
    speed?: number;
    startTrim?: number;
    endTrim?: number;
}
interface UpdatableDurationDefinitionObject extends PreloadableDefinitionObject {
    duration?: number;
    audio?: boolean;
    loop?: boolean;
    waveform?: string;
    audioUrl?: string;
    loadedAudio?: LoadedAudio;
}
interface UpdatableDuration extends Preloadable {
    gain: number;
    gainPairs: number[][];
    speed: number;
    startOptions(seconds: number, timeRange: TimeRange): StartOptions;
}
declare const isUpdatableDuration: (value?: any) => value is UpdatableDuration;
declare function assertUpdatableDuration(value?: any, name?: string): asserts value is UpdatableDuration;
declare const isUpdatableDurationType: (value: any) => value is DefinitionType;
interface UpdatableDurationDefinition extends PreloadableDefinition {
    audibleSource(preloader: Loader): AudibleSource | undefined;
    audio: boolean;
    audioUrl: string;
    duration: number;
    frames(quantize: number): number;
    loadedAudio?: LoadedAudio;
    loop: boolean;
    urlAudible(editing?: boolean): string;
}
declare const isUpdatableDurationDefinition: (value?: any) => value is UpdatableDurationDefinition;
declare function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition;
type UpdatableDurationClass = Constrained<UpdatableDuration>;
type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>;
interface AudioObject extends ContentObject, UpdatableDurationObject {
}
interface Audio extends Content, UpdatableDuration {
    definition: AudioDefinition;
}
declare const isAudio: (value: any) => value is Audio;
interface AudioDefinitionObject extends ContentDefinitionObject, UpdatableDurationDefinitionObject {
}
interface AudioDefinition extends ContentDefinition, UpdatableDurationDefinition {
    instanceFromObject(object?: AudioObject): Audio;
}
declare const isAudioDefinition: (value: any) => value is AudioDefinition;
/**
 * @category Factory
 */
interface AudioFactory extends GenericFactory<Audio, AudioObject, AudioDefinition, AudioDefinitionObject> {
}
declare const UpdatableSizeDefinitionType: DefinitionType[];
interface UpdatableSizeObject extends PreloadableObject {
}
interface UpdatableSizeDefinitionObject extends PreloadableDefinitionObject {
    sourceSize?: Size;
    previewSize?: Size;
}
interface UpdatableSize extends Preloadable {
}
declare const isUpdatableSize: (value?: any) => value is UpdatableSize;
declare function assertUpdatableSize(value?: any): asserts value is UpdatableSize;
declare const isUpdatableSizeType: (value: any) => value is DefinitionType;
interface UpdatableSizeDefinition extends PreloadableDefinition {
    previewSize?: Size;
    sourceSize?: Size;
    alpha?: boolean;
}
declare const isUpdatableSizeDefinition: (value?: any) => value is UpdatableSizeDefinition;
declare function assertUpdatableSizeDefinition(value?: any): asserts value is UpdatableSizeDefinition;
type UpdatableSizeClass = Constrained<UpdatableSize>;
type UpdatableSizeDefinitionClass = Constrained<UpdatableSizeDefinition>;
interface ImageObject extends ContentObject, ContainerObject, UpdatableSizeObject {
}
interface ImageDefinitionObject extends ContentDefinitionObject, ContainerDefinitionObject, UpdatableSizeDefinitionObject {
    loadedImage?: LoadedImage;
}
interface Image extends Content, Container, UpdatableSize {
    definition: ImageDefinition;
}
interface ImageDefinition extends ContainerDefinition, ContentDefinition, UpdatableSizeDefinition {
    instanceFromObject(object?: ImageObject): Image;
    loadedImage?: LoadedImage;
}
declare const isImageDefinition: (value: any) => value is ImageDefinition;
/**
 * @category Factory
 */
interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {
}
interface VideoObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
    speed?: number;
}
interface Video extends Content, UpdatableSize, UpdatableDuration {
    definition: VideoDefinition;
}
interface VideoDefinitionObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
    loadedVideo?: LoadedVideo;
}
interface VideoDefinition extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
    instanceFromObject(object?: VideoObject): Video;
    loadedVideo?: LoadedVideo;
}
declare const isVideoDefinition: (value: any) => value is VideoDefinition;
declare const isVideo: (value: any) => value is Video;
declare function assertVideo(value: any): asserts value is Video;
/**
 * @category Factory
 */
interface VideoFactory extends GenericFactory<Video, VideoObject, VideoDefinition, VideoDefinitionObject> {
}
interface VideoSequenceObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
    speed?: number;
}
interface VideoSequence extends Content, UpdatableSize, UpdatableDuration {
    definition: VideoSequenceDefinition;
    // copy() : VideoSequence
    speed: number;
}
interface VideoSequenceDefinitionObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
    begin?: number;
    fps?: number;
    increment?: number;
    pattern?: string;
    padding?: number;
}
interface VideoSequenceDefinition extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
    instanceFromObject(object?: VideoSequenceObject): VideoSequence;
    framesArray(start: Time): number[];
    urlForFrame(frame: number): string;
}
/**
 * @category Factory
 */
interface VideoSequenceFactory extends GenericFactory<VideoSequence, VideoSequenceObject, VideoSequenceDefinition, VideoSequenceDefinitionObject> {
}
type FactoryObject = {
    [DefinitionType.Audio]?: AudioFactory;
    [DefinitionType.Content]?: ContentFactory;
    [DefinitionType.Effect]?: EffectFactory;
    [DefinitionType.Filter]?: FilterFactory;
    [DefinitionType.Font]?: FontFactory;
    [DefinitionType.Image]?: ImageFactory;
    [DefinitionType.Container]?: ContainerFactory;
    [DefinitionType.Video]?: VideoFactory;
    [DefinitionType.VideoSequence]?: VideoSequenceFactory;
    [DefinitionType.Clip]?: ClipFactory;
};
declare const Factories: FactoryObject;
declare const Factory: Required<FactoryObject>;
declare const FilterGraphInputVisible = "BACKCOLOR";
declare const FilterGraphInputAudible = "SILENCE";
declare class FilterGraphClass implements FilterGraph {
    constructor(args: FilterGraphArgs);
    _id?: string;
    get id(): string;
    get avType(): AVType.Audio | AVType.Video;
    background: string;
    private get commandFilterVisible();
    private get commandFilterAudible();
    private _clips?;
    private get clips();
    private get clipsInitialize();
    get commandInputs(): CommandInputs;
    private _commandFiles?;
    get filterGraphCommandFiles(): CommandFiles;
    get commandFilesInitialize(): CommandFiles;
    get commandFilters(): CommandFilters;
    get duration(): number;
    get inputCommandFiles(): CommandFiles;
    mash: Mash;
    get preloader(): Loader;
    get quantize(): number;
    size: Size;
    streaming: boolean;
    time: Time;
    upload?: boolean;
    visible: boolean;
    videoRate: number;
}
declare class FilterGraphsClass implements FilterGraphs {
    args: FilterGraphsArgs;
    constructor(args: FilterGraphsArgs);
    assureDuration(): void;
    assureSize(): void;
    get duration(): number;
    filterGraphsVisible: FilterGraph[];
    filterGraphAudible?: FilterGraph;
    get filterGraphVisible(): FilterGraph;
    _graphFiles?: GraphFiles;
    get fileUrls(): GraphFiles;
    get graphFilesInput(): GraphFiles;
    get loadPromise(): Promise<void>;
    time: Time;
}
declare class MashClass extends EditedClass implements Mash {
    constructor(args: MashArgs);
    addClipToTrack(clip: Clip | Clips, trackIndex?: number, insertIndex?: number, frame?: number): void;
    addTrack(options?: TrackObject): Track;
    private assureTrack;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    private bufferStart;
    private bufferStop;
    private _bufferTimer?;
    changeTiming(propertied: Propertied, property: string, value: number): void;
    private clearDrawInterval;
    clearPreview(): void;
    private clipIntersects;
    get clips(): Clip[];
    private clipsAudibleInTime;
    private clipsInTime;
    clipsInTimeOfType(time: Time, avType?: AVType): Clip[];
    private get clipsVisible();
    private clipsVisibleInTime;
    private compositeVisible;
    // private counter = 0
    private compositeVisibleRequest;
    private _composition?;
    get composition(): AudioPreview;
    get definitionIds(): string[];
    destroy(): void;
    draw(): void;
    private drawInterval?;
    private drawRequest;
    private drawTime;
    private drawWhilePlayerNotPlaying;
    private drawingTime?;
    private drawnSeconds;
    drawnTime?: Time;
    get duration(): number;
    private emitIfFramesChange;
    get endTime(): Time;
    filterGraphs(options?: FilterGraphsOptions): FilterGraphs;
    private filterIntersecting;
    private _frame; // initial frame supplied to constructor
    get frame(): number;
    get frames(): number;
    private _gain;
    get gain(): number;
    set gain(value: number);
    private graphFileOptions;
    editedGraphFiles(options?: GraphFileOptions): GraphFiles;
    private graphFilesUnloaded;
    private handleDrawInterval;
    _layer?: LayerMash;
    get layer(): LayerMash;
    set layer(value: LayerMash);
    loadPromise(args?: GraphFileOptions): Promise<void>;
    private loadingPromises;
    get loading(): boolean;
    private loadPromiseUnlessBuffered;
    loop: boolean;
    get mashes(): Mash[];
    private _paused;
    get paused(): boolean;
    set paused(value: boolean);
    private _playing;
    private get playing();
    private set playing(value);
    private _preview?;
    private preview;
    private previewInitialize;
    private previewArgs;
    putPromise(): Promise<void>;
    removeClipFromTrack(clip: Clip | Clips): void;
    removeTrack(index?: number): void;
    _rendering: string;
    get rendering(): string;
    set rendering(value: string);
    private restartAfterStop;
    reload(): Promise<void> | undefined;
    private seekTime?;
    seekToTime(time: Time): Promise<void> | undefined;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    private setDrawInterval;
    private stopLoadAndDraw;
    previewItems(options: PreviewOptions): Promise<PreviewItems>;
    get time(): Time;
    get timeRange(): TimeRange;
    private timeRanges;
    private get timeToBuffer();
    toJSON(): UnknownObject;
    private trackClips;
    tracks: Track[];
}
declare const mashInstance: (object?: MashArgs) => Mash;
declare const isMashClass: (value: any) => value is MashClass;
declare function assertMashClass(value: any): asserts value is MashClass;
interface TrackPreviewArgs {
    clip: Clip;
    preview: Preview;
    timeRange: TimeRange;
    tweenTime?: Time;
    icon?: boolean;
}
interface TrackPreview {
    editingSvgItem(classes: string[], inactive?: boolean): SvgItem;
    id: string;
    clip: Clip;
    editor: Editor;
    svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems;
    container: Container;
    rect: Rect;
}
type TrackPreviews = TrackPreview[];
declare class PreviewClass implements Preview {
    constructor(args: PreviewArgs);
    audible: boolean;
    background?: string;
    private _clips?;
    protected get clips(): Clip[];
    private get clipsInitialize();
    combine: boolean;
    get duration(): number;
    get editing(): boolean;
    editor?: Editor;
    get intrinsicSizePromise(): Promise<void>;
    private get itemsPromise();
    mash: Mash;
    onlyClip?: Clip;
    get preloader(): Loader;
    get quantize(): number;
    size: Size;
    selectedClip?: Clip;
    streaming: boolean;
    private _svgItems?;
    time: Time;
    private _trackPreviews?;
    private get trackPreviews();
    protected get trackPreviewsInitialize(): TrackPreviews;
    get svgItemsPromise(): Promise<SvgItems>;
    get previewItemsPromise(): Promise<PreviewItems>;
    private tupleItems;
    visible: boolean;
}
declare class NonePreview extends PreviewClass {
    protected get clips(): Clips;
}
declare const TrackPreviewHandleSize = 8;
declare const TrackPreviewLineSize = 2;
declare class TrackPreviewClass implements TrackPreview {
    args: TrackPreviewArgs;
    constructor(args: TrackPreviewArgs);
    get clip(): Clip;
    get container(): Container;
    get editor(): Editor;
    get icon(): boolean;
    get id(): string;
    private pointerDown;
    private get preview();
    private get quantize();
    private _rect?;
    get rect(): Rect;
    private get rectInitialize();
    private get size();
    editingSvgItem(classes: string[], inactive?: boolean): SvgItem;
    svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems;
    private svgHandlePoint;
    private get time();
    private _timeRange?;
    private get timeRange();
}
declare const trackInstance: (object: TrackArgs) => Track;
/**
 * @category Factory
 */
declare const TrackFactory: {
    instance: (object: TrackArgs) => Track;
};
declare class TrackClass extends PropertiedClass implements Track {
    constructor(args: TrackArgs);
    addClips(clips: Clips, insertIndex?: number): void;
    assureFrame(clips?: Clips): boolean;
    assureFrames(quantize: number, clips?: Clips): void;
    clips: Clips;
    dense: boolean;
    frameForClipNearFrame(clip: Clip, frame?: number): number;
    get frames(): number;
    private _identifier?;
    get identifier(): string;
    index: number;
    _mash?: Mash;
    get mash(): Mash;
    set mash(value: Mash);
    removeClips(clips: Clips): void;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    sortClips(clips?: Clips): boolean;
    toJSON(): UnknownObject;
}
declare class ClipDefinitionClass extends DefinitionBase implements ClipDefinition {
    constructor(...args: any[]);
    audible: boolean;
    instanceArgs(object?: ClipObject): ClipObject;
    instanceFromObject(object?: ClipObject): Clip;
    streamable: boolean;
    type: DefinitionType;
    visible: boolean;
}
declare const clipDefault: ClipDefinitionClass;
declare const clipDefaultId: string;
declare const clipDefaults: ClipDefinitionClass[];
declare const clipDefinition: (object: ClipDefinitionObject) => ClipDefinition;
declare const clipDefinitionFromId: (id: string) => ClipDefinition;
declare const clipInstance: (object?: ClipObject) => Clip;
declare const clipFromId: (id: string) => Clip;
declare function ModularMixin<T extends InstanceClass>(Base: T): ModularClass & T;
declare function ModularDefinitionMixin<T extends DefinitionClass>(Base: T): ModularDefinitionClass & T;
declare function PreloadableDefinitionMixin<T extends ContentDefinitionClass>(Base: T): PreloadableDefinitionClass & T;
declare function PreloadableMixin<T extends ContentClass>(Base: T): PreloadableClass & T;
declare function UpdatableSizeMixin<T extends PreloadableClass>(Base: T): UpdatableSizeClass & T;
declare function UpdatableSizeDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableSizeDefinitionClass & T;
declare function UpdatableDurationMixin<T extends PreloadableClass>(Base: T): UpdatableDurationClass & T;
declare function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T;
declare function TweenableDefinitionMixin<T extends DefinitionClass>(Base: T): TweenableDefinitionClass & T;
declare function TweenableMixin<T extends InstanceClass>(Base: T): TweenableClass & T;
declare class ClipClass extends InstanceBase implements Clip {
    constructor(...args: any[]);
    private assureTimingAndSizing;
    get audible(): boolean;
    clipFileUrls(args: GraphFileArgs): GraphFiles;
    clipIcon(size: Size, scale: number, buffer?: number): Promise<SvgOrImage> | undefined;
    clipCommandFiles(args: CommandFileArgs): CommandFiles;
    commandFilters(args: CommandFilterArgs): CommandFilters;
    private _container?;
    get container(): Container | undefined;
    private containerInitialize;
    containerId: string;
    private _content?;
    get content(): Content;
    private contentInitialize;
    contentId: string;
    copy(): Clip;
    definition: ClipDefinition;
    definitionIds(): string[];
    get endFrame(): number;
    endTime(quantize: number): Time;
    frame: number;
    frames: number;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles;
    maxFrames(_quantize: number, _trim?: number): number;
    get mutable(): boolean;
    muted: boolean;
    get notMuted(): boolean;
    previewItemsPromise(size: Size, time?: Time, icon?: boolean): Promise<PreviewItems>;
    rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect;
    rects(args: ContainerRectArgs): RectTuple;
    resetTiming(tweenable?: Tweenable, quantize?: number): void;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    private selectedProperty;
    setValue(value: Scalar, name: string, property?: Property): void;
    sizing: Sizing;
    // private _svgElement?: SVGSVGElement
    // private get svgElement() {
    //   return this._svgElement ||= svgElement()
    // }
    // private updateSvg(rect: Rect) {
    //   svgSetDimensions(this.svgElement, rect)
    // }
    time(quantize: number): Time;
    timeRange(quantize: number): TimeRange;
    timeRangeRelative(timeRange: TimeRange, quantize: number): TimeRange;
    timing: Timing;
    toJSON(): UnknownObject;
    toString(): string;
    _track?: Track;
    get track(): Track;
    set track(value: Track);
    get trackNumber(): number;
    set trackNumber(value: number);
    get visible(): boolean;
}
declare class EditedClass extends PropertiedClass implements Edited {
    constructor(args: EditedArgs);
    color: string;
    get buffer(): number;
    set buffer(value: number);
    createdAt: string;
    private data;
    protected dataPopulate(rest: UnknownObject): void;
    destroy(): void;
    _editor?: Editor;
    get editor(): Editor;
    set editor(value: Editor);
    _emitter?: Emitter;
    get emitter(): Emitter;
    set emitter(value: Emitter);
    protected emitterChanged(): void;
    editedGraphFiles(args: GraphFileOptions): GraphFiles;
    icon: string;
    protected _id: string;
    get id(): string;
    set id(value: string);
    private _imageSize;
    get imageSize(): Size;
    set imageSize(value: Size);
    label: string;
    loadPromise(args?: GraphFileOptions): Promise<void>;
    get loading(): boolean;
    get mashes(): Mash[];
    private _preloader?;
    get preloader(): Loader;
    putPromise(): Promise<void>;
    quantize: number;
    reload(): Promise<void> | undefined;
    selectables(): Selectables;
    selectType: SelectType;
    selectedItems(actions: Actions): SelectedItems;
    previewItems(options: PreviewOptions): Promise<PreviewItems>;
    toJSON(): UnknownObject;
}
declare class CastClass extends EditedClass implements Cast {
    constructor(args: CastArgs);
    addLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    createLayer(layerObject: LayerObject): Layer;
    destroy(): void;
    protected emitterChanged(): void;
    editedGraphFiles(args?: GraphFileOptions): GraphFiles;
    get imageSize(): Size;
    set imageSize(value: Size);
    layers: Layers;
    get layerFolders(): LayerFolder[];
    loadPromise(args?: GraphFileOptions): Promise<void>;
    get loading(): boolean;
    get mashes(): Mashes;
    moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): LayerAndPosition;
    putPromise(): Promise<void>;
    reload(): Promise<void> | undefined;
    removeLayer(layer: Layer): LayerAndPosition;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    setValue(value: Scalar, name: string, property?: Property): void;
    previewItems(args: PreviewOptions): Promise<PreviewItems>;
    toJSON(): UnknownObject;
}
declare const castInstance: (object?: CastObject, preloader?: Loader | undefined) => Cast;
declare const isCast: (value: any) => value is Cast;
declare function assertCast(value: any): asserts value is Cast;
declare const actionInstance: (object: ActionOptions) => Action;
declare const ActionFactory: {
    createFromObject: (object: ActionOptions) => Action;
};
interface AddTrackActionObject extends ActionOptions {
    createTracks: number;
}
/**
 * @category Action
 */
declare class AddTrackAction extends Action {
    constructor(object: AddTrackActionObject);
    createTracks: number;
    redoAction(): void;
    undoAction(): void;
}
interface AddClipToTrackActionObject extends AddTrackActionObject {
    clips: Clips;
    insertIndex: number;
    trackIndex: number;
    redoFrame?: number;
    undoFrame: number;
}
/**
 * @category Action
 */
declare class AddClipToTrackAction extends AddTrackAction {
    constructor(object: AddClipToTrackActionObject);
    clips: Clips;
    insertIndex: number;
    trackIndex: number;
    get track(): Track;
    redoAction(): void;
    redoFrame?: number;
    undoAction(): void;
    undoFrame: number;
}
interface AddEffectActionObject extends ActionOptions {
    effect: Effect;
    effects: Effects;
    index: number;
}
/**
 * @category Action
 */
declare class AddEffectAction extends Action {
    constructor(object: AddEffectActionObject);
    effect: Effect;
    effects: Effects;
    index: number;
    redoAction(): void;
    undoAction(): void;
}
interface AddLayerActionObject extends ActionOptions {
    layerAndPosition?: LayerAndPosition;
}
/**
 * @category Action
 */
declare class AddLayerAction extends Action {
    constructor(object: AddLayerActionObject);
    layerAndPosition?: LayerAndPosition;
    get layer(): Layer;
    redoAction(): void;
    undoAction(): void;
}
interface ChangeActionObject extends ActionOptions {
    property: string;
    redoValue?: Scalar;
    undoValue?: Scalar;
    target: Propertied;
}
declare const isChangeActionObject: (value: any) => value is ChangeActionObject;
/**
 * @category Action
 */
declare class ChangeAction extends Action {
    constructor(object: ChangeActionObject);
    property: string;
    redoValue: Scalar;
    target: Propertied;
    undoValue: Scalar;
    get redoValueNumeric(): number;
    get undoValueNumeric(): number;
    redoAction(): void;
    undoAction(): void;
    updateAction(object: ChangeActionObject): void;
}
declare const isChangeAction: (value: any) => value is ChangeAction;
declare function assertChangeAction(value: any): asserts value is ChangeAction;
/**
 * @category Action
 */
declare class ChangeFramesAction extends ChangeAction {
    constructor(object: ChangeActionObject);
    redoAction(): void;
    undoAction(): void;
}
interface ChangeMultipleActionObject extends ChangeActionObject {
    undoValues: ScalarObject;
    redoValues: ScalarObject;
}
/**
 * @category Action
 */
declare class ChangeMultipleAction extends ChangeAction {
    constructor(object: ChangeMultipleActionObject);
    redoAction(): void;
    redoValues: ScalarObject;
    undoAction(): void;
    updateAction(object: ChangeMultipleActionObject): void;
    undoValues: ScalarObject;
}
interface MoveClipActionObject extends AddTrackActionObject {
    clip: Clip;
    insertIndex: number;
    redoFrame?: number;
    trackIndex: number;
    undoFrame?: number;
    undoInsertIndex: number;
    undoTrackIndex: number;
}
/**
 * @category Action
 */
declare class MoveClipAction extends AddTrackAction {
    constructor(object: MoveClipActionObject);
    clip: Clip;
    insertIndex: number;
    trackIndex: number;
    undoTrackIndex: number;
    undoInsertIndex: number;
    undoFrame?: number;
    redoFrame?: number;
    addClip(trackIndex: number, insertIndex: number, frame?: number): void;
    redoAction(): void;
    undoAction(): void;
}
interface MoveEffectActionObject extends ActionOptions {
    effects: Effects;
    redoEffects: Effects;
    undoEffects: Effects;
}
/**
 * @category Action
 */
declare class MoveEffectAction extends Action {
    constructor(object: MoveEffectActionObject);
    effects: Effects;
    redoEffects: Effects;
    redoAction(): void;
    undoAction(): void;
    undoEffects: Effects;
}
/**
 * @category Action
 */
declare class MoveLayerAction extends AddLayerAction {
    get layer(): Layer;
    undoLayerAndPosition?: LayerAndPosition;
    redoAction(): void;
    undoAction(): void;
}
interface RemoveClipActionObject extends ActionOptions {
    clip: Clip;
    index: number;
    track: Track;
}
/**
 * @category Action
 */
declare class RemoveClipAction extends Action {
    constructor(object: RemoveClipActionObject);
    track: Track;
    clip: Clip;
    index: number;
    get trackIndex(): number;
    redoAction(): void;
    undoAction(): void;
}
/**
 * @category Action
 */
declare class RemoveLayerAction extends Action {
    get layer(): Layer;
    layerAndPosition?: LayerAndPosition;
    redoAction(): void;
    undoAction(): void;
}
declare class EditorClass implements Editor {
    constructor(args: EditorArgs);
    actions: Actions;
    add(object: DefinitionObject | DefinitionObjects, editorIndex?: EditorIndex): Promise<Definition[]>;
    addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>;
    addEffect(effect: Effect, insertIndex?: number): Promise<void>;
    addFiles(files: File[], editorIndex?: EditorIndex): Promise<Definition[]>;
    addFolder(label?: string, layerAndPosition?: LayerAndPosition): void;
    addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void;
    addTrack(): void;
    private assureMash;
    autoplay: boolean;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    can(masherAction: MasherAction): boolean;
    private castDestroy;
    private clearActions;
    get clips(): Clips;
    private configureCast;
    private configureEdited;
    private configureMash;
    create(): void;
    get currentTime(): number;
    dataPutRequest(): Promise<DataPutRequest>;
    define(objectOrArray: DefinitionObject | DefinitionObjects): void;
    get definitions(): Definition[];
    get definitionsUnsaved(): Definition[];
    private destroy;
    dragging: boolean;
    private drawTimeout?;
    get duration(): number;
    _editType?: EditType;
    get editType(): EditType;
    get edited(): Edited | undefined;
    editedData?: EditedData;
    editing: boolean;
    get editingCast(): boolean;
    private get endTime();
    eventTarget: Emitter;
    private _fps;
    get fps(): number;
    set fps(value: number);
    get frame(): number;
    set frame(value: number);
    get frames(): number;
    private get gain();
    goToTime(value?: Time): Promise<void>;
    handleAction(action: Action): void;
    private handleDraw;
    load(data: EditedData): Promise<void>;
    private loadCastData;
    private loadEditedData;
    private loadMashAndDraw;
    private loadMashData;
    private _loop;
    get loop(): boolean;
    set loop(value: boolean);
    private mashDestroy;
    private get mashes();
    move(object: ClipOrEffect, editorIndex?: EditorIndex): void;
    moveClip(clip: Clip, editorIndex?: EditorIndex): void;
    moveEffect(effect: Effect, index?: number): void;
    moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void;
    moveTrack(): void;
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
    preloader: BrowserLoaderClass;
    readOnly: boolean;
    private _rect;
    get rect(): Rect;
    set rect(value: Rect);
    redo(): void;
    redraw(): void;
    removeClip(clip: Clip): void;
    removeEffect(effect: Effect): void;
    removeLayer(layer: Layer): void;
    removeTrack(track: Track): void;
    saved(temporaryIdLookup?: StringObject): void;
    _selection?: EditorSelection;
    get selection(): EditorSelection;
    get svgElement(): SVGSVGElement;
    set svgElement(value: SVGSVGElement);
    previewItems(enabled?: boolean): Promise<PreviewItems>;
    get time(): Time;
    set time(value: Time);
    get timeRange(): TimeRange;
    undo(): void;
    updateDefinition(definitionObject: DefinitionObject, definition?: Definition): Promise<void>;
    private _volume;
    get volume(): number;
    set volume(value: number);
}
declare let editorSingleton: Editor;
declare const editorArgs: (options?: EditorOptions) => EditorArgs;
declare const editorInstance: (options?: EditorOptions) => Editor;
declare class LayerClass extends PropertiedClass implements Layer {
    constructor(args: LayerArgs);
    _cast?: Cast;
    get cast(): Cast;
    set cast(value: Cast);
    _id?: string;
    get id(): string;
    get mashes(): Mashes;
    label: string;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    toJSON(): UnknownObject;
    triggers: never[];
    type: LayerType;
}
declare class LayerFolderClass extends LayerClass implements LayerFolder {
    constructor(args: LayerFolderArgs);
    collapsed: boolean;
    layers: Layers;
    get mashes(): Mashes;
    toJSON(): UnknownObject;
    type: LayerType;
}
declare const Default: {
    duration: number;
    label: string;
    editor: EditorArgs;
    cast: {
        label: string;
        quantize: number;
        color: string;
        gain: number;
        buffer: number;
    };
    mash: {
        label: string;
        quantize: number;
        color: string;
        gain: number;
        buffer: number;
    };
    definition: {
        image: {
            duration: number;
        };
        textcontainer: {
            duration: number;
        };
        shape: {
            duration: number;
        };
        visible: {
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
declare const DirectionLabels: string[];
declare const Errors: {
    eval: {
        sourceRect: string;
        outputSize: string;
        inputSize: string;
        conditionTruth: string;
        conditionValue: string;
        number: string;
        get: string;
        string: string;
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
        duration: string;
        definition: {
            audio: string;
            url: string;
            source: string;
            id: string;
            object: string;
            type: string;
        };
        size: string;
        track: string;
        trackType: string;
        action: string;
        name: string;
        value: string;
        type: string;
        url: string;
        user: string;
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
declare class LayerMashClass extends LayerClass implements LayerMash {
    constructor(args: LayerMashArgs);
    get mashes(): Mashes;
    mash: Mash;
    toJSON(): UnknownObject;
    type: LayerType;
}
declare const layerFolderInstance: (object: LayerFolderObject, cast: Cast) => LayerFolder;
declare const layerMashInstance: (object: LayerMashObject, cast: Cast) => LayerMash;
declare const layerInstance: (layerObject: LayerObject, cast: Cast) => Layer;
declare const isLayer: (value: any) => value is Layer;
declare function assertLayer(value: any): asserts value is Layer;
declare const isLayerMash: (value: any) => value is LayerMash;
declare function assertLayerMash(value: any): asserts value is LayerMash;
declare const isLayerFolder: (value: any) => value is LayerFolder;
declare function assertLayerFolder(value: any): asserts value is LayerFolder;
declare class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected commandFilter(options?: ValueObject): CommandFilter;
    protected _ffmpegFilter?: string;
    get ffmpegFilter(): string;
    filterDefinitionSvg(args: FilterDefinitionArgs): SvgItem;
    instanceFromObject(object?: FilterObject): Filter;
    parameters: Parameter[];
    protected populateParametersFromProperties(): void;
    filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters;
    protected colorCommandFilter(dimensions: Size, videoRate?: number, duration?: number, color?: string): CommandFilter;
    type: DefinitionType;
}
/**
 * @category Filter
 */
declare class AlphamergeFilter extends FilterDefinitionClass {
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class ChromaKeyFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    filterDefinitionSvgFilter(object: ScalarObject): SvgFilters;
}
/**
 * @category Filter
 */
declare class ColorChannelMixerFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    filterDefinitionSvgFilter(object: ScalarObject): SvgFilters;
}
/**
 * @category Filter
 */
declare class ColorizeFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    protected _ffmpegFilter: string;
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class ColorFilter extends ColorizeFilter {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected _ffmpegFilter: string;
    filterDefinitionSvg(args: FilterDefinitionArgs): SvgItem;
}
/**
 * @category Filter
 */
declare class ConvolutionFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters;
}
type Numbers = number[];
type NumbersOrUndefined = Numbers | undefined;
type NumberOrUndefined = number | undefined;
type ConvolutionRgba = "r" | "b" | "g" | "a";
type ConvolutionChannel = "combined" | ConvolutionRgba;
type ConvolutionRgbaObject = {
    [index in ConvolutionRgba]: number;
};
type ConvolutionRgbasObject = {
    [index in ConvolutionRgba]: Numbers;
};
interface ConvolutionNumberObject extends ConvolutionRgbaObject {
    combined?: number;
}
interface ConvolutionNumbersObject extends ConvolutionRgbasObject {
    combined?: Numbers;
}
type StringOrUndefined = string | undefined;
type ConvolutionStringObject = {
    [index in ConvolutionChannel]?: StringOrUndefined;
};
type ConvolutionKey = "bias" | "multiplier";
type ConvolutionNumbersKey = "matrix";
interface ConvolutionObject {
    matrix: ConvolutionNumbersObject;
    bias: ConvolutionNumberObject;
    multiplier: ConvolutionNumberObject;
}
interface ConvolutionServerFilter extends ValueObject {
    matrix: string;
    bias: string;
    multiplier: string;
}
declare const isConvolutionServerFilter: (value: any) => value is ConvolutionServerFilter;
declare function assertConvolutionServerFilter(value: any): asserts value is ConvolutionServerFilter;
/**
 * @category Filter
 */
declare class CropFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class FpsFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
}
declare class OpacityFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected _ffmpegFilter: string;
    filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters;
}
/**
 * @category Filter
 */
declare class OverlayFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class ScaleFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class SetptsFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
}
/**
 * @category Filter
 */
declare class SetsarFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
}
/**
 * @category Filter
 */
declare class TextFilter extends ColorizeFilter {
    constructor(...args: any[]);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected _ffmpegFilter: string;
}
/**
 * @category Filter
 */
declare class TrimFilter extends FilterDefinitionClass {
    constructor(...args: any[]);
}
declare const FilterIdPrefix: string;
declare const filterDefaults: (ChromaKeyFilter | ColorizeFilter | ColorChannelMixerFilter | ConvolutionFilter | CropFilter | OverlayFilter | ScaleFilter | OpacityFilter | SetsarFilter | FpsFilter | SetptsFilter | AlphamergeFilter | TrimFilter)[];
declare const filterDefinition: (object: FilterDefinitionObject) => FilterDefinition;
declare const filterDefinitionFromId: (id: string) => FilterDefinition;
declare const filterInstance: (object: FilterDefinitionObject) => Filter;
declare const filterFromId: (id: string) => Filter;
declare class FilterClass extends InstanceBase implements Filter {
    constructor(...args: any[]);
    commandFilters(args: FilterCommandFilterArgs): CommandFilters;
    definition: FilterDefinition;
    parameters: Parameter[];
    _parametersDefined?: Parameter[];
    get parametersDefined(): Parameter[];
    filterSvg(args?: FilterArgs): SvgItem;
    filterSvgFilter(): SvgFilters;
    scalarObject(tweening?: boolean): ScalarObject;
    toJSON(): UnknownObject;
    toString(): string;
}
declare const PropertyTypesNumeric: DataType[];
declare const propertyTypeIsString: (dataType: DataType) => boolean;
declare const propertyTypeDefault: (dataType: DataType) => Scalar;
declare const propertyTypeValid: (value: Scalar, dataType: DataType) => boolean;
declare const propertyTypeCoerce: (value: Scalar, dataType: DataType) => Scalar;
declare const timeEqualizeRates: (time1: Time, time2: Time, rounding?: string) => Time[];
declare class TimeClass implements Time {
    constructor(frame?: number, fps?: number);
    add(time: Time): Time;
    addFrame(frames: number): Time;
    closest(timeRange: TimeRange): Time;
    get copy(): Time;
    get description(): string;
    divide(number: number, rounding?: string): Time;
    equalsTime(time: Time): boolean;
    fps: number;
    frame: number;
    durationFrames(duration: number, fps?: number): number[];
    isRange: boolean;
    get lengthSeconds(): number;
    min(time: Time): Time;
    scale(fps: number, rounding?: string): Time;
    scaleToFps(fps: number): Time;
    scaleToTime(time: Time): Time;
    get seconds(): number;
    get startTime(): Time;
    subtract(time: Time): Time;
    subtractFrames(frames: number): Time;
    get timeRange(): TimeRange;
    toString(): string;
    withFrame(frame: number): Time;
}
declare const timeRangeFromArgs: (frame?: number, fps?: number, frames?: number) => TimeRange;
declare const timeRangeFromSeconds: (start?: number, duration?: number) => TimeRange;
declare const timeRangeFromTime: (time: Time, frames?: number) => TimeRange;
declare const timeRangeFromTimes: (startTime: Time, endTime?: Time | undefined) => TimeRange;
declare const timeFromArgs: (frame?: number, fps?: number) => Time;
declare const timeFromSeconds: (seconds?: number, fps?: number, rounding?: string) => Time;
declare class TimeRangeClass extends TimeClass implements TimeRange {
    frames: number;
    constructor(frame?: number, fps?: number, frames?: number);
    addFrames(frames: number): TimeRange;
    get copy(): TimeRange;
    get description(): string;
    get end(): number;
    get endTime(): Time;
    equalsTimeRange(timeRange: TimeRange): boolean;
    get frameTimes(): Times;
    includes(frame: number): boolean;
    includesTime(time: Time): boolean;
    intersects(time: Time): boolean;
    isRange: boolean;
    get last(): number;
    get lastTime(): Time;
    get lengthSeconds(): number;
    get position(): number;
    positionTime(position: number, rounding?: string): Time;
    get startTime(): Time;
    scale(fps?: number, rounding?: string): TimeRange;
    get timeRange(): TimeRange;
    get times(): Times;
    minEndTime(endTime: Time): TimeRange;
    withFrame(frame: number): TimeRange;
    withFrames(frames: number): TimeRange;
}
declare const AudioDefinitionWithUpdatableDuration: UpdatableDurationDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class AudioDefinitionClass extends AudioDefinitionWithUpdatableDuration implements AudioDefinition {
    constructor(...args: any[]);
    instanceFromObject(object?: AudioObject): Audio;
    type: DefinitionType;
    loadType: LoadType;
}
declare const audioDefinition: (object: AudioDefinitionObject) => AudioDefinition;
declare const audioDefinitionFromId: (id: string) => AudioDefinition;
declare const audioInstance: (object: AudioObject) => Audio;
declare const audioFromId: (id: string) => Audio;
declare const AudioWithUpdatableDuration: UpdatableDurationClass & PreloadableClass & ContentClass & TweenableClass & typeof InstanceBase;
declare class AudioClass extends AudioWithUpdatableDuration implements Audio {
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>;
    definition: AudioDefinition;
    mutable(): boolean;
}
declare const EffectDefinitionWithModular: ModularDefinitionClass & typeof DefinitionBase;
declare class EffectDefinitionClass extends EffectDefinitionWithModular implements EffectDefinition {
    constructor(...args: any[]);
    instanceArgs(object?: InstanceObject): InstanceObject;
    instanceFromObject(object?: EffectObject): Effect;
    type: DefinitionType;
}
declare const EffectWithModular: ModularClass & typeof InstanceBase;
declare class EffectClass extends EffectWithModular {
    definition: EffectDefinition;
    private _tweenable?;
    get tweenable(): Tweenable;
    set tweenable(value: Tweenable);
    selectables(): Selectables;
    selectType: SelectType;
    selectedItems(actions: Actions): SelectedItems;
}
// import effectTextJson from "../../Definitions/DefinitionObjects/effect/text.json"
declare const effectDefinition: (object: EffectDefinitionObject) => EffectDefinition;
declare const effectDefaults: EffectDefinition[];
declare const effectDefinitionFromId: (id: string) => EffectDefinition;
declare const effectInstance: (object: EffectObject) => Effect;
declare const effectFromId: (definitionId: string) => Effect;
declare class FontDefinitionClass extends DefinitionBase implements FontDefinition {
    constructor(...args: any[]);
    family: string;
    fileUrls(args: GraphFileArgs): GraphFiles;
    instanceFromObject(object?: FontObject): Font;
    loadType: LoadType;
    toJSON(): UnknownObject;
    source: string;
    type: DefinitionType;
    url: string;
}
declare const fontDefinition: (object: FontDefinitionObject) => FontDefinition;
declare const fontDefault: FontDefinition;
declare const fontDefaults: FontDefinition[];
declare const fontDefinitionFromId: (id: string) => FontDefinition;
declare const fontInstance: (object: FontObject) => Font;
declare const fontFromId: (definitionId: string) => Font;
declare class FontClass extends InstanceBase implements Font {
    definition: FontDefinition;
    fileUrls(args: GraphFileArgs): GraphFiles;
}
declare const ImageDefinitionWithUpdatable: UpdatableSizeDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & ContainerDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
    constructor(...args: any[]);
    definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: ImageObject): Image;
    loadType: LoadType;
    loadedImage?: LoadedImage;
    type: DefinitionType;
}
declare const imageDefinition: (object: ImageDefinitionObject) => ImageDefinition;
declare const imageDefinitionFromId: (id: string) => ImageDefinition;
declare const imageInstance: (object: ImageObject) => Image;
declare const imageFromId: (id: string) => Image;
declare const ImageWithUpdatableSize: UpdatableSizeClass & PreloadableClass & ContentClass & ContainerClass & TweenableClass & typeof InstanceBase;
declare class ImageClass extends ImageWithUpdatableSize implements Image {
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
    definition: ImageDefinition;
    fileUrls(args: GraphFileArgs): GraphFiles;
}
declare const VideoDefinitionWithUpdatableDuration: UpdatableDurationDefinitionClass & UpdatableSizeDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & ContainerDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class VideoDefinitionClass extends VideoDefinitionWithUpdatableDuration implements VideoDefinition {
    constructor(...args: any[]);
    instanceFromObject(object?: VideoObject): Video;
    loadType: LoadType;
    loadedVideo?: LoadedVideo;
    pattern: string;
    toJSON(): UnknownObject;
    type: DefinitionType;
}
declare const videoDefinition: (object: VideoDefinitionObject) => VideoDefinition;
declare const videoDefinitionFromId: (id: string) => VideoDefinition;
declare const videoInstance: (object: VideoObject) => Video;
declare const videoFromId: (id: string) => Video;
declare const VideoWithUpdatableDuration: UpdatableDurationClass & UpdatableSizeClass & PreloadableClass & ContentClass & ContainerClass & TweenableClass & typeof InstanceBase;
declare class VideoClass extends VideoWithUpdatableDuration implements Video {
    definition: VideoDefinition;
    fileUrls(args: GraphFileArgs): GraphFiles;
    private _foreignElement?;
    get foreignElement(): SVGForeignObjectElement;
    private get foreignElementInitialize();
    iconUrl(size: Size, time: Time, clipTime: TimeRange): string;
    itemPreviewPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
    private _loadedVideo?;
    private get loadedVideo();
    private get loadVideoPromise();
    private updateVideo;
    private updateForeignElement;
    static _clientCanMaskVideo?: boolean;
    static get clientCanMaskVideo(): boolean;
}
declare const VideoSequenceDefinitionWithUpdatableDuration: UpdatableDurationDefinitionClass & UpdatableSizeDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & TweenableDefinitionClass & typeof DefinitionBase;
declare class VideoSequenceDefinitionClass extends VideoSequenceDefinitionWithUpdatableDuration implements VideoSequenceDefinition {
    constructor(...args: any[]);
    begin: number;
    fps: number;
    framesArray(start: Time): number[];
    private get framesMax();
    increment: number;
    instanceFromObject(object?: VideoSequenceObject): VideoSequence;
    loadType: LoadType;
    padding: number;
    pattern: string;
    toJSON(): UnknownObject;
    type: DefinitionType;
    urlForFrame(frame: number): string;
}
declare const videoSequenceDefinition: (object: VideoSequenceDefinitionObject) => VideoSequenceDefinition;
declare const videoSequenceDefinitionFromId: (id: string) => VideoSequenceDefinition;
declare const videoSequenceInstance: (object: VideoSequenceObject) => VideoSequence;
declare const videoSequenceFromId: (id: string) => VideoSequence;
declare const VideoSequenceWithUpdatableDuration: UpdatableDurationClass & UpdatableSizeClass & PreloadableClass & ContentClass & ContainerClass & TweenableClass & typeof InstanceBase;
declare class VideoSequenceClass extends VideoSequenceWithUpdatableDuration implements VideoSequence {
    definition: VideoSequenceDefinition;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
    fileUrls(args: GraphFileArgs): GraphFiles;
    iconUrl(size: Size, time: Time, range: TimeRange): string;
    // itemPreviewPromise(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): Promise<SvgItem> {
    //   return this.itemIconPromise(rect, time, range, stretch).then(svgItem => {
    //     return svgItem
    //   })
    // }
    // private itemPromise(time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
    //   const definitionTime = this.definitionTime(time, range)
    //   const { definition } = this
    //   const frames = definition.framesArray(definitionTime)
    //   const [frame] = frames
    //   const url = definition.urlForFrame(frame)
    //   const svgUrl = `svg:/${url}`
    //   const { preloader } = this.clip.track.mash
    //   return preloader.loadPromise(svgUrl, definition)
    // }
    // itemPromise(containerRect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): Promise<SvgItem> {
    //   const { container } = this
    //   const rect = container ? containerRect : this.contentRect(containerRect, time, range)
    //   const lock = stretch ? undefined : Orientation.V
    //   return this.itemPromise(time, range, icon).then(item => {
    //     svgSetDimensionsLock(item, rect, lock)
    //     return item
    //   })
    // }
    speed: number;
    toJSON(): UnknownObject;
}
declare class RenderingOutputClass implements RenderingOutput {
    args: RenderingOutputArgs;
    constructor(args: RenderingOutputArgs);
    protected assureClipFrames(): void;
    protected _avType: AVType;
    get avType(): AVType;
    get avTypeNeededForClips(): AVType;
    protected get commandOutput(): RenderingCommandOutput;
    get duration(): number;
    _durationClips?: Clip[];
    private get durationClips();
    private get durationClipsInitialize();
    get endTime(): Time | undefined;
    // private _filterGraphs?: FilterGraphsthis._filterGraphs =
    get filterGraphs(): FilterGraphs;
    get filterGraphsOptions(): FilterGraphsOptions;
    graphType: GraphType;
    private get mashDurationPromise();
    get mashSize(): Size | undefined;
    get outputCover(): boolean;
    get outputSize(): Size;
    outputType: OutputType;
    get preloadPromise(): Promise<void>;
    get renderingClips(): Clip[];
    renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription>;
    // get renderingDescription(): RenderingDescription {
    //   const { commandOutput } = this
    //   const renderingDescription: RenderingDescription = { commandOutput }
    //   const avType = this.avTypeNeededForClips
    //   const { filterGraphs } = this
    //   // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
    //   if (avType !== AVType.Audio) {
    //     const { filterGraphsVisible } = filterGraphs
    //     const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
    //       const { commandFilters, commandInputs: inputs, duration } = filterGraph
    //       const commandDescription: CommandDescription = { inputs, commandFilters, duration, avType: AVType.Video }
    //     // console.log(this.constructor.name, "renderingDescriptionPromise inputs, commandFilters", inputs, commandFilters)
    //       return commandDescription
    //     })
    //     renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions
    //   }
    //   if (avType !== AVType.Video) {
    //     const { filterGraphAudible, duration } = filterGraphs
    //     if (filterGraphAudible) {
    //       const { commandFilters, commandInputs: inputs } = filterGraphAudible
    //       const commandDescription: CommandDescription = {
    //         inputs, commandFilters, duration, avType: AVType.Audio
    //       }
    //       renderingDescription.audibleCommandDescription = commandDescription
    //     }
    //   }
    //   return renderingDescription
    // }
    get startTime(): Time;
    sizeCovered(): Size;
    get sizePromise(): Promise<void>;
    get timeRange(): TimeRange;
    get videoRate(): number;
    get visibleGraphFiles(): GraphFiles;
}
declare class AudioOutputClass extends RenderingOutputClass implements AudioOutput {
    args: AudioOutputArgs;
    _avType: AVType;
    outputType: OutputType;
}
declare class ImageOutputClass extends RenderingOutputClass implements ImageOutput {
    args: ImageOutputArgs;
    _avType: AVType;
    protected get commandOutput(): RenderingCommandOutput;
    get endTime(): Time | undefined;
    get filterGraphsOptions(): FilterGraphsOptions;
    outputType: OutputType;
    get startTime(): Time;
}
declare class ImageSequenceOutputClass extends AudioOutputClass implements ImageSequenceOutput {
    args: ImageSequenceOutputArgs;
    _avType: AVType;
    outputType: OutputType;
}
declare class VideoOutputClass extends AudioOutputClass implements VideoOutput {
    args: VideoOutputArgs;
    get avType(): AVType.Both | AVType.Video;
    get outputCover(): boolean;
    outputType: OutputType;
}
declare class WaveformOutputClass extends RenderingOutputClass implements WaveformOutput {
    args: WaveformOutputArgs;
    _avType: AVType;
    outputType: OutputType;
    get sizePromise(): Promise<void>;
}
declare const outputInstanceAudio: (object: AudioOutputArgs) => AudioOutputClass;
declare const outputInstanceImage: (object: ImageOutputArgs) => ImageOutputClass;
declare const outputInstanceVideo: (object: VideoOutputArgs) => VideoOutputClass;
declare const outputInstanceVideoSequence: (object: ImageSequenceOutputArgs) => ImageSequenceOutputClass;
declare const outputInstanceWaveform: (object: WaveformOutputArgs) => WaveformOutputClass;
/**
 * @category Factory
 */
declare const OutputFactory: {
    audio: (object: AudioOutputArgs) => AudioOutputClass;
    image: (object: ImageOutputArgs) => ImageOutputClass;
    video: (object: VideoOutputArgs) => VideoOutputClass;
    imagesequence: (object: ImageSequenceOutputArgs) => ImageSequenceOutputClass;
    waveform: (object: WaveformOutputArgs) => WaveformOutputClass;
};
declare class StreamingOutputClass implements StreamingOutput {
    constructor(args: StreamingOutputArgs);
    args: StreamingOutputArgs;
    streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription>;
    mashes: Mashes;
    get outputSize(): Size;
}
declare class VideoStreamOutputClass extends StreamingOutputClass implements VideoStreamOutput {
    args: VideoStreamOutputArgs;
}
declare const outputDefaultAudio: (overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultVideo: (overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultImageSequence: (overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultWaveform: (overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultPng: (overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultImage: (overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultPopulate: (overrides: RenderingCommandOutput) => RenderingCommandOutput;
declare const outputDefaultRendering: (outputType: OutputType, overrides?: CommandOutput | undefined) => RenderingCommandOutput;
declare const outputDefaultTypeByFormat: {
    wav: OutputType;
    mdash: OutputType;
    flv: OutputType;
    hls: OutputType;
    jpeg: OutputType;
    mp3: OutputType;
    mp4: OutputType;
    image2: OutputType;
    rtmp: OutputType;
    yuv4mpegpipe: OutputType;
};
declare const outputDefaultFormatByType: {
    audio: OutputFormat;
    image: OutputFormat;
    video: OutputFormat;
    imagesequence: OutputFormat;
    waveform: OutputFormat;
};
declare const outputDefaultStreaming: (overrides: CommandOutput) => StreamingCommandOutput;
declare const outputDefaultHls: (overrides?: CommandOutput | undefined) => StreamingCommandOutput;
declare const outputDefaultDash: (overrides?: CommandOutput | undefined) => StreamingCommandOutput;
declare const outputDefaultRtmp: (overrides?: CommandOutput | undefined) => StreamingCommandOutput;
declare enum ActivityType {
    Analyze = "analyze",
    Complete = "complete",
    Error = "error",
    Load = "load",
    Render = "render"
}
interface ActivityInfo {
    id: string;
    type: ActivityType;
    label?: string;
    steps?: number;
    step?: number;
    error?: string;
    value?: string;
}
declare const arrayLast: (array: AnyArray) => any;
declare const arraySet: (array: AnyArray, items: AnyArray) => AnyArray;
declare const arrayReversed: (array: AnyArray) => any[];
declare const arrayUnique: (array: AnyArray) => any[];
declare const colorRgbKeys: string[];
declare const colorRgbaKeys: string[];
declare const colorTransparent = "#00000000";
declare const colorBlack = "#000000";
declare const colorWhite = "#FFFFFF";
declare const colorWhiteTransparent = "#FFFFFF00";
declare const colorBlackTransparent = "#00000000";
declare const colorWhiteOpaque = "#FFFFFFFF";
declare const colorBlackOpaque = "#000000FF";
declare const colorGreen = "#00FF00";
declare const colorYellow = "#FFFF00";
declare const colorRed = "#FF0000";
declare const colorBlue = "#0000FF";
declare enum Color {
    Transparent = "#00000000",
    Black = "#000000",
    White = "#FFFFFF",
    WhiteTransparent = "#FFFFFF00",
    BlackTransparent = "#00000000",
    WhiteOpaque = "#FFFFFFFF",
    BlackOpaque = "#000000FF",
    Green = "#00FF00",
    Yellow = "#FFFF00",
    Red = "#FF0000",
    Blue = "#0000FF"
}
declare const Colors: Color[];
declare const colorName: (color: string) => string;
declare const rgbValue: (value: string | number) => number;
declare const rgbNumeric: (rgb: RgbObject) => Rgb;
declare const yuvNumeric: (rgb: YuvObject) => Yuv;
declare const colorYuvToRgb: (yuv: YuvObject) => Rgb;
declare const colorRgbToHex: (rgb: RgbObject) => string;
declare const colorRgbaToHex: (object: RgbaObject) => string;
declare const colorYuvDifference: (fromYuv: Yuv, toYuv: Yuv, similarity: number, blend: number) => number;
declare const colorYuvBlend: (yuvs: YuvObject[], yuv: YuvObject, similarity: number, blend: number) => number;
declare const colorRgbToYuv: (rgb: RgbObject) => Yuv;
declare const colorRgbRegex: RegExp;
declare const colorRgbaRegex: RegExp;
declare const colorHexRegex: RegExp;
declare const colorStrip: (color: string) => string;
declare const colorValid: (color: string) => boolean;
declare const colorValidHex: (value: string) => boolean;
declare const colorValidRgba: (value: string) => boolean;
declare const colorValidRgb: (value: string) => boolean;
declare const getChunksFromString: (st: string, chunkSize: number) => RegExpMatchArray | null;
declare const hex256: (hexStr: string) => number;
declare const colorAlpha: (value?: number | undefined) => number;
declare const colorHexToRgba: (hex: string) => Rgba;
declare const colorHexToRgb: (hex: string) => Rgb;
declare const colorRgbaToRgba: (value: string) => Rgba;
declare const colorToRgb: (value: string) => Rgb;
declare const colorToRgba: (value: string) => Rgba;
declare const colorAlphaColor: (value: string) => AlphaColor;
declare const colorFromRgb: (rgb: Rgb) => string;
declare const colorFromRgba: (object: Rgba) => string;
declare const colorRgb: Rgb;
declare const colorRgba: Rgba;
declare const colorRgbaTransparent: Rgba;
declare const colorServer: (color: string) => string;
declare const colorRgbDifference: (rgb: Rgb | Rgba) => Rgb | Rgba;
declare const commandFilesInputIndex: (commandFiles: CommandFiles, id: string) => number;
declare const commandFilesInput: (commandFiles: CommandFiles, id: string, visible?: boolean | undefined) => string;
declare const eventStop: (event: Event) => void;
declare const fetchCallback: (apiCallback: ApiCallback) => Promise<any>;
declare const idGenerateString: () => string;
declare const idPrefixSet: (prefix: string) => void;
declare const idTemporary: () => string;
declare const idGenerate: (prefix?: string) => string;
declare const idIsTemporary: (id: string) => boolean;
declare const isObject: (value: any) => value is Object;
declare function assertObject(value: any, name?: string): asserts value is Object;
declare const isString: (value: any) => value is string;
declare function assertString(value: any, name?: string): asserts value is string;
declare const isUndefined: (value: any) => boolean;
declare const isNumberOrNaN: (value: any) => value is number;
declare function assertNumber(value: any, name?: string): asserts value is number;
declare const isBoolean: (value: any) => value is boolean;
declare function assertBoolean(value: any, name?: string): asserts value is Boolean;
declare const isMethod: (value: any) => boolean;
declare const isDefined: (value: any) => boolean;
declare function assertDefined(value: any, name?: string): asserts value is true;
declare const isNan: (value: any) => boolean;
declare const isNumber: (value: any) => value is number;
declare const isInteger: (value: any) => boolean;
declare const isFloat: (value: any) => boolean;
declare const isPositive: (value: any) => value is number;
declare function assertPositive(value: any, name?: string): asserts value is number;
declare const isBelowOne: (value: any) => value is number;
declare const isAboveZero: (value: any) => value is number;
declare function assertAboveZero(value: any, name?: string): asserts value is number;
declare const isArray: (value: any) => value is AnyArray;
declare function assertArray(value: any, name?: string): asserts value is AnyArray;
declare const isPopulatedString: (value: any) => value is PopulatedString;
declare function assertPopulatedString(value: any, name?: string): asserts value is PopulatedString;
declare const isPopulatedArray: (value: any) => value is AnyArray;
declare function assertPopulatedArray(value: any, name?: string): asserts value is AnyArray;
declare const isPopulatedObject: (value: any) => boolean;
declare function assertPopulatedObject(value: any, name?: string): asserts value is Object;
declare const isNumeric: (value: any) => boolean;
declare function assertTrue(value: any, name?: string): asserts value is true;
declare const isRgb: (value: any) => value is Rgb;
declare function assertRgb(value: any, name?: string): asserts value is Rgb;
declare const isTime: (value: any) => value is Time;
declare function assertTime(value: any, name?: string): asserts value is Time;
declare const isTimeRange: (value: any) => value is TimeRange;
declare function assertTimeRange(value: any, name?: string): asserts value is TimeRange;
declare const isValue: (value: any) => value is Value;
declare const isTrueValue: (value: any) => value is Value;
declare function assertValue(value: any, name?: string): asserts value is Value;
declare const isValueObject: (value: any) => value is ValueObject;
declare function assertValueObject(value: any, name?: string): asserts value is ValueObject;
declare const pixelRgbaAtIndex: (index: number, pixels: Pixels) => Rgba;
declare const pixelNeighboringRgbas: (pixel: number, data: Pixels, size: Size) => Rgba[];
declare const pixelColor: (value: Value) => string;
declare const pixelPerFrame: (frames: number, width: number, zoom?: number) => number;
declare const pixelFromFrame: (frame: number, perFrame: number, rounding?: string) => number;
declare const pixelToFrame: (pixels: number, perFrame: number, rounding?: string) => number;
declare function pixelsMixRbga(fromRgba: Rgba, toRgba: Rgba, amountToMix?: number): Rgba;
declare function pixelsMixRbg(fromRgb: Rgb, toRgb: Rgb, amountToMix?: number): Rgb;
declare const pixelsRemoveRgba: (pixels: Uint8ClampedArray, size: Size, rgb: Rgb, similarity?: number, blend?: number, accurate?: boolean) => void;
declare const pixelsReplaceRgba: (pixels: Uint8ClampedArray, size: Size, find: Rgb, replace: Rgba, similarity?: number, blend?: number, accurate?: boolean) => void;
declare const roundMethod: (rounding?: string) => NumberConverter;
declare const roundWithMethod: (number: number, method?: string) => number;
declare const sortByFrame: (a: WithFrame, b: WithFrame) => number;
declare const sortByIndex: (a: WithIndex, b: WithIndex) => number;
declare const sortByTrack: (a: WithTrack, b: WithTrack) => number;
declare const sortByLabel: (a: WithLabel, b: WithLabel) => number;
declare const svgId: (id: string) => string;
declare const svgUrl: (id: string) => string;
declare const svgGroupElement: (dimensions?: any, id?: string) => SVGGElement;
declare const svgSetDimensions: (element: SvgItem, dimensions: any) => void;
declare const svgSetTransformPoint: (element: SvgItem, point: Point | any) => void;
declare const svgRectPoints: (dimensions: any) => Point[];
declare const svgPolygonElement: (dimensions: any, className?: string | string[] | undefined, fill?: string, id?: string | undefined) => SVGPolygonElement;
declare const svgSetBox: (element: SvgItem, boxSize: Size) => void;
declare const svgElement: (size?: Size | undefined, svgItems?: SvgItem | SvgItems | undefined) => SVGSVGElement;
declare const svgSetDimensionsLock: (element: SvgItem, dimensions: any, lock?: Orientation | undefined) => void;
declare const svgImageElement: () => SVGImageElement;
declare const svgPathElement: (path: string, fill?: string) => SVGPathElement;
declare const svgMaskElement: (size?: Size | undefined, contentItem?: SvgItem | undefined, luminance?: boolean | undefined) => SVGMaskElement;
declare const svgFilter: (values: StringObject, dimensions?: any) => SvgFilter;
declare const svgAppend: (element: Element, items?: SvgItem | SvgItems | undefined) => void;
declare const svgPatternElement: (dimensions: Size, id: string, items?: SvgItem | SvgItems | undefined) => SVGPatternElement;
declare const svgDefsElement: (svgItems?: SvgItems | undefined) => SVGDefsElement;
declare const svgFeImageElement: (id?: string | undefined, result?: string | undefined) => SVGFEImageElement;
declare const svgFilterElement: (filters?: SvgFilters | undefined, filtered?: SvgItem | SvgItems | undefined, rect?: any, units?: string) => SVGFilterElement;
declare const svgDifferenceDefs: (overlayId: string, filtered: SvgItem | SvgItems) => SVGFilterElement;
declare const svgSet: (element: SvgItem, value?: string | undefined, name?: string) => void;
declare const svgAddClass: (element: Element, className?: string | string[] | undefined) => void;
declare const svgUseElement: (href?: string | undefined, className?: string | undefined, id?: string | undefined) => SVGUseElement;
declare const svgSetTransform: (element: SvgItem, transform: string, origin?: string) => void;
declare const svgTransform: (dimensions: Rect | Size, rect: Rect) => string;
declare const svgSetTransformRects: (element: SvgItem, dimensions: Rect | Size, rect: Rect) => void;
declare const svgFunc: (type: string, values: string) => SVGElement;
declare const svgSetChildren: (element: Element, svgItems: SvgItems) => void;
declare const stringSeconds: (seconds: number, fps?: number, lengthSeconds?: number) => string;
declare const stringFamilySizeRect: (string: string, family: string, size: number) => Rect;
declare const stringPluralize: (count: number, value: string, suffix?: string) => string;
declare const throwError: (value: any, expected: string, name?: string) => never;
declare const urlEndpoint: (endpoint?: Endpoint) => Endpoint;
declare const urlIsObject: (url: string) => boolean;
declare const urlIsHttp: (url: string) => boolean;
declare const urlHasProtocol: (url: string) => boolean;
declare const urlCombine: (url: string, path: string) => string;
declare const urlFromEndpoint: (endpoint: Endpoint) => string;
declare const urlForEndpoint: (endpoint: Endpoint, suffix?: string) => string;
declare const urlIsRootProtocol: (protocol: string) => boolean;
declare const urlProtocol: (string: string) => string;
declare const urlParse: (string: string) => string[];
declare const urlsParsed: (string: string) => string[][];
declare const urlsAbsolute: (string: string, endpoint: Endpoint) => string[][];
declare const urlOptionsObject: (options?: string | undefined) => ScalarObject | undefined;
declare const urlOptions: (options?: ScalarObject | undefined) => string;
declare const urlPrependProtocol: (protocol: string, url: string, options?: ScalarObject | undefined) => string;
export { Value, Scalar, PopulatedString, ValueObject, NumberObject, BooleanObject, UnknownObject, StringObject, ScalarObject, StringsObject, RegExpObject, ObjectUnknown, VisibleContextData, VisibleContextElement, AudibleContextData, Context2D, Pixels, LoadedImage, LoadedVideo, LoadedSvgImage, LoadedAudio, LoadedFont, AudibleSource, FfmpegSvgFilter, SvgFilter, SvgFilters, LoadedImageOrVideo, SvgItem, SvgItems, SvgItemsTuple, PreviewItem, PreviewItems, SvgOrImage, VisibleSource, CanvasVisibleSource, Timeout, Interval, LoadFontPromise, LoadImagePromise, LoadVideoPromise, LoadAudioPromise, NumberConverter, StringSetter, NumberSetter, BooleanSetter, BooleanGetter, EventHandler, AnyArray, JsonValue, JsonObject, WithFrame, WithIndex, WithTrack, WithLabel, Rgb, Rgba, AlphaColor, AndType, AndId, AndLabel, LabelAndId, WithError, AndTypeAndId, AndTypeAndValue, RgbObject, RgbaObject, YuvObject, Yuv, Constrained, GenericFactory, StartOptions, Endpoint, UploadDescription, InputParameter, DescribedObject, Described, isCustomEvent, ApiVersion, ApiRequest, ApiResponse, ApiRequestInit, EndpointPromiser, ApiCallback, ApiCallbacks, ApiServerInit, ApiCallbacksRequest, ApiCallbacksResponse, ApiCallbackResponse, ApiServersRequest, ApiServersResponse, DataPutResponse, DataGetRequest, DataPutRequest, DataRetrieveResponse, DataServerInit, DataRetrieve, DataDefinitionPutRequest, DataDefinitionPutResponse, DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse, DataDefinitionDeleteRequest, DataDefinitionDeleteResponse, DataMashPutRequest, DataMashPutResponse, DataMashDefinitions, DataMashRetrieveRequest, DataMashGetResponse, DataMashDefaultRequest, DataMashDefaultResponse, DataMashDeleteRequest, DataMashDeleteResponse, DataCastDefinitions, DataCastRelations, DataCastDefaultRequest, DataDefaultRequest, DataCastDefaultResponse, DataDefaultResponse, DataCastPutRequest, DataCastPutResponse, DataCastDeleteRequest, DataCastDeleteResponse, DataCastGetRequest, DataMashGetRequest, DataStreamGetRequest, DataCastGetResponse, DataDefinitionGetRequest, DataDefinitionGetResponse, DataCastRetrieveRequest, DataMashRetrieveResponse, DataCastRetrieveResponse, DataStreamRetrieveResponse, DataStreamDefinitions, DataStreamPutRequest, DataStreamPutResponse, DataStreamGetResponse, DataStreamRetrieveRequest, DataStreamDeleteRequest, DataStreamDeleteResponse, Endpoints, FileStoreRequest, FileStoreResponse, CommandInput, CommandInputs, CommandOptions, CommandDescription, RenderingResult, RenderingDescription, CommandDescriptions, RenderingState, RenderingStatus, RenderingInput, RenderingOptions, RenderingStartRequest, RenderingStartResponse, RenderingStatusRequest, RenderingStatusResponse, RenderingUploadRequest, RenderingUploadResponse, StreamingStartRequest, StreamingStartResponse, StreamingStatusRequest, StreamingStatusResponse, StreamingPreloadRequest, StreamingPreloadResponse, StreamingCutRequest, StreamingCutResponse, StreamingSaveRequest, StreamingSaveResponse, StreamingDeleteRequest, StreamingDeleteResponse, StreamingListRequest, StreamingListResponse, StreamingWebrtcRequest, StreamingWebrtcResponse, StreamingRtmpRequest, StreamingRtmpResponse, StreamingRemoteRequest, StreamingRemoteResponse, StreamingLocalRequest, StreamingLocalResponse, StreamingDescription, Defined, PropertyTweenSuffix, Propertied, PropertiedChangeHandler, PropertiedClass, isPropertied, DefaultContainerId, TextContainerId, ContainerObject, isContainerObject, assertContainerObject, ContainerDefinitionObject, ContainerDefinition, isContainerDefinition, ContainerRectArgs, Container, isContainer, assertContainer, ContainerClass, ContainerDefinitionClass, ContainerFactory, ContainerMixin, ContainerDefinitionMixin, ShapeContainerObject, ShapeContainerDefinitionObject, ShapeContainer, isShapeContainer, ShapeContainerDefinition, ShapeContainerFactory, ShapeContainerClass, ShapeContainerDefinitionClass, TextContainerObject, TextContainerDefinitionObject, TextContainer, isTextContainer, assertTextContainer, TextContainerDefinition, TextContainerFactory, TextContainerClass, TextContainerDefinitionClass, containerDefaults, containerDefinition, containerDefinitionFromId, containerInstance, containerFromId, DefaultContentId, ContentObject, ContentDefinitionObject, ContentRectArgs, Content, isContent, assertContent, ContentDefinition, isContentDefinition, ContentClass, ContentDefinitionClass, ContentFactory, ContentDefinitionMixin, ContentMixin, ColorContentObject, ColorContentDefinitionObject, ColorContent, isColorContent, ColorContentDefinition, ColorContentFactory, ColorContentClass, ColorContentDefinitionClass, contentDefaults, contentDefinition, contentDefinitionFromId, contentInstance, contentFromId, AudibleContextSource, AudibleContext, AudibleContextInstance, ContextFactory, DefinitionObject, isDefinitionObject, DefinitionObjects, Definition, Definitions, DefinitionClass, DefinitionTimes, isDefinition, assertDefinition, DefinitionBase, FactoryObject, Factories, Factory, EditedDescription, EditedObject, EditedArgs, Edited, isEdited, assertEdited, EditedClass, FilterGraphArgs, FilterGraph, FilterGraphInputVisible, FilterGraphInputAudible, FilterGraphClass, FilterGraphs, FilterGraphsOptions, FilterGraphsArgs, FilterGraphsClass, DefinitionReferenceObject, MashDescription, MashObject, DefinitionReferenceObjects, MashAndDefinitionsObject, isMashAndDefinitionsObject, MashArgs, Mash, Mashes, isMash, assertMash, MashClass, mashInstance, isMashClass, assertMashClass, AudioPreviewArgs, AudioPreview, NonePreview, PreviewOptions, PreviewArgs, Preview, PreviewClass, TrackPreviewArgs, TrackPreview, TrackPreviews, TrackPreviewHandleSize, TrackPreviewLineSize, TrackPreviewClass, TrackObject, TrackArgs, Track, isTrack, assertTrack, Tracks, trackInstance, TrackFactory, TrackClass, ClipObject, isClipObject, IntrinsicOptions, ClipDefinitionObject, Clip, isClip, assertClip, Clips, ClipDefinition, ClipFactory, ClipDefinitionClass, clipDefault, clipDefaultId, clipDefaults, clipDefinition, clipDefinitionFromId, clipInstance, clipFromId, ClipClass, CastObject, CastArgs, Cast, CastClass, castInstance, isCast, assertCast, LayerObject, isLayerObject, LayerFolderObject, isLayerFolderObject, LayerMashObject, isLayerMashObject, LayerArgs, LayerMashArgs, LayerFolderArgs, LayerObjects, LayerMash, LayerFolder, Layer, Layers, LayersAndIndex, LayerAndPosition, LayerClass, LayerFolderClass, LayerMashClass, layerFolderInstance, layerMashInstance, layerInstance, isLayer, assertLayer, isLayerMash, assertLayerMash, isLayerFolder, assertLayerFolder, Streams, StreamObject, Stream, Trigger, Triggers, ActionOptions, ActionObject, ActionMethod, Action, isAction, assertAction, ActionInit, isActionInit, ActionEvent, isActionEvent, actionInstance, ActionFactory, AddClipToTrackActionObject, AddClipToTrackAction, AddEffectActionObject, AddEffectAction, AddLayerActionObject, AddLayerAction, AddTrackActionObject, AddTrackAction, ChangeActionObject, isChangeActionObject, ChangeAction, isChangeAction, assertChangeAction, ChangeFramesAction, ChangeMultipleActionObject, ChangeMultipleAction, MoveClipActionObject, MoveClipAction, MoveEffectActionObject, MoveEffectAction, MoveLayerAction, RemoveClipActionObject, RemoveClipAction, RemoveLayerAction, Actions, EditorIndex, EditorArgs, EditorOptions, ClipOrEffect, CastData, MashData, EditedData, isCastData, isMashData, assertMashData, Editor, EditorClass, editorSingleton, editorArgs, editorInstance, EditorSelectionObject, EditorSelection, EditorSelectionClass, editorSelectionInstance, Selectable, Selectables, SelectableRecord, SelectTypesObject, AlphamergeFilter, ChromaKeyFilter, ColorChannelMixerFilter, ColorFilter, ColorizeFilter, ConvolutionFilter, Numbers, NumbersOrUndefined, NumberOrUndefined, ConvolutionRgba, ConvolutionChannel, ConvolutionRgbaObject, ConvolutionRgbasObject, ConvolutionNumberObject, ConvolutionNumbersObject, StringOrUndefined, ConvolutionStringObject, ConvolutionKey, ConvolutionNumbersKey, ConvolutionObject, ConvolutionServerFilter, isConvolutionServerFilter, assertConvolutionServerFilter, CropFilter, FpsFilter, OpacityFilter, OverlayFilter, ScaleFilter, SetptsFilter, SetsarFilter, TextFilter, TrimFilter, FilterObject, FilterDefinitionObject, Filter, Filters, FilterDefinition, FilterFactory, FilterDefinitionClass, FilterIdPrefix, filterDefaults, filterDefinition, filterDefinitionFromId, filterInstance, filterFromId, FilterClass, Emitter, PropertyTypesNumeric, propertyTypeIsString, propertyTypeDefault, propertyTypeValid, propertyTypeCoerce, Time, TimeRange, Times, TimeRanges, timeEqualizeRates, TimeClass, timeRangeFromArgs, timeRangeFromSeconds, timeRangeFromTime, timeRangeFromTimes, timeFromArgs, timeFromSeconds, TimeRangeClass, InstanceObject, isInstanceObject, Instance, isInstance, InstanceClass, InstanceBase, LoadedMedia, isLoadedVideo, isLoadedImage, isLoadedAudio, ErrorObject, DefinitionOrErrorObject, Loaded, CommandProbeStream, CommandProbeFormat, CommandProbeData, LoadedInfo, LoaderType, isLoaderType, assertLoaderType, LoaderPath, isLoaderPath, assertLoaderPath, LoaderFile, LoaderFiles, LoaderCache, Loader, LoaderClass, BrowserLoaderClass, AudioObject, Audio, isAudio, AudioDefinitionObject, AudioDefinition, isAudioDefinition, AudioFactory, AudioDefinitionClass, audioDefinition, audioDefinitionFromId, audioInstance, audioFromId, AudioClass, EffectDefinitionClass, EffectClass, effectDefinition, effectDefaults, effectDefinitionFromId, effectInstance, effectFromId, EffectObject, Effect, isEffect, assertEffect, Effects, EffectDefinitionObject, EffectDefinition, isEffectDefinition, EffectFactory, FontObject, Font, FontDefinitionObject, FontDefinition, isFontDefinition, assertFontDefinition, FontFactory, FontDefinitionClass, fontDefinition, fontDefault, fontDefaults, fontDefinitionFromId, fontInstance, fontFromId, FontClass, ImageObject, ImageDefinitionObject, Image, ImageDefinition, isImageDefinition, ImageFactory, ImageDefinitionClass, imageDefinition, imageDefinitionFromId, imageInstance, imageFromId, ImageClass, VideoObject, Video, VideoDefinitionObject, VideoDefinition, isVideoDefinition, isVideo, assertVideo, VideoFactory, VideoDefinitionClass, videoDefinition, videoDefinitionFromId, videoInstance, videoFromId, VideoClass, VideoSequenceObject, VideoSequence, VideoSequenceDefinitionObject, VideoSequenceDefinition, VideoSequenceFactory, VideoSequenceDefinitionClass, videoSequenceDefinition, videoSequenceDefinitionFromId, videoSequenceInstance, videoSequenceFromId, VideoSequenceClass, ModularObject, Modular, ModularDefinitionObject, ModularDefinition, ModularClass, ModularDefinitionClass, ModularMixin, ModularDefinitionMixin, PreloadableObject, PreloadableDefinitionObject, PreloadableDefinition, isPreloadableDefinition, assertPreloadableDefinition, Preloadable, isPreloadable, assertPreloadable, PreloadableClass, PreloadableDefinitionClass, PreloadableDefinitionMixin, PreloadableMixin, UpdatableSizeDefinitionType, UpdatableSizeObject, UpdatableSizeDefinitionObject, UpdatableSize, isUpdatableSize, assertUpdatableSize, isUpdatableSizeType, UpdatableSizeDefinition, isUpdatableSizeDefinition, assertUpdatableSizeDefinition, UpdatableSizeClass, UpdatableSizeDefinitionClass, UpdatableSizeMixin, UpdatableSizeDefinitionMixin, UpdatableDurationDefinitionTypes, UpdatableDurationObject, UpdatableDurationDefinitionObject, UpdatableDuration, isUpdatableDuration, assertUpdatableDuration, isUpdatableDurationType, UpdatableDurationDefinition, isUpdatableDurationDefinition, assertUpdatableDurationDefinition, UpdatableDurationClass, UpdatableDurationDefinitionClass, UpdatableDurationMixin, UpdatableDurationDefinitionMixin, TweenableObject, TweenableDefinitionObject, Tweenable, isTweenable, assertTweenable, TweenableDefinition, isTweenableDefinition, assertTweenableDefinition, TweenableClass, TweenableDefinitionClass, TweenableDefinitionMixin, TweenableMixin, CommandFilter, CommandFilters, GraphFilter, GraphFilters, FilterValueObject, FilterValueObjects, GraphFileBase, GraphFileOptions, GraphFileArgs, ColorTuple, CommandFileOptions, CommandFileArgs, VisibleCommandFileArgs, CommandFilterArgs, VisibleCommandFilterArgs, FilterArgs, FilterCommandFilterArgs, FilterDefinitionArgs, FilterDefinitionCommandFilterArgs, GraphFile, GraphFiles, CommandFile, CommandFiles, DefinitionRecord, VoidMethod, AudioOutputClass, ImageOutputClass, ImageSequenceOutputClass, CommandOutput, RenderingCommandOutput, CommandOutputs, StreamingCommandOutput, OutputConstructorArgs, StreamingOutputArgs, RenderingOutputArgs, RenderingOutput, StreamingOutput, ImageOutputArgs, ImageOutput, AudioOutputArgs, AudioOutput, WaveformOutputArgs, WaveformOutput, VideoOutputArgs, VideoOutput, ImageSequenceOutputArgs, ImageSequenceOutput, VideoStreamOutputArgs, VideoStreamOutput, outputInstanceAudio, outputInstanceImage, outputInstanceVideo, outputInstanceVideoSequence, outputInstanceWaveform, OutputFactory, RenderingOutputClass, StreamingOutputClass, VideoOutputClass, VideoStreamOutputClass, WaveformOutputClass, outputDefaultAudio, outputDefaultVideo, outputDefaultImageSequence, outputDefaultWaveform, outputDefaultPng, outputDefaultImage, outputDefaultPopulate, outputDefaultRendering, outputDefaultTypeByFormat, outputDefaultFormatByType, outputDefaultStreaming, outputDefaultHls, outputDefaultDash, outputDefaultRtmp, ExtHls, ExtTs, ExtRtmp, ExtDash, ExtJpeg, ExtPng, ExtJson, ExtText, OutputFilterGraphPadding, EmptyMethod, NamespaceSvg, NamespaceXhtml, NamespaceLink, IdPrefix, IdSuffix, ClassDisabled, ClassButton, ClassCollapsed, ClassSelected, ClassDropping, ClassDroppingBefore, ClassDroppingAfter, Default, DirectionLabels, DroppingPosition, LayerType, LayerTypes, isLayerType, assertLayerType, ActionType, EditType, EditTypes, isEditType, assertEditType, AVType, SelectType, SelectTypes, isSelectType, assertSelectType, ClipSelectType, ClipSelectTypes, isClipSelectType, OutputFormat, StreamingFormat, OutputType, OutputTypes, FillType, FillTypes, isFillType, GraphFileType, GraphFileTypes, isGraphFileType, LoadType, LoadTypes, isLoadType, assertLoadType, UploadTypes, isUploadType, DefinitionType, DefinitionTypes, isDefinitionType, assertDefinitionType, SizingDefinitionType, SizingDefinitionTypes, isSizingDefinitionType, TimingDefinitionType, TimingDefinitionTypes, isTimingDefinitionType, ContainerType, ContainerTypes, isContainerType, assertContainerType, ContentType, ContentTypes, isContentType, assertContentType, DefinitionTypesObject, DataType, DataTypes, isDataType, assertDataType, Orientation, Orientations, isOrientation, Direction, Directions, isDirection, assertDirection, DirectionObject, Anchor, Anchors, TriggerType, TriggerTypes, isTriggerType, TransformType, EventType, EventTypes, isEventType, MoveType, MasherAction, GraphType, ServerType, ServerTypes, Duration, Timing, Timings, Sizing, Sizings, Errors, ParameterObject, Parameter, DataGroup, DataGroups, isDataGroup, assertDataGroup, PropertyObject, Property, isProperty, assertProperty, propertyInstance, ActivityType, ActivityInfo, arrayLast, arraySet, arrayReversed, arrayUnique, colorRgbKeys, colorRgbaKeys, colorTransparent, colorBlack, colorWhite, colorWhiteTransparent, colorBlackTransparent, colorWhiteOpaque, colorBlackOpaque, colorGreen, colorYellow, colorRed, colorBlue, Color, Colors, colorName, rgbValue, rgbNumeric, yuvNumeric, colorYuvToRgb, colorRgbToHex, colorRgbaToHex, colorYuvDifference, colorYuvBlend, colorRgbToYuv, colorRgbRegex, colorRgbaRegex, colorHexRegex, colorStrip, colorValid, colorValidHex, colorValidRgba, colorValidRgb, getChunksFromString, hex256, colorAlpha, colorHexToRgba, colorHexToRgb, colorRgbaToRgba, colorToRgb, colorToRgba, colorAlphaColor, colorFromRgb, colorFromRgba, colorRgb, colorRgba, colorRgbaTransparent, colorServer, colorRgbDifference, commandFilesInputIndex, commandFilesInput, eventStop, fetchCallback, idGenerateString, idPrefixSet, idTemporary, idGenerate, idIsTemporary, isObject, assertObject, isString, assertString, isUndefined, isNumberOrNaN, assertNumber, isBoolean, assertBoolean, isMethod, isDefined, assertDefined, isNan, isNumber, isInteger, isFloat, isPositive, assertPositive, isBelowOne, isAboveZero, assertAboveZero, isArray, assertArray, isPopulatedString, assertPopulatedString, isPopulatedArray, assertPopulatedArray, isPopulatedObject, assertPopulatedObject, isNumeric, assertTrue, isRgb, assertRgb, isTime, assertTime, isTimeRange, assertTimeRange, isValue, isTrueValue, assertValue, isValueObject, assertValueObject, pixelRgbaAtIndex, pixelNeighboringRgbas, pixelColor, pixelPerFrame, pixelFromFrame, pixelToFrame, pixelsMixRbga, pixelsMixRbg, pixelsRemoveRgba, pixelsReplaceRgba, Point, isPoint, assertPoint, PointTuple, pointsEqual, PointZero, pointCopy, pointRound, pointString, pointValueString, pointNegate, Rect, isRect, assertRect, Rects, RectTuple, rectsEqual, RectZero, rectFromSize, rectsFromSizes, rectCopy, rectRound, centerPoint, rectString, roundMethod, roundWithMethod, Selected, EffectAddHandler, EffectMoveHandler, EffectRemovehandler, SelectedProperty, isSelectedProperty, SelectedEffects, SelectedItems, SelectedProperties, SelectedPropertyObject, selectedPropertyObject, selectedPropertiesScalarObject, Size, isSize, assertSize, sizesEqual, Sizes, SizeTuple, SizeZero, sizedEven, sizeEven, sizeRound, sizeCeil, sizeFloor, sizeScale, sizeCover, sizeAboveZero, assertSizeAboveZero, SizeOutput, SizePreview, SizeIcon, sizeCopy, sizeLock, sizeString, sizeLockNegative, sizeFromElement, sortByFrame, sortByIndex, sortByTrack, sortByLabel, svgId, svgUrl, svgGroupElement, svgSetDimensions, svgSetTransformPoint, svgRectPoints, svgPolygonElement, svgSetBox, svgElement, svgSetDimensionsLock, svgImageElement, svgPathElement, svgMaskElement, svgFilter, svgAppend, svgPatternElement, svgDefsElement, svgFeImageElement, svgFilterElement, svgDifferenceDefs, svgSet, svgAddClass, svgUseElement, svgSetTransform, svgTransform, svgSetTransformRects, svgFunc, svgSetChildren, stringSeconds, stringFamilySizeRect, stringPluralize, Tweening, tweenPad, tweenNumberStep, tweenColorStep, tweenColors, tweenRects, tweenMaxSize, tweenMinSize, tweenOption, tweenableRects, tweenPosition, tweenNumberObject, tweenOverRect, tweenOverPoint, tweenOverSize, tweenScaleSizeToRect, tweenCoverSizes, tweenCoverPoints, tweenRectLock, tweenRectsLock, tweenScaleSizeRatioLock, tweeningPoints, tweenMinMax, tweenInputTime, throwError, urlEndpoint, urlIsObject, urlIsHttp, urlHasProtocol, urlCombine, urlFromEndpoint, urlForEndpoint, urlIsRootProtocol, urlProtocol, urlParse, urlsParsed, urlsAbsolute, urlOptionsObject, urlOptions, urlPrependProtocol };
//# sourceMappingURL=moviemasher.d.ts.map