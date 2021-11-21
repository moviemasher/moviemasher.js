import { Factory, DefinitionTypes, DataType, definitionsByType, Errors, EventType, ContextFactory, Time, pixelPerFrame, pixelFromFrame, pixelToFrame, TrackType, DefinitionType } from '@moviemasher/moviemasher.js';
export * from '@moviemasher/moviemasher.js';
import React, { createContext } from 'react';
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
import ChatVoiceFillIcon from 'remixicon-react/ChatVoiceFillIcon';
import VideoChatFillIcon from 'remixicon-react/VideoChatFillIcon';
import FolderChartFillIcon from 'remixicon-react/FolderChartFillIcon';
import ImageFillIcon from 'remixicon-react/ImageFillIcon';
import MvFillIcon from 'remixicon-react/MvFillIcon';

const EditorContextDefault = {
    masher: Factory.masher.instance({ fps: 24 })
};
const EditorContext = React.createContext(EditorContextDefault);

const useListeners = (events) => {
    const editorContext = React.useContext(EditorContext);
    const { masher } = editorContext;
    const { eventTarget } = masher;
    const handleEvent = (event) => {
        const { type } = event;
        const handler = events[type];
        if (handler)
            handler(masher);
    };
    const removeListeners = () => {
        Object.keys(events).forEach(eventType => {
            eventTarget.removeEventListener(eventType, handleEvent);
        });
    };
    const addListeners = () => {
        Object.keys(events).forEach(eventType => {
            eventTarget.addEventListener(eventType, handleEvent);
        });
        return () => { removeListeners(); };
    };
    React.useEffect(() => addListeners(), []);
    return editorContext;
};

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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

const CanvasView = React.forwardRef((props, ref) => React.createElement("canvas", Object.assign({}, props, { ref: ref })));

