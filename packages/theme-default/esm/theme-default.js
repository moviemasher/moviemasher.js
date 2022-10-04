import React from 'react';

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && React.createContext(DefaultContext);

var __assign = globalThis.window && globalThis.window.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = globalThis.window && globalThis.window.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

function Tree2Element(tree) {
  return tree && tree.map(function (node, i) {
    return React.createElement(node.tag, __assign({
      key: i
    }, node.attr), Tree2Element(node.child));
  });
}

function GenIcon(data) {
  return function (props) {
    return React.createElement(IconBase, __assign({
      attr: __assign({}, data.attr)
    }, props), Tree2Element(data.child));
  };
}
function IconBase(props) {
  var elem = function (conf) {
    var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);

    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + ' ' : '') + props.className;
    return React.createElement("svg", __assign({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: __assign(__assign({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && React.createElement("title", null, title), props.children);
  };

  return IconContext !== undefined ? React.createElement(IconContext.Consumer, null, function (conf) {
    return elem(conf);
  }) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function AiOutlineColumnWidth (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 1024 1024"},"child":[{"tag":"path","attr":{"d":"M180 176h-60c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8zm724 0h-60c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8zM785.3 504.3L657.7 403.6a7.23 7.23 0 0 0-11.7 5.7V476H378v-62.8c0-6-7-9.4-11.7-5.7L238.7 508.3a7.14 7.14 0 0 0 0 11.3l127.5 100.8c4.7 3.7 11.7.4 11.7-5.7V548h268v62.8c0 6 7 9.4 11.7 5.7l127.5-100.8c3.8-2.9 3.8-8.5.2-11.4z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function CgArrowLongLeftL (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none"},"child":[{"tag":"path","attr":{"d":"M5.20837 7.75725L0.969116 12.0033L5.21515 16.2428L6.62823 14.8274L4.80949 13.0116L21.0229 13.0298L21.0189 15.0297L23.0189 15.0338L23.0309 9.03377L21.0309 9.02976L21.0249 12.019L21.0261 11.0298L4.78543 11.0115L6.62371 9.17033L5.20837 7.75725Z","fill":"currentColor"}}]})(props);
}function CgArrowLongRightL (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none"},"child":[{"tag":"path","attr":{"d":"M18.9164 7.75739L23.1662 11.9929L18.9305 16.2426L17.5139 14.8308L19.3325 13.0061L2.8338 13.0285V15.0299H0.833801V9.02988H2.8338V11.0285L19.3429 11.0061L17.5046 9.17398L18.9164 7.75739Z","fill":"currentColor"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function RiStackFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M20.083 10.5l1.202.721a.5.5 0 0 1 0 .858L12 17.65l-9.285-5.571a.5.5 0 0 1 0-.858l1.202-.721L12 15.35l8.083-4.85zm0 4.7l1.202.721a.5.5 0 0 1 0 .858l-8.77 5.262a1 1 0 0 1-1.03 0l-8.77-5.262a.5.5 0 0 1 0-.858l1.202-.721L12 20.05l8.083-4.85zM12.514 1.309l8.771 5.262a.5.5 0 0 1 0 .858L12 13 2.715 7.429a.5.5 0 0 1 0-.858l8.77-5.262a1 1 0 0 1 1.03 0z"}}]}]})(props);
}function RiStackLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M20.083 15.2l1.202.721a.5.5 0 0 1 0 .858l-8.77 5.262a1 1 0 0 1-1.03 0l-8.77-5.262a.5.5 0 0 1 0-.858l1.202-.721L12 20.05l8.083-4.85zm0-4.7l1.202.721a.5.5 0 0 1 0 .858L12 17.65l-9.285-5.571a.5.5 0 0 1 0-.858l1.202-.721L12 15.35l8.083-4.85zm-7.569-9.191l8.771 5.262a.5.5 0 0 1 0 .858L12 13 2.715 7.429a.5.5 0 0 1 0-.858l8.77-5.262a1 1 0 0 1 1.03 0zM12 3.332L5.887 7 12 10.668 18.113 7 12 3.332z"}}]}]})(props);
}function RiChatVoiceFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M4.929 19.071A9.969 9.969 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10H2l2.929-2.929zM11 6v12h2V6h-2zM7 9v6h2V9H7zm8 0v6h2V9h-2z"}}]}]})(props);
}function RiVideoChatFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM14 10.25V8H7v6h7v-2.25L17 14V8l-3 2.25z"}}]}]})(props);
}function RiEdit2Fill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M9.243 19H21v2H3v-4.243l9.9-9.9 4.242 4.244L9.242 19zm5.07-13.556l2.122-2.122a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414l-2.122 2.121-4.242-4.242z"}}]}]})(props);
}function RiFolderAddFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2zM11 12H8v2h3v3h2v-3h3v-2h-3V9h-2v3z"}}]}]})(props);
}function RiFolderLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M4 5v14h16V7h-8.414l-2-2H4zm8.414 0H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2z"}}]}]})(props);
}function RiFolderOpenLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M3 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2H20a1 1 0 0 1 1 1v3h-2V7h-7.414l-2-2H4v11.998L5.5 11h17l-2.31 9.243a1 1 0 0 1-.97.757H3zm16.938-8H7.062l-1.5 6h12.876l1.5-6z"}}]}]})(props);
}function RiFilmFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v2h2V5H4zm14 0v2h2V5h-2zM4 9v2h2V9H4zm14 0v2h2V9h-2zM4 13v2h2v-2H4zm14 0v2h2v-2h-2zM4 17v2h2v-2H4zm14 0v2h2v-2h-2z"}}]}]})(props);
}function RiImageFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M20 5H4v14l9.292-9.294a1 1 0 0 1 1.414 0L20 15.01V5zM2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"}}]}]})(props);
}function RiMusic2Fill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M20 3v14a4 4 0 1 1-2-3.465V6H9v11a4 4 0 1 1-2-3.465V3h13z"}}]}]})(props);
}function RiPauseCircleFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM9 9v6h2V9H9zm4 0v6h2V9h-2z"}}]}]})(props);
}function RiPlayCircleFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM10.622 8.415a.4.4 0 0 0-.622.332v6.506a.4.4 0 0 0 .622.332l4.879-3.252a.4.4 0 0 0 0-.666l-4.88-3.252z"}}]}]})(props);
}function RiVolumeMuteLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M10 7.22L6.603 10H3v4h3.603L10 16.78V7.22zM5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536-1.414 1.414L19 13.414l-3.536 3.536-1.414-1.414L17.586 12 14.05 8.464l1.414-1.414L19 10.586l3.536-3.536 1.414 1.414L20.414 12z"}}]}]})(props);
}function RiVolumeUpLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M10 7.22L6.603 10H3v4h3.603L10 16.78V7.22zM5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z"}}]}]})(props);
}function RiAddLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"}}]}]})(props);
}function RiArrowGoBackLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z"}}]}]})(props);
}function RiArrowGoForwardLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z"}}]}]})(props);
}function RiDeleteBin7Line (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zM9 4v2h6V4H9z"}}]}]})(props);
}function RiEyeOffLine (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M17.882 19.297A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 0 0 3.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0 0 20.777 12 9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.769l-4.77-4.769z"}}]}]})(props);
}

