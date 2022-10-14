/// <reference types="react" />
import React from "react";
import { ActivityInfo, AndId, Endpoint, ApiServersResponse, JsonObject, StringSetter, Definition, DefinitionType, Clip, DroppingPosition, Layer, VoidMethod, DefinitionObject, UnknownObject, MashAndDefinitionsObject, Effect, Point, Rect, DataType, DataGroup, SelectType, SelectedEffects, Scalar, PropertiedChangeHandler, Property, Time, SelectedItems, TimeRange, EffectRemovehandler, Size, EditType, DataDefaultResponse, Editor, EditorIndex, BooleanSetter, NumberSetter, ServerType, Track, EndpointPromiser, Emitter, EventType, Definitions, StringObject } from "@moviemasher/moviemasher.js";
// TODO: determine if we really need to repeat this
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}
type UnknownChangeEvent = React.ChangeEvent<{}>;
type SliderChangeHandler = (event: UnknownChangeEvent, value: number | number[]) => void;
type NodeObject = Exclude<React.ReactNode, boolean | null | undefined>;
type NodesArray = Array<NodeObject>;
type UnknownElement = React.ReactElement<Record<string, unknown>>;
interface ElementRecord extends Record<string, UnknownElement> {
}
type ThemeIcons = Record<string, JSX.Element>;
interface SourceCallbackOptions extends Record<string, unknown> {
    page?: number;
    perPage?: number;
    terms?: string;
}
type ReactStateSetter<T = string> = React.Dispatch<React.SetStateAction<T>>;
interface ListenerCallback {
    (event: Event): void;
}
interface PropsAndChild extends Record<string, unknown> {
    children: React.ReactElement<Record<string, unknown>>;
}
interface PropsWithoutChild extends Record<string, unknown> {
    children?: never;
}
interface PropsWithChildren extends Record<string, unknown> {
    children?: React.ReactNode;
}
interface PropsAndChildren extends Record<string, unknown> {
    children: React.ReactNode;
}
type ReactResult = React.ReactElement<any, any> | null;
type PropsMethod<I, O> = (input?: I) => O;
interface WithClassName extends Record<string, unknown> {
    className?: string;
}
interface ActivityProps extends PropsWithChildren, WithClassName {
    initialPicked?: string;
    initialCollapsed?: boolean;
}
/**
 * @parents Masher
 * @children ActivityContent
 */
declare function Activity(props: ActivityProps): ReactResult;
interface ActivityContentProps extends WithClassName, PropsAndChild {
}
/**
 * @parents Activity
 * @children ActivityItem
 */
declare function ActivityContent(props: ActivityContentProps): ReactResult;
declare const activityLabel: (info: any) => string;
declare enum ActivityGroup {
    Active = "active",
    Error = "error",
    Complete = "complete"
}
declare const ActivityGroups: ActivityGroup[];
declare const isActivityGroup: (type?: any) => type is ActivityGroup;
declare function assertActivityGroup(value: any, name?: string): asserts value is ActivityGroup;
interface ActivityObject {
    infos: ActivityInfo[];
    id: string;
    activityGroup: ActivityGroup;
}
type ActivityObjects = ActivityObject[];
interface ActivityContextInterface {
    label: string;
    activities: ActivityObjects;
    allActivities: ActivityObjects;
    picked: ActivityGroup;
    pick: (activityGroup: ActivityGroup) => void;
}
declare const ActivityContextDefault: ActivityContextInterface;
declare const ActivityContext: React.Context<ActivityContextInterface>;
declare const ActivityContentContextDefault: ActivityObject;
declare const ActivityContentContext: React.Context<ActivityObject>;
interface ActivityItemProps extends PropsWithChildren, WithClassName {
    collapsed?: boolean;
}
/**
 * @parents ActivityContent
 * @children ActivityLabel, ActivityPicked, CollapseControl
 */
declare function ActivityItem(props: ActivityItemProps): ReactResult;
/**
 * @parents ActivityItem
 */
declare function ActivityLabel(props: WithClassName): ReactResult;
interface ActivityPickedProps extends AndId, PropsAndChild {
}
/**
 * @parents ActivityContent
 */
declare function ActivityPicked(props: ActivityPickedProps): ReactResult;
interface ActivityPickerProps extends PropsAndChild, WithClassName, AndId {
}
/**
 * @parents ActivityContent
 */
declare function ActivityPicker(props: ActivityPickerProps): ReactResult;
interface ActivityProgressProps extends PropsWithoutChild, WithClassName {
}
/**
 * @parents Activity
 */
