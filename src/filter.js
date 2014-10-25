var Filter = {
	color: { 
		render: function(contexts, scope, evaluated, filter_config) {
			//console.log('color.apply', contexts, evaluated);
			var context = contexts[0]; // one input
			var new_context = Filter.create_drawing_like(context, Filter.label(filter_config) + ' ' + evaluated.color);
			new_context.context.fillStyle = evaluated.color;
			new_context.context.fillRect(0, 0, new_context.canvas.width, new_context.canvas.height);
			return [new_context];
		}, 
		parse: function(contexts, scope) {
			return scope;
		}
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
	crop: {
		render: function(contexts, scope, evaluated, filter_config){
			var x, y, in_ctx, out_ctx, out_width, in_width, out_height, in_height;
			out_width = evaluated.w || evaluated.out_w;
			out_height = evaluated.h || evaluated.out_h;
			in_width = scope.mm_in_w;
			in_height = scope.mm_in_h;
			x = evaluated.x || 0;
			y = evaluated.y || 0;
			
			//console.error('crop.render output dimensions', evaluated, scope, out_width, out_height);
			//console.error('crop.render output position', evaluated, scope, x, y);
			if (2 > out_width + out_height) console.error('crop.render invalid output dimensions', evaluated, scope, out_width, out_height);
			else if (! (in_width && in_height)) console.error('crop.render invalid input dimensions', evaluated, scope, in_width, in_height);
			else {
				in_ctx = contexts[0];
				if (! in_ctx) console.error('crop.render invalid input context', evaluated, scope, contexts);
				else {
					if (-1 === out_width) out_width = in_width * (out_height / in_height);
					if (-1 === out_height) out_height = in_height * (out_width / in_width);
					out_ctx = Filter.create_drawing(out_width, out_height, Filter.label(filter_config) + ' ' + out_width + 'x' + out_height + ' ' + x + ',' + y, in_ctx.container);
					in_ctx.drawings.push(out_ctx);
					out_ctx.context.drawImage(in_ctx.canvas, x, y, out_width, out_height, 0, 0, out_width, out_height);
				}
			}
			return [out_ctx];
		},
		parse: function(contexts, scope){
			//console.log('crop.parse', scope);
			var context = contexts[0];
			scope.in_h = scope.mm_in_h = context.canvas.height;
			scope.in_w = scope.mm_in_w = context.canvas.width;
			if (! scope.x) scope.x = '((in_w - out_w) / 2)';
			if (! scope.y) scope.y = '((in_h - out_h) / 2)';
			return scope;
		}
	},
	drawbox: { 
		render: function(contexts, scope, evaluated, filter_config) {
			//console.log('drawbox.apply', contexts, evaluated);
			var context, drawing = contexts[0]; // one input
			var color, x, y, width, height;
			color = (Util.isnt(evaluated.color) ? 'black' : evaluated.color);
			x = evaluated.x || 0;
			y = evaluated.y || 0;
			width = evaluated.width || drawing.canvas.width;
			height = evaluated.height || drawing.canvas.height;
			
			context = Filter.create_drawing_like(drawing, Filter.label(filter_config) + ' ' + color + ' ' + width + 'x' + height + ' ' + x + ',' + y);
			context.context.fillStyle = color;
			context.context.fillRect(x, y, width, height);		
			drawing.context.drawImage(context.canvas, 0, 0);
			return contexts;
		}, parse: function(contexts, scope) {
			return scope;
		}
	}, 
	drawtext: { 
		render: function(contexts, scope, evaluated, filter_config) {
			//console.log('drawtext.render', evaluated.fontfile);
			var context, args = [], drawing = contexts[0]; // one input
			context = Filter.create_drawing_like(drawing, Filter.label(filter_config) + ' ' + evaluated.fontsize + 'px ' + evaluated.x + ',' + evaluated.y + ' ' + evaluated.fontcolor + ' ' + evaluated.shadowcolor + ' ' + evaluated.shadowx + ',' + evaluated.shadowy);
			context.context.font = String(evaluated.fontsize) + 'px ' + evaluated.fontfile;
			context.context.fillStyle = evaluated.fontcolor;
			if (evaluated.shadowcolor){
				context.context.shadowColor = evaluated.shadowcolor;
				context.context.shadowOffsetX = evaluated.shadowx || 0; // integer
				context.context.shadowOffsetY = evaluated.shadowy || 0; // integer
				context.context.shadowBlur = 0; // sorry, no blur supported yet in ffmpeg
			}
			args.push(evaluated.text || evaluated.textfile);
			args.push(evaluated.x);
			args.push(evaluated.y + evaluated.fontsize);
			if (! Util.isnt(evaluated.width)) {
				args.push(evaluated.width);
				if (! Util.isnt(evaluated.height)) args.push(evaluated.height);
			}
			context.context.fillText.apply(context.context, args);
			drawing.context.drawImage(context.canvas, 0, 0);
			return contexts;
		}, parse: function(contexts, scope) {
			//console.log('drawtext.parse', scope);
			scope.text_w = 0; // width of the text to draw??
			scope.text_h = 0; // height of the text to draw??
			scope.mm_fontfamily = function(font_id){
				var family = '', font = MovieMasher.find(Constant.font, font_id);
				if (font) family = font.family || font.label;
				else console.warn('no registered font family with id', font_id, font);
				return family;
			};
			scope.mm_textfile = function(text) {
				return text;
			};
			scope.mm_fontfile = function(font_id){
				// in javascript we need the family instead of file
				return scope.mm_fontfamily(font_id);
			};
			return scope;
		},
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
	fade: {
		render: function(contexts, scope, evaluated, filter_config){
			//console.log('fade.render', contexts, scope, evaluated);
			var bot_ctx = contexts[0];
			var new_context = Filter.create_drawing_like(bot_ctx, Filter.label(filter_config) + ' ' + scope.mm_t);
			new_context.context.globalAlpha = scope.mm_t; 
			new_context.context.drawImage(bot_ctx.canvas, 0, 0);
			new_context.context.globalAlpha = 1; 
			return [new_context];
		},
		parse: function(contexts, scope){
			//console.log('fade.parse', scope);
			return scope;
		}
	},
	label: function(filter){
		return filter.description || filter.id;
	},
	overlay: {
		render: function(contexts, scope, evaluated){
			if (2 > contexts.length) return console.error('overlay.apply with insufficient contexts', contexts);
			var bot_ctx = contexts[0];
			var top_ctx = contexts[1];
			if (! bot_ctx) return console.error('overlay.apply with no bot_ctx', contexts);
			if (! top_ctx) return console.error('overlay.apply with no top_ctx', contexts);
			bot_ctx.context.drawImage(top_ctx.canvas, evaluated.x, evaluated.y);
			return [bot_ctx];
		},
		parse: function(contexts, scope){
			//console.error('overlay.parse', scope);
			scope.overlay_w = contexts[1].canvas.width;
			scope.overlay_h = contexts[1].canvas.height;
			return scope;
		}
	},
	scale: {
		render: function(contexts, scope, evaluated, filter_config){
			var in_ctx, out_ctx, out_width, in_width, out_height, in_height;
			out_width = evaluated.w || evaluated.width;
			out_height = evaluated.h || evaluated.height;
			//console.error('scale.render output dimensions', evaluated, scope, out_width, out_height);
			
			if (2 > out_width + out_height) console.error('scale.render invalid output dimensions', evaluated, scope, out_width, out_height);
			else {
				in_ctx = contexts[0];
				if (! in_ctx) console.error('scale.render invalid input context', evaluated, scope, contexts);
				else {
					in_width = scope.mm_in_w;
					in_height = scope.mm_in_h;
					if (-1 === out_width) out_width = in_width * (out_height / in_height);
					if (-1 === out_height) out_height = in_height * (out_width / in_width);
					out_ctx = Filter.create_drawing(out_width, out_height, Filter.label(filter_config) + ' ' + out_width + 'x' + out_height, in_ctx.container);
					in_ctx.drawings.push(out_ctx);
					out_ctx.context.drawImage(in_ctx.canvas, 0, 0, in_width, in_height, 0, 0, out_width, out_height);
				}
			}
			return [out_ctx];
		},
		parse: function(contexts, scope){
			//console.log('scale.parse', scope);
			var context = contexts[0];
			scope.in_h = scope.mm_in_h = context.canvas.height;
			scope.in_w = scope.mm_in_w = context.canvas.width;
			return scope;
		}
	},
	setsar: {
		render: function(contexts){
			return contexts;
		},
		parse: function(contexts, scope){
			return scope;
		}
	},
};
