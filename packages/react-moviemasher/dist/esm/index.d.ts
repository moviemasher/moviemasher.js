/// <reference types="react" />
import React from "react";
import { DataType, Definition, DefinitionObject, EventType, Masher, TrackType, UnknownObject, DefinitionType, Property, StringSetter, RemoteServer, Clip, Effect, Mash, Track, BooleanSetter, NumberSetter, SelectionValue, MasherChangeHandler, Propertied } from "@moviemasher/moviemasher.js";
type UnknownChangeEvent = React.ChangeEvent<{}>;
type SliderChangeHandler = (event: UnknownChangeEvent, value: number | number[]) => void;
type NodeObject = Exclude<React.ReactNode, boolean | null | undefined>;
type NodesArray = Array<NodeObject>;
interface DragClipObject extends UnknownObject {
    offset: number;
    definition?: DefinitionObject;
}
interface DropClipsResult {
    index: number;
    pixels: number;
    type: TrackType;
}
interface DragClipProps {
    isDragging: boolean;
    initialSourceClientOffset: number;
}
interface DropClipsProps {
    isOver: boolean;
}
type Panel = React.FunctionComponent<React.PropsWithChildren<UnknownObject>>;
type UnknownElement = React.ReactElement<UnknownObject>;
type EditorIcons = {
    [key: string]: UnknownElement;
};
type EditorInputs = {
    [key in DataType]: UnknownElement;
};
type DefinitionsPromise = Promise<Definition[]>;
interface SourceCallbackOptions extends UnknownObject {
    page?: number;
    perPage?: number;
    terms?: string;
}
type SourceCallback = (options?: SourceCallbackOptions) => DefinitionsPromise;
type ListenerCallback = (masher: Masher) => void;
type ListenerEvents = Partial<Record<EventType, ListenerCallback>>;
interface OnlyChildProps {
    children: React.ReactElement;
}
interface AddTrackButtonProps extends OnlyChildProps {
    trackType: string;
}
declare const AddTrackButton: React.FunctionComponent<AddTrackButtonProps>;
declare const RedoButton: React.FunctionComponent<OnlyChildProps>;
declare const RemoveButton: React.FunctionComponent<OnlyChildProps>;
declare const SplitButton: React.FunctionComponent<OnlyChildProps>;
declare const UndoButton: React.FunctionComponent<OnlyChildProps>;
declare const DragTypeSuffix = "/x-moviemasher";
declare const Constants: {
    DragTypeSuffix: string;
};
declare const DragType: {
    CLIP: string;
    MEDIA: string;
    EFFECT: string;
};
declare const DragTypes: string[];
declare const ServerType: {
    STREAM: string;
    RENDER: string;
    HOSTS: string;
    HLS: string;
    WEBRTC: string;
};
declare const ServerTypes: string[];
interface ButtonProps extends UnknownObject {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    startIcon?: React.ReactElement;
    endIcon?: React.ReactElement;
    children?: React.ReactElement | React.ReactText;
}
declare const Button: React.FunctionComponent<ButtonProps>;
interface CanvasViewProps extends UnknownObject {
    children?: never;
}
declare const CanvasView: React.ForwardRefExoticComponent<Pick<CanvasViewProps, string | number> & React.RefAttributes<HTMLCanvasElement>>;
declare const propsStringArray: (string?: string | undefined, array?: string | string[] | undefined, properties?: Property[] | undefined) => string[];
declare const propsDefinitionTypes: (type?: string | undefined, types?: string | string[] | undefined, id?: string | undefined) => DefinitionType[];
declare const Props: {
    stringArray: (string?: string | undefined, array?: string | string[] | undefined, properties?: Property[] | undefined) => string[];
    definitionTypes: (type?: string | undefined, types?: string | string[] | undefined, id?: string | undefined) => DefinitionType[];
};
interface SliderProps {
    className?: string;
    value?: number;
    step?: number;
    max?: number;
    min?: number;
    onChange?: SliderChangeHandler;
}
// React.ChangeEventHandler<HTMLInputElement>
declare const Slider: React.FC<SliderProps>;
interface VideoViewProps extends UnknownObject {
    children?: never;
}
declare const VideoView: React.ForwardRefExoticComponent<Pick<VideoViewProps, string | number> & React.RefAttributes<HTMLVideoElement>>;
declare const View: React.ForwardRefExoticComponent<Pick<UnknownObject, string> & React.RefAttributes<HTMLDivElement>>;
interface BrowserContextInterface {
    definitions?: Definition[];
    definitionId: string;
    setDefinitions: (value?: Definition[]) => void;
    setDefinitionId: StringSetter;
    setSourceId: StringSetter;
    sourceId: string;
}
declare const BrowserContextDefault: BrowserContextInterface;
declare const BrowserContext: React.Context<BrowserContextInterface>;
interface EditorContextInterface {
    masher: Masher;
}
declare const EditorContextDefault: EditorContextInterface;
declare const EditorContext: React.Context<EditorContextInterface>;
interface HostsContextInterface {
    enabled: string[];
    servers: Record<string, RemoteServer>;
    remoteServerPromise: (id: string) => Promise<RemoteServer>;
}
declare const HostsContextDefault: HostsContextInterface;
declare const HostsContext: React.Context<HostsContextInterface>;
interface InspectorContextInterface {
    definitionType: DefinitionType | "";
    actionCount: number;
    clip?: Clip;
    effect?: Effect;
    track?: Track;
    mash: Mash;
}
declare const InspectorContextDefault: InspectorContextInterface;
declare const InspectorContext: React.Context<InspectorContextInterface>;
interface PlayerContextInterface {
    paused: boolean;
    setPaused: BooleanSetter;
    setVolume: NumberSetter;
    volume: number;
}
declare const PlayerContextDefault: PlayerContextInterface;
declare const PlayerContext: React.Context<PlayerContextInterface>;
interface RemoteContextInterface {
    error: string;
    processing: boolean;
    progress: number;
    setError: StringSetter;
    setProcessing: BooleanSetter;
    setProgress: NumberSetter;
    setStatus: StringSetter;
    status: string;
}
declare const RemoteContext: React.Context<RemoteContextInterface>;
interface StreamContextInterface {
    streaming: boolean;
    status: string;
    setStatus: StringSetter;
    setStreaming: BooleanSetter;
    remoteServerPromise: (id: string) => Promise<RemoteServer>;
}
declare const StreamContextDefault: StreamContextInterface;
declare const StreamContext: React.Context<StreamContextInterface>;
interface TimelineContextInterface {
    height: number;
    setHeight: NumberSetter;
    setWidth: NumberSetter;
    setZoom: NumberSetter;
    width: number;
    zoom: number;
}
declare const TimelineContextDefault: TimelineContextInterface;
declare const TimelineContext: import("react").Context<TimelineContextInterface>;
interface TrackContextInterface {
    trackType: TrackType;
    layer: number;
}
declare const TrackContextDefault: TrackContextInterface;
declare const TrackContext: React.Context<TrackContextInterface>;
declare const TrackContextProvider: React.Provider<TrackContextInterface>;
declare class WebrtcClient {
    constructor(remoteServer?: RemoteServer);
    beforeAnswer(peerConnection: RTCPeerConnection): Promise<void>;
    closeConnection(): void;
    connectionsUrl(suffix?: string): string;
    createConnection(options?: {
        stereo?: boolean;
    }): Promise<RTCPeerConnection>;
    localPeerConnection?: RTCPeerConnection;
    localStream?: MediaStream;
    remoteServer?: RemoteServer;
}
interface WebrtcContextInterface {
    broadcasting: boolean;
    remoteServerPromise: (id: string) => Promise<RemoteServer>;
    setBroadcasting: BooleanSetter;
    setStatus: StringSetter;
    status: string;
    webrtcClient: WebrtcClient;
}
declare const WebrtcContextDefault: WebrtcContextInterface;
declare const WebrtcContext: React.Context<WebrtcContextInterface>;
interface InputContextInterface {
    property: string;
    value: SelectionValue;
    changeHandler: MasherChangeHandler;
}
declare const InputContextDefault: InputContextInterface;
declare const InputContext: React.Context<InputContextInterface>;
declare const useListeners: (events: ListenerEvents) => EditorContextInterface;
declare const useMashScale: () => number;
declare const useSelected: () => import("../../dist/esm").Clip | undefined;
interface BrowserProps extends UnknownObject {
    sourceId?: string;
    children: React.ReactNode;
}
declare const BrowserPanel: React.FunctionComponent<BrowserProps>;
interface BrowserContentProps extends UnknownObject {
    children: React.ReactNode;
    className?: string;
}
declare const BrowserContent: React.FC<BrowserContentProps>;
interface BrowserDefinitionProps extends UnknownObject, OnlyChildProps {
    definition: Definition;
    selectClass?: string;
    label?: string;
}
declare const BrowserDefinition: React.FunctionComponent<BrowserDefinitionProps>;
interface BrowserSourceProps extends UnknownObject {
    id: string;
    children: React.ReactNode;
    className?: string;
    promiseProvider?: SourceCallback;
    type?: string;
    types?: string | string[];
}
declare const BrowserSource: React.FC<BrowserSourceProps>;
interface EditorProps {
    mash?: Mash;
    className?: string;
}
declare const Editor: React.FunctionComponent<EditorProps>;
declare const MaterialIcons: EditorIcons;
declare const RemixIcons: EditorIcons;
declare const DefaultInputs: EditorInputs;
interface HostsProps {
    remoteServer?: RemoteServer;
}
declare const Hosts: React.FunctionComponent<HostsProps>;
interface HostProps {
    id: string;
}
declare const Host: React.FunctionComponent<HostProps>;
declare const NotProcessing: React.FunctionComponent;
declare const Processing: React.FunctionComponent;
declare const UploadButton: React.FunctionComponent<OnlyChildProps>;
declare const SaveButton: React.FunctionComponent<OnlyChildProps>;
declare const RenderButton: React.FunctionComponent<OnlyChildProps>;
declare const StreamButton: React.FunctionComponent<OnlyChildProps>;
declare const Status: React.FunctionComponent;
declare const NotPlaying: React.FunctionComponent;
declare const PlayButton: React.FunctionComponent<UnknownObject>;
interface PlayerContentProps extends UnknownObject {
    children?: never;
}
declare const PlayerContent: React.FunctionComponent<PlayerContentProps>;
declare const PlayerPanel: Panel;
declare const Playing: React.FunctionComponent;
declare const TimeSlider: React.FunctionComponent;
interface ContentOptions {
    className?: string;
    children?: React.ReactChild;
    child?: React.ReactChild;
}
interface BarOptions {
    className?: string;
    left?: React.ReactChildren;
    right?: React.ReactChildren;
    middle?: React.ReactFragment;
}
interface PanelOptionsStrict {
    className?: string;
    header: BarOptions;
    content: ContentOptions;
    footer: BarOptions;
}
type PanelOptions = Partial<PanelOptionsStrict>;
type PanelOptionsOrFalse = PanelOptions | false;
interface UiOptions {
    [index: string]: PanelOptionsOrFalse;
    browser: PanelOptionsOrFalse;
    player: PanelOptionsOrFalse;
    inspector: PanelOptionsOrFalse;
    timeline: PanelOptionsOrFalse;
}
interface ReactMovieMasherProps {
    className?: string;
    selectClass?: string;
    dropClass?: string;
    icons: EditorIcons;
    inputs: EditorInputs;
    mash?: Mash;
    panels?: Partial<UiOptions>;
    children?: never;
}
declare const ReactMovieMasher: React.FunctionComponent<ReactMovieMasherProps>;
declare class PropertiedOutputOptions implements Propertied {
    constructor();
    property(key: string): Property | undefined;
    value(key: string): SelectionValue;
    setValue(key: string, value: SelectionValue): boolean;
    properties: Property[];
}
interface PropertyInspectorProps {
    property: string;
    className?: string;
    inputs: EditorInputs;
}
declare const StreamOptions: React.FunctionComponent<PropertyInspectorProps>;
declare const TimelinePanel: Panel;
declare const Scrubber: React.FC<UnknownObject>;
declare const ScrubberElement: React.FC<UnknownObject>;
interface TimelineClipProps extends UnknownObject, OnlyChildProps {
    clip: Clip;
    selectClass?: string;
    prevClipEnd: number;
    label?: string;
}
declare const TimelineClip: React.FC<TimelineClipProps>;
interface TimelineClipsProps extends UnknownObject {
    children: React.ReactNode;
    label?: string;
    className?: string;
    dropClass?: string;
    selectClass?: string;
}
declare const TimelineClips: React.FC<TimelineClipsProps>;
declare const TimelineContent: React.FunctionComponent<UnknownObject>;
declare const TimelineSizer: React.FC<UnknownObject>;
interface TimelineTrackProps extends UnknownObject, OnlyChildProps {
    layer: number;
    trackType: TrackType;
}
declare const TimelineTrack: (props: TimelineTrackProps) => JSX.Element;
interface TimelineTracksProps {
    className?: string;
}
declare const TimelineTracks: React.FunctionComponent<TimelineTracksProps>;
interface TrackIsTypeProps {
    type: string;
}
declare const TrackIsType: React.FunctionComponent<TrackIsTypeProps>;
declare const Zoomer: React.FunctionComponent;
declare const BroadcastButton: React.FunctionComponent<UnknownObject>;
declare const Broadcasting: React.FunctionComponent;
declare const BroadcastingStatus: React.FunctionComponent;
declare const NotBroadcasting: React.FunctionComponent;
interface WebrtcContentProps extends UnknownObject {
    children?: never;
}
declare const WebrtcContent: React.FunctionComponent<WebrtcContentProps>;
interface WebrtcProps {
    remoteServer?: RemoteServer;
}
declare const WebrtcView: React.FunctionComponent<WebrtcProps>;
export * from "@moviemasher/moviemasher.js";
export { UnknownChangeEvent, SliderChangeHandler, NodeObject, NodesArray, DragClipObject, DropClipsResult, DragClipProps, DropClipsProps, Panel, UnknownElement, EditorIcons, EditorInputs, DefinitionsPromise, SourceCallbackOptions, SourceCallback, ListenerCallback, ListenerEvents, OnlyChildProps, AddTrackButton, RedoButton, RemoveButton, SplitButton, UndoButton, Constants, DragTypeSuffix, DragType, DragTypes, ServerType, ServerTypes, Button, ButtonProps, CanvasView, CanvasViewProps, Props, propsStringArray, propsDefinitionTypes, Slider, VideoView, VideoViewProps, View, BrowserContext, BrowserContextInterface, BrowserContextDefault, EditorContext, EditorContextInterface, EditorContextDefault, HostsContext, HostsContextInterface, HostsContextDefault, InspectorContext, InspectorContextInterface, InspectorContextDefault, PlayerContext, PlayerContextInterface, PlayerContextDefault, RemoteContext, StreamContext, StreamContextInterface, StreamContextDefault, TimelineContext, TimelineContextInterface, TimelineContextDefault, TrackContext, TrackContextProvider, TrackContextInterface, TrackContextDefault, WebrtcContext, WebrtcContextInterface, WebrtcContextDefault, InputContext, InputContextInterface, InputContextDefault, useListeners, useMashScale, useSelected, BrowserPanel, BrowserProps, BrowserContent, BrowserDefinition, BrowserSource, Editor, MaterialIcons, RemixIcons, DefaultInputs, Hosts, HostsProps, Host, NotProcessing, Processing, UploadButton, SaveButton, RenderButton, StreamButton, Status, NotPlaying, PlayButton, PlayerContent, PlayerPanel, Playing, TimeSlider, ReactMovieMasher, PropertiedOutputOptions, StreamOptions, TimelinePanel, Scrubber, ScrubberElement, TimelineClip, TimelineClips, TimelineContent, TimelineSizer, TimelineTrack, TimelineTracks, TrackIsType, Zoomer, BroadcastButton, Broadcasting, BroadcastingStatus, NotBroadcasting, WebrtcClient, WebrtcContent, WebrtcView };
//# sourceMappingURL=index.d.ts.map