declare function ActivityProgress(props: ActivityProgressProps): ReactResult;
interface BarOptions {
    props?: WithClassName;
    before?: React.ReactChild[];
    after?: React.ReactChild[];
    content?: React.ReactChild | React.ReactChild[];
}
interface BarProps extends BarOptions, PropsWithoutChild {
}
declare function Bar(props: BarProps): ReactResult;
interface ContentOptions {
    props?: WithClassName;
    children?: React.ReactElement<WithClassName>;
}
interface PanelOptionsStrict {
    icons: ThemeIcons;
    props: WithClassName;
    header: BarOptions;
    content: ContentOptions;
    footer: BarOptions;
}
type PanelOptions = Partial<PanelOptionsStrict>;
declare const panelOptionsStrict: (options: PanelOptions) => PanelOptionsStrict;
interface PanelProps extends PropsAndChildren, WithClassName {
    collapsed?: boolean;
}
declare function Panel(props: PanelProps): ReactResult;
interface ActivityPropsDefault extends PanelOptions, PropsWithoutChild {
}
declare const ActivityPropsDefault: PropsMethod<ActivityPropsDefault, ActivityProps>;
interface ApiProps extends PropsWithChildren {
    endpoint?: Endpoint;
    path?: string;
}
declare function ApiClient(props: ApiProps): ReactResult;
interface ApiContextInterface {
    enabled: boolean;
    servers: ApiServersResponse;
    endpointPromise: (id: string, body?: JsonObject, setStatus?: StringSetter) => Promise<any>;
}
declare const ApiContextDefault: ApiContextInterface;
declare const ApiContext: React.Context<ApiContextInterface>;
declare function ApiEnabled(props: PropsWithChildren): ReactResult;
interface BroadcasterProps extends PropsAndChildren, WithClassName {
}
/**
 * @parents Masher
 * @children StreamerContent, StreamerControl, StreamerPreloadControl, StreamerUpdateControl
 */
declare function Broadcaster(props: BroadcasterProps): ReactResult;
interface BroadcasterControlProps extends PropsAndChildren, WithClassName {
}
declare function BroadcasterControl(props: BroadcasterControlProps): ReactResult;
interface BroadcasterContentProps extends PropsWithoutChild, WithClassName {
}
declare function BroadcasterContent(props: BroadcasterContentProps): ReactResult;
interface BroadcasterPreloadControlProps extends PropsAndChildren, WithClassName {
}
declare function BroadcasterPreloadControl(props: BroadcasterPreloadControlProps): ReactResult;
interface BroadcasterUpdateControlProps extends PropsAndChildren, WithClassName {
}
declare function BroadcasterUpdateControl(props: BroadcasterUpdateControlProps): ReactResult;
interface BrowserProps extends PropsWithChildren {
    initialPicked?: string;
}
/**
 * @parents Masher
 * @children BrowserContent, BrowserPicker
 */
declare function Browser(props: BrowserProps): ReactResult;
interface BrowserContentProps extends WithClassName, PropsAndChild {
}
/**
 * @parents Browser
 * @children BrowserSource
 */
declare function BrowserContent(props: BrowserContentProps): ReactResult;
interface BrowserContextInterface {
    addPicker: (id: string, types: DefinitionType[]) => void;
    definitions: Definition[];
    pick: StringSetter;
    picked: string;
    removePicker: (id: string) => void;
}
declare const BrowserContextDefault: BrowserContextInterface;
declare const BrowserContext: React.Context<BrowserContextInterface>;
interface BrowserPickerProps extends PropsAndChild, AndId, WithClassName {
    type?: string;
    types?: string | string[];
}
/**
 * @parents Browser
 */
declare function BrowserPicker(props: BrowserPickerProps): ReactResult;
interface BrowserPropsDefault extends PanelOptions, PropsWithoutChild {
}
declare const BrowserPropsDefault: PropsMethod<BrowserPropsDefault, BrowserProps>;
declare function BrowserControl(props: PropsAndChild): ReactResult;
interface ClipContextInterface {
    prevClipEnd: number;
    clip?: Clip;
}
declare const ClipContextDefault: ClipContextInterface;
declare const ClipContext: React.Context<ClipContextInterface>;
interface ClipItemProps extends WithClassName, PropsWithoutChild {
}
/**
 * @parents TimelineTrack
 */
declare function ClipItem(props: ClipItemProps): ReactResult;
declare const useClip: () => Clip;
interface ComposerProps extends PropsWithChildren {
}
/**
 * @parents Masher
 * @children ComposerContent
 */
declare function Composer(props: ComposerProps): ReactResult;
interface ComposerContentProps extends PropsAndChild, WithClassName {
}
/**
 * @parents Composer
 * @children ComposerLayer
 */
declare function ComposerContent(props: ComposerContentProps): ReactResult;
declare function ComposerDepth(props: PropsAndChild): ReactResult;
/**
 * @parents ComposerContent
 */
declare function ComposerFolderClose(props: PropsAndChild): ReactResult;
/**
 * @parents ComposerContent
 */
declare function ComposerFolderOpen(props: PropsAndChild): ReactResult;
interface ComposerLayerProps extends PropsWithChildren, WithClassName {
}
/**
 * @parents ComposerContent
 * @children ComposerLayerFolder, ComposerLayerMash, ComposerFolderClose, ComposerFolderOpen, ComposerDepth, ComposerLayerLabel
 */
declare function ComposerLayer(props: ComposerLayerProps): ReactResult;
/**
 * @parents ComposerContent
 */
