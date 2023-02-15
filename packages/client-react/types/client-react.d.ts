/// <reference types="react" />
import React from "react";
import { Identified, Endpoint, ApiServersResponse, JsonRecord, MediaType, MediaArray, StringSetter, VoidMethod, Clip, Media, DataType, DataGroup, SelectedItems, SelectType, SelectedMovable, Movable, ScalarRecord, Scalar, PropertiedChangeHandler, Property, Time, TimeRange, IndexHandler, BooleanSetter, Editor, EditorIndex, UnknownRecord, Size, EditType, DataDefaultResponse, NumberSetter, ServerType, DroppingPosition, Rect, Track, Point, Emitter, EventType, NestedStringRecord, StringRecord } from "@moviemasher/moviemasher.js";
import { ActivityInfo, Draggable, Client } from "@moviemasher/client-core";
import { ThemeIcons } from "@moviemasher/theme-default";
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
interface ActivityObject extends Identified {
    infos: ActivityInfo[];
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
interface ActivityPickedProps extends Identified, PropsAndChild {
}
/**
 * @parents ActivityContent
 */
declare function ActivityPicked(props: ActivityPickedProps): ReactResult;
interface ActivityPickerProps extends PropsAndChild, WithClassName, Identified {
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
declare const ActivityDefaultProps: PropsMethod<ActivityPropsDefault, ActivityProps>;
interface ApiProps extends PropsWithChildren {
    endpoint?: Endpoint;
    path?: string;
}
declare function ApiClient(props: ApiProps): ReactResult;
interface ApiContextInterface {
    enabled: boolean;
    servers: ApiServersResponse;
    endpointPromise: (id: string, body?: JsonRecord) => Promise<any>;
}
declare const ApiContextDefault: ApiContextInterface;
declare const ApiContext: React.Context<ApiContextInterface>;
declare function ApiEnabled(props: PropsWithChildren): ReactResult;
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
    refresh: VoidMethod;
    addPicker: (id: string, types: MediaType[]) => void;
    definitions: MediaArray;
    pick: StringSetter;
    picked: string;
    removePicker: (id: string) => void;
}
declare const BrowserContextDefault: BrowserContextInterface;
declare const BrowserContext: React.Context<BrowserContextInterface>;
interface BrowserPickerProps extends PropsAndChild, Identified, WithClassName {
    type?: string;
    types?: string | string[];
}
/**
 * @parents Browser
 */
declare function BrowserPicker(props: BrowserPickerProps): ReactResult;
interface BrowserPropsDefault extends PanelOptions, PropsWithoutChild {
}
declare const BrowserDefaultProps: PropsMethod<BrowserPropsDefault, BrowserProps>;
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
    definition?: Media;
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
declare const useDefinition: () => Media;
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
declare function IconTypeInput(): ReactResult;
declare function NumericTypeInput(): ReactResult;
declare function PercentTypeInput(): ReactResult;
declare function RgbTypeInput(): ReactResult;
declare function TextTypeInput(): ReactResult;
declare function OptionTypeInput(): ReactResult;
type DataGroupElements = {
    [key in DataGroup]: UnknownElement;
};
interface DataGroupProps extends PropsWithoutChild, WithClassName {
    selectType?: SelectType;
    selectedItems?: SelectedItems;
}
declare const DataGroupInputs: DataGroupElements;
declare function ColorGroupInput(props: DataGroupProps): ReactResult;
interface MovablesGroupInputProps extends PropsWithoutChild {
    selectedMovable?: SelectedMovable;
    movableGenerator?: (object: ScalarRecord) => Movable;
    property: string;
}
/**
 *
 * @children InspectorEffect
 */
declare function MovablesGroupInput(props: MovablesGroupInputProps): ReactResult;
declare function OpacityGroupInput(props: DataGroupProps): ReactResult;
declare function PointGroupInput(props: DataGroupProps): ReactResult;
declare function SizeGroupInput(props: DataGroupProps): ReactResult;
interface OptionGroupInputProps extends DataGroupProps {
    dataGroup: DataGroup;
}
declare function OptionGroupInput(props: OptionGroupInputProps): ReactResult;
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
interface InspectorMovableProps extends WithClassName {
    movable: Movable;
    selected: Movable | null;
    select: (movable: Movable | null) => void;
    index: number;
    removeHandler: IndexHandler<Movable>;
    property: string;
}
/**
 * @parents MovablesGroupInput
 */
declare function InspectorMovable(props: InspectorMovableProps): ReactResult;
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
declare const InspectorDefaultProps: PropsMethod<InspectorPropsDefault, InspectorProps>;
interface InspectorPickedProps {
    types?: string | string[];
    type?: string;
    children: React.ReactNode;
}
/**
 * @parents InspectorContent
 */
declare function InspectorPicked(props: InspectorPickedProps): ReactResult;
interface InspectorPickerProps extends PropsAndChild, WithClassName, Identified {
}
/**
 * @parents Inspector
 */
declare function InspectorPicker(props: InspectorPickerProps): ReactResult;
interface MasherContextInterface {
    streaming: boolean;
    setStreaming: BooleanSetter;
    current: ScalarRecord;
    changeDefinition: (definition?: Media) => void;
    drop: (draggable: Draggable, editorIndex?: EditorIndex) => Promise<Media[]>;
    editor?: Editor;
    editorIndex: EditorIndex;
    icons: ThemeIcons;
    save: () => void;
}
declare const MasherContextDefault: MasherContextInterface;
declare const MasherContext: React.Context<MasherContextInterface>;
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
declare const TimelineDefaultProps: PropsMethod<TimelinePropsDefault, TimelineProps>;
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
declare const PlayerDefaultProps: PropsMethod<PlayerPropsDefault, PlayerProps>;
type PanelOptionsOrFalse = PanelOptions | false;
interface UiOptions {
    [index: string]: PanelOptionsOrFalse;
    browser: BrowserPropsDefault | false;
    player: PlayerPropsDefault | false;
    inspector: InspectorPropsDefault | false;
    timeline: TimelinePropsDefault | false;
    activity: ActivityPropsDefault | false;
}
interface MasherOptions extends UnknownRecord, WithClassName {
    previewSize?: Size;
    icons?: ThemeIcons;
    editType?: EditType;
    mashMedia?: DataDefaultResponse;
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
declare const MasherDefaultProps: PropsMethod<EditorProps, MasherProps>;
interface MashingProps extends PropsAndChildren {
    type?: string;
    types?: string | string[];
}
/**
 * @parents Masher
 */
declare function Mashing(props: MashingProps): ReactResult;
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
interface TrackContextInterface {
    track?: Track;
}
declare const TrackContextDefault: TrackContextInterface;
declare const TrackContext: React.Context<TrackContextInterface>;
interface ClientContextInterface {
    client: Client;
}
declare const ClientContextDefault: ClientContextInterface;
declare const ClientContext: React.Context<ClientContextInterface>;
declare const useApiDefinitions: (types?: MediaType[]) => [
    Editor,
    MediaArray
];
declare const useEditor: () => Editor;
declare const useEditorActivity: () => [
    Editor,
    ActivityObjects
];
declare const useEditorDefinitions: (types?: MediaType[]) => [
    Editor,
    MediaArray
];
interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {
}
declare const useListeners: (events: ListenerEvents, target?: Emitter) => void;
declare const useRefresh: () => [
    (...args: any[]) => void,
    number
];
declare const useClient: () => Client;
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
declare const elementSetPreviewSize: (current?: HTMLDivElement | null, size?: Size) => void;
declare const labelObjects: NestedStringRecord;
declare const labels: StringRecord;
declare const labelLookup: (id: string) => string;
declare const labelTranslate: (id: string) => string;
declare const labelInterpolate: (id: string, context: StringRecord) => string;
declare const propsMediaTypes: (type?: string, types?: string | string[], id?: string) => MediaType[];
declare const propsSelectTypes: (type?: string, types?: string | string[], id?: string) => SelectType[];
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
declare const VideoView: React.ForwardRefExoticComponent<Omit<PropsWithoutChild, "ref"> & React.RefAttributes<HTMLVideoElement>>;
declare const View: React.ForwardRefExoticComponent<Omit<UnknownRecord, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { UnknownChangeEvent, SliderChangeHandler, NodeObject, NodesArray, UnknownElement, ElementRecord, SourceCallbackOptions, ReactStateSetter, ListenerCallback, PropsAndChild, PropsWithoutChild, PropsWithChildren, PropsAndChildren, ReactResult, PropsMethod, WithClassName, ActivityProps, Activity, ActivityContentProps, ActivityContent, ActivityContentContextDefault, ActivityContentContext, activityLabel, ActivityGroup, ActivityGroups, isActivityGroup, assertActivityGroup, ActivityObject, ActivityObjects, ActivityContextInterface, ActivityContextDefault, ActivityContext, ActivityItemProps, ActivityItem, ActivityLabel, ActivityPickedProps, ActivityPicked, ActivityPickerProps, ActivityPicker, ActivityProgressProps, ActivityProgress, ActivityPropsDefault, ActivityDefaultProps, ApiProps, ApiClient, ApiContextInterface, ApiContextDefault, ApiContext, ApiEnabled, BrowserProps, Browser, BrowserContentProps, BrowserContent, BrowserContextInterface, BrowserContextDefault, BrowserContext, BrowserPickerProps, BrowserPicker, BrowserPropsDefault, BrowserDefaultProps, BrowserControl, ClipContextInterface, ClipContextDefault, ClipContext, ClipItemProps, ClipItem, useClip, CreateEditedControl, EditorRedoButtonProps, EditorRedoButton, EditorRemoveButtonProps, EditorRemoveButton, EditorUndoButtonProps, EditorUndoButton, RenderControl, SaveControl, SelectEditedControlProps, SelectEditedControl, ViewControl, DefinitionContextInterface, DefinitionContextDefault, DefinitionContext, DefinitionItemProps, DefinitionItem, useDefinition, DataTypeElements, DataTypeInputs, BooleanTypeInput, DefinitionDropProps, DefinitionDrop, DefinitionSelect, IconTypeInput, NumericTypeInput, PercentTypeInput, RgbTypeInput, TextTypeInput, OptionTypeInput, DataGroupElements, DataGroupProps, DataGroupInputs, ColorGroupInput, MovablesGroupInputProps, MovablesGroupInput, OpacityGroupInput, PointGroupInput, SizeGroupInput, OptionGroupInputProps, OptionGroupInput, InputContextInterface, InputContextDefault, InputContext, InspectorProps, Inspector, InspectorContent, DataGroupBooleans, SelectedInfo, TweenSetter, InspectorContextInterface, InspectorContextDefault, InspectorContext, InspectorMovableProps, InspectorMovable, InspectorPropertiesProps, InspectorProperties, InspectorPropertyProps, InspectorProperty, InspectorPropsDefault, InspectorDefaultProps, InspectorPickedProps, InspectorPicked, InspectorPickerProps, InspectorPicker, MasherContextInterface, MasherContextDefault, MasherContext, PanelOptionsOrFalse, UiOptions, MasherOptions, EditorProps, MasherProps, Masher, MasherDefaultProps, MashingProps, Mashing, ContentOptions, PanelOptionsStrict, PanelOptions, panelOptionsStrict, PanelProps, Panel, PanelContentProps, PanelContent, PanelContentElement, PanelFootProps, PanelFoot, PanelHeadProps, PanelHead, PanelHeadElement, PanelsProps, Panels, PlayerContextInterface, PlayerContextDefault, PlayerContext, PlayerProps, Player, PlayerButton, PlayerContentProps, PlayerContent, PlayerNotPlaying, PlayerPlaying, PlayerPropsDefault, PlayerDefaultProps, PlayerTimeProps, PlayerTime, PlayerTimeControlProps, PlayerTimeControl, ProcessProps, Process, ProcessActiveProps, ProcessActive, ProcessInactiveProps, ProcessInactive, ProcessStatusProps, ProcessStatus, ProcessProgress, TimelineProps, TimelineDefaultZoom, Timeline, TimelineAddClipControlProps, TimelineAddClipControl, TimelineAddTrackControlProps, TimelineAddTrackControl, TimelineContentProps, TimelineContent, TimelineContextInterface, TimelineContextDefault, TimelineContext, TimelinePropsDefault, TimelineDefaultProps, TimelineScrubber, TimelineScrubberElement, TimelineSizer, TimelineTrackProps, TimelineTrack, TimelineTrackIcon, TimelineTracksProps, TimelineTracks, TimelineZoomProps, TimelineZoom, TimelineZoomer, ProcessContextInterface, ProcessContextDefault, ProcessContext, TrackContextInterface, TrackContextDefault, TrackContext, ClientContextInterface, ClientContextDefault, ClientContext, useApiDefinitions, useEditor, useEditorActivity, useEditorDefinitions, ListenerEvents, useListeners, useRefresh, useClient, EmptyElement, TweenInputKey, Problems, BarOptions, BarProps, Bar, ButtonProps, Button, elementSetPreviewSize, labelObjects, labels, labelLookup, labelTranslate, labelInterpolate, propsMediaTypes, propsSelectTypes, sessionGet, sessionSet, SliderProps, Slider, VideoView, View };
//# sourceMappingURL=client-react.d.ts.map