/// <reference types="react" />
import React from "react";
import { MutableRefObject } from "react";
import { DataType, Definition, DefinitionObject, TrackType, UnknownObject, Masher, NumberSetter, StringSetter, DefinitionType, Clip } from "@moviemasher/moviemasher.js";
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
declare const Editor: React.FC<React.PropsWithChildren<UnknownObject>>;
interface EditorContextInterface {
    actionNonce: number;
    audioTracks: number;
    frame: number;
    frames: number;
    masher?: Masher;
    previewReference?: MutableRefObject<HTMLCanvasElement | undefined>;
    quantize: number;
    selectedClipIdentifier: string;
    selectedEffectIdentifier: string;
    setFrame: NumberSetter;
    videoTracks: number;
}
declare const EditorContextDefault: EditorContextInterface;
declare const EditorContext: import("react").Context<EditorContextInterface>;
declare const MaterialIcons: EditorIcons;
declare const RemixIcons: EditorIcons;
declare const DefaultInputs: EditorInputs;
interface BrowserProps extends UnknownObject {
    sourceId?: string;
    children: React.ReactNode;
}
declare const Browser: React.FunctionComponent<BrowserProps>;
interface BrowserContentProps extends UnknownObject {
    children: React.ReactNode;
    className?: string;
}
declare const BrowserContent: React.FC<BrowserContentProps>;
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
interface BrowserDefinitionProps extends UnknownObject {
    definition: Definition;
    children: React.ReactElement;
    selectClass?: string;
    label?: string;
}
declare const BrowserDefinition: React.FunctionComponent<BrowserDefinitionProps>;
interface BrowserSourceProps extends UnknownObject {
    id: string;
    children: React.ReactNode;
    className?: string;
    definitionType?: DefinitionType;
    promiseProvider?: SourceCallback;
}
declare const BrowserSource: React.FC<BrowserSourceProps>;
declare const Paused: React.FunctionComponent;
declare const PlayButton: React.FunctionComponent<UnknownObject>;
declare const Playing: React.FunctionComponent;
declare const Preview: React.FunctionComponent<UnknownObject>;
declare const TimeSlider: React.FunctionComponent;
declare const MMTimeline: Panel;
declare const Scrub: React.FC<UnknownObject>;
declare const ScrubButton: React.FC<UnknownObject>;
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
declare const TimelineTracks: React.FC<UnknownObject>;
interface TrackContextInterface {
    type: TrackType;
    index: number;
}
declare const TrackContextDefault: TrackContextInterface;
declare const TrackContext: React.Context<TrackContextInterface>;
declare const TrackContextProvider: React.Provider<TrackContextInterface>;
declare const useMashScale: () => number;
declare const ZoomSlider: React.FunctionComponent;
interface ReactMovieMasherProps {
    icons: EditorIcons;
    inputs: EditorInputs;
}
declare const ReactMovieMasher: React.FunctionComponent<ReactMovieMasherProps>;
export * from "@moviemasher/moviemasher.js";
export { UnknownChangeEvent, SliderChangeHandler, NodeObject, NodesArray, DragClipObject, DropClipsResult, DragClipProps, DropClipsProps, Panel, UnknownElement, EditorIcons, EditorInputs, DefinitionsPromise, SourceCallbackOptions, SourceCallback, Constants, DragTypeSuffix, DragType, DragTypes, Editor, EditorContext, EditorContextInterface, EditorContextDefault, MaterialIcons, RemixIcons, DefaultInputs, Browser, BrowserContent, BrowserContext, BrowserContextInterface, BrowserContextDefault, BrowserDefinition, BrowserSource, Paused, PlayButton, Playing, Preview, TimeSlider, MMTimeline, Scrub, ScrubButton, TimelineClip, TimelineClips, TimelineContext, TimelineContextInterface, TimelineContextDefault, TimelineSizer, TimelineTrack, TimelineTracks, TrackContext, TrackContextProvider, TrackContextInterface, TrackContextDefault, useMashScale, ZoomSlider, ReactMovieMasher };
//# sourceMappingURL=index.d.ts.map