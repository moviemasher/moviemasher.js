import { MovieMasher, EventType, Time, DataType, DefinitionTypes, definitionsByType, pixelPerFrame, pixelFromFrame, pixelToFrame, TrackType, DefinitionType, elementScrollMetrics } from '@moviemasher/moviemasher.js';
export * from '@moviemasher/moviemasher.js';
import React, { createContext, useContext } from 'react';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import PhotoSizeSelectLarge from '@material-ui/icons/PhotoSizeSelectLarge';
import Theaters from '@material-ui/icons/Theaters';
import MovieFilter from '@material-ui/icons/MovieFilter';
import LibraryMusic from '@material-ui/icons/LibraryMusic';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import FolderTransferFillIcon from 'remixicon-react/FolderTransferFillIcon';
import Music2FillIcon from 'remixicon-react/Music2FillIcon';
import FolderSettingsFillIcon from 'remixicon-react/FolderSettingsFillIcon';
import FilmFillIcon from 'remixicon-react/FilmFillIcon';
import PlayCircleFillIcon from 'remixicon-react/PlayCircleFillIcon';
import PauseCircleFillIcon from 'remixicon-react/PauseCircleFillIcon';
import FolderChartFillIcon from 'remixicon-react/FolderChartFillIcon';
import ImageFillIcon from 'remixicon-react/ImageFillIcon';
import MvFillIcon from 'remixicon-react/MvFillIcon';

const DragTypeSuffix = '/x-moviemasher';
const Constants = {
    DragTypeSuffix,
};

const DragType = {
    CLIP: 'clip/x-moviemasher',
    MEDIA: 'media/x-moviemasher',
    EFFECT: 'effect/x-moviemasher',
};
const DragTypes = Object.values(DragType);

const EditorContextDefault = {
    actionNonce: 0,
    audioTracks: 0,
    frame: 0,
    frames: 0,
    quantize: 0,
    selectedClipIdentifier: '',
    selectedEffectIdentifier: '',
    setFrame: () => { },
    videoTracks: 0,
};
const EditorContext = createContext(EditorContextDefault);

const View = React.forwardRef((props, ref) => React.createElement("div", Object.assign({ ref: ref }, props)));