const propsStringArray = (string, array, properties) => {
    if (string)
        return [string];
    if (!array)
        return properties ? properties.map(property => property.name) : [];
    if (typeof array === 'string')
        return array.split(',').map(string => string.trim());
    return array;
};
const propsDefinitionTypes = (type, types, id) => {
    const strings = propsStringArray(type, types);
    if (id && !strings.length)
        strings.push(id);
    const definitionTypes = DefinitionTypes.map(String);
    const validStrings = strings.filter(string => definitionTypes.includes(string));
    // console.debug("propsDefinitionTypes", validStrings)
    return validStrings.map(string => string);
};
const Props = {
    stringArray: propsStringArray,
    definitionTypes: propsDefinitionTypes,
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

const VideoView = React.forwardRef((props, ref) => React.createElement("video", Object.assign({}, props, { ref: ref })));

const View = React.forwardRef((props, ref) => React.createElement("div", Object.assign({ ref: ref }, props)));

const Editor = (props) => {
    const { mash } = props, rest = __rest(props, ["mash"]);
    const { masher } = EditorContextDefault;
    React.useEffect(() => { if (mash)
        masher.mash = mash; }, [mash]);
    return (React.createElement(EditorContext.Provider, { value: EditorContextDefault },
        React.createElement(View, Object.assign({}, rest))));
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
    browserVideoStream: React.createElement(VideoChatFillIcon, null),
    browserAudioStream: React.createElement(ChatVoiceFillIcon, null),
    playerPause: React.createElement(PauseCircleFillIcon, null),
    playerPlay: React.createElement(PlayCircleFillIcon, null),
    timelineAudio: React.createElement(MvFillIcon, null),
};

const InputContextDefault = {
    property: '',
    value: '',
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

const BrowserContextDefault = {
    definitions: [],
    definitionId: '',
    setDefinitions: () => { },
    setDefinitionId: () => { },
    setSourceId: () => { },
    sourceId: '',
};
const BrowserContext = React.createContext(BrowserContextDefault);

const BrowserPanel = props => {
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
        // console.log("onMouseDown")
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
        // console.log("onDragStart")
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
    const browserContext = React.useContext(BrowserContext);
    const { type, types, className, id, definitionType, promiseProvider } = props, rest = __rest(props, ["type", "types", "className", "id", "definitionType", "promiseProvider"]);
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
                    const definitionTypes = propsDefinitionTypes(type, types, id);
                    const lists = definitionTypes.map(type => definitionsByType(type));
                    if (!lists.length)
                        throw "definition type or promiseProvider required";
                    const definitions = lists.length === 1 ? lists[0] : lists.flat();
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

const NotPlaying = props => {
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

const PlayerContent = (props) => {
    const ref = React.useRef(null);
    const context = React.useContext(EditorContext);
    const { masher } = context;
    const handleResize = () => {
        const { current } = ref;
        if (!current)
            throw Errors.invalid.object;
        const rect = current.getBoundingClientRect();
        current.width = rect.width;
        current.height = rect.height;
        masher.imageSize = rect;
    };
    const [resizeObserver] = React.useState(new ResizeObserver(handleResize));
    React.useEffect(() => {
        const { current } = ref;
        if (current)
            resizeObserver.observe(current);
        return () => { resizeObserver.disconnect(); };
    }, []);
    const handleDraw = () => {
        const { current } = ref;
        if (!current)
            return;
        const imageData = masher.imageData;
        const context = ContextFactory.fromCanvas(current);
        context.drawImageData(imageData);
    };
    const removeListeners = () => {
        const { eventTarget } = masher;
        eventTarget.removeEventListener(EventType.Draw, handleDraw);
    };
    const addListeners = () => {
        const { eventTarget } = masher;
        eventTarget.addEventListener(EventType.Draw, handleDraw);
        return () => { removeListeners(); };
    };
    React.useEffect(() => addListeners(), []);
    const rest = __rest(props, ["children", "selectClass"]);
    const canvasProps = Object.assign(Object.assign({}, rest), { ref });
    return React.createElement(CanvasView, Object.assign({}, canvasProps));
};

const TimeSlider = (props) => {
    const { masher } = useListeners({
        [EventType.Time]: masher => { setFrame(masher.mash.frame); },
        [EventType.Duration]: masher => { setFrames(masher.mash.frames); }
    });
    const [frames, setFrames] = React.useState(masher.mash.frames);
    const [frame, setFrame] = React.useState(masher.mash.frame);
    const onChange = (_event, value) => {
        const number = typeof value === "number" ? value : value[0];
        masher.time = Time.fromArgs(number, masher.mash.quantize);
    };
    const sliderProps = Object.assign({ value: frame, min: 0, max: frames, step: 1, onChange }, props);
    return React.createElement(Slider, Object.assign({ className: 'moviemasher-frame moviemasher-slider' }, sliderProps));
};

function enableStereoOpus(sdp) {
    return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111');
}
class WebcamClient {
    constructor(options = {}) {
        this.host = '';
        this.prefix = '.';
        if (options.host)
            this.host = options.host;
        if (options.prefix)
            this.prefix = options.prefix;
        // this.localVideo.autoplay = true
        // this.localVideo.muted = true
    }
    beforeAnswer(peerConnection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.localStream = yield window.navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            if (!this.localStream)
                return;
            this.localStream.getTracks().forEach(track => {
                if (!this.localStream)
                    return;
                peerConnection.addTrack(track, this.localStream);
            });
            // this.localVideo.srcObject = this.localStream
            // NOTE(mroberts): This is a hack so that we can get a callback when the
            // RTCPeerConnection is closed. In the future, we can subscribe to
            // "connectionstatechange" events.
            const { close } = peerConnection;
            peerConnection.close = (...args) => {
                // this.localVideo.srcObject = null
                if (!this.localStream)
                    return;
                this.localStream.getTracks().forEach(track => { track.stop(); });
                return close.apply(peerConnection, args);
            };
        });
    }
    closeConnection() {
        var _a;
        // console.log(this.constructor.name, "closeConnection", !!this.localPeerConnection)
        (_a = this.localPeerConnection) === null || _a === void 0 ? void 0 : _a.close();
    }
    get connectionsUrl() { return `${this.host}${this.prefix}`; }
    createConnection(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stereo } = options;
            const response1 = yield fetch(this.connectionsUrl, { method: 'POST' });
            const remotePeerConnection = yield response1.json();
            // console.log(this.constructor.name, "createConnection", remotePeerConnection)
            const { id, localDescription } = remotePeerConnection;
            const rtcConfiguration = {}; //sdpSemantics: 'unified-plan'
            this.localPeerConnection = new RTCPeerConnection(rtcConfiguration);
            // NOTE(mroberts): This is a hack so that we can get a callback when the
            // RTCPeerConnection is closed. In the future, we can subscribe to
            // "connectionstatechange" events.
            this.localPeerConnection.close = () => {
                // console.trace(this.constructor.name, "close HACK!", id)
                fetch(`${this.connectionsUrl}/${id}`, { method: 'delete' }).catch(() => { });
                return RTCPeerConnection.prototype.close.apply(this.localPeerConnection);
            };
            try {
                // console.log("trying to setRemoteDescription")
                yield this.localPeerConnection.setRemoteDescription(localDescription);
                // console.log("trying to beforeAnswer")
                yield this.beforeAnswer(this.localPeerConnection);
                // console.log("trying to createAnswer")
                const originalAnswer = yield this.localPeerConnection.createAnswer();
                const updatedAnswer = new RTCSessionDescription({
                    type: 'answer',
                    sdp: stereo ? enableStereoOpus(originalAnswer.sdp) : originalAnswer.sdp
                });
                // console.log("trying to setLocalDescription")
                yield this.localPeerConnection.setLocalDescription(updatedAnswer);
                // console.log("trying to fetch")
                yield fetch(`${this.connectionsUrl}/${id}/remote-description`, {
                    method: 'POST',
                    body: JSON.stringify(this.localPeerConnection.localDescription),
                    headers: { 'Content-Type': 'application/json' }
                });
                return this.localPeerConnection;
            }
            catch (error) {
                console.trace(this.constructor.name, "createConnection", error);
                this.localPeerConnection.close();
                throw error;
            }
        });
    }
}

