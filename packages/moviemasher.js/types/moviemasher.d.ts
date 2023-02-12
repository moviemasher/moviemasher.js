/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}
type Value = number | string;
type Scalar = Value | boolean | undefined;
type PopulatedString = string & {
    isEmpty: never;
};
type Integer = number;
interface ValueRecord extends Record<string, Value> {
}
interface NumberRecord extends Record<string, number> {
}
interface UnknownRecord extends Record<string, unknown> {
}
interface ScalarRecord extends Record<string, Scalar> {
}
interface StringRecord extends Record<string, string> {
}
interface StringsRecord extends Record<string, string[]> {
}
interface NestedStringRecord extends Record<string, string | StringRecord | NestedStringRecord> {
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
type AnyArray = any[];
type JsonValue = Scalar | AnyArray | UnknownRecord;
interface JsonRecord extends Record<string, JsonRecord | JsonValue | JsonValue[]> {
}
interface Identified {
    id: string;
}
declare const isIdentified: (value: any) => value is Identified;
declare function assertIdentified(value: any, name?: string): asserts value is Identified;
// search includes '?' prefix
// protocol includes ':' suffix
interface Endpoint {
    protocol?: string;
    pathname?: string;
    hostname?: string;
    search?: string;
    port?: number;
}
declare const isEndpoint: (value: any) => value is Endpoint;
interface ErrorObject {
    message: string;
    name: string;
    cause?: unknown;
}
interface PotentialError {
    error?: ErrorObject;
}
interface DefiniteError extends Required<PotentialError> {
}
interface PathOrError extends PotentialError {
    path?: string;
}
type AudioType = "audio";
type EffectType = "effect";
type FontType = "font";
type ImageType = "image";
type MashType = "mash";
type SequenceType = "sequence";
type VideoType = "video";
type AudioStreamType = "audiostream";
type VideoStreamType = "videostream";
type JsonType = "json";
declare const AudioType: AudioType;
declare const EffectType: EffectType;
declare const FontType: FontType;
declare const ImageType: ImageType;
declare const MashType: MashType;
declare const SequenceType: SequenceType;
declare const VideoType: VideoType;
declare const AudioStreamType: AudioStreamType;
declare const VideoStreamType: VideoStreamType;
declare const JsonType: JsonType;
type MediaType = AudioType | EffectType | FontType | ImageType | MashType | SequenceType | VideoType;
declare const MediaTypes: MediaType[];
declare const isMediaType: (value: any) => value is MediaType;
declare function assertMediaType(value?: any, name?: string): asserts value is MediaType;
type TranscodeType = AudioType | FontType | ImageType | VideoType | SequenceType;
declare const TranscodeTypes: MediaType[];
declare const isTranscodeType: (type?: any) => type is TranscodeType;
declare function assertTranscodeType(value: any, name?: string): asserts value is TranscodeType;
// export enum TranscodeType {
//   Audio = 'audio',
//   Image = 'image',
//   ImageSequence = 'imagesequence',
//   Video = 'video',
//   Waveform = 'waveform',
// }
// export const TranscodeTypes = Object.values(TranscodeType)
// export const isTranscodeType = (type?: any): type is TranscodeType => {
//   return isPopulatedString(type) && TranscodeTypes.includes(type as TranscodeType)
// }
type CookedType = EffectType | MashType;
type CookedTypes = CookedType[];
declare const CookedTypes: CookedTypes;
declare const isCookedType: (type?: any) => type is CookedType;
type RawType = AudioType | FontType | ImageType | VideoType;
type RawTypes = RawType[];
declare const RawTypes: RawTypes;
declare const isRawType: (type?: any) => type is RawType;
type LoadType = RawType | JsonType;
declare const LoadTypes: LoadType[];
declare const isLoadType: (type?: any) => type is LoadType;
declare function assertLoadType(value: any, name?: string): asserts value is LoadType;
type SizingMediaType = FontType | ImageType | VideoType | SequenceType;
declare const SizingMediaTypes: SizingMediaType[];
declare const isSizingMediaType: (type?: any) => type is SizingMediaType;
type TimingMediaType = AudioType | VideoType | SequenceType;
declare const TimingMediaTypes: TimingMediaType[];
declare const isTimingMediaType: (type?: any) => type is TimingMediaType;
type ContainerType = FontType | ImageType | SequenceType;
declare const ContainerTypes: ContainerType[];
declare const isContainerType: (type?: any) => type is ContainerType;
declare function assertContainerType(value?: any, name?: string): asserts value is ContainerType;
type ContentType = ImageType | VideoType | SequenceType | AudioType;
declare const ContentTypes: ContentType[];
declare const isContentType: (type?: any) => type is ContentType;
declare function assertContentType(value?: any, name?: string): asserts value is ContentType;
type MediaTypesObject = Record<string, MediaType[]>;
declare const StreamKind = "stream";
type EditType = ImageType | VideoType | SequenceType | AudioType | VideoStreamType | AudioStreamType;
declare const EditTypes: EditType[];
declare const isEditType: (type?: any) => type is EditType;
declare function assertEditType(value: any, name?: string): asserts value is EditType;
declare enum DroppingPosition {
    At = "at",
    After = "after",
    Before = "before",
    None = "none"
}
type FolderType = "folder";
declare const FolderType: FolderType;
type TrackType = "track";
declare const TrackType: TrackType;
type LayerType = MashType | FolderType | TrackType;
declare const LayerTypes: LayerType[];
declare const isLayerType: (value: any) => value is LayerType;
declare function assertLayerType(value: any, name?: string): asserts value is LayerType;
declare enum ActionType {
    AddClipToTrack = "addClipToTrack",
    AddTrack = "addTrack",
    Change = "change",
    ChangeFrame = "changeFrame",
    ChangeMultiple = "changeMultiple",
    Move = "move",
    MoveClip = "moveClip",
    RemoveClip = "removeClip"
}
declare enum AVType {
    Audio = "audio",
    Both = "both",
    Video = "video"
}
declare enum SelectType {
    Clip = "clip",
    Container = "container",
    Content = "content",
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
declare enum ProbeType {
    Alpha = "alpha",
    Audio = "audio",
    Duration = "duration",
    Size = "size"
}
declare enum DecodeType {
    Probe = "probe"
}
declare const DecodeTypes: DecodeType.Probe[];
declare const isDecodeType: (type?: any) => type is DecodeType;
type EncodeType = AudioType | ImageType | VideoType | FontType | SequenceType;
declare const EncodeTypes: EncodeType[];
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
declare enum DataType {
    Boolean = "boolean",
    ContainerId = "containerid",
    ContentId = "contentid",
    DefinitionId = "definitionid",
    FontId = "fontid",
    Frame = "frame",
    Icon = "icon",
    Number = "number",
    Percent = "percent",
    Rgb = "rgb",
    String = "string",
    Option = "option"
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
    Frame = "frame",
    Fps = "ratechange",
    Loaded = "loadeddata",
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
declare enum ServerType {
    Api = "api",
    Data = "data",
    File = "file",
    Rendering = "rendering",
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
declare enum Clicking {
    Show = "show",
    Hide = "hide",
    Play = "play"
}
declare const Clickings: Clicking[];
interface Framed {
    frame: number;
}
interface Indexed {
    index: number;
}
interface Tracked {
    trackNumber: number;
}
interface Labeled {
    label: string;
}
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
declare const sizeLock: (lockSize: Size, lock?: Orientation) => Size;
declare const sizeString: (size: Size) => string;
declare const sizeLockNegative: (size: Size, lock?: Orientation) => Size;
declare const sizeFromElement: (element: Element) => Size;
type Constrained<T = UnknownRecord> = new (...args: any[]) => T;
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
    frameTimes: Times;
    includes(frame: number): boolean;
    intersection(time: Time): TimeRange | undefined;
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
declare const ExtHls = "m3u8";
declare const ExtTs = "ts";
declare const ExtRtmp = "flv";
declare const ExtDash = "dash";
declare const ExtJpeg = "jpg";
declare const ExtPng = "png";
declare const ExtJson = "json";
declare const ExtText = "txt";
declare const ExtCss = "css";
declare const ContentTypeJson = "application/json";
declare const ContentTypeCss = "text/css";
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
declare const ClassItem = "item";
declare const ClassButton = "button";
declare const ClassCollapsed = "collapsed";
declare const ClassSelected = "selected";
declare const ClassDropping = "dropping";
declare const ClassDroppingBefore = "dropping-before";
declare const ClassDroppingAfter = "dropping-after";
interface ParameterObject {
    name: string;
    value: Value | ValueRecord[];
    values?: Value[];
    dataType?: DataType | string;
}
declare class Parameter {
    constructor({ name, value, dataType, values }: ParameterObject);
    dataType: DataType;
    name: string;
    toJSON(): UnknownRecord;
    value: Value | ValueRecord[];
    values?: Value[];
}
declare enum DataGroup {
    // Clicking = 'clicking',
    Color = "color",
    // Controls = 'controls',
    Effects = "effects",
    Opacity = "opacity",
    Point = "point",
    Size = "size",
    Timing = "timing"
}
declare const DataGroups: DataGroup[];
declare const isDataGroup: (value?: any) => value is DataGroup;
declare function assertDataGroup(value: any, name?: string): asserts value is DataGroup;
interface PropertyBase {
    custom?: boolean;
    defaultValue: Scalar;
    group?: DataGroup;
    max?: number;
    min?: number;
    name: string;
    step?: number;
    tweenable?: boolean;
    options?: Scalar[];
}
interface Property extends PropertyBase {
    type: DataType;
}
interface PropertyObject extends Partial<PropertyBase> {
    type?: DataType | string;
}
declare const isProperty: (value: any) => value is Property;
declare function assertProperty(value: any, name?: string): asserts value is Property;
declare const propertyInstance: (object: PropertyObject) => Property;
declare const PropertyTweenSuffix = "End";
interface Propertied {
    addProperties(object: any, ...properties: Property[]): void;
    properties: Property[];
    setValue(value: Scalar, name: string, property?: Property): void;
    setValues(object: ScalarRecord): void;
    toJSON(): UnknownRecord;
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
    protected propertiesInitialize(object: any): void;
    propertyFind(name: string): Property | undefined;
    private propertyName;
    private propertySetOrDefault;
    protected propertyTweenSetOrDefault(object: any, property: Property): void;
    setValue(value: Scalar, name: string, property?: Property): void;
    setValues(object: ScalarRecord): void;
    toJSON(): UnknownRecord;
    value(key: string): Scalar;
}
declare const isPropertied: (value: any) => value is Propertied;
interface FilterArgs {
    propertied?: Propertied;
}
type FilterRecord = Record<string, FilterDefinition>;
declare const Filters: FilterRecord;
interface FilterObject {
    id?: string;
    parameters?: ParameterObject[];
    definition?: FilterDefinition;
    label?: string;
}
interface FilterDefinitionObject extends Identified {
}
interface Filter extends Propertied {
    commandFiles(args: FilterCommandFileArgs): CommandFiles;
    commandFilters(args: FilterCommandFilterArgs): CommandFilters;
    definition: FilterDefinition;
    filterSvgFilter(): SvgFilters;
    filterSvgs(args?: FilterArgs): SvgItems;
    parametersDefined: Parameter[];
    scalarObject(tweening?: boolean): ScalarRecord;
}
interface FilterDefinition extends Identified {
    commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles;
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters;
    filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems;
    instanceFromObject(object?: FilterObject): Filter;
    parameters: Parameter[];
    properties: Property[];
    toJSON(): UnknownRecord;
}
declare const isFilterDefinition: (value: any) => value is FilterDefinition;
declare function assertFilterDefinition(value: any, name?: string): asserts value is FilterDefinition;
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
declare const rectFromSize: (size: Size, point?: Point) => Rect;
declare const rectsFromSizes: (sizes: SizeTuple, points?: PointTuple) => RectTuple;
declare const rectCopy: (rect: any) => {
    width: any;
    height: any;
    x: number;
    y: number;
};
declare const rectRound: (rect: Rect) => Rect;
declare const centerPoint: (size: Size, inSize: Size) => Point;
declare const rectString: (dimensions: any) => string;
interface RectOptions extends Partial<Rect> {
    lock?: Orientation;
}
declare const isLoadedVideo: (value: any) => value is LoadedVideo;
declare function assertLoadedVideo(value: any, name?: string): asserts value is LoadedVideo;
declare const isLoadedImage: (value: any) => value is LoadedImage;
declare function assertLoadedImage(value: any, name?: string): asserts value is LoadedImage;
declare const isLoadedAudio: (value: any) => value is LoadedAudio;
declare function assertLoadedAudio(value: any, name?: string): asserts value is LoadedAudio;
declare const isLoadedFont: (value: any) => value is LoadedFont;
declare function assertLoadedFont(value: any, name?: string): asserts value is LoadedFont;
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
interface LoadedInfo extends PotentialError {
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
declare const isClientMedia: (value: any) => value is LoadedMedia;
declare function assertClientMedia(value: any, name?: string): asserts value is LoadedMedia;
interface CommandInput {
    source: string;
    options?: ValueRecord;
}
type CommandInputs = CommandInput[];
interface CommandFilter {
    avType?: AVType;
    ffmpegFilter: string;
    inputs: string[];
    outputs: string[];
    options: ValueRecord;
}
type CommandFilters = CommandFilter[];
interface GraphFilter extends CommandFilter {
    filter: Filter;
}
type GraphFilters = GraphFilter[];
interface FilterValueObject {
    filter: Filter;
    valueObject: ValueRecord;
}
type FilterValueObjects = FilterValueObject[];
interface PreloadOptionsBase {
    audible?: boolean;
    editing?: boolean;
    visible?: boolean;
    icon?: boolean;
    streaming?: boolean;
    time: Time;
}
interface ServerPromiseArgs {
    streaming?: boolean;
    visible?: boolean;
    audible?: boolean;
    time: Time;
}
interface PreloadArgs extends PreloadOptionsBase {
    quantize: number;
    clipTime: TimeRange;
}
interface PreloadOptions extends Partial<PreloadOptionsBase> {
    quantize?: number;
    clipTime?: TimeRange;
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
}
interface VisibleCommandFilterArgs extends CommandFilterArgs {
    outputSize: Size;
    containerRects: RectTuple;
    duration: number;
}
interface FilterCommandFilterArgs extends FilterArgs {
    commandFiles?: CommandFiles;
    chainInput?: string;
    filterInput?: string;
    dimensions?: Size;
    videoRate: number;
    duration: number;
}
interface FilterCommandFileArgs extends FilterArgs {
    outputSize: Size;
    containerRects: RectTuple;
    clipTime: TimeRange;
    streaming?: boolean;
    visible?: boolean;
    time: Time;
    quantize: number;
    contentColors?: ColorTuple;
    videoRate: number;
    duration: number;
}
interface FilterDefinitionArgs extends FilterArgs {
    filter: Filter;
}
interface FilterDefinitionCommandFilterArgs extends FilterCommandFilterArgs {
    filter: Filter;
}
interface FilterDefinitionCommandFileArgs extends FilterCommandFileArgs {
    filter: Filter;
}
interface GraphFile {
    type: LoaderType;
    file: string;
    content?: string;
    input?: boolean;
    definition: Media;
    resolved?: string;
}
type GraphFiles = GraphFile[];
interface CommandFile extends GraphFile {
    options?: ValueRecord;
    inputId: string;
}
type CommandFiles = CommandFile[];
type VoidMethod = typeof EmptyMethod;
declare enum Component {
    Browser = "browser",
    Player = "player",
    Inspector = "inspector",
    Timeline = "timeline"
}
interface Output {
    request?: RequestObject;
}
declare const isOutput: (value: any) => value is Output;
interface DecodingObject {
    info?: LoadedInfo;
}
type DecodingObjects = DecodingObject[];
interface Decoding {
    info?: LoadedInfo;
}
type Decodings = Decoding[];
interface Typed {
    type: string;
}
declare const isTyped: (value: any) => value is Typed;
declare function assertTyped(value: any, name?: string): asserts value is Typed;
interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
    createdAt?: string;
    request?: RequestObject;
    kind?: string;
}
declare const isRequestableObject: (value: any) => value is RequestableObject;
interface Requestable extends Propertied, Identified, Typed {
    request: RequestObject;
    createdAt: string;
    loadType: LoadType;
    loadedMediaPromise: Promise<ClientMediaOrError>;
    loadedMedia?: LoadedMedia;
    kind: string;
}
declare const isRequestable: (value: any) => value is Requestable;
declare class RequestableClass extends PropertiedClass implements Requestable {
    constructor(object: RequestableObject);
    createdAt: string;
    id: string;
    kind: string;
    get loadType(): LoadType;
    loadedMedia?: LoadedMedia;
    get loadedMediaPromise(): Promise<ClientMediaOrError>;
    request: RequestObject;
    type: string;
    toJSON(): UnknownRecord;
}
interface TranscodingObject extends RequestableObject {
    type?: TranscodeType | string;
    purpose?: string;
}
type TranscodingObjects = TranscodingObject[];
interface Transcoding extends Requestable {
    type: TranscodeType;
    purpose: string;
}
type Transcodings = Transcoding[];
declare const isTranscoding: (value: any) => value is Transcoding;
interface MediaInstanceObject extends UnknownRecord {
    mediaId?: string;
    definition?: Media;
    label?: string;
}
declare const isMediaInstanceObject: (value?: any) => value is MediaInstanceObject;
interface MediaInstance extends Identified, Propertied {
    definition: Media;
    mediaId: string;
    definitionIds(): string[];
    label: string;
    type: MediaType;
    unload(): void;
}
declare const isMediaInstance: (value?: any) => value is MediaInstance;
type MediaInstanceClass = Constrained<MediaInstance>;
interface MediaObject extends RequestableObject {
    file?: File;
    type?: MediaType | string;
    transcodings?: TranscodingObjects;
    decodings?: DecodingObjects;
    label?: string;
}
declare const isMediaObject: (value: any) => value is MediaObject;
type MediaObjects = MediaObject[];
interface MediaObjectOrError extends PotentialError {
    mediaObject?: MediaObject;
}
interface Media extends Requestable {
    type: MediaType;
    transcodings: Transcodings;
    decodings: Decodings;
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: MediaInstanceObject): MediaInstance;
    instanceArgs(object?: MediaInstanceObject): MediaInstanceObject;
    file?: File;
    isVector: boolean;
    label: string;
    preferredTranscoding(...types: MediaType[]): Requestable;
    properties: Property[];
    toJSON(): UnknownRecord;
    loadPromise(args: PreloadArgs): Promise<void>;
    unload(): void;
}
type MediaArray = Media[];
declare const isMedia: (value: any) => value is Media;
declare function assertMedia(value: any, name?: string): asserts value is Media;
type MediaClass = Constrained<Media>;
type MediaFactoryMethod = (_: MediaObject) => Media;
type IndexHandler<OBJECT = any, INDEX = number> = (effect: OBJECT, insertIndex?: INDEX) => void;
declare class Emitter extends EventTarget {
    dispatch(type: EventType, detail?: UnknownRecord): void;
    emit(type: EventType, detail?: UnknownRecord): void;
    enqueue(type: EventType, detail?: UnknownRecord): void;
    event(type: EventType, detail?: UnknownRecord): CustomEvent;
    private queue;
    trap(type: EventType, listener?: EventListener): void;
    private trapped;
}
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
    // containerSvgFilter(svgItem: SvgItem, previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SVGFilterElement | undefined
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
    previewItemsPromise(content: Content, containerRect: Rect, previewSize: Size, time: Time, range: TimeRange, component: Component): Promise<PreviewItems>;
    containerSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    translateCommandFilters(args: CommandFilterArgs): CommandFilters;
    width: number;
    x: number;
    y: number;
}
declare const isContainer: (value?: any) => value is Container;
declare function assertContainer(value?: any): asserts value is Container;
type ContainerClass = Constrained<Container>;
type ContainerDefinitionClass = Constrained<ContainerDefinition>;
interface Selected {
    selectType: SelectType;
    name?: string;
}
interface SelectedProperty extends Selected {
    property: Property;
    changeHandler: PropertiedChangeHandler;
    value: Scalar;
}
declare const isSelectedProperty: (value: any) => value is SelectedProperty;
interface SelectedMovable extends Selected {
    value: Movables;
    moveHandler: IndexHandler<Movable>;
    removeHandler: IndexHandler<Movable>;
    addHandler: IndexHandler<Movable>;
}
type SelectedItems = Array<SelectedProperty | SelectedMovable>;
type SelectedProperties = Array<SelectedProperty>;
type SelectedPropertyObject = Record<string, SelectedProperty>;
declare const selectedPropertyObject: (properties: SelectedItems, group: DataGroup, selectType: SelectType) => SelectedPropertyObject;
declare const selectedPropertiesScalarObject: (byName: SelectedPropertyObject) => ScalarRecord;
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
interface IntrinsicOptions {
    editing?: boolean;
    size?: boolean;
    duration?: boolean;
}
interface ClipObject extends UnknownRecord {
    containerId?: string;
    contentId?: string;
    content?: ContentObject;
    container?: ContainerObject;
    frame?: number;
    timing?: string;
    sizing?: string;
    frames?: number;
    label?: string;
}
declare const isClipObject: (value: any) => value is ClipObject;
interface ClipArgs extends ClipObject {
}
interface ClipDefinitionObject {
}
interface Clip extends Selectable, Propertied {
    audible: boolean;
    clipCommandFiles(args: CommandFileArgs): CommandFiles;
    clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined;
    commandFilters(args: CommandFilterArgs): CommandFilters;
    container?: Container;
    containerId: string;
    content: Content;
    contentId: string;
    definitionIds(): string[];
    endFrame: number;
    frame: number;
    frames: number;
    id: string;
    intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    label: string;
    loadPromise(args: PreloadArgs): Promise<void>;
    maxFrames(quantize: number, trim?: number): number;
    mutable: boolean;
    muted: boolean;
    notMuted: boolean;
    previewItemsPromise(size: Size, time: Time, component: Component): Promise<PreviewItems>;
    rects(args: ContainerRectArgs): RectTuple;
    resetTiming(tweenable?: Tweenable, quantize?: number): void;
    serverPromise(args: ServerPromiseArgs): Promise<void>;
    sizing: Sizing;
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
interface TrackObject extends UnknownRecord {
    clips?: ClipObject[];
    dense?: boolean;
    index?: number;
}
interface TrackArgs extends TrackObject {
    mashMedia: MashMedia;
}
interface Track extends Propertied, Selectable, Indexed {
    addClips(clip: Clips, insertIndex?: number): void;
    assureFrame(clips?: Clips): boolean;
    assureFrames(quantize: number, clips?: Clips): void;
    clips: Clips;
    dense: boolean;
    frameForClipNearFrame(clip: Clip, frame?: number): number;
    frames: number;
    identifier: string;
    mash: MashMedia;
    removeClips(clip: Clips): void;
    sortClips(clips?: Clips): boolean;
}
declare const isTrack: (value?: any) => value is Track;
declare function assertTrack(value: any, name?: string): asserts value is Track;
type Tracks = Track[];
declare function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T;
declare function ContainerDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContainerDefinitionClass & T;
declare const UpdatableSizeMediaType: MediaType[];
interface UpdatableSizeObject extends PreloadableObject {
}
interface UpdatableSizeDefinitionObject extends PreloadableDefinitionObject {
    sourceSize?: Size;
    previewSize?: Size;
}
interface UpdatableSize extends Preloadable {
    svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
    svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
}
declare const isUpdatableSize: (value?: any) => value is UpdatableSize;
declare function assertUpdatableSize(value?: any): asserts value is UpdatableSize;
declare const isUpdatableSizeType: (value: any) => value is MediaType;
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
    definition?: ImageDefinition;
}
interface ImageDefinitionObject extends MediaObject, UpdatableSizeDefinitionObject {
}
type ImageTransitionalObject = MediaObject | ImageDefinitionObject;
interface Image extends Content, Container, UpdatableSize {
    definition: ImageDefinition;
}
declare const isImage: (value: any) => value is Image;
interface ImageDefinition extends Media, UpdatableSizeDefinition {
    type: ImageType;
    instanceFromObject(object?: ImageObject): Image;
    loadedImage?: LoadedImage;
}
declare const isImageDefinition: (value: any) => value is ImageDefinition;
interface ShapeContainerObject extends ImageObject {
}
interface ShapeContainerDefinitionObject extends ImageDefinitionObject {
    pathWidth?: number;
    pathHeight?: number;
    path?: string;
}
interface ShapeContainer extends Image {
    definition: ShapeContainerDefinition;
}
declare const isShapeContainer: (value: any) => value is ShapeContainer;
interface ShapeContainerDefinition extends ImageDefinition {
    path: string;
    pathWidth: number;
    pathHeight: number;
    instanceFromObject(object?: ShapeContainerObject): ShapeContainer;
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
declare const tweenRectStep: (rect: Rect, rectEnd: Rect, frame: number, frames: number) => Rect;
declare const tweenColors: (color: Scalar, colorEnd: Scalar, frames: number) => string[];
declare const tweenRects: (rect: Rect, rectEnd: Rect | undefined, frames: number) => Rect[];
declare const tweenMaxSize: (size: Size, sizeEnd?: any) => Size;
declare const tweenMinSize: (size: Size, sizeEnd?: any) => Size;
declare const tweenOption: (optionStart: Scalar, optionEnd: Scalar, pos: string, round?: boolean) => Value;
declare const tweenableRects: (rect: Rect, rectEnd?: Rect) => rectEnd is Rect;
declare const tweenPosition: (videoRate: number, duration: number, frame?: string) => string;
declare const tweenNumberObject: (object: any) => NumberRecord;
declare const tweenOverRect: (rect: Rect, rectEnd?: any) => Rect;
declare const tweenOverPoint: (point: Point, pointEnd: any) => Point;
declare const tweenOverSize: (point: Size, pointEnd: any) => Size;
declare const tweenScaleSizeToRect: (size: Size | any, rect: Rect | any, offDirections?: DirectionObject) => Rect;
declare const tweenCoverSizes: (inSize: Size, outSize: Size | SizeTuple, scales: SizeTuple) => SizeTuple;
declare const tweenCoverPoints: (scaledSizes: SizeTuple, outSize: Size | SizeTuple, scales: PointTuple) => PointTuple;
declare const tweenRectLock: (rect: Rect, lock?: Orientation) => Rect;
declare const tweenRectsLock: (rects: RectTuple, lock?: Orientation) => RectTuple;
declare const tweenScaleSizeRatioLock: (scale: Rect, outputSize: Size, inRatio: number, lock?: Orientation | string) => Rect;
declare const tweeningPoints: (tweenable?: Tweenable) => boolean;
declare const tweenMinMax: (value: number, min: number, max: number) => number;
declare const tweenInputTime: (timeRange: TimeRange, onEdge?: boolean, nearStart?: boolean, endDefined?: boolean, endSelected?: boolean) => Time | undefined;
declare class MediaInstanceBase extends PropertiedClass implements MediaInstance {
    constructor(...args: any[]);
    definition: Media;
    get mediaId(): string;
    definitionIds(): string[];
    protected _id?: string;
    get id(): string;
    protected _label: string;
    get label(): string;
    set label(value: string);
    toJSON(): UnknownRecord;
    get type(): MediaType;
    unload(): void;
}
type Color = Rgb | Rgba;
type ColorObject = RgbObject | RgbaObject;
interface Rgb extends NumberRecord {
    r: number;
    g: number;
    b: number;
}
interface Rgba extends Rgb {
    a: number;
}
interface RgbObject extends ValueRecord {
    r: Value;
    g: Value;
    b: Value;
}
interface RgbaObject extends RgbObject {
    a: Value;
}
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
declare const colorRgbToHex: (rgb: RgbObject) => string;
declare const colorRgbaToHex: (object: RgbaObject) => string;
declare const colorValid: (color: string) => boolean;
declare const colorValidHex: (value: string) => boolean;
declare const colorToRgb: (value: string) => Rgb;
declare const colorToRgba: (value: string) => Rgba;
declare const colorFromRgb: (rgb: Rgb) => string;
declare const colorRgbDifference: (rgb: Rgb | Rgba) => Rgb | Rgba;
declare function colorMixRbga(fromRgba: Rgba, toRgba: Rgba, amountToMix?: number): Rgba;
declare function colorMixRbg(fromRgb: Rgb, toRgb: Rgb, amountToMix?: number): Rgb;
/**
 *
 * @param endpoint
 * @returns absolute URL from potentially relative endpoint
 */
declare const endpointUrl: (endpoint: Endpoint) => string;
declare const endpointFromAbsolute: (urlString: string) => Endpoint;
declare const endpointFromUrl: (urlString: string) => Endpoint;
declare const endpointIsAbsolute: (endpoint: Endpoint) => boolean;
/**
 *
 * @param endpoint
 * @returns endpoint if absolute, otherwise endpoint relative to base URL
 */
declare const endpointAbsolute: (endpoint: Endpoint) => Endpoint;
declare const ErrorName: {
    readonly Environment: "error.environment";
    readonly DecodeProbe: "decode.probe";
    readonly Unknown: "error.unknown";
    readonly Internal: "error.internal";
    readonly Type: "error.type";
    readonly Reference: "error.reference";
    readonly Range: "error.range";
    readonly Syntax: "error.syntax";
    readonly Url: "error.url";
    readonly Evaluation: "error.evaluation";
    readonly ClientDisabledDelete: "client.disabled.delete";
    readonly ClientDisabledGet: "client.disabled.get";
    readonly ClientDisabledList: "client.disabled.list";
    readonly ClientDisabledSave: "client.disabled.save";
    readonly ImportType: "import.type";
    readonly ImportDuration: "import.duration";
    readonly ImportSize: "import.size";
    readonly ImportFile: "import.file";
    readonly ServerAuthentication: "server.authentication";
    readonly ServerAuthorization: "server.authorization";
    readonly FilterId: "filter.id";
    readonly MediaId: "media.id";
    readonly Unimplemented: "error.unimplemented";
    readonly Frame: "error.frame";
    readonly OutputDuration: "output.duration";
    readonly OutputDimensions: "output.dimensions";
};
type ErrorName = (typeof ErrorName)[keyof typeof ErrorName];
type ErrorNames = ErrorName[];
declare const ErrorNames: ErrorNames;
declare const StandardErrorName: {
    Error: "error.unknown";
    EvalError: "error.evaluation";
    InternalError: "error.internal";
    RangeError: "error.range";
    ReferenceError: "error.reference";
    SyntaxError: "error.syntax";
    TypeError: "error.type";
    URIError: "error.url";
};
type StandardErrorName = (typeof StandardErrorName)[keyof typeof StandardErrorName];
type ErrorContext = ValueRecord | string | undefined;
declare const isErrorName: (value: any) => value is ErrorName;
declare const errorMessage: (name: ErrorName, context?: ErrorContext) => string;
declare const errorObject: (message: string, name?: string, cause?: unknown) => ErrorObject;
declare const errorObjectCaught: (error: any) => ErrorObject;
declare const errorName: (name: ErrorName, context?: ErrorContext) => ErrorObject;
declare const error: (code: ErrorName, context?: ErrorContext) => DefiniteError;
declare const errorCaught: (error: any) => DefiniteError;
declare const errorPromise: (name: ErrorName, context?: ErrorContext) => Promise<DefiniteError & any>;
declare const errorThrow: (value: any, type?: string, property?: string) => never;
declare const PropertyTypesNumeric: DataType[];
declare const propertyTypeIsString: (dataType: DataType) => boolean;
declare const propertyTypeDefault: (dataType: DataType) => Scalar;
declare const propertyTypeValid: (value: Scalar, dataType: DataType) => boolean;
declare const propertyTypeCoerce: (value: Scalar, dataType: DataType) => Scalar;
declare const svgElement: () => SVGSVGElement;
declare const svgElementInitialize: (value: SVGSVGElement) => void;
declare const svgId: (id: string) => string;
declare const svgUrl: (id: string) => string;
declare const svgGroupElement: (dimensions?: any, id?: string) => SVGGElement;
declare const svgSetDimensions: (element: SvgItem, dimensions: any) => void;
declare const svgSetTransformPoint: (element: SvgItem, point: Point | any) => void;
declare const svgRectPoints: (dimensions: any) => Point[];
declare const svgPolygonElement: (dimensions: any, className?: string | string[], fill?: string, id?: string) => SVGPolygonElement;
declare const svgSetBox: (element: SvgItem, boxSize: Size) => void;
declare const svgSvgElement: (size?: Size, svgItems?: SvgItem | SvgItems) => SVGSVGElement;
declare const svgSetDimensionsLock: (element: SvgItem, dimensions: any, lock?: Orientation) => void;
declare const svgImageElement: () => SVGImageElement;
declare const svgPathElement: (path: string, fill?: string) => SVGPathElement;
declare const svgMaskElement: (size?: Size, contentItem?: SvgItem, luminance?: boolean) => SVGMaskElement;
declare const svgFilter: (values: StringRecord, dimensions?: any) => SvgFilter;
declare const svgAppend: (element: Element, items?: SvgItem | SvgItems) => void;
declare const svgPatternElement: (dimensions: Size, id: string, items?: SvgItem | SvgItems) => SVGPatternElement;
declare const svgDefsElement: (svgItems?: SvgItems) => SVGDefsElement;
declare const svgFeImageElement: (id?: string, result?: string) => SVGFEImageElement;
declare const svgFilterElement: (filters?: SvgFilters, filtered?: SvgItem | SvgItems, rect?: any, units?: string) => SVGFilterElement;
declare const svgDifferenceDefs: (overlayId: string, filtered: SvgItem | SvgItems) => SVGFilterElement;
declare const svgSet: (element: SvgItem, value?: string, name?: string) => void;
declare const svgAddClass: (element: Element, className?: string | string[]) => void;
declare const svgUseElement: (href?: string, className?: string, id?: string) => SVGUseElement;
declare const svgSetTransform: (element: SvgItem, transform: string, origin?: string) => void;
declare const svgTransform: (dimensions: Rect | Size, rect: Rect) => string;
declare const svgSetTransformRects: (element: SvgItem, dimensions: Rect | Size, rect: Rect) => void;
declare const svgFunc: (type: string, values: string) => SVGElement;
declare const svgSetChildren: (element: Element, svgItems: SvgItems) => void;
declare const svgImagePromise: (url: string) => Promise<SVGImageElement>;
declare const svgText: (string: string, family: string, size: number, transform: string) => SVGTextElement;
declare const svgImagePromiseWithOptions: (url: string, options: RectOptions) => Promise<SVGImageElement>;
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
declare const timeRangeFromTimes: (startTime: Time, endTime?: Time) => TimeRange;
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
    intersection(time: Time): TimeRange | undefined;
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
declare const MediaDefaults: Record<MediaType, MediaArray>;
declare const MediaFactories: Record<MediaType, MediaFactoryMethod>;
declare const mediaDefinition: (object: MediaObject) => Media;
interface AudioPreview {
    adjustClipGain(clip: Clip, quantize: number): void;
    buffer: number;
    bufferClips(clips: Clip[], quantize: number): boolean;
    seconds: number;
    setGain(value: number, quantize: number): void;
    startContext(): void;
    startPlaying(time: Time, clips: Clip[], quantize: number): boolean;
    stopContext(): void;
    stopPlaying(): void;
}
interface AudioPreviewArgs {
    buffer?: number;
    gain?: number;
}
interface StartOptions {
    duration: number;
    offset?: number;
    start: number;
}
declare const UpdatableDurationMediaTypes: MediaType[];
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
}
interface UpdatableDuration extends Preloadable {
    gain: number;
    gainPairs: number[][];
    speed: number;
    startOptions(seconds: number, timeRange: TimeRange): StartOptions;
}
declare const isUpdatableDuration: (value?: any) => value is UpdatableDuration;
declare function assertUpdatableDuration(value?: any, name?: string): asserts value is UpdatableDuration;
declare const isUpdatableDurationType: (value: any) => value is MediaType;
interface UpdatableDurationDefinition extends PreloadableDefinition {
    audibleSource(): AudibleSource | undefined;
    audio: boolean;
    audioUrl: string;
    duration: number;
    frames(quantize: number): number;
    loadedAudio?: LoadedAudio;
    loadedAudioPromise: Promise<LoadedAudio>;
    loop: boolean;
}
declare const isUpdatableDurationDefinition: (value?: any) => value is UpdatableDurationDefinition;
declare function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition;
type UpdatableDurationClass = Constrained<UpdatableDuration>;
type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>;
interface AudioObject extends ContentObject, UpdatableDurationObject {
    definition?: AudioDefinition;
}
interface Audio extends Content, UpdatableDuration {
    definition: AudioDefinition;
}
declare const isAudio: (value: any) => value is Audio;
interface AudioDefinitionObject extends MediaObject, UpdatableDurationDefinitionObject {
}
interface AudioDefinition extends Media, UpdatableDurationDefinition {
    type: AudioType;
    instanceFromObject(object?: AudioObject): Audio;
}
declare const isAudioDefinition: (value: any) => value is AudioDefinition;
declare class MediaBase extends RequestableClass implements Media {
    constructor(object: MediaObject);
    type: MediaType;
    unload(): void;
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    file?: File | undefined;
    findTranscoding(type: MediaType, ...kind: string[]): Transcoding | undefined;
    instanceFromObject(object?: MediaInstanceObject): MediaInstance;
    instanceArgs(object?: MediaInstanceObject): MediaInstanceObject;
    isVector: boolean;
    label: string;
    loadPromise(args: PreloadArgs): Promise<void>;
    preferredTranscoding(...types: MediaType[]): Requestable;
    serverPromise(args: ServerPromiseArgs): Promise<void>;
    toJSON(): UnknownRecord;
    transcodings: Transcodings;
    properties: Property[];
    decodings: Decodings;
    serverPath: string;
}
declare function PreloadableDefinitionMixin<T extends ContentDefinitionClass>(Base: T): PreloadableDefinitionClass & T;
declare function PreloadableMixin<T extends ContentClass>(Base: T): PreloadableClass & T;
declare function TweenableDefinitionMixin<T extends MediaClass>(Base: T): TweenableDefinitionClass & T;
declare function TweenableMixin<T extends MediaInstanceClass>(Base: T): TweenableClass & T;
declare function UpdatableDurationMixin<T extends PreloadableClass>(Base: T): UpdatableDurationClass & T;
declare function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T;
declare function UpdatableSizeMixin<T extends PreloadableClass>(Base: T): UpdatableSizeClass & T;
declare function UpdatableSizeDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableSizeDefinitionClass & T;
declare const AudioDefinitionWithUpdatableDuration: UpdatableDurationDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class AudioDefinitionClass extends AudioDefinitionWithUpdatableDuration implements AudioDefinition {
    constructor(object: AudioDefinitionObject);
    instanceFromObject(object?: AudioObject): Audio;
    loadPromise(args: PreloadArgs): Promise<void>;
    type: "audio";
}
declare const audioDefinition: (object: AudioDefinitionObject) => AudioDefinition;
declare const audioDefinitionFromId: (id: string) => AudioDefinition;
declare const audioInstance: (object: AudioObject) => Audio;
declare const audioFromId: (id: string) => Audio;
declare const AudioWithUpdatableDuration: UpdatableDurationClass & PreloadableClass & ContentClass & TweenableClass & typeof MediaInstanceBase;
declare class AudioClass extends AudioWithUpdatableDuration implements Audio {
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    definition: AudioDefinition;
    mutable(): boolean;
}
declare const EffectContainerDefinitionWithContainer: ContainerDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class EffectDefinitionClass extends EffectContainerDefinitionWithContainer implements EffectDefinition {
    constructor(object: EffectDefinitionObject);
    filters: Filter[];
    finalizeFilter?: Filter;
    initializeFilter?: Filter;
    instanceArgs(object: EffectObject): EffectObject;
    instanceFromObject(object: EffectObject): Effect;
    toJSON(): UnknownRecord;
    type: "effect";
}
declare const actionInstance: (object: ActionObject) => Action;
declare const ActionFactory: {
    createFromObject: (object: ActionObject) => Action;
};
interface AddTrackActionObject extends ActionObject {
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
interface ChangeActionObject extends ActionObject {
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
    undoValues: ScalarRecord;
    redoValues: ScalarRecord;
}
/**
 * @category Action
 */
declare class ChangeMultipleAction extends ChangeAction {
    constructor(object: ChangeMultipleActionObject);
    redoAction(): void;
    redoValues: ScalarRecord;
    undoAction(): void;
    updateAction(object: ChangeMultipleActionObject): void;
    undoValues: ScalarRecord;
}
interface MoveActionObject extends ActionObject {
    objects: any[];
    redoObjects: any[];
    undoObjects: any[];
}
interface MoveActionOptions extends Partial<MoveActionObject> {
}
/**
 * @category Action
 */
declare class MoveAction extends Action {
    constructor(object: MoveActionObject);
    objects: any[];
    redoObjects: any[];
    redoAction(): void;
    undoAction(): void;
    undoObjects: any[];
}
declare const isMoveAction: (value: any) => value is MoveAction;
declare function assertMoveAction(value: any, name?: string): asserts value is MoveAction;
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
interface RemoveClipActionObject extends ActionObject {
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
declare class MediaCollection {
    constructor();
    id: number;
    byId: Map<string, Media>;
    private byIdAdd;
    byType(type: MediaType): MediaArray;
    define(...objects: MediaObjects): MediaArray;
    media(object: MediaObject): Media;
    private deleteFromArray;
    private mediaArraysByType;
    private mediaTypeFromId;
    fromId(id: string): Media;
    fromObject(object: MediaObject): Media;
    get ids(): string[];
    install(media: Media): Media;
    installed(id: string): boolean;
    predefined(id: string): boolean;
    undefineAll(): void;
    updateDefinition(oldDefinition: Media, newDefinition: Media): Media;
    updateDefinitionId(oldId: string, newId: string): void;
    uninstall(media: Media): Media;
}
declare class EditorClass implements Editor {
    constructor(args: EditorArgs);
    actions: Actions;
    addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>;
    addEffect(effect: Movable, index?: number): void;
    addFiles(files: File[], editorIndex?: EditorIndex): Promise<Media[]>;
    addMedia(object: MediaObject | MediaObjects, editorIndex?: EditorIndex): Promise<Media[]>;
    addTrack(): void;
    private assureMash;
    autoplay: boolean;
    private _buffer;
    get buffer(): number;
    set buffer(value: number);
    can(masherAction: MasherAction): boolean;
    private clearActions;
    get clips(): Clips;
    create(): Promise<void>;
    get currentTime(): number;
    define(objectOrArray: MediaObject | MediaObjects): void;
    get definitions(): Media[];
    get definitionsUnsaved(): Media[];
    private destroy;
    dragging: boolean;
    private drawTimeout?;
    get duration(): number;
    _editType?: EditType;
    get editType(): EditType;
    editing: boolean;
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
    load(data: MashMediaObject): Promise<void>;
    private loadMashMediaObject;
    private loadMashAndDraw;
    mashMedia: MashMedia | undefined;
    // { return this.mashMedia }
    // private mashMedia?: MashMedia
    // private get mashMediaUNUSED(): MashMedia {
    //   console.trace('mashMedia')
    //   return this.mashMedia ||= this.mashMediaInitialize
    // }
    // private get mashMediaInitialize(): MashMedia {
    //   const { mashMediaObject = { id: idTemporary() } } = this
    //   return this.mashMediaFromObject(mashMediaObject)
    // }
    private mashMediaFromObject;
    private mashMediaObject?;
    private mashMediaObjectLoadPromise;
    private _loop;
    get loop(): boolean;
    set loop(value: boolean);
    media: MediaCollection;
    move(object: ClipOrEffect, editorIndex?: EditorIndex): void;
    moveClip(clip: Clip, editorIndex?: EditorIndex): void;
    moveEffect(effect: Movable, index?: number): void;
    // moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void {
    //   const { cast } = this.selection
    //   assertCast(cast)
    //   assertLayer(layer)
    //   const redoSelection: EditorSelectionObject = { cast, layer }
    //   const options = { type: ActionType.MoveLayer, redoSelection, layerAndPosition }
    //   this.actions.create(options)
    // }
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
    readOnly: boolean;
    private _rect;
    get rect(): Rect;
    set rect(value: Rect);
    redo(): void;
    redraw(): void;
    removeClip(clip: Clip): void;
    removeEffect(effect: Movable): void;
    // removeLayer(layer: Layer): void {
    //   const { cast } = this.selection
    //   assertCast(cast)
    //   const redoSelection: EditorSelectionObject = { cast, layer }
    //   this.actions.create({ type: ActionType.RemoveLayer, redoSelection })
    // }
    removeTrack(track: Track): void;
    saved(temporaryIdLookup?: StringRecord): void;
    _selection?: EditorSelection;
    get selection(): EditorSelection;
    get svgElement(): SVGSVGElement;
    set svgElement(value: SVGSVGElement);
    previewItems(enabled?: boolean): Promise<PreviewItems>;
    get time(): Time;
    set time(value: Time);
    get timeRange(): TimeRange;
    undo(): void;
    unload(): void;
    updateDefinition(definitionObject: MediaObject, definition?: Media): Promise<void>;
    private _volume;
    get volume(): number;
    set volume(value: number);
}
declare let editorSingleton: Editor;
declare const editorArgs: (options?: EditorOptions) => EditorArgs;
declare const editorInstance: (options?: EditorOptions) => Editor;
declare class AudioPreviewClass {
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
declare const audioPreviewInstance: (args: AudioPreviewArgs) => AudioPreview;
interface PreviewOptions {
    editor?: Editor;
    time?: Time;
}
interface PreviewArgs extends PreviewOptions {
    selectedClip?: Clip;
    clip?: Clip;
    size?: Size;
    time: Time;
    mash: MashMedia;
}
interface Preview extends PreloadOptions {
    audible: boolean;
    duration: number;
    editing: boolean;
    editor?: Editor;
    quantize: number;
    selectedClip?: Clip;
    size: Size;
    svgItemsPromise: Promise<SvgItems>;
    previewItemsPromise: Promise<PreviewItems>;
    time: Time;
    visible: boolean;
}
interface TrackPreviewArgs {
    clip: Clip;
    preview: Preview;
    timeRange: TimeRange;
    tweenTime?: Time;
    icon?: boolean;
}
interface TrackPreview {
    editingSvgItem(classes: string[], inactive?: boolean): SvgItem;
    clip: Clip;
    editor: Editor;
    svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems;
    container: Container;
}
type TrackPreviews = TrackPreview[];
/**
 * Preview of a single mash at a single frame
 */
declare class PreviewClass implements Preview {
    constructor(args: PreviewArgs);
    audible: boolean;
    clip?: Clip;
    private _clips?;
    protected get clips(): Clip[];
    private get clipsInitialize();
    combine: boolean;
    get duration(): number;
    get editing(): boolean;
    editor?: Editor;
    get intrinsicSizePromise(): Promise<void>;
    mash: MashMedia;
    get previewItemsPromise(): Promise<PreviewItems>;
    get quantize(): number;
    size: Size;
    selectedClip?: Clip;
    streaming: boolean;
    private _svgItems?;
    get svgItemsPromise(): Promise<SvgItems>;
    time: Time;
    private _trackPreviews?;
    private get trackPreviews();
    protected get trackPreviewsInitialize(): TrackPreviews;
    private tupleItems;
    visible: boolean;
}
declare class NonePreview extends PreviewClass {
    protected get clips(): Clips;
}
declare const TrackPreviewHandleSize = 8;
declare const TrackPreviewLineSize = 2;
/**
 * Preview of a single track at a single frame, thus representing a single clip
 */
declare class TrackPreviewClass implements TrackPreview {
    args: TrackPreviewArgs;
    constructor(args: TrackPreviewArgs);
    get clip(): Clip;
    get container(): Container;
    editingSvgItem(classes: string[], inactive?: boolean): SvgItem;
    get editor(): Editor;
    get icon(): boolean;
    private pointerDownHandler;
    private get preview();
    private get quantize();
    private _rect?;
    private get rect();
    private get rectInitialize();
    private get size();
    svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems;
    private svgHandlePoint;
    private get time();
    private _timeRange?;
    private get timeRange();
}
declare const EffectContainerWithContainer: ContainerClass & TweenableClass & typeof MediaInstanceBase;
declare class EffectClass extends EffectContainerWithContainer {
    commandFiles(args: VisibleCommandFileArgs): CommandFiles;
    commandFilters(args: CommandFilterArgs): CommandFilters;
    definition: EffectDefinition;
    selectables(): Selectables;
    selectType: SelectType;
    selectedItems(actions: Actions): SelectedItems;
    private setFilterValues;
    svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters;
}
declare const effectDefinition: (object: EffectDefinitionObject) => EffectDefinition;
declare const effectDefinitionFromId: (id: string) => EffectDefinition;
declare const effectInstance: (object: EffectObject) => Effect;
declare const effectFromId: (id: string) => Effect;
declare const DefaultFontId: string;
interface FontDefinitionObject extends ContainerDefinitionObject, PreloadableDefinitionObject {
    string?: string;
}
interface FontObject extends ContainerObject, PreloadableObject {
}
interface Font extends Container {
    definition: FontDefinition;
    string: string;
}
declare const isFont: (value: any) => value is Font;
declare function assertFont(value: any): asserts value is Font;
interface FontDefinition extends ContainerDefinition, PreloadableDefinition {
    type: FontType;
    family: string;
    instanceFromObject(object?: FontObject): Font;
}
declare const isFontDefinition: (value: any) => value is FontDefinition;
declare function assertFontDefinition(value: any): asserts value is FontDefinition;
declare const FontContainerDefinitionWithContainer: ContainerDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class FontMediaClass extends FontContainerDefinitionWithContainer implements FontDefinition {
    constructor(object: FontDefinitionObject);
    // bytes: number = 0
    // mimeType: string = ''
    // info?: CommandProbeData | undefined
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    private _family;
    get family(): string;
    set family(value: string);
    graphFiles(args: PreloadArgs): GraphFiles;
    instanceArgs(object?: FontObject): FontObject;
    instanceFromObject(object?: FontObject): Font;
    protected _intrinsicRect?: Rect;
    private get intrinsicRect();
    private intrinsicRectInitialize;
    isVector: boolean;
    loadFontPromise(transcoding: Requestable): Promise<LoadedFont>;
    loadPromise(args: PreloadArgs): Promise<void>;
    private loadedFont?;
    // preloadUrls(args: PreloadArgs): string[] {
    //   const { visible, editing } = args
    //   if (!visible) return []
    //   const { url, source } = this
    //   return [editing ? urlPrependProtocol('font:', url) : source]
    // }
    toJSON(): UnknownRecord;
    // source = ''
    string: string;
    type: "font";
}
declare const fontFind: (id: string) => FontDefinition | undefined;
declare const fontDefinition: (object: FontDefinitionObject) => FontDefinition;
declare const fontDefault: FontDefinition;
declare const fontDefinitionFromId: (id: string) => FontDefinition;
declare const FontContainerWithContainer: ContainerClass & TweenableClass & typeof MediaInstanceBase;
declare class FontClass extends FontContainerWithContainer implements Font {
    constructor(...args: any[]);
    canColor(args: CommandFilterArgs): boolean;
    canColorTween(args: CommandFilterArgs): boolean;
    private _colorFilter?;
    get colorFilter(): Filter;
    definition: FontDefinition;
    hasIntrinsicSizing: boolean;
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    protected _intrinsicRect?: Rect;
    intrinsicRect(_?: boolean): Rect;
    private intrinsicRectInitialize;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    loadPromise(args: PreloadArgs): Promise<void>;
    pathElement(rect: Rect): SvgItem;
    setValue(value: Scalar, name: string, property?: Property): void;
    string: string;
    private _textFilter?;
    get textFilter(): Filter;
    toJSON(): UnknownRecord;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare const ImageDefinitionWithUpdatable: UpdatableSizeDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & ContainerDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class ImageDefinitionClass extends ImageDefinitionWithUpdatable implements ImageDefinition {
    constructor(object: ImageDefinitionObject);
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: ImageObject): Image;
    loadPromise(args: PreloadArgs): Promise<void>;
    loadedImage?: LoadedImage;
    type: "image";
}
declare const imageDefinition: (object: ImageDefinitionObject) => ImageDefinition;
declare const imageDefinitionFromId: (id: string) => ImageDefinition;
declare const imageInstance: (object: ImageObject) => Image;
declare const imageFromId: (id: string) => Image;
declare const ImageWithUpdatableSize: UpdatableSizeClass & PreloadableClass & ContentClass & ContainerClass & TweenableClass & typeof MediaInstanceBase;
declare class ImageClass extends ImageWithUpdatableSize implements Image {
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
    definition: ImageDefinition;
    graphFiles(args: PreloadArgs): GraphFiles;
    svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
}
interface EncodingObject extends RequestableObject {
}
type EncodingObjects = EncodingObject[];
interface Encoding extends Requestable {
}
type Encodings = Encoding[];
declare class MashMediaClass extends MediaBase implements MashMedia {
    constructor(args: MashMediaArgs);
    color: string;
    _editor?: Editor;
    get editor(): Editor;
    set editor(value: Editor);
    emitter?: Emitter;
    imageSize: Size;
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
    private drawingTime?;
    drawnTime?: Time;
    get duration(): number;
    private emitIfFramesChange;
    get endTime(): Time;
    private filterIntersecting;
    private _frame; // initial frame supplied to constructor
    get frame(): number;
    get frames(): number;
    private _gain;
    get gain(): number;
    set gain(value: number);
    private graphFileOptions;
    private handleDrawInterval;
    loadPromise(options?: PreloadOptions): Promise<void>;
    private loadingPromises;
    get loading(): boolean;
    loop: boolean;
    private _media?;
    get media(): MediaCollection;
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
    previewItemsPromise(editor?: Editor): Promise<PreviewItems>;
    putPromise(): Promise<void>;
    quantize: number;
    removeClipFromTrack(clip: Clip | Clips): void;
    removeTrack(index?: number): void;
    _rendering: string;
    encodings: Encodings;
    private restartAfterStop;
    reload(): Promise<void> | undefined;
    private seekTime?;
    seekToTime(time: Time): Promise<void> | undefined;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    private setDrawInterval;
    private stopLoadAndDraw;
    get time(): Time;
    get timeRange(): TimeRange;
    timeRanges(avType: AVType, startTime?: Time): Times;
    private get timeToBuffer();
    toJSON(): UnknownRecord;
    private trackClips;
    tracks: Track[];
    type: "mash";
}
declare const mashMedia: (object?: MashMediaArgs) => MashMedia;
declare const trackInstance: (object: TrackArgs) => Track;
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
    _mash?: MashMedia;
    get mash(): MashMedia;
    set mash(value: MashMedia);
    removeClips(clips: Clips): void;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    sortClips(clips?: Clips): boolean;
    toJSON(): UnknownRecord;
}
declare const clipInstance: (object: ClipArgs) => Clip;
declare class ClipClass extends PropertiedClass implements Clip {
    constructor(...args: any[]);
    private assureTimingAndSizing;
    get audible(): boolean;
    clipIcon(size: Size, scale: number, buffer?: number): Promise<SvgOrImage> | undefined;
    clipCommandFiles(args: CommandFileArgs): CommandFiles;
    commandFilters(args: CommandFilterArgs): CommandFilters;
    private _containerObject;
    private _container?;
    get container(): Container;
    private containerInitialize;
    containerId: string;
    private _contentObject;
    private _content?;
    get content(): Content;
    private contentInitialize;
    contentId: string;
    definitionIds(): string[];
    get endFrame(): number;
    endTime(quantize: number): Time;
    frame: number;
    frames: number;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles;
    protected _id?: string;
    get id(): string;
    protected _label: string;
    get label(): string;
    set label(value: string);
    // intrinsicUrls(options: IntrinsicOptions): string[] {
    //   const { content, container } = this
    //   const urls: string[] = []
    //   if (!content.intrinsicsKnown(options)) {
    //     urls.push(...content.intrinsicUrls(options))
    //   }
    //   if (container && !container.intrinsicsKnown(options)) {
    //     urls.push(...container.intrinsicUrls(options))
    //   }
    //   return urls
    // }
    loadPromise(args: PreloadArgs): Promise<void>;
    maxFrames(_quantize: number, _trim?: number): number;
    get mutable(): boolean;
    muted: boolean;
    get notMuted(): boolean;
    previewItemsPromise(size: Size, time: Time, component: Component): Promise<PreviewItems>;
    rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect;
    rects(args: ContainerRectArgs): RectTuple;
    resetTiming(tweenable?: Tweenable, quantize?: number): void;
    selectType: SelectType;
    selectables(): Selectables;
    selectedItems(actions: Actions): SelectedItems;
    private selectedProperty;
    serverPromise(args: ServerPromiseArgs): Promise<void>;
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
    toJSON(): UnknownRecord;
    toString(): string;
    _track?: Track;
    get track(): Track;
    set track(value: Track);
    get trackNumber(): number;
    set trackNumber(value: number);
    get visible(): boolean;
}
interface SequenceObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
    speed?: number;
    definition?: SequenceDefinition;
}
interface Sequence extends Content, UpdatableSize, UpdatableDuration {
    definition: SequenceDefinition;
    speed: number;
}
interface SequenceDefinitionObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
    begin?: number;
    fps?: number;
    increment?: number;
    pattern?: string;
    padding?: number;
}
interface SequenceDefinition extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
    type: SequenceType;
    instanceFromObject(object?: SequenceObject): Sequence;
    framesArray(start: Time): number[];
}
declare const SequenceDefinitionWithUpdatableDuration: UpdatableDurationDefinitionClass & UpdatableSizeDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class SequenceMediaClass extends SequenceDefinitionWithUpdatableDuration implements SequenceDefinition {
    constructor(...args: any[]);
    begin: number;
    fps: number;
    framesArray(start: Time): number[];
    private get framesMax();
    increment: number;
    instanceFromObject(object?: SequenceObject): Sequence;
    // loadType = ImageType
    padding: number;
    pattern: string;
    toJSON(): UnknownRecord;
    type: "sequence";
}
declare const sequenceDefinition: (object: SequenceDefinitionObject) => SequenceDefinition;
declare const sequenceDefinitionFromId: (id: string) => SequenceDefinition;
declare const sequenceInstance: (object: SequenceObject) => Sequence;
declare const sequenceFromId: (id: string) => Sequence;
declare const SequenceWithUpdatableDuration: UpdatableDurationClass & UpdatableSizeClass & PreloadableClass & ContentClass & ContainerClass & TweenableClass & typeof MediaInstanceBase;
declare class SequenceClass extends SequenceWithUpdatableDuration implements Sequence {
    definition: SequenceDefinition;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
    graphFiles(args: PreloadArgs): GraphFiles;
    // iconUrl(size: Size, time: Time, range: TimeRange): string {
    //   const definitionTime = this.definitionTime(time, range)
    //   const { definition } = this
    //   const frames = definition.framesArray(definitionTime)
    //   const [frame] = frames
    //   return definition.urlForFrame(frame)
    // }
    // preloadUrls(args: PreloadArgs): string[] {
    //   const { time, clipTime, editing, visible } = args
    //   const definitionTime = this.definitionTime(time, clipTime)
    //   const definitionArgs: PreloadArgs = { ...args, time: definitionTime }
    //   const files = super.preloadUrls(definitionArgs)
    //   if (visible) {
    //     const { definition } = this
    //     if (editing) {
    //       const frames = definition.framesArray(definitionTime)
    //       const files = frames.map(frame => {
    //         const graphFile: GraphFile = {
    //           type: ImageType, file: definition.urlForFrame(frame),
    //           input: true, definition
    //         }
    //         return graphFile
    //       })
    //       files.push(...files)
    //     } else files.push(definition.source)
    //   }
    //   return files
    // }
    speed: number;
    toJSON(): UnknownRecord;
}
interface VideoObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
    speed?: number;
    definition?: VideoDefinition;
}
interface Video extends Content, UpdatableSize, UpdatableDuration {
    definition: VideoDefinition;
    loadedVideo?: LoadedVideo;
}
interface VideoDefinitionObject extends UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
    loadedVideo?: LoadedVideo;
}
type VideoTransitionalObject = MediaObject | VideoDefinitionObject;
interface VideoDefinition extends Media, UpdatableSizeDefinition, UpdatableDurationDefinition {
    type: VideoType;
    instanceFromObject(object?: VideoObject): Video;
    loadedVideo?: LoadedVideo;
    readonly previewTranscoding: Requestable;
    loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<LoadedImage>;
}
declare const isVideoDefinition: (value: any) => value is VideoDefinition;
declare function assertVideoDefinition(value: any): asserts value is VideoDefinition;
declare const isVideo: (value: any) => value is Video;
declare function assertVideo(value: any): asserts value is Video;
declare const VideoDefinitionWithUpdatableDuration: UpdatableDurationDefinitionClass & UpdatableSizeDefinitionClass & PreloadableDefinitionClass & ContentDefinitionClass & ContainerDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class VideoDefinitionClass extends VideoDefinitionWithUpdatableDuration implements VideoDefinition {
    constructor(object: VideoDefinitionObject);
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    loadedImages: Map<string, LoadedImage>;
    loadedImage(definitionTime: Time, outSize?: Size): LoadedImage | undefined;
    loadedImageKey(definitionTime: Time, outSize?: Size): string;
    private imageFromSequencePromise;
    private imageFromTranscodingPromise;
    private imageFromVideoTranscodingPromise;
    instanceFromObject(object?: VideoObject): Video;
    loadedVideo?: LoadedVideo;
    pattern: string;
    loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<LoadedImage>;
    get iconTranscoding(): Requestable;
    get previewTranscoding(): Requestable;
    type: "video";
}
declare const videoDefinition: (object: VideoDefinitionObject) => VideoDefinition;
declare const videoDefinitionFromId: (id: string) => VideoDefinition;
declare const videoInstance: (object: VideoObject) => Video;
declare const videoFromId: (id: string) => Video;
declare const VideoWithUpdatableDuration: UpdatableDurationClass & UpdatableSizeClass & PreloadableClass & ContentClass & ContainerClass & TweenableClass & typeof MediaInstanceBase;
declare class VideoClass extends VideoWithUpdatableDuration implements Video {
    definition: VideoDefinition;
    private _foreignElement?;
    get foreignElement(): SVGForeignObjectElement;
    graphFiles(args: PreloadArgs): GraphFiles;
    loadPromise(args: PreloadArgs): Promise<void>;
    private previewVideoPromise;
    private sequenceImagesPromise;
    private sequenceItemPromise;
    serverPromise(args: ServerPromiseArgs): Promise<void>;
    svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
    svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
    loadedVideo?: LoadedVideo;
    unload(): void;
    private videoForPlayerPromise;
    private videoItemForPlayerPromise;
    // private videoItemForTimelinePromise(previewTranscoding: Requestable, rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    //   console.log(this.constructor.name, 'videoItemForTimelinePromise')
    //   return this.previewVideoPromise(previewTranscoding).then(video => {
    //     const { clientCanMaskVideo } = VideoClass
    //     if (clientCanMaskVideo) {
    //       svgSetDimensions(this.foreignElement, rect)
    //     }
    //     const { currentTime } = video
    //     const definitionTime = this.definitionTime(time, range)
    //     const maxDistance = time.isRange ? 1 : 1.0 / time.fps
    //     const { seconds } = definitionTime
    //     if (Math.abs(seconds - currentTime) > maxDistance) {
    //       video.currentTime = seconds
    //     }
    //     const { width, height } = rect
    //     video.width = width
    //     video.height = height
    //     return clientCanMaskVideo ? this.foreignElement : video
    //   })
    // }
    static _clientCanMaskVideo?: boolean;
    static get clientCanMaskVideo(): boolean;
}
declare const mediaTypeFromMime: (mime?: string) => string;
declare const ColorContentWithContent: ContentClass & TweenableClass & typeof MediaInstanceBase;
declare class ColorContentClass extends ColorContentWithContent implements ColorContent {
    constructor(...args: any[]);
    color: string;
    private _colorFilter?;
    get colorFilter(): Filter;
    contentColors(time: Time, range: TimeRange): ColorTuple;
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    definition: ColorContentDefinition;
}
declare const ColorContentDefinitionWithContent: ContentDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class ColorContentDefinitionClass extends ColorContentDefinitionWithContent implements ColorContentDefinition {
    constructor(...args: any[]);
    color: string;
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: ColorContentObject): ColorContent;
}
declare const ShapeContainerWithContainer: ContainerClass & TweenableClass & typeof MediaInstanceBase;
declare class ShapeContainerClass extends ShapeContainerWithContainer implements ShapeContainer {
    constructor(...args: any[]);
    audibleCommandFiles(args: CommandFileArgs): CommandFiles;
    audibleCommandFilters(args: CommandFilterArgs): CommandFilters;
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    contentRects(args: ContentRectArgs): RectTuple;
    contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined;
    contentSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    effects: Effects;
    effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
    svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
    svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem>;
    canColor(args: CommandFilterArgs): boolean;
    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    definition: ShapeContainerDefinition;
    hasIntrinsicSizing: boolean;
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
    intrinsicRect(editing?: boolean): Rect;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    isTweeningColor(args: CommandFileArgs): boolean;
    isTweeningSize(args: CommandFileArgs): boolean;
    loadPromise(args: PreloadArgs): Promise<void>;
    pathElement(rect: Rect, forecolor?: string): SvgItem;
    requiresAlpha(args: CommandFileArgs, tweeningSize?: boolean): boolean;
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare const ShapeContainerDefinitionWithContainer: ContainerDefinitionClass & TweenableDefinitionClass & typeof MediaBase;
declare class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
    constructor(...args: any[]);
    loadedImage?: LoadedImage | undefined;
    previewSize?: Size | undefined;
    sourceSize?: Size | undefined;
    alpha?: boolean | undefined;
    source: string;
    url: string;
    bytes: number;
    mimeType: string;
    info?: CommandProbeData | undefined;
    definitionIcon(size: Size): Promise<SVGSVGElement> | undefined;
    instanceFromObject(object?: ShapeContainerObject): ShapeContainer;
    isVector: boolean;
    get loadedMediaPromise(): Promise<ClientMediaOrError>;
    path: string;
    pathHeight: number;
    pathWidth: number;
    toJSON(): UnknownRecord;
    type: "image";
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
    [SelectType.Clip]: Clip | undefined;
    [SelectType.Mash]: MashMedia | undefined;
    [SelectType.Track]: Track | undefined;
    [SelectType.Content]: Content | undefined;
    [SelectType.Container]: Container | undefined;
}
declare class EditorSelectionClass implements EditorSelection {
    get [SelectType.None](): Selectable | undefined;
    get [SelectType.Clip](): Clip | undefined;
    get [SelectType.Mash](): MashMedia | undefined;
    get [SelectType.Track](): Track | undefined;
    get [SelectType.Container](): Container | undefined;
    get [SelectType.Content](): Content | undefined;
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
interface ActionObject extends UnknownRecord {
    redoSelection: EditorSelectionObject;
    type: ActionType;
    undoSelection: EditorSelectionObject;
}
type ActionOptions = Partial<ActionObject>;
type ActionMethod = (object: ActionOptions) => void;
declare class Action {
    constructor(object: ActionObject);
    done: boolean;
    protected get mash(): MashMedia;
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
    baseUrl?: string;
    mash?: MashMediaObject;
    fps: number;
    loop: boolean;
    precision: number;
    readOnly?: boolean;
    dimensions?: Rect | Size | undefined;
    volume: number;
}
interface EditorOptions extends Partial<EditorArgs> {
}
type ClipOrEffect = Clip | Effect;
interface MashData extends Partial<DataMashGetResponse> {
}
declare const isMashData: (value: any) => value is MashData;
declare function assertMashData(value: any, name?: string): asserts value is MashData;
interface Editor {
    actions: Actions;
    addFiles(files: File[], editorIndex?: EditorIndex): Promise<Media[]>;
    addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>;
    addMedia(object: MediaObject | MediaObjects, editorIndex?: EditorIndex): Promise<Media[]>;
    addEffect: IndexHandler<Movable>;
    addTrack(): void;
    autoplay: boolean;
    buffer: number;
    can(action: MasherAction): boolean;
    clips: Clips;
    create(): Promise<void>;
    currentTime: number;
    // dataPutRequest(): Promise<DataPutRequest>
    dragging: boolean;
    definitions: MediaArray;
    definitionsUnsaved: MediaArray;
    duration: number;
    readonly mashMedia?: MashMedia;
    editing: boolean;
    editType: EditType;
    eventTarget: Emitter;
    fps: number;
    goToTime(value: Time): Promise<void>;
    handleAction(action: Action): void;
    rect: Rect;
    load(data: MashMediaObject): Promise<void>;
    loop: boolean;
    move(object: ClipOrEffect, editorIndex?: EditorIndex): void;
    moveClip(clip: Clip, editorIndex?: EditorIndex): void;
    moveEffect: IndexHandler<Movable>;
    media: MediaCollection;
    muted: boolean;
    pause(): void;
    paused: boolean;
    play(): void;
    position: number;
    positionStep: number;
    precision: number;
    readOnly: boolean;
    redo(): void;
    redraw(): void;
    removeClip(clip: Clip): void;
    removeEffect: IndexHandler<Movable>;
    // removeLayer(layer: Layer): void
    removeTrack(track: Track): void;
    saved(temporaryIdLookup?: StringRecord): void;
    readonly selection: EditorSelection;
    svgElement: SVGSVGElement;
    previewItems(enabled?: boolean): Promise<PreviewItems>;
    time: Time;
    timeRange: TimeRange;
    undo(): void;
    unload(): void;
    updateDefinition(definitionObject: MediaObject, definition?: Media): Promise<void>;
    volume: number;
}
declare class Actions {
    editor: Editor;
    constructor(editor: Editor);
    add(action: Action): void;
    get canRedo(): boolean;
    get canSave(): boolean;
    get canUndo(): boolean;
    create(object: ActionOptions): void;
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
interface TweenableObject extends UnknownRecord {
    mediaId?: string;
    definition?: Media;
    label?: string;
    container?: boolean;
    x?: number;
    xEnd?: number;
    y?: number;
    yEnd?: number;
    lock?: string;
}
interface TweenableDefinitionObject extends Identified, UnknownRecord {
    type?: MediaType | string;
}
interface Tweenable extends MediaInstance, Selectable {
    alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters;
    amixCommandFilters(args: CommandFilterArgs): CommandFilters;
    canColor(args: CommandFilterArgs): boolean;
    canColorTween(args: CommandFilterArgs): boolean;
    clip: Clip;
    clipped: boolean;
    colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters;
    colorFilter: Filter;
    commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
    container: boolean;
    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
    copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter;
    cropFilter: Filter;
    definitionTime(masherTime: Time, clipRange: TimeRange): Time;
    fileCommandFiles(graphFileArgs: PreloadArgs): CommandFiles;
    frames(quantize: number): number;
    graphFiles(args: PreloadArgs): GraphFiles;
    hasIntrinsicSizing: boolean;
    hasIntrinsicTiming: boolean;
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
    intrinsicGraphFile(options: IntrinsicOptions): GraphFile;
    intrinsicRect(editing?: boolean): Rect;
    intrinsicsKnown(options: IntrinsicOptions): boolean;
    isDefault: boolean;
    loadPromise(args: PreloadArgs): Promise<void>;
    lock: Orientation;
    mutable(): boolean;
    muted: boolean;
    overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters;
    overlayFilter: Filter;
    scaleCommandFilters(args: CommandFilterArgs): CommandFilters;
    selectedProperties(actions: Actions, property: Property): SelectedProperties;
    selectedProperty(property: Property): boolean;
    serverPromise(args: ServerPromiseArgs): Promise<void>;
    tween(keyPrefix: string, time: Time, range: TimeRange): Scalar;
    tweenPoints(time: Time, range: TimeRange): PointTuple;
    tweenRects(time: Time, range: TimeRange): RectTuple;
    tweenSizes(time: Time, range: TimeRange): SizeTuple;
    tweenValues(key: string, time: Time, range: TimeRange): Scalar[];
    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare const isTweenable: (value?: any) => value is Tweenable;
declare function assertTweenable(value?: any): asserts value is Tweenable;
interface TweenableDefinition extends Media {
    graphFiles(args: PreloadArgs): GraphFiles;
    loadPromise(args: PreloadArgs): Promise<void>;
    serverPromise(args: ServerPromiseArgs): Promise<void>;
}
declare const isTweenableDefinition: (value?: any) => value is TweenableDefinition;
declare function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition;
type TweenableClass = Constrained<Tweenable>;
type TweenableDefinitionClass = Constrained<TweenableDefinition>;
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
    contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    contentRects(args: ContentRectArgs): RectTuple;
    contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined;
    contentSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>;
    effects: Effects;
    effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare const isContent: (value?: any) => value is Content;
declare function assertContent(value?: any, name?: string): asserts value is Content;
interface ContentDefinition extends TweenableDefinition {
}
declare const isContentDefinition: (value?: any) => value is ContentDefinition;
type ContentClass = Constrained<Content>;
type ContentDefinitionClass = Constrained<ContentDefinition>;
interface PreloadableObject extends MediaInstanceObject, ContentObject {
}
interface PreloadableDefinitionObject extends MediaObject, ContentDefinitionObject {
    bytes?: number;
    mimeType?: string;
    source?: string;
    url?: string;
}
declare const isPreloadableDefinitionObject: (value: any) => value is PreloadableDefinitionObject;
interface PreloadableDefinition extends ContentDefinition {
    loadType: LoadType;
}
declare const isPreloadableDefinition: (value?: any) => value is PreloadableDefinition;
declare function assertPreloadableDefinition(value?: any): asserts value is PreloadableDefinition;
interface Preloadable extends Content {
}
declare const isPreloadable: (value?: any) => value is Preloadable;
declare function assertPreloadable(value?: any): asserts value is Preloadable;
type PreloadableClass = Constrained<Preloadable>;
type PreloadableDefinitionClass = Constrained<PreloadableDefinition>;
interface EffectObject extends TweenableObject, MediaInstanceObject {
}
interface Effect extends Tweenable {
    definition: EffectDefinition;
    svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters;
    commandFilters(args: CommandFilterArgs): CommandFilters;
    commandFiles(args: VisibleCommandFileArgs): CommandFiles;
}
declare const isEffect: (value?: any) => value is Effect;
declare function assertEffect(value?: any): asserts value is Effect;
type Effects = Effect[];
interface EffectDefinitionObject extends TweenableDefinitionObject, MediaObject {
    initializeFilter?: FilterDefinitionObject;
    finalizeFilter?: FilterDefinitionObject;
    filters?: FilterDefinitionObject[];
    properties?: PropertyObject[];
}
interface EffectDefinition extends TweenableDefinition, PreloadableDefinition {
    type: EffectType;
    instanceFromObject(object?: EffectObject): Effect;
    filters: Filter[];
}
declare const isEffectDefinition: (value?: any) => value is EffectDefinition;
type RawMedia = LoadedImageOrVideo | LoadedAudio;
declare const isRawMedia: (value: any) => value is RawMedia;
type LoadedMedia = LoadedImageOrVideo | LoadedAudio | LoadedFont;
interface LoadedImage extends HTMLImageElement {
} // limited Image API in tests!
// limited Image API in tests!
interface LoadedVideo extends HTMLVideoElement {
}
interface LoadedAudio extends AudioBuffer {
}
interface LoadedFont extends FontFace {
} // just { family: string } in tests!
// just { family: string } in tests!
interface LoadedEffect extends EffectObject {
}
interface LoadedMash extends MashMediaObject {
}
type LoadedImageOrVideo = LoadedImage | LoadedVideo;
interface AudibleSource extends AudioBufferSourceNode {
}
interface ClientImageOrError extends PotentialError {
    clientImage?: LoadedImage;
}
interface ClientAudioOrError extends PotentialError {
    clientAudio?: LoadedAudio;
}
interface ClientFontOrError extends PotentialError {
    clientFont?: LoadedFont;
}
interface ClientVideoOrError extends PotentialError {
    clientVideo?: LoadedVideo;
}
interface ClientMediaOrError extends PotentialError {
    clientMedia?: LoadedMedia;
}
type JsonRecordOrError = JsonRecord | Error;
type FfmpegSvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement;
type SvgFilter = FfmpegSvgFilter | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement | SVGFEComponentTransferElement;
type SvgFilters = SvgFilter[];
type SvgItem = SVGElement | LoadedImageOrVideo;
type SvgItems = SvgItem[];
type SvgItemsTuple = [
    SvgItems,
    SvgItems
];
type PreviewItem = SVGSVGElement | HTMLDivElement;
type PreviewItems = PreviewItem[];
type SvgOrImage = SVGSVGElement | LoadedImage;
declare enum Frame {
    First = 0,
    Last = -1
}
type Movable = Effect;
type Movables = Movable[];
interface MashMediaObject extends MediaObject {
    color?: string;
    encodings?: EncodingObjects;
    quantize?: Number;
    tracks?: TrackObject[];
    media?: MediaObjects;
}
interface MashMediaArgs extends MashMediaObject {
    mediaCollection?: MediaCollection;
    editor?: Editor;
    buffer?: number;
    gain?: number;
    loop?: boolean;
    emitter?: Emitter;
    size?: Size;
}
interface MashAndMediaObject extends MashMediaObject {
    media: MediaObjects;
}
declare const isMashAndMediaObject: (value: any) => value is MashAndMediaObject;
interface MashMedia extends Media, Selectable {
    addClipToTrack(clip: Clip | Clips, trackIndex?: number, insertIndex?: number, frame?: number): void;
    addTrack(object?: TrackObject): Track;
    buffer: number;
    changeTiming(propertied: Propertied, property: string, value: number): void;
    clearPreview(): void;
    clips: Clip[];
    clipsInTimeOfType(time: Time, avType?: AVType): Clip[];
    color: string;
    composition: AudioPreview;
    definitionIds: string[];
    destroy(): void;
    draw(): void;
    drawnTime?: Time;
    duration: number;
    editor: Editor;
    emitter?: Emitter;
    encodings: Encodings;
    endTime: Time;
    frame: number;
    frames: number;
    gain: number;
    imageSize: Size;
    loading: boolean;
    loadPromise(args?: PreloadOptions): Promise<void>;
    loop: boolean;
    media: MediaCollection;
    paused: boolean;
    previewItemsPromise(editor?: Editor): Promise<PreviewItems>;
    putPromise(): Promise<void>;
    quantize: number;
    reload(): Promise<void> | undefined;
    removeClipFromTrack(clip: Clip | Clips): void;
    removeTrack(index?: number): void;
    seekToTime(time: Time): Promise<void> | undefined;
    time: Time;
    timeRange: TimeRange;
    timeRanges(avType: AVType, startTime?: Time): Times;
    toJSON(): UnknownRecord;
    tracks: Track[];
    type: MashType;
}
declare const isMashMedia: (value: any) => value is MashMedia;
declare function assertMashMedia(value: any, name?: string): asserts value is MashMedia;
interface DescribedObject extends Identified, Labeled, UnknownRecord {
}
interface DataPutResponse extends ApiResponse {
    temporaryIdLookup?: StringRecord;
}
interface DataGetRequest extends ApiRequest, Identified {
}
interface DataPutRequest extends ApiRequest {
}
interface DataRetrieveResponse extends ApiResponse {
    described: DescribedObject[];
}
interface DataServerInit extends JsonRecord {
    temporaryIdPrefix: string;
}
interface DataRetrieve {
    partial?: boolean;
}
interface DataDefinitionPutRequest extends ApiRequest {
    definition: MediaObject;
}
interface DataDefinitionPutResponse extends ApiResponse, Identified {
}
interface DataDefinitionRetrieveRequest extends ApiRequest, DataRetrieve {
    types: string[];
}
interface DataDefinitionRetrieveResponse extends ApiResponse {
    definitions: MediaObjects;
}
interface DataDefinitionDeleteRequest extends ApiRequest, Identified {
}
interface DataDefinitionDeleteResponse extends ApiResponse {
    /**
     * If error is defined, a list of mash ids that reference the definition.
     */
    mashIds?: string[];
}
interface DataMashPutRequest extends DataPutRequest {
    definitionIds?: string[];
    mash: MashMediaObject;
}
interface DataMashPutResponse extends DataPutResponse {
}
interface DataMashAndMedia {
    mash: MashAndMediaObject;
}
interface DataMashRetrieveRequest extends ApiRequest, DataRetrieve {
}
interface DataMashGetResponse extends ApiResponse, DataMashAndMedia {
}
interface DataMashDefaultRequest extends ApiRequest {
}
interface DataMashDefaultResponse extends ApiResponse, DataMashAndMedia {
    previewSize?: Size;
}
interface DataMashDeleteRequest extends ApiRequest, Identified {
}
interface DataMashDeleteResponse extends ApiResponse {
    /**
     * If error is defined, a list of cast ids that reference the mash.
     */
    castIds?: string[];
}
type DataDefaultRequest = DataMashDefaultRequest;
type DataDefaultResponse = DataMashDefaultResponse;
interface DataMashGetRequest extends DataGetRequest {
}
interface DataDefinitionGetRequest extends ApiRequest, Identified {
}
interface DataDefinitionGetResponse extends ApiResponse {
    definition?: MediaObject;
}
interface DataMashRetrieveResponse extends DataRetrieveResponse {
}
declare const ApiVersion = "5.1.2";
interface ApiRequest {
    [index: string]: any;
    version?: string;
}
interface ApiResponse extends PotentialError {
}
interface RequestInitObject {
    body?: any;
    headers?: StringRecord;
    method?: string;
}
interface EndpointPromiser {
    (id: string, body?: JsonRecord): Promise<any>;
}
interface RequestObject {
    endpoint: Endpoint;
    init?: RequestInitObject;
}
type RequestObjects = RequestObject[];
declare const isRequestObject: (value: any) => value is RequestObject;
declare function assertRequestObject(value: any, name?: string): asserts value is RequestObject;
interface RequestRecord extends Record<string, RequestObject> {
}
interface ApiCallback extends RequestObject {
    expires?: string;
}
interface ApiCallbacks extends Record<string, ApiCallback> {
}
interface ApiServerInit extends JsonRecord {
}
interface ApiCallbacksRequest extends ApiRequest, Identified {
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
    [ServerType.File]?: JsonRecord;
    [ServerType.Rendering]?: JsonRecord;
    [ServerType.Web]?: JsonRecord;
}
declare const Endpoints: {
    api: StringRecord;
    data: Record<string, StringRecord>;
    file: StringRecord;
    rendering: StringRecord;
};
interface FileStoreRequest extends ApiRequest {
    id?: string;
}
interface FileStoreResponse extends ApiResponse {
}
interface EncodeOutput extends Output {
    commandOutput: RenderingCommandOutput;
}
interface CommandOutput extends UnknownRecord, Partial<Size> {
    audioBitrate?: Value;
    audioChannels?: number;
    audioCodec?: string;
    audioRate?: number;
    extension?: string;
    format?: OutputFormat;
    options?: ValueRecord;
    videoBitrate?: Value;
    videoCodec?: string;
    videoRate?: number;
}
interface RenderingCommandOutput extends CommandOutput {
    outputType: EncodeType;
    basename?: string;
    optional?: boolean;
    cover?: boolean;
}
type RenderingCommandOutputs = RenderingCommandOutput[];
interface RenderingInput {
    mash: MashAndMediaObject;
}
interface RenderingOptions extends RenderingInput {
    output: RenderingCommandOutput;
}
interface UploadDescription {
    name: string;
    type: string;
    size: number;
}
interface RenderingState {
    total: number;
    completed: number;
}
type RenderingStatus = {
    [index in EncodeType]?: RenderingState;
};
interface RenderingStartRequest extends ApiRequest, RenderingOptions {
}
interface RenderingStartResponse extends ApiCallbackResponse {
}
interface RenderingStatusRequest extends ApiRequest, Identified {
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
interface StreamingStartRequest extends ApiRequest {
    format?: StreamingFormat;
    width?: number;
    height?: number;
    videoRate?: number;
}
interface StreamingStartResponse extends ApiResponse, Identified {
    readySeconds: number;
    width: number;
    height: number;
    videoRate: number;
    format: StreamingFormat;
}
interface StreamingStatusRequest extends ApiRequest, Identified {
}
interface StreamingStatusResponse extends ApiRequest {
    streamUrl?: string;
}
interface StreamingPreloadRequest extends ApiRequest, Identified {
    files: GraphFiles;
}
interface StreamingPreloadResponse extends ApiResponse {
}
interface StreamingCutRequest extends ApiRequest {
    mashObjects: MashMediaObject[];
    definitionObjects: MediaObjects;
}
interface StreamingCutResponse extends ApiResponse {
}
interface StreamingSaveRequest extends ApiRequest {
}
interface StreamingSaveResponse extends ApiResponse {
}
interface StreamingDeleteRequest extends ApiRequest, Identified {
}
interface StreamingDeleteResponse extends ApiResponse {
}
interface StreamingListRequest extends ApiRequest {
}
interface StreamingListResponse extends ApiResponse {
}
interface StreamingWebrtcRequest extends ApiRequest {
}
interface StreamingWebrtcResponse extends ApiResponse, Identified {
    localDescription: RTCSessionDescription;
}
interface StreamingRtmpRequest extends ApiRequest {
}
interface StreamingRtmpResponse extends ApiResponse {
}
interface StreamingRemoteRequest extends ApiRequest, Identified {
    localDescription: RTCSessionDescription;
}
interface StreamingRemoteResponse extends ApiResponse {
    localDescription: RTCSessionDescription;
}
interface StreamingLocalRequest extends ApiRequest, Identified {
    localDescription: RTCSessionDescription;
}
interface StreamingLocalResponse extends ApiResponse {
    localDescription: RTCSessionDescription;
}
interface AudibleContextData extends AudioContext {
}
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
interface DecodeOutput extends Output {
    type: DecodeType;
    options?: unknown;
}
declare const isDecodeOutput: (value: any) => value is DecodeOutput;
declare function assertDecodeOutput(value: any): asserts value is DecodeOutput;
interface ProbeOptions {
    types: ProbeType[];
}
declare const isProbeOptions: (value: any) => value is ProbeOptions;
declare function assertProbeOptions(value: any): asserts value is ProbeOptions;
interface ProbeOutput extends DecodeOutput {
    options: ProbeOptions;
}
declare const isProbeOutput: (value: any) => value is ProbeOutput;
declare function assertProbeOutput(value: any): asserts value is ProbeOutput;
declare class DecodingClass implements Decoding {
    constructor(object: DecodingObject);
    info?: LoadedInfo;
}
declare const decodingInstance: (object: DecodingObject) => Decoding;
declare class EncodingClass extends RequestableClass implements Encoding {
    constructor(object: EncodingObject);
}
declare const encodingInstance: (object: EncodingObject) => Encoding;
declare class FilterDefinitionClass implements FilterDefinition {
    constructor(object: FilterDefinitionObject);
    id: string;
    commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles;
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected commandFilter(options?: ValueRecord): CommandFilter;
    protected _ffmpegFilter?: string;
    get ffmpegFilter(): string;
    filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems;
    instanceArgs(object?: FilterObject): FilterObject;
    instanceFromObject(object?: FilterObject): Filter;
    properties: Property[];
    parameters: Parameter[];
    protected populateParametersFromProperties(): void;
    filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters;
    toJSON(): UnknownRecord;
    toString(): string;
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
    constructor(object: FilterDefinitionObject);
    filterDefinitionSvgFilter(object: ScalarRecord): SvgFilters;
}
/**
 * @category Filter
 */
declare class ColorChannelMixerFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
    filterDefinitionSvgFilter(object: ScalarRecord): SvgFilters;
}
/**
 * @category Filter
 */
declare class ColorizeFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
    protected _ffmpegFilter: string;
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class ColorFilter extends ColorizeFilter {
    constructor(object: FilterDefinitionObject);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected _ffmpegFilter: string;
    filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems;
}
/**
 * @category Filter
 */
declare class ConvolutionFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters;
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
interface ConvolutionServerFilter extends ValueRecord {
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
    constructor(object: FilterDefinitionObject);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class FpsFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
}
declare class OpacityFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected _ffmpegFilter: string;
    filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters;
}
/**
 * @category Filter
 */
declare class OverlayFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class ScaleFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
}
/**
 * @category Filter
 */
declare class SetptsFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
}
/**
 * @category Filter
 */