const Editor = (props) => {
    const previewReference = React.useRef();
    const [actionNonce, setActionNonce] = React.useState(0);
    const [mash, setMash] = React.useState(() => {
        console.warn("TODO: remove mash content");
        const clips = [
            { id: "com.moviemasher.theme.text", frame: 0, frames: 100, string: "Fuck yeah!" },
            { id: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue" },
            { id: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "Woot woot!" },
            { id: "com.moviemasher.theme.color", frame: 250, frames: 50, color: "green" },
            { id: "com.moviemasher.theme.text", frame: 300, frames: 100, string: "Love it!" },
            { id: "com.moviemasher.theme.color", frame: 400, frames: 50, color: "red" },
            { id: "com.moviemasher.theme.text", frame: 450, frames: 100, string: "Juicy!" },
            { id: "com.moviemasher.theme.color", frame: 550, frames: 50, color: "yellow" },
            { id: "com.moviemasher.theme.text", frame: 600, frames: 100, string: "Gorgeous!" },
            { id: "com.moviemasher.theme.color", frame: 700, frames: 50, color: "violet" },
            { id: "com.moviemasher.theme.text", frame: 750, frames: 1100, string: "Joy!" },
            { id: "com.moviemasher.theme.color", frame: 1850, frames: 1000, color: "orange" },
        ];
        const clips1 = clips.slice(0, 5).map(clip => (Object.assign(Object.assign({}, clip), { label: `0: ${clip.string || clip.color}` })));
        const clips2 = clips.map(clip => (Object.assign(Object.assign({}, clip), { label: `1: ${clip.string || clip.color}` })));
        const clips3 = clips.filter((clip, index) => index % 2).map(clip => (Object.assign(Object.assign({}, clip), { label: `2: ${clip.string || clip.color}` })));
        return MovieMasher.mash.instance({
            id: 'mash-id', video: [
                { clips: clips1 }, { clips: clips2 }, { clips: clips3 }
            ]
        });
    });
    const [quantize, setQuantize] = React.useState(mash.quantize);
    const [masher] = React.useState(() => MovieMasher.masher.instance({ mash }));
    const [frame, setFrame] = React.useState(masher.mash.frame);
    const [frames, setFrames] = React.useState(masher.mash.frames);
    const [selectedClipIdentifier, setSelectedClipIdentifier] = React.useState('');
    const [selectedEffectIdentifier, setSelectedEffectIdentifier] = React.useState('');
    const [audioTracks, setAudibleTracks] = React.useState(mash.audio.length);
    const [videoTracks, setVisibleTracks] = React.useState(mash.video.length);
    const [canvas, setCanvas] = React.useState(masher.canvas);
    const changeFrame = (value) => { masher.time = Time.fromArgs(value, quantize); }; //masher.time.withFrame(value) }
    const handleCanvas = () => { listenCanvas(masher.canvas); };
    const handleSelection = () => {
        setSelectedClipIdentifier(String(masher.selectedClip.identifier));
        setSelectedEffectIdentifier(String(masher.selectedEffect.identifier));
    };
    const handleTime = () => {
        setFrame(masher.mash.frame);
    };
    const handleDuration = () => {
        console.log("Editor.handleDuration frames", masher.mash.frames);
        setFrames(masher.mash.frames);
    };
    const handleTrack = () => {
        setAudibleTracks(mash.audio.length);
        setVisibleTracks(mash.video.length);
    };
    const handleAction = () => { setActionNonce(nonce => nonce + 1); };
    const listenCanvas = (value) => {
        if (canvas) {
            canvas.removeEventListener(EventType.Canvas, handleCanvas);
            canvas.removeEventListener(EventType.Duration, handleDuration);
            canvas.removeEventListener(EventType.Time, handleTime);
            canvas.removeEventListener(EventType.Track, handleTrack);
            canvas.removeEventListener(EventType.Selection, handleSelection);
            canvas.removeEventListener(EventType.Action, handleAction);
        }
        if (value) {
            value.addEventListener(EventType.Canvas, handleCanvas);
            value.addEventListener(EventType.Duration, handleDuration);
            value.addEventListener(EventType.Time, handleTime);
            value.addEventListener(EventType.Track, handleTrack);
            value.addEventListener(EventType.Selection, handleSelection);
            value.addEventListener(EventType.Action, handleAction);
            setCanvas(value);
        }
    };
    const editorContext = {
        audioTracks,
        masher,
        previewReference,
        quantize,
        videoTracks,
        frame,
        frames,
        setFrame: changeFrame,
        selectedClipIdentifier,
        selectedEffectIdentifier,
        actionNonce,
    };
    React.useEffect(() => {
        const { current } = previewReference || {};
        if (current) {
            listenCanvas(canvas);
            masher.canvas = current;
        }
        return () => { listenCanvas(); };
    }, []);
    return (React.createElement(EditorContext.Provider, { value: editorContext },
        React.createElement(View, Object.assign({}, props))));
};

const MaterialIcons = {
    browserAudio: React.createElement(LibraryMusic, null),
    browserEffect: React.createElement(Theaters, null),
    browserImage: React.createElement(PhotoSizeSelectLarge, null),
    browserTheme: React.createElement(PhotoSizeSelectLarge, null),
    browserVideo: React.createElement(MovieFilter, null),
    playerPause: React.createElement(PauseIcon, null),
    playerPlay: React.createElement(PlayIcon, null),
    timelineAudio: React.createElement(VolumeIcon, null),
};

const RemixIcons = {
    browserAudio: React.createElement(Music2FillIcon, null),
    browserEffect: React.createElement(FolderSettingsFillIcon, null),
    browserImage: React.createElement(ImageFillIcon, null),
    browserTheme: React.createElement(FolderChartFillIcon, null),
    browserTransition: React.createElement(FolderTransferFillIcon, null),
    browserVideo: React.createElement(FilmFillIcon, null),
    playerPause: React.createElement(PauseCircleFillIcon, null),
    playerPlay: React.createElement(PlayCircleFillIcon, null),
    timelineAudio: React.createElement(MvFillIcon, null),
};

const InputContextDefault = {
    property: '',
    value: '',
    // actionNonce: '',
    changeHandler: () => { },
};
const InputContext = React.createContext(InputContextDefault);

const DefaultTextInput = () => {
    const inputContext = React.useContext(InputContext);
    const { changeHandler, property, value } = inputContext;
    const onChange = (event) => {
        changeHandler(property, event.target.value);
    };
    const inputProps = {
        type: 'text',
        name: property,
        value: String(value),
        onChange,
    };
    return React.createElement("input", Object.assign({}, inputProps));
};

const DefaultInputs = {
    [DataType.Boolean]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Direction4]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Direction8]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Font]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Fontsize]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Integer]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Mode]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Number]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Pixel]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Rgb]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Rgba]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.String]: React.createElement(DefaultTextInput, { key: 'input' }),
    [DataType.Text]: React.createElement(DefaultTextInput, { key: 'input' }),
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const BrowserContextDefault = {
    definitions: [],
    definitionId: '',
    setDefinitions: () => { },
    setDefinitionId: () => { },
    setSourceId: () => { },
    sourceId: '',
};
const BrowserContext = React.createContext(BrowserContextDefault);

const Browser = props => {
    const { sourceId: initialSourceId } = props, rest = __rest(props, ["sourceId"]);
    const [definitions, setDefinitions] = React.useState(undefined);
    const [definitionId, setDefinitionId] = React.useState('');
    const [sourceId, setSourceId] = React.useState('');
    const browserContext = {
        definitions,
        definitionId,
        setDefinitions,
        setDefinitionId,
        setSourceId,
        sourceId,
    };
    React.useEffect(() => {
        setDefinitions(undefined);
        setSourceId(initialSourceId || 'theme');
    }, [initialSourceId]);
    return (React.createElement(BrowserContext.Provider, { value: browserContext },
        React.createElement(View, Object.assign({}, rest))));
};