const WebcamContextDefault = {
    streamerClient: new WebcamClient(),
    streaming: false, setStreaming: () => { }
};
const WebcamContext = React.createContext(WebcamContextDefault);

const NotStreaming = props => {
    const streamerContext = React.useContext(WebcamContext);
    if (streamerContext.streaming)
        return null;
    return React.createElement(React.Fragment, null, props.children);
};

const StreamButton = (props) => {
    const streamerContext = React.useContext(WebcamContext);
    const { streaming, setStreaming, streamerClient } = streamerContext;
    const onClick = () => {
        if (streaming) {
            streamerClient.closeConnection();
            setStreaming(false);
        }
        else {
            streamerClient.createConnection().then(() => {
                setStreaming(true);
            });
        }
    };
    const streamingOptions = Object.assign(Object.assign({}, props), { onClick });
    return React.createElement(View, Object.assign({}, streamingOptions));
};

const WebcamPanel = props => {
    const { remoteServer } = props, rest = __rest(props, ["remoteServer"]);
    const [streaming, setStreaming] = React.useState(false);
    const { streamerClient } = WebcamContextDefault;
    const protocol = remoteServer.protocol || 'http';
    const host = remoteServer.host || 'localhost';
    const port = remoteServer.port || 8570;
    streamerClient.host = `${protocol}://${host}:${port}`;
    streamerClient.prefix = remoteServer.prefix || '/webrtc';
    const streamerContext = Object.assign(Object.assign({}, WebcamContextDefault), { streaming, setStreaming });
    return (React.createElement(WebcamContext.Provider, { value: streamerContext },
        React.createElement(View, Object.assign({}, rest))));
};

const WebcamContent = (props) => {
    const ref = React.useRef(null);
    const streamerContext = React.useContext(WebcamContext);
    const { streamerClient, streaming } = streamerContext;
    const addListeners = () => {
        // const { eventTarget } = streamerClient
        // eventTarget.addEventListener(EventType.Draw, handleDraw)
        return () => { };
    };
    const { current } = ref;
    if (current)
        current.srcObject = streaming ? streamerClient.localStream || null : null;
    React.useEffect(() => addListeners(), []);
    const rest = __rest(props, ["children", "selectClass"]);
    const videoProps = Object.assign(Object.assign({}, rest), { ref, autoPlay: true, muted: true });
    return React.createElement(VideoView, Object.assign({}, videoProps));
};

