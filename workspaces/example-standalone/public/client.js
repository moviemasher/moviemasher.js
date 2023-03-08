(function (require$$0, ReactDOM, clientReact) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var require$$0__default = /*#__PURE__*/_interopDefault(require$$0);
  var ReactDOM__default = /*#__PURE__*/_interopDefault(ReactDOM);

  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports(){ return jsxRuntimeExports; },
    set exports(v){ jsxRuntimeExports = v; },
  };

  var reactJsxRuntime_production_min = {};

  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f=require$$0__default.default,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
  function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

  (function (module) {

  	{
  	  module.exports = reactJsxRuntime_production_min;
  	}
  } (jsxRuntime));

  const element = document.getElementById('root');
  const options = { previewSize: { width: 480, height: 270 } };
  const props = clientReact.MasherDefaultProps(options);
  const masher = jsxRuntimeExports.jsx(clientReact.MasherApp, { ...props });
  ReactDOM__default.default.createRoot(element).render(masher);

})(React, ReactDOM, MovieMasherClient);