const BrowserDefinition = props => {
    const ref = React.useRef(null);
    const browserContext = React.useContext(BrowserContext);
    const [clickOffset, setClickOffset] = React.useState(0);
    const { label: labelVar, children, selectClass, definition } = props; __rest(props, ["label", "children", "selectClass", "definition"]);
    const { definitionId, setDefinitionId } = browserContext;
    const { id, label } = definition;
    const labelOrId = label || id;
    const kid = React.Children.only(children);
    if (!React.isValidElement(kid))
        throw `BrowserDefinition expects single child element`;
    const classNamesState = () => {
        const classes = [];
        const { className } = kid.props;
        if (className)
            classes.push(className);
        if (selectClass && definitionId === id)
            classes.push(selectClass);
        return classes.join(' ');
    };
    const onMouseDown = (event) => {
        console.log("onMouseDown");
        const { current } = ref;
        if (!current)
            return;
        const rect = current.getBoundingClientRect();
        const { left } = rect;
        const { clientX } = event;
        setClickOffset(clientX - left);
        setDefinitionId(id);
    };
    const onDragStart = event => {
        console.log("onDragStart");
        onMouseDown(event);
        const data = { offset: clickOffset, definition };
        const json = JSON.stringify(data);
        const { dataTransfer } = event;
        dataTransfer.effectAllowed = 'copy';
        dataTransfer.setData(definition.type + DragTypeSuffix, json);
    };
    const style = {};
    if (labelVar)
        style[labelVar] = `'${labelOrId.replace("'", "\\'")}'`;
    const clipProps = Object.assign(Object.assign({}, kid.props), { style, className: classNamesState(), onDragStart,
        onMouseDown, draggable: true, ref });
    return React.cloneElement(kid, clipProps);
};

const BrowserContent = props => {
    const { className, children } = props, rest = __rest(props, ["className", "children"]);
    const browserContext = React.useContext(BrowserContext);
    const { definitions } = browserContext;
    const objects = definitions || [];
    const kid = React.Children.only(children);
    if (!React.isValidElement(kid))
        throw `BrowserContent expects single child element`;
    const viewChildren = objects.map(definition => {
        const definitionProps = Object.assign(Object.assign({}, rest), { definition, children: kid, key: definition.id });
        return React.createElement(BrowserDefinition, Object.assign({}, definitionProps));
    });
    const viewProps = { className, children: viewChildren };
    return React.createElement(View, Object.assign({}, viewProps));
};

const BrowserSource = props => {
    const { className, id, definitionType, promiseProvider } = props, rest = __rest(props, ["className", "id", "definitionType", "promiseProvider"]);
    const type = definitionType || id;
    if (!promiseProvider) {
        if (!definitionType) {
            if (!DefinitionTypes.map(String).includes(id)) {
                throw "BrowserSource requires definitionType or promiseProvider";
            }
        }
    }
    const browserContext = React.useContext(BrowserContext);
    const { definitions, sourceId, setDefinitions, setSourceId, setDefinitionId } = browserContext;
    const classes = [];
    if (className)
        classes.push(className);
    if (sourceId === id) {
        // TODO: get from props or context
        classes.push('moviemasher-selected');
        if (typeof definitions === 'undefined') {
            if (promiseProvider) {
                promiseProvider().then(definitions => setDefinitions(definitions));
            }
            else {
                setTimeout(() => {
                    const definitions = definitionsByType(type);
                    // console.log("BrowserSource", id, "setDefinitions", type, definitions.map(d => d.label || d.id))
                    setDefinitions(definitions);
                }, 1);
            }
        }
    }
    const onClick = () => {
        setDefinitions(undefined);
        setDefinitionId('');
        setSourceId(id);
    };
    const viewProps = Object.assign(Object.assign({}, rest), { className: classes.join(' '), onClick });
    return React.createElement(View, Object.assign({}, viewProps));
};

const PlayerContextDefault = {
    paused: false,
    setPaused: () => { },
    setVolume: () => { },
    volume: 0,
};
const PlayerContext = React.createContext(PlayerContextDefault);

const Paused = props => {
    const playerContext = React.useContext(PlayerContext);
    if (!playerContext.paused)
        return null;
    return React.createElement(React.Fragment, null, props.children);
};

const PlayButton = (props) => {
    const playerContext = React.useContext(PlayerContext);
    const { paused, setPaused } = playerContext;
    const handleClick = () => { setPaused(!paused); };
    const pausedOptions = Object.assign(Object.assign({}, props), { key: 'moviemasher-play', onClick: handleClick });
    return React.createElement(View, Object.assign({}, pausedOptions));
};

const Playing = props => {
    const playerContext = React.useContext(PlayerContext);
    if (playerContext.paused)
        return null;
    return React.createElement(React.Fragment, null, props.children);
};

const CanvasView = React.forwardRef((props, reference) => (React.createElement("canvas", Object.assign({}, props, { ref: reference }))));