// THIS FILE IS AUTO GENERATED
function MdInvertColors (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0V0z"}},{"tag":"path","attr":{"d":"M12 4.81V19c-3.31 0-6-2.63-6-5.87 0-1.56.62-3.03 1.75-4.14L12 4.81M6.35 7.56C4.9 8.99 4 10.96 4 13.13 4 17.48 7.58 21 12 21s8-3.52 8-7.87c0-2.17-.9-4.14-2.35-5.57L12 2 6.35 7.56z"}}]})(props);
}function MdLabel (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"}}]})(props);
}function MdOpacity (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M24 0H0v24h24V0zm0 0H0v24h24V0zM0 24h24V0H0v24z"}},{"tag":"path","attr":{"d":"M17.66 8L12 2.35 6.34 8A8.02 8.02 0 004 13.64c0 2 .78 4.11 2.34 5.67a7.99 7.99 0 0011.32 0c1.56-1.56 2.34-3.67 2.34-5.67S19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"}}]})(props);
}function MdPermMedia (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z"}}]})(props);
}function MdOutlineSpeed (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19a2 2 0 001.72 1h13.85a2 2 0 001.74-1 10 10 0 00-.27-10.44z"}},{"tag":"path","attr":{"d":"M10.59 15.41a2 2 0 002.83 0l5.66-8.49-8.49 5.66a2 2 0 000 2.83z"}}]})(props);
}function MdOutlineTextFields (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0z"}},{"tag":"path","attr":{"d":"M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"}}]})(props);
}function MdOutlineTimelapse (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"fill":"none","d":"M0 0h24v24H0V0z"}},{"tag":"path","attr":{"d":"M16.24 7.75A5.974 5.974 0 0012 5.99v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0a5.99 5.99 0 00-.01-8.48zM12 1.99c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function IoMdColorFill (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function IoDocument (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M428 224H288a48 48 0 01-48-48V36a4 4 0 00-4-4h-92a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V228a4 4 0 00-4-4z"}},{"tag":"path","attr":{"d":"M419.22 188.59L275.41 44.78a2 2 0 00-3.41 1.41V176a16 16 0 0016 16h129.81a2 2 0 001.41-3.41z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function BsAspectRatioFill (props) {
  return GenIcon({"tag":"svg","attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 12.5v-9A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM2.5 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0V5h2.5a.5.5 0 0 0 0-1h-3zm11 8a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0V11h-2.5a.5.5 0 0 0 0 1h3z"}}]})(props);
}function BsSkipEndFill (props) {
  return GenIcon({"tag":"svg","attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"}}]})(props);
}function BsSkipEnd (props) {
  return GenIcon({"tag":"svg","attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4zM5 4.633 10.804 8 5 11.367V4.633z"}}]})(props);
}function BsSkipStartFill (props) {
  return GenIcon({"tag":"svg","attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function FaExclamationCircle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"}}]})(props);
}function FaRegCheckCircle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function BiBorderInner (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M19 19h2v2h-2zM7 19h2v2H7zm8 0h2v2h-2zM3 19h2v2H3zm0-4h2v2H3zm0-8h2v2H3zm0-4h2v2H3zm12 0h2v2h-2zM7 3h2v2H7zm12 0h2v2h-2zm0 12h2v2h-2zm0-8h2v2h-2z"}},{"tag":"path","attr":{"d":"M5 13h6v8h2v-8h8v-2h-8V3h-2v8H3v2h1.93z"}}]})(props);
}function BiBorderOuter (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M11 7h2v2h-2zm0 8h2v2h-2zm-4-4h2v2H7zm8 0h2v2h-2zm-4 0h2v2h-2z"}},{"tag":"path","attr":{"d":"M19 3H3v18h18V3h-2zm0 4v12H5V5h14v2z"}}]})(props);
}function BiShapeTriangle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M18 15c-.183 0-.358.022-.532.054L8.946 6.532C8.978 6.359 9 6.182 9 6c0-1.654-1.346-3-3-3S3 4.346 3 6c0 1.302.839 2.401 2 2.815v6.369A2.997 2.997 0 0 0 3 18c0 1.654 1.346 3 3 3a2.993 2.993 0 0 0 2.815-2h6.369a2.994 2.994 0 0 0 2.815 2c1.654 0 3-1.346 3-3S19.654 15 18 15zm-11 .184V8.816c.329-.118.629-.291.894-.508l7.799 7.799a2.961 2.961 0 0 0-.508.894h-6.37A2.99 2.99 0 0 0 7 15.184zM6 5a1.001 1.001 0 1 1-1 1c0-.551.448-1 1-1zm0 14a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2zm12 0a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function GiDirectorChair (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M157 21.234v16h18v-16zm180 0v16h18v-16zM153 55.232v62.002h206V55.232zm-3.89 80c-26.567 5.315-53.134 10.626-79.7 15.942l3.531 17.648L87 166.01v80.222h18V162.41l52-10.4v45.224h18v-62.002zm187.89 0v62.002h18V152.01l52 10.4v83.822h18V166.01l14.059 2.812 3.53-17.648c-26.565-5.315-53.132-10.628-79.698-15.942zm-174 80l-40.004 30.002h266.008L349 215.232zm-69.836 48l118.363 82.854c-37.367 27.406-74.74 54.805-112.105 82.213l10.642 14.514 18.743-13.745-8.008 20.823-37.332 26.13 10.322 14.745L256 377.216c54.07 37.851 108.142 75.698 162.21 113.55l10.323-14.745-37.332-26.13-8.008-20.823 18.743 13.745 10.642-14.514c-37.367-27.406-74.737-54.809-112.105-82.213l118.363-82.854h-31.383l-102.307 71.616-13.927-10.215 83.728-61.4H324.51L256 313.472l-68.51-50.24h-30.437l83.728 61.4-13.927 10.215-102.307-71.616zM256 335.793l13.574 9.955L256 355.25l-13.574-9.502zm-28.9 21.193l13.209 9.246-93.125 65.188 8.48-22.047zm57.8 0l71.436 52.387 8.48 22.047-93.125-65.186z"}}]})(props);
}function GiHorizontalFlip (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M387.02 278.627v67.883L477.53 256l-90.51-90.51v67.883H124.98V165.49L34.47 256l90.51 90.51v-67.883h262.04z"}}]})(props);
}function GiMove (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 34.47l-90.51 90.51h67.883v108.393H124.98V165.49L34.47 256l90.51 90.51v-67.883h108.393V387.02H165.49L256 477.53l90.51-90.51h-67.883V278.627H387.02v67.883L477.53 256l-90.51-90.51v67.883H278.627V124.98h67.883L256 34.47z"}}]})(props);
}function GiResize (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M29 30l1 90h36V66h26V30H29zm99 0v36h72V30h-72zm108 0v36h72V30h-72zm108 0v36h72V30h-72zm102 0v78h36V30h-36zm-206 80v36h100.543l-118 118H30v218h218V289.457l118-118V272h36V110H240zm206 34v72h36v-72h-36zM30 156v72h36v-72H30zm416 96v72h36v-72h-36zm0 108v72h36v-72h-36zm-166 86v36h72v-36h-72zm108 0v36h72v-36h-72z"}}]})(props);
}function GiVerticalFlip (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M233.373 387.02H165.49L256 477.53l90.51-90.51h-67.883V124.98h67.883L256 34.47l-90.51 90.51h67.883v262.04z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function TbActivityHeartbeat (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","strokeWidth":"2","stroke":"currentColor","fill":"none","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"desc","attr":{},"child":[]},{"tag":"path","attr":{"stroke":"none","d":"M0 0h24v24H0z","fill":"none"}},{"tag":"path","attr":{"d":"M3 12h4.5l1.5 -6l4 12l2 -9l1.5 3h4.5"}}]})(props);
}function TbArrowAutofitHeight (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","strokeWidth":"2","stroke":"currentColor","fill":"none","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"desc","attr":{},"child":[]},{"tag":"path","attr":{"stroke":"none","d":"M0 0h24v24H0z","fill":"none"}},{"tag":"path","attr":{"d":"M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h6"}},{"tag":"path","attr":{"d":"M18 14v7"}},{"tag":"path","attr":{"d":"M18 3v7"}},{"tag":"path","attr":{"d":"M15 18l3 3l3 -3"}},{"tag":"path","attr":{"d":"M15 6l3 -3l3 3"}}]})(props);
}function TbArrowAutofitWidth (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","strokeWidth":"2","stroke":"currentColor","fill":"none","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"desc","attr":{},"child":[]},{"tag":"path","attr":{"stroke":"none","d":"M0 0h24v24H0z","fill":"none"}},{"tag":"path","attr":{"d":"M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6"}},{"tag":"path","attr":{"d":"M10 18h-7"}},{"tag":"path","attr":{"d":"M21 18h-7"}},{"tag":"path","attr":{"d":"M6 15l-3 3l3 3"}},{"tag":"path","attr":{"d":"M18 15l3 3l-3 3"}}]})(props);
}function TbArrowBarRight (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","strokeWidth":"2","stroke":"currentColor","fill":"none","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"desc","attr":{},"child":[]},{"tag":"path","attr":{"stroke":"none","d":"M0 0h24v24H0z","fill":"none"}},{"tag":"line","attr":{"x1":"20","y1":"12","x2":"10","y2":"12"}},{"tag":"line","attr":{"x1":"20","y1":"12","x2":"16","y2":"16"}},{"tag":"line","attr":{"x1":"20","y1":"12","x2":"16","y2":"8"}},{"tag":"line","attr":{"x1":"4","y1":"4","x2":"4","y2":"20"}}]})(props);
}function TbArrowBarToRight (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","strokeWidth":"2","stroke":"currentColor","fill":"none","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"desc","attr":{},"child":[]},{"tag":"path","attr":{"stroke":"none","d":"M0 0h24v24H0z","fill":"none"}},{"tag":"line","attr":{"x1":"14","y1":"12","x2":"4","y2":"12"}},{"tag":"line","attr":{"x1":"14","y1":"12","x2":"10","y2":"16"}},{"tag":"line","attr":{"x1":"14","y1":"12","x2":"10","y2":"8"}},{"tag":"line","attr":{"x1":"20","y1":"4","x2":"20","y2":"20"}}]})(props);
}function TbFileImport (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 24 24","strokeWidth":"2","stroke":"currentColor","fill":"none","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"desc","attr":{},"child":[]},{"tag":"path","attr":{"stroke":"none","d":"M0 0h24v24H0z","fill":"none"}},{"tag":"path","attr":{"d":"M14 3v4a1 1 0 0 0 1 1h4"}},{"tag":"path","attr":{"d":"M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function TiZoomInOutline (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.2","baseProfile":"tiny","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M13 11h-2v-2c0-.275-.225-.5-.5-.5s-.5.225-.5.5v2h-2c-.275 0-.5.225-.5.5s.225.5.5.5h2v2c0 .275.225.5.5.5s.5-.225.5-.5v-2h2c.275 0 .5-.225.5-.5s-.225-.5-.5-.5zM19.381 15.956l-2.244-2.283c.227-.687.363-1.412.363-2.173 0-3.859-3.141-7-7-7s-7 3.141-7 7 3.141 7 7 7c.762 0 1.488-.137 2.173-.364l2.397 2.386c.601.506 1.348.783 2.104.783 1.727 0 3.131-1.404 3.131-3.131 0-.84-.328-1.628-.924-2.218zm-3.901-1.11l2.492 2.531c.205.203.332.486.332.797 0 .625-.507 1.131-1.131 1.131-.312 0-.594-.127-.816-.313l-2.512-2.511c.646-.436 1.201-.991 1.635-1.635zm-9.98-3.346c0-2.757 2.243-5 5-5s5 2.243 5 5-2.243 5-5 5-5-2.243-5-5z"}}]})(props);
}function TiZoomOutOutline (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.2","baseProfile":"tiny","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M13 12h-5c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h5c.275 0 .5.225.5.5s-.225.5-.5.5zM19.381 15.956l-2.245-2.283c.228-.687.364-1.412.364-2.173 0-3.859-3.141-7-7-7s-7 3.141-7 7 3.141 7 7 7c.761 0 1.488-.137 2.173-.364l2.397 2.386c.601.506 1.348.783 2.104.783 1.727 0 3.131-1.404 3.131-3.131 0-.84-.328-1.628-.924-2.218zm-3.901-1.11l2.492 2.531c.205.203.332.486.332.797 0 .625-.507 1.131-1.131 1.131-.312 0-.594-.127-.816-.313l-2.512-2.511c.646-.436 1.201-.991 1.635-1.635zm-9.98-3.346c0-2.757 2.243-5 5-5s5 2.243 5 5-2.243 5-5 5-5-2.243-5-5z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function HiEye (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 20 20","fill":"currentColor"},"child":[{"tag":"path","attr":{"d":"M10 12a2 2 0 100-4 2 2 0 000 4z"}},{"tag":"path","attr":{"fillRule":"evenodd","d":"M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z","clipRule":"evenodd"}}]})(props);
}function HiLockClosed (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 20 20","fill":"currentColor"},"child":[{"tag":"path","attr":{"fillRule":"evenodd","d":"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z","clipRule":"evenodd"}}]})(props);
}function HiLockOpen (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 20 20","fill":"currentColor"},"child":[{"tag":"path","attr":{"d":"M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function VscTriangleDown (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 16 16","fill":"currentColor"},"child":[{"tag":"path","attr":{"d":"M2 5.56L2.413 5h11.194l.393.54L8.373 11h-.827L2 5.56z"}}]})(props);
}function VscTriangleRight (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 16 16","fill":"currentColor"},"child":[{"tag":"path","attr":{"d":"M5.56 14L5 13.587V2.393L5.54 2 11 7.627v.827L5.56 14z"}}]})(props);
}

// THIS FILE IS AUTO GENERATED
function ImFileVideo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0 0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0 0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}},{"tag":"path","attr":{"d":"M4 8h5v5h-5v-5z"}},{"tag":"path","attr":{"d":"M9 10l3-2v5l-3-2z"}}]})(props);
}function ImSpinner3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 4.736c-0.515 0-0.933-0.418-0.933-0.933v-2.798c0-0.515 0.418-0.933 0.933-0.933s0.933 0.418 0.933 0.933v2.798c0 0.515-0.418 0.933-0.933 0.933z"}},{"tag":"path","attr":{"d":"M8 15.577c-0.322 0-0.583-0.261-0.583-0.583v-2.798c0-0.322 0.261-0.583 0.583-0.583s0.583 0.261 0.583 0.583v2.798c0 0.322-0.261 0.583-0.583 0.583z"}},{"tag":"path","attr":{"d":"M5.902 5.24c-0.302 0-0.596-0.157-0.758-0.437l-1.399-2.423c-0.241-0.418-0.098-0.953 0.32-1.194s0.953-0.098 1.194 0.32l1.399 2.423c0.241 0.418 0.098 0.953-0.32 1.194-0.138 0.079-0.288 0.117-0.436 0.117z"}},{"tag":"path","attr":{"d":"M11.498 14.582c-0.181 0-0.358-0.094-0.455-0.262l-1.399-2.423c-0.145-0.251-0.059-0.572 0.192-0.717s0.572-0.059 0.717 0.192l1.399 2.423c0.145 0.251 0.059 0.572-0.192 0.717-0.083 0.048-0.173 0.070-0.262 0.070z"}},{"tag":"path","attr":{"d":"M4.365 6.718c-0.138 0-0.279-0.035-0.407-0.109l-2.423-1.399c-0.39-0.225-0.524-0.724-0.299-1.115s0.724-0.524 1.115-0.299l2.423 1.399c0.39 0.225 0.524 0.724 0.299 1.115-0.151 0.262-0.425 0.408-0.707 0.408z"}},{"tag":"path","attr":{"d":"M14.057 11.964c-0.079 0-0.159-0.020-0.233-0.063l-2.423-1.399c-0.223-0.129-0.299-0.414-0.171-0.637s0.414-0.299 0.637-0.171l2.423 1.399c0.223 0.129 0.299 0.414 0.171 0.637-0.086 0.15-0.243 0.233-0.404 0.233z"}},{"tag":"path","attr":{"d":"M3.803 8.758h-2.798c-0.418 0-0.758-0.339-0.758-0.758s0.339-0.758 0.758-0.758h2.798c0.419 0 0.758 0.339 0.758 0.758s-0.339 0.758-0.758 0.758z"}},{"tag":"path","attr":{"d":"M14.995 8.466c-0 0 0 0 0 0h-2.798c-0.258-0-0.466-0.209-0.466-0.466s0.209-0.466 0.466-0.466c0 0 0 0 0 0h2.798c0.258 0 0.466 0.209 0.466 0.466s-0.209 0.466-0.466 0.466z"}},{"tag":"path","attr":{"d":"M1.943 12.197c-0.242 0-0.477-0.125-0.606-0.35-0.193-0.335-0.079-0.762 0.256-0.955l2.423-1.399c0.335-0.193 0.762-0.079 0.955 0.256s0.079 0.762-0.256 0.955l-2.423 1.399c-0.11 0.064-0.23 0.094-0.349 0.094z"}},{"tag":"path","attr":{"d":"M11.635 6.368c-0.161 0-0.318-0.084-0.404-0.233-0.129-0.223-0.052-0.508 0.171-0.637l2.423-1.399c0.223-0.129 0.508-0.052 0.637 0.171s0.052 0.508-0.171 0.637l-2.423 1.399c-0.073 0.042-0.154 0.063-0.233 0.063z"}},{"tag":"path","attr":{"d":"M4.502 14.699c-0.109 0-0.219-0.028-0.32-0.086-0.307-0.177-0.412-0.569-0.235-0.876l1.399-2.423c0.177-0.307 0.569-0.412 0.876-0.235s0.412 0.569 0.235 0.876l-1.399 2.423c-0.119 0.206-0.334 0.321-0.556 0.321z"}},{"tag":"path","attr":{"d":"M10.098 4.832c-0.079 0-0.159-0.020-0.233-0.063-0.223-0.129-0.299-0.414-0.171-0.637l1.399-2.423c0.129-0.223 0.414-0.299 0.637-0.171s0.299 0.414 0.171 0.637l-1.399 2.423c-0.086 0.15-0.243 0.233-0.404 0.233z"}}]})(props);
}

