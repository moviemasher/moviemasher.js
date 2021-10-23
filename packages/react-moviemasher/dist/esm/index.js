import React, { createContext, useContext } from 'react';
import { MovieMasher, EventType, Time, pixelPerFrame, pixelFromFrame, pixelToFrame, TrackType, DefinitionType, elementScrollMetrics } from '@moviemasher/moviemasher.js';

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

const MMContextDefault = {
    audioTracks: 0,
    paused: false,
    quantize: 0,
    setPaused: () => { },
    setVolume: () => { },
    videoTracks: 0,
    volume: 0,
};
const MMContext = createContext(MMContextDefault);

const MasherContextDefault = {
    frame: 0,
    frames: 0,
    selectedClipIdentifier: '',
    selectedEffectIdentifier: '',
    setFrame: () => { },
};
const MasherContext = React.createContext(MasherContextDefault);
const MasherContextProvider = MasherContext.Provider;

const MMApp = (props) => {
    const previewReference = React.useRef();
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
    const [paused, setPaused] = React.useState(masher.paused);
    const [volume, setVolume] = React.useState(masher.volume);
    const [frame, setFrame] = React.useState(masher.mash.frame);
    const [frames, setFrames] = React.useState(masher.mash.frames);
    const [selectedClipIdentifier, setSelectedClipIdentifier] = React.useState('');
    const [selectedEffectIdentifier, setSelectedEffectIdentifier] = React.useState('');
    const [audioTracks, setAudibleTracks] = React.useState(mash.audio.length);
    const [videoTracks, setVisibleTracks] = React.useState(mash.video.length);
    const [canvas, setCanvas] = React.useState(masher.canvas);
    const changeFrame = (value) => { masher.time = Time.fromArgs(value, quantize); }; //masher.time.withFrame(value) }
    const changePaused = (value) => { masher.paused = value; };
    const changeVolume = (value) => { masher.volume = value; };
    const handleCanvas = () => { listenCanvas(masher.canvas); };
    const handleVolume = () => { setVolume(masher.volume); };
    const handlePaused = () => { setPaused(masher.paused); };
    const handleSelection = () => {
        setSelectedClipIdentifier(String(masher.selectedClip.identifier));
        setSelectedEffectIdentifier(String(masher.selectedEffect.identifier));
    };
    const handleTime = () => {
        setFrame(masher.mash.frame);
    };
    const handleDuration = () => {
        console.log("MMApp.handleDuration frames", masher.mash.frames);
        setFrames(masher.mash.frames);
    };
    const handleTrack = () => {
        setAudibleTracks(mash.audio.length);
        setVisibleTracks(mash.video.length);
    };
    const listenCanvas = (value) => {
        if (canvas) {
            canvas.removeEventListener(EventType.Canvas, handleCanvas);
            canvas.removeEventListener(EventType.Duration, handleDuration);
            canvas.removeEventListener(EventType.Pause, handlePaused);
            canvas.removeEventListener(EventType.Play, handlePaused);
            canvas.removeEventListener(EventType.Time, handleTime);
            canvas.removeEventListener(EventType.Track, handleTrack);
            canvas.removeEventListener(EventType.Volume, handleVolume);
            canvas.removeEventListener(EventType.Selection, handleSelection);
        }
        if (value) {
            value.addEventListener(EventType.Canvas, handleCanvas);
            value.addEventListener(EventType.Duration, handleDuration);
            value.addEventListener(EventType.Pause, handlePaused);
            value.addEventListener(EventType.Play, handlePaused);
            value.addEventListener(EventType.Time, handleTime);
            value.addEventListener(EventType.Track, handleTrack);
            value.addEventListener(EventType.Volume, handleVolume);
            value.addEventListener(EventType.Selection, handleSelection);
            setCanvas(value);
        }
    };
    const appContext = {
        // canvas,
        audioTracks,
        masher,
        paused,
        previewReference,
        quantize,
        setPaused: changePaused,
        setVolume: changeVolume,
        videoTracks,
        volume,
    };
    const masherContext = {
        frame,
        frames,
        setFrame: changeFrame,
        selectedClipIdentifier,
        selectedEffectIdentifier,
    };
    React.useEffect(() => {
        const { current: currentPreview } = previewReference || {};
        if (currentPreview) {
            listenCanvas(canvas);
            masher.canvas = currentPreview;
        }
        else
            console.log("MMApp.useEffect", previewReference);
        return () => { listenCanvas(); };
    }, []);
    return (React.createElement(MMContext.Provider, { value: appContext },
        React.createElement(MasherContextProvider, { value: masherContext, children: props.children })));
};