declare function ComposerLayerFolder(props: PropsAndChildren): ReactResult;
declare function ComposerLayerLabel(props: PropsWithoutChild): ReactResult;
/**
 * @parents ComposerContent
 */
declare function ComposerLayerMash(props: PropsAndChildren): ReactResult;
interface ComposerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {
}
declare const DefaultComposerProps: PropsMethod<ComposerPropsDefault, ComposerProps>;
declare const DragSuffix = "/x-moviemasher";
type FileInfo = File | UnknownObject;
type FileInfos = FileInfo[];
interface DragOffsetObject {
    offset: number;
}
declare const isDragOffsetObject: (value: any) => value is DragOffsetObject;
declare function assertDragOffsetObject(value: any): asserts value is DragOffsetObject;
interface DragDefinitionObject extends DragOffsetObject {
    definitionObject: DefinitionObject;
}
declare const isDragDefinitionObject: (value: any) => value is DragDefinitionObject;
declare function assertDragDefinitionObject(value: any): asserts value is DragDefinitionObject;
interface DragLayerObject extends UnknownObject {
    offset: number;
    mashAndDefinitions?: MashAndDefinitionsObject;
}
interface DragEffectObject extends UnknownObject {
    index: number;
    definitionObject?: DefinitionObject;
}
type Draggable = DefinitionObject | MashAndDefinitionsObject | Clip | Effect | Layer | FileList;
declare enum DragType {
    Mash = "mash",
    Layer = "layer",
    Track = "track"
}
declare const DragTypes: DragType[];
declare const isDragType: (value: any) => value is DragType;
declare const TransferTypeFiles = "Files";
type TransferType = string;
declare const isTransferType: (value: any) => value is string;
//
declare const dropType: (dataTransfer?: DataTransfer | null | undefined) => TransferType | undefined;
declare const dragDefinitionType: (transferType: TransferType) => DefinitionType;
declare const dragType: (dataTransfer?: DataTransfer | null | undefined) => DragType | DefinitionType | undefined;
declare const dragTypes: (dataTransfer: DataTransfer) => string[];
declare const dragData: (dataTransfer: DataTransfer, type?: string | undefined) => any;
declare const DragElementRect: (current: Element) => Rect;
declare const DragElementPoint: (event: DragEvent, current: Element | Rect) => Point;
declare const dropFilesFromList: (files: FileList, serverOptions?: JsonObject) => FileInfos;
declare const droppingPositionClass: (droppingPosition?: number | DroppingPosition | undefined) => string;
interface ComposerContextInterface {
    selectedLayer?: Layer;
    refreshed: number;
    refresh: VoidMethod;
    validDragType: (dataTransfer?: DataTransfer | null) => DragType | undefined;
    droppingPosition: DroppingPosition | number;
    setDroppingPosition: (_: DroppingPosition | number) => void;
    droppingLayer?: Layer;
    setDroppingLayer: (_?: Layer) => void;
    onDrop: (event: DragEvent) => void;
    onDragLeave: VoidMethod;
}
declare const ComposerContextDefault: ComposerContextInterface;
declare const ComposerContext: React.Context<ComposerContextInterface>;
declare function CreateEditedControl(props: PropsAndChild): ReactResult;
interface EditorRedoButtonProps extends PropsAndChild {
}
declare function EditorRedoButton(props: EditorRedoButtonProps): ReactResult;
interface EditorRemoveButtonProps extends PropsAndChild {
    type: string;
}
declare function EditorRemoveButton(props: EditorRemoveButtonProps): ReactResult;
interface EditorUndoButtonProps extends PropsAndChild {
}
declare function EditorUndoButton(props: EditorUndoButtonProps): ReactResult;
declare function RenderControl(props: PropsAndChild): ReactResult;
declare function SaveControl(props: PropsAndChild): ReactResult;
interface SelectEditedControlProps extends PropsAndChild, WithClassName {
}
declare function SelectEditedControl(props: SelectEditedControlProps): ReactResult;
declare function ViewControl(props: PropsAndChild): ReactResult;
interface DefinitionContextInterface {
    definition?: Definition;
}
declare const DefinitionContextDefault: DefinitionContextInterface;
declare const DefinitionContext: React.Context<DefinitionContextInterface>;
interface DefinitionItemProps extends WithClassName, PropsWithoutChild {
    draggable?: boolean;
    iconRatio?: number;
}
/**
 * @parents BrowserContent, DefinitionDrop
 */