declare class SetsarFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
}
/**
 * @category Filter
 */
declare class TextFilter extends ColorizeFilter {
    constructor(object: FilterDefinitionObject);
    private colorCommandFilter;
    commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters;
    protected _ffmpegFilter: string;
}
/**
 * @category Filter
 */
declare class TrimFilter extends FilterDefinitionClass {
    constructor(object: FilterDefinitionObject);
}
declare class FilterClass extends PropertiedClass implements Filter {
    constructor(object: FilterObject);
    commandFiles(args: FilterCommandFileArgs): CommandFiles;
    commandFilters(args: FilterCommandFilterArgs): CommandFilters;
    definition: FilterDefinition;
    parameters: Parameter[];
    _parametersDefined?: Parameter[];
    get parametersDefined(): Parameter[];
    filterSvgs(args?: FilterArgs): SvgItems;
    filterSvgFilter(): SvgFilters;
    protected _label: string;
    get label(): string;
    set label(value: string);
    scalarObject(tweening?: boolean): ScalarRecord;
    toString(): string;
}
declare const FilterIdPrefix: string;
declare const filterDefinition: (object: FilterDefinitionObject) => FilterDefinition;
declare const filterDefinitionFromId: (id: string) => FilterDefinition;
declare const filterInstance: (object: FilterObject) => Filter;
declare const filterFromId: (id: string) => Filter;
interface Plugin {
    type: PluginType;
}
type PluginTypeProtocol = "protocol";
declare const PluginTypeProtocol: PluginTypeProtocol;
type PluginTypeLanguage = "language";
declare const PluginTypeLanguage: PluginTypeLanguage;
type PluginTypeProtocols = PluginTypeProtocol[];
type PluginType = string | PluginTypeProtocol;
type ProtocolHttp = "http";
declare const ProtocolHttp: ProtocolHttp;
type ProtocolHttps = "https";
declare const ProtocolHttps: ProtocolHttps;
type ProtocolBlob = "blob";
declare const ProtocolBlob: ProtocolBlob;
type ProtocolFile = "file";
declare const ProtocolFile: ProtocolFile;
type Protocol = string | ProtocolHttp | ProtocolHttps | ProtocolBlob | ProtocolFile;
interface ProtocolPlugin extends Plugin {
    type: Protocol;
    promise: ProtocolPromise;
}
type PluginsByProtocol = Record<Protocol, ProtocolPlugin>;
// export type ProtocolPromise = {
//   (request: RequestObject, type: ImageType): Promise<ClientImageOrError>
//   (request: RequestObject, type: VideoType): Promise<ClientVideoOrError>
//   // (request: RequestObject, type: AudioType): Promise<LoadedAudio>
//   // (request: RequestObject, type: FontType): Promise<LoadedFont>
//   // (request: RequestObject, type: JsonType): Promise<UnknownRecord>
//   (request: RequestObject, type?: string): Promise<PathOrError>
// }
type ProtocolPromise = {
    (request: RequestObject, type: ImageType): Promise<ClientImageOrError>;
    (request: RequestObject, type: AudioType): Promise<ClientAudioOrError>;
    (request: RequestObject, type: FontType): Promise<ClientFontOrError>;
    (request: RequestObject, type: VideoType): Promise<ClientVideoOrError>;
    (request: RequestObject, type: JsonType): Promise<JsonRecordOrError>;
    (request: RequestObject, type?: string): Promise<PathOrError>;
};
declare const ProtocolOptions: UnknownRecord;
interface ProtocolResponse extends PotentialError {
    requests: RequestRecord;
}
declare const protocolName: (protocol: string) => string;
declare const protocolImportPrefix: (id: string) => string;
declare const protocolLoadPromise: (protocol: string) => Promise<ProtocolPlugin>;
type LanguageEnglish = "en";
declare const LanguageEnglish: LanguageEnglish;
type Language = string | LanguageEnglish;
interface LanguagePlugin extends Plugin {
    type: Language;
}
type PluginsByLanguage = Record<Language, LanguagePlugin>;
interface Plugins {
    protocols: PluginsByProtocol;
    languages: PluginsByLanguage;
}
declare const Plugins: Plugins;
declare const Default: {
    duration: number;
    label: string;
    editor: EditorArgs;
    video: {
        label: string;
        quantize: number;
        color: string;
        gain: number;
        buffer: number;
    };
    effect: {
        label: string;
    };
    audio: {
        label: string;
    };
    image: {
        label: string;
    };
    audiostream: {
        label: string;
    };
    sequence: {
        label: string;
    };
    videostream: {
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
    font: {
        label: string;
        string: string;
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
interface TranscodeOutput extends Output {
    options: RenderingCommandOutput;
    type: TranscodeType;
}
declare const isTranscodeOutput: (value: any) => value is TranscodeOutput;
declare class TranscodingClass extends RequestableClass implements Transcoding {
    constructor(object: TranscodingObject);
    kind: string;
    purpose: string;
    toJSON(): UnknownRecord;
    type: TranscodeType;
    unload(): void;
}
declare const transcodingInstance: (object: TranscodingObject) => Transcoding;
declare enum ActivityType {
    Analyze = "analyze",
    Complete = "complete",
    Error = "error",
    Load = "load",
    Render = "render"
}
interface ActivityInfo extends Identified {
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
declare const commandFilesInputIndex: (commandFiles: CommandFiles, id: string, visible: boolean) => number;
declare const commandFilesInput: (commandFiles: CommandFiles, id: string, visible?: boolean) => string;
declare const eventStop: (event: Event) => void;
declare const mediaInfo: (media?: LoadedMedia) => LoadedInfo;
declare const filePromises: (files: File[], size?: Size) => Promise<MediaObjectOrError>[];
declare const idGenerateString: () => string;
declare const idGenerate: (prefix: string) => string;
declare const idTemporary: () => string;
declare const idIsTemporary: (id: string) => boolean;
declare const imageFromVideoPromise: (video: LoadedVideo, definitionTime: Time, outSize?: Size) => Promise<LoadedImage>;
declare const isObject: (value: any) => value is Object;
declare function assertObject(value: any, name?: string): asserts value is Object;
declare const isString: (value: any) => value is string;
declare function assertString(value: any, name?: string): asserts value is string;
declare const isUndefined: (value: any) => boolean;
declare const isNumberOrNaN: (value: any) => value is number;
declare function assertNumber(value: any, name?: string): asserts value is number;
declare const isBoolean: (value: any) => value is boolean;
declare function assertBoolean(value: any, name?: string): asserts value is Boolean;
declare const isMethod: (value: any) => value is Function;
declare function assertMethod(value: any, name?: string): asserts value is Function;
declare const isDefined: (value: any) => boolean;
declare function assertDefined(value: any, name?: string): asserts value is true;
declare const isNan: (value: any) => boolean;
declare const isNumber: (value: any) => value is number;
declare const isInteger: (value: any) => value is number;
declare function assertInteger(value: any, name?: string): asserts value is Integer;
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
declare const isValueObject: (value: any) => value is ValueRecord;
declare function assertValueObject(value: any, name?: string): asserts value is ValueRecord;
declare const isJsonRecord: (value: any) => value is JsonRecord;
declare const pixelToFrame: (pixels: number, perFrame: number, rounding?: string) => number;
declare const requestProtocol: (request: RequestObject) => string;
declare const requestAudioPromise: (request: RequestObject) => Promise<ClientAudioOrError>;
declare const requestFontPromise: (request: RequestObject) => Promise<ClientFontOrError>;
declare const requestImagePromise: (request: RequestObject) => Promise<ClientImageOrError>;
declare const requestVideoPromise: (request: RequestObject) => Promise<ClientVideoOrError>;
declare const requestJsonPromise: (request: RequestObject) => Promise<JsonRecordOrError>;
declare const requestMediaPromise: (request: RequestObject, type: LoadType) => Promise<ClientMediaOrError>;
declare const requestPromise: (request: RequestObject, type?: string) => Promise<PathOrError>;
declare const requestExtension: (request: RequestObject) => string;
type ResolverPromise = {
    (file: string, mimeType: string, type: ImageType): Promise<LoadedImage>;
    (file: string, mimeType: string, type: AudioType): Promise<LoadedAudio>;
    (file: string, mimeType: string, type: FontType): Promise<LoadedFont>;
    (file: string, mimeType: string, type: VideoType): Promise<LoadedVideo>;
    (file: string, mimeType: string, type?: string): Promise<PathOrError>;
};
interface Resolver {
    requestPromise: (file: string) => Promise<RequestObject>;
    extension: string;
}
type ResolverRecord = Record<string, Resolver>;
declare const Resolvers: ResolverRecord;
declare const resolverLoad: (mimeType?: string) => Resolver | undefined;
declare const resolverPromise: ResolverPromise;
declare const resolverPathPromise: (file: string, mimeType?: string) => PathOrError | Promise<PathOrError>;
declare const resolverExtension: (request: RequestObject, mimeType?: string) => string;
type NumberConverter = (value: number) => number;
declare const roundMethod: (rounding?: string) => NumberConverter;
declare const roundWithMethod: (number: number, method?: string) => number;
declare const sortByFrame: (a: Framed, b: Framed) => number;
declare const sortByIndex: (a: Indexed, b: Indexed) => number;
declare const sortByTrack: (a: Tracked, b: Tracked) => number;
declare const sortByLabel: (a: Labeled, b: Labeled) => number;
declare const stringSeconds: (seconds: number, fps?: number, lengthSeconds?: number) => string;
declare const stringFamilySizeRect: (string: string, family: string, size: number) => Rect;
declare const stringPluralize: (count: number, value: string, suffix?: string) => string;
declare const urlBase: () => string;
declare const urlBaseInitialize: (base?: string) => string;
declare const urlBaseInitialized: () => boolean;
/**
 *
 * @param endpoint
 * @returns endpoint resolved relative to base URL
 */
declare const urlEndpoint: (endpoint?: Endpoint) => Endpoint;
declare const urlIsObject: (url: string) => boolean;
declare const urlIsHttp: (url: string) => boolean;
declare const urlIsBlob: (url?: string) => boolean;
declare const urlHasProtocol: (url: string) => boolean;
declare const urlCombine: (url: string, path: string) => string;
declare const urlResolve: (url: string, path?: string) => string;
declare const urlFromEndpoint: (endpoint: Endpoint) => string;
declare const urlForEndpoint: (endpoint: Endpoint, suffix?: string) => string;
declare const urlIsRootProtocol: (protocol: string) => boolean;
declare const urlProtocol: (string: string) => string;
declare const urlParse: (string: string) => string[];
declare const urlsParsed: (string: string) => string[][];
declare const urlsAbsolute: (string: string, endpoint: Endpoint) => string[][];
declare const urlOptionsObject: (options?: string) => ScalarRecord | undefined;
declare const urlOptions: (options?: ScalarRecord) => string;
declare const urlPrependProtocol: (protocol: string, url: string, options?: ScalarRecord) => string;
declare const urlExtension: (extension: string) => string;
declare const urlFilename: (name: string, extension: string) => string;
declare const urlFromCss: (string: string) => string;
export { Value, Scalar, PopulatedString, Integer, ValueRecord, NumberRecord, UnknownRecord, ScalarRecord, StringRecord, StringsRecord, NestedStringRecord, StringSetter, NumberSetter, BooleanSetter, BooleanGetter, AnyArray, JsonValue, JsonRecord, ApiVersion, ApiRequest, ApiResponse, RequestInitObject, EndpointPromiser, RequestObject, RequestObjects, isRequestObject, assertRequestObject, RequestRecord, ApiCallback, ApiCallbacks, ApiServerInit, ApiCallbacksRequest, ApiCallbacksResponse, ApiCallbackResponse, ApiServersRequest, ApiServersResponse, DescribedObject, DataPutResponse, DataGetRequest, DataPutRequest, DataRetrieveResponse, DataServerInit, DataRetrieve, DataDefinitionPutRequest, DataDefinitionPutResponse, DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse, DataDefinitionDeleteRequest, DataDefinitionDeleteResponse, DataMashPutRequest, DataMashPutResponse, DataMashAndMedia, DataMashRetrieveRequest, DataMashGetResponse, DataMashDefaultRequest, DataMashDefaultResponse, DataMashDeleteRequest, DataMashDeleteResponse, DataDefaultRequest, DataDefaultResponse, DataMashGetRequest, DataDefinitionGetRequest, DataDefinitionGetResponse, DataMashRetrieveResponse, Endpoints, FileStoreRequest, FileStoreResponse, UploadDescription, RenderingState, RenderingStatus, RenderingStartRequest, RenderingStartResponse, RenderingStatusRequest, RenderingStatusResponse, RenderingUploadRequest, RenderingUploadResponse, StreamingStartRequest, StreamingStartResponse, StreamingStatusRequest, StreamingStatusResponse, StreamingPreloadRequest, StreamingPreloadResponse, StreamingCutRequest, StreamingCutResponse, StreamingSaveRequest, StreamingSaveResponse, StreamingDeleteRequest, StreamingDeleteResponse, StreamingListRequest, StreamingListResponse, StreamingWebrtcRequest, StreamingWebrtcResponse, StreamingRtmpRequest, StreamingRtmpResponse, StreamingRemoteRequest, StreamingRemoteResponse, StreamingLocalRequest, StreamingLocalResponse, Framed, Indexed, Tracked, Labeled, Constrained, MediaCollection, Identified, isIdentified, assertIdentified, PropertyTweenSuffix, Propertied, PropertiedChangeHandler, PropertiedClass, isPropertied, RequestableObject, isRequestableObject, Requestable, isRequestable, RequestableClass, Typed, isTyped, assertTyped, AudibleContextData, AudibleContextSource, AudibleContext, AudibleContextInstance, ContextFactory, DecodeOutput, isDecodeOutput, assertDecodeOutput, ProbeOptions, isProbeOptions, assertProbeOptions, ProbeOutput, isProbeOutput, assertProbeOutput, DecodingObject, DecodingObjects, Decoding, Decodings, DecodingClass, decodingInstance, ActionObject, ActionOptions, ActionMethod, Action, isAction, assertAction, ActionInit, isActionInit, ActionEvent, isActionEvent, actionInstance, ActionFactory, AddClipToTrackActionObject, AddClipToTrackAction, AddTrackActionObject, AddTrackAction, ChangeActionObject, isChangeActionObject, ChangeAction, isChangeAction, assertChangeAction, ChangeFramesAction, ChangeMultipleActionObject, ChangeMultipleAction, MoveActionObject, MoveActionOptions, MoveAction, isMoveAction, assertMoveAction, MoveClipActionObject, MoveClipAction, RemoveClipActionObject, RemoveClipAction, Actions, EditorIndex, EditorArgs, EditorOptions, ClipOrEffect, MashData, isMashData, assertMashData, Editor, EditorClass, editorSingleton, editorArgs, editorInstance, EditorSelectionObject, EditorSelection, EditorSelectionClass, editorSelectionInstance, AudioPreview, AudioPreviewArgs, StartOptions, AudioPreviewClass, audioPreviewInstance, NonePreview, PreviewOptions, PreviewArgs, Preview, PreviewClass, TrackPreviewArgs, TrackPreview, TrackPreviews, TrackPreviewHandleSize, TrackPreviewLineSize, TrackPreviewClass, Selectable, Selectables, SelectableRecord, SelectTypesObject, EncodeOutput, CommandOutput, RenderingCommandOutput, RenderingCommandOutputs, RenderingInput, RenderingOptions, EncodingObject, EncodingObjects, Encoding, Encodings, EncodingClass, encodingInstance, AlphamergeFilter, ChromaKeyFilter, ColorChannelMixerFilter, ColorFilter, ColorizeFilter, ConvolutionFilter, Numbers, NumbersOrUndefined, NumberOrUndefined, ConvolutionRgba, ConvolutionChannel, ConvolutionRgbaObject, ConvolutionRgbasObject, ConvolutionNumberObject, ConvolutionNumbersObject, StringOrUndefined, ConvolutionStringObject, ConvolutionKey, ConvolutionNumbersKey, ConvolutionObject, ConvolutionServerFilter, isConvolutionServerFilter, assertConvolutionServerFilter, CropFilter, FpsFilter, OpacityFilter, OverlayFilter, ScaleFilter, SetptsFilter, SetsarFilter, TextFilter, TrimFilter, FilterArgs, FilterRecord, Filters, FilterObject, FilterDefinitionObject, Filter, FilterDefinition, isFilterDefinition, assertFilterDefinition, FilterClass, FilterDefinitionClass, FilterIdPrefix, filterDefinition, filterDefinitionFromId, filterInstance, filterFromId, Color, ColorObject, Rgb, Rgba, RgbObject, RgbaObject, colorRgbKeys, colorRgbaKeys, colorTransparent, colorBlack, colorWhite, colorWhiteTransparent, colorBlackTransparent, colorWhiteOpaque, colorBlackOpaque, colorGreen, colorYellow, colorRed, colorBlue, colorRgbToHex, colorRgbaToHex, colorValid, colorValidHex, colorToRgb, colorToRgba, colorFromRgb, colorRgbDifference, colorMixRbga, colorMixRbg, Emitter, Endpoint, isEndpoint, endpointUrl, endpointFromAbsolute, endpointFromUrl, endpointIsAbsolute, endpointAbsolute, ErrorObject, PotentialError, DefiniteError, PathOrError, ErrorName, ErrorNames, StandardErrorName, ErrorContext, isErrorName, errorMessage, errorObject, errorObjectCaught, errorName, error, errorCaught, errorPromise, errorThrow, PropertyTypesNumeric, propertyTypeIsString, propertyTypeDefault, propertyTypeValid, propertyTypeCoerce, Selected, SelectedProperty, isSelectedProperty, SelectedMovable, SelectedItems, SelectedProperties, SelectedPropertyObject, selectedPropertyObject, selectedPropertiesScalarObject, IndexHandler, FfmpegSvgFilter, SvgFilter, SvgFilters, SvgItem, SvgItems, SvgItemsTuple, PreviewItem, PreviewItems, SvgOrImage, svgElement, svgElementInitialize, svgId, svgUrl, svgGroupElement, svgSetDimensions, svgSetTransformPoint, svgRectPoints, svgPolygonElement, svgSetBox, svgSvgElement, svgSetDimensionsLock, svgImageElement, svgPathElement, svgMaskElement, svgFilter, svgAppend, svgPatternElement, svgDefsElement, svgFeImageElement, svgFilterElement, svgDifferenceDefs, svgSet, svgAddClass, svgUseElement, svgSetTransform, svgTransform, svgSetTransformRects, svgFunc, svgSetChildren, svgImagePromise, svgText, svgImagePromiseWithOptions, Time, TimeRange, Times, TimeRanges, timeEqualizeRates, TimeClass, timeRangeFromArgs, timeRangeFromSeconds, timeRangeFromTime, timeRangeFromTimes, timeFromArgs, timeFromSeconds, TimeRangeClass, Plugin, PluginTypeProtocol, PluginTypeLanguage, PluginTypeProtocols, PluginType, Plugins, LanguageEnglish, Language, LanguagePlugin, PluginsByLanguage, MediaDefaults, MediaFactories, mediaDefinition, AudioObject, Audio, isAudio, AudioDefinitionObject, AudioDefinition, isAudioDefinition, AudioDefinitionClass, audioDefinition, audioDefinitionFromId, audioInstance, audioFromId, AudioClass, DefaultContainerId, TextContainerId, ContainerObject, isContainerObject, assertContainerObject, ContainerDefinitionObject, ContainerDefinition, isContainerDefinition, ContainerRectArgs, Container, isContainer, assertContainer, ContainerClass, ContainerDefinitionClass, ContainerMixin, ContainerDefinitionMixin, ShapeContainerObject, ShapeContainerDefinitionObject, ShapeContainer, isShapeContainer, ShapeContainerDefinition, ShapeContainerClass, ShapeContainerDefinitionClass, DefaultContentId, ContentObject, ContentDefinitionObject, ContentRectArgs, Content, isContent, assertContent, ContentDefinition, isContentDefinition, ContentClass, ContentDefinitionClass, ContentDefinitionMixin, ContentMixin, ColorContentObject, ColorContentDefinitionObject, ColorContent, isColorContent, ColorContentDefinition, ColorContentClass, ColorContentDefinitionClass, EffectDefinitionClass, EffectClass, effectDefinition, effectDefinitionFromId, effectInstance, effectFromId, EffectObject, Effect, isEffect, assertEffect, Effects, EffectDefinitionObject, EffectDefinition, isEffectDefinition, DefaultFontId, FontDefinitionObject, FontObject, Font, isFont, assertFont, FontDefinition, isFontDefinition, assertFontDefinition, FontMediaClass, fontFind, fontDefinition, fontDefault, fontDefinitionFromId, FontClass, ImageObject, ImageDefinitionObject, ImageTransitionalObject, Image, isImage, ImageDefinition, isImageDefinition, ImageDefinitionClass, imageDefinition, imageDefinitionFromId, imageInstance, imageFromId, ImageClass, Frame, Movable, Movables, MashMediaObject, MashMediaArgs, MashAndMediaObject, isMashAndMediaObject, MashMedia, isMashMedia, assertMashMedia, MashMediaClass, mashMedia, TrackObject, TrackArgs, Track, isTrack, assertTrack, Tracks, trackInstance, TrackFactory, TrackClass, IntrinsicOptions, ClipObject, isClipObject, ClipArgs, ClipDefinitionObject, Clip, isClip, assertClip, Clips, clipInstance, ClipClass, MediaObject, isMediaObject, MediaObjects, MediaObjectOrError, Media, MediaArray, isMedia, assertMedia, MediaClass, MediaFactoryMethod, MediaBase, MediaInstanceObject, isMediaInstanceObject, MediaInstance, isMediaInstance, MediaInstanceClass, MediaInstanceBase, SequenceObject, Sequence, SequenceDefinitionObject, SequenceDefinition, SequenceMediaClass, sequenceDefinition, sequenceDefinitionFromId, sequenceInstance, sequenceFromId, SequenceClass, VideoObject, Video, VideoDefinitionObject, VideoTransitionalObject, VideoDefinition, isVideoDefinition, assertVideoDefinition, isVideo, assertVideo, VideoDefinitionClass, videoDefinition, videoDefinitionFromId, videoInstance, videoFromId, VideoClass, mediaTypeFromMime, PreloadableObject, PreloadableDefinitionObject, isPreloadableDefinitionObject, PreloadableDefinition, isPreloadableDefinition, assertPreloadableDefinition, Preloadable, isPreloadable, assertPreloadable, PreloadableClass, PreloadableDefinitionClass, PreloadableDefinitionMixin, PreloadableMixin, TweenableObject, TweenableDefinitionObject, Tweenable, isTweenable, assertTweenable, TweenableDefinition, isTweenableDefinition, assertTweenableDefinition, TweenableClass, TweenableDefinitionClass, TweenableDefinitionMixin, TweenableMixin, UpdatableDurationMediaTypes, UpdatableDurationObject, UpdatableDurationDefinitionObject, UpdatableDuration, isUpdatableDuration, assertUpdatableDuration, isUpdatableDurationType, UpdatableDurationDefinition, isUpdatableDurationDefinition, assertUpdatableDurationDefinition, UpdatableDurationClass, UpdatableDurationDefinitionClass, UpdatableDurationMixin, UpdatableDurationDefinitionMixin, UpdatableSizeMediaType, UpdatableSizeObject, UpdatableSizeDefinitionObject, UpdatableSize, isUpdatableSize, assertUpdatableSize, isUpdatableSizeType, UpdatableSizeDefinition, isUpdatableSizeDefinition, assertUpdatableSizeDefinition, UpdatableSizeClass, UpdatableSizeDefinitionClass, UpdatableSizeMixin, UpdatableSizeDefinitionMixin, CommandInput, CommandInputs, CommandFilter, CommandFilters, GraphFilter, GraphFilters, FilterValueObject, FilterValueObjects, PreloadOptionsBase, ServerPromiseArgs, PreloadArgs, PreloadOptions, ColorTuple, CommandFileOptions, CommandFileArgs, VisibleCommandFileArgs, CommandFilterArgs, VisibleCommandFilterArgs, FilterCommandFilterArgs, FilterCommandFileArgs, FilterDefinitionArgs, FilterDefinitionCommandFilterArgs, FilterDefinitionCommandFileArgs, GraphFile, GraphFiles, CommandFile, CommandFiles, VoidMethod, Component, Output, isOutput, RawMedia, isRawMedia, LoadedMedia, LoadedImage, LoadedVideo, LoadedAudio, LoadedFont, LoadedEffect, LoadedMash, LoadedImageOrVideo, AudibleSource, ClientImageOrError, ClientAudioOrError, ClientFontOrError, ClientVideoOrError, ClientMediaOrError, JsonRecordOrError, isLoadedVideo, assertLoadedVideo, isLoadedImage, assertLoadedImage, isLoadedAudio, assertLoadedAudio, isLoadedFont, assertLoadedFont, CommandProbeStream, CommandProbeFormat, CommandProbeData, LoadedInfo, LoaderType, isLoaderType, assertLoaderType, isClientMedia, assertClientMedia, ProtocolHttp, ProtocolHttps, ProtocolBlob, ProtocolFile, Protocol, ProtocolPlugin, PluginsByProtocol, ProtocolPromise, ProtocolOptions, ProtocolResponse, protocolName, protocolImportPrefix, protocolLoadPromise, ExtHls, ExtTs, ExtRtmp, ExtDash, ExtJpeg, ExtPng, ExtJson, ExtText, ExtCss, ContentTypeJson, ContentTypeCss, OutputFilterGraphPadding, EmptyMethod, NamespaceSvg, NamespaceXhtml, NamespaceLink, IdPrefix, IdSuffix, ClassDisabled, ClassItem, ClassButton, ClassCollapsed, ClassSelected, ClassDropping, ClassDroppingBefore, ClassDroppingAfter, Default, AudioType, EffectType, FontType, ImageType, MashType, SequenceType, VideoType, AudioStreamType, VideoStreamType, JsonType, MediaType, MediaTypes, isMediaType, assertMediaType, TranscodeType, TranscodeTypes, isTranscodeType, assertTranscodeType, CookedType, CookedTypes, isCookedType, RawType, RawTypes, isRawType, LoadType, LoadTypes, isLoadType, assertLoadType, SizingMediaType, SizingMediaTypes, isSizingMediaType, TimingMediaType, TimingMediaTypes, isTimingMediaType, ContainerType, ContainerTypes, isContainerType, assertContainerType, ContentType, ContentTypes, isContentType, assertContentType, MediaTypesObject, StreamKind, EditType, EditTypes, isEditType, assertEditType, DroppingPosition, FolderType, TrackType, LayerType, LayerTypes, isLayerType, assertLayerType, ActionType, AVType, SelectType, SelectTypes, isSelectType, assertSelectType, ClipSelectType, ClipSelectTypes, isClipSelectType, OutputFormat, StreamingFormat, ProbeType, DecodeType, DecodeTypes, isDecodeType, EncodeType, EncodeTypes, FillType, FillTypes, isFillType, GraphFileType, GraphFileTypes, isGraphFileType, DataType, DataTypes, isDataType, assertDataType, Orientation, Orientations, isOrientation, Direction, Directions, isDirection, assertDirection, DirectionObject, Anchor, Anchors, TriggerType, TriggerTypes, isTriggerType, TransformType, EventType, EventTypes, isEventType, MoveType, MasherAction, ServerType, ServerTypes, Duration, Timing, Timings, Sizing, Sizings, Clicking, Clickings, ParameterObject, Parameter, DataGroup, DataGroups, isDataGroup, assertDataGroup, PropertyBase, Property, PropertyObject, isProperty, assertProperty, propertyInstance, TranscodeOutput, isTranscodeOutput, TranscodingObject, TranscodingObjects, Transcoding, Transcodings, isTranscoding, TranscodingClass, transcodingInstance, ActivityType, ActivityInfo, arrayLast, arraySet, arrayReversed, arrayUnique, commandFilesInputIndex, commandFilesInput, eventStop, mediaInfo, filePromises, idGenerateString, idGenerate, idTemporary, idIsTemporary, imageFromVideoPromise, isObject, assertObject, isString, assertString, isUndefined, isNumberOrNaN, assertNumber, isBoolean, assertBoolean, isMethod, assertMethod, isDefined, assertDefined, isNan, isNumber, isInteger, assertInteger, isFloat, isPositive, assertPositive, isBelowOne, isAboveZero, assertAboveZero, isArray, assertArray, isPopulatedString, assertPopulatedString, isPopulatedArray, assertPopulatedArray, isPopulatedObject, assertPopulatedObject, isNumeric, assertTrue, isRgb, assertRgb, isTime, assertTime, isTimeRange, assertTimeRange, isValue, isTrueValue, assertValue, isValueObject, assertValueObject, isJsonRecord, pixelToFrame, Point, isPoint, assertPoint, PointTuple, pointsEqual, PointZero, pointCopy, pointRound, pointString, pointValueString, pointNegate, Rect, isRect, assertRect, Rects, RectTuple, rectsEqual, RectZero, rectFromSize, rectsFromSizes, rectCopy, rectRound, centerPoint, rectString, RectOptions, requestProtocol, requestAudioPromise, requestFontPromise, requestImagePromise, requestVideoPromise, requestJsonPromise, requestMediaPromise, requestPromise, requestExtension, ResolverPromise, Resolver, ResolverRecord, Resolvers, resolverLoad, resolverPromise, resolverPathPromise, resolverExtension, roundMethod, roundWithMethod, Size, isSize, assertSize, sizesEqual, Sizes, SizeTuple, SizeZero, sizedEven, sizeEven, sizeRound, sizeCeil, sizeFloor, sizeScale, sizeCover, sizeAboveZero, assertSizeAboveZero, SizeOutput, SizePreview, SizeIcon, sizeCopy, sizeLock, sizeString, sizeLockNegative, sizeFromElement, sortByFrame, sortByIndex, sortByTrack, sortByLabel, stringSeconds, stringFamilySizeRect, stringPluralize, Tweening, tweenPad, tweenNumberStep, tweenColorStep, tweenRectStep, tweenColors, tweenRects, tweenMaxSize, tweenMinSize, tweenOption, tweenableRects, tweenPosition, tweenNumberObject, tweenOverRect, tweenOverPoint, tweenOverSize, tweenScaleSizeToRect, tweenCoverSizes, tweenCoverPoints, tweenRectLock, tweenRectsLock, tweenScaleSizeRatioLock, tweeningPoints, tweenMinMax, tweenInputTime, urlBase, urlBaseInitialize, urlBaseInitialized, urlEndpoint, urlIsObject, urlIsHttp, urlIsBlob, urlHasProtocol, urlCombine, urlResolve, urlFromEndpoint, urlForEndpoint, urlIsRootProtocol, urlProtocol, urlParse, urlsParsed, urlsAbsolute, urlOptionsObject, urlOptions, urlPrependProtocol, urlExtension, urlFilename, urlFromCss };
//# sourceMappingURL=moviemasher.d.ts.map