const BrowserButton = () => {
    return React.createElement("div", null, "fuck yeah");
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

const View = React.forwardRef((props, ref) => React.createElement("div", Object.assign({ ref: ref }, props)));

const MMBrowser = props => {
    const { children } = props, rest = __rest(props, ["children"]);
    return React.createElement(View, Object.assign({}, rest), children);
};

const MMBrowserSource = props => {
    return React.createElement(View, Object.assign({}, props));
};

const MMBrowserView = props => {
    return React.createElement(View, Object.assign({}, props));
};

const nodesArray = (children) => React.Children.toArray(children);
const nodesFindChild = (nodes, id) => {
    const found = nodes.find(node => {
        if (!React.isValidElement(node))
            return false;
        return node.props.id === id;
    });
    if (found && React.isValidElement(found))
        return found;
};
const nodesFind = (children, id) => {
    return nodesFindChild(nodesArray(children), id);
};

const ButtonCloneElement = (element, values) => {
    const { props } = element;
    const { className } = props, rest = __rest(props, ["className"]);
    const { className: valuesClassName } = values, valuesRest = __rest(values, ["className"]);
    const classes = [valuesClassName];
    if (className)
        classes.push(className);
    const options = Object.assign(Object.assign(Object.assign({}, rest), valuesRest), { className: classes.join(' ') });
    return React.cloneElement(element, options);
};
const ButtonCloneOptions = (key) => ({
    key, className: `${ButtonIconClass} ${ButtonIconClass}-${key}`
});
const ButtonClass = 'moviemasher-button';
const ButtonIconClass = `${ButtonClass}-icon`;
const Button = (props) => {
    const { startIcon, endIcon, children, className } = props, rest = __rest(props, ["startIcon", "endIcon", "children", "className"]);
    const classes = ['moviemasher-control'];
    if (className)
        classes.push(className);
    const kids = [];
    if (children) {
        if (typeof children === 'string' || typeof children === 'number') {
            if (startIcon)
                kids.push(ButtonCloneElement(startIcon, ButtonCloneOptions('start')));
            kids.push(children);
            if (endIcon)
                kids.push(ButtonCloneElement(endIcon, ButtonCloneOptions('end')));
            if (startIcon || endIcon)
                classes.push(`${ButtonClass}-text`);
        }
        else
            kids.push(ButtonCloneElement(children, ButtonCloneOptions('child')));
    }
    return React.createElement("button", Object.assign({ children: kids, className: classes.join(' ') }, rest));
};

const PlayToggle = (props) => {
    const appContext = React.useContext(MMContext);
    const { paused, setPaused } = appContext;
    const { children } = props, rest = __rest(props, ["children"]);
    const handleClick = () => { setPaused(!paused); };
    const kids = nodesArray(children);
    const control = nodesFind(kids, 'moviemasher-play-control');
    const pausedOptions = Object.assign({ key: 'moviemasher-play', onClick: handleClick, children: nodesFind(kids, `moviemasher-play-${paused ? 'false' : 'true'}`) }, rest);
    if (control)
        return React.cloneElement(control, pausedOptions);
    return React.createElement(Button, Object.assign({}, pausedOptions));
};

const CanvasView = React.forwardRef((props, reference) => (React.createElement("canvas", Object.assign({}, props, { ref: reference }))));

const Preview = (props) => {
    const context = React.useContext(MMContext);
    const canvasProps = Object.assign({ key: 'preview' }, props);
    if (context.previewReference)
        canvasProps.ref = context.previewReference;
    return React.createElement(CanvasView, Object.assign({}, canvasProps));
};

const TimeSlider = (props) => {
    const masherContext = React.useContext(MasherContext);
    const { frame, frames, setFrame } = masherContext;
    const { control } = props, rest = __rest(props, ["control"]);
    const handleChange = (_event, value) => {
        const number = typeof value === "number" ? value : value[0];
        console.log("handleChange", number, frame);
        if (frame !== number)
            setFrame(number);
    };
    const onChange = React.useCallback(handleChange, [frame]);
    const frameOptions = Object.assign({ value: frame, min: 0, max: frames, step: 1, onChange }, rest);
    return React.cloneElement(control, frameOptions);
};

const TimelineContextDefault = {
    actionNonce: 0,
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
    const appContext = useContext(MMContext);
    const [canvas, setCanvas] = React.useState(null);
    const [actionNonce, setActionNonce] = React.useState(0);
    const handleAction = () => { setActionNonce(nonce => nonce + 1); };
    const listenCanvas = (value) => {
        if (canvas)
            canvas.removeEventListener(EventType.Action, handleAction);
        if (value) {
            value.addEventListener(EventType.Action, handleAction);
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
        actionNonce,
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

// import React from "react"
const useMashScale = () => {
    const timelineContext = React.useContext(TimelineContext);
    // const appContext = React.useContext(MMContext)
    const masherContext = React.useContext(MasherContext);
    const { width, zoom } = timelineContext;
    if (!width)
        return 0;
    const { frames } = masherContext;
    // const { quantize, masher } = appContext
    // const { fps } = masher
    // const time = Time.fromArgs(frames, fps)
    // const scaled = time.scale(quantize)
    return pixelPerFrame(frames, width, zoom);
};

const Scrub = (props) => {
    const ref = React.useRef(null);
    const masherContext = React.useContext(MasherContext);
    const [down, setDown] = React.useState(() => false);
    const scale = useMashScale();
    const { frames, setFrame } = masherContext;
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
    const masherContext = React.useContext(MasherContext);
    const scale = useMashScale();
    if (!scale)
        return null;
    const { frame } = masherContext;
    const left = pixelFromFrame(frame, scale);
    const iconProps = Object.assign(Object.assign({}, props), { key: 'timeline-icon', style: { left } });
    return React.createElement(View, Object.assign({}, iconProps));
};

const TimelineClip = props => {
    const { clip, className, selectClass, children } = props, propsRest = __rest(props, ["clip", "className", "selectClass", "children"]);
    const ref = React.useRef(null);
    const appContext = React.useContext(MMContext);
    const masherContext = React.useContext(MasherContext);
    const { selectedClipIdentifier } = masherContext;
    const classNamesState = () => {
        const classes = [];
        if (className)
            classes.push(className);
        if (selectClass && clip.identifier === selectedClipIdentifier) {
            classes.push(selectClass);
        }
        const names = classes.join(' ');
        return names;
    };
    const [classNames, setClassNames] = React.useState(classNamesState);
    const [clickOffset, setClickOffset] = React.useState(0);
    const handleSelectedClip = () => { setClassNames(classNamesState()); };
    const onMouseDown = (event) => {
        var _a;
        const { current } = ref;
        if (!current)
            return;
        const rect = current.getBoundingClientRect();
        const { left } = rect;
        const { clientX } = event; // , shiftKey
        setClickOffset(clientX - left);
        (_a = appContext.masher) === null || _a === void 0 ? void 0 : _a.selectClip(clip); //, shiftKey)
    };
    const onDragStart = event => {
        onMouseDown(event);
        const data = { offset: clickOffset };
        const json = JSON.stringify(data);
        const { dataTransfer } = event;
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData(clip.type + DragTypeSuffix, json);
    };
    React.useEffect(handleSelectedClip, [selectedClipIdentifier]);
    const clipProps = Object.assign(Object.assign({}, propsRest), { className: classNames, onMouseDown,
        onDragStart, draggable: true, ref });
    return React.cloneElement(children, clipProps);
};

const TrackContextDefault = {
    type: TrackType.Video,
    index: 0,
};
const TrackContext = React.createContext(TrackContextDefault);
const TrackContextProvider = TrackContext.Provider;

const TimelineClips = props => {
    const appContext = React.useContext(MMContext);
    const trackContext = React.useContext(TrackContext);
    const [isOver, setIsOver] = React.useState(false);
    const ref = React.useRef(null);
    const scale = useMashScale();
    const { masher } = appContext;
    if (!masher)
        return null;
    const { label: labelVar, dropClass, selectClass, className, children } = props, rest = __rest(props, ["label", "dropClass", "selectClass", "className", "children"]);
    const kid = React.Children.only(children);
    if (!React.isValidElement(kid))
        throw `TimelineClips`;
    const { mash } = masher;
    const { type, index } = trackContext;
    const track = mash.trackOfTypeAtIndex(type, index);
    const { clips } = track;
    const main = track.isMainVideo;
    const childNodes = () => {
        // console.log("TimelineClips.childNodes")
        let frame = 0;
        return clips.map(clip => {
            const kidRest = __rest(kid.props, []);
            const { label } = clip;
            const width = pixelFromFrame(clip.frames, scale, 'floor');
            const style = { width };
            if (labelVar)
                style[labelVar] = `'${label.replace("'", "\\'")}'`;
            if (!main) {
                style.marginLeft = pixelFromFrame(clip.frame - frame, scale, 'floor');
                frame = clip.frames + clip.frame;
            }
            const clipProps = Object.assign(Object.assign({}, kidRest), { key: clip.identifier, style,
                clip, children: kid, selectClass });
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
            return main; // transitions only allowed on main track
        const clipIsAudio = definitionType === DefinitionType.Audio;
        const trackIsAudio = track.type === TrackType.Audio;
        return clipIsAudio === trackIsAudio; // audio clips only allowed on audio tracks
    };
    const dropClip = (dataTransfer, offsetDrop) => {
        const type = dropType(dataTransfer);
        const json = dataTransfer.getData(type);
        const data = JSON.parse(json);
        const clip = masher.selectedClips[0];
        const { offset } = data;
        const frame = pixelToFrame(offsetDrop - offset, scale);
        const frameOrIndex = main ? frameToIndex(frame, track.clips) : frame;
        masher.moveClips(clip, frameOrIndex, index);
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
    const viewProps = Object.assign(Object.assign({}, rest), { className: classes.join(' '), children: childNodes(), ref,
        onDragLeave,
        onDragOver,
        onDrop });
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
    const appContext = React.useContext(MMContext);
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
    const context = useContext(TimelineContext);
    const { control } = props, rest = __rest(props, ["control"]);
    const handleChange = (_event, value) => {
        const number = typeof value === "number" ? value : value[0];
        if (context.zoom !== number)
            context.setZoom(number);
    };
    const frameOptions = Object.assign({ key: 'time-slider', value: context.zoom, min: 0.0, max: 1.0, step: 0.01, onChange: handleChange }, rest);
    return React.cloneElement(control, frameOptions);
};

export { BrowserButton, Constants, DragType, DragTypeSuffix, DragTypes, MMApp, MMBrowser, MMBrowserSource, MMBrowserView, MMTimeline, PlayToggle, Preview, Scrub, ScrubButton, TimeSlider, TimelineClip, TimelineClips, TimelineContext, TimelineContextDefault, TimelineSizer, TimelineTrack, TimelineTracks, TrackContext, TrackContextDefault, TrackContextProvider, ZoomSlider, useMashScale };
//# sourceMappingURL=index.js.map