const Preview = (props) => {
    const context = React.useContext(EditorContext);
    const canvasProps = Object.assign({ key: 'preview' }, props);
    if (context.previewReference)
        canvasProps.ref = context.previewReference;
    return React.createElement(CanvasView, Object.assign({}, canvasProps));
};

// React.ChangeEventHandler<HTMLInputElement>
const Slider = (props) => {
    const { className, onChange } = props;
    const options = Object.assign({}, props);
    const classes = ['moviemasher-slider'];
    if (className)
        classes.push(className);
    options.className = classes.join(' ');
    if (onChange) {
        const handleChange = (event) => {
            onChange(event, event.currentTarget.valueAsNumber);
        };
        options.onChange = handleChange;
    }
    const input = React.createElement("input", Object.assign({ type: 'range' }, options));
    return input;
};

const TimeSlider = (props) => {
    const editorContext = React.useContext(EditorContext);
    const { frame, frames, setFrame } = editorContext;
    const handleChange = (_event, value) => {
        const number = typeof value === "number" ? value : value[0];
        // console.log("handleChange", number, frame)
        if (frame !== number)
            setFrame(number);
    };
    const onChange = React.useCallback(handleChange, [frame]);
    const sliderProps = Object.assign({ value: frame, min: 0, max: frames, step: 1, onChange }, props);
    return React.createElement(Slider, Object.assign({ className: 'moviemasher-frame moviemasher-slider' }, sliderProps));
};

const TimelineContextDefault = {
    height: 0,
    setHeight: () => { },
    setWidth: () => { },
    setZoom: () => { },
    width: 0,
    zoom: 0,
};
const TimelineContext = createContext(TimelineContextDefault);

const MMTimeline = props => {
    const [zoom, setZoom] = React.useState(0);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const appContext = useContext(EditorContext);
    const [canvas, setCanvas] = React.useState(null);
    const listenCanvas = (value) => {
        if (value) {
            setCanvas(value);
        }
    };
    const timelineContext = {
        setZoom,
        setWidth,
        setHeight,
        zoom,
        width,
        height,
    };
    const { previewReference } = appContext;
    const { children } = props, rest = __rest(props, ["children"]);
    React.useEffect(() => {
        const { current: currentPreview } = previewReference || {};
        if (currentPreview)
            listenCanvas(currentPreview);
        return () => { listenCanvas(); };
    }, []);
    return React.createElement(View, Object.assign({}, rest),
        React.createElement(TimelineContext.Provider, { value: timelineContext, children: children }));
};

const useMashScale = () => {
    const timelineContext = React.useContext(TimelineContext);
    const editorContext = React.useContext(EditorContext);
    const { width, zoom } = timelineContext;
    if (!width)
        return 0;
    const { frames } = editorContext;
    return pixelPerFrame(frames, width, zoom);
};

const Scrub = (props) => {
    const ref = React.useRef(null);
    const editorContext = React.useContext(EditorContext);
    const [down, setDown] = React.useState(() => false);
    const scale = useMashScale();
    const { frames, setFrame } = editorContext;
    const width = pixelFromFrame(frames, scale);
    const handleEvent = (event) => {
        const { current } = ref;
        if (!current)
            return;
        const { clientX } = event;
        const rect = current.getBoundingClientRect();
        const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x));
        setFrame(pixelToFrame(pixel, scale, 'floor'));
    };
    const onMouseDown = (event) => {
        setDown(true);
        handleEvent(event);
    };
    const handleMouseMove = (event) => {
        handleEvent(event);
    };
    const handleMouseUp = (event) => {
        setDown(false);
        handleEvent(event);
    };
    const style = { width };
    const viewProps = Object.assign(Object.assign({}, props), { style, onMouseDown, ref });
    if (down) {
        viewProps.onMouseMove = handleMouseMove;
        viewProps.onMouseUp = handleMouseUp;
        viewProps.onMouseLeave = handleMouseUp;
    }
    return React.createElement(View, Object.assign({}, viewProps));
};

const ScrubButton = (props) => {
    const editorContext = React.useContext(EditorContext);
    const scale = useMashScale();
    if (!scale)
        return null;
    const { frame } = editorContext;
    const left = pixelFromFrame(frame, scale);
    const iconProps = Object.assign(Object.assign({}, props), { key: 'timeline-icon', style: { left } });
    return React.createElement(View, Object.assign({}, iconProps));
};