declare function DefinitionItem(props: DefinitionItemProps): ReactResult;
declare const useDefinition: () => Definition;
type DataTypeElements = {
    [key in DataType]: UnknownElement;
};
declare const DataTypeInputs: DataTypeElements;
declare function BooleanTypeInput(): ReactResult;
interface DefinitionDropProps extends WithClassName, PropsAndChild {
    type?: string;
    types?: string | string[];
}
declare function DefinitionDrop(props: DefinitionDropProps): ReactResult;
declare function DefinitionSelect(): ReactResult;
declare function NumericTypeInput(): ReactResult;
declare function PercentTypeInput(): ReactResult;
declare function RgbTypeInput(): ReactResult;
declare function SizingTypeInput(): ReactResult;
declare function TextTypeInput(): ReactResult;
declare function TimingTypeInput(): ReactResult;
type DataGroupElements = {
    [key in DataGroup]: UnknownElement;
};
interface DataGroupProps extends PropsWithoutChild, WithClassName {
    selectType?: SelectType;
}
declare const DataGroupInputs: DataGroupElements;
declare function ColorGroupInput(props: DataGroupProps): ReactResult;
interface EffectsInputProps extends PropsWithoutChild, WithClassName {
    selectedEffects?: SelectedEffects;
}
/**
 *
 * @children InspectorEffect
 */
declare function EffectsGroupInput(props: EffectsInputProps): ReactResult;
declare function OpacityGroupInput(props: DataGroupProps): ReactResult;
declare function PointGroupInput(props: DataGroupProps): ReactResult;
declare function SizeGroupInput(props: DataGroupProps): ReactResult;
declare function SizingGroupInput(props: DataGroupProps): ReactResult;
declare function TimingGroupInput(props: DataGroupProps): ReactResult;
interface InputContextInterface {
    property: Property;
    name: string;
    value: Scalar;
    defaultValue?: Scalar;
    changeHandler?: PropertiedChangeHandler;
    time?: Time;
}
declare const InputContextDefault: InputContextInterface;
declare const InputContext: React.Context<InputContextInterface>;
interface InspectorProps extends PropsAndChildren, WithClassName {
}
/**
 * @parents Masher
 * @children InspectorContent
 */
declare function Inspector(props: InspectorProps): ReactResult;
/**
 * @parents Inspector
 */
declare function InspectorContent(props: PropsWithChildren): ReactResult;
type DataGroupBooleans = {
    [index in DataGroup]?: boolean;
};
interface SelectedInfo {
    tweenDefined: DataGroupBooleans;
    tweenSelected: DataGroupBooleans;
    selectedType: SelectType;
    selectTypes: SelectType[];
    timeRange?: TimeRange;
    onEdge?: boolean;
    nearStart?: boolean;
    time?: Time;
}
type TweenSetter = (group: DataGroup, tweening: boolean) => void;
interface InspectorContextInterface {
    actionCount: number;
    selectedInfo: SelectedInfo;
    selectedItems: SelectedItems;
    changeSelected: StringSetter;
    changeTweening: TweenSetter;
}
declare const InspectorContextDefault: InspectorContextInterface;
declare const InspectorContext: React.Context<InspectorContextInterface>;
interface InspectorEffectProps extends WithClassName {
    effect: Effect;
    selectedEffect: Effect | null;
    setSelectedEffect: (effect: Effect | null) => void;
    index: number;
    removeHandler: EffectRemovehandler;
}
/**
 * @parents InspectorEffects
 */
declare function InspectorEffect(props: InspectorEffectProps): ReactResult;
interface InspectorPropertiesProps extends PropsWithoutChild, WithClassName {
    selectedItems?: SelectedItems;
    time?: Time;
}
/**
 * @parents InspectorContent
 */
declare function InspectorProperties(props: InspectorPropertiesProps): ReactResult;
interface InspectorPropertyProps extends PropsWithoutChild, WithClassName {
    property: Property;
    value: Scalar;
    defaultValue?: Scalar;
    changeHandler: PropertiedChangeHandler;
    name: string;
    time?: Time;
}
/**
 * @parents InspectorContent
 */
declare function InspectorProperty(props: InspectorPropertyProps): ReactResult;
interface InspectorPropsDefault extends PanelOptions, PropsWithoutChild {
}
declare const InspectorPropsDefault: PropsMethod<InspectorPropsDefault, InspectorProps>;
interface InspectorPickedProps {
    types?: string | string[];
    type?: string;
    children: React.ReactNode;
}
/**
 * @parents InspectorContent
 */
declare function InspectorPicked(props: InspectorPickedProps): ReactResult;
interface InspectorPickerProps extends PropsAndChild, WithClassName, AndId {
}
/**
 * @parents Inspector
 */
declare function InspectorPicker(props: InspectorPickerProps): ReactResult;
interface TimelineProps extends PropsAndChildren {
}
declare const TimelineDefaultZoom = 1;
/**
 * @parents Masher
 * @children TimelineContent, TimelineZoomer
 */
declare function Timeline(props: TimelineProps): ReactResult;
interface TimelinePropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {
}
declare const DefaultTimelineProps: PropsMethod<TimelinePropsDefault, TimelineProps>;
interface PlayerProps extends PropsAndChildren, WithClassName {
    disabled?: boolean;
}
/**
 * @parents Masher
 * @children PlayerContent, PlayerPlaying, PlayerNotPlaying, PlayerTimeControl, PlayerTime, PlayerButton
 */