const Streaming = props => {
    const streamerContext = React.useContext(WebcamContext);
    if (!streamerContext.streaming)
        return null;
    return React.createElement(React.Fragment, null, props.children);
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

const TimelinePanel = props => {
    const [zoom, setZoom] = React.useState(0);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const timelineContext = {
        setZoom,
        setWidth,
        setHeight,
        zoom,
        width,
        height,
    };
    const { children } = props, rest = __rest(props, ["children"]);
    return React.createElement(View, Object.assign({}, rest),
        React.createElement(TimelineContext.Provider, { value: timelineContext, children: children }));
};

const useMashScale = () => {
    const timelineContext = React.useContext(TimelineContext);
    const { masher } = useListeners({
        [EventType.Duration]: masher => { setFrames(masher.mash.frames); }
    });
    const [frames, setFrames] = React.useState(masher.mash.frames);
    const { width, zoom } = timelineContext;
    if (!width)
        return 0;
    return pixelPerFrame(frames, width, zoom);
};

const Scrubber = (props) => {
    const { masher } = useListeners({
        [EventType.Duration]: masher => { setFrames(masher.mash.frames); }
    });
    const [frames, setFrames] = React.useState(masher.mash.frames);
    const clientXRef = React.useRef(-1);
    const ref = React.useRef(null);
    const [down, setDown] = React.useState(() => false);
    const scale = useMashScale();
    const handleEvent = (event) => {
        const { current } = ref;
        if (!current)
            return;
        const { clientX } = event;
        if (clientXRef.current === clientX)
            return;
        clientXRef.current = clientX;
        const rect = current.getBoundingClientRect();
        const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x));
        const frame = pixelToFrame(pixel, scale, 'floor');
        masher.time = Time.fromArgs(frame, masher.mash.quantize);
    };
    const onMouseDown = (event) => {
        clientXRef.current = -1;
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
    const style = {};
    const width = pixelFromFrame(frames, scale, 'ceil');
    if (width)
        style.minWidth = width;
    const viewProps = Object.assign(Object.assign({}, props), { style, onMouseDown, ref });
    if (down) {
        viewProps.onMouseMove = handleMouseMove;
        viewProps.onMouseUp = handleMouseUp;
        viewProps.onMouseLeave = handleMouseUp;
    }
    return React.createElement(View, Object.assign({}, viewProps));
};

const ScrubberElement = (props) => {
    const scale = useMashScale();
    const { masher } = useListeners({
        [EventType.Time]: masher => { setFrame(masher.mash.frame); }
    });
    const [frame, setFrame] = React.useState(masher.mash.frame);
    const left = pixelFromFrame(frame, scale);
    const iconProps = Object.assign(Object.assign({}, props), { key: 'timeline-icon', style: { left } });
    return React.createElement(View, Object.assign({}, iconProps));
};

const TimelineClip = props => {
    const ref = React.useRef(null);
    const [clickOffset, setClickOffset] = React.useState(0);
    const [selectedClipIdentifier, setSelectedClipIdentifier] = React.useState('');
    const scale = useMashScale();
    const { masher } = useListeners({
        [EventType.Selection]: masher => {
            setSelectedClipIdentifier(String(masher.selectedClip.identifier));
        }
    });
    const { label: labelVar, clip, prevClipEnd, selectClass, children } = props;
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
        const { current } = ref;
        if (!current)
            return;
        const rect = current.getBoundingClientRect();
        const { left } = rect;
        const { clientX } = event;
        setClickOffset(clientX - left);
        masher.selectClip(clip);
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
        onDragStart, onClick: (event) => event.stopPropagation(), draggable: true, ref });
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

const TimelineContent = props => {
    const rest = __rest(props, ["selectClass"]);
    return React.createElement("div", Object.assign({}, rest));
};

const TimelineSizer = props => {
    const ref = React.useRef(null);
    const timelineContext = React.useContext(TimelineContext);
    const handleResize = () => {
        const { current } = ref;
        if (!current)
            throw "TimelineSizer no ref.current";
        const rect = current.getBoundingClientRect();
        const { setWidth, setHeight } = timelineContext;
        setWidth(rect.width);
        setHeight(rect.height);
    };
    const [resizeObserver] = React.useState(new ResizeObserver(handleResize));
    React.useEffect(() => {
        const { current } = ref;
        if (current)
            resizeObserver.observe(current);
        return () => { resizeObserver.disconnect(); };
    }, []);
    const viewProps = Object.assign(Object.assign({}, props), { ref });
    return React.createElement(View, Object.assign({}, viewProps));
};

const TimelineTrack = (props) => {
    const { index, type, children } = props;
    const context = { index, type };
    return React.createElement(TrackContextProvider, { value: context, children: children });
};