const TimelineClip = props => {
    const ref = React.useRef(null);
    const editorContext = React.useContext(EditorContext);
    const [clickOffset, setClickOffset] = React.useState(0);
    const scale = useMashScale();
    const { selectedClipIdentifier } = editorContext;
    const { label: labelVar, clip, prevClipEnd, selectClass, children } = props; __rest(props, ["label", "clip", "prevClipEnd", "selectClass", "children"]);
    const { label, identifier, type, frame, frames } = clip;
    const kid = React.Children.only(children);
    if (!React.isValidElement(kid))
        throw `TimelineClip expects single child element`;
    const classNamesState = () => {
        const classes = [];
        const { className } = kid.props;
        if (className)
            classes.push(className);
        if (selectClass && identifier === selectedClipIdentifier) {
            classes.push(selectClass);
        }
        return classes.join(' ');
    };
    const onMouseDown = (event) => {
        var _a;
        const { current } = ref;
        if (!current)
            return;
        const rect = current.getBoundingClientRect();
        const { left } = rect;
        const { clientX } = event;
        setClickOffset(clientX - left);
        (_a = editorContext.masher) === null || _a === void 0 ? void 0 : _a.selectClip(clip);
    };
    const onDragStart = event => {
        onMouseDown(event);
        const data = { offset: clickOffset };
        const json = JSON.stringify(data);
        const { dataTransfer } = event;
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData(type + DragTypeSuffix, json);
    };
    const width = pixelFromFrame(frames, scale, 'floor');
    const style = { width };
    if (labelVar)
        style[labelVar] = `'${label.replace("'", "\\'")}'`;
    if (prevClipEnd > -1) {
        style.marginLeft = pixelFromFrame(frame - prevClipEnd, scale, 'floor');
    }
    const clipProps = Object.assign(Object.assign({}, kid.props), { style, className: classNamesState(), onMouseDown,
        onDragStart, draggable: true, ref });
    return React.cloneElement(kid, clipProps);
};

const TrackContextDefault = {
    type: TrackType.Video,
    index: 0,
};
const TrackContext = React.createContext(TrackContextDefault);
const TrackContextProvider = TrackContext.Provider;

const TimelineClips = props => {
    const appContext = React.useContext(EditorContext);
    const trackContext = React.useContext(TrackContext);
    const [isOver, setIsOver] = React.useState(false);
    const ref = React.useRef(null);
    const scale = useMashScale();
    const { masher } = appContext;
    if (!masher)
        return null;
    const { dropClass, className, children } = props, rest = __rest(props, ["dropClass", "className", "children"]);
    const kid = React.Children.only(children);
    if (!React.isValidElement(kid))
        throw `TimelineClips`;
    const { mash } = masher;
    const { type, index } = trackContext;
    const track = mash.trackOfTypeAtIndex(type, index);
    const { clips, isMainVideo } = track;
    const childNodes = () => {
        let prevClipEnd = isMainVideo ? -1 : 0;
        return clips.map(clip => {
            const clipProps = Object.assign(Object.assign({}, rest), { prevClipEnd, key: clip.identifier, clip, children: kid });
            if (!isMainVideo)
                prevClipEnd = clip.frames + clip.frame;
            return React.createElement(TimelineClip, Object.assign({}, clipProps));
        });
    };
    const dropType = (dataTransfer) => {
        return dataTransfer.types.find(type => type.endsWith(DragTypeSuffix));
    };
    const dropAllowed = (dataTransfer) => {
        const type = dropType(dataTransfer);
        if (!type)
            return false;
        if (!type.endsWith(DragTypeSuffix))
            return true;
        const [definitionType] = type.split('/');
        const clipIsTransition = definitionType === DefinitionType.Transition;
        if (clipIsTransition)
            return isMainVideo; // transitions only allowed on main track
        const clipIsAudio = definitionType === DefinitionType.Audio;
        const trackIsAudio = track.type === TrackType.Audio;
        return clipIsAudio === trackIsAudio; // audio clips only allowed on audio tracks
    };
    const dropClip = (dataTransfer, offsetDrop) => {
        const type = dropType(dataTransfer);
        const json = dataTransfer.getData(type);
        const data = JSON.parse(json);
        const { offset, definition } = data;
        const frame = pixelToFrame(offsetDrop - offset, scale);
        const frameOrIndex = isMainVideo ? frameToIndex(frame, track.clips) : frame;
        if (typeof definition === 'undefined') {
            const clip = masher.selectedClips[0];
            masher.moveClips(clip, frameOrIndex, index);
        }
        else {
            masher.add(definition, frameOrIndex, index);
        }
    };
    const dropOffset = (clientX) => {
        const { current } = ref;
        if (!current)
            return 0;
        const rect = current.getBoundingClientRect();
        return clientX - rect.x;
    };
    const frameToIndex = (frame, clips) => {
        const { length } = clips;
        if (!length)
            return 0;
        const foundIndex = clips.findIndex(clip => frame < clip.frame + clip.frames);
        if (foundIndex > -1)
            return foundIndex;
        return length;
    };
    const onDragOver = event => {
        const { dataTransfer } = event;
        const allowed = dropAllowed(dataTransfer);
        setIsOver(allowed);
        if (allowed)
            event.preventDefault();
    };
    const onDragLeave = () => {
        setIsOver(false);
    };
    const onDrop = event => {
        setIsOver(false);
        const { dataTransfer, clientX } = event;
        const type = dropType(dataTransfer);
        if (!type)
            return;
        const offset = dropOffset(clientX);
        if (type.endsWith(DragTypeSuffix))
            dropClip(dataTransfer, offset);
        // TODO: handle other types
        event.preventDefault();
    };
    const classes = [];
    if (className)
        classes.push(className);
    if (isOver && dropClass)
        classes.push(dropClass);
    const viewProps = {
        className: classes.join(' '),
        children: childNodes(),
        ref,
        onDragLeave,
        onDragOver,
        onDrop,
    };
    // console.log("TimelineClips")
    return React.createElement(View, Object.assign({}, viewProps));
};