declare function Player(props: PlayerProps): ReactResult;
interface PlayerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {
}
declare const DefaultPlayerProps: PropsMethod<PlayerPropsDefault, PlayerProps>;
type PanelOptionsOrFalse = PanelOptions | false;
interface UiOptions {
    [index: string]: PanelOptionsOrFalse;
    browser: BrowserPropsDefault | false;
    player: PlayerPropsDefault | false;
    inspector: InspectorPropsDefault | false;
    timeline: TimelinePropsDefault | false;
    composer: ComposerPropsDefault | false;
    activity: ActivityPropsDefault | false;
}
interface MasherOptions extends UnknownObject, WithClassName {
    previewSize?: Size;
    icons?: ThemeIcons;
    editType?: EditType;
    edited?: DataDefaultResponse;
}
interface EditorProps extends MasherOptions, PropsWithoutChild {
    panels?: Partial<UiOptions>;
}
interface MasherProps extends MasherOptions, PropsWithChildren {
}
/**
 * @parents ApiClient, Masher
 * @children Browser, Timeline, Inspector, Player, Composer
 * @returns provided children wrapped in a {@link View} and {@link MasherContext}
 */
declare function Masher(props: MasherProps): ReactResult;
declare const MasherCastProps: PropsMethod<EditorProps, MasherProps>;
declare const MasherDefaultProps: PropsMethod<EditorProps, MasherProps>;
interface MasherContextInterface {
    changeDefinition: (definition?: Definition) => void;
    definition?: Definition;
    draggable?: Draggable;
    drop: (draggable: Draggable, editorIndex?: EditorIndex) => Promise<Definition[]>;
    editor?: Editor;
    editorIndex: EditorIndex;
    icons: ThemeIcons;
    save: () => void;
    setDraggable(draggable?: Draggable): void;
}
declare const MasherContextDefault: MasherContextInterface;
declare const MasherContext: React.Context<MasherContextInterface>;
interface PanelContentProps extends PropsAndChildren, WithClassName {
}
declare function PanelContent(props: PanelContentProps): ReactResult;
type PanelContentElement = React.FunctionComponentElement<typeof PanelContent>;
interface PanelFootProps extends PropsAndChildren, WithClassName {
}
declare function PanelFoot(props: BarProps): ReactResult;
interface PanelHeadProps extends PropsAndChildren, WithClassName {
}
declare function PanelHead(props: PanelHeadProps): ReactResult;
type PanelHeadElement = React.FunctionComponentElement<typeof PanelHead>;
interface PanelsProps extends PropsAndChildren, WithClassName {
}
declare function Panels(props: PanelsProps): ReactResult;
interface PlayerContextInterface {
    disabled?: boolean;
    paused: boolean;
    changePaused: BooleanSetter;
    changeVolume: NumberSetter;
    volume: number;
}
declare const PlayerContextDefault: PlayerContextInterface;
declare const PlayerContext: React.Context<PlayerContextInterface>;
/**
 *
 * @parents Player
 */
declare function PlayerButton(props: PropsWithChildren): ReactResult;
interface PlayerContentProps extends PropsWithChildren, WithClassName {
}
/**
 * @parents Player
 */
declare function PlayerContent(props: PlayerContentProps): ReactResult;
/**
 *
 * @group Player
 */
declare function PlayerNotPlaying(props: PropsAndChild): ReactResult;
/**
 *
 * @group Player
 */
declare function PlayerPlaying(props: PropsAndChild): ReactResult;
interface PlayerTimeProps extends PropsWithoutChild, WithClassName {
}
/**
 *
 * @parents Editor
 */
declare function PlayerTime(props: PlayerTimeProps): ReactResult;
interface PlayerTimeControlProps extends PropsWithChildren, WithClassName {
}
declare function PlayerTimeControl(props: PlayerTimeControlProps): ReactResult;
interface ProcessProps extends PropsWithChildren {
    id: ServerType | string;
}
/**
 * @parents ApiClient
 */
declare function Process(props: ProcessProps): ReactResult;
interface ProcessActiveProps extends PropsWithChildren {
}
/**
 * @parents Process
 */
declare function ProcessActive(props: ProcessActiveProps): ReactResult;
interface ProcessInactiveProps extends PropsWithChildren {
}
/**
 * @parents Process
 */
declare function ProcessInactive(props: ProcessInactiveProps): ReactResult;
interface ProcessStatusProps extends PropsWithoutChild, WithClassName {
}
/**
 * @parents Process, ProcessActive
 */
declare function ProcessStatus(props: ProcessStatusProps): ReactResult;
/**
 * @parents Process, ProcessActive
 */
