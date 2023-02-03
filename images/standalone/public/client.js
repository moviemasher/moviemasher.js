(function (React, ReactDOM, clientReact) {
	'use strict';

	const element = document.getElementById('root');
	const options = { previewSize: { width: 480, height: 270 } };
	const props = clientReact.MasherDefaultProps(options);
	const masher = React.createElement(clientReact.Masher, { ...props });
	const editor = React.createElement(clientReact.ApiClient, null, masher);
	ReactDOM.createRoot(element).render(editor);

})(React, ReactDOM, MovieMasherClient);
