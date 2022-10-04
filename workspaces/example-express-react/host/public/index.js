(function (React, ReactDOM, clientReact) {
	'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
	var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

	const element = document.getElementById('app');
	const options = { previewSize: { width: 480, height: 270 } };
	const props = clientReact.MasherDefaultProps(options);
	const masher = React__default["default"].createElement(clientReact.Masher, { ...props });
	const editor = React__default["default"].createElement(clientReact.ApiClient, null, masher);
	ReactDOM__default["default"].createRoot(element).render(editor);

})(React, ReactDOM, MovieMasherClient);
