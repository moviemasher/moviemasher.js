(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('@moviemasher/moviemasher.js'), require('@moviemasher/theme-default')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', '@moviemasher/moviemasher.js', '@moviemasher/theme-default'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MovieMasherClient = {}, global.React, global.MovieMasher, global.MovieMasherTheme));
})(this, (function (exports, React, moviemasher_js, themeDefault) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /******************************************************************************
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

    const View = React__default["default"].forwardRef((props, ref) => React__default["default"].createElement("div", Object.assign({ ref: ref }, props)));

    const LabelRegex = /{{([a-z0-9_]*)}}/;
    const labelObjects = {
        import: {
            bytes: 'Size above {{value}}',
            extension: 'Extension {{value}}',
            type: 'Type {{value}}',
            size: 'Dimensions {{value}}',
            duration: 'Duration {{value}}',
            render: '{{value}}',
            displaySize: '{{width}}x{{height}}',
        }
    };
    const labels = {
        audible: 'Audible',
        clip: 'Clip',
        update: 'Save',
        delete: 'Remove {{type}}',
        unlabeled: 'Unlabeled {{type}}',
        analyze: 'Analyzing...',
        load: 'Loading...',
        complete: 'Completed',
        layer: 'Layer',
        create: 'New',
        render: 'Render',
        view: 'View',
        open: 'Open...',
        undo: 'Undo',
        redo: 'Redo',
        cast: 'Cast',
        mash: 'Mash',
    };
    const labelLookup = (id) => {
        const [first, second] = id.split('.');
        return labelObjects[first][second];
    };
    const labelTranslate = (id) => {
        if (id.includes('.'))
            return labelLookup(id);
        return labels[id] || id;
    };
    const labelInterpolate = (id, context) => {
        let translated = labelTranslate(id);
        const matches = translated.match(LabelRegex);
        if (!matches)
            return translated;
        matches.forEach((match, index) => {
            if (!index)
                return;
            const search = `{{${match}}}`;
            const replace = labelTranslate(context[match]);
            translated = translated.replace(search, replace);
        });
        return translated;
    };

    const activityLabel = (info) => {
        if (!moviemasher_js.isObject(info))
            return '';
        const { label, error, type, value } = info;
        if (error) {
            if (value)
                return labelInterpolate(error, { value });
            return labelTranslate(error);
        }
        // switch(type) {
        //   case ActivityType.Complete:
        //   case ActivityType.Analyze:
        //   case ActivityType.Render:
        //   case ActivityType.Load: return labelTranslate(type)
        // }
        // if (label) return label
        return labelTranslate(type);
    };
    exports.ActivityGroup = void 0;
    (function (ActivityGroup) {
        ActivityGroup["Active"] = "active";
        ActivityGroup["Error"] = "error";
        ActivityGroup["Complete"] = "complete";
    })(exports.ActivityGroup || (exports.ActivityGroup = {}));
    const ActivityGroups = Object.values(exports.ActivityGroup);
    const isActivityGroup = (type) => {
        return moviemasher_js.isPopulatedString(type) && ActivityGroups.includes(type);
    };
    function assertActivityGroup(value, name) {
        if (!isActivityGroup(value))
            moviemasher_js.throwError(value, "ActivityGroup", name);
    }
    const ActivityContextDefault = {
        label: '',
        activities: [],
        allActivities: [],
        picked: exports.ActivityGroup.Active,
        pick: moviemasher_js.EmptyMethod
    };
    const ActivityContext = React__default["default"].createContext(ActivityContextDefault);

    const CollapseContextDefault = {
        collapsed: false,
        changeCollapsed: () => { },
    };
    const CollapseContext = React__default["default"].createContext(CollapseContextDefault);

    const MasherContextDefault = {
        changeDefinition: moviemasher_js.EmptyMethod,
        drop: () => Promise.resolve([]),
        editorIndex: {},
        icons: {},
        save: moviemasher_js.EmptyMethod,
        setDraggable: moviemasher_js.EmptyMethod,
    };
    const MasherContext = React__default["default"].createContext(MasherContextDefault);

    const useEditorActivity = () => {
        // console.log("useEditorActivity")
        const masherContext = React__default["default"].useContext(MasherContext);
        const { editor } = masherContext;
        moviemasher_js.assertDefined(editor);
        const allActivitiesRef = React__default["default"].useRef([]);
        const { eventTarget } = editor;
        const getSnapshot = () => {
            return allActivitiesRef.current;
        };
        const handleEvent = (event) => {
            const { type } = event;
            if (moviemasher_js.isEventType(type) && (event instanceof CustomEvent)) {
                const info = event.detail;
                const { id, type } = info;
                const { current: allActivities } = allActivitiesRef;
                const existing = allActivities.find(activity => activity.id === id);
                const activity = existing || { id, activityGroup: exports.ActivityGroup.Active, infos: [] };
                activity.infos.unshift(info);
                if (type === moviemasher_js.ActivityType.Complete)
                    activity.activityGroup = exports.ActivityGroup.Complete;
                else if (type === moviemasher_js.ActivityType.Error) {
                    activity.activityGroup = exports.ActivityGroup.Error;
                }
                if (!existing)
                    allActivities.unshift(activity);
            }
        };
        const externalStore = React__default["default"].useSyncExternalStore((callback) => {
            eventTarget.addEventListener(moviemasher_js.EventType.Active, callback);
            return () => {
                eventTarget.removeEventListener(moviemasher_js.EventType.Active, callback);
            };
        }, getSnapshot);
        const removeListener = () => {
            eventTarget.removeEventListener(moviemasher_js.EventType.Active, handleEvent);
        };
        const addListener = () => {
            eventTarget.addEventListener(moviemasher_js.EventType.Active, handleEvent);
            return () => { removeListener(); };
        };
        React__default["default"].useEffect(() => addListener(), []);
        return [editor, externalStore];
    };

    /**
     * @parents Masher
     * @children ActivityContent
     */
    function Activity(props) {
        const { initialPicked = exports.ActivityGroup.Active, initialCollapsed = false, className } = props, rest = __rest(props, ["initialPicked", "initialCollapsed", "className"]);
        assertActivityGroup(initialPicked);
        const [collapsed, setCollapsed] = React__default["default"].useState(initialCollapsed);
        const [label, setLabel] = React__default["default"].useState('');
        const [editor, activity] = useEditorActivity();
        const [picked, setPicked] = React__default["default"].useState(initialPicked);
        const filteredActivities = React__default["default"].useMemo(() => {
            // console.log("filteredActivities", picked, allActivities.length)
            return activity.filter(activity => activity.activityGroup === picked);
        }, [picked, activity.length]);
        const activityContext = {
            activities: filteredActivities,
            allActivities: activity,
            picked, pick: setPicked, label
        };
        const collapseContext = { collapsed, changeCollapsed: setCollapsed };
        const classes = [];
        if (className)
            classes.push(className);
        if (collapsed)
            classes.push(moviemasher_js.ClassCollapsed);
        const viewProps = Object.assign(Object.assign({}, rest), { className: classes.join(' ') });
        return (React__default["default"].createElement(ActivityContext.Provider, { value: activityContext },
            React__default["default"].createElement(CollapseContext.Provider, { value: collapseContext },
                React__default["default"].createElement(View, Object.assign({}, viewProps)))));
    }

    const ActivityContentContextDefault = {
        infos: [],
        activityGroup: exports.ActivityGroup.Active,
        id: '',
    };
    const ActivityContentContext = React__default["default"].createContext(ActivityContentContextDefault);

    /**
     * @parents Activity
     * @children ActivityItem
     */
    function ActivityContent(props) {
        const activityContext = React__default["default"].useContext(ActivityContext);
        const panelContext = React__default["default"].useContext(CollapseContext);
        const { collapsed } = panelContext;
        const { activities } = activityContext;
        if (collapsed)
            return null;
        const { children } = props, rest = __rest(props, ["children"]);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child));
        const viewChildren = activities.map(activity => {
            const children = React__default["default"].cloneElement(child);
            const contextProps = { children, value: activity, key: activity.id };
            const context = React__default["default"].createElement(ActivityContentContext.Provider, Object.assign({}, contextProps));
            return context;
        });
        const viewProps = Object.assign(Object.assign({}, rest), { children: viewChildren });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents ActivityContent
     * @children ActivityLabel, ActivityPicked, CollapseControl
     */
    function ActivityItem(props) {
        const { collapsed: collapsedProp } = props, rest = __rest(props, ["collapsed"]);
        const [collapsed, changeCollapsed] = React__default["default"].useState(!!collapsedProp);
        const collapseContext = { collapsed, changeCollapsed };
        return (React__default["default"].createElement(CollapseContext.Provider, { value: collapseContext },
            React__default["default"].createElement(View, Object.assign({}, rest))));
    }

    /**
     * @parents ActivityItem
     */
    function ActivityLabel(props) {
        const collapseContext = React__default["default"].useContext(CollapseContext);
        const { collapsed } = collapseContext;
        const activityContentContext = React__default["default"].useContext(ActivityContentContext);
        const { infos } = activityContentContext;
        const [firstInfo] = infos;
        const labeledInfo = infos.find(info => info.label) || { label: '' };
        const label = labeledInfo.label || firstInfo.type;
        const viewProps = Object.assign({}, props);
        if (collapsed)
            viewProps.children = label;
        else {
            const labels = [label, ...infos.map(info => activityLabel(info))];
            viewProps.children = labels.map((label, i) => React__default["default"].createElement(View, { key: i, children: label }));
        }
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const Problems = {
        child: 'single child element expected',
    };

    /**
     * @parents ActivityContent
     */
    function ActivityPicked(props) {
        const activityContext = React__default["default"].useContext(ActivityContext);
        const { id, children } = props;
        assertActivityGroup(id);
        const { picked } = activityContext;
        if (id !== picked)
            return null;
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child), Problems.child);
        return child;
        // return React.cloneElement(child, { key: id })
    }

    /**
     * @parents ActivityContent
     */
    function ActivityPicker(props) {
        const { id, className, children } = props, rest = __rest(props, ["id", "className", "children"]);
        assertActivityGroup(id);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child), Problems.child);
        const activityContext = React__default["default"].useContext(ActivityContext);
        const { picked, pick } = activityContext;
        const classes = [];
        if (className)
            classes.push(className);
        if (id === picked)
            classes.push(moviemasher_js.ClassSelected);
        const viewProps = Object.assign(Object.assign({}, rest), { className: classes.join(' '), key: `activity-picker-${id}`, onClick: () => pick(id) });
        return React__default["default"].cloneElement(child, viewProps);
    }

    /**
     * @parents Activity
     */
    function ActivityProgress(props) {
        const activityContext = React__default["default"].useContext(ActivityContext);
        const activityContentContext = React__default["default"].useContext(ActivityContentContext);
        const { infos, id } = activityContentContext;
        const elements = [];
        let totalSteps = 0;
        let totalStep = 0;
        if (moviemasher_js.isPopulatedArray(infos)) {
            const [info] = infos;
            const { step, steps } = info;
            if (moviemasher_js.isPositive(step) && moviemasher_js.isAboveZero(steps)) {
                totalStep = step;
                totalSteps = steps;
            }
        }
        else {
            const { allActivities, label } = activityContext;
            if (moviemasher_js.isPopulatedString(label)) {
                elements.push(React__default["default"].createElement("label", { key: "label" }, label));
            }
            const active = allActivities.filter(activityObject => (activityObject.activityGroup === exports.ActivityGroup.Active));
            if (active.length) {
                active.forEach(activityObject => {
                    const { infos } = activityObject;
                    const [info] = infos;
                    moviemasher_js.assertObject(info);
                    const { step, steps } = info;
                    if (moviemasher_js.isPositive(steps))
                        totalSteps += steps;
                    if (moviemasher_js.isPositive(step))
                        totalStep += step;
                });
            }
        }
        if (totalSteps) {
            const progress = totalStep / totalSteps;
            const progressProps = {
                value: progress, max: 1.0,
                children: `${Math.round(100.0 * progress)}%`,
                key: "progress",
            };
            elements.push(React__default["default"].createElement("progress", Object.assign({}, progressProps)));
        }
        const viewProps = Object.assign(Object.assign({}, props), { key: 'activity-progress', children: elements });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function Bar(props) {
        const { before, content, after, props: viewProps = {} } = props;
        if (!(before || content || after))
            return null;
        const children = [before, content, after].filter(Boolean);
        viewProps.children = children;
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const panelOptionsStrict = (options) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        options.header || (options.header = {});
        (_a = options.header).props || (_a.props = {});
        (_b = options.header.props).key || (_b.key = 'header');
        (_c = options.header.props).className || (_c.className = 'head');
        options.content || (options.content = {});
        (_d = options.content).props || (_d.props = {});
        (_e = options.content.props).key || (_e.key = 'content');
        (_f = options.content.props).className || (_f.className = 'content');
        options.footer || (options.footer = {});
        (_g = options.footer).props || (_g.props = {});
        (_h = options.footer.props).key || (_h.key = 'footer');
        (_j = options.footer.props).className || (_j.className = 'foot');
        options.props || (options.props = {});
        moviemasher_js.assertPopulatedObject(options.icons);
        return options;
    };
    function Panel(props) {
        const { children, className, collapsed: collapsedProp } = props;
        const [collapsed, changeCollapsed] = React__default["default"].useState(!!collapsedProp);
        const classes = [];
        if (className)
            classes.push(className);
        if (collapsed)
            classes.push('collapsed');
        const viewProps = { children, className: classes.join(' ') };
        const collapseContext = { collapsed, changeCollapsed };
        return React__default["default"].createElement(CollapseContext.Provider, { value: collapseContext },
            React__default["default"].createElement(View, Object.assign({}, viewProps)));
    }

    function PanelFoot(props) {
        const panelContext = React__default["default"].useContext(CollapseContext);
        const { collapsed } = panelContext;
        if (collapsed)
            return null;
        const { before, content, after, props: viewProps = {} } = props;
        if (!(before || content || after))
            return null;
        const children = [before, content, after].filter(Boolean);
        viewProps.children = children;
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function CollapseControl(props) {
        const panelContext = React__default["default"].useContext(CollapseContext);
        const { collapsed, changeCollapsed: setCollapsed } = panelContext;
        const viewProps = Object.assign(Object.assign({}, props), { onClick: () => { setCollapsed(!collapsed); } });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function NotCollapsed(props) {
        const panelContext = React__default["default"].useContext(CollapseContext);
        if (panelContext.collapsed)
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    function Collapsed(props) {
        const panelContext = React__default["default"].useContext(CollapseContext);
        if (!panelContext.collapsed)
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    const ActivityPropsDefault = function (props = {}) {
        var _a, _b, _c, _d, _e, _f;
        const optionsStrict = panelOptionsStrict(props);
        const { icons } = optionsStrict;
        (_a = optionsStrict.props).key || (_a.key = 'activity');
        (_b = optionsStrict.props).className || (_b.className = 'panel activity');
        (_c = optionsStrict.props).initialPicked || (_c.initialPicked = exports.ActivityGroup.Active);
        if (moviemasher_js.isUndefined(optionsStrict.props.initialCollapsed))
            optionsStrict.props.initialCollapsed = true;
        (_d = optionsStrict.header).content || (_d.content = [
            icons.activity,
            React__default["default"].createElement(NotCollapsed, { key: "not-collapsed" },
                React__default["default"].createElement(View, { key: "view" })),
            React__default["default"].createElement(Collapsed, { key: "collapsed" },
                React__default["default"].createElement(ActivityProgress, { key: "progress", className: 'progress' })),
            React__default["default"].createElement(CollapseControl, { key: "collapse-control" },
                React__default["default"].createElement(NotCollapsed, { key: "not-collapsed", children: icons.collapse }),
                React__default["default"].createElement(Collapsed, { key: "collapsed", children: icons.collapsed }))
        ]);
        (_e = optionsStrict.content).children || (_e.children = React__default["default"].createElement(ActivityItem, { className: 'item', collapsed: true },
            React__default["default"].createElement(CollapseControl, { key: "collapse-control" },
                React__default["default"].createElement(NotCollapsed, { key: "not-collapsed", children: icons.collapse }),
                React__default["default"].createElement(Collapsed, { key: "collapsed", children: icons.collapsed })),
            React__default["default"].createElement(ActivityLabel, { key: "label", className: "label" }),
            React__default["default"].createElement(ActivityPicked, { key: "active", id: "active" },
                React__default["default"].createElement(ActivityProgress, { key: "progress" })),
            React__default["default"].createElement(ActivityPicked, { key: "error", id: "error", children: icons.error }),
            React__default["default"].createElement(ActivityPicked, { key: "complete", id: "complete", children: icons.complete })));
        (_f = optionsStrict.footer).content || (_f.content = [
            React__default["default"].createElement(ActivityPicker, { key: 'active', id: 'active', className: moviemasher_js.ClassButton, children: icons.active }),
            React__default["default"].createElement(ActivityPicker, { key: 'error', id: 'error', className: moviemasher_js.ClassButton, children: icons.error }),
            React__default["default"].createElement(ActivityPicker, { key: 'complete', id: 'complete', className: moviemasher_js.ClassButton, children: icons.complete }),
        ]);
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.header)),
            React__default["default"].createElement(ActivityContent, Object.assign({}, optionsStrict.content.props), optionsStrict.content.children),
            React__default["default"].createElement(PanelFoot, Object.assign({}, optionsStrict.footer)));
        return Object.assign(Object.assign({}, optionsStrict.props), { children });
    };

    const ApiContextDefault = {
        enabled: false,
        servers: {},
        endpointPromise: () => Promise.resolve({})
    };
    const ApiContext = React__default["default"].createContext(ApiContextDefault);

    function ApiClient(props) {
        const { endpoint: end, children, path } = props;
        const endpoint = end || moviemasher_js.urlEndpoint({ prefix: path || moviemasher_js.Endpoints.api.callbacks });
        const [callbacks, setCallbacks] = React__default["default"].useState(() => ({ [moviemasher_js.Endpoints.api.callbacks]: { endpoint } }));
        const [servers, setServers] = React__default["default"].useState(() => ({}));
        const endpointPromise = (id, body) => {
            return serverPromise(id).then(endpointResponse => {
                // console.debug("ApiClient.endpointPromise.serverPromise", id, endpointResponse)
                if (moviemasher_js.isPopulatedObject(body)) {
                    endpointResponse.request || (endpointResponse.request = {});
                    endpointResponse.request.body = Object.assign({ version: moviemasher_js.ApiVersion }, body);
                }
                return moviemasher_js.fetchCallback(endpointResponse);
            });
        };
        const serverPromise = (id) => {
            // console.debug("ApiClient.serverPromise", id, endpoint)
            const previousResponse = callbacks[id];
            if (previousResponse) {
                // TODO: check for expires...
                return Promise.resolve(previousResponse);
            }
            const request = { id, version: moviemasher_js.ApiVersion };
            const promiseCallback = {
                endpoint, request: { body: request }
            };
            // console.debug("ApiCallbacksRequest", endpoint, request)
            return moviemasher_js.fetchCallback(promiseCallback).then((response) => {
                // console.debug("ApiCallbacksResponse", endpoint, response)
                const { apiCallbacks } = response;
                setCallbacks(servers => (Object.assign(Object.assign({}, servers), apiCallbacks)));
                return apiCallbacks[id];
            });
        };
        React__default["default"].useEffect(() => {
            const request = {};
            // console.debug("ApiServersRequest", request)
            endpointPromise(moviemasher_js.Endpoints.api.servers, request).then((response) => {
                var _a;
                // console.debug("ApiServersResponse", response)
                if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.temporaryIdPrefix)
                    moviemasher_js.idPrefixSet(response.data.temporaryIdPrefix);
                setServers(response);
            });
        }, []);
        const apiContext = {
            enabled: true, endpointPromise, servers
        };
        return (React__default["default"].createElement(ApiContext.Provider, { value: apiContext }, children));
    }

    function ApiEnabled(props) {
        const apiContext = React__default["default"].useContext(ApiContext);
        const { enabled } = apiContext;
        if (!enabled)
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    const ViewerContextDefault = {
        width: 0,
        height: 0,
        videoRate: 0,
        streaming: false,
        updating: false,
        preloading: false,
        setPreloading: () => { },
        setStreaming: () => { },
        setWidth: () => { },
        setHeight: () => { },
        setVideoRate: () => { },
        setUpdating: () => { },
        setId: () => { },
        id: '',
        setUrl: () => { },
        url: '',
    };
    const ViewerContext = React__default["default"].createContext(ViewerContextDefault);

    /**
     * @parents Masher
     * @children StreamerContent, StreamerControl, StreamerPreloadControl, StreamerUpdateControl
     */
    function Broadcaster(props) {
        const [streaming, setStreaming] = React__default["default"].useState(false);
        const [preloading, setPreloading] = React__default["default"].useState(false);
        const [updating, setUpdating] = React__default["default"].useState(false);
        const [id, setId] = React__default["default"].useState('');
        const [url, setUrl] = React__default["default"].useState('');
        const [width, setWidth] = React__default["default"].useState(0);
        const [height, setHeight] = React__default["default"].useState(0);
        const [videoRate, setVideoRate] = React__default["default"].useState(0);
        const context = {
            updating, setUpdating,
            videoRate, setVideoRate,
            height, setHeight,
            width, setWidth,
            url, setUrl,
            streaming,
            setStreaming,
            preloading, setPreloading,
            id, setId,
        };
        return (React__default["default"].createElement(ViewerContext.Provider, { value: context },
            React__default["default"].createElement(View, Object.assign({}, props))));
    }

    const ProcessContextDefault = {
        error: '',
        processing: false,
        progress: 0,
        setError: () => { },
        setProcessing: () => { },
        setProgress: () => { },
        setStatus: () => { },
        status: '',
    };
    const ProcessContext = React__default["default"].createContext(ProcessContextDefault);

    function BroadcasterControl(props) {
        const processContext = React__default["default"].useContext(ProcessContext);
        const apiContext = React__default["default"].useContext(ApiContext);
        const viewerContext = React__default["default"].useContext(ViewerContext);
        const { setProcessing, processing, setStatus } = processContext;
        const [disabled, setDisabled] = React__default["default"].useState(processing);
        const { endpointPromise } = apiContext;
        const { setStreaming, setId, setUrl, setWidth, setHeight, setVideoRate } = viewerContext;
        const startStreaming = () => {
            const request = {};
            console.debug("StreamingStartRequest", moviemasher_js.Endpoints.streaming.start, request);
            endpointPromise(moviemasher_js.Endpoints.streaming.start, request).then((response) => {
                console.debug("StreamingStartResponse", moviemasher_js.Endpoints.streaming.start, response);
                setStatus(`Started stream`);
                const { id, readySeconds, width, height, videoRate } = response;
                setId(id);
                setWidth(width);
                setHeight(height);
                setVideoRate(videoRate);
                const monitorStream = () => {
                    setTimeout(() => {
                        const request = { id };
                        console.debug('StreamingStatusRequest', moviemasher_js.Endpoints.streaming.status, request);
                        endpointPromise(moviemasher_js.Endpoints.streaming.status, request).then((response) => {
                            console.debug("StreamingStatusResponse", moviemasher_js.Endpoints.streaming.status, response);
                            const { streamUrl } = response;
                            if (streamUrl) {
                                setUrl(streamUrl);
                                setStreaming(true);
                                setProcessing(true);
                                setStatus(`Streaming`);
                            }
                            else
                                monitorStream();
                        });
                    }, 1000 * readySeconds);
                };
                monitorStream();
            });
        };
        const onClick = () => {
            if (disabled)
                return;
            setDisabled(true);
            startStreaming();
        };
        const viewProps = Object.assign(Object.assign({}, props), { onClick, disabled });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const useEditor = () => React__default["default"].useContext(MasherContext).editor;

    function BroadcasterContent(props) {
        const viewerContext = React__default["default"].useContext(ViewerContext);
        const editor = useEditor();
        const { rect } = editor;
        const { url, streaming } = viewerContext;
        if (!(streaming && url))
            return React__default["default"].createElement(View, Object.assign({}, props));
        const videoProps = Object.assign(Object.assign(Object.assign({}, moviemasher_js.sizeCopy(rect)), props), { autoPlay: true });
        return React__default["default"].createElement("video", Object.assign({ src: url }, videoProps));
    }

    function BroadcasterPreloadControl(props) {
        const processContext = React__default["default"].useContext(ProcessContext);
        const apiContext = React__default["default"].useContext(ApiContext);
        const viewerContext = React__default["default"].useContext(ViewerContext);
        const { id, setPreloading, preloading, updating, streaming } = viewerContext;
        const { setStatus } = processContext;
        const { endpointPromise } = apiContext;
        const preload = () => {
            const files = [];
            const request = { files, id };
            setStatus(`Preloading...`);
            console.debug("StreamingPreloadRequest", moviemasher_js.Endpoints.streaming.preload, request);
            endpointPromise(moviemasher_js.Endpoints.streaming.preload, request).then((response) => {
                console.debug("StreamingPreloadResponse", moviemasher_js.Endpoints.streaming.preload, response);
                setStatus(`Preloaded`);
                setPreloading(false);
            });
        };
        const disabled = preloading || updating || !streaming;
        const onClick = () => {
            if (disabled)
                return;
            setPreloading(true);
            preload();
        };
        const viewProps = Object.assign(Object.assign({}, props), { onClick, disabled });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function BroadcasterUpdateControl(props) {
        const editor = useEditor();
        const processContext = React__default["default"].useContext(ProcessContext);
        const apiContext = React__default["default"].useContext(ApiContext);
        const viewerContext = React__default["default"].useContext(ViewerContext);
        const { updating, setUpdating, streaming, preloading, id } = viewerContext;
        const { setStatus } = processContext;
        const { endpointPromise } = apiContext;
        const update = () => {
            const { edited, definitions } = editor;
            moviemasher_js.assertCast(edited);
            const { mashes } = edited;
            const definitionObjects = definitions.map(definition => definition.toJSON());
            const mashObjects = mashes.map(mash => mash.toJSON());
            const request = { definitionObjects, mashObjects, id };
            console.debug('StreamingCutRequest', moviemasher_js.Endpoints.streaming.cut, request);
            setStatus(`Updating stream`);
            endpointPromise(moviemasher_js.Endpoints.streaming.cut, request).then((response) => {
                console.debug("StreamingCutResponse", moviemasher_js.Endpoints.streaming.cut, response);
                setStatus(`Updated stream`);
                setUpdating(false);
            });
        };
        const disabled = updating || preloading || !streaming;
        const onClick = () => {
            if (disabled)
                return;
            setUpdating(true);
            update();
        };
        const viewProps = Object.assign(Object.assign({}, props), { onClick, disabled });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const BrowserContextDefault = {
        addPicker: moviemasher_js.EmptyMethod,
        definitions: [],
        pick: moviemasher_js.EmptyMethod,
        picked: '',
        removePicker: moviemasher_js.EmptyMethod,
    };
    const BrowserContext = React__default["default"].createContext(BrowserContextDefault);

    const EditorDefinitionsEventAdded = moviemasher_js.EventType.Added;
    const EditorDefinitionsEventResize = moviemasher_js.EventType.Resize;
    const useEditorDefinitions = (types = []) => {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { editor } = masherContext;
        moviemasher_js.assertDefined(editor);
        const storeRef = React__default["default"].useRef({});
        const { eventTarget } = editor;
        const snapshotInitialize = () => {
            const lists = types.map(type => moviemasher_js.Defined.byType(type));
            return lists.length === 1 ? lists[0] : lists.flat();
        };
        const snapshotGet = () => {
            var _a;
            const key = types.join('-') || 'empty';
            return (_a = storeRef.current)[key] || (_a[key] = snapshotInitialize());
        };
        const handleEvent = (event) => {
            const { type } = event;
            if (moviemasher_js.isEventType(type) && (event instanceof CustomEvent)) {
                const { detail } = event;
                const { definitionTypes } = detail;
                if (moviemasher_js.isPopulatedArray(definitionTypes)) {
                    const types = definitionTypes;
                    const { current } = storeRef;
                    const allIds = Object.keys(current);
                    const ids = allIds.filter(id => types.some(type => id.includes(type)));
                    ids.forEach(id => delete current[id]);
                }
            }
        };
        const externalStore = React__default["default"].useSyncExternalStore((callback) => {
            eventTarget.addEventListener(EditorDefinitionsEventAdded, callback);
            eventTarget.addEventListener(EditorDefinitionsEventResize, callback);
            return () => {
                eventTarget.removeEventListener(EditorDefinitionsEventAdded, callback);
                eventTarget.removeEventListener(EditorDefinitionsEventResize, callback);
            };
        }, snapshotGet);
        const removeListener = () => {
            eventTarget.removeEventListener(EditorDefinitionsEventAdded, handleEvent);
        };
        const addListener = () => {
            eventTarget.addEventListener(EditorDefinitionsEventAdded, handleEvent);
            return () => { removeListener(); };
        };
        React__default["default"].useEffect(() => addListener(), []);
        return [editor, externalStore];
    };

    const ApiDefinitionsEvent = 'api-definitions';
    const ApiDefinitionsDisabled = 'disabled';
    const ApiDefinitionsEmpty = 'empty';
    const useApiDefinitions = (types = []) => {
        const apiContext = React__default["default"].useContext(ApiContext);
        const masherContext = React__default["default"].useContext(MasherContext);
        const { enabled, servers, endpointPromise } = apiContext;
        const { editor } = masherContext;
        moviemasher_js.assertDefined(editor);
        const storeRef = React__default["default"].useRef({});
        const { eventTarget } = editor;
        const definitionsPromise = (key) => {
            const request = { types };
            console.debug("DataDefinitionRetrieveRequest", moviemasher_js.Endpoints.data.definition.retrieve, request);
            return endpointPromise(moviemasher_js.Endpoints.data.definition.retrieve, request).then((response) => {
                console.debug("DataDefinitionRetrieveResponse", moviemasher_js.Endpoints.data.definition.retrieve, response);
                const { definitions } = response;
                const array = storeRef.current[key];
                array.push(...definitions.map(def => moviemasher_js.DefinitionBase.fromObject(def)));
                eventTarget.dispatchEvent(new CustomEvent(ApiDefinitionsEvent));
            });
        };
        const snapshotInitialize = (key) => {
            switch (key) {
                case ApiDefinitionsEmpty:
                case ApiDefinitionsDisabled: break;
                default: definitionsPromise(key);
            }
            return [];
        };
        const currentKey = () => {
            if (!(enabled && servers[moviemasher_js.ServerType.Data]))
                return ApiDefinitionsDisabled;
            if (!types.length)
                return ApiDefinitionsEmpty;
            return types.join('-');
        };
        const snapshotGet = () => {
            const key = currentKey();
            const array = storeRef.current[key];
            if (array)
                return array;
            // console.log("useApiDefinitions defining", key)
            return storeRef.current[key] = snapshotInitialize(key);
        };
        const externalStore = React__default["default"].useSyncExternalStore((callback) => {
            eventTarget.addEventListener(ApiDefinitionsEvent, callback);
            return () => {
                eventTarget.removeEventListener(ApiDefinitionsEvent, callback);
            };
        }, snapshotGet);
        return [editor, externalStore];
    };

    const useDefinitions = (types = []) => {
        const [editor, editorDefinitions] = useEditorDefinitions(types);
        const [_, apiDefinitions] = useApiDefinitions(types);
        const definitions = apiDefinitions.filter(apiDefinition => !editorDefinitions.some(editorDefinition => editorDefinition.id === apiDefinition.id));
        const combined = [...editorDefinitions, ...definitions];
        // console.log("useDefinitions", combined.length, types.join(', '))
        return [editor, combined];
    };

    /**
     * @parents Masher
     * @children BrowserContent, BrowserPicker
     */
    function Browser(props) {
        const { initialPicked = 'container' } = props, rest = __rest(props, ["initialPicked"]);
        const [typesObject, setTypesObject] = React__default["default"].useState({});
        const editorContext = React__default["default"].useContext(MasherContext);
        const { changeDefinition } = editorContext;
        const [picked, setPicked] = React__default["default"].useState(initialPicked);
        const pick = (id) => {
            moviemasher_js.assertPopulatedString(id);
            changeDefinition();
            setPicked(id);
        };
        const [_, definitions] = useDefinitions(typesObject[picked]);
        const addPicker = (id, types) => {
            setTypesObject(original => (Object.assign(Object.assign({}, original), { [id]: types })));
        };
        const removePicker = (id) => {
            setTypesObject(original => (Object.assign(Object.assign({}, original), { [id]: [] })));
        };
        const browserContext = {
            definitions,
            picked,
            pick,
            addPicker,
            removePicker,
        };
        const contextProps = {
            value: browserContext,
            children: React__default["default"].createElement(View, Object.assign({}, rest))
        };
        return (React__default["default"].createElement(BrowserContext.Provider, Object.assign({}, contextProps)));
    }

    const DefinitionContextDefault = {};
    const DefinitionContext = React__default["default"].createContext(DefinitionContextDefault);

    const DragSuffix = '/x-moviemasher';
    const isDragOffsetObject = (value) => {
        return moviemasher_js.isObject(value) && "offset" in value;
    };
    function assertDragOffsetObject(value) {
        if (!isDragOffsetObject(value))
            moviemasher_js.throwError(value, 'DragOffsetObject');
    }
    const isDragDefinitionObject = (value) => {
        return isDragOffsetObject(value) && "definitionObject" in value;
    };
    function assertDragDefinitionObject(value) {
        if (!isDragDefinitionObject(value))
            moviemasher_js.throwError(value, 'DragDefinitionObject');
    }
    exports.DragType = void 0;
    (function (DragType) {
        DragType["Mash"] = "mash";
        DragType["Layer"] = "layer";
        DragType["Track"] = "track";
    })(exports.DragType || (exports.DragType = {}));
    const DragTypes = Object.values(exports.DragType);
    const isDragType = (value) => (moviemasher_js.isString(value) && DragTypes.includes(value));
    const TransferTypeFiles = "Files";
    const isTransferType = (value) => {
        return moviemasher_js.isString(value) && value.endsWith(DragSuffix);
    };
    // 
    const dropType = (dataTransfer) => {
        if (!dataTransfer)
            return;
        return dataTransfer.types.find(isTransferType);
    };
    const dragDefinitionType = (transferType) => {
        const [type] = transferType.split('/');
        moviemasher_js.assertDefinitionType(type);
        return type;
    };
    const dragType = (dataTransfer) => {
        const prefix = dropType(dataTransfer);
        if (!prefix)
            return;
        const [type] = prefix.split('/');
        if (isDragType(type) || moviemasher_js.isDefinitionType(type))
            return type;
    };
    const dragTypes = (dataTransfer) => {
        const { types } = dataTransfer;
        return types.filter(type => (type === TransferTypeFiles || isTransferType(type)));
    };
    const dragData = (dataTransfer, type) => {
        const transferType = type ? `${type}${DragSuffix}` : dragTypes(dataTransfer).find(isTransferType);
        if (!transferType)
            return {};
        const json = dataTransfer.getData(transferType);
        // console.log("dragData", json, type, transferType)
        const data = json ? JSON.parse(json) : {};
        return data;
    };
    const DragElementRect = (current) => current.getBoundingClientRect();
    const DragElementPoint = (event, current) => {
        const rect = (current instanceof Element) ? DragElementRect(current) : current;
        const { x, y } = rect;
        const { clientY, clientX } = event;
        return { x: clientX - x, y: clientY - y };
    };
    const dropFilesFromList = (files, serverOptions = {}) => {
        const infos = [];
        const { length } = files;
        if (!length)
            return infos;
        const exists = moviemasher_js.isPopulatedObject(serverOptions);
        const { extensions = {}, uploadLimits = {} } = serverOptions;
        const extensionsByType = extensions;
        const limitsByType = uploadLimits;
        for (let i = 0; i < length; i++) {
            const file = files.item(i);
            if (!file)
                continue;
            const { name, size, type } = file;
            const coreType = type.split('/').shift();
            if (!moviemasher_js.isUploadType(coreType)) {
                infos.push({ label: name, value: coreType, error: 'import.type' });
                continue;
            }
            const max = limitsByType[coreType];
            if (exists && !(moviemasher_js.isAboveZero(max) && max * 1024 * 1024 > size)) {
                infos.push({ label: name, value: `${max}MB`, error: 'import.bytes' });
                continue;
            }
            const ext = name.toLowerCase().split('.').pop();
            const extDefined = moviemasher_js.isPopulatedString(ext);
            const exts = extensionsByType[coreType];
            if (exists || !extDefined) {
                if (!(extDefined && moviemasher_js.isArray(exts) && exts.includes(ext))) {
                    infos.push({ label: name, value: ext, error: 'import.extension' });
                    continue;
                }
            }
            infos.push(file);
        }
        return infos;
    };
    const droppingPositionClass = (droppingPosition) => {
        if (moviemasher_js.isUndefined(droppingPosition))
            return '';
        switch (droppingPosition) {
            case moviemasher_js.DroppingPosition.After: return moviemasher_js.ClassDroppingAfter;
            case moviemasher_js.DroppingPosition.Before: return moviemasher_js.ClassDroppingBefore;
            case moviemasher_js.DroppingPosition.None: return '';
        }
        return moviemasher_js.ClassDropping;
    };

    /**
     * @parents Browser
     * @children BrowserSource
     */
    function BrowserContent(props) {
        const [over, setOver] = React__default["default"].useState(false);
        const { className, children } = props, rest = __rest(props, ["className", "children"]);
        const editorContext = React__default["default"].useContext(MasherContext);
        const browserContext = React__default["default"].useContext(BrowserContext);
        const definitions = browserContext.definitions || [];
        const { drop } = editorContext;
        const dragValid = (dataTransfer) => {
            if (!dataTransfer)
                return false;
            return dragTypes(dataTransfer).includes(TransferTypeFiles);
        };
        const onDrop = (event) => {
            onDragLeave(event);
            const { dataTransfer } = event;
            if (dragValid(dataTransfer))
                drop(dataTransfer.files);
        };
        const onDragOver = (event) => {
            moviemasher_js.eventStop(event);
            setOver(dragValid(event.dataTransfer));
        };
        const onDragLeave = (event) => {
            moviemasher_js.eventStop(event);
            setOver(false);
        };
        const classes = [];
        if (className)
            classes.push(className);
        if (over)
            classes.push(moviemasher_js.ClassDropping);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child));
        const childNodes = () => {
            const childProps = child.props;
            return definitions.map(definition => {
                const cloneProps = Object.assign(Object.assign({}, childProps), { key: definition.id });
                const children = React__default["default"].cloneElement(child, cloneProps);
                const contextProps = { children, value: { definition }, key: definition.id };
                const context = React__default["default"].createElement(DefinitionContext.Provider, Object.assign({}, contextProps));
                return context;
            });
        };
        const viewProps = Object.assign(Object.assign({}, rest), { className: classes.join(' '), key: `browser-content`, children: childNodes(), onDrop, onDragOver, onDragLeave });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const propsStringArray = (string, array, properties) => {
        if (string)
            return [string];
        if (!array)
            return properties ? properties.map(property => property.name) : [];
        if (moviemasher_js.isString(array))
            return array.split(',').map(string => string.trim());
        return array;
    };
    const propsDefinitionTypes = (type, types, id) => {
        const strings = propsStringArray(type, types);
        if (id && !strings.length)
            strings.push(id);
        const validStrings = strings.filter(string => moviemasher_js.isDefinitionType(string));
        return validStrings.map(string => string);
    };
    const propsSelectTypes = (type, types, id) => {
        const strings = propsStringArray(type, types);
        if (id && !strings.length)
            strings.push(id);
        const validStrings = strings.filter(string => moviemasher_js.isSelectType(string));
        return validStrings.map(string => string);
    };

    /**
     * @parents Browser
     */
    function BrowserPicker(props) {
        const { children, type, types, className, id } = props, rest = __rest(props, ["children", "type", "types", "className", "id"]);
        moviemasher_js.assertPopulatedString(id);
        const browserContext = React__default["default"].useContext(BrowserContext);
        const { pick, picked, addPicker, removePicker } = browserContext;
        const classes = [];
        if (className)
            classes.push(className);
        if (picked === id)
            classes.push(moviemasher_js.ClassSelected);
        React__default["default"].useEffect(() => {
            addPicker(id, propsDefinitionTypes(type, types, id));
            return () => { removePicker(id); };
        }, []);
        const viewProps = Object.assign(Object.assign({}, rest), { className: classes.join(' '), key: `browser-picker-${id}`, onClick: () => { pick(id); } });
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child), Problems.child);
        return React__default["default"].cloneElement(child, viewProps);
    }

    const BrowserControlId = 'upload-control-id';
    function BrowserControl(props) {
        const { children } = props, rest = __rest(props, ["children"]);
        const fileInput = React__default["default"].useRef(null);
        const apiContext = React__default["default"].useContext(ApiContext);
        const editorContext = React__default["default"].useContext(MasherContext);
        const { servers } = apiContext;
        const { drop } = editorContext;
        const onChange = (event) => {
            const { files } = event.currentTarget;
            if (files)
                drop(files);
        };
        const { file = {} } = servers;
        const { extensions = Object.fromEntries(moviemasher_js.UploadTypes.map(type => [type, []])) } = file;
        moviemasher_js.assertObject(extensions);
        const accept = Object.entries(extensions).flatMap(([uploadType, noDots]) => {
            return [`${uploadType}/*`, ...noDots.map((noDot) => `.${noDot}`)];
        }).join(',');
        const inputProps = Object.assign({ accept, id: BrowserControlId, onChange, type: 'file', key: 'browser-control-input', ref: fileInput }, rest);
        const input = React__default["default"].createElement("input", Object.assign({}, inputProps));
        if (!React__default["default"].isValidElement(children))
            return input;
        const kids = [React__default["default"].Children.only(children), input];
        const labelProps = {
            children: kids,
            key: 'browser-control',
            htmlFor: BrowserControlId
        };
        return React__default["default"].createElement("label", Object.assign({}, labelProps));
    }

    const useDefinition = () => React__default["default"].useContext(DefinitionContext).definition;

    /**
     * @parents BrowserContent, DefinitionDrop
     */
    function DefinitionItem(props) {
        const { className, iconRatio } = props, rest = __rest(props, ["className", "iconRatio"]);
        const ratio = iconRatio || 0.25;
        const svgRef = React__default["default"].useRef(null);
        const viewRef = React__default["default"].useRef(null);
        const editorContext = React__default["default"].useContext(MasherContext);
        const { editor, definition: selectedDefinition, changeDefinition } = editorContext;
        moviemasher_js.assertTrue(editor);
        const definition = useDefinition();
        const { id, label, type } = definition;
        const updateRef = () => __awaiter(this, void 0, void 0, function* () {
            const { rect, preloader } = editor;
            const { current } = svgRef;
            if (!(current && moviemasher_js.sizeAboveZero(rect)))
                return;
            const scaled = moviemasher_js.sizeCeil(moviemasher_js.sizeScale(moviemasher_js.sizeCopy(rect), ratio, ratio));
            const element = yield definition.definitionIcon(preloader, scaled);
            if (element)
                current.replaceChildren(element);
        });
        React__default["default"].useEffect(() => { updateRef(); }, []);
        if (svgRef.current)
            updateRef();
        const childNodes = () => {
            const nodes = [React__default["default"].createElement(View, { key: "icon", ref: svgRef })];
            if (label)
                nodes.unshift(React__default["default"].createElement("label", { key: 'label' }, label));
            return nodes;
        };
        const onPointerDown = (event) => {
            event.stopPropagation();
            changeDefinition(definition);
        };
        const onDragStart = (event) => {
            onPointerDown(event);
            const rect = viewRef.current.getBoundingClientRect();
            const { left } = rect;
            const { clientX } = event;
            const data = { offset: clientX - left, definitionObject: definition };
            const json = JSON.stringify(data);
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            dataTransfer.effectAllowed = 'copy';
            // console.log("DefinitionItem.onDragStart", definition.type + DragSuffix, json)
            dataTransfer.setData(definition.type + DragSuffix, json);
        };
        const calculateClassName = () => {
            const classes = [];
            if (className)
                classes.push(className);
            if ((selectedDefinition === null || selectedDefinition === void 0 ? void 0 : selectedDefinition.id) === id)
                classes.push(moviemasher_js.ClassSelected);
            return classes.join(' ');
        };
        const viewProps = Object.assign(Object.assign({}, rest), { className, children: childNodes(), ref: viewRef, key: id });
        if (props.draggable) {
            viewProps.onDragStart = onDragStart;
            viewProps.onPointerDown = onPointerDown;
            viewProps.className = calculateClassName();
        }
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const BrowserPropsDefault = function (props = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const optionsStrict = panelOptionsStrict(props);
        const { icons } = optionsStrict;
        (_a = optionsStrict.props).key || (_a.key = 'browser');
        (_b = optionsStrict.props).className || (_b.className = 'panel browser');
        (_c = optionsStrict.props).initialPicked || (_c.initialPicked = 'container');
        (_d = optionsStrict.header).content || (_d.content = [icons.browser]);
        (_e = optionsStrict.footer).content || (_e.content = [
            React__default["default"].createElement(BrowserPicker, { key: 'effect', id: 'effect', className: moviemasher_js.ClassButton, children: icons.browserEffect }),
            React__default["default"].createElement(BrowserPicker, { key: 'container', id: 'container', className: moviemasher_js.ClassButton, children: icons.container }),
            React__default["default"].createElement(BrowserPicker, { key: 'content', id: 'content', className: moviemasher_js.ClassButton, children: icons.content }),
        ]);
        (_f = optionsStrict.footer).before || (_f.before = [
            React__default["default"].createElement(BrowserPicker, { key: 'video', id: 'video', types: 'video,videosequence', className: moviemasher_js.ClassButton, children: icons.browserVideo }),
            React__default["default"].createElement(BrowserPicker, { key: 'audio', id: 'audio', className: moviemasher_js.ClassButton, children: icons.browserAudio }),
            React__default["default"].createElement(BrowserPicker, { key: 'image', id: 'image', className: moviemasher_js.ClassButton, children: icons.browserImage }),
        ]);
        (_g = optionsStrict.footer).after || (_g.after = [
            React__default["default"].createElement(BrowserControl, { key: 'import', children: icons.import })
        ]);
        (_h = optionsStrict.content).children || (_h.children = React__default["default"].createElement(DefinitionItem, { draggable: true, className: 'definition preview' }));
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.header)),
            React__default["default"].createElement(BrowserContent, Object.assign({}, optionsStrict.content.props), optionsStrict.content.children),
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.footer)));
        return Object.assign(Object.assign({}, optionsStrict.props), { children });
    };

    const ClipContextDefault = {
        prevClipEnd: 0
    };
    const ClipContext = React__default["default"].createContext(ClipContextDefault);

    const TrackContextDefault = {};
    const TrackContext = React__default["default"].createContext(TrackContextDefault);

    const TimelineContextDefault = {
        dragTypeValid() { return false; },
        frame: 0,
        frames: 0,
        onDragLeave: moviemasher_js.EmptyMethod,
        onDrop: moviemasher_js.EmptyMethod,
        rect: moviemasher_js.RectZero,
        refreshed: 0, refresh: moviemasher_js.EmptyMethod,
        scale: 0,
        scroll: { x: 0, y: 0 },
        setDroppingClip: moviemasher_js.EmptyMethod,
        setDroppingPosition: moviemasher_js.EmptyMethod,
        setDroppingTrack: moviemasher_js.EmptyMethod,
        setRect: moviemasher_js.EmptyMethod,
        setScroll: moviemasher_js.EmptyMethod,
        setZoom: moviemasher_js.EmptyMethod,
        zoom: 1,
    };
    const TimelineContext = React__default["default"].createContext(TimelineContextDefault);

    const LayerContextDefault = { depth: 0 };
    const LayerContext = React__default["default"].createContext(LayerContextDefault);

    const useLayer = () => React__default["default"].useContext(LayerContext).layer;

    const useListeners = (events, target) => {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { editor } = masherContext;
        const eventTarget = target || editor.eventTarget;
        const handleEvent = (event) => {
            const { type } = event;
            const handler = events[type];
            if (handler)
                handler(event);
        };
        const removeListeners = () => {
            const keys = Object.keys(events);
            // console.log("useListeners.removeListeners", keys)
            keys.forEach(eventType => {
                eventTarget.removeEventListener(eventType, handleEvent);
            });
        };
        const addListeners = () => {
            Object.keys(events).forEach(eventType => {
                eventTarget.addEventListener(eventType, handleEvent);
            });
            return () => { removeListeners(); };
        };
        React__default["default"].useEffect(() => addListeners(), []);
    };

    const ClipItemRefreshRate = 500;
    /**
     * @parents TimelineTrack
     */
    function ClipItem(props) {
        const { className } = props, rest = __rest(props, ["className"]);
        const svgRef = React__default["default"].useRef(null);
        const viewRef = React__default["default"].useRef(null);
        const editor = useEditor();
        const trackContext = React__default["default"].useContext(TrackContext);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const [nonce, setNonce] = React__default["default"].useState(0);
        const updateNonce = () => { setNonce(new Date().valueOf()); };
        const watchingRef = React__default["default"].useRef({});
        const { current: watching } = watchingRef;
        const clipContext = React__default["default"].useContext(ClipContext);
        const { droppingPosition, droppingClip, scale, selectedClip, onDrop, dragTypeValid, setDroppingPosition, setDroppingClip, setDroppingTrack, onDragLeave, } = timelineContext;
        const { track } = trackContext;
        const { clip, prevClipEnd } = clipContext;
        moviemasher_js.assertTrue(clip);
        const backgroundNode = (fill, size, spacing) => {
            const rgb = moviemasher_js.colorToRgb(fill);
            const differenceRgb = moviemasher_js.colorRgbDifference(rgb);
            const forecolor = moviemasher_js.colorFromRgb(differenceRgb);
            const framePolygon = moviemasher_js.svgPolygonElement(size, '', fill);
            const spaceRect = {
                x: size.width, y: 0,
                width: spacing, height: size.height,
            };
            const spacePolygon = moviemasher_js.svgPolygonElement(spaceRect, '', forecolor);
            const patternSize = {
                width: size.width + spacing, height: size.height
            };
            const patternId = moviemasher_js.idGenerate('pattern');
            const patternItems = [framePolygon, spacePolygon];
            const pattern = moviemasher_js.svgPatternElement(patternSize, patternId, patternItems);
            const defsElement = moviemasher_js.svgDefsElement([pattern]);
            const patternedSize = { width: timelineContext.rect.width, height: parentHeight };
            const patternedPolygon = moviemasher_js.svgPolygonElement(patternedSize, '', moviemasher_js.svgUrl(patternId));
            return moviemasher_js.svgElement(patternedSize, [defsElement, patternedPolygon]);
        };
        const getParentHeight = () => {
            const { current } = svgRef;
            const parent = current === null || current === void 0 ? void 0 : current.parentNode;
            if (parent instanceof HTMLDivElement) {
                return parent.offsetHeight; // .getBoundingClientRect().height
            }
            // console.log("ClipItem.getParentHeight NO HEIGHT", !!current)
            return 0;
        };
        const [parentHeight, setParentHeight] = React__default["default"].useState(getParentHeight);
        const { label, type, frame, frames } = clip;
        const getCurrentWidth = () => {
            if (!(moviemasher_js.isAboveZero(scale) && moviemasher_js.isAboveZero(frames))) {
                // console.log("ClipItem getCurrentWidth returing 0", scale, frames)
                return 0;
            }
            const currentWidth = moviemasher_js.pixelFromFrame(frames, scale, 'floor');
            const { width } = watching;
            if (currentWidth && currentWidth !== width) {
                watching.width = currentWidth;
                updateNonce();
            }
            return currentWidth;
        };
        const currentWidth = getCurrentWidth();
        const actionCallback = (event) => {
            // console.log("ClipItem actionCallback", event)
            if (watching.redraw)
                return;
            const { type } = event;
            if (!moviemasher_js.isEventType(type))
                return;
            if (!(event instanceof CustomEvent))
                return;
            if (type !== moviemasher_js.EventType.Action)
                return;
            const { detail } = event;
            if (!detail)
                return;
            const { action } = detail;
            if (!action)
                return;
            const { target } = action;
            if (!moviemasher_js.isObject(target))
                return;
            switch (target) {
                case clip:
                case clip.container:
                case clip.content: break;
                default: {
                    if (action.property === 'color')
                        break;
                    return;
                }
            }
            updateNonce();
        };
        useListeners({ [moviemasher_js.EventType.Action]: actionCallback, [moviemasher_js.EventType.Save]: updateNonce });
        const frameSize = () => {
            const { rect } = editor;
            const size = {
                width: parentHeight * (rect.width / rect.height), height: parentHeight
            };
            return moviemasher_js.sizeCeil(size);
        };
        const clipSize = (size) => {
            const { width, height } = size;
            return { width: Math.max(width, currentWidth), height };
        };
        const populateSvg = () => {
            const { width, redraw } = watching;
            delete watching.timeout;
            delete watching.redraw;
            const { current } = svgRef;
            const { edited } = editor;
            const allOk = current && edited && width && width === getCurrentWidth();
            if (redraw || !allOk) {
                updateNonce();
                if (!allOk)
                    return Promise.resolve();
            }
            const currentSize = frameSize();
            const fullSize = clipSize(currentSize);
            // return Promise.resolve()
            const promise = clip.clipIcon(fullSize, timelineContext.scale, 2);
            if (!promise)
                return Promise.resolve();
            return promise.then(element => {
                const latestWidth = getCurrentWidth();
                if (element && width >= latestWidth) {
                    // console.log("ClipItem.populateSvg replacing children", fullSize)
                    current.replaceChildren(backgroundNode(edited.color, currentSize, 2), element);
                } //else console.log("ClipItem.populateSvg", !!element, width, ">= ?", latestWidth)
            });
        };
        const handleChange = () => {
            if (!parentHeight) {
                // console.log("ClipItem.handleChange no parentHeight")
                return setParentHeight(getParentHeight);
            }
            const { current } = svgRef;
            const { edited } = editor;
            if (!(current && edited))
                return;
            if (watching.timeout) {
                if (!watching.redraw) {
                    // console.log("ClipItem.handleChange setting redraw", nonce, scale, parentHeight)
                    watching.redraw = true;
                }
                return;
            }
            // // console.log("ClipItem.handleChange setting timeout", nonce, scale)
            watching.timeout = setTimeout(populateSvg, ClipItemRefreshRate);
        };
        React__default["default"].useEffect(handleChange, [nonce, scale, parentHeight]);
        const onPointerDown = (event) => {
            event.stopPropagation();
            editor.selection.set(clip);
        };
        const onDragEnd = (event) => {
            moviemasher_js.eventStop(event);
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const { dropEffect } = dataTransfer;
            if (dropEffect === 'none') {
                editor.removeClip(clip);
            }
        };
        const onDragStart = (event) => {
            onPointerDown(event);
            const { dataTransfer, clientX } = event;
            const { current } = viewRef;
            if (!(dataTransfer && current))
                return;
            const rect = current.getBoundingClientRect();
            const { left } = rect;
            const data = { offset: clientX - left };
            const json = JSON.stringify(data);
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData(type + DragSuffix, json);
        };
        const onDragOver = (event) => {
            moviemasher_js.eventStop(event);
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const definitionType = dragTypeValid(dataTransfer, clip);
            const pos = definitionType ? moviemasher_js.DroppingPosition.At : moviemasher_js.DroppingPosition.None;
            setDroppingTrack(definitionType ? track : undefined);
            setDroppingClip(definitionType ? clip : undefined);
            setDroppingPosition(pos);
        };
        const calculateClassName = () => {
            const selected = clip === selectedClip;
            const classes = [];
            if (className)
                classes.push(className);
            if (selected)
                classes.push(moviemasher_js.ClassSelected);
            if (droppingClip === clip)
                classes.push(droppingPositionClass(droppingPosition));
            // console.log("TimelineClip calculatedClassName", classes.join(' '))
            return classes.join(' ');
        };
        const childNodes = () => {
            const svgProps = {
                key: "clip-previews", ref: svgRef
            };
            const size = { width: currentWidth, height: parentHeight };
            if (moviemasher_js.sizeAboveZero(size)) {
                const { width, height } = size;
                svgProps.width = width;
                svgProps.height = height;
                svgProps.viewBox = `0 0 ${width} ${height}`;
            }
            const nodes = [React__default["default"].createElement("svg", Object.assign({}, svgProps))];
            if (label)
                nodes.unshift(React__default["default"].createElement("label", { key: 'label' }, label));
            return nodes;
        };
        const style = { width: currentWidth };
        if (prevClipEnd > -1) {
            style.marginLeft = moviemasher_js.pixelFromFrame(frame - prevClipEnd, scale, 'floor');
        }
        const clipProps = Object.assign(Object.assign({}, rest), { style, className: calculateClassName(), onPointerDown, onDragStart, onDragEnd,
            onDragOver, onDragLeave, onDrop, onClick: (event) => event.stopPropagation(), draggable: true, ref: viewRef, children: childNodes() });
        return React__default["default"].createElement(View, Object.assign({}, clipProps));
    }

    const useClip = () => React__default["default"].useContext(ClipContext).clip;

    const ComposerContextDefault = {
        refreshed: 0, refresh: moviemasher_js.EmptyMethod,
        validDragType: () => { return undefined; },
        droppingPosition: moviemasher_js.DroppingPosition.None,
        setDroppingPosition: moviemasher_js.EmptyMethod,
        onDrop: moviemasher_js.EmptyMethod,
        setDroppingLayer: moviemasher_js.EmptyMethod,
        onDragLeave: moviemasher_js.EmptyMethod,
    };
    const ComposerContext = React__default["default"].createContext(ComposerContextDefault);

    /**
     * @parents Masher
     * @children ComposerContent
     */
    function Composer(props) {
        const editorContext = React__default["default"].useContext(MasherContext);
        const [selectedLayer, setSelectedLayer] = React__default["default"].useState(undefined);
        const [droppingLayer, setDroppingLayer] = React__default["default"].useState(undefined);
        const [refreshed, setRefreshed] = React__default["default"].useState(0);
        const [droppingPosition, setDroppingPosition] = React__default["default"].useState(moviemasher_js.DroppingPosition.None);
        const { editor, draggable, drop } = editorContext;
        const refresh = () => { setRefreshed(value => value + 1); };
        const handleSelection = () => { setSelectedLayer(editor.selection.layer); };
        useListeners({
            [moviemasher_js.EventType.Selection]: handleSelection,
            [moviemasher_js.EventType.Cast]: refresh,
        });
        if (!editor)
            return null;
        const validDragType = (dataTransfer) => {
            if (!dataTransfer)
                return;
            const type = dragType(dataTransfer);
            if (!isDragType(type))
                return;
            if ([exports.DragType.Mash, exports.DragType.Layer].includes(type))
                return type;
        };
        const onDragLeave = () => {
            setDroppingPosition(moviemasher_js.DroppingPosition.None);
            setDroppingLayer(undefined);
        };
        const onDrop = (event) => {
            // console.log("Composer.onDrop")
            event.preventDefault();
            setDroppingPosition(moviemasher_js.DroppingPosition.None);
            refresh();
            const { dataTransfer } = event;
            moviemasher_js.assertObject(dataTransfer);
            const types = dragTypes(dataTransfer);
            if (types.includes(TransferTypeFiles)) {
                const editorIndex = {};
                drop(dataTransfer.files, editorIndex);
                return;
            }
            const dragType = validDragType(dataTransfer);
            if (!dragType)
                return;
            // console.log("Composer.onDrop", dragType)
            const layerAndPosition = {
                layer: droppingLayer, position: droppingPosition
            };
            switch (dragType) {
                case exports.DragType.Layer: {
                    if (moviemasher_js.isLayer(draggable))
                        editor.moveLayer(draggable, layerAndPosition);
                    break;
                }
                case exports.DragType.Mash: {
                    const mashAndDefinitions = {
                        mashObject: {}, definitionObjects: []
                    };
                    editor.addMash(mashAndDefinitions, layerAndPosition);
                    break;
                }
                default: {
                    if (draggable)
                        drop(draggable);
                }
            }
        };
        const composerContext = {
            refreshed, refresh, selectedLayer, validDragType,
            droppingPosition, setDroppingPosition, onDrop,
            droppingLayer, setDroppingLayer, onDragLeave,
        };
        const contextProps = {
            children: React__default["default"].createElement(View, Object.assign({}, props)),
            value: composerContext
        };
        return React__default["default"].createElement(ComposerContext.Provider, Object.assign({}, contextProps));
    }

    /**
     * @parents ComposerContent
     * @children ComposerLayerFolder, ComposerLayerMash, ComposerFolderClose, ComposerFolderOpen, ComposerDepth, ComposerLayerLabel
     */
    function ComposerLayer(props) {
        const ref = React__default["default"].useRef(null);
        React__default["default"].useContext(MasherContext);
        const composerContext = React__default["default"].useContext(ComposerContext);
        const layerContext = React__default["default"].useContext(LayerContext);
        const { validDragType, droppingPosition, setDroppingPosition, onDrop, droppingLayer, setDroppingLayer, onDragLeave } = composerContext;
        const editor = useEditor();
        const { layer } = layerContext;
        if (!layer)
            return null;
        const { className: propsClassName = 'layer' } = props, rest = __rest(props, ["className"]);
        const onClick = event => {
            event.stopPropagation();
            editor.selection.set(layer);
        };
        const onDragEnd = (event) => {
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const { dropEffect } = dataTransfer;
            if (dropEffect === 'none')
                editor.removeLayer(layer);
        };
        const onPointerDown = (event) => {
            event.stopPropagation();
            editor.selection.set(layer);
        };
        const onDragStart = (event) => {
            const point = DragElementPoint(event, ref.current);
            onPointerDown(event);
            const { dataTransfer } = event;
            if (!moviemasher_js.isObject(dataTransfer))
                return;
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData(`layer${DragSuffix}`, JSON.stringify(point));
        };
        const currentDroppingPosition = (event) => {
            const { dataTransfer } = event;
            const { current } = ref;
            if (!(current && validDragType(dataTransfer)))
                return moviemasher_js.DroppingPosition.None;
            const rect = DragElementRect(ref.current);
            const point = DragElementPoint(event, rect);
            const quarterHeight = Math.ceil(rect.height / 4);
            const folder = moviemasher_js.isLayerFolder(layer);
            if (point.y < quarterHeight * (folder ? 1 : 2))
                return moviemasher_js.DroppingPosition.Before;
            if (!folder || (point.y > quarterHeight * 3))
                return moviemasher_js.DroppingPosition.After;
            return moviemasher_js.DroppingPosition.At;
        };
        const onDragOver = (event) => {
            const position = currentDroppingPosition(event);
            setDroppingPosition(position);
            setDroppingLayer(layer);
            moviemasher_js.eventStop(event);
        };
        const calculatedClassName = () => {
            const selected = layer === editor.selection.layer;
            const classes = [propsClassName];
            if (selected)
                classes.push(moviemasher_js.ClassSelected);
            if (droppingLayer === layer) {
                classes.push(droppingPositionClass(droppingPosition));
            }
            return classes.join(' ');
        };
        const className = React__default["default"].useMemo(calculatedClassName, [droppingPosition, droppingLayer, editor.selection.layer]);
        const viewProps = Object.assign(Object.assign({}, rest), { className, ref, onMouseDown: onPointerDown, onDragStart, onDragEnd,
            onClick, onDragLeave, onDragOver, onDrop, draggable: true });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Composer
     * @children ComposerLayer
     */
    function ComposerContent(props) {
        const composerContext = React__default["default"].useContext(ComposerContext);
        const { droppingLayer, setDroppingLayer, droppingPosition, setDroppingPosition, onDrop, onDragLeave } = composerContext;
        const editor = useEditor();
        const { className: propsClassName = 'content', children } = props, rest = __rest(props, ["className", "children"]);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child));
        const layersArray = (layers, depth = 0) => {
            return layers.flatMap(layer => {
                if (!layer) {
                    console.trace("layersArray no layer", depth, layers);
                    return [];
                }
                return layerArray(layer, depth);
            });
        };
        const layerArray = (layer, depth) => {
            const layerContext = { layer, depth };
            const contextProps = {
                key: `layer-${layer.id}`,
                value: layerContext,
                children: React__default["default"].createElement(ComposerLayer, Object.assign({}, child.props))
            };
            const context = React__default["default"].createElement(LayerContext.Provider, Object.assign({}, contextProps));
            const elements = [context];
            if (moviemasher_js.isLayerFolder(layer) && !layer.collapsed) {
                elements.push(...layersArray(layer.layers, depth + 1));
            }
            return elements;
        };
        const viewChildren = React__default["default"].useMemo(() => { var _a; return layersArray(((_a = editor.selection.cast) === null || _a === void 0 ? void 0 : _a.layers) || []); }, [composerContext.refreshed, composerContext.selectedLayer]);
        const calculatedClassName = () => {
            const classes = [propsClassName];
            if (droppingPosition !== moviemasher_js.DroppingPosition.None && !droppingLayer) {
                classes.push(moviemasher_js.ClassDropping);
            }
            return classes.join(' ');
        };
        const className = React__default["default"].useMemo(calculatedClassName, [droppingPosition, droppingLayer, editor.selection.layer]);
        const onClick = () => { editor.selection.unset(moviemasher_js.SelectType.Layer); };
        const dragValid = (dataTransfer) => {
            if (!dataTransfer)
                return false;
            const types = dragTypes(dataTransfer);
            if (types.includes(TransferTypeFiles))
                return true;
            const type = dragType(dataTransfer);
            return !!type;
        };
        const onDragOver = (event) => {
            event.preventDefault();
            const { dataTransfer } = event;
            if (!dragValid(dataTransfer))
                return;
            // const { types, files, items } = dataTransfer
            // console.log("types", types)
            // console.log("files", files)
            // console.log("items", items)
            // // const type = dragType(dataTransfer)
            setDroppingPosition(viewChildren.length);
            setDroppingLayer();
        };
        const viewProps = Object.assign(Object.assign({}, rest), { children: viewChildren, key: 'composer-view', onClick, onDragLeave, onDragOver, onDrop, className });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function ComposerDepth(props) {
        const layerContext = React__default["default"].useContext(LayerContext);
        const { depth } = layerContext;
        const child = React__default["default"].Children.only(props.children);
        if (!React__default["default"].isValidElement(child))
            throw Problems.child;
        const kids = (new Array(depth)).fill(true).map((_, index) => {
            const childProps = Object.assign(Object.assign({}, child.props), { key: `depth-${index}` });
            return React__default["default"].cloneElement(child, childProps);
        });
        return React__default["default"].createElement(React__default["default"].Fragment, null, kids);
    }

    /**
     * @parents ComposerContent
     */
    function ComposerFolderClose(props) {
        const composerContext = React__default["default"].useContext(ComposerContext);
        const layer = useLayer();
        if (layer.type !== moviemasher_js.LayerType.Folder)
            return null;
        const layerFolder = layer;
        if (layerFolder.collapsed)
            return null;
        const { children } = props, rest = __rest(props, ["children"]);
        const child = React__default["default"].Children.only(children);
        if (!React__default["default"].isValidElement(child))
            throw Problems.child;
        const onClick = () => {
            layerFolder.collapsed = true;
            composerContext.refresh();
        };
        const childProps = Object.assign(Object.assign({}, rest), { onClick });
        return React__default["default"].cloneElement(child, childProps);
    }

    /**
     * @parents ComposerContent
     */
    function ComposerFolderOpen(props) {
        const { children } = props, rest = __rest(props, ["children"]);
        const child = React__default["default"].Children.only(children);
        if (!React__default["default"].isValidElement(child))
            throw Problems.child;
        const composerContext = React__default["default"].useContext(ComposerContext);
        const layer = useLayer();
        if (layer.type !== moviemasher_js.LayerType.Folder)
            return null;
        const layerFolder = layer;
        if (!layerFolder.collapsed)
            return null;
        const onClick = () => {
            layerFolder.collapsed = false;
            composerContext.refresh();
        };
        const childProps = Object.assign(Object.assign({}, rest), { onClick });
        return React__default["default"].cloneElement(child, childProps);
    }

    /**
     * @parents ComposerContent
     */
    function ComposerLayerFolder(props) {
        const layer = useLayer();
        if (layer.type !== moviemasher_js.LayerType.Folder)
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    function ComposerLayerLabel(props) {
        const layer = useLayer();
        const [label, setLabel] = React__default["default"].useState(layer.label);
        const handleAction = event => {
            if (!moviemasher_js.isActionEvent(event))
                return;
            const { action } = event.detail;
            if (moviemasher_js.isChangeAction(action) && layer === action.target)
                setLabel(layer.label);
        };
        useListeners({ [moviemasher_js.EventType.Action]: handleAction });
        const labelProps = Object.assign(Object.assign({}, props), { children: label });
        return React__default["default"].createElement("label", Object.assign({}, labelProps));
    }

    /**
     * @parents ComposerContent
     */
    function ComposerLayerMash(props) {
        const layer = useLayer();
        if (layer.type !== moviemasher_js.LayerType.Mash)
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    function Button(props) {
        const { useView, selected } = props, rest = __rest(props, ["useView", "selected"]);
        if (!useView)
            return React__default["default"].createElement("button", Object.assign({}, rest));
        const { disabled, className } = rest, pruned = __rest(rest, ["disabled", "className"]);
        const classes = [moviemasher_js.ClassButton];
        if (className)
            classes.push(className);
        if (disabled)
            classes.push(moviemasher_js.ClassDisabled);
        else if (selected)
            classes.push(moviemasher_js.ClassSelected);
        const viewProps = Object.assign(Object.assign({}, pruned), { className: classes.join(' ') });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Masher
     */
    function AddFolderControl(props) {
        const editor = useEditor();
        const composerContext = React__default["default"].useContext(ComposerContext);
        const { children } = props, rest = __rest(props, ["children"]);
        const child = React__default["default"].Children.only(children);
        if (!React__default["default"].isValidElement(child))
            throw Problems.child;
        const childProps = Object.assign(Object.assign({}, rest), { onClick: () => {
                editor.addFolder();
                composerContext.refresh();
            } });
        return React__default["default"].cloneElement(child, childProps);
    }

    /**
     * @parents Masher
     */
    function AddMashControl(props) {
        const editor = useEditor();
        const composerContext = React__default["default"].useContext(ComposerContext);
        const { children } = props, rest = __rest(props, ["children"]);
        const child = React__default["default"].Children.only(children);
        if (!React__default["default"].isValidElement(child))
            throw Problems.child;
        const childProps = Object.assign(Object.assign({}, rest), { onClick: () => {
                editor.addMash();
                composerContext.refresh();
            } });
        return React__default["default"].cloneElement(child, childProps);
    }

    const DefaultComposerProps = function (props = {}) {
        var _a, _b, _c, _d, _e, _f;
        const optionsStrict = panelOptionsStrict(props);
        const { icons } = optionsStrict;
        (_a = optionsStrict.props).key || (_a.key = 'composer');
        (_b = optionsStrict.props).className || (_b.className = 'panel composer');
        (_c = optionsStrict.props).initialPicked || (_c.initialPicked = 'container');
        (_d = optionsStrict.header).content || (_d.content = [icons.composer]);
        (_e = optionsStrict.footer).content || (_e.content = [
            React__default["default"].createElement(AddMashControl, null,
                React__default["default"].createElement(Button, null,
                    icons.add,
                    icons.mmWide)),
            React__default["default"].createElement(AddFolderControl, null,
                React__default["default"].createElement(Button, null,
                    icons.add,
                    icons.folder))
        ]);
        (_f = optionsStrict.content).children || (_f.children = React__default["default"].createElement("div", { key: 'layer', className: 'layer' },
            React__default["default"].createElement("div", { key: 'icons' },
                React__default["default"].createElement(ComposerDepth, { key: "depth" },
                    React__default["default"].createElement("div", { className: 'depth' })),
                React__default["default"].createElement(ComposerLayerFolder, { key: "layer-folder" },
                    React__default["default"].createElement(ComposerFolderOpen, { key: "folder-open" },
                        React__default["default"].createElement("div", { className: moviemasher_js.ClassButton }, icons.folder)),
                    React__default["default"].createElement(ComposerFolderClose, { key: "folder-close" },
                        React__default["default"].createElement("div", { className: moviemasher_js.ClassButton }, icons.folderOpen))),
                React__default["default"].createElement(ComposerLayerMash, { key: "layer-mash" },
                    React__default["default"].createElement("div", { key: "mash-icon", className: moviemasher_js.ClassButton }, icons.mmTube))),
            React__default["default"].createElement(ComposerLayerLabel, { key: "label" }),
            React__default["default"].createElement("div", { key: "play-button", className: moviemasher_js.ClassButton }, icons.playerPlay)));
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.header)),
            React__default["default"].createElement(ComposerContent, Object.assign({}, optionsStrict.content.props), optionsStrict.content.children),
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.footer)));
        return Object.assign(Object.assign({}, optionsStrict.props), { children });
    };

    function CreateEditedControl(props) {
        const { children } = props, rest = __rest(props, ["children"]);
        const editor = useEditor();
        const getDisabled = () => editor.can(moviemasher_js.MasherAction.Save);
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({
            [moviemasher_js.EventType.Action]: updateDisabled,
            [moviemasher_js.EventType.Mash]: updateDisabled,
            [moviemasher_js.EventType.Cast]: updateDisabled,
            [moviemasher_js.EventType.Save]: updateDisabled,
        });
        const onClick = () => {
            if (disabled)
                return;
            editor.create();
        };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    function EditorRedoButton(props) {
        const [disabled, setDisabled] = React__default["default"].useState(true);
        const editor = useEditor();
        useListeners({
            [moviemasher_js.EventType.Action]: () => { setDisabled(!editor.can(moviemasher_js.MasherAction.Redo)); }
        });
        const { children } = props, rest = __rest(props, ["children"]);
        const onClick = () => { editor.redo(); };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    function EditorRemoveButton(props) {
        const { children, type } = props, rest = __rest(props, ["children", "type"]);
        const selectType = type || moviemasher_js.SelectType.Clip;
        moviemasher_js.assertSelectType(selectType);
        const editor = useEditor();
        const [disabled, setDisabled] = React__default["default"].useState(!editor.selection[selectType]);
        useListeners({
            [moviemasher_js.EventType.Selection]: () => { setDisabled(!editor.selection[selectType]); }
        });
        const onClick = () => {
            if (disabled)
                return;
            const selectable = editor.selection[selectType];
            if (moviemasher_js.isEffect(selectable))
                editor.removeEffect(selectable);
            else if (moviemasher_js.isClip(selectable))
                editor.removeClip(selectable);
            else if (moviemasher_js.isTrack(selectable))
                editor.removeTrack(selectable);
        };
        const child = React__default["default"].Children.only(children);
        const cloneProps = Object.assign(Object.assign(Object.assign({}, rest), child.props), { onClick, disabled });
        return React__default["default"].cloneElement(child, cloneProps);
    }

    function EditorUndoButton(props) {
        const editor = useEditor();
        const [disabled, setDisabled] = React__default["default"].useState(true);
        useListeners({
            [moviemasher_js.EventType.Action]: () => { setDisabled(!editor.can(moviemasher_js.MasherAction.Undo)); }
        });
        const { children } = props, rest = __rest(props, ["children"]);
        const onClick = () => { editor.undo(); };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled: disabled });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    function RenderControl(props) {
        const processContext = React__default["default"].useContext(ProcessContext);
        const apiContext = React__default["default"].useContext(ApiContext);
        const { children } = props, rest = __rest(props, ["children"]);
        const { processing, setProcessing, setError } = processContext;
        const { endpointPromise } = apiContext;
        const editor = useEditor();
        const getDisabled = () => !editor.can(moviemasher_js.MasherAction.Render);
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => setDisabled(getDisabled());
        useListeners({
            [moviemasher_js.EventType.Save]: updateDisabled,
            [moviemasher_js.EventType.Mash]: updateDisabled,
            [moviemasher_js.EventType.Action]: updateDisabled
        });
        const handleApiCallback = (callback, mash) => {
            setTimeout(() => {
                console.debug("handleApiCallback request", callback);
                moviemasher_js.fetchCallback(callback).then((response) => {
                    console.debug("handleApiCallback response", response);
                    const { apiCallback, error } = response;
                    if (error)
                        handleError(callback.endpoint.prefix, callback.request, response, error);
                    else if (apiCallback) {
                        const { request, endpoint } = apiCallback;
                        if (endpoint.prefix === moviemasher_js.Endpoints.data.mash.put) {
                            const putRequest = request.body;
                            const { rendering } = putRequest.mash;
                            if (rendering)
                                mash.rendering = rendering;
                        }
                        handleApiCallback(apiCallback, mash);
                    }
                    else
                        setProcessing(false);
                });
            }, 2000);
        };
        const handleError = (endpoint, request, response, error) => {
            setProcessing(false);
            setError(error);
            console.error(endpoint, request, response, error);
        };
        const onClick = () => {
            if (disabled || processing)
                return;
            const { edited } = editor;
            moviemasher_js.assertMash(edited);
            setProcessing(true);
            const request = {
                mash: edited.toJSON(),
                definitions: editor.definitions.map(definition => definition.toJSON()),
                outputs: [{ outputType: moviemasher_js.OutputType.Video }],
            };
            console.debug("RenderingStartRequest", moviemasher_js.Endpoints.rendering.start, request);
            endpointPromise(moviemasher_js.Endpoints.rendering.start, request).then((response) => {
                console.debug("RenderingStartResponse", moviemasher_js.Endpoints.rendering.start, response);
                const { apiCallback, error } = response;
                if (error)
                    handleError(moviemasher_js.Endpoints.rendering.start, request, response, error);
                else
                    handleApiCallback(apiCallback, edited);
            });
        };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled: disabled || processing });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    function SaveControl(props) {
        const editor = useEditor();
        const editorContext = React__default["default"].useContext(MasherContext);
        const { save } = editorContext;
        const getDisabled = () => !editor.can(moviemasher_js.MasherAction.Save);
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({
            [moviemasher_js.EventType.Action]: updateDisabled, [moviemasher_js.EventType.Save]: updateDisabled,
        });
        const { children } = props, rest = __rest(props, ["children"]);
        const onClick = () => {
            if (disabled)
                return;
            setDisabled(true);
            save();
        };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    const InspectorContextDefault = {
        actionCount: 0,
        selectedInfo: {
            tweenDefined: {},
            tweenSelected: {},
            selectedType: moviemasher_js.SelectType.None,
            selectTypes: [],
        },
        selectedItems: [],
        changeSelected: moviemasher_js.EmptyMethod,
        changeTweening: moviemasher_js.EmptyMethod,
    };
    const InspectorContext = React__default["default"].createContext(InspectorContextDefault);

    function SelectEditedControl(props) {
        var _a, _b;
        const editor = useEditor();
        const [requested, setRequested] = React__default["default"].useState(false);
        const [described, setDescribed] = React__default["default"].useState(() => []);
        const [editedId, setEditedId] = React__default["default"].useState(((_a = editor.edited) === null || _a === void 0 ? void 0 : _a.id) || '');
        const apiContext = React__default["default"].useContext(ApiContext);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedInfo } = inspectorContext;
        const { selectedType } = selectedInfo;
        const [editedLabel, setEditedLabel] = React__default["default"].useState(((_b = editor.edited) === null || _b === void 0 ? void 0 : _b.label) || '');
        const getDisabled = () => editor.can(moviemasher_js.MasherAction.Save);
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const { enabled, servers, endpointPromise } = apiContext;
        const updateDisabled = () => { setDisabled(getDisabled()); };
        const handleEdited = (event) => {
            const { type } = event;
            if (!(moviemasher_js.isEventType(type) && moviemasher_js.isSelectType(type)))
                return;
            if (type !== selectedType)
                return;
            const { edited } = editor;
            moviemasher_js.assertObject(edited);
            const { id, label } = edited;
            setDescribed(original => {
                const copy = original.filter(object => moviemasher_js.isPopulatedString(object.label));
                const index = copy.findIndex(object => object.id === id);
                if (moviemasher_js.isPositive(index))
                    copy.splice(index, 1, edited);
                else
                    copy.push(edited);
                setEditedId(id);
                setEditedLabel(label);
                return copy;
            });
        };
        const handleAction = () => {
            const { edited } = editor;
            moviemasher_js.assertObject(edited);
            const { label } = edited;
            if (editedLabel !== label) {
                setDescribed(original => [...original]);
                setEditedLabel(label);
            }
            updateDisabled();
        };
        useListeners({
            [moviemasher_js.EventType.Action]: handleAction,
            [moviemasher_js.EventType.Mash]: handleEdited,
            [moviemasher_js.EventType.Cast]: handleEdited,
            [moviemasher_js.EventType.Save]: updateDisabled,
        }, editor.eventTarget);
        const onChange = (event) => {
            if (disabled)
                return;
            const { selectedIndex } = event.target;
            const object = described[selectedIndex];
            moviemasher_js.assertObject(object);
            const { id } = object;
            const request = { id };
            const { editType } = editor;
            const endpoint = moviemasher_js.Endpoints.data[editType].get;
            console.debug("GetRequest", endpoint, request);
            endpointPromise(endpoint, request).then((response) => {
                console.debug("GetResponse", endpoint, response);
                const { error } = response;
                if (error)
                    console.error("GetResponse", endpoint, error);
                else
                    return editor.load(response);
            });
        };
        React__default["default"].useEffect(() => {
            if (!(enabled && servers[moviemasher_js.ServerType.Data]))
                return;
            if (requested)
                return;
            setRequested(true);
            const request = { partial: true };
            const endpoint = moviemasher_js.Endpoints.data[editor.editType].retrieve;
            console.debug("RetrieveRequest", endpoint, request);
            endpointPromise(endpoint, request).then((response) => {
                console.debug("RetrieveResponse", endpoint, response);
                const { described, error } = response;
                if (error)
                    console.error("RetrieveResponse", endpoint, error);
                else
                    setDescribed(original => {
                        const copy = [...original];
                        described.forEach(object => {
                            const { id, label } = object;
                            const found = copy.find(object => object.id === id);
                            if (found || !moviemasher_js.isPopulatedString(label))
                                return;
                            copy.push(object);
                        });
                        return copy;
                    });
            });
        }, [servers, enabled]);
        if (described.length < 2)
            return null;
        const describedOptions = () => {
            const { editType, edited } = editor;
            const elements = [React__default["default"].createElement("optgroup", { key: "group", label: labelTranslate('open') })];
            if (!edited)
                return elements;
            const { id: editedId, label: editedLabel } = edited;
            elements.push(...described.map(object => {
                const { label: objectLabel, id } = object;
                const label = (id === editedId) ? editedLabel : objectLabel;
                const children = moviemasher_js.isPopulatedString(label) ? label : labelInterpolate('unlabeled', { type: editType });
                const optionProps = { children, value: id, key: id };
                const option = React__default["default"].createElement("option", Object.assign({}, optionProps));
                return option;
            }));
            return elements;
        };
        const { children } = props, rest = __rest(props, ["children"]);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child));
        const selectOptions = {
            key: "edited-select",
            onChange, disabled, children: describedOptions(), value: editedId
        };
        const viewProps = Object.assign(Object.assign({}, rest), { children: [child, React__default["default"].createElement("select", Object.assign({}, selectOptions))] });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function ViewControl(props) {
        const editor = useEditor();
        const getDisabled = () => {
            const { edited } = editor;
            if (!moviemasher_js.isMash(edited))
                return true;
            const { rendering } = edited;
            return !rendering;
        };
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => setDisabled(getDisabled());
        useListeners({
            [moviemasher_js.EventType.Render]: updateDisabled,
            [moviemasher_js.EventType.Mash]: updateDisabled
        });
        const { children } = props, rest = __rest(props, ["children"]);
        const onClick = () => {
            if (disabled)
                return;
            const { edited } = editor;
            moviemasher_js.assertMash(edited);
            const url = moviemasher_js.urlForEndpoint(editor.preloader.endpoint, edited.rendering);
            window.open(url);
        };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    function ConstEmptyElementFunction(props) { return null; }
    const EmptyElement = React__default["default"].createElement(ConstEmptyElementFunction, { key: "empty" });
    const TweenInputKey = 'tween-input-key';

    const DataTypeInputs = {
        [moviemasher_js.DataType.Frame]: EmptyElement,
        [moviemasher_js.DataType.Number]: EmptyElement,
        [moviemasher_js.DataType.Rgb]: EmptyElement,
        [moviemasher_js.DataType.String]: EmptyElement,
        [moviemasher_js.DataType.DefinitionId]: EmptyElement,
        [moviemasher_js.DataType.FontId]: EmptyElement,
        [moviemasher_js.DataType.Percent]: EmptyElement,
        [moviemasher_js.DataType.ContainerId]: EmptyElement,
        [moviemasher_js.DataType.ContentId]: EmptyElement,
        [moviemasher_js.DataType.Boolean]: EmptyElement,
        [moviemasher_js.DataType.Timing]: EmptyElement,
        [moviemasher_js.DataType.Sizing]: EmptyElement,
    };

    const InputContextDefault = {
        value: '',
        name: '',
        property: { type: moviemasher_js.DataType.String, name: '', defaultValue: '' }
    };
    const InputContext = React__default["default"].createContext(InputContextDefault);

    function BooleanTypeInput() {
        const inputContext = React__default["default"].useContext(InputContext);
        const { changeHandler, property, value, name } = inputContext;
        if (!property)
            return null;
        const inputProps = {
            type: 'checkbox',
            name,
            checked: !!value,
        };
        if (changeHandler) {
            inputProps.onChange = (event) => {
                changeHandler(name, event.target.checked);
            };
        }
        else
            inputProps.disabled = true;
        return React__default["default"].createElement("input", Object.assign({}, inputProps));
    }
    DataTypeInputs[moviemasher_js.DataType.Boolean] = React__default["default"].createElement(BooleanTypeInput, null);

    function DefinitionDrop(props) {
        const { type, types, children, className } = props, rest = __rest(props, ["type", "types", "children", "className"]);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child));
        const [isOver, setIsOver] = React__default["default"].useState(false);
        const inputContext = React__default["default"].useContext(InputContext);
        const editorContext = React__default["default"].useContext(MasherContext);
        const { drop } = editorContext;
        const { changeHandler, value, name } = inputContext;
        moviemasher_js.assertTrue(changeHandler);
        const definitionTypes = propsDefinitionTypes(type, types);
        const childNodes = () => {
            if (!value)
                return null;
            moviemasher_js.assertPopulatedString(value);
            const definition = moviemasher_js.Defined.fromId(value);
            moviemasher_js.assertDefinition(definition);
            const definitionProps = { definition, key: definition.id };
            const children = React__default["default"].cloneElement(child, definitionProps);
            const contextProps = { children, value: { definition } };
            return React__default["default"].createElement(DefinitionContext.Provider, Object.assign({}, contextProps));
        };
        const dropAllowed = (event) => {
            const { dataTransfer } = event;
            moviemasher_js.assertTrue(dataTransfer);
            const types = dragTypes(dataTransfer);
            // any file can be dropped - we filter out invalid ones later
            if (types.includes(TransferTypeFiles))
                return true;
            const draggingType = dragType(dataTransfer);
            if (!moviemasher_js.isDefinitionType(draggingType))
                return false;
            return definitionTypes.includes(draggingType);
        };
        const onDragLeave = () => { setIsOver(false); };
        const onDragOver = (event) => {
            const allowed = dropAllowed(event);
            setIsOver(allowed);
            if (allowed)
                event.preventDefault();
        };
        const onDrop = (event) => __awaiter(this, void 0, void 0, function* () {
            moviemasher_js.eventStop(event);
            setIsOver(false);
            if (!dropAllowed(event))
                return;
            const { dataTransfer } = event;
            moviemasher_js.assertTrue(dataTransfer);
            const types = dragTypes(dataTransfer);
            // any file can be dropped
            if (types.includes(TransferTypeFiles)) {
                yield drop(dataTransfer.files).then(definitions => {
                    if (!definitions.length)
                        return;
                    const container = name === "containerId";
                    const valid = container ? definitions.filter(moviemasher_js.isContainerDefinition) : definitions;
                    const [definition] = valid;
                    if (definition) {
                        moviemasher_js.assertTrue(moviemasher_js.Defined.installed(definition.id), `${definition.type} installed`);
                        // console.log("DefinitionDrop onDrop", definition.type, definition.label)
                        changeHandler(name, definition.id);
                    }
                });
                return;
            }
            const type = dropType(dataTransfer);
            const json = dataTransfer.getData(type);
            const data = JSON.parse(json);
            const { definitionObject } = data;
            const [definition] = moviemasher_js.Defined.define(definitionObject);
            if (name === "containerId" && !moviemasher_js.isContainerDefinition(definition))
                return;
            changeHandler(name, definitionObject.id);
        });
        const calculateClassName = () => {
            const classes = [];
            if (className)
                classes.push(className);
            if (isOver)
                classes.push(moviemasher_js.ClassDropping);
            return classes.join(' ');
        };
        const memoClassName = React__default["default"].useMemo(calculateClassName, [isOver]);
        const viewProps = Object.assign(Object.assign({}, rest), { className: memoClassName, children: childNodes(), onDragLeave,
            onDragOver,
            onDrop, value: String(value), key: `${name}-drop` });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }
    DataTypeInputs[moviemasher_js.DataType.ContainerId] = (React__default["default"].createElement(DefinitionDrop, { types: moviemasher_js.ContainerTypes, className: 'definition-drop' },
        React__default["default"].createElement(DefinitionItem, { className: 'definition preview' })));
    DataTypeInputs[moviemasher_js.DataType.ContentId] = (React__default["default"].createElement(DefinitionDrop, { types: moviemasher_js.ContentTypes, className: 'definition-drop' },
        React__default["default"].createElement(DefinitionItem, { className: 'definition preview' })));

    function DefinitionSelect() {
        const inputContext = React__default["default"].useContext(InputContext);
        const { changeHandler, value, name } = inputContext;
        moviemasher_js.assertTrue(changeHandler);
        const onChange = (event) => {
            changeHandler(name, event.target.value);
        };
        const options = moviemasher_js.Defined.byType(moviemasher_js.DefinitionType.Font).map(object => {
            const { id, label } = object;
            const optionProps = { value: id, children: label, key: id };
            return React__default["default"].createElement("option", Object.assign({}, optionProps));
        });
        const selectProps = {
            children: options,
            name,
            onChange,
            value: String(value),
            key: `${name}-select`,
        };
        return React__default["default"].createElement("select", Object.assign({}, selectProps));
    }
    DataTypeInputs[moviemasher_js.DataType.FontId] = React__default["default"].createElement(DefinitionSelect, null);

    function NumericTypeInput() {
        const inputContext = React__default["default"].useContext(InputContext);
        const editor = useEditor();
        const { changeHandler, property, value, name, time } = inputContext;
        if (!property)
            return null;
        const { min, max, step } = property;
        const inputProps = {
            type: 'number',
            name,
            value: String(value),
        };
        if (moviemasher_js.isDefined(min))
            inputProps.min = min;
        if (moviemasher_js.isDefined(max))
            inputProps.max = max;
        if (moviemasher_js.isDefined(step))
            inputProps.step = step;
        if (changeHandler) {
            inputProps.onChange = (event) => __awaiter(this, void 0, void 0, function* () {
                const { value } = event.target;
                if (time)
                    yield editor.goToTime(time);
                changeHandler(name, value);
            });
        }
        else
            inputProps.disabled = true;
        return React__default["default"].createElement("input", Object.assign({}, inputProps));
    }
    DataTypeInputs[moviemasher_js.DataType.Number] = React__default["default"].createElement(NumericTypeInput, null);
    DataTypeInputs[moviemasher_js.DataType.Frame] = React__default["default"].createElement(NumericTypeInput, null);

    function Slider(props) {
        const { className, onChange } = props;
        const options = Object.assign({}, props);
        const classes = ['slider'];
        if (className)
            classes.push(className);
        options.className = classes.join(' ');
        if (onChange) {
            const handleChange = (event) => {
                onChange(event, event.currentTarget.valueAsNumber);
            };
            options.onChange = handleChange;
        }
        const input = React__default["default"].createElement("input", Object.assign({ type: 'range' }, options));
        return input;
    }

    function PercentTypeInput() {
        const editor = useEditor();
        const inputContext = React__default["default"].useContext(InputContext);
        const { changeHandler, property, value: contextValue, name, time, defaultValue: contextDefault } = inputContext;
        if (!property)
            return null;
        const { max, min, step, defaultValue: propertyDefault } = property;
        const value = moviemasher_js.isDefined(contextValue) ? contextValue : (moviemasher_js.isDefined(contextDefault) ? contextDefault : propertyDefault);
        const sliderProps = {
            value,
            min: moviemasher_js.isNumber(min) ? min : 0.0,
            max: moviemasher_js.isNumber(max) ? max : 1.0,
            step: moviemasher_js.isNumber(step) ? step : 0.01,
            name,
        };
        if (changeHandler) {
            const onChange = (_event, values) => __awaiter(this, void 0, void 0, function* () {
                const value = moviemasher_js.isArray(values) ? values[0] : values;
                if (time)
                    yield editor.goToTime(time);
                changeHandler(name, value);
            });
            sliderProps.onChange = onChange;
        }
        else
            sliderProps.disabled = true;
        return React__default["default"].createElement(Slider, Object.assign({ className: 'slider' }, sliderProps));
    }
    DataTypeInputs[moviemasher_js.DataType.Percent] = React__default["default"].createElement(PercentTypeInput, null);

    function RgbTypeInput() {
        React__default["default"].useContext(MasherContext);
        const inputContext = React__default["default"].useContext(InputContext);
        const editor = useEditor();
        const { changeHandler, property, value: contextValue, name, time, defaultValue: contextDefault } = inputContext;
        if (!property)
            return null;
        const { defaultValue: propertyDefault } = property;
        const value = moviemasher_js.isDefined(contextValue) ? contextValue : (moviemasher_js.isDefined(contextDefault) ? contextDefault : propertyDefault);
        const colorProps = {
            type: 'color', name, value: String(value),
        };
        if (changeHandler) {
            colorProps.onChange = (event) => __awaiter(this, void 0, void 0, function* () {
                const { value } = event.target;
                if (time)
                    yield editor.goToTime(time);
                changeHandler(name, value);
            });
        }
        else
            colorProps.disabled = true;
        return React__default["default"].createElement("input", Object.assign({}, colorProps));
    }
    DataTypeInputs[moviemasher_js.DataType.Rgb] = React__default["default"].createElement(RgbTypeInput, null);

    function SizingTypeInput() {
        const inputContext = React__default["default"].useContext(InputContext);
        const { changeHandler, property, value, name } = inputContext;
        if (!property)
            return null;
        const options = moviemasher_js.Sizings.map(id => {
            const optionProps = { value: id, children: id, key: id };
            return React__default["default"].createElement("option", Object.assign({}, optionProps));
        });
        const selectProps = {
            children: options,
            name,
            value: String(value),
            key: `${name}-select`,
        };
        if (changeHandler) {
            selectProps.onChange = (event) => {
                changeHandler(name, event.target.value);
            };
        }
        else
            selectProps.disabled = true;
        return React__default["default"].createElement("select", Object.assign({}, selectProps));
    }
    DataTypeInputs[moviemasher_js.DataType.Sizing] = React__default["default"].createElement(SizingTypeInput, null);

    function TextTypeInput() {
        const inputContext = React__default["default"].useContext(InputContext);
        const { changeHandler, property, value, name } = inputContext;
        if (!property)
            return null;
        const inputProps = {
            name, type: 'text', value: String(value)
        };
        if (changeHandler) {
            inputProps.onChange = (event) => {
                changeHandler(name, event.target.value);
            };
        }
        else
            inputProps.disabled = true;
        return React__default["default"].createElement("input", Object.assign({}, inputProps));
    }
    DataTypeInputs[moviemasher_js.DataType.String] = React__default["default"].createElement(TextTypeInput, null);

    function TimingTypeInput() {
        const inputContext = React__default["default"].useContext(InputContext);
        const { changeHandler, property, value, name } = inputContext;
        if (!property)
            return null;
        const options = moviemasher_js.Timings.map(id => {
            const optionProps = { value: id, children: id, key: id };
            return React__default["default"].createElement("option", Object.assign({}, optionProps));
        });
        const selectProps = {
            children: options,
            name,
            value: String(value),
            key: `${name}-select`,
        };
        if (changeHandler) {
            selectProps.onChange = (event) => {
                changeHandler(name, event.target.value);
            };
        }
        else
            selectProps.disabled = true;
        return React__default["default"].createElement("select", Object.assign({}, selectProps));
    }
    DataTypeInputs[moviemasher_js.DataType.Timing] = React__default["default"].createElement(TimingTypeInput, null);

    const DataGroupInputs = {
        [moviemasher_js.DataGroup.Size]: EmptyElement,
        [moviemasher_js.DataGroup.Sizing]: EmptyElement,
        [moviemasher_js.DataGroup.Point]: EmptyElement,
        [moviemasher_js.DataGroup.Opacity]: EmptyElement,
        [moviemasher_js.DataGroup.Color]: EmptyElement,
        [moviemasher_js.DataGroup.Effects]: EmptyElement,
        [moviemasher_js.DataGroup.Timing]: EmptyElement,
    };

    function ColorGroupInput(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const editor = useEditor();
        const { selectType } = props, rest = __rest(props, ["selectType"]);
        moviemasher_js.assertSelectType(selectType);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems, changeTweening, selectedInfo } = inspectorContext;
        const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo;
        moviemasher_js.assertTimeRange(timeRange);
        moviemasher_js.assertTime(time);
        const endDefined = tweenDefined[moviemasher_js.DataGroup.Color];
        const endSelected = tweenSelected[moviemasher_js.DataGroup.Color];
        const byName = moviemasher_js.selectedPropertyObject(selectedItems, moviemasher_js.DataGroup.Color, selectType);
        const { color, [`color${moviemasher_js.PropertyTweenSuffix}`]: colorEnd } = byName;
        const colorProperty = endSelected ? colorEnd : color;
        const { property, changeHandler, value, name: nameOveride } = colorProperty;
        const { type, name: propertyName } = property;
        const name = nameOveride || propertyName;
        const input = DataTypeInputs[type];
        const inputContext = {
            property, value, name, changeHandler
        };
        // go to first/last frame if needed and tween value defined...
        inputContext.time = moviemasher_js.tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected);
        // if we're editing tween value, but it's not defined yet...
        if (endSelected) {
            // tell input to use start value as default, rather than the property's...
            inputContext.defaultValue = color.value;
        }
        const selectedButton = [moviemasher_js.ClassSelected, moviemasher_js.ClassButton].join(' ');
        const startProps = {
            children: icons.start,
            className: endSelected ? moviemasher_js.ClassButton : selectedButton,
            key: 'start',
            onClick: () => {
                editor.goToTime(timeRange.startTime);
                changeTweening(moviemasher_js.DataGroup.Color, false);
            }
        };
        const endProps = {
            key: 'end',
            className: endSelected ? selectedButton : moviemasher_js.ClassButton,
            children: endDefined ? icons.end : icons.endUndefined,
            onClick: () => {
                editor.goToTime(timeRange.lastTime);
                changeTweening(moviemasher_js.DataGroup.Color, true);
            }
        };
        const providerProps = { key: 'context', value: inputContext, children: input };
        const viewProps = Object.assign(Object.assign({}, rest), { key: `inspector-${selectType}-${name}`, children: [
                icons.color,
                React__default["default"].createElement(InputContext.Provider, Object.assign({}, providerProps)),
                React__default["default"].createElement(View, { className: "start-end", key: 'start-end' },
                    React__default["default"].createElement(View, Object.assign({}, startProps)),
                    React__default["default"].createElement(View, Object.assign({}, endProps)))
            ] });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }
    DataGroupInputs[moviemasher_js.DataGroup.Color] = React__default["default"].createElement(ColorGroupInput, { className: "color tween row", key: "color-group-input" });

    const elementSetPreviewSize = (current, size) => {
        if (!(size && current))
            return;
        const { width, height } = size;
        current.style.setProperty('--preview-width', `${width}px`);
        current.style.setProperty('--preview-height', `${height}px`);
    };

    const sessionGet = (key) => {
        return globalThis.window.sessionStorage.getItem(key) || '';
    };
    const sessionSet = (key, value) => {
        globalThis.window.sessionStorage.setItem(key, String(value));
    };

    const VideoView = React__default["default"].forwardRef((props, ref) => React__default["default"].createElement("video", Object.assign({}, props, { ref: ref })));

    /**
     * @parents InspectorEffects
     */
    function InspectorEffect(props) {
        const { className, removeHandler, index, effect, selectedEffect, setSelectedEffect } = props, rest = __rest(props, ["className", "removeHandler", "index", "effect", "selectedEffect", "setSelectedEffect"]);
        const selected = selectedEffect === effect;
        const onMouseDown = () => { if (!selected)
            setSelectedEffect(effect); };
        const onDragEnd = (event) => {
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const { dropEffect } = dataTransfer;
            if (dropEffect === 'none')
                removeHandler(effect);
        };
        const onDragStart = (event) => {
            if (!selected)
                onMouseDown();
            const data = { index };
            const json = JSON.stringify(data);
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData(`effect${DragSuffix}`, json);
        };
        const classes = [className || 'effect'];
        if (selected)
            classes.push(moviemasher_js.ClassSelected);
        const viewProps = Object.assign(Object.assign({}, rest), { children: effect.label, className: classes.join(' '), onMouseDown, onDragStart, onDragEnd, onClick: (event) => event.stopPropagation(), draggable: true });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents InspectorContent
     */
    function InspectorProperty(props) {
        const { defaultValue: propsDefault, changeHandler, time, property, value, name } = props;
        const { type, defaultValue: propertyDefault } = property;
        const defaultValue = moviemasher_js.isDefined(propsDefault) ? propsDefault : propertyDefault;
        const inputContext = {
            property, value, changeHandler, name, time, defaultValue
        };
        const contextProps = {
            key: 'context', value: inputContext, children: DataTypeInputs[type]
        };
        return React__default["default"].createElement(InputContext.Provider, Object.assign({}, contextProps));
    }

    /**
     * @parents InspectorContent
     */
    function InspectorProperties(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems: propsItems } = props;
        const { selectedItems: inspectorItems } = inspectorContext;
        const selectedItems = propsItems || inspectorItems;
        const ungroupedInputs = [];
        const groupedInputs = [];
        const groups = {};
        const selectTypes = new Set();
        selectedItems.forEach(selectedProperty => {
            if (moviemasher_js.isSelectedProperty(selectedProperty)) {
                const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty;
                const { name: propertyName, group } = property;
                if (group) {
                    const key = [group, selectType].join('-');
                    if (!groups[key]) {
                        groups[key] = true;
                        groupedInputs.push(React__default["default"].cloneElement(DataGroupInputs[group], { selectType }));
                    }
                    return;
                }
                const name = nameOveride || propertyName;
                selectTypes.add(selectType);
                const propertyProps = Object.assign({ key: `inspector-${selectType}-${name}`, property, value, changeHandler, name }, props);
                const icon = icons[name];
                const inspectorProperty = React__default["default"].createElement(InspectorProperty, Object.assign({}, propertyProps));
                if (icon) {
                    const viewChildren = [inspectorProperty];
                    viewChildren.unshift(icon);
                    const viewProps = {
                        children: viewChildren,
                        className: "row",
                        key: `icon-${selectType}-${name}`,
                    };
                    ungroupedInputs.push(React__default["default"].createElement(View, Object.assign({}, viewProps)));
                }
                else
                    ungroupedInputs.push(inspectorProperty);
            }
            else {
                const effectsProps = {
                    key: "inspector-effects",
                    selectedEffects: selectedProperty,
                };
                groupedInputs.push(React__default["default"].cloneElement(DataGroupInputs.effects, effectsProps));
            }
        });
        if (selectTypes.has(moviemasher_js.SelectType.Clip)) {
            ungroupedInputs.push();
        }
        return React__default["default"].createElement(React__default["default"].Fragment, null,
            ungroupedInputs,
            groupedInputs);
    }

    /**
     *
     * @children InspectorEffect
     */
    function EffectsGroupInput(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const { selectedEffects } = props, rest = __rest(props, ["selectedEffects"]);
        const ref = React__default["default"].useRef(null);
        const [isOver, setIsOver] = React__default["default"].useState(false);
        const [selectedEffect, setSelectedEffect] = React__default["default"].useState(null);
        const editor = useEditor();
        const { actions } = editor;
        moviemasher_js.assertTrue(selectedEffects);
        const { value: effects, addHandler, removeHandler, moveHandler } = selectedEffects;
        const selected = (selectedEffect && effects.includes(selectedEffect)) ? selectedEffect : null;
        if (selected !== selectedEffect)
            setSelectedEffect(selected);
        const dropIndex = (event) => {
            const { target } = event;
            if (target && target instanceof HTMLDivElement) {
                const index = target.getAttribute('index');
                if (index)
                    return Number(index);
            }
            return effects.length;
        };
        const dropAllowed = (event) => {
            const { dataTransfer } = event;
            const type = dragType(dataTransfer);
            return type === moviemasher_js.DefinitionType.Effect;
        };
        const onDragLeave = () => { setIsOver(false); };
        const onDragOver = (event) => {
            const allowed = dropAllowed(event);
            setIsOver(allowed);
            if (allowed)
                event.preventDefault();
        };
        const onDrop = (event) => {
            setIsOver(false);
            if (!dropAllowed(event))
                return;
            event.preventDefault();
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const type = dropType(dataTransfer);
            const json = dataTransfer.getData(type);
            const data = JSON.parse(json);
            const { definitionObject, index } = data;
            const droppedIndex = dropIndex(event);
            if (!moviemasher_js.isObject(definitionObject)) {
                if (droppedIndex === index)
                    return;
                moviemasher_js.assertEffect(selected);
                moveHandler(selected, droppedIndex);
            }
            else {
                const definition = moviemasher_js.Defined.fromObject(definitionObject);
                if (moviemasher_js.isEffectDefinition(definition)) {
                    const effect = definition.instanceFromObject();
                    addHandler(effect, droppedIndex);
                }
            }
        };
        const onClick = () => { setSelectedEffect(null); };
        const childNodes = () => {
            return effects.map((effect, index) => {
                const clipProps = {
                    key: effect.id,
                    selectedEffect: selected, setSelectedEffect,
                    effect,
                    index, removeHandler
                };
                return React__default["default"].createElement(InspectorEffect, Object.assign({}, clipProps));
            });
        };
        const calculateClassName = () => {
            const classes = ['list'];
            if (isOver)
                classes.push(moviemasher_js.ClassDropping);
            return classes.join(' ');
        };
        const memoClassName = React__default["default"].useMemo(calculateClassName, [isOver]);
        const listViewProps = {
            children: childNodes(),
            ref,
            onDragLeave,
            onDragOver,
            onDrop,
            onClick,
            key: 'view',
            className: memoClassName,
        };
        const viewProps = Object.assign(Object.assign({}, rest), { key: 'effects', children: [icons.browserEffect, React__default["default"].createElement(View, Object.assign({}, listViewProps))] });
        const effectsView = React__default["default"].createElement(View, Object.assign({}, viewProps));
        if (!selected)
            return effectsView;
        return React__default["default"].createElement(React__default["default"].Fragment, null,
            effectsView,
            React__default["default"].createElement(InspectorProperties, { selectedItems: selected.selectedItems(actions) }));
    }
    DataGroupInputs[moviemasher_js.DataGroup.Effects] = React__default["default"].createElement(EffectsGroupInput, { className: "effects row", key: "effects-group-input" });

    function OpacityGroupInput(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const editor = useEditor();
        const { selectType } = props, rest = __rest(props, ["selectType"]);
        moviemasher_js.assertSelectType(selectType);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems: properties, changeTweening, selectedInfo } = inspectorContext;
        const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo;
        moviemasher_js.assertTimeRange(timeRange);
        moviemasher_js.assertTime(time);
        const endDefined = tweenDefined[moviemasher_js.DataGroup.Opacity];
        const endSelected = tweenSelected[moviemasher_js.DataGroup.Opacity];
        const byName = moviemasher_js.selectedPropertyObject(properties, moviemasher_js.DataGroup.Opacity, selectType);
        const { opacity, [`opacity${moviemasher_js.PropertyTweenSuffix}`]: opacityEnd } = byName;
        const opacityProperty = endSelected ? opacityEnd : opacity;
        const { property, changeHandler, value, name: nameOveride } = opacityProperty;
        const { type, name: propertyName } = property;
        const name = nameOveride || propertyName;
        const input = DataTypeInputs[type];
        const inputContext = {
            property, value, name, changeHandler
        };
        // go to first/last frame if needed and tween value defined...
        inputContext.time = moviemasher_js.tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected);
        // if we're editing tween value, but it's not defined yet...
        if (endSelected) {
            // tell input to use start value as default, rather than the property's...
            inputContext.defaultValue = opacity.value;
        }
        const selectedButton = [moviemasher_js.ClassSelected, moviemasher_js.ClassButton].join(' ');
        const startProps = {
            children: icons.start,
            className: endSelected ? moviemasher_js.ClassButton : selectedButton,
            key: 'start',
            onClick: () => {
                editor.goToTime(timeRange.startTime);
                changeTweening(moviemasher_js.DataGroup.Opacity, false);
            }
        };
        const endProps = {
            key: 'end',
            className: endSelected ? selectedButton : moviemasher_js.ClassButton,
            children: endDefined ? icons.end : icons.endUndefined,
            onClick: () => {
                editor.goToTime(timeRange.lastTime);
                changeTweening(moviemasher_js.DataGroup.Opacity, true);
            }
        };
        const providerProps = { key: 'context', value: inputContext, children: input };
        const viewProps = Object.assign(Object.assign({}, rest), { key: `inspector-${selectType}-${name}`, children: [
                icons.opacity,
                React__default["default"].createElement(InputContext.Provider, Object.assign({}, providerProps)),
                React__default["default"].createElement(View, { className: "start-end", key: 'start-end' },
                    React__default["default"].createElement(View, Object.assign({}, startProps)),
                    React__default["default"].createElement(View, Object.assign({}, endProps)))
            ] });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }
    DataGroupInputs[moviemasher_js.DataGroup.Opacity] = React__default["default"].createElement(OpacityGroupInput, { className: "opacity tween row", key: "opacity-group-input" });

    function PointGroupInput(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const editor = useEditor();
        const { selectType } = props;
        moviemasher_js.assertSelectType(selectType);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems: properties, changeTweening, selectedInfo } = inspectorContext;
        const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo;
        moviemasher_js.assertTimeRange(timeRange);
        moviemasher_js.assertTime(time);
        const endDefined = tweenDefined[moviemasher_js.DataGroup.Point];
        const endSelected = tweenSelected[moviemasher_js.DataGroup.Point];
        const byName = moviemasher_js.selectedPropertyObject(properties, moviemasher_js.DataGroup.Point, selectType);
        const values = moviemasher_js.selectedPropertiesScalarObject(byName);
        const { offE, offW, offN, offS, x, y, [`x${moviemasher_js.PropertyTweenSuffix}`]: xEnd, [`y${moviemasher_js.PropertyTweenSuffix}`]: yEnd } = byName;
        const xProperty = endSelected ? xEnd : x;
        const yProperty = endSelected ? yEnd : y;
        const { offE: offEValue, offW: offWValue, offN: offNValue, offS: offSValue } = values;
        const elementsByName = {};
        const inspectingProperties = [xProperty, yProperty];
        // go to first/last frame if needed and tween value defined...
        const goTime = moviemasher_js.tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected);
        inspectingProperties.forEach(selectedProperty => {
            if (!selectedProperty) {
                console.error("PointInput", xProperty, yProperty);
                return;
            }
            const { property, changeHandler, value, name: nameOveride } = selectedProperty;
            const { type, name: propertyName } = property;
            const name = nameOveride || propertyName;
            const baseName = name.replace(moviemasher_js.PropertyTweenSuffix, '');
            const input = DataTypeInputs[type];
            const key = `inspector-${selectType}-${name}`;
            const inputContext = {
                property, value, name, changeHandler, time: goTime
            };
            // if we're editing tween value, but it's not defined yet...
            if (endSelected) {
                // tell input to use start value as default, rather than the property's...
                inputContext.defaultValue = values[baseName];
            }
            const providerProps = { key, value: inputContext, children: input };
            elementsByName[baseName] = React__default["default"].createElement(InputContext.Provider, Object.assign({}, providerProps));
        });
        const selectedButton = [moviemasher_js.ClassSelected, moviemasher_js.ClassButton].join(' ');
        const startProps = {
            children: icons.start,
            className: endSelected ? moviemasher_js.ClassButton : selectedButton,
            key: 'start',
            onClick: () => {
                editor.goToTime(timeRange.startTime);
                changeTweening(moviemasher_js.DataGroup.Point, false);
            }
        };
        const endProps = {
            key: 'end',
            className: endSelected ? selectedButton : moviemasher_js.ClassButton,
            children: endDefined ? icons.end : icons.endUndefined,
            onClick: () => {
                editor.goToTime(timeRange.lastTime);
                changeTweening(moviemasher_js.DataGroup.Point, true);
            }
        };
        const legendElements = [
            icons.point,
            React__default["default"].createElement(View, { className: "start-end", key: `${selectType}-point-start-end` },
                React__default["default"].createElement(View, Object.assign({}, startProps)),
                React__default["default"].createElement(View, Object.assign({}, endProps)))
        ];
        const xElements = [React__default["default"].createElement(View, { key: "horz-icon", children: icons.horz, className: moviemasher_js.ClassButton })];
        const yElements = [React__default["default"].createElement(View, { key: "vert-icon", children: icons.vert, className: moviemasher_js.ClassButton })];
        if (offE) {
            const lockOffEProps = {
                key: "lock-east",
                className: moviemasher_js.ClassButton,
                children: offEValue ? icons.unlock : icons.lock,
                onClick: () => { offE.changeHandler('offE', !offEValue); }
            };
            const lockOffE = React__default["default"].createElement(View, Object.assign({}, lockOffEProps));
            xElements.push(lockOffE);
        }
        xElements.push(elementsByName.x);
        if (offW) {
            const lockOffWProps = {
                key: "lock-west",
                className: moviemasher_js.ClassButton,
                children: offWValue ? icons.unlock : icons.lock,
                onClick: () => { offW.changeHandler('offW', !offWValue); }
            };
            const lockOffW = React__default["default"].createElement(View, Object.assign({}, lockOffWProps));
            xElements.push(lockOffW);
        }
        if (offN) {
            const lockOffNProps = {
                key: "lock-north",
                className: moviemasher_js.ClassButton,
                children: offNValue ? icons.unlock : icons.lock,
                onClick: () => { offN.changeHandler('offN', !offNValue); }
            };
            const lockOffN = React__default["default"].createElement(View, Object.assign({}, lockOffNProps));
            yElements.push(lockOffN);
        }
        yElements.push(elementsByName.y);
        if (offS) {
            const lockOffSProps = {
                key: "lock-south",
                className: moviemasher_js.ClassButton,
                children: offSValue ? icons.unlock : icons.lock,
                onClick: () => { offS.changeHandler('offS', !offSValue); }
            };
            const lockOffS = React__default["default"].createElement(View, Object.assign({}, lockOffSProps));
            yElements.push(lockOffS);
        }
        const elements = [
            React__default["default"].createElement(View, { key: "x", children: xElements }),
            React__default["default"].createElement(View, { key: "y", children: yElements })
        ];
        return React__default["default"].createElement("fieldset", null,
            React__default["default"].createElement("legend", { key: "legend" },
                React__default["default"].createElement(View, null, legendElements)),
            elements);
    }
    DataGroupInputs[moviemasher_js.DataGroup.Point] = React__default["default"].createElement(PointGroupInput, { key: "point-input" });

    const SizeInputOrientations = {
        [moviemasher_js.Orientation.H]: 'width', [moviemasher_js.Orientation.V]: 'height'
    };
    function SizeGroupInput(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const editor = useEditor();
        const { selectType } = props;
        moviemasher_js.assertSelectType(selectType, 'selectType');
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems: properties, selectedInfo, changeTweening } = inspectorContext;
        const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo;
        moviemasher_js.assertTimeRange(timeRange);
        moviemasher_js.assertTime(time);
        const endDefined = tweenDefined[moviemasher_js.DataGroup.Size];
        const endSelected = tweenSelected[moviemasher_js.DataGroup.Size];
        const byName = moviemasher_js.selectedPropertyObject(properties, moviemasher_js.DataGroup.Size, selectType);
        const { lock, width, height, [`width${moviemasher_js.PropertyTweenSuffix}`]: widthEnd, [`height${moviemasher_js.PropertyTweenSuffix}`]: heightEnd } = byName;
        const widthProperty = endSelected ? widthEnd : width;
        const heightProperty = endSelected ? heightEnd : height;
        const values = moviemasher_js.selectedPropertiesScalarObject(byName);
        const { lock: lockValue } = values;
        moviemasher_js.assertString(lockValue, 'lockValue');
        const orientation = moviemasher_js.isOrientation(lockValue) ? lockValue : undefined;
        const elementsByName = {};
        const inspectingProperties = [widthProperty, heightProperty];
        // go to first/last frame if needed and tween value defined...
        const goTime = moviemasher_js.tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected);
        inspectingProperties.forEach(selectedProperty => {
            const { property, changeHandler, value, name: nameOveride } = selectedProperty;
            const { type, name: propertyName } = property;
            const name = nameOveride || propertyName;
            const baseName = name.replace(moviemasher_js.PropertyTweenSuffix, '');
            const input = DataTypeInputs[type];
            const key = `inspector-${selectType}-${name}`;
            const inputContext = {
                property, value, name, time: goTime
            };
            // if we're editing tween value, but it's not defined yet...
            if (endSelected) {
                // tell input to use start value as default, rather than the property's...
                inputContext.defaultValue = values[baseName];
            }
            if (!(orientation && baseName === SizeInputOrientations[orientation])) {
                inputContext.changeHandler = changeHandler;
            }
            const providerProps = {
                key, value: inputContext, children: input
            };
            elementsByName[baseName] = React__default["default"].createElement(InputContext.Provider, Object.assign({}, providerProps));
        });
        const lockWidthProps = {
            key: "lock-width",
            className: moviemasher_js.ClassButton,
            children: orientation === moviemasher_js.Orientation.H ? icons.lock : icons.unlock,
            onClick: () => {
                const value = orientation === moviemasher_js.Orientation.H ? "" : moviemasher_js.Orientation.H;
                lock.changeHandler('lock', value);
            }
        };
        const lockWidth = React__default["default"].createElement(View, Object.assign({}, lockWidthProps));
        const lockHeightProps = {
            key: "lock-height",
            className: moviemasher_js.ClassButton,
            children: orientation === moviemasher_js.Orientation.V ? icons.lock : icons.unlock,
            onClick: () => {
                const value = orientation === moviemasher_js.Orientation.V ? "" : moviemasher_js.Orientation.V;
                lock.changeHandler('lock', value);
            }
        };
        const selectedButton = [moviemasher_js.ClassSelected, moviemasher_js.ClassButton].join(' ');
        const lockHeight = React__default["default"].createElement(View, Object.assign({}, lockHeightProps));
        const startProps = {
            children: icons.start,
            className: endSelected ? moviemasher_js.ClassButton : selectedButton,
            key: 'start',
            onClick: () => {
                editor.goToTime(timeRange.startTime);
                changeTweening(moviemasher_js.DataGroup.Size, false);
            }
        };
        const endProps = {
            key: 'end',
            className: endSelected ? selectedButton : moviemasher_js.ClassButton,
            children: endDefined ? icons.end : icons.endUndefined,
            onClick: () => {
                editor.goToTime(timeRange.lastTime);
                changeTweening(moviemasher_js.DataGroup.Size, true);
            }
        };
        const legendElements = [
            icons.size,
            React__default["default"].createElement(View, { className: "start-end", key: `${selectType}-size-start-end` },
                React__default["default"].createElement(View, Object.assign({}, startProps)),
                React__default["default"].createElement(View, Object.assign({}, endProps)))
        ];
        const widthElements = [
            React__default["default"].createElement(View, { key: "width-icon", children: icons.width, className: moviemasher_js.ClassButton }),
            elementsByName.width,
            lockWidth
        ];
        const heightElements = [
            React__default["default"].createElement(View, { key: "height-icon", children: icons.height, className: moviemasher_js.ClassButton }),
            elementsByName.height,
            lockHeight
        ];
        const elements = [
            React__default["default"].createElement(View, { key: "width", children: widthElements }),
            React__default["default"].createElement(View, { key: "height", children: heightElements })
        ];
        return React__default["default"].createElement("fieldset", null,
            React__default["default"].createElement("legend", { key: "legend" },
                React__default["default"].createElement(View, null, legendElements)),
            elements);
    }
    DataGroupInputs[moviemasher_js.DataGroup.Size] = React__default["default"].createElement(SizeGroupInput, { key: "size-group-input" });

    function SizingGroupInput(props) {
        const { selectType } = props;
        moviemasher_js.assertSelectType(selectType);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems: properties } = inspectorContext;
        const byName = moviemasher_js.selectedPropertyObject(properties, moviemasher_js.DataGroup.Sizing, selectType);
        const elementsByName = Object.fromEntries(Object.entries(byName).map(([key, selectedProperty]) => {
            const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty;
            const { name: propertyName } = property;
            const name = nameOveride || propertyName;
            const propertyProps = Object.assign({ key: `inspector-${selectType}-group-${name}`, property, value, changeHandler, name }, props);
            return [key, React__default["default"].createElement(InspectorProperty, Object.assign({}, propertyProps))];
        }));
        return React__default["default"].createElement(View, null, Object.values(elementsByName));
    }
    DataGroupInputs[moviemasher_js.DataGroup.Sizing] = React__default["default"].createElement(SizingGroupInput, { key: "sizing-group-input" });

    function TimingGroupInput(props) {
        const masherContext = React__default["default"].useContext(MasherContext);
        const { icons } = masherContext;
        const { selectType } = props;
        moviemasher_js.assertSelectType(selectType);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedItems: properties } = inspectorContext;
        const byName = moviemasher_js.selectedPropertyObject(properties, moviemasher_js.DataGroup.Timing, selectType);
        const elementsByName = Object.fromEntries(Object.entries(byName).map(([key, selectedProperty]) => {
            const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty;
            const { name: propertyName } = property;
            const name = nameOveride || propertyName;
            const propertyProps = Object.assign({ key: `inspector-${selectType}-group-${name}`, property, value, changeHandler, name }, props);
            return [key, React__default["default"].createElement(InspectorProperty, Object.assign({}, propertyProps))];
        }));
        const { timing } = elementsByName, rest = __rest(elementsByName, ["timing"]);
        if (!moviemasher_js.isPopulatedObject(rest)) {
            const viewProps = {
                key: 'timing', children: [icons.timing, timing], className: 'row'
            };
            return React__default["default"].createElement(View, Object.assign({}, viewProps));
        }
        const legendElements = [icons.timing];
        if (timing)
            legendElements.push(timing);
        const elements = Object.entries(rest).map(([key, value]) => {
            const icon = icons[key];
            const children = [value];
            if (icon)
                children.unshift(React__default["default"].createElement(View, { key: `${key}-icon`, children: icon, className: moviemasher_js.ClassButton }));
            const frameProps = { key: `${key}-view`, children };
            return React__default["default"].createElement(View, Object.assign({}, frameProps));
        });
        return React__default["default"].createElement("fieldset", null,
            React__default["default"].createElement("legend", { key: "legend" },
                React__default["default"].createElement(View, null, legendElements)),
            elements);
    }
    DataGroupInputs[moviemasher_js.DataGroup.Timing] = React__default["default"].createElement(TimingGroupInput, { key: "timing-group-input" });

    /**
     * @parents Masher
     * @children InspectorContent
     */
    function Inspector(props) {
        const editor = useEditor();
        const [actionCount, setActionCount] = React__default["default"].useState(() => 0);
        const info = React__default["default"].useRef({
            tweenDefined: {}, tweenSelected: {},
            selectedType: moviemasher_js.SelectType.None, selectTypes: []
        });
        const [orderedTypes, setOrderedTypes] = React__default["default"].useState(() => moviemasher_js.SelectTypes);
        const [selectedItems, setSelectedItems] = React__default["default"].useState(() => []);
        const handleAction = () => { setActionCount(value => value + 1); };
        const handleSelection = () => {
            const { selection } = editor;
            const { selectTypes: types, clip, mash } = selection;
            const { current } = info;
            const { selectedType, selectTypes } = current;
            const bestType = orderedTypes.find(type => types.includes(type));
            moviemasher_js.assertSelectType(bestType);
            if (bestType !== selectedType) {
                // console.log("setInfo selectedType", selectedType, "=>", bestType, types)
                current.selectedType = bestType;
            }
            moviemasher_js.arraySet(selectTypes, types);
            const items = editor.selection.selectedItems([bestType]);
            const tweening = {};
            if (clip && mash) {
                const tweenItems = items.filter(item => {
                    if (!moviemasher_js.isSelectedProperty(item))
                        return;
                    const { property, name } = item;
                    const { tweenable, group } = property;
                    if (!(tweenable && group && name))
                        return;
                    return name.endsWith(moviemasher_js.PropertyTweenSuffix);
                });
                // console.log("Inspector handleSelection", tweenItems.length, "tweenItem(s)")
                tweenItems.forEach(item => {
                    const { property, value } = item;
                    const { group } = property;
                    moviemasher_js.assertDataGroup(group);
                    tweening[group] = moviemasher_js.isDefined(value);
                });
                if (tweenItems.length) {
                    const { time, quantize } = mash;
                    const timeRange = clip.timeRange(quantize);
                    current.time = time;
                    current.timeRange = timeRange;
                    // console.log("Inspector tweening", time, timeRange)
                    const frame = timeRange.frame + Math.round(timeRange.frames / 2);
                    const halfTime = moviemasher_js.timeFromArgs(frame, quantize);
                    const [midTime, timeScaled] = moviemasher_js.timeEqualizeRates(halfTime, time);
                    current.nearStart = midTime.frame > timeScaled.frame;
                    const edge = current.nearStart ? timeRange.startTime : timeRange.lastTime;
                    current.onEdge = time.equalsTime(edge);
                }
            }
            current.tweenDefined = tweening;
            setSelectedItems(items);
            handleAction();
        };
        useListeners({
            [moviemasher_js.EventType.Action]: handleAction,
            [moviemasher_js.EventType.Selection]: handleSelection,
        });
        const changeSelected = React__default["default"].useCallback((type) => {
            moviemasher_js.assertSelectType(type);
            setOrderedTypes(original => {
                const index = original.indexOf(type);
                moviemasher_js.assertPositive(index);
                const types = [type];
                if (index)
                    types.push(...original.slice(0, index));
                if (index < original.length - 1)
                    types.push(...original.slice(index + 1));
                moviemasher_js.assertTrue(types.length === original.length, 'type lengths match');
                // console.log("setOrderedTypes", original, "=>", types)
                moviemasher_js.arraySet(original, types);
                handleSelection();
                return original;
            });
            info.current.selectedType = type;
            setSelectedItems(editor.selection.selectedItems([type]));
        }, []);
        const changeTweening = (group, tweening) => {
            info.current.tweenSelected[group] = tweening;
            handleSelection();
        };
        const inspectorContext = Object.assign(Object.assign({}, InspectorContextDefault), { actionCount, selectedItems,
            changeSelected,
            changeTweening, selectedInfo: info.current });
        return (React__default["default"].createElement(InspectorContext.Provider, { value: inspectorContext },
            React__default["default"].createElement(View, Object.assign({}, props))));
    }

    /**
     * @parents Inspector
     */
    function InspectorContent(props) {
        return React__default["default"].createElement(View, Object.assign({}, props));
    }

    /**
     * @parents InspectorContent
     */
    function InspectorPicked(props) {
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { selectedInfo } = inspectorContext;
        const { selectedType } = selectedInfo;
        const { type, types, children } = props;
        const selectTypes = propsSelectTypes(type, types);
        moviemasher_js.assertPopulatedArray(selectTypes);
        if (!selectTypes.includes(selectedType))
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, children);
    }

    /**
     * @parents Inspector
     */
    function InspectorPicker(props) {
        const { id, children, className } = props;
        moviemasher_js.assertSelectType(id);
        const inspectorContext = React__default["default"].useContext(InspectorContext);
        const { changeSelected, selectedInfo } = inspectorContext;
        const { selectTypes, selectedType } = selectedInfo;
        if (!selectTypes.includes(id))
            return null;
        const onClick = () => { changeSelected(id); };
        const classes = [];
        if (moviemasher_js.isPopulatedString(className))
            classes.push(className);
        if (selectedType === id)
            classes.push(moviemasher_js.ClassSelected);
        const viewProps = { children, onClick, className: classes.join(' ') };
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const InspectorPropsDefault = function (props = {}) {
        var _a, _b, _c, _d, _e;
        const optionsStrict = panelOptionsStrict(props);
        const { icons } = optionsStrict;
        (_a = optionsStrict.props).key || (_a.key = 'inspector');
        (_b = optionsStrict.props).className || (_b.className = 'panel inspector');
        (_c = optionsStrict.header).content || (_c.content = [
            icons.inspector,
            React__default["default"].createElement(EditorUndoButton, { key: 'undo' },
                React__default["default"].createElement(Button, null,
                    icons.undo,
                    labelTranslate('undo'))),
            React__default["default"].createElement(EditorRedoButton, { key: 'redo' },
                React__default["default"].createElement(Button, null,
                    icons.redo,
                    labelTranslate('redo'))),
        ]);
        (_d = optionsStrict.footer).content || (_d.content = [
            React__default["default"].createElement(InspectorPicker, { key: "mash", className: moviemasher_js.ClassButton, id: "mash" }, icons.document),
            React__default["default"].createElement(InspectorPicker, { key: "cast", className: moviemasher_js.ClassButton, id: "cast" }, icons.document),
            React__default["default"].createElement(InspectorPicker, { key: "layer", className: moviemasher_js.ClassButton, id: "layer" }, icons.composer),
            React__default["default"].createElement(InspectorPicker, { key: "clip", className: moviemasher_js.ClassButton, id: "clip" }, icons.clip),
            React__default["default"].createElement(InspectorPicker, { key: "container", className: moviemasher_js.ClassButton, id: "container" }, icons.container),
            React__default["default"].createElement(InspectorPicker, { key: "content", className: moviemasher_js.ClassButton, id: "content" }, icons.content),
        ]);
        const contentChildren = [React__default["default"].createElement(InspectorProperties, { key: "properties" })];
        const types = [moviemasher_js.SelectType.Clip, moviemasher_js.SelectType.Track, moviemasher_js.SelectType.Layer];
        contentChildren.push(React__default["default"].createElement(ApiEnabled, { key: "api-enabled" },
            React__default["default"].createElement(InspectorPicked, { type: "mash", key: "inspector-mash" },
                React__default["default"].createElement(View, null,
                    React__default["default"].createElement(RenderControl, { key: 'render-process' },
                        React__default["default"].createElement(Button, null,
                            labelTranslate('render'),
                            icons.render)),
                    React__default["default"].createElement(ViewControl, { key: 'view-control' },
                        React__default["default"].createElement(Button, null,
                            labelTranslate('view'),
                            icons.view)))),
            React__default["default"].createElement(InspectorPicked, { types: "mash,cast", key: "inspector-document" },
                React__default["default"].createElement(SelectEditedControl, { key: "select-edited", className: "row", children: icons.document }),
                React__default["default"].createElement(View, { key: "view" },
                    React__default["default"].createElement(SaveControl, { key: 'save-process' },
                        React__default["default"].createElement(Button, { key: "button" },
                            labelTranslate('update'),
                            icons.document)),
                    React__default["default"].createElement(CreateEditedControl, { key: "create-edited" },
                        React__default["default"].createElement(Button, null,
                            labelTranslate('create'),
                            icons.document))))));
        types.forEach(type => {
            contentChildren.push(React__default["default"].createElement(InspectorPicked, { key: `${type}-delete`, type: type },
                React__default["default"].createElement(EditorRemoveButton, { type: type },
                    React__default["default"].createElement(Button, null,
                        labelInterpolate('delete', { type }),
                        icons.remove))));
        });
        (_e = optionsStrict.content).children || (_e.children = React__default["default"].createElement(React__default["default"].Fragment, null, contentChildren));
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.header)),
            React__default["default"].createElement(InspectorContent, Object.assign({}, optionsStrict.content.props), optionsStrict.content.children),
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.footer)));
        return Object.assign(Object.assign({}, optionsStrict.props), { children });
    };

    /**
     * @parents ApiClient, Masher
     * @children Browser, Timeline, Inspector, Player, Composer
     * @returns provided children wrapped in a {@link View} and {@link MasherContext}
     */
    function Masher(props) {
        const { editType = moviemasher_js.EditType.Mash, previewSize, icons = {}, edited } = props, rest = __rest(props, ["editType", "previewSize", "icons", "edited"]);
        const editorIndexRef = React__default["default"].useRef({});
        const svgRef = React__default["default"].useRef(null);
        const { current: editorIndex } = editorIndexRef;
        const [definition, setDefinition] = React__default["default"].useState();
        const ref = React__default["default"].useRef(null);
        const apiContext = React__default["default"].useContext(ApiContext);
        const [editor] = React__default["default"].useState(() => moviemasher_js.editorInstance({ editType }));
        const [requested, setRequested] = React__default["default"].useState(false);
        const [draggable, setDraggable] = React__default["default"].useState();
        const { enabled, endpointPromise, servers } = apiContext;
        React__default["default"].useEffect(() => {
            elementSetPreviewSize(ref.current, previewSize);
        }, [previewSize]);
        const editorLoad = (object) => {
            const loadObject = object || edited || { [editType]: {}, definitions: [] };
            const { previewSize: size = previewSize } = loadObject, rest = __rest(loadObject, ["previewSize"]);
            const { current: svg } = svgRef;
            const { current: div } = ref;
            moviemasher_js.assertObject(svg);
            if (moviemasher_js.sizeAboveZero(size)) {
                elementSetPreviewSize(div, size);
                // editor.rect = size
            }
            editor.svgElement = svg;
            editor.load(rest);
        };
        React__default["default"].useEffect(() => {
            if (!enabled) {
                editorLoad();
                return;
            }
            if (!requested && servers[moviemasher_js.ServerType.Data]) {
                setRequested(true);
                const request = {};
                const promise = endpointPromise(moviemasher_js.Endpoints.data[editType].default, request);
                promise.then((response) => {
                    var _a;
                    console.debug("DataDefaultResponse", moviemasher_js.Endpoints.data[editType].default, response);
                    __rest(response, ["previewSize"]);
                    if ((_a = servers.file) === null || _a === void 0 ? void 0 : _a.prefix) {
                        editor.preloader.endpoint.prefix = String(servers.file.prefix);
                    }
                    editorLoad(response);
                });
            }
        }, [servers]);
        const dropFiles = (files, editorIndex) => {
            const fileInfos = dropFilesFromList(files, servers.file);
            if (fileInfos.length) {
                const errors = [];
                const validFiles = [];
                const { eventTarget } = editor;
                fileInfos.forEach(fileInfo => {
                    if (fileInfo instanceof File)
                        validFiles.push(fileInfo);
                    else
                        errors.push(fileInfo);
                });
                if (errors.length) {
                    errors.forEach(error => {
                        const id = moviemasher_js.idGenerate('activity-error');
                        const info = Object.assign({ id, type: moviemasher_js.ActivityType.Error }, error);
                        eventTarget.emit(moviemasher_js.EventType.Active, info);
                    });
                }
                if (validFiles.length)
                    return editor.addFiles(validFiles, editorIndex);
            }
            return Promise.resolve([]);
        };
        const dropDefinitionObject = (definitionObject, editorIndex) => {
            // console.log("Masher onDrop DefinitionObject...", definitionObject, editorIndex)
            return editor.add(definitionObject, editorIndex);
        };
        const drop = (draggable, editorIndex) => {
            if (!draggable)
                return Promise.resolve([]);
            // console.log("Masher drop editorIndex = ", editorIndex)
            if (moviemasher_js.isClip(draggable)) {
                // console.log("Masher drop Clip")
                return Promise.resolve([]);
            }
            if (moviemasher_js.isEffect(draggable)) {
                // console.log("Masher drop Effect")
                return Promise.resolve([]);
            }
            if (moviemasher_js.isLayer(draggable)) {
                // console.log("Masher drop Layer")
                return Promise.resolve([]);
            }
            if (moviemasher_js.isDefinitionObject(draggable)) {
                // console.log("Masher drop DefinitionObject")
                return dropDefinitionObject(draggable, editorIndex);
            }
            if (moviemasher_js.isMashAndDefinitionsObject(draggable)) {
                // console.log("Masher drop MashAndDefinitionsObject")
                return Promise.resolve([]);
            }
            return dropFiles(draggable, editorIndex).then(definitions => {
                // console.log("Masher.dropFiles", definitions)
                const [definition] = definitions;
                if (moviemasher_js.isDefinition(definition))
                    changeDefinition(definition);
                return definitions;
            });
        };
        const delayPromise = () => (new Promise(resolve => { setTimeout(resolve, 2000); }));
        const handleApiCallback = (id, definition, callback) => {
            console.debug("handleApiCallback request", callback);
            const { eventTarget } = editor;
            return moviemasher_js.fetchCallback(callback).then((response) => {
                console.debug("handleApiCallback response", response);
                const { apiCallback, error } = response;
                if (error)
                    return handleError(callback.endpoint.prefix, error, id);
                if (apiCallback) {
                    const { request, endpoint } = apiCallback;
                    if (endpoint.prefix === moviemasher_js.Endpoints.data.definition.put) {
                        moviemasher_js.assertObject(request);
                        const { body } = request;
                        moviemasher_js.assertObject(body);
                        const putRequest = body;
                        const { definition: definitionObject } = putRequest;
                        // console.debug("handleApiCallback calling updateDefinition", definitionObject)
                        editor.updateDefinition(definitionObject, definition);
                    }
                    if (callback.endpoint.prefix === moviemasher_js.Endpoints.rendering.status) {
                        const statusResponse = response;
                        let steps = 0;
                        let step = 0;
                        moviemasher_js.OutputTypes.forEach(type => {
                            const state = statusResponse[type];
                            if (!state)
                                return;
                            steps += state.total;
                            step += state.completed;
                        });
                        if (steps)
                            eventTarget.emit(moviemasher_js.EventType.Active, {
                                id, step, steps, type: moviemasher_js.ActivityType.Render
                            });
                    }
                    return delayPromise().then(() => handleApiCallback(id, definition, apiCallback));
                }
                eventTarget.emit(moviemasher_js.EventType.Active, { id, type: moviemasher_js.ActivityType.Complete });
            });
        };
        const handleError = (endpoint, error, id) => {
            editor.eventTarget.emit(moviemasher_js.EventType.Active, {
                id, type: moviemasher_js.ActivityType.Error, error: 'import.render', value: error
            });
            console.error(endpoint, error);
            return Promise.reject(error);
        };
        const saveDefinitionsPromise = (definitions) => {
            let promise = Promise.resolve();
            const { eventTarget } = editor;
            definitions.forEach(definition => {
                moviemasher_js.assertPreloadableDefinition(definition);
                const { label, type, source } = definition;
                const id = moviemasher_js.idGenerate('activity');
                eventTarget.emit(moviemasher_js.EventType.Active, { id, label, type: moviemasher_js.ActivityType.Render });
                const { rendering } = moviemasher_js.Endpoints;
                const responsePromise = fetch(source);
                const blobPromise = responsePromise.then(response => response.blob());
                const filePromise = blobPromise.then(blob => new File([blob], label));
                const callbackPromise = filePromise.then(file => {
                    const request = { type, name: label, size: file.size };
                    console.debug("RenderingUploadRequest", rendering.upload, request);
                    const responsePromise = endpointPromise(rendering.upload, request);
                    return responsePromise.then((response) => {
                        console.debug("RenderingUploadResponse", rendering.upload, response);
                        const { error, fileApiCallback, apiCallback, fileProperty } = response;
                        if (error)
                            return handleError(rendering.upload, error, id);
                        else if (fileApiCallback && fileApiCallback.request) {
                            if (fileProperty)
                                fileApiCallback.request.body[fileProperty] = file;
                            else
                                fileApiCallback.request.body = file;
                            return moviemasher_js.fetchCallback(fileApiCallback).then((response) => {
                                console.debug("FileStoreResponse", response);
                                const { error } = response;
                                if (error)
                                    return handleError(fileApiCallback.endpoint.prefix, error, id);
                                moviemasher_js.assertObject(apiCallback);
                                return handleApiCallback(id, definition, apiCallback);
                            });
                        }
                        moviemasher_js.assertObject(apiCallback);
                        return handleApiCallback(id, definition, apiCallback);
                    });
                });
                promise = promise.then(() => callbackPromise);
            });
            return promise;
        };
        const save = () => __awaiter(this, void 0, void 0, function* () {
            const { definitionsUnsaved } = editor;
            const definitionsPromise = saveDefinitionsPromise(definitionsUnsaved);
            const requestPromise = definitionsPromise.then(() => editor.dataPutRequest());
            const savePromise = requestPromise.then(request => {
                const { editType } = editor;
                console.debug("DataPutRequest", moviemasher_js.Endpoints.data[editType].put, JSON.parse(JSON.stringify(request)));
                endpointPromise(moviemasher_js.Endpoints.data[editType].put, request).then((response) => {
                    console.debug("DataPutResponse", moviemasher_js.Endpoints.data[editType].put, response);
                    const { error, temporaryIdLookup } = response;
                    if (error)
                        console.error(moviemasher_js.Endpoints.data[editType].put, error);
                    else
                        editor.saved(temporaryIdLookup);
                });
            });
            yield savePromise;
        });
        const changeDefinition = (definition) => {
            setDefinition(definition);
        };
        const editorContext = {
            editor, draggable, setDraggable, save, editorIndex, drop,
            definition, changeDefinition, icons
        };
        const viewProps = Object.assign(Object.assign({}, rest), { onDrop: moviemasher_js.eventStop, ref });
        return (React__default["default"].createElement(MasherContext.Provider, { value: editorContext },
            React__default["default"].createElement(View, Object.assign({}, viewProps)),
            React__default["default"].createElement("svg", { style: { display: 'none' }, ref: svgRef })));
    }

    const PlayerContextDefault = {
        paused: false,
        changePaused: moviemasher_js.EmptyMethod,
        changeVolume: moviemasher_js.EmptyMethod,
        volume: 0,
    };
    const PlayerContext = React__default["default"].createContext(PlayerContextDefault);

    const PlayerRefreshRate = 10;
    /**
     * @parents Player
     */
    function PlayerContent(props) {
        const { children, className } = props, rest = __rest(props, ["children", "className"]);
        const editor = useEditor();
        const [rect, setRect] = React__default["default"].useState(() => (moviemasher_js.rectCopy(editor.rect)));
        const svgRef = React__default["default"].useRef(null); //SVGSVGElement
        const viewRef = React__default["default"].useRef(null);
        const masherContext = React__default["default"].useContext(MasherContext);
        const [over, setOver] = React__default["default"].useState(false);
        const playerContext = React__default["default"].useContext(PlayerContext);
        const { disabled } = playerContext;
        const { drop } = masherContext;
        const watchingRef = React__default["default"].useRef({});
        const { current: watching } = watchingRef;
        const handleResize = () => {
            const { current } = viewRef;
            if (!current)
                return;
            const rect = moviemasher_js.rectRound(current.getBoundingClientRect());
            setRect(() => {
                editor.rect = rect;
                return moviemasher_js.rectCopy(rect);
            });
        };
        const [resizeObserver] = React__default["default"].useState(new ResizeObserver(handleResize));
        React__default["default"].useEffect(() => {
            const { current } = viewRef;
            if (current)
                resizeObserver.observe(current);
            return () => { resizeObserver.disconnect(); };
        }, []);
        const swapChildren = (elements) => {
            const { current } = svgRef;
            if (!current)
                return;
            current.replaceChildren(...elements);
        };
        const requestItemsPromise = () => {
            const { redraw } = watching;
            delete watching.timeout;
            delete watching.redraw;
            return editor.previewItems(!disabled).then(svgs => {
                swapChildren(svgs);
                if (redraw)
                    handleDraw();
            });
        };
        const requestItems = () => { requestItemsPromise().then(moviemasher_js.EmptyMethod); };
        const handleDraw = () => {
            const { current } = svgRef;
            const { rect } = editor;
            if (!(current && moviemasher_js.sizeAboveZero(rect)))
                return;
            if (watching.timeout) {
                watching.redraw = true;
                return;
            }
            watching.timeout = setTimeout(requestItems, PlayerRefreshRate);
        };
        useListeners({ [moviemasher_js.EventType.Draw]: handleDraw, [moviemasher_js.EventType.Selection]: handleDraw });
        const dragValid = (dataTransfer) => {
            if (!dataTransfer)
                return false;
            const types = dragTypes(dataTransfer);
            if (types.includes(TransferTypeFiles))
                return true;
            return moviemasher_js.isDefinitionType(dragType(dataTransfer));
        };
        const onDragLeave = (event) => {
            moviemasher_js.eventStop(event);
            setOver(false);
        };
        const onDrop = (event) => {
            onDragLeave(event);
            const { dataTransfer } = event;
            if (!dragValid(dataTransfer))
                return;
            const { edited } = editor;
            moviemasher_js.assertObject(edited);
            const editorIndex = {
                clip: editor.time.scale(edited.quantize).frame,
                track: -1,
            };
            const types = dragTypes(dataTransfer);
            if (types.includes(TransferTypeFiles)) {
                drop(dataTransfer.files, editorIndex);
            }
            else {
                const type = dragType(dataTransfer);
                moviemasher_js.assertDefinitionType(type);
                const data = dragData(dataTransfer, type);
                assertDragDefinitionObject(data);
                drop(data.definitionObject, editorIndex);
            }
        };
        const onDragOver = (event) => {
            moviemasher_js.eventStop(event);
            setOver(dragValid(event.dataTransfer));
        };
        const classes = [];
        if (className)
            classes.push(className);
        if (over)
            classes.push(moviemasher_js.ClassDropping);
        const viewProps = Object.assign(Object.assign({}, rest), { ref: viewRef, className: classes.join(' '), key: 'player-content', onDragOver, onDrop, onDragLeave, onPointerDown: () => { editor.selection.unset(moviemasher_js.SelectType.Clip); } });
        if (moviemasher_js.sizeAboveZero(rect)) {
            const svgProps = { ref: svgRef, key: "svg", className: 'svgs' };
            const nodes = [React__default["default"].createElement("div", Object.assign({}, svgProps))];
            if (children) {
                const child = React__default["default"].Children.only(children);
                if (React__default["default"].isValidElement(child))
                    nodes.push(child);
            }
            viewProps.children = nodes;
        }
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     *
     * @parents Player
     */
    function PlayerButton(props) {
        const playerContext = React__default["default"].useContext(PlayerContext);
        const { paused, changePaused: setPaused } = playerContext;
        const onClick = () => { setPaused(!paused); };
        const viewProps = Object.assign(Object.assign({}, props), { key: 'player-button', onClick });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function PlayerTimeControl(props) {
        const editor = useEditor();
        const getTimeRange = () => editor.timeRange.timeRange;
        const [timeRange, setTimeRange] = React__default["default"].useState(getTimeRange);
        const update = () => { setTimeRange(getTimeRange()); };
        useListeners({
            [moviemasher_js.EventType.Time]: update,
            [moviemasher_js.EventType.Duration]: update,
        }, editor.eventTarget);
        const onChange = (_event, values) => {
            const number = moviemasher_js.isArray(values) ? values[0] : values;
            editor.time = moviemasher_js.timeFromArgs(number, timeRange.fps);
        };
        const sliderProps = Object.assign({ value: timeRange.frame, min: 0, max: timeRange.frames, step: 1, onChange, className: 'frame slider' }, props);
        return React__default["default"].createElement(Slider, Object.assign({}, sliderProps));
    }

    /**
     *
     * @group Player
     */
    function PlayerPlaying(props) {
        const playerContext = React__default["default"].useContext(PlayerContext);
        if (playerContext.paused)
            return null;
        return props.children;
    }

    /**
     *
     * @group Player
     */
    function PlayerNotPlaying(props) {
        const playerContext = React__default["default"].useContext(PlayerContext);
        if (!playerContext.paused)
            return null;
        return props.children;
    }

    /**
     *
     * @parents Editor
     */
    function PlayerTime(props) {
        const editor = useEditor();
        const getTimeRange = () => editor.timeRange;
        const [timeRange, setTimeRange] = React__default["default"].useState(getTimeRange);
        const update = () => { setTimeRange(getTimeRange()); };
        useListeners({
            [moviemasher_js.EventType.Time]: update, [moviemasher_js.EventType.Duration]: update,
        }, editor.eventTarget);
        const { seconds, fps, lengthSeconds } = timeRange;
        const viewChildren = [
            moviemasher_js.stringSeconds(seconds, fps, lengthSeconds), "/",
            moviemasher_js.stringSeconds(lengthSeconds, fps, lengthSeconds),
        ];
        const viewProps = Object.assign(Object.assign({}, props), { key: 'player-time', children: viewChildren });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    const DefaultPlayerProps = function (props = {}) {
        var _a, _b, _c, _d, _e;
        const optionsStrict = panelOptionsStrict(props);
        const { icons } = optionsStrict;
        (_a = optionsStrict.props).key || (_a.key = 'player');
        (_b = optionsStrict.props).className || (_b.className = 'panel player');
        (_c = optionsStrict.content).children || (_c.children = React__default["default"].createElement(PlayerContent, Object.assign({}, optionsStrict.content.props),
            React__default["default"].createElement(View, { key: "drop-box", className: "drop-box" })));
        (_d = optionsStrict.header).content || (_d.content = [icons.app]);
        (_e = optionsStrict.footer).content || (_e.content = [
            React__default["default"].createElement(PlayerButton, { key: 'play-button', className: moviemasher_js.ClassButton },
                React__default["default"].createElement(PlayerPlaying, { key: 'playing' }, icons.playerPause),
                React__default["default"].createElement(PlayerNotPlaying, { key: 'not-playing' }, icons.playerPlay)),
            React__default["default"].createElement(PlayerTimeControl, { key: 'time-slider' }),
            React__default["default"].createElement(PlayerTime, { key: 'time', className: "time" })
        ]);
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.header)),
            optionsStrict.content.children,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.footer)));
        return Object.assign(Object.assign({}, optionsStrict.props), { children });
    };

    /**
     * @parents TimelineScrubber
     */
    function TimelineScrubberElement(props) {
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const { scale, frame } = timelineContext;
        const calculateViewProps = () => {
            const viewProps = Object.assign(Object.assign({}, props), { style: { left: moviemasher_js.pixelFromFrame(frame, scale) } });
            return viewProps;
        };
        const viewProps = React__default["default"].useMemo(calculateViewProps, [frame, scale]);
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents TimelineTracks
     */
    function TimelineTrack(props) {
        const editor = useEditor();
        const { selection } = editor;
        const { mash } = selection;
        const { className: propsClassName, children } = props, rest = __rest(props, ["className", "children"]);
        const child = React__default["default"].Children.only(children);
        moviemasher_js.assertTrue(React__default["default"].isValidElement(child));
        const trackContext = React__default["default"].useContext(TrackContext);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const { track } = trackContext;
        const { dragTypeValid, onDragLeave, onDrop, droppingTrack, setDroppingTrack, droppingPosition, setDroppingPosition, setDroppingClip, selectedTrack, } = timelineContext;
        const calculatedClassName = () => {
            const selected = track === selectedTrack;
            const classes = [];
            if (propsClassName)
                classes.push(propsClassName);
            if (selected)
                classes.push(moviemasher_js.ClassSelected);
            if (droppingTrack === track)
                classes.push(droppingPositionClass(droppingPosition));
            return classes.join(' ');
        };
        const className = React__default["default"].useMemo(calculatedClassName, [droppingPosition, droppingTrack, selectedTrack]);
        if (!(mash && track))
            return null;
        // assertMash(mash)
        // assertTrack(track)
        const { clips, dense, index } = track;
        const childNodes = () => {
            let prevClipEnd = dense ? -1 : 0;
            const childProps = child.props;
            return clips.map(clip => {
                const cloneProps = Object.assign(Object.assign({}, childProps), { key: clip.id });
                const children = React__default["default"].cloneElement(child, cloneProps);
                const contextProps = { children, value: { clip, prevClipEnd }, key: clip.id };
                const context = React__default["default"].createElement(ClipContext.Provider, Object.assign({}, contextProps));
                if (!dense)
                    prevClipEnd = clip.frames + clip.frame;
                return context;
            });
        };
        const onDragOver = (event) => {
            moviemasher_js.eventStop(event);
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const definitionType = dragTypeValid(dataTransfer);
            const pos = definitionType ? moviemasher_js.DroppingPosition.At : moviemasher_js.DroppingPosition.None;
            setDroppingClip();
            setDroppingTrack(definitionType ? track : undefined);
            setDroppingPosition(pos);
        };
        const viewProps = Object.assign(Object.assign({}, rest), { className, children: childNodes(), onDragLeave, onDragOver, onDrop, key: `track-${index}` });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Timeline
     */
    function TimelineSizer(props) {
        const ref = React__default["default"].useRef(null);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const handleResize = () => {
            const { setRect } = timelineContext;
            const rect = ref.current.getBoundingClientRect();
            // console.log("handleResize width", rect.width)
            setRect(rect);
        };
        const [resizeObserver] = React__default["default"].useState(new ResizeObserver(handleResize));
        React__default["default"].useEffect(() => {
            const { current } = ref;
            if (current)
                resizeObserver.observe(current);
            return () => { resizeObserver.disconnect(); };
        }, [ref.current]);
        const viewProps = Object.assign(Object.assign({}, props), { ref });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Timeline
     */
    function TimelineZoomer(props) {
        const editor = useEditor();
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const getDisabled = () => !editor.selection.mash;
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({ [moviemasher_js.EventType.Selection]: updateDisabled });
        const handleChange = (_event, values) => {
            const number = moviemasher_js.isArray(values) ? values[0] : values;
            if (timelineContext.zoom !== number)
                timelineContext.setZoom(number);
        };
        const sliderProps = Object.assign({ disabled, key: 'time-slider', value: timelineContext.zoom, min: 0.0, max: 1.0, step: 0.01, onChange: handleChange }, props);
        return React__default["default"].createElement(Slider, Object.assign({ className: 'zoom slider' }, sliderProps));
    }

    /**
     * @parents TimelineContent
     * @children TimelineTrack
     */
    function TimelineTracks(props) {
        const [refresh, setRefreshed] = React__default["default"].useState(() => 0);
        const updateRefreshed = () => { setRefreshed(nonce => nonce + 1); };
        const editor = useEditor();
        useListeners({
            [moviemasher_js.EventType.Mash]: updateRefreshed, [moviemasher_js.EventType.Track]: updateRefreshed,
        });
        const { children } = props;
        const childNodes = () => {
            const { mash } = editor.selection;
            if (!mash)
                return [];
            const { tracks } = mash;
            const reversedTracks = moviemasher_js.arrayReversed(tracks);
            return reversedTracks.map((track, i) => {
                const { identifier, index } = track;
                const clones = React__default["default"].Children.map(children, child => {
                    if (!React__default["default"].isValidElement(child))
                        throw `TimelineTracks`;
                    return React__default["default"].cloneElement(child, {
                        key: `track-clone-${i}-${index}-${identifier}`
                    });
                });
                const contextProps = {
                    children: clones,
                    value: { track },
                    key: `track-context-${i}-${index}-${identifier}`
                };
                return React__default["default"].createElement(TrackContext.Provider, Object.assign({}, contextProps));
            });
        };
        const viewChildren = React__default["default"].useMemo(childNodes, [refresh]);
        const fragmentProps = {
            key: `track-content`,
            children: viewChildren,
        };
        return React__default["default"].createElement(React__default["default"].Fragment, Object.assign({}, fragmentProps));
    }

    /**
     * @parents Timeline
     */
    function TimelineScrubber(props) {
        const editor = useEditor();
        const clientXRef = React__default["default"].useRef(-1);
        const ref = React__default["default"].useRef(null);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const { frames, scale, rect } = timelineContext;
        const { className, inactive, styleHeight, styleWidth } = props, rest = __rest(props, ["className", "inactive", "styleHeight", "styleWidth"]);
        const getDisabled = () => !editor.selection.mash;
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({ [moviemasher_js.EventType.Selection]: updateDisabled });
        const addHandlers = () => {
            const { window } = globalThis;
            const removeWindowHandlers = () => {
                window.removeEventListener('pointermove', pointerMove);
                window.removeEventListener('pointerup', pointerUp);
            };
            const pointerMove = (event) => {
                moviemasher_js.eventStop(event);
                const { current } = ref;
                if (!(current && editor.selection.mash))
                    return;
                const { clientX } = event;
                if (clientXRef.current === clientX)
                    return;
                clientXRef.current = clientX;
                const rect = current.getBoundingClientRect();
                const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x));
                const frame = moviemasher_js.pixelToFrame(pixel, scale, 'floor');
                editor.time = moviemasher_js.timeFromArgs(frame, editor.selection.mash.quantize);
            };
            const pointerUp = (event) => {
                pointerMove(event);
                removeWindowHandlers();
            };
            const pointerDown = (event) => {
                event.stopPropagation();
                clientXRef.current = -1;
                window.addEventListener('pointermove', pointerMove);
                window.addEventListener('pointerup', pointerUp);
                pointerMove(event);
            };
            return pointerDown;
        };
        const { width, height } = rect;
        const calculateViewProps = () => {
            const classes = [];
            if (className)
                classes.push(className);
            if (disabled)
                classes.push(moviemasher_js.ClassDisabled);
            const viewProps = Object.assign(Object.assign({}, rest), { ref, className: classes.join(' ') });
            if (styleWidth || styleHeight) {
                const style = {};
                if (styleHeight)
                    style.minHeight = height;
                if (styleWidth) {
                    const width = moviemasher_js.pixelFromFrame(frames, scale, 'ceil');
                    style.minWidth = Math.max(width, width);
                }
                viewProps.style = style;
            }
            if (!(inactive || disabled))
                viewProps.onPointerDown = addHandlers();
            return viewProps;
        };
        const viewProps = React__default["default"].useMemo(calculateViewProps, [frames, scale, width, height, disabled]);
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Timeline
     * @children TimelineTracks, TimelineScrubber, TimelineSizer
     */
    function TimelineContent(props) {
        const { className } = props, rest = __rest(props, ["className"]);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const { dragTypeValid, onDrop: contextDrop, setScroll, setDroppingClip, setDroppingTrack, setDroppingPosition } = timelineContext;
        const ref = React__default["default"].useRef(null);
        const [over, setOver] = React__default["default"].useState(false);
        const editor = useEditor();
        const resetScroll = () => { var _a; (_a = ref.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, 0); };
        useListeners({ [moviemasher_js.EventType.Mash]: resetScroll });
        const onPointerDown = (event) => {
            editor.selection.unset(moviemasher_js.SelectType.Track);
        };
        const onScroll = () => {
            const { current } = ref;
            if (!current)
                return;
            const { scrollLeft: x, scrollTop: y } = current;
            setScroll({ x, y });
        };
        const onDragLeave = (event) => {
            moviemasher_js.eventStop(event);
            setOver(false);
        };
        const onDrop = (event) => {
            onDragLeave(event);
            contextDrop(event);
        };
        const onDragOver = (event) => {
            moviemasher_js.eventStop(event);
            const { dataTransfer } = event;
            if (!dataTransfer)
                return;
            const valid = dragTypeValid(dataTransfer);
            const pos = valid ? moviemasher_js.DroppingPosition.At : moviemasher_js.DroppingPosition.None;
            setDroppingClip();
            setDroppingTrack();
            setDroppingPosition(pos);
            setOver(valid);
        };
        const classes = [];
        if (className)
            classes.push(className);
        if (over)
            classes.push(moviemasher_js.ClassDropping);
        const viewProps = Object.assign(Object.assign({ className: classes.join(' ') }, rest), { onPointerDown, onScroll, onDragOver, onDragLeave, onDrop, ref });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function TimelineAddTrackControl(props) {
        const editor = useEditor();
        const getDisabled = () => !editor.selection.mash;
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({ [moviemasher_js.EventType.Selection]: updateDisabled });
        const { children } = props, rest = __rest(props, ["children"]);
        const cloneProps = Object.assign(Object.assign({}, rest), { disabled });
        cloneProps.onClick = () => { editor.addTrack(); };
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), cloneProps);
    }

    /**
     * @parents TimelineTracks
     * @children TimelineTracks, TimelineScrubber, TimelineScrubberElement, TimelineSizer
     */
    function TimelineTrackIcon(props) {
        const { className: propsClassName, icons } = props, rest = __rest(props, ["className", "icons"]);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const trackContext = React__default["default"].useContext(TrackContext);
        const { droppingTrack, droppingPosition, selectedTrack } = timelineContext;
        const { track } = trackContext;
        const calculatedClassName = () => {
            const classes = [];
            if (propsClassName)
                classes.push(propsClassName);
            if (track === selectedTrack)
                classes.push(moviemasher_js.ClassSelected);
            if (track === droppingTrack)
                classes.push(droppingPositionClass(droppingPosition));
            return classes.join(' ');
        };
        const className = React__default["default"].useMemo(calculatedClassName, [droppingPosition, droppingTrack, selectedTrack]);
        if (!track)
            return null;
        const { dense, index } = track;
        const children = dense ? icons.trackDense : icons.track;
        const viewProps = Object.assign(Object.assign({}, rest), { className, children, key: `track-icon-${index}` });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Timeline
     */
    function TimelineZoom(props) {
        const editor = useEditor();
        const { zoom, children } = props, rest = __rest(props, ["zoom", "children"]);
        const timelineContext = React__default["default"].useContext(TimelineContext);
        const getDisabled = () => !editor.selection.mash;
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({ [moviemasher_js.EventType.Selection]: updateDisabled });
        const onClick = () => { timelineContext.setZoom(zoom); };
        const buttonOptions = Object.assign(Object.assign({}, rest), { onClick, disabled });
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), buttonOptions);
    }

    function TimelineAddClipControl(props) {
        const editor = useEditor();
        const editorContext = React__default["default"].useContext(MasherContext);
        const { definition, drop } = editorContext;
        const getDisabled = () => !editor.selection.mash;
        const [disabled, setDisabled] = React__default["default"].useState(getDisabled);
        const updateDisabled = () => { setDisabled(getDisabled()); };
        useListeners({ [moviemasher_js.EventType.Selection]: updateDisabled });
        const { children } = props, rest = __rest(props, ["children"]);
        const cloneProps = Object.assign(Object.assign({}, rest), { disabled });
        cloneProps.onClick = () => {
            const { selection, edited } = editor;
            const { clip, track } = selection;
            const object = (definition === null || definition === void 0 ? void 0 : definition.toJSON()) || { id: moviemasher_js.DefaultContentId };
            const editorIndex = {
                clip: 0, track: -1
            };
            if (clip && track) {
                editorIndex.clip = track.dense ? track.clips.indexOf(clip) : clip.endFrame;
                editorIndex.track = track.index;
            }
            else {
                editorIndex.clip = editor.time.scale(edited.quantize).frame;
            }
            drop(object, editorIndex);
        };
        return React__default["default"].cloneElement(React__default["default"].Children.only(children), cloneProps);
    }

    const DefaultTimelineProps = function (props = {}) {
        var _a, _b, _c, _d, _e;
        const optionsStrict = panelOptionsStrict(props);
        const { icons } = optionsStrict;
        (_a = optionsStrict.props).key || (_a.key = 'timeline');
        (_b = optionsStrict.props).className || (_b.className = 'panel timeline');
        (_c = optionsStrict.header).content || (_c.content = [icons.timeline]);
        (_d = optionsStrict.footer).content || (_d.content = [
            React__default["default"].createElement(TimelineAddClipControl, { key: 'add-clip' },
                React__default["default"].createElement(Button, { children: icons.add })),
            React__default["default"].createElement(TimelineAddTrackControl, { key: 'add-track' },
                React__default["default"].createElement(Button, { children: [icons.add, icons.trackDense] })),
            React__default["default"].createElement(TimelineZoom, { key: "zoom-out", zoom: 0 },
                React__default["default"].createElement(Button, { useView: true }, icons.zoomLess)),
            React__default["default"].createElement(TimelineZoomer, { key: 'zoomer' }),
            React__default["default"].createElement(TimelineZoom, { key: "zoom-in", zoom: 1 },
                React__default["default"].createElement(Button, { useView: true }, icons.zoomMore)),
        ]);
        (_e = optionsStrict.content).children || (_e.children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(TimelineScrubber, { styleWidth: true, inactive: true, styleHeight: true, className: 'scrubber-bar' },
                React__default["default"].createElement(TimelineScrubberElement, { className: 'scrubber-element-bar' })),
            React__default["default"].createElement(TimelineScrubber, { styleWidth: true, className: 'scrubber-icon' },
                React__default["default"].createElement(TimelineScrubberElement, { className: 'scrubber-element-icon' })),
            React__default["default"].createElement(TimelineTracks, null,
                React__default["default"].createElement(TimelineTrackIcon, { className: 'track-icon', icons: icons }),
                React__default["default"].createElement(TimelineTrack, { className: 'track' },
                    React__default["default"].createElement(ClipItem, { className: 'clip preview' }))),
            React__default["default"].createElement(TimelineSizer, { className: 'drop-box' })));
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.header)),
            React__default["default"].createElement(TimelineContent, Object.assign({}, optionsStrict.content.props), optionsStrict.content.children),
            React__default["default"].createElement(Bar, Object.assign({}, optionsStrict.footer)));
        return Object.assign(Object.assign({}, optionsStrict.props), { children });
    };

    /**
     * @parents Masher
     * @children PlayerContent, PlayerPlaying, PlayerNotPlaying, PlayerTimeControl, PlayerTime, PlayerButton
     */
    function Player(props) {
        const { disabled } = props, rest = __rest(props, ["disabled"]);
        const editor = useEditor();
        const [paused, setPaused] = React__default["default"].useState(editor.paused);
        const [volume, setVolume] = React__default["default"].useState(editor.volume);
        const updatePaused = () => { setPaused(editor.paused); };
        useListeners({
            [moviemasher_js.EventType.Pause]: updatePaused, [moviemasher_js.EventType.Play]: updatePaused,
            [moviemasher_js.EventType.Volume]: () => { setVolume(editor.volume); },
        });
        const changePaused = (value) => { editor.paused = value; };
        const changeVolume = (value) => { editor.volume = value; };
        const playerContext = {
            paused, disabled, volume, changePaused, changeVolume,
        };
        const contextProps = {
            value: playerContext, children: React__default["default"].createElement(View, Object.assign({}, rest))
        };
        return (React__default["default"].createElement(PlayerContext.Provider, Object.assign({}, contextProps)));
    }

    const TimelineDefaultZoom = 1.0;
    /**
     * @parents Masher
     * @children TimelineContent, TimelineZoomer
     */
    function Timeline(props) {
        const editor = useEditor();
        const editorContext = React__default["default"].useContext(MasherContext);
        const { drop } = editorContext;
        const currentFrame = () => { var _a; return ((_a = editor.selection.mash) === null || _a === void 0 ? void 0 : _a.frame) || 0; };
        const currentFrames = () => { var _a; return ((_a = editor.selection.mash) === null || _a === void 0 ? void 0 : _a.frames) || 0; };
        const [frames, setFrames] = React__default["default"].useState(currentFrames);
        const [frame, setFrame] = React__default["default"].useState(currentFrame);
        const updateFrames = () => { setFrames(currentFrames()); };
        const updateFrame = () => { setFrame(currentFrame()); };
        const [droppingPosition, setDroppingPosition] = React__default["default"].useState(moviemasher_js.DroppingPosition.None);
        const [droppingTrack, setDroppingTrack] = React__default["default"].useState();
        const [droppingClip, setDroppingClip] = React__default["default"].useState();
        const [selectedTrack, setSelectedTrack] = React__default["default"].useState();
        const [refreshed, setRefreshed] = React__default["default"].useState(0);
        const [selectedClip, setSelectedClip] = React__default["default"].useState();
        const [zoom, setZoom] = React__default["default"].useState(TimelineDefaultZoom);
        const [rect, setRect] = React__default["default"].useState(moviemasher_js.RectZero);
        const [scroll, setScroll] = React__default["default"].useState(moviemasher_js.RectZero);
        const refresh = () => { setRefreshed(value => value + 1); };
        useListeners({
            [moviemasher_js.EventType.Mash]: () => { setZoom(TimelineDefaultZoom); },
            [moviemasher_js.EventType.Action]: refresh,
            [moviemasher_js.EventType.Selection]: () => {
                setSelectedClip(editor.selection.clip);
                setSelectedTrack(editor.selection.track);
            },
            [moviemasher_js.EventType.Time]: updateFrame,
            [moviemasher_js.EventType.Duration]: updateFrames,
        }, editor.eventTarget);
        const dragTypeValid = (dataTransfer, clip) => {
            const types = dragTypes(dataTransfer);
            // any file can be dropped
            if (types.includes(TransferTypeFiles))
                return true;
            const type = types.find(isTransferType);
            if (!type)
                return false;
            // anything can be dropped on a clip 
            if (clip)
                return true;
            // effects can only be dropped on clips
            const definitionType = dragDefinitionType(type);
            return definitionType !== moviemasher_js.DefinitionType.Effect;
        };
        const onDragLeave = (event) => {
            moviemasher_js.eventStop(event);
            setDroppingPosition(moviemasher_js.DroppingPosition.None);
            setDroppingTrack(undefined);
            setDroppingClip(undefined);
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
        const dropIndex = (dense, clips) => {
            if (!dense)
                return -1;
            if (!droppingClip)
                return 0;
            const clipIndex = clips.indexOf(droppingClip);
            if (droppingPosition === moviemasher_js.DroppingPosition.After)
                return clipIndex + 1;
            return clipIndex;
        };
        const onDrop = (event) => {
            moviemasher_js.eventStop(event);
            const { dataTransfer, clientX } = event;
            if (!(dataTransfer && dragTypeValid(dataTransfer, droppingClip))) {
                console.log("Timeline onDrop invalid", dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.types, !!droppingClip);
                return;
            }
            const types = dragTypes(dataTransfer);
            const droppingFiles = types.includes(TransferTypeFiles);
            const dense = !!(droppingTrack === null || droppingTrack === void 0 ? void 0 : droppingTrack.dense);
            const index = droppingTrack ? droppingTrack.index : -1;
            const clips = (droppingTrack === null || droppingTrack === void 0 ? void 0 : droppingTrack.clips) || [];
            const data = droppingFiles ? {} : dragData(dataTransfer);
            const draggingItem = !droppingFiles && isDragOffsetObject(data);
            const offset = draggingItem ? data.offset : 0;
            let indexDrop = dropIndex(dense, clips);
            if (!moviemasher_js.isPositive(indexDrop)) {
                const offsetDrop = clientX - rect.x;
                const frame = moviemasher_js.pixelToFrame(Math.max(0, scroll.x + (offsetDrop - offset)), scale);
                indexDrop = dense ? frameToIndex(frame, clips) : frame;
            }
            const editorIndex = { clip: indexDrop, track: index };
            if (droppingFiles) {
                drop(dataTransfer.files, editorIndex);
            }
            else if (draggingItem) {
                if (isDragDefinitionObject(data)) {
                    const { definitionObject } = data;
                    // console.log("Timeline onDrop definition", definitionObject)
                    drop(definitionObject, editorIndex);
                }
                else {
                    const { clip } = editor.selection;
                    moviemasher_js.assertClip(clip);
                    // console.log("Timeline onDrop moving clip", editorIndex, clip.content.definition.label)
                    editor.moveClip(clip, editorIndex);
                }
            }
            onDragLeave(event);
        };
        const { width } = rect;
        const calculatedScale = () => {
            const scale = width ? moviemasher_js.pixelPerFrame(frames, width, zoom) : 0;
            // console.log("calculatedScale", scale, "frames", frames, "width", width, 'zoom', zoom)
            return scale;
        };
        const scale = React__default["default"].useMemo(calculatedScale, [zoom, width, frames]);
        const timelineContext = {
            scroll, setScroll,
            scale, refreshed, refresh,
            zoom, setZoom,
            rect, setRect,
            droppingTrack, setDroppingTrack,
            droppingClip, setDroppingClip,
            droppingPosition, setDroppingPosition,
            onDragLeave, onDrop, dragTypeValid,
            selectedClip, selectedTrack,
            frame, frames,
        };
        const contextProps = {
            children: React__default["default"].createElement(View, Object.assign({}, props)),
            value: timelineContext
        };
        return React__default["default"].createElement(TimelineContext.Provider, Object.assign({}, contextProps));
    }

    function Panels(props) {
        return React__default["default"].createElement(View, Object.assign({}, props));
    }

    const MasherDefaultProps = function (options = {}) {
        options.className || (options.className = 'editor masher');
        options.icons || (options.icons = themeDefault.Icons);
        const { panels = {} } = options, rest = __rest(options, ["panels"]);
        const { player = {}, browser = {}, timeline = {}, inspector = {}, activity = {}, } = panels;
        const masherChildren = [];
        if (player) {
            player.icons || (player.icons = options.icons);
            masherChildren.push(React__default["default"].createElement(Player, Object.assign({}, DefaultPlayerProps(player))));
        }
        if (browser) {
            browser.icons || (browser.icons = options.icons);
            masherChildren.push(React__default["default"].createElement(Browser, Object.assign({}, BrowserPropsDefault(browser))));
        }
        if (inspector || activity) {
            const panelsChildren = [];
            if (inspector) {
                inspector.icons || (inspector.icons = options.icons);
                panelsChildren.push(React__default["default"].createElement(Inspector, Object.assign({}, InspectorPropsDefault(inspector))));
            }
            if (activity) {
                activity.icons || (activity.icons = options.icons);
                panelsChildren.push(React__default["default"].createElement(Activity, Object.assign({}, ActivityPropsDefault(activity))));
            }
            const panelsProps = {
                children: panelsChildren, key: 'panels', className: 'panels'
            };
            masherChildren.push(React__default["default"].createElement(Panels, Object.assign({}, panelsProps)));
        }
        if (timeline) {
            timeline.icons || (timeline.icons = options.icons);
            masherChildren.push(React__default["default"].createElement(Timeline, Object.assign({}, DefaultTimelineProps(timeline))));
        }
        return Object.assign(Object.assign({ className: 'editor masher' }, rest), { editType: moviemasher_js.EditType.Mash, children: masherChildren });
    };

    const MasherCastProps = function (props = {}) {
        props.className || (props.className = 'editor caster');
        const mashProps = MasherDefaultProps(props);
        const { panels = {} } = props;
        const { composer = {} } = panels;
        if (!composer)
            return mashProps;
        composer.icons || (composer.icons = props.icons);
        const children = React__default["default"].createElement(React__default["default"].Fragment, null,
            mashProps.children,
            React__default["default"].createElement(Composer, Object.assign({}, DefaultComposerProps(composer))));
        return Object.assign(Object.assign({}, mashProps), { children, editType: moviemasher_js.EditType.Cast });
    };

    function PanelContent(props) {
        const { children, className } = props;
        if (!children)
            return null;
        const viewProps = { className, children };
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    function PanelHead(props) {
        const { children, className } = props;
        if (!children)
            return null;
        const viewProps = { className, children };
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents ApiClient
     */
    function Process(props) {
        const apiContext = React__default["default"].useContext(ApiContext);
        const [processing, setProcessing] = React__default["default"].useState(false);
        const [progress, setProgress] = React__default["default"].useState(0.0);
        const [status, setStatus] = React__default["default"].useState('');
        const [error, setError] = React__default["default"].useState('');
        const { children, id } = props;
        const { enabled, servers } = apiContext;
        if (!moviemasher_js.ServerTypes.map(String).includes(id))
            return null;
        const serverType = id;
        if (!(enabled && servers[serverType]))
            return null;
        const processContext = {
            processing, setProcessing,
            status, setStatus,
            progress, setProgress,
            error, setError,
        };
        return (React__default["default"].createElement(ProcessContext.Provider, { value: processContext }, children));
    }

    /**
     * @parents Process
     */
    function ProcessActive(props) {
        const processContext = React__default["default"].useContext(ProcessContext);
        const { processing, error } = processContext;
        if (!(processing || error))
            return React__default["default"].createElement(View, null);
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    /**
     * @parents Process
     */
    function ProcessInactive(props) {
        const processContext = React__default["default"].useContext(ProcessContext);
        if (processContext.processing)
            return null;
        return React__default["default"].createElement(React__default["default"].Fragment, null, props.children);
    }

    /**
     * @parents Process, ProcessActive
     */
    function ProcessStatus(props) {
        const { className } = props, rest = __rest(props, ["className"]);
        const processContext = React__default["default"].useContext(ProcessContext);
        const { status, error, setError } = processContext;
        const classes = ['process-status'];
        if (className)
            classes.push(className);
        if (error)
            classes.push('error');
        const onClick = () => { if (error)
            setError(''); };
        const viewProps = Object.assign(Object.assign({}, rest), { onClick, key: 'process-status', className: classes.join(' '), children: error || status });
        return React__default["default"].createElement(View, Object.assign({}, viewProps));
    }

    /**
     * @parents Process, ProcessActive
     */
    function ProcessProgress(_) {
        const processContext = React__default["default"].useContext(ProcessContext);
        const { progress, processing } = processContext;
        if (!processing)
            return React__default["default"].createElement(View, { className: "progress-holder" });
        const progressProps = {
            value: progress, max: 1.0, children: `${Math.round(100.0 * progress)}%`
        };
        return React__default["default"].createElement("progress", Object.assign({}, progressProps));
    }

    const ShooterContextDefault = { devices: [] };
    const ShooterContext = React__default["default"].createContext(ShooterContextDefault);

    function Shooter(props) {
        // const { cast, ...rest } = props
        // const [requested, setRequested] = React.useState(false)
        // const [castEditor] = React.useState(() => castEditorInstance({}))
        // const apiContext = React.useContext(ApiContext)
        const getDevices = () => {
            navigator.mediaDevices.enumerateDevices().then(setDevices);
        };
        const [devices, setDevices] = React__default["default"].useState([]);
        // const { enabled, endpointPromise } = apiContext
        React__default["default"].useEffect(getDevices, []);
        // React.useEffect(() => {
        //   if (cast) castEditor.edited = cast
        //   else if (!requested && enabled.includes(ServerType.Data)) {
        //     setRequested(true)
        //     const request: DataCastDefaultRequest = {}
        //     console.debug("DataCastDefaultRequest", Endpoints.data.cast.default, request)
        //     endpointPromise(Endpoints.data.cast.default, request).then((response: DataCastDefaultResponse) => {
        //       console.debug("DataCastDefaultResponse", Endpoints.data.cast.default, response)
        //       const { cast } = response
        //       castEditor.edited = castInstance(cast)
        //     })
        //   }
        // }, [enabled])
        const context = { devices };
        const viewProps = {
            children: devices.map(device => React__default["default"].createElement(View, null, JSON.stringify(device)))
        };
        return (React__default["default"].createElement(ShooterContext.Provider, { value: context },
            React__default["default"].createElement(View, Object.assign({}, viewProps))));
    }

    function Streamer(props) {
        return (React__default["default"].createElement(View, Object.assign({}, props)));
    }

    function Streamers(props) {
        return (React__default["default"].createElement(View, Object.assign({}, props)));
    }

    function StreamersCreateControl(props) {
        return (React__default["default"].createElement(View, Object.assign({}, props)));
    }

    const WebrtcContextDefault = {
        setClient: () => { }
    };
    const WebrtcContext = React__default["default"].createContext(WebrtcContextDefault);

    function enableStereoOpus(sdp) {
        return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111');
    }
    class WebrtcClient {
        constructor(endpointPromise, setStatus) {
            this.setStatus = setStatus;
            this.endpointPromise = endpointPromise;
        }
        beforeAnswer(peerConnection) {
            return __awaiter(this, void 0, void 0, function* () {
                const promise = window.navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                }).then(something => something).catch(error => {
                    console.error("beforeAnswer", error);
                    return undefined;
                });
                this.localStream = yield promise;
                if (!this.localStream)
                    return;
                this.localStream.getTracks().forEach(track => {
                    if (!this.localStream)
                        return;
                    peerConnection.addTrack(track, this.localStream);
                });
                // hack so that we can get a callback when the RTCPeerConnection
                //  is closed. In the future, we can subscribe to
                // "connectionstatechange" events.
                const { close } = peerConnection;
                peerConnection.close = (...args) => {
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
        createConnection(options = {}) {
            const { stereo } = options;
            const request = {};
            // console.debug("StreamingWebrtcRequest", Endpoints.streaming.webrtc, request)
            return this.endpointPromise(moviemasher_js.Endpoints.streaming.webrtc, request).then((response) => {
                // console.debug("StreamingWebrtcRequest", Endpoints.streaming.webrtc, response)
                const { id, localDescription } = response;
                const rtcConfiguration = {}; //sdpSemantics: 'unified-plan'
                const peer = new RTCPeerConnection(rtcConfiguration);
                this.localPeerConnection = peer;
                // hack so we can get a callback when RTCPeerConnection is closed
                // in future, subscribe to connectionstatechange events?
                peer.close = () => {
                    const request = { id };
                    // console.debug("StreamingDeleteRequest", Endpoints.streaming.delete, request)
                    this.endpointPromise(moviemasher_js.Endpoints.streaming.delete, request).then((response) => {
                        // console.debug("StreamingDeleteRequest", Endpoints.streaming.delete, response)
                    });
                    return RTCPeerConnection.prototype.close.apply(peer);
                };
                try {
                    // console.debug(this.constructor.name, "createConnection setRemoteDescription")
                    peer.setRemoteDescription(localDescription).then(() => {
                        // console.debug(this.constructor.name, "createConnection beforeAnswer")
                        this.beforeAnswer(peer).then(() => {
                            // console.debug(this.constructor.name, "createConnection createAnswer")
                            peer.createAnswer().then((originalAnswer) => {
                                const updatedAnswer = new RTCSessionDescription({
                                    type: 'answer',
                                    sdp: stereo ? enableStereoOpus(originalAnswer.sdp) : originalAnswer.sdp
                                });
                                console.debug(this.constructor.name, "createConnection setLocalDescription");
                                peer.setLocalDescription(updatedAnswer).then(() => {
                                    const { localDescription } = peer;
                                    if (!localDescription)
                                        throw moviemasher_js.Errors.invalid.object + 'localDescription';
                                    const request = { id, localDescription };
                                    console.debug("StreamingRemoteRequest", moviemasher_js.Endpoints.streaming.remote, request);
                                    this.endpointPromise(moviemasher_js.Endpoints.streaming.remote, request).then((response) => {
                                        console.debug("StreamingRemoteResponse", moviemasher_js.Endpoints.streaming.remote, response);
                                    });
                                });
                            });
                            return peer;
                        });
                    });
                }
                catch (error) {
                    console.trace(this.constructor.name, "createConnection", error);
                    this.localPeerConnection.close();
                    throw error;
                }
            });
        }
    }

    function WebrtcButton(props) {
        const webrtcContext = React__default["default"].useContext(WebrtcContext);
        const processContext = React__default["default"].useContext(ProcessContext);
        const apiContext = React__default["default"].useContext(ApiContext);
        const { setStatus, processing, setProcessing } = processContext;
        const { endpointPromise } = apiContext;
        const { client, setClient } = webrtcContext;
        const onClick = () => {
            if (client) {
                setStatus("Closing WebRTC connection");
                client.closeConnection();
                setProcessing(false);
                setClient(undefined);
            }
            else {
                const client = new WebrtcClient(endpointPromise, setStatus);
                setStatus("Opening WebRTC connection...");
                client.createConnection().then(() => {
                    setStatus("Opened WebRTC connection");
                    setProcessing(true);
                    setClient(client);
                });
            }
        };
        const broadcastingOptions = Object.assign(Object.assign({}, props), { onClick });
        return React__default["default"].createElement(View, Object.assign({}, broadcastingOptions));
    }

    function WebrtcContent(props) {
        const ref = React__default["default"].useRef(null);
        const webrtcContext = React__default["default"].useContext(WebrtcContext);
        const processContext = React__default["default"].useContext(ProcessContext);
        const { client } = webrtcContext;
        const { processing } = processContext;
        const addListeners = () => {
            // const { eventTarget } = client
            // eventTarget.addEventListener(EventType.Draw, handleDraw)
            return () => { };
        };
        const { current } = ref;
        if (current)
            current.srcObject = processing ? (client === null || client === void 0 ? void 0 : client.localStream) || null : null;
        React__default["default"].useEffect(() => addListeners(), []);
        const rest = __rest(props, ["children"]);
        const videoProps = Object.assign(Object.assign({}, rest), { ref, autoPlay: true, muted: true });
        return React__default["default"].createElement(VideoView, Object.assign({}, videoProps));
    }

    function Webrtc(props) {
        const [client, setClient] = React__default["default"].useState();
        const apiContext = React__default["default"].useContext(ApiContext);
        const { enabled, servers } = apiContext;
        if (!(enabled && servers[moviemasher_js.ServerType.Streaming]))
            return null;
        const context = { client, setClient };
        return (React__default["default"].createElement(WebrtcContext.Provider, { value: context },
            React__default["default"].createElement(View, Object.assign({}, props))));
    }

    const application = React__default["default"].createElement(Webrtc, { className: 'panel webrtc' },
        React__default["default"].createElement("div", { className: 'head' },
            React__default["default"].createElement(WebrtcButton, null,
                React__default["default"].createElement(ProcessActive, null,
                    React__default["default"].createElement(Button, null, "Stop Broadcasting")),
                React__default["default"].createElement(ProcessInactive, null,
                    React__default["default"].createElement(Button, null, "Start Broadcasting")))),
        React__default["default"].createElement(WebrtcContent, { className: "content" }),
        React__default["default"].createElement("div", { className: 'foot' }));
    const DefaultStreamerProps = (args) => {
        return { className: 'editor caster', children: application };
    };

    exports.Activity = Activity;
    exports.ActivityContent = ActivityContent;
    exports.ActivityContentContext = ActivityContentContext;
    exports.ActivityContentContextDefault = ActivityContentContextDefault;
    exports.ActivityContext = ActivityContext;
    exports.ActivityContextDefault = ActivityContextDefault;
    exports.ActivityGroups = ActivityGroups;
    exports.ActivityItem = ActivityItem;
    exports.ActivityLabel = ActivityLabel;
    exports.ActivityPicked = ActivityPicked;
    exports.ActivityPicker = ActivityPicker;
    exports.ActivityProgress = ActivityProgress;
    exports.ActivityPropsDefault = ActivityPropsDefault;
    exports.ApiClient = ApiClient;
    exports.ApiContext = ApiContext;
    exports.ApiContextDefault = ApiContextDefault;
    exports.ApiEnabled = ApiEnabled;
    exports.Bar = Bar;
    exports.BooleanTypeInput = BooleanTypeInput;
    exports.Broadcaster = Broadcaster;
    exports.BroadcasterContent = BroadcasterContent;
    exports.BroadcasterControl = BroadcasterControl;
    exports.BroadcasterPreloadControl = BroadcasterPreloadControl;
    exports.BroadcasterUpdateControl = BroadcasterUpdateControl;
    exports.Browser = Browser;
    exports.BrowserContent = BrowserContent;
    exports.BrowserContext = BrowserContext;
    exports.BrowserContextDefault = BrowserContextDefault;
    exports.BrowserControl = BrowserControl;
    exports.BrowserPicker = BrowserPicker;
    exports.BrowserPropsDefault = BrowserPropsDefault;
    exports.Button = Button;
    exports.ClipContext = ClipContext;
    exports.ClipContextDefault = ClipContextDefault;
    exports.ClipItem = ClipItem;
    exports.ColorGroupInput = ColorGroupInput;
    exports.Composer = Composer;
    exports.ComposerContent = ComposerContent;
    exports.ComposerContext = ComposerContext;
    exports.ComposerContextDefault = ComposerContextDefault;
    exports.ComposerDepth = ComposerDepth;
    exports.ComposerFolderClose = ComposerFolderClose;
    exports.ComposerFolderOpen = ComposerFolderOpen;
    exports.ComposerLayer = ComposerLayer;
    exports.ComposerLayerFolder = ComposerLayerFolder;
    exports.ComposerLayerLabel = ComposerLayerLabel;
    exports.ComposerLayerMash = ComposerLayerMash;
    exports.CreateEditedControl = CreateEditedControl;
    exports.DataGroupInputs = DataGroupInputs;
    exports.DataTypeInputs = DataTypeInputs;
    exports.DefaultComposerProps = DefaultComposerProps;
    exports.DefaultPlayerProps = DefaultPlayerProps;
    exports.DefaultStreamerProps = DefaultStreamerProps;
    exports.DefaultTimelineProps = DefaultTimelineProps;
    exports.DefinitionContext = DefinitionContext;
    exports.DefinitionContextDefault = DefinitionContextDefault;
    exports.DefinitionDrop = DefinitionDrop;
    exports.DefinitionItem = DefinitionItem;
    exports.DefinitionSelect = DefinitionSelect;
    exports.DragElementPoint = DragElementPoint;
    exports.DragElementRect = DragElementRect;
    exports.DragSuffix = DragSuffix;
    exports.DragTypes = DragTypes;
    exports.EditorRedoButton = EditorRedoButton;
    exports.EditorRemoveButton = EditorRemoveButton;
    exports.EditorUndoButton = EditorUndoButton;
    exports.EffectsGroupInput = EffectsGroupInput;
    exports.EmptyElement = EmptyElement;
    exports.InputContext = InputContext;
    exports.InputContextDefault = InputContextDefault;
    exports.Inspector = Inspector;
    exports.InspectorContent = InspectorContent;
    exports.InspectorContext = InspectorContext;
    exports.InspectorContextDefault = InspectorContextDefault;
    exports.InspectorEffect = InspectorEffect;
    exports.InspectorPicked = InspectorPicked;
    exports.InspectorPicker = InspectorPicker;
    exports.InspectorProperties = InspectorProperties;
    exports.InspectorProperty = InspectorProperty;
    exports.InspectorPropsDefault = InspectorPropsDefault;
    exports.LayerContext = LayerContext;
    exports.LayerContextDefault = LayerContextDefault;
    exports.Masher = Masher;
    exports.MasherCastProps = MasherCastProps;
    exports.MasherContext = MasherContext;
    exports.MasherContextDefault = MasherContextDefault;
    exports.MasherDefaultProps = MasherDefaultProps;
    exports.NumericTypeInput = NumericTypeInput;
    exports.OpacityGroupInput = OpacityGroupInput;
    exports.Panel = Panel;
    exports.PanelContent = PanelContent;
    exports.PanelFoot = PanelFoot;
    exports.PanelHead = PanelHead;
    exports.Panels = Panels;
    exports.PercentTypeInput = PercentTypeInput;
    exports.Player = Player;
    exports.PlayerButton = PlayerButton;
    exports.PlayerContent = PlayerContent;
    exports.PlayerContext = PlayerContext;
    exports.PlayerContextDefault = PlayerContextDefault;
    exports.PlayerNotPlaying = PlayerNotPlaying;
    exports.PlayerPlaying = PlayerPlaying;
    exports.PlayerTime = PlayerTime;
    exports.PlayerTimeControl = PlayerTimeControl;
    exports.PointGroupInput = PointGroupInput;
    exports.Problems = Problems;
    exports.Process = Process;
    exports.ProcessActive = ProcessActive;
    exports.ProcessContext = ProcessContext;
    exports.ProcessContextDefault = ProcessContextDefault;
    exports.ProcessInactive = ProcessInactive;
    exports.ProcessProgress = ProcessProgress;
    exports.ProcessStatus = ProcessStatus;
    exports.RenderControl = RenderControl;
    exports.RgbTypeInput = RgbTypeInput;
    exports.SaveControl = SaveControl;
    exports.SelectEditedControl = SelectEditedControl;
    exports.Shooter = Shooter;
    exports.ShooterContext = ShooterContext;
    exports.ShooterContextDefault = ShooterContextDefault;
    exports.SizeGroupInput = SizeGroupInput;
    exports.SizingGroupInput = SizingGroupInput;
    exports.SizingTypeInput = SizingTypeInput;
    exports.Slider = Slider;
    exports.Streamer = Streamer;
    exports.Streamers = Streamers;
    exports.StreamersCreateControl = StreamersCreateControl;
    exports.TextTypeInput = TextTypeInput;
    exports.Timeline = Timeline;
    exports.TimelineAddClipControl = TimelineAddClipControl;
    exports.TimelineAddTrackControl = TimelineAddTrackControl;
    exports.TimelineContent = TimelineContent;
    exports.TimelineContext = TimelineContext;
    exports.TimelineContextDefault = TimelineContextDefault;
    exports.TimelineDefaultZoom = TimelineDefaultZoom;
    exports.TimelineScrubber = TimelineScrubber;
    exports.TimelineScrubberElement = TimelineScrubberElement;
    exports.TimelineSizer = TimelineSizer;
    exports.TimelineTrack = TimelineTrack;
    exports.TimelineTrackIcon = TimelineTrackIcon;
    exports.TimelineTracks = TimelineTracks;
    exports.TimelineZoom = TimelineZoom;
    exports.TimelineZoomer = TimelineZoomer;
    exports.TimingGroupInput = TimingGroupInput;
    exports.TimingTypeInput = TimingTypeInput;
    exports.TrackContext = TrackContext;
    exports.TrackContextDefault = TrackContextDefault;
    exports.TransferTypeFiles = TransferTypeFiles;
    exports.TweenInputKey = TweenInputKey;
    exports.VideoView = VideoView;
    exports.View = View;
    exports.ViewControl = ViewControl;
    exports.ViewerContext = ViewerContext;
    exports.ViewerContextDefault = ViewerContextDefault;
    exports.Webrtc = Webrtc;
    exports.WebrtcButton = WebrtcButton;
    exports.WebrtcClient = WebrtcClient;
    exports.WebrtcContent = WebrtcContent;
    exports.WebrtcContext = WebrtcContext;
    exports.WebrtcContextDefault = WebrtcContextDefault;
    exports.activityLabel = activityLabel;
    exports.assertActivityGroup = assertActivityGroup;
    exports.assertDragDefinitionObject = assertDragDefinitionObject;
    exports.assertDragOffsetObject = assertDragOffsetObject;
    exports.dragData = dragData;
    exports.dragDefinitionType = dragDefinitionType;
    exports.dragType = dragType;
    exports.dragTypes = dragTypes;
    exports.dropFilesFromList = dropFilesFromList;
    exports.dropType = dropType;
    exports.droppingPositionClass = droppingPositionClass;
    exports.elementSetPreviewSize = elementSetPreviewSize;
    exports.isActivityGroup = isActivityGroup;
    exports.isDragDefinitionObject = isDragDefinitionObject;
    exports.isDragOffsetObject = isDragOffsetObject;
    exports.isDragType = isDragType;
    exports.isTransferType = isTransferType;
    exports.labelInterpolate = labelInterpolate;
    exports.labelLookup = labelLookup;
    exports.labelObjects = labelObjects;
    exports.labelTranslate = labelTranslate;
    exports.labels = labels;
    exports.panelOptionsStrict = panelOptionsStrict;
    exports.propsDefinitionTypes = propsDefinitionTypes;
    exports.propsSelectTypes = propsSelectTypes;
    exports.sessionGet = sessionGet;
    exports.sessionSet = sessionSet;
    exports.useApiDefinitions = useApiDefinitions;
    exports.useClip = useClip;
    exports.useDefinition = useDefinition;
    exports.useEditor = useEditor;
    exports.useEditorActivity = useEditorActivity;
    exports.useEditorDefinitions = useEditorDefinitions;
    exports.useLayer = useLayer;
    exports.useListeners = useListeners;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