const TimelineSizer = props => {
    const reference = React.useRef(null);
    const timelineContext = React.useContext(TimelineContext);
    const changeTimelineMetrics = () => {
        const { current } = reference || {};
        if (!current) {
            console.error("TimelineSizer no reference.current");
            return;
        }
        const metrics = elementScrollMetrics(current);
        if (!metrics) {
            console.error("TimelineSizer no metrics");
            return;
        }
        // console.log("TimelineSizer", metrics)
        const { setWidth, setHeight } = timelineContext;
        setWidth(metrics.width);
        setHeight(metrics.height);
    };
    const [resizeObserver] = React.useState(new ResizeObserver(changeTimelineMetrics));
    React.useEffect(() => {
        const { current } = reference;
        if (current)
            resizeObserver.observe(current);
        return () => { resizeObserver.disconnect(); };
    }, []);
    const viewProps = Object.assign(Object.assign({}, props), { ref: reference });
    return React.createElement(View, Object.assign({}, viewProps));
};

const TimelineTrack = (props) => {
    const { index, type, children } = props;
    const context = { index, type };
    return React.createElement(TrackContextProvider, { value: context, children: children });
};

const TimelineTracks = props => {
    // console.log("TimelineTracks")
    const appContext = React.useContext(EditorContext);
    const scale = useMashScale();
    const { children } = props, rest = __rest(props, ["children"]);
    const { audioTracks, videoTracks } = appContext;
    const childNodes = () => {
        // console.log("TimelineTracks.childNodes")
        const childNodes = [];
        if (!scale)
            return childNodes;
        const kid = React.Children.only(children);
        if (!React.isValidElement(kid))
            throw `Timeline.Tracks`;
        for (let i = videoTracks - 1; i >= 0; i--) {
            const trackProps = Object.assign(Object.assign({}, props), { key: `video-track-${i}`, index: i, type: TrackType.Video, children: React.cloneElement(kid) });
            childNodes.push(React.createElement(TimelineTrack, Object.assign({}, trackProps)));
        }
        for (let i = 0; i < audioTracks; i++) {
            const trackProps = Object.assign(Object.assign({}, props), { key: `audio-track-${i}`, index: i, type: TrackType.Audio, children: React.cloneElement(kid) });
            childNodes.push(React.createElement(TimelineTrack, Object.assign({}, trackProps)));
        }
        return childNodes;
    };
    const viewProps = Object.assign(Object.assign({}, rest), { children: childNodes() });
    return React.createElement(View, Object.assign({}, viewProps));
};

const ZoomSlider = (props) => {
    const context = React.useContext(TimelineContext);
    const handleChange = (_event, value) => {
        const number = typeof value === "number" ? value : value[0];
        if (context.zoom !== number)
            context.setZoom(number);
    };
    const sliderProps = Object.assign({ key: 'time-slider', value: context.zoom, min: 0.0, max: 1.0, step: 0.01, onChange: handleChange }, props);
    return React.createElement(Slider, Object.assign({ className: 'moviemasher-zoom moviemasher-slider' }, sliderProps));
};

const PlayerPanel = props => {
    const appContext = useContext(EditorContext);
    const { masher, previewReference } = appContext;
    if (!masher)
        throw 'No Masher';
    const [paused, setPaused] = React.useState(masher.paused);
    const [volume, setVolume] = React.useState(masher.volume);
    const [canvas, setCanvas] = React.useState(null);
    const changePaused = (value) => { masher.paused = value; };
    const changeVolume = (value) => { masher.volume = value; };
    const handleVolume = () => { setVolume(masher.volume); };
    const handlePaused = () => { setPaused(masher.paused); };
    const listenCanvas = (value) => {
        if (canvas) {
            canvas.removeEventListener(EventType.Pause, handlePaused);
            canvas.removeEventListener(EventType.Play, handlePaused);
            canvas.removeEventListener(EventType.Volume, handleVolume);
        }
        if (value) {
            value.addEventListener(EventType.Pause, handlePaused);
            value.addEventListener(EventType.Play, handlePaused);
            value.addEventListener(EventType.Volume, handleVolume);
            setCanvas(value);
        }
    };
    React.useEffect(() => {
        const { current: currentPreview } = previewReference || {};
        if (currentPreview)
            listenCanvas(currentPreview);
        return () => { listenCanvas(); };
    }, []);
    const playerContext = {
        paused,
        setPaused: changePaused,
        setVolume: changeVolume,
        volume,
    };
    return (React.createElement(PlayerContext.Provider, { value: playerContext },
        React.createElement(View, Object.assign({}, props))));
};

