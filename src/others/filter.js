var Filter = {
	registered: {},
	find: function(filter_id){
		return MovieMasher.find(Constant.filter, filter_id);
	},
	load: function(filter_id){
		var filter, filter_config;
		filter_config = Filter.find(filter_id);
		if (filter_config) {
			filter = Filter.registered[filter_id];
			if (! filter) Loader.load_filter(filter_config.source);
		}
		return filter;
	},
	create_drawing: function(width, height, label, container){
		//console.log('create_drawing', width, height, label, container);
		var drawing = {drawings:[]};
		drawing.container = container;
		drawing.label = label;
		drawing.canvas = document.createElement("canvas");
		drawing.context = drawing.canvas.getContext('2d');
		if (1 <= width) drawing.canvas.width = width;
		if (1 <= height) drawing.canvas.height = height;
		if (drawing.container) {
			//console.log('creating element for ', drawing.label);
			drawing.span = document.createElement("span");
			drawing.span.setAttribute("alt", drawing.label);
			drawing.container.appendChild(drawing.span);
			drawing.span.appendChild(drawing.canvas);
		}
		return drawing;
	},
	create_drawing_like: function(drawing, label){
		var new_drawing = Filter.create_drawing(drawing.canvas.width, drawing.canvas.height, label, drawing.container);
		drawing.drawings.push(new_drawing);
		return new_drawing;
	},
	destroy_drawing: function(drawing){
		if (drawing.container) {
			//console.log('destroying element for ', drawing.label);
			if (! drawing.container.removeChild(drawing.span)) console.error('could not find span in container');
			if (! drawing.span.removeChild(drawing.canvas)) console.error('could not find canvas in span');
		}
		var key;
		for (key in drawing){
			drawing[key] = null;
		}
	},
	label: function(filter){
		return filter.description || filter.id;
	},
	register: function(id, object) {
		Filter.registered[id] = object;
	},
};
MovieMasher.Filter = Filter;