declare function ProcessProgress(_: PropsWithoutChild): ReactResult;
interface ShooterProps extends PropsWithChildren, WithClassName {
}
declare function Shooter(props: ShooterProps): ReactResult;
interface StreamerProps extends PropsWithChildren, WithClassName {
}
declare function Streamer(props: StreamerProps): ReactResult;
interface StreamersProps extends PropsWithChildren, WithClassName {
}
declare function Streamers(props: StreamersProps): ReactResult;
declare function StreamersCreateControl(props: PropsWithChildren): ReactResult;
interface TimelineAddClipControlProps extends PropsAndChild, WithClassName {
}
declare function TimelineAddClipControl(props: TimelineAddClipControlProps): ReactResult;
interface TimelineAddTrackControlProps extends PropsAndChild, WithClassName {
}
declare function TimelineAddTrackControl(props: TimelineAddTrackControlProps): ReactResult;
interface TimelineContentProps extends PropsWithChildren, WithClassName {
}
/**
 * @parents Timeline
 * @children TimelineTracks, TimelineScrubber, TimelineSizer
 */
declare function TimelineContent(props: TimelineContentProps): ReactResult;
interface TimelineContextInterface {
    dragTypeValid(dataTransfer: DataTransfer, clip?: Clip): boolean;
    droppingClip?: Clip;
    droppingPosition?: DroppingPosition | number;
    droppingTrack?: Track;
    frame: number;
    frames: number;
    onDragLeave: (event: DragEvent) => void;
    onDrop: (event: DragEvent) => void;
    rect: Rect;
    refresh: VoidMethod;
    refreshed: number;
    scale: number;
    scroll: Point;
    selectedClip?: Clip;
    selectedTrack?: Track;
    setDroppingClip(_?: Clip): void;
    setDroppingPosition(_: DroppingPosition | number): void;
    setDroppingTrack(_?: Track): void;
    setRect(_: Rect): void;
    setScroll(_: Point): void;
    setZoom: NumberSetter;
    zoom: number;
}
declare const TimelineContextDefault: TimelineContextInterface;
declare const TimelineContext: React.Context<TimelineContextInterface>;
interface TimelineScrubber extends PropsWithChildren, WithClassName {
    inactive?: boolean;
    styleHeight?: boolean;
    styleWidth?: boolean;
}
/**
 * @parents Timeline
 */
declare function TimelineScrubber(props: TimelineScrubber): ReactResult;
/**
 * @parents TimelineScrubber
 */
declare function TimelineScrubberElement(props: PropsWithChildren): ReactResult;
/**
 * @parents Timeline
 */
declare function TimelineSizer(props: PropsWithChildren): ReactResult;
interface TimelineTrackProps extends PropsAndChild, WithClassName {
    label?: string;
}
/**
 * @parents TimelineTracks
 */
declare function TimelineTrack(props: TimelineTrackProps): ReactResult;
interface TimelineTrackIcon extends PropsWithoutChild, WithClassName {
    icons: ThemeIcons;
}
/**
 * @parents TimelineTracks
 * @children TimelineTracks, TimelineScrubber, TimelineScrubberElement, TimelineSizer
 */
declare function TimelineTrackIcon(props: TimelineTrackIcon): ReactResult;
interface TimelineTracksProps extends PropsAndChildren {
}
/**
 * @parents TimelineContent
 * @children TimelineTrack
 */
declare function TimelineTracks(props: TimelineTracksProps): ReactResult;
interface TimelineZoomProps extends PropsAndChild, WithClassName {
    zoom: number;
}
/**
 * @parents Timeline
 */
declare function TimelineZoom(props: TimelineZoomProps): ReactResult;
/**
 * @parents Timeline
 */