const InspectorContextDefault = {
    definitionType: DefinitionType.Mash
};
const InspectorContext = React.createContext(InspectorContextDefault);

const InspectorPanel = props => {
    const editorContext = useContext(EditorContext);
    const [definitionType, setDefinitionType] = React.useState(DefinitionType.Mash);
    const [canvas, setCanvas] = React.useState(null);
    const { masher, previewReference } = editorContext;
    if (!masher)
        throw 'No Masher';
    const handleSelection = () => { setDefinitionType(masher.selected.type); };
    const listenCanvas = (value) => {
        if (canvas) {
            canvas.removeEventListener(EventType.Selection, handleSelection);
        }
        if (value) {
            value.addEventListener(EventType.Selection, handleSelection);
            setCanvas(value);
        }
    };
    React.useEffect(() => {
        const { current: currentPreview } = previewReference || {};
        if (currentPreview)
            listenCanvas(currentPreview);
        return () => { listenCanvas(); };
    }, []);
    const inspectorContext = {
        definitionType
    };
    return (React.createElement(InspectorContext.Provider, { value: inspectorContext },
        React.createElement(View, Object.assign({}, props))));
};

const Defined = props => {
    const { property, properties } = props, rest = __rest(props, ["property", "properties"]);
    const editorContext = React.useContext(EditorContext);
    const masher = editorContext.masher;
    const { selected } = masher;
    const strings = properties || [property];
    const found = strings.filter(string => selected.propertyNames.includes(string));
    if (found.length !== strings.length)
        return null;
    const changeHandler = (property, value) => {
        masher.change(property, value);
    };
    const inputContext = { property, value: selected.value(property), changeHandler };
    return (React.createElement(InputContext.Provider, { value: inputContext },
        React.createElement(View, Object.assign({}, rest))));
};

const propsStringArray = (string, array, properties) => {
    if (string)
        return [string];
    if (!array)
        return properties ? properties.map(property => property.name) : [];
    if (typeof array === 'string')
        return array.split(',').map(string => string.trim());
    return array;
};

const PropertyContainer = props => {
    const { contained, className, property, children } = props;
    const templateElements = React.Children.toArray(children);
    const kids = [];
    if (templateElements.length) {
        const [first, second, ...rest] = templateElements;
        if (React.isValidElement(first)) {
            kids.push(React.cloneElement(first, { key: `label-${property}`, children: property }));
            if (second) {
                if (React.isValidElement(second)) {
                    kids.push(React.cloneElement(second, { key: `contained-${property}`, children: contained }));
                }
                else
                    kids.push(second, contained);
            }
            else
                kids.push(contained);
        }
        else
            kids.push(property, ...templateElements, contained);
    }
    else
        kids.push(property, contained);
    const viewProps = { children: kids, key: property, className };
    return React.createElement(View, Object.assign({}, viewProps));
};

const PropertyInspector = props => {
    const { inputs, className, property, children } = props;
    const editorContext = React.useContext(EditorContext);
    const masher = editorContext.masher;
    const { selected } = masher;
    const { definition } = selected;
    const definitionProperty = definition.property(property);
    if (!definitionProperty)
        return null;
    const { type, name } = definitionProperty;
    const value = selected.value(name);
    const input = inputs[type.id];
    const changeHandler = (property, value) => {
        masher.change(property, value);
    };
    const inputContext = { property, value, changeHandler };
    const inputWithContext = (React.createElement(InputContext.Provider, { key: 'context', value: inputContext }, input));
    const containerProps = {
        className,
        children,
        property: name,
        contained: inputWithContext,
    };
    return React.createElement(PropertyContainer, Object.assign({}, containerProps));
};

const useSelected = () => {
    const editorContext = React.useContext(EditorContext);
    return editorContext.masher.selected;
};

const Inspector = props => {
    const { inputs, className, property, properties, children } = props;
    const selected = useSelected();
    const strings = propsStringArray(property, properties, selected.definition.properties);
    const kids = strings.map(property => {
        const propertyProps = {
            key: `inspector-${property}`, inputs, className, property, children
        };
        return React.createElement(PropertyInspector, Object.assign({}, propertyProps));
    });
    return React.createElement(React.Fragment, null, kids);
};

const TypeNotSelected = props => {
    const editorContext = React.useContext(EditorContext);
    const { children } = props;
    if (!children)
        return null;
    const masher = editorContext.masher;
    if (masher.selected.type === DefinitionType.Mash)
        return null;
    return React.createElement(React.Fragment, null, children);
};

const PropertyInformer = props => {
    const { className, property, children } = props;
    const editorContext = React.useContext(EditorContext);
    const masher = editorContext.masher;
    const { selected } = masher;
    const value = String(selected.value(property));
    const containerProps = { className, children, property, contained: value };
    return React.createElement(PropertyContainer, Object.assign({}, containerProps));
};

const Informer = props => {
    const { className, property, properties, children } = props;
    const selected = useSelected();
    const strings = propsStringArray(property, properties, selected.definition.properties);
    const kids = strings.map(property => {
        const propertyProps = { key: `inspector-${property}`, className, property, children };
        return React.createElement(PropertyInformer, Object.assign({}, propertyProps));
    });
    return React.createElement(React.Fragment, null, kids);
};

const ReactMovieMasher = props => {
    const { icons, inputs } = props;
    return (React.createElement(Editor, { className: 'moviemasher-app' },
        React.createElement(PlayerPanel, { className: 'moviemasher-panel moviemasher-player' },
            React.createElement(Preview, { className: "moviemasher-canvas" }),
            React.createElement("div", { className: 'moviemasher-controls moviemasher-foot' },
                React.createElement(PlayButton, { className: 'moviemasher-paused moviemasher-button' },
                    React.createElement(Playing, null, icons.playerPause),
                    React.createElement(Paused, null, icons.playerPlay)),
                React.createElement(TimeSlider, null))),
        React.createElement(Browser, { className: 'moviemasher-panel moviemasher-browser' },
            React.createElement("div", { className: 'moviemasher-head' },
                React.createElement(BrowserSource, { id: 'video', className: 'moviemasher-button-icon', children: icons.browserVideo }),
                React.createElement(BrowserSource, { id: 'audio', className: 'moviemasher-button-icon', children: icons.browserAudio }),
                React.createElement(BrowserSource, { id: 'image', className: 'moviemasher-button-icon', children: icons.browserImage }),
                React.createElement(BrowserSource, { id: 'theme', className: 'moviemasher-button-icon', children: icons.browserTheme }),
                React.createElement(BrowserSource, { id: 'effect', className: 'moviemasher-button-icon', children: icons.browserEffect }),
                React.createElement(BrowserSource, { id: 'transition', className: 'moviemasher-button-icon', children: icons.browserTransition })),
            React.createElement(BrowserContent, { selectClass: 'moviemasher-selected', label: '--clip-label', className: 'moviemasher-content' },
                React.createElement("div", { className: 'moviemasher-definition' },
                    React.createElement("label", null))),
            React.createElement("div", { className: 'moviemasher-foot' })),
        React.createElement(MMTimeline, { className: 'moviemasher-panel moviemasher-timeline' },
            React.createElement("div", { className: 'moviemasher-controls moviemasher-head' }, "BUTTONS"),
            React.createElement("div", { className: 'moviemasher-content' },
                React.createElement("div", { className: 'moviemasher-scrub-pad' }),
                React.createElement(Scrub, { className: 'moviemasher-scrub' },
                    React.createElement(ScrubButton, { className: 'moviemasher-scrub-icon' })),
                React.createElement("div", { className: 'moviemasher-scrub-bar-container' },
                    React.createElement(ScrubButton, { className: 'moviemasher-scrub-bar' })),
                React.createElement(TimelineTracks, { className: 'moviemasher-tracks' },
                    React.createElement("div", { className: 'moviemasher-track' },
                        React.createElement("div", { className: 'moviemasher-track-icon', children: icons.timelineAudio }),
                        React.createElement(TimelineClips, { className: 'moviemasher-clips', dropClass: 'moviemasher-drop', selectClass: 'moviemasher-selected', label: '--clip-label' },
                            React.createElement("div", { className: 'moviemasher-clip' },
                                React.createElement("label", null))))),
                React.createElement(TimelineSizer, { className: 'moviemasher-timeline-sizer' })),
            React.createElement("div", { className: 'moviemasher-controls moviemasher-foot' },
                React.createElement(ZoomSlider, null))),
        React.createElement(InspectorPanel, { className: 'moviemasher-panel moviemasher-inspector' },
            React.createElement("div", { className: 'moviemasher-content' },
                React.createElement(Inspector, { properties: 'label,backcolor', inputs: inputs },
                    React.createElement("label", null)),
                React.createElement(TypeNotSelected, { type: 'mash' },
                    React.createElement(Defined, { property: 'color', className: 'moviemasher-input' },
                        React.createElement("label", null, "Color"),
                        " ",
                        inputs[DataType.Text]),
                    React.createElement(Inspector, { inputs: inputs, className: 'moviemasher-input' },
                        React.createElement("label", null))),
                React.createElement(Informer, null,
                    React.createElement("label", null))),
            React.createElement("div", { className: 'moviemasher-foot' }))));
};

export { Browser, BrowserContent, BrowserContext, BrowserContextDefault, BrowserDefinition, BrowserSource, Constants, DefaultInputs, DragType, DragTypeSuffix, DragTypes, Editor, EditorContext, EditorContextDefault, MMTimeline, MaterialIcons, Paused, PlayButton, Playing, Preview, ReactMovieMasher, RemixIcons, Scrub, ScrubButton, TimeSlider, TimelineClip, TimelineClips, TimelineContext, TimelineContextDefault, TimelineSizer, TimelineTrack, TimelineTracks, TrackContext, TrackContextDefault, TrackContextProvider, ZoomSlider, useMashScale };
//# sourceMappingURL=index.js.map