const MMWideIcon = () => {
    return React.createElement("svg", { width: "2em", height: "1em", viewBox: "0 0 48 24", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { d: "M 0.00 0.00 L 48.00 0.00 L 48.00 24.00 L 0.00 24.00 Z M 0.00 0.00", stroke: "none", fill: "none" }),
        React.createElement("path", { d: "M 9.16 2.00 C 8.62 2.00 8.13 2.18 7.73 2.57 L 7.73 2.57 L 1.19 8.91 C 0.77 9.34 0.55 9.82 0.53 10.39 L 0.53 10.39 C 0.53 10.91 0.72 11.37 1.13 11.76 L 1.13 11.76 C 1.56 12.15 2.05 12.31 2.60 12.28 L 2.60 12.28 C 3.17 12.31 3.64 12.13 4.03 11.70 L 4.03 11.70 L 9.16 6.90 L 13.67 11.28 C 14.33 11.87 14.67 12.20 14.73 12.24 L 14.73 12.24 C 15.12 12.63 15.60 12.81 16.14 12.81 L 16.14 12.81 C 16.69 12.85 17.20 12.66 17.63 12.28 L 17.63 12.28 C 17.67 12.26 18.01 11.93 18.63 11.28 L 18.63 11.28 C 19.29 10.65 20.07 9.93 20.93 9.12 L 20.93 9.12 C 21.82 8.23 22.57 7.51 23.20 6.90 L 23.20 6.90 L 31.34 14.86 C 31.74 15.25 32.21 15.47 32.72 15.51 L 32.72 15.51 L 38.29 15.51 L 38.23 19.10 L 44.00 13.55 L 38.29 7.90 L 38.29 11.54 L 33.65 11.48 L 24.63 2.63 C 24.22 2.28 23.74 2.09 23.20 2.09 L 23.20 2.09 C 22.65 2.07 22.16 2.24 21.71 2.63 L 21.71 2.63 L 16.20 8.01 L 11.64 3.63 C 10.98 2.96 10.64 2.61 10.60 2.57 L 10.60 2.57 C 10.18 2.18 9.75 2.00 9.28 2.00 L 9.28 2.00 C 9.24 2.00 9.20 2.00 9.16 2.00", stroke: "none", fill: "currentColor" }),
        React.createElement("path", { d: "M 7.70 11.61 L 2.58 16.53 L 0.00 14.05 L 0.00 21.91 L 8.15 21.91 L 5.49 19.38 C 5.53 19.38 5.56 19.36 5.60 19.32 L 5.60 19.32 L 9.19 15.88 L 14.75 21.28 C 15.14 21.67 15.62 21.85 16.16 21.85 L 16.16 21.85 C 16.73 21.89 17.22 21.72 17.65 21.33 L 17.65 21.33 L 23.16 15.88 L 28.78 21.43 C 29.18 21.78 29.67 21.96 30.21 21.96 L 30.21 21.96 L 34.34 22.00 C 34.93 21.98 35.42 21.78 35.83 21.43 L 35.83 21.43 C 36.23 21.04 36.44 20.56 36.44 19.95 L 36.44 19.95 C 36.44 19.39 36.23 18.91 35.83 18.53 L 35.83 18.53 C 35.46 18.17 34.99 18.01 34.40 18.01 L 34.40 18.01 L 31.10 17.95 L 24.65 11.67 C 24.25 11.32 23.76 11.13 23.22 11.13 L 23.22 11.13 C 22.67 11.11 22.18 11.28 21.75 11.67 L 21.75 11.67 L 16.16 16.99 L 10.56 11.61 C 10.15 11.22 9.69 11.04 9.19 11.04 L 9.19 11.04 C 8.64 11.04 8.15 11.22 7.70 11.61", stroke: "none", fill: "currentColor" }));
};
const MMLogo = () => {
    return React.createElement("svg", { width: "52", height: "24", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("defs", null,
            React.createElement("linearGradient", { id: "gradient_0", gradientUnits: "userSpaceOnUse", x1: "27.12", y1: "20.06", x2: "26.83", y2: "0.10" },
                React.createElement("stop", { offset: "0%", stopColor: "#62789b" }),
                React.createElement("stop", { offset: "100%", stopColor: "#8c9bdd" }))),
        React.createElement("path", { d: "M 10.83 0.00 C 10.18 0.00 9.61 0.22 9.14 0.69 L 9.14 0.69 L 1.40 8.29 C 0.91 8.81 0.64 9.38 0.62 10.07 L 0.62 10.07 C 0.62 10.69 0.85 11.24 1.34 11.71 L 1.34 11.71 C 1.85 12.18 2.43 12.38 3.07 12.33 L 3.07 12.33 C 3.74 12.38 4.30 12.15 4.77 11.64 L 4.77 11.64 L 10.83 5.88 L 16.16 11.13 C 16.94 11.84 17.34 12.24 17.41 12.29 L 17.41 12.29 C 17.87 12.75 18.43 12.97 19.08 12.97 L 19.08 12.97 C 19.72 13.02 20.33 12.80 20.84 12.33 L 20.84 12.33 C 20.88 12.31 21.28 11.91 22.02 11.13 L 22.02 11.13 C 22.80 10.38 23.71 9.51 24.74 8.54 L 24.74 8.54 C 25.79 7.47 26.68 6.61 27.41 5.88 L 27.41 5.88 L 37.04 15.44 C 37.51 15.90 38.07 16.17 38.67 16.21 L 38.67 16.21 L 45.25 16.21 L 45.18 20.52 L 52.00 13.86 L 45.25 7.08 L 45.25 11.44 L 39.76 11.38 L 29.11 0.75 C 28.62 0.33 28.06 0.11 27.41 0.11 L 27.41 0.11 C 26.77 0.09 26.19 0.29 25.65 0.75 L 25.65 0.75 L 19.15 7.21 L 13.75 1.95 C 12.97 1.15 12.57 0.73 12.52 0.69 L 12.52 0.69 C 12.03 0.22 11.52 0.00 10.96 0.00 L 10.96 0.00 C 10.92 0.00 10.88 0.00 10.83 0.00", stroke: "none", fill: "url(#gradient_0)" }),
        React.createElement("defs", null,
            React.createElement("linearGradient", { id: "gradient_1", gradientUnits: "userSpaceOnUse", x1: "22.21", y1: "23.71", x2: "21.97", y2: "10.91" },
                React.createElement("stop", { offset: "0%", stopColor: "#62789b" }),
                React.createElement("stop", { offset: "100%", stopColor: "#8c9bdd" }))),
        React.createElement("path", { d: "M 9.09 11.54 L 3.05 17.44 L -0.00 14.46 L -0.00 23.89 L 9.63 23.89 L 6.49 20.85 C 6.53 20.85 6.58 20.83 6.62 20.78 L 6.62 20.78 L 10.86 16.66 L 17.43 23.14 C 17.90 23.60 18.46 23.82 19.10 23.82 L 19.10 23.82 C 19.77 23.87 20.35 23.67 20.86 23.20 L 20.86 23.20 L 27.37 16.66 L 34.01 23.31 C 34.48 23.73 35.06 23.96 35.71 23.96 L 35.71 23.96 L 40.59 24.00 C 41.28 23.98 41.86 23.73 42.35 23.31 L 42.35 23.31 C 42.82 22.85 43.06 22.27 43.06 21.54 L 43.06 21.54 C 43.06 20.87 42.82 20.30 42.35 19.83 L 42.35 19.83 C 41.90 19.41 41.35 19.21 40.66 19.21 L 40.66 19.21 L 36.76 19.14 L 29.13 11.60 C 28.66 11.18 28.08 10.96 27.44 10.96 L 27.44 10.96 C 26.79 10.94 26.21 11.14 25.70 11.60 L 25.70 11.60 L 19.10 17.99 L 12.48 11.54 C 11.99 11.07 11.46 10.85 10.86 10.85 L 10.86 10.85 C 10.21 10.85 9.63 11.07 9.09 11.54", stroke: "none", fill: "url(#gradient_1)" }));
};
// const MMIcon = () => {
//   return <svg width="1em" height="1em" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
//     <path d="M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="none" />
//     <path d="M 4.20 11.29 L 1.41 13.99 L 0.00 12.63 L 0.00 16.95 L 4.44 16.95 L 2.99 15.56 C 3.01 15.56 3.03 15.55 3.06 15.53 L 3.06 15.53 L 5.01 13.64 L 8.04 16.60 C 8.26 16.82 8.52 16.92 8.82 16.92 L 8.82 16.92 C 9.13 16.94 9.39 16.85 9.63 16.63 L 9.63 16.63 L 12.63 13.64 L 15.70 16.68 C 15.91 16.88 16.18 16.98 16.48 16.98 L 16.48 16.98 L 18.73 17.00 C 19.05 16.99 19.32 16.88 19.55 16.68 L 19.55 16.68 C 19.76 16.47 19.88 16.21 19.88 15.87 L 19.88 15.87 C 19.88 15.57 19.76 15.30 19.55 15.09 L 19.55 15.09 C 19.34 14.90 19.08 14.80 18.76 14.80 L 18.76 14.80 L 16.96 14.77 L 13.45 11.32 C 13.23 11.12 12.96 11.02 12.66 11.02 L 12.66 11.02 C 12.37 11.01 12.10 11.10 11.86 11.32 L 11.86 11.32 L 8.82 14.25 L 5.76 11.29 C 5.53 11.07 5.29 10.97 5.01 10.97 L 5.01 10.97 C 4.71 10.97 4.44 11.07 4.20 11.29 M 5.00 6.00 C 4.70 6.00 4.43 6.10 4.22 6.32 L 4.22 6.32 L 0.65 9.80 C 0.42 10.04 0.30 10.30 0.29 10.62 L 0.29 10.62 C 0.29 10.90 0.39 11.15 0.62 11.37 L 0.62 11.37 C 0.85 11.58 1.12 11.67 1.42 11.65 L 1.42 11.65 C 1.73 11.67 1.98 11.57 2.20 11.34 L 2.20 11.34 L 5.00 8.69 L 7.46 11.10 C 7.82 11.43 8.00 11.61 8.03 11.63 L 8.03 11.63 C 8.25 11.85 8.51 11.95 8.81 11.95 L 8.81 11.95 C 9.10 11.97 9.38 11.87 9.62 11.65 L 9.62 11.65 C 9.64 11.64 9.82 11.46 10.16 11.10 L 10.16 11.10 C 10.52 10.76 10.95 10.36 11.42 9.91 L 11.42 9.91 C 11.90 9.43 12.31 9.03 12.65 8.69 L 12.65 8.69 L 17.10 13.08 C 17.31 13.29 17.57 13.41 17.85 13.43 L 17.85 13.43 L 20.88 13.43 L 20.85 15.40 L 24.00 12.35 L 20.88 9.24 L 20.88 11.25 L 18.35 11.21 L 13.43 6.35 C 13.21 6.15 12.95 6.05 12.65 6.05 L 12.65 6.05 C 12.35 6.04 12.09 6.13 11.84 6.35 L 11.84 6.35 L 8.84 9.30 L 6.35 6.89 C 5.99 6.53 5.80 6.34 5.78 6.32 L 5.78 6.32 C 5.55 6.10 5.32 6.00 5.06 6.00 L 5.06 6.00 C 5.04 6.00 5.02 6.00 5.00 6.00" stroke="none" fill="currentColor" />
//   </svg>
// }
const MMTubeIcon = () => {
    return React.createElement("svg", { width: "1em", height: "1em", viewBox: "0 0 24 24", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("defs", null,
            React.createElement("clipPath", { id: "tube-m-m" },
                React.createElement("path", { d: "\n          M 3.60 21.00 C 1.61 21.00 0.00 19.39 0.00 17.40 L 0.00 6.60 C 0.00 4.61 1.61 3.00 3.60 3.00 L 20.40 3.00 C 22.39 3.00 24.00 4.61 24.00 6.60 L 24.00 17.40 C 24.00 19.39 22.39 21.00 20.40 21.00 Z M 3.60 21.00\n          M 5.57 11.81 L 3.03 14.30 L 1.75 13.04 L 1.75 17.03 L 5.79 17.03 L 4.47 15.75 C 4.49 15.75 4.51 15.74 4.53 15.72 L 4.53 15.72 L 6.30 13.97 L 9.06 16.71 C 9.26 16.91 9.49 17.00 9.76 17.00 L 9.76 17.00 C 10.04 17.02 10.28 16.94 10.50 16.74 L 10.50 16.74 L 13.23 13.97 L 16.01 16.79 C 16.21 16.96 16.45 17.06 16.72 17.06 L 16.72 17.06 L 18.77 17.08 C 19.06 17.07 19.30 16.96 19.51 16.79 L 19.51 16.79 C 19.70 16.59 19.81 16.35 19.81 16.04 L 19.81 16.04 C 19.81 15.75 19.70 15.51 19.51 15.31 L 19.51 15.31 C 19.32 15.14 19.09 15.05 18.80 15.05 L 18.80 15.05 L 17.16 15.02 L 13.97 11.83 C 13.77 11.65 13.53 11.56 13.26 11.56 L 13.26 11.56 C 12.99 11.55 12.74 11.64 12.53 11.83 L 12.53 11.83 L 9.76 14.54 L 6.99 11.81 C 6.78 11.61 6.56 11.51 6.30 11.51 L 6.30 11.51 C 6.03 11.51 5.79 11.61 5.57 11.81\n          M 6.29 6.93 C 6.02 6.93 5.78 7.02 5.58 7.22 L 5.58 7.22 L 2.34 10.43 C 2.14 10.65 2.02 10.89 2.01 11.18 L 2.01 11.18 C 2.01 11.45 2.11 11.68 2.31 11.88 L 2.31 11.88 C 2.53 12.08 2.77 12.16 3.04 12.14 L 3.04 12.14 C 3.32 12.16 3.56 12.07 3.75 11.85 L 3.75 11.85 L 6.29 9.41 L 8.53 11.64 C 8.85 11.94 9.02 12.10 9.05 12.12 L 9.05 12.12 C 9.25 12.32 9.48 12.41 9.75 12.41 L 9.75 12.41 C 10.02 12.43 10.27 12.34 10.49 12.14 L 10.49 12.14 C 10.51 12.13 10.68 11.96 10.98 11.64 L 10.98 11.64 C 11.31 11.32 11.70 10.95 12.12 10.54 L 12.12 10.54 C 12.56 10.09 12.94 9.72 13.25 9.41 L 13.25 9.41 L 17.28 13.46 C 17.48 13.65 17.71 13.76 17.97 13.78 L 17.97 13.78 L 20.72 13.78 L 20.69 15.60 L 23.55 12.79 L 20.72 9.92 L 20.72 11.77 L 18.42 11.74 L 13.96 7.24 C 13.75 7.07 13.52 6.97 13.25 6.97 L 13.25 6.97 C 12.98 6.96 12.73 7.05 12.51 7.24 L 12.51 7.24 L 9.78 9.97 L 7.52 7.75 C 7.19 7.41 7.02 7.24 7.00 7.22 L 7.00 7.22 C 6.80 7.02 6.58 6.93 6.35 6.93 L 6.35 6.93 C 6.33 6.93 6.31 6.93 6.29 6.93\n        " }))),
        React.createElement("path", { clipPath: "url(#tube-m-m)", d: "M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00", stroke: "none", fill: "currentColor" }));
};
const Icons = {
    active: React.createElement(ImSpinner3, { key: 'active' }),
    activity: React.createElement(TbActivityHeartbeat, { key: 'activity' }),
    add: React.createElement(RiAddLine, { key: 'add' }),
    app: React.createElement(MMLogo, { key: 'app' }),
    // audible: <RiVolumeUpLine key='audible' />,
    // audio: <RiMusicLine key="audio" />,
    // broadcast: <RiBroadcastFill key='broadcast' />,
    browser: React.createElement(MdPermMedia, { key: 'browser' }),
    browserAudio: React.createElement(RiMusic2Fill, { key: "browserAudio" }),
    browserAudioStream: React.createElement(RiChatVoiceFill, { key: "browserAudioStream" }),
    browserEffect: React.createElement(MdInvertColors, { key: "browserEffect" }),
    browserImage: React.createElement(RiImageFill, { key: "browserImage" }),
    browserShape: React.createElement(BiShapeTriangle, { key: "browserShape" }),
    browserText: React.createElement(MdOutlineTextFields, { key: "browserText" }),
    browserVideo: React.createElement(RiFilmFill, { key: "browserVideo" }),
    browserVideoStream: React.createElement(RiVideoChatFill, { key: "browserVideoStream" }),
    // chat: <RiChat3Fill key='chat' />,
    clip: React.createElement(MdOutlineTimelapse, { key: "clip" }),
    collapse: React.createElement(VscTriangleDown, { key: "collapse" }),
    collapsed: React.createElement(VscTriangleRight, { key: "collapsed" }),
    color: React.createElement(IoMdColorFill, { key: "color" }),
    complete: React.createElement(FaRegCheckCircle, { key: 'complete' }),
    composer: React.createElement(GiDirectorChair, { key: 'composer' }),
    container: React.createElement(BiBorderOuter, { key: "container" }),
    content: React.createElement(BiBorderInner, { key: "content" }),
    document: React.createElement(IoDocument, { key: "document" }),
    end: React.createElement(BsSkipEndFill, { key: "end" }),
    endUndefined: React.createElement(BsSkipEnd, { key: "endUndefined" }),
    gain: React.createElement(RiVolumeUpLine, { key: "gain" }),
    error: React.createElement(FaExclamationCircle, { key: 'error' }),
    folder: React.createElement(RiFolderLine, { key: 'folder' }),
    folderAdd: React.createElement(RiFolderAddFill, { key: 'folderAdd' }),
    folderOpen: React.createElement(RiFolderOpenLine, { key: 'folderOpen' }),
    frame: React.createElement(TbArrowBarRight, { key: "frame" }),
    frames: React.createElement(TbArrowBarToRight, { key: "frames" }),
    height: React.createElement(TbArrowAutofitHeight, { key: "height" }),
    horz: React.createElement(GiHorizontalFlip, { key: "horz-flip" }),
    inaudible: React.createElement(RiVolumeMuteLine, { key: 'inaudible' }),
    inspector: React.createElement(RiEdit2Fill, { key: 'inspector' }),
    invisible: React.createElement(RiEyeOffLine, { key: 'invisible' }),
    label: React.createElement(MdLabel, { key: "label" }),
    lock: React.createElement(HiLockClosed, { key: "lock" }),
    // matte: <BsReverseLayoutSidebarInsetReverse key="matte" />,
    // message: <RiMessage3Fill key='message' />,
    // mm: <MMIcon key="mm" />,
    mmTube: React.createElement(MMTubeIcon, { key: "mmTube" }),
    mmWide: React.createElement(MMWideIcon, { key: "mmWide" }),
    opacity: React.createElement(MdOpacity, { key: "opacity" }),
    playerPause: React.createElement(RiPauseCircleFill, { key: "player-pause" }),
    playerPlay: React.createElement(RiPlayCircleFill, { key: "player-play" }),
    point: React.createElement(GiMove, { key: "point" }),
    redo: React.createElement(RiArrowGoForwardLine, { key: "redo" }),
    muted: React.createElement(RiVolumeMuteLine, { key: "muted" }),
    remove: React.createElement(RiDeleteBin7Line, { key: "remove" }),
    render: React.createElement(ImFileVideo, { key: "render" }),
    size: React.createElement(GiResize, { key: "size" }),
    sizing: React.createElement(BsAspectRatioFill, { key: "sizing" }),
    start: React.createElement(BsSkipStartFill, { key: "start" }),
    // streamers: <FaUserCircle key='streamers' />,
    timeline: React.createElement(MdOutlineTimelapse, { key: 'timeline' }),
    timing: React.createElement(AiOutlineColumnWidth, { key: "timing" }),
    startTrim: React.createElement(CgArrowLongRightL, { key: "start-trim" }),
    speed: React.createElement(MdOutlineSpeed, { key: "speed" }),
    endTrim: React.createElement(CgArrowLongLeftL, { key: "end-trim" }),
    track: React.createElement(RiStackLine, { key: "track" }),
    trackDense: React.createElement(RiStackFill, { key: "track-dense" }),
    undo: React.createElement(RiArrowGoBackLine, { key: "undo" }),
    unlock: React.createElement(HiLockOpen, { key: "unlock" }),
    import: React.createElement(TbFileImport, { key: "upload" }),
    vert: React.createElement(GiVerticalFlip, { key: "vert" }),
    // video: <RiArrowRightSLine key="video" />,
    view: React.createElement(HiEye, { key: "view" }),
    // visible: <RiEyeLine key='visible' />,
    width: React.createElement(TbArrowAutofitWidth, { key: "width" }),
    zoomLess: React.createElement(TiZoomOutOutline, { key: "zoom-less" }),
    zoomMore: React.createElement(TiZoomInOutline, { key: "zoom-more" }),
};

export { Icons };