const TimelineTracks = props => {
    const { masher } = useListeners({
        [EventType.Track]: masher => {
            setAudioTracks(masher.mash.audio.length);
            setVideoTracks(masher.mash.video.length);
        }
    });
    const [audioTracks, setAudioTracks] = React.useState(masher.mash.audio.length);
    const [videoTracks, setVideoTracks] = React.useState(masher.mash.video.length);
    const { children } = props, rest = __rest(props, ["children"]);
    const childNodes = () => {
        const childNodes = [];
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
    const onClick = event => {
        masher.selectedClips = [];
    };
    const viewProps = Object.assign(Object.assign({}, rest), { children: childNodes(), onClick });
    return React.createElement(View, Object.assign({}, viewProps));
};

const Zoomer = (props) => {
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
    const handlePaused = (masher) => { setPaused(masher.paused); };
    const { masher } = useListeners({
        [EventType.Pause]: handlePaused,
        [EventType.Play]: handlePaused,
        [EventType.Volume]: masher => { setVolume(masher.volume); },
    });
    const [paused, setPaused] = React.useState(masher.paused);
    const [volume, setVolume] = React.useState(masher.volume);
    const changePaused = (value) => { masher.paused = value; };
    const changeVolume = (value) => { masher.volume = value; };
    const playerContext = {
        paused,
        setPaused: changePaused,
        setVolume: changeVolume,
        volume,
    };
    return (React.createElement(PlayerContext.Provider, { value: playerContext },
        React.createElement("div", Object.assign({}, props))));
};

const InspectorContextDefault = {
    definitionType: DefinitionType.Mash,
    actionCount: 0,
    mash: EditorContextDefault.masher.mash,
};
const InspectorContext = React.createContext(InspectorContextDefault);

const InspectorPanel = props => {
    const { masher } = useListeners({
        [EventType.Action]: () => { setActionCount(nonce => nonce + 1); },
        [EventType.Selection]: masher => {
            setClip(masher.clip);
            setEffect(masher.effect);
            setDefinitionType(masher.selected.type);
        },
    });
    const [definitionType, setDefinitionType] = React.useState(DefinitionType.Mash);
    const [actionCount, setActionCount] = React.useState(0);
    const [clip, setClip] = React.useState(masher.clip);
    const [effect, setEffect] = React.useState(masher.effect);
    const inspectorContext = {
        mash: masher.mash, actionCount, clip, effect, definitionType
    };
    return (React.createElement(InspectorContext.Provider, { value: inspectorContext },
        React.createElement(View, Object.assign({}, props))));
};

const useSelected = () => {
    const inspectorContext = React.useContext(InspectorContext);
    return inspectorContext.clip || inspectorContext.mash;
};

const Defined = props => {
    const { property, properties } = props, rest = __rest(props, ["property", "properties"]);
    const selected = useSelected();
    const { masher } = React.useContext(EditorContext);
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
    const { masher } = React.useContext(EditorContext);
    const selected = useSelected();
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

const NotInspectingType = props => {
    const inspectorContext = React.useContext(InspectorContext);
    const { type, types, children } = props;
    if (!children)
        return null;
    const { definitionType } = inspectorContext;
    const definitionTypes = propsDefinitionTypes(type, types);
    if (definitionTypes.includes(definitionType))
        return null;
    return React.createElement(React.Fragment, null, children);
};

const PropertyInformer = props => {
    const { className, property, children } = props;
    const selected = useSelected();
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

const InspectorContent = props => React.createElement("div", Object.assign({}, props));

const Bar = props => {
    const { className, left, middle, right } = props;
    if (!(left || middle || right))
        return null;
    const children = [left, middle, right].filter(Boolean);
    const viewProps = {
        className, children,
    };
    return React.createElement(View, Object.assign({}, viewProps));
};
const ReactMovieMasher = props => {
    const { mash, icons, inputs, className, selectClass, dropClass, panels } = props;
    const classNameEditor = className || 'moviemasher-app';
    const classNameDrop = dropClass || 'moviemasher-drop';
    const classNameSelect = selectClass || 'moviemasher-selected';
    const panelOptions = panels || {};
    const optionsLoose = {
        browser: typeof panelOptions.browser === 'undefined' ? {} : panelOptions.browser,
        player: typeof panelOptions.player === 'undefined' ? {} : panelOptions.player,
        inspector: typeof panelOptions.inspector === 'undefined' ? {} : panelOptions.inspector,
        timeline: typeof panelOptions.timeline === 'undefined' ? {} : panelOptions.timeline,
    };
    Object.values(optionsLoose).forEach(options => {
        var _a, _b, _c;
        if (!options)
            return;
        options.header || (options.header = {});
        (_a = options.header).className || (_a.className = 'moviemasher-head');
        options.content || (options.content = {});
        (_b = options.content).className || (_b.className = 'moviemasher-content');
        options.footer || (options.footer = {});
        (_c = options.footer).className || (_c.className = 'moviemasher-foot');
    });
    const options = optionsLoose;
    const browserNode = (panelOptions) => {
        var _a, _b;
        panelOptions.className || (panelOptions.className = 'moviemasher-panel moviemasher-browser');
        (_a = panelOptions.header).middle || (_a.middle = React.createElement(React.Fragment, null,
            React.createElement(BrowserSource, { id: 'video', types: 'video,videosequence', className: 'moviemasher-button-icon', children: icons.browserVideo }),
            React.createElement(BrowserSource, { id: 'videostream', className: 'moviemasher-button-icon', children: icons.browserVideoStream }),
            React.createElement(BrowserSource, { id: 'audio', className: 'moviemasher-button-icon', children: icons.browserAudio }),
            React.createElement(BrowserSource, { id: 'image', className: 'moviemasher-button-icon', children: icons.browserImage }),
            React.createElement(BrowserSource, { id: 'theme', className: 'moviemasher-button-icon', children: icons.browserTheme }),
            React.createElement(BrowserSource, { id: 'effect', className: 'moviemasher-button-icon', children: icons.browserEffect }),
            React.createElement(BrowserSource, { id: 'transition', className: 'moviemasher-button-icon', children: icons.browserTransition })));
        (_b = panelOptions.content).children || (_b.children = React.createElement(View, { className: 'moviemasher-definition' },
            React.createElement("label", null)));
        const contentProps = {
            selectClass: { classNameSelect },
            label: '--clip-label',
            children: panelOptions.content.children,
            className: panelOptions.content.className,
        };
        const children = React.createElement(React.Fragment, null,
            React.createElement(Bar, Object.assign({}, panelOptions.header)),
            React.createElement(BrowserContent, Object.assign({}, contentProps)),
            React.createElement(Bar, Object.assign({}, panelOptions.footer)));
        const panelProps = { children, className: panelOptions.className };
        return React.createElement(BrowserPanel, Object.assign({}, panelProps));
    };
    const inspectorNode = (panelOptions) => {
        var _a;
        panelOptions.className || (panelOptions.className = 'moviemasher-panel moviemasher-inspector');
        (_a = panelOptions.content).children || (_a.children = React.createElement(React.Fragment, null,
            React.createElement(Inspector, { properties: 'label,backcolor', inputs: inputs },
                React.createElement("label", null)),
            React.createElement(NotInspectingType, { type: 'mash' },
                React.createElement(Defined, { property: 'color', className: 'moviemasher-input' },
                    React.createElement("label", null, "Color"),
                    " ",
                    inputs[DataType.Text]),
                React.createElement(Inspector, { inputs: inputs, className: 'moviemasher-input' },
                    React.createElement("label", null))),
            React.createElement(Informer, null,
                React.createElement("label", null))));
        const contentProps = {
            selectClass: { classNameSelect },
            label: '--clip-label',
            children: panelOptions.content.children,
            className: panelOptions.content.className,
        };
        const children = React.createElement(React.Fragment, null,
            React.createElement(Bar, Object.assign({}, panelOptions.header)),
            React.createElement(InspectorContent, Object.assign({}, contentProps)),
            React.createElement(Bar, Object.assign({}, panelOptions.footer)));
        const panelProps = { children, className: panelOptions.className };
        return React.createElement(InspectorPanel, Object.assign({}, panelProps));
    };
    const playerNode = (panelOptions) => {
        var _a, _b;
        panelOptions.className || (panelOptions.className = 'moviemasher-panel moviemasher-player');
        const contentProps = {
            selectClass: { classNameSelect },
            className: panelOptions.content.className,
        };
        (_a = panelOptions.content).children || (_a.children = React.createElement(PlayerContent, Object.assign({}, contentProps)));
        (_b = panelOptions.footer).middle || (_b.middle = React.createElement(React.Fragment, null,
            React.createElement(PlayButton, { className: 'moviemasher-button' },
                React.createElement(Playing, null, icons.playerPause),
                React.createElement(NotPlaying, null, icons.playerPlay)),
            React.createElement(TimeSlider, null)));
        const children = React.createElement(React.Fragment, null,
            React.createElement(Bar, Object.assign({}, panelOptions.header)),
            panelOptions.content.children,
            React.createElement(Bar, Object.assign({}, panelOptions.footer)));
        const panelProps = { children, className: panelOptions.className };
        return React.createElement(PlayerPanel, Object.assign({}, panelProps));
    };
    const timelineNode = (panelOptions) => {
        var _a, _b, _c;
        panelOptions.className || (panelOptions.className = 'moviemasher-panel moviemasher-timeline');
        (_a = panelOptions.content).children || (_a.children = React.createElement(React.Fragment, null,
            React.createElement(View, { className: 'moviemasher-scrub-pad' }),
            React.createElement(Scrubber, { className: 'moviemasher-scrub' },
                React.createElement(ScrubberElement, { className: 'moviemasher-scrub-icon' })),
            React.createElement(View, { className: 'moviemasher-scrub-bar-container' },
                React.createElement(ScrubberElement, { className: 'moviemasher-scrub-bar' })),
            React.createElement(TimelineTracks, { className: 'moviemasher-tracks' },
                React.createElement(View, { className: 'moviemasher-track' },
                    React.createElement(View, { className: 'moviemasher-track-icon', children: icons.timelineAudio }),
                    React.createElement(TimelineClips, { className: 'moviemasher-clips', dropClass: classNameDrop, selectClass: classNameSelect, label: '--clip-label' },
                        React.createElement(View, { className: 'moviemasher-clip' },
                            React.createElement("label", null))))),
            React.createElement(TimelineSizer, { className: 'moviemasher-timeline-sizer' })));
        (_b = panelOptions.header).middle || (_b.middle = React.createElement(React.Fragment, null, "BUTTONS!"));
        (_c = panelOptions.footer).middle || (_c.middle = React.createElement(React.Fragment, null,
            React.createElement(Zoomer, null)));
        const contentProps = {
            selectClass: { classNameSelect },
            children: panelOptions.content.children,
            className: panelOptions.content.className,
        };
        const children = React.createElement(React.Fragment, null,
            React.createElement(Bar, Object.assign({}, panelOptions.header)),
            React.createElement(TimelineContent, Object.assign({}, contentProps)),
            React.createElement(Bar, Object.assign({}, panelOptions.footer)));
        const panelProps = { children, className: panelOptions.className };
        return React.createElement(TimelinePanel, Object.assign({}, panelProps));
    };
    const children = [];
    if (options.browser)
        children.push(browserNode(options.browser));
    if (options.inspector)
        children.push(inspectorNode(options.inspector));
    if (options.player)
        children.push(playerNode(options.player));
    if (options.timeline)
        children.push(timelineNode(options.timeline));
    const editorProps = { className: classNameEditor, mash, children };
    return React.createElement(Editor, Object.assign({}, editorProps));
};

export { BrowserContent, BrowserContext, BrowserContextDefault, BrowserDefinition, BrowserPanel, BrowserSource, Button, CanvasView, Constants, DefaultInputs, DragType, DragTypeSuffix, DragTypes, Editor, EditorContext, EditorContextDefault, MaterialIcons, NotPlaying, NotStreaming, PlayButton, PlayerContent, Playing, Props, ReactMovieMasher, RemixIcons, Scrubber, ScrubberElement, Slider, StreamButton, Streaming, TimeSlider, TimelineClip, TimelineClips, TimelineContent, TimelineContext, TimelineContextDefault, TimelinePanel, TimelineSizer, TimelineTrack, TimelineTracks, TrackContext, TrackContextDefault, TrackContextProvider, VideoView, View, WebcamClient, WebcamContent, WebcamContext, WebcamContextDefault, WebcamPanel, Zoomer, propsDefinitionTypes, propsStringArray, useListeners, useMashScale };
//# sourceMappingURL=index.js.map