declare function TimelineZoomer(props: PropsWithChildren): ReactResult;
declare function WebrtcButton(props: PropsWithChildren): ReactResult;
declare class WebrtcClient {
    constructor(endpointPromise: EndpointPromiser, setStatus: StringSetter);
    beforeAnswer(peerConnection: RTCPeerConnection): Promise<void>;
    closeConnection(): void;
    createConnection(options?: {
        stereo?: boolean;
    }): Promise<void>;
    endpointPromise: EndpointPromiser;
    localPeerConnection?: RTCPeerConnection;
    localStream?: MediaStream;
    setStatus: StringSetter;
}
interface WebrtcContentProps extends PropsWithoutChild {
}
declare function WebrtcContent(props: WebrtcContentProps): ReactResult;
interface WebrtcProps extends PropsAndChildren, WithClassName {
}
declare function Webrtc(props: WebrtcProps): JSX.Element | null;
interface LayerContextInterface {
    layer?: Layer;
    depth: number;
}
declare const LayerContextDefault: LayerContextInterface;
declare const LayerContext: React.Context<LayerContextInterface>;
interface ProcessContextInterface {
    error: string;
    processing: boolean;
    progress: number;
    setError: StringSetter;
    setProcessing: BooleanSetter;
    setProgress: NumberSetter;
    setStatus: StringSetter;
    status: string;
}
declare const ProcessContextDefault: ProcessContextInterface;
declare const ProcessContext: React.Context<ProcessContextInterface>;
interface ShooterContextInterface {
    devices: MediaDeviceInfo[];
}
declare const ShooterContextDefault: ShooterContextInterface;
declare const ShooterContext: React.Context<ShooterContextInterface>;
interface TrackContextInterface {
    track?: Track;
}
declare const TrackContextDefault: TrackContextInterface;
declare const TrackContext: React.Context<TrackContextInterface>;
interface ViewerContextInterface {
    streaming: boolean;
    preloading: boolean;
    updating: boolean;
    width: number;
    height: number;
    videoRate: number;
    setWidth: NumberSetter;
    setHeight: NumberSetter;
    setVideoRate: NumberSetter;
    setPreloading: BooleanSetter;
    setUpdating: BooleanSetter;
    setStreaming: BooleanSetter;
    id: string;
    setId: StringSetter;
    url: string;
    setUrl: StringSetter;
}
declare const ViewerContextDefault: ViewerContextInterface;
declare const ViewerContext: React.Context<ViewerContextInterface>;
interface WebrtcContextInterface {
    client?: WebrtcClient;
    setClient: (client: WebrtcClient | undefined) => void;
}
declare const WebrtcContextDefault: WebrtcContextInterface;
declare const WebrtcContext: React.Context<WebrtcContextInterface>;
declare const DefaultStreamerProps: (args: UnknownObject) => {
    className: string;
    children: JSX.Element;
};
declare const useEditor: () => Editor;
declare const useLayer: () => Layer;
interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {
}
declare const useListeners: (events: ListenerEvents, target?: Emitter | undefined) => void;
declare const useEditorActivity: () => [
    Editor,
    ActivityObjects
];
declare const useEditorDefinitions: (types?: DefinitionType[]) => [
    Editor,
    Definitions
];
declare const useApiDefinitions: (types?: DefinitionType[]) => [
    Editor,
    Definitions
];
declare const EmptyElement: UnknownElement;
declare const TweenInputKey = "tween-input-key";
declare const Problems: {
    child: string;
};
interface ButtonProps extends PropsAndChildren, WithClassName {
    onClick?: (event: React.MouseEvent) => void;
    useView?: boolean;
    disabled?: boolean;
    selected?: boolean;
}
declare function Button(props: ButtonProps): ReactResult;
declare const elementSetPreviewSize: (current?: HTMLDivElement | null | undefined, size?: Size | undefined) => void;
declare const labelObjects: Record<string, StringObject>;
declare const labels: StringObject;
declare const labelLookup: (id: string) => string;
declare const labelTranslate: (id: string) => string;
declare const labelInterpolate: (id: string, context: StringObject) => string;
declare const propsDefinitionTypes: (type?: string | undefined, types?: string | string[] | undefined, id?: string | undefined) => DefinitionType[];
declare const propsSelectTypes: (type?: string | undefined, types?: string | string[] | undefined, id?: string | undefined) => SelectType[];
declare const sessionGet: (key: string) => string;
declare const sessionSet: (key: string, value: any) => void;
interface SliderProps extends WithClassName {
    value?: number;
    step?: number;
    max?: number;
    min?: number;
    onChange?: SliderChangeHandler;
}
declare function Slider(props: SliderProps): ReactResult;
declare const VideoView: React.ForwardRefExoticComponent<Pick<PropsWithoutChild, keyof PropsWithoutChild> & React.RefAttributes<HTMLVideoElement>>;
declare const View: React.ForwardRefExoticComponent<Pick<UnknownObject, string | number> & React.RefAttributes<HTMLDivElement>>;
export { ActivityProps, Activity, ActivityContentProps, ActivityContent, ActivityContentContextDefault, ActivityContentContext, activityLabel, ActivityGroup, ActivityGroups, isActivityGroup, assertActivityGroup, ActivityObject, ActivityObjects, ActivityContextInterface, ActivityContextDefault, ActivityContext, ActivityItemProps, ActivityItem, ActivityLabel, ActivityPickedProps, ActivityPicked, ActivityPickerProps, ActivityPicker, ActivityProgressProps, ActivityProgress, ActivityPropsDefault, ApiProps, ApiClient, ApiContextInterface, ApiContextDefault, ApiContext, ApiEnabled, BroadcasterProps, Broadcaster, BroadcasterControlProps, BroadcasterControl, BroadcasterContentProps, BroadcasterContent, BroadcasterPreloadControlProps, BroadcasterPreloadControl, BroadcasterUpdateControlProps, BroadcasterUpdateControl, BrowserProps, Browser, BrowserContentProps, BrowserContent, BrowserContextInterface, BrowserContextDefault, BrowserContext, BrowserPickerProps, BrowserPicker, BrowserPropsDefault, BrowserControl, ClipContextInterface, ClipContextDefault, ClipContext, ClipItemProps, ClipItem, useClip, ComposerProps, Composer, ComposerContentProps, ComposerContent, ComposerDepth, ComposerFolderClose, ComposerFolderOpen, ComposerLayerProps, ComposerLayer, ComposerLayerFolder, ComposerLayerLabel, ComposerLayerMash, ComposerPropsDefault, DefaultComposerProps, ComposerContextInterface, ComposerContextDefault, ComposerContext, CreateEditedControl, EditorRedoButtonProps, EditorRedoButton, EditorRemoveButtonProps, EditorRemoveButton, EditorUndoButtonProps, EditorUndoButton, RenderControl, SaveControl, SelectEditedControlProps, SelectEditedControl, ViewControl, DefinitionContextInterface, DefinitionContextDefault, DefinitionContext, DefinitionItemProps, DefinitionItem, useDefinition, DataTypeElements, DataTypeInputs, BooleanTypeInput, DefinitionDropProps, DefinitionDrop, DefinitionSelect, NumericTypeInput, PercentTypeInput, RgbTypeInput, SizingTypeInput, TextTypeInput, TimingTypeInput, DataGroupElements, DataGroupProps, DataGroupInputs, ColorGroupInput, EffectsInputProps, EffectsGroupInput, OpacityGroupInput, PointGroupInput, SizeGroupInput, SizingGroupInput, TimingGroupInput, InputContextInterface, InputContextDefault, InputContext, InspectorProps, Inspector, InspectorContent, DataGroupBooleans, SelectedInfo, TweenSetter, InspectorContextInterface, InspectorContextDefault, InspectorContext, InspectorEffectProps, InspectorEffect, InspectorPropertiesProps, InspectorProperties, InspectorPropertyProps, InspectorProperty, InspectorPropsDefault, InspectorPickedProps, InspectorPicked, InspectorPickerProps, InspectorPicker, PanelOptionsOrFalse, UiOptions, MasherOptions, EditorProps, MasherProps, Masher, MasherCastProps, MasherDefaultProps, MasherContextInterface, MasherContextDefault, MasherContext, ContentOptions, PanelOptionsStrict, PanelOptions, panelOptionsStrict, PanelProps, Panel, PanelContentProps, PanelContent, PanelContentElement, PanelFootProps, PanelFoot, PanelHeadProps, PanelHead, PanelHeadElement, PanelsProps, Panels, PlayerContextInterface, PlayerContextDefault, PlayerContext, PlayerProps, Player, PlayerButton, PlayerContentProps, PlayerContent, PlayerNotPlaying, PlayerPlaying, PlayerPropsDefault, DefaultPlayerProps, PlayerTimeProps, PlayerTime, PlayerTimeControlProps, PlayerTimeControl, ProcessProps, Process, ProcessActiveProps, ProcessActive, ProcessInactiveProps, ProcessInactive, ProcessStatusProps, ProcessStatus, ProcessProgress, ShooterProps, Shooter, StreamerProps, Streamer, StreamersProps, Streamers, StreamersCreateControl, TimelineProps, TimelineDefaultZoom, Timeline, TimelineAddClipControlProps, TimelineAddClipControl, TimelineAddTrackControlProps, TimelineAddTrackControl, TimelineContentProps, TimelineContent, TimelineContextInterface, TimelineContextDefault, TimelineContext, TimelinePropsDefault, DefaultTimelineProps, TimelineScrubber, TimelineScrubberElement, TimelineSizer, TimelineTrackProps, TimelineTrack, TimelineTrackIcon, TimelineTracksProps, TimelineTracks, TimelineZoomProps, TimelineZoom, TimelineZoomer, WebrtcButton, WebrtcClient, WebrtcContentProps, WebrtcContent, WebrtcProps, Webrtc, LayerContextInterface, LayerContextDefault, LayerContext, ProcessContextInterface, ProcessContextDefault, ProcessContext, ShooterContextInterface, ShooterContextDefault, ShooterContext, TrackContextInterface, TrackContextDefault, TrackContext, ViewerContextInterface, ViewerContextDefault, ViewerContext, WebrtcContextInterface, WebrtcContextDefault, WebrtcContext, UnknownChangeEvent, SliderChangeHandler, NodeObject, NodesArray, UnknownElement, ElementRecord, ThemeIcons, SourceCallbackOptions, ReactStateSetter, ListenerCallback, PropsAndChild, PropsWithoutChild, PropsWithChildren, PropsAndChildren, ReactResult, PropsMethod, WithClassName, DragSuffix, FileInfo, FileInfos, DragOffsetObject, isDragOffsetObject, assertDragOffsetObject, DragDefinitionObject, isDragDefinitionObject, assertDragDefinitionObject, DragLayerObject, DragEffectObject, Draggable, DragType, DragTypes, isDragType, TransferTypeFiles, TransferType, isTransferType, dropType, dragDefinitionType, dragType, dragTypes, dragData, DragElementRect, DragElementPoint, dropFilesFromList, droppingPositionClass, DefaultStreamerProps, useEditor, useLayer, ListenerEvents, useListeners, useEditorActivity, useEditorDefinitions, useApiDefinitions, EmptyElement, TweenInputKey, Problems, BarOptions, BarProps, Bar, ButtonProps, Button, elementSetPreviewSize, labelObjects, labels, labelLookup, labelTranslate, labelInterpolate, propsDefinitionTypes, propsSelectTypes, sessionGet, sessionSet, SliderProps, Slider, VideoView, View };
//# sourceMappingURL=client-react.d.ts.map