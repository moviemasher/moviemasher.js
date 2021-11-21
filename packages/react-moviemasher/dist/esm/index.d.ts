/// <reference types="react" />
import React from "react";
import { DataType, Definition, DefinitionObject, EventType, Masher, TrackType, UnknownObject, DefinitionType, Property, Mash, Clip, NumberSetter } from "@moviemasher/moviemasher.js";
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
interface RemoteServer {
    protocol?: string;
    prefix?: string;
    host?: string;
    port?: string | number;
}
interface EditorContextInterface {
    masher: Masher;
}
declare const EditorContextDefault: EditorContextInterface;
declare const EditorContext: React.Context<EditorContextInterface>;
declare const useListeners: (events: ListenerEvents) => EditorContextInterface;
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
interface KeyClass {
    key: string;
    className: string;
}
interface ButtonProps extends Partial<KeyClass> {
    id?: string;
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
interface EditorProps {
    mash?: Mash;
    className?: string;
}
declare const Editor: React.FunctionComponent<EditorProps>;
declare const MaterialIcons: EditorIcons;
declare const RemixIcons: EditorIcons;
declare const DefaultInputs: EditorInputs;
declare const NotPlaying: React.FunctionComponent;
declare const PlayButton: React.FunctionComponent<UnknownObject>;
declare const Playing: React.FunctionComponent;
interface PlayerContentProps extends UnknownObject {
    children?: never;
}
declare const PlayerContent: React.FunctionComponent<PlayerContentProps>;
declare const TimeSlider: React.FunctionComponent;
declare const TimelinePanel: Panel;
declare const Scrubber: React.FC<UnknownObject>;
declare const ScrubberElement: React.FC<UnknownObject>;
interface TimelineClipProps extends UnknownObject {
    clip: Clip;
    children: React.ReactElement;
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
declare const TimelineSizer: React.FC<UnknownObject>;
interface TimelineTrackProps extends UnknownObject {
    index: number;
    type: TrackType;
    children: React.ReactElement;
}
declare const TimelineTrack: (props: TimelineTrackProps) => JSX.Element;
declare const TimelineTracks: React.FunctionComponent<UnknownObject>;
interface TrackContextInterface {
    type: TrackType;
    index: number;
}
declare const TrackContextDefault: TrackContextInterface;
declare const TrackContext: React.Context<TrackContextInterface>;
declare const TrackContextProvider: React.Provider<TrackContextInterface>;
declare const useMashScale: () => number;
declare const Zoomer: React.FunctionComponent;
interface ContentOptions {
    className?: string;
    children?: React.ReactChild;
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
type PanelsOptionsOrFalse = PanelOptions | false;
interface UiOptions {
    [index: string]: PanelsOptionsOrFalse;
    browser: PanelsOptionsOrFalse;
    player: PanelsOptionsOrFalse;
    inspector: PanelsOptionsOrFalse;
    timeline: PanelsOptionsOrFalse;
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
export * from "@moviemasher/moviemasher.js";
export { UnknownChangeEvent, SliderChangeHandler, NodeObject, NodesArray, DragClipObject, DropClipsResult, DragClipProps, DropClipsProps, Panel, UnknownElement, EditorIcons, EditorInputs, DefinitionsPromise, SourceCallbackOptions, SourceCallback, ListenerCallback, ListenerEvents, RemoteServer, useListeners, Constants, DragTypeSuffix, DragType, DragTypes, Button, ButtonProps, CanvasView, CanvasViewProps, Props, propsStringArray, propsDefinitionTypes, Slider, VideoView, VideoViewProps, View, Editor, EditorContext, EditorContextInterface, EditorContextDefault, MaterialIcons, RemixIcons, DefaultInputs, NotPlaying, PlayButton, Playing, PlayerContent, TimeSlider, TimelinePanel, Scrubber, ScrubberElement, TimelineClip, TimelineClips, TimelineContent, TimelineContext, TimelineContextInterface, TimelineContextDefault, TimelineSizer, TimelineTrack, TimelineTracks, TrackContext, TrackContextProvider, TrackContextInterface, TrackContextDefault, useMashScale, Zoomer, ReactMovieMasher };
export * from "src/Components/Browser/index";
export * from "src/Components/Webcam/index";
//# sourceMappingURL=index.d.ts.map