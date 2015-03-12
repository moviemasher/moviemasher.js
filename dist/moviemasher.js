/*! moviemasher.js - v4.0.12 - 2015-03-11
* Copyright (c) 2015 Movie Masher; Licensed  */
/*global module:true,define:true*/
(function (name, context, definition) { 
'use strict';
if (typeof module !== "undefined" && module.exports) module.exports = definition(); 
else if (typeof define === "function" && define.amd) define(definition); 
else context[name] = definition(); 
	})("MovieMasher", this, function() { 
'use strict';
var Action = function(player, redo_func, undo_func, destroy_func){
	this.player = player;
	this._redo = redo_func;
	this._undo = undo_func;
	this._destroy = destroy_func;
	this.undo_selected_clips = this.redo_selected_clips = Util.copy_array(player.selectedClips);
	this.undo_selected_effects = this.redo_selected_effects = Util.copy_array(player.selectedEffects);
	this.redo_add_objects = [];
	this.undo_delete_objects = [];
	this.undo_add_objects = [];
	this.redo_delete_objects = [];
};
(function(pt){
	pt.redo = function(){
		this.player.add_media(this.redo_add_objects);
		this._redo();
		this.player.remove_media(this.redo_delete_objects);
		this.player.selectedClips = this.redo_selected_clips;
		this.player.selectedEffects = this.redo_selected_effects;
		this.player.rebuffer();
		this.player.redraw();
	};
	pt.undo = function(){
		this.player.add_media(this.undo_add_objects);
		this._undo();
		this.player.remove_media(this.undo_delete_objects);
		this.player.selectedClips = this.undo_selected_clips;
		this.player.selectedEffects = this.undo_selected_effects;
		this.player.rebuffer();
		this.player.redraw();
	};
	pt.destroy = function(){
		if (this._destroy) this._destroy();
		delete this._destroy;
		delete this.player;
		delete this._redo;
		delete this._undo;
		delete this.undo_selected_clips;
		delete this.redo_selected_clips;
		delete this.undo_selected_effects;
		delete this.redo_selected_effects;
		delete this.redo_add_objects;
		delete this.undo_delete_objects;
		delete this.undo_add_objects;
		delete this.redo_delete_objects;
	};
	
})(Action.prototype);

var Audio = { 
	buffer_source: function(buffer){
		var context = Audio.get_ctx();
		var source = context.createBufferSource(); // creates a sound source
		source.buffer = buffer;                    // tell the source which sound to play
		return source;
	},	
	load: function(url){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			Audio.get_ctx().decodeAudioData(request.response, function(buffer) {
				//console.log('audio.onload', url);
				Loader.cached_urls[url] = buffer;
				delete Loader.requested_urls[url];
				Players.draw_delayed();
			}, function() { console.error('problem decoding audio', url); });
		};
		Loader.requested_urls[url] = request;
		request.send();
	},
	clip_timing: function(clip, zero_seconds, quantize) {
		if (isNaN(zero_seconds)) console.error('Audio.clip_timing got NaN for zero_seconds', clip);
		var now, dif, range, result = {offset: 0};
		range = new TimeRange(clip.frame, quantize, clip.frames);
		result.start = zero_seconds + range.seconds;
		if (isNaN(result.start)) console.error('Audio.clip_timing start is NaN', range);
		result.duration = range.lengthSeconds;
		if (clip.trim) {
			range.frame = clip.trim;
			result.offset = range.seconds;
		}
		now = Audio.get_ctx().currentTime;
		if (now > result.start) {
			dif = now - result.start;
			result.start = now;
			if (isNaN(result.start)) console.error('Audio.clip_timing currentTime is NaN');
			result.offset += dif;
			result.duration -= dif;
		}
		return result;
	},
	connect_source: function(source, start, offset, duration){
		var context = Audio.get_ctx();
		source.gainNode = context.createGain();
		source.buffer_source.connect(source.gainNode);
		source.gainNode.connect(context.destination);
		//console.log('Audio.connect_source', start, offset, duration);
		source.buffer_source.start(start, offset, duration);
	},
	config_gain: function(gainNode, gain, start, duration, volume){
		gainNode.cancelScheduledValues(0);
		var gain_val, time_per, i, z, gains;
		gains = gain.split(',');
		z = gains.length / 2;
		for (i = 0; i < z; i++) {
			time_per = gains[i * 2];
			gain_val = volume * gains[i * 2 + 1];
			gainNode[Constant.gain].linearRampToValueAtTime(gain_val, start + time_per * duration);
		}
	},
	destroy_sources: function(except_clips){
		var new_sources = [];
		var source, i, z = Audio.sources.length;
		for (i = 0; i < z; i++){
			source = Audio.sources[i];
			if (except_clips && (-1 < except_clips.indexOf(source.clip))) {
				new_sources.push(source);
				continue;
			}
			Audio.disconnect_source(source);
			delete source.buffer_source;
		}
		//if (! except_clips) console.log('Audio.destroy_sources', except_clips, new_sources);
		Audio.sources = new_sources;
	},
	disconnect_source: function(source){
		//console.log('Audio.disconnect_source', source);
		var context = Audio.get_ctx();
		source.buffer_source.disconnect(source.gainNode);
		source.gainNode.disconnect(context.destination);
		delete source.gainNode;
	
	},
	get_ctx: function(){
		if (! Audio.ctx) {
			if (window.AudioContext) Audio.ctx = new window.AudioContext();
			else if (window.webkitAudioContext) Audio.ctx = new window.webkitAudioContext();
		}
		return Audio.ctx;
	},
	gain_source: function(source){
		if (source){
			if (isNaN(source.clip[Constant.gain])) {
				var times = Audio.clip_timing(source.clip, Audio.zero_seconds(), source.quantize);
				Audio.config_gain(source.gainNode, source.clip[Constant.gain], times.start, times.duration, source.player.volume);
			} else source.gainNode[Constant.gain].value = source.clip[Constant.gain] * source.player.volume;
		}
	},
	media_url: function(media){
		var url;
		switch(media.type){
			case Constant.video: {
				switch (media.audio){
					case undefined: {
						url = media.source;
						break;
					}
					case '0': {
						break;
					}
					default: url = media.audio;
				}
				break;
			}
			case Constant.audio: {
				url = (media.url || media.source);
				break;
			}
		}
		return url;
	},
	start: function(){
		//console.log('Audio.start');
		var context = Audio.get_ctx();
		Audio.__buffer_source = context.createBufferSource();
		Audio.__buffer_source.loop = true;
		Audio.__buffer_source.buffer = context.createBuffer(2, 44100, 44100);
		Audio.__buffer_source.connect(context.destination);
		Audio.__buffer_source.start(0);
	},
	stop: function(){
		//console.log('Audio.stop');
		Audio.destroy_sources();
		if (Audio.__buffer_source) {
			Audio.__buffer_source.disconnect(Audio.get_ctx().destination);
			Audio.__buffer_source = null;
		}
	},
	source_for_clip: function(clip){
		return Util.array_find(Audio.sources, {clip: clip}, 'clip');
	},
	source_from_clip: function(clip, media, player) {
		var quantize, times, source, url = Audio.media_url(media);
		if (url && Loader.cached_urls[url]) {
			quantize = player.mash.quantize;
			times = Audio.clip_timing(clip, Audio.zero_seconds(), quantize);
			if ((times.duration > 0) && (! isNaN(times.start))) {
				source = {};
				source.clip = clip;
				source.media = media;
				source.url = url;
				source.player = player;
				source.quantize = quantize;
				source.buffer_source = Audio.buffer_source(Loader.cached_urls[url]);
				if ((Constant.audio === media.type) && media.loops) Audio.__buffer_source.loop = true;
				Audio.connect_source(source, times.start, times.offset, times.duration);
				Audio.gain_source(source);
				Audio.sources.push(source);
			}
		}
		return source;
	},
	sync: function(now_seconds){//_drawn
		Audio.__last_seconds = now_seconds;
		Audio.__sync_seconds = Audio.get_ctx().currentTime;
		//console.log(Audio.time());
	},
	time: function(){
		return Audio.__last_seconds + (Audio.get_ctx().currentTime - Audio.__sync_seconds);
	},
	zero_seconds: function() { 
		return Audio.__sync_seconds - Audio.__last_seconds;
	},
	sources: [],
	ctx: null,
	__last_seconds: 0,
	__sync_seconds: 0,
};

var Constant = {
	audio: 'audio',
	both: 'both',
	effect: 'effect',
	font: 'font',
	gain: 'gain',
	image: 'image',
	merger: 'merger',
	mute_shorthand: '0',
	mute: '0,0,1,0',
	property_types: {
		rgba: {
			type: String,
			value: '#000000FF',
		},
		rgb: {
			type: String,
			value: '#000000',
		},
		font: {
			type: String,
			value: 'com.moviemasher.font.default',
		},
		fontsize: {
			type: Number,
			value: 13,
		},
		direction4:{
			type: Number,
			values: [0, 1, 2, 3],
			value: 0,
		},
		direction8:{
			type: Number,
			values: [0, 1, 2, 3, 4, 5, 6, 7],
			value: 0,
		},
		string: { 
			type: String,
			value: '',
		},
		text: { 
			type: String,
			value: '',
		},
	},
	scaler: 'scaler',
	source: 'source',
	theme: 'theme',
	transition: 'transition',
	video: 'video',
	volume: 'volume',
};
Constant.track_types = [Constant.video, Constant.audio];

var Defaults = {
	modules: {
		font: {
			"label": "Blackout Two AM",
			"id":"com.moviemasher.font.default",
			"type":"font",
			"source": "media/font/default.ttf",
			"family":"Blackout Two AM"
		},
		merger: {
			label: 'Top Left',
			id: 'com.moviemasher.merger.default',
			"filters": [
				{
					"id": "overlay",
					"parameters": [
						{
							"name": "x",
							"value":"0"
						},{
							"name": "y",
							"value":"0"
						}
					]
				}
			]
		},
		scaler: {
			label: 'Stretch',
			id: 'com.moviemasher.scaler.default',
			"filters": [
				{
					"id": "scale",
					"parameters": [
						{
							"name": "width",
							"value":"mm_width"
						},{
							"name": "height",
							"value":"mm_height"
						}
					]
				},{
					"id": "setsar",
					"parameters": [
						{
							"name": "sar",
							"value":"1"
						},{
							"name": "max",
							"value":"1"
						}
					]
				}
			]
		}
	},
	module_for_type: function(type, mod_id) {
		var mod = Defaults.modules[type];
		if (mod && mod_id && (mod.id !== mod_id)) mod = null;
		return mod;
	},
	module_from_type: function(type){
		var ob = {}, mod = Defaults.module_for_type(type);
		if (! mod) console.error('Defaults.module_from_type not found', type);
		else ob.id = mod.id;
		return ob;
	},
};

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
		},
		parameters: [
			{ name: "color", value:"color" },
			{ name: "size", value:"mm_dimensions" },
			{ name: "duration", value:"mm_duration" },
			{ name: "rate", value:"mm_fps" },
		],
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
			var path, loaded_font, context, drawing = contexts[0]; // one input
			context = Filter.create_drawing_like(drawing, Filter.label(filter_config) + ' ' + evaluated.fontsize + 'px ' + evaluated.x + ',' + evaluated.y + ' ' + evaluated.fontcolor + ' ' + evaluated.shadowcolor + ' ' + evaluated.shadowx + ',' + evaluated.shadowy);
			if (evaluated.shadowcolor){
				context.context.shadowColor = evaluated.shadowcolor;
				context.context.shadowOffsetX = evaluated.shadowx || 0; // integer
				context.context.shadowOffsetY = evaluated.shadowy || 0; // integer
				context.context.shadowBlur = 0; // sorry, no blur supported yet in ffmpeg
			}
			loaded_font = Loader.cached_urls[evaluated.fontfile];
			path = loaded_font.getPath((evaluated.text || evaluated.textfile), evaluated.x, Number(evaluated.y) + Number(evaluated.fontsize), evaluated.fontsize);
       		path.fill = evaluated.fontcolor;
       		path.draw(context.context);
			drawing.context.drawImage(context.canvas, 0, 0);
			return contexts;
		}, parse: function(contexts, scope) {
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
				var url = '', font = MovieMasher.find(Constant.font, font_id);
				if (font) url = font.source;
				else console.warn('no registered font url with id', font_id, font);
				return url;
				
				// in javascript we need the family instead of file
				//return scope.mm_fontfamily(font_id);
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

/*global opentype:true*/
var Loader = {
	load_audio: function(url){
		Audio.load(url);
	},
	load_font: function(url){
		Loader.requested_urls[url] = url;
		opentype.load(url, function (err, loaded_font) {
			if (err) console.error('could not find registered font with url', url, err);
			else {
				//console.log('loaded font', loaded_font.draw);
				Loader.cached_urls[url] = loaded_font;
				delete Loader.requested_urls[url];
				Players.draw_delayed();
			}
		});
	},
	load_image: function(url){
		Loader.requested_urls[url] = new Image();
		Loader.requested_urls[url].onload = function(){
			//console.log('image.onload', url);
			Loader.cached_urls[url] = Loader.requested_urls[url];
			delete Loader.requested_urls[url];
			Players.draw_delayed();
		};
		Loader.requested_urls[url].src = url;
	},
	load_urls_of_type: function(urls){
		var url, loaded = false;
		for (url in urls){
			if (! (Loader.cached_urls[url] || Loader.requested_urls[url])) {
				loaded = true;
				//console.log('Loader.load_urls_of_type', urls[url], url);
				switch(urls[url]){
					case Constant.font: {
						Loader.load_font(url);
						break;
					}
					case Constant.image: {
						Loader.load_image(url);
						break;
					}
					case Constant.audio: {
						Loader.load_audio(url);
						break;
					}
					default: {
						console.error('cannot load media of unsupported type', urls[url], url);
					}
				}
			}
		}
		return loaded;
	},
	loaded_urls_of_type: function(urls){
		var url, loaded = true;
		for (url in urls){
			if (! Loader.cached_urls[url]) {
				loaded = false;
				break;
			}
		}
		return loaded;
	},
	cached_urls: {},
	requested_urls: {},
};
// set up unbuffer timer
setInterval(function(){
	var url, i, z = Players.instances.length, deletable = Loader.cached_urls;
	for (i = 0; i < z; i++) {
		deletable = Players.instances[i].deleteable_urls(deletable);
	}
	for (url in deletable) {
		delete Loader.cached_urls[url];
	}
}, 2000); 

var Mash = {
	clip_from_media: function(media){
		var key, type, property_type, property, clip = {id:media.id};
		if (media.properties){
			for (key in media.properties) {
				property = media.properties[key];
				if (! Util.isnt(property.value)) clip[key] = property.value;
				else {
					type = property.type;
					if (type){
						property_type = Constant.property_types[type];
						if (property_type){
							if (! Util.isnt(property_type.value)) clip[key] = property_type.value;
							else if (property_type.type) clip[key] = new property_type.type();
						}
					}
				}
			}
		}
		return clip;
	},
	clip_has_audio: function(clip, media) {
		var has = false;
		switch(media.type){
			case Constant.video: {
				has = !! Audio.media_url(media);
				break;
			}
			case Constant.audio: {
				has = (media.url || media.source);
				break;
			}
		}
		if (has){
			switch(clip[Constant.gain]){
				case Constant.mute:
				case Constant.mute_shorthand: has = false;
			}
		}
		return has;
	},
	clip_time: function(clip, media, time, quantize, add_one_frame) {
		var clip_time = time.copyTime();
		clip_time.subtract(new TimeRange(clip.frame, quantize));
		var limit_time = new TimeRange(clip.frames, quantize);
		clip_time.min(limit_time);
		if (add_one_frame) {
			clip_time.frame += (clip.speed ? Math.ceil(clip.speed) : 1);
		}
		switch (media.type) {
			case Constant.video:
				if (clip.trim) {
					clip_time.add(new TimeRange(clip.trim, quantize));
				}
				if (clip.speed) {
					clip_time.divide(clip.speed, 'ceil');
				}
				break;
			case Constant.audio:
				if (clip.trim) clip_time.add(new TimeRange(clip.trim, quantize));
				break;
		}
		return clip_time;
	},
	effect_clips: function(vis_clips){
		var i, z, clip, clips = [];
		z = vis_clips.length;
		for (i = 0; i < z; i++){
			clip = vis_clips[i];
			if (Util.isarray(clip.effects) && clip.effects.length) clips = clips.concat(clip.effects);
		}
		return clips;
	},
	init_clip: function(mash, clip, media, track_index){
		if (! track_index) track_index = 0;
		if (clip && media && mash && (! Mash.init_media(media))) {
			if (Mash.is_modular_media(media)) Mash.init_module(media.type, clip, media);
			if (Constant.effect !== media.type){
				if (Util.isnt(clip.track)) clip.track = track_index;
				if (Util.isnt(clip.frame)) clip.frame = 0;
				switch(media.type){
					case Constant.video:
					case Constant.audio: {
						if (Util.isnt(clip[Constant.gain])) clip[Constant.gain] = 1.0;
						if (Util.isnt(clip.frames)) clip.frames = (new TimeRange(media.duration, 1)).scale(mash.quantize, 'floor').frame;
						if (Util.isnt(clip.trim)) clip.trim = 0;
						break;
					}
					default: {
						if (Util.isnt(clip.frames)) clip.frames = (new TimeRange(Option.mash[media.type + '_seconds'], 1)).scale(mash.quantize).frame;
					}
				}
				switch(media.type){
					case Constant.transition:
					case Constant.audio: break;
					default: {
						if (Util.isnt(clip.scaler)) clip.scaler = media.scaler || Defaults.module_from_type(Constant.scaler);
						if (Util.isnt(clip.merger)) clip.merger = media.merger || Defaults.module_from_type(Constant.merger);
						if (Util.isnt(clip.effects)) clip.effects = media.effects || [];
						media = clip.scaler;
						Mash.init_module(Constant.scaler, media, Mash.media_search(Constant.scaler, media.id, mash));
						media = clip.merger;
						Mash.init_module(Constant.merger, media, Mash.media_search(Constant.merger, media.id, mash));
						var i, z = clip.effects.length;
						for (i = 0; i < z; i++){
							media = clip.effects[i];
							Mash.init_module(Constant.effect, media, Mash.media_search(Constant.effect, media.id, mash));
						}
					}
				}
			}
		}
	},
	init_mash: function(mash){
		Util.copy_ob_scalars(Option.mash.default, mash, true);
		mash.quantize = (mash.quantize ? parseInt(mash.quantize) : 1);
		if (Util.isnt(mash.id)) mash.id = Util.uuid();
		var media_references, media, clip, tracks, track, key, i, z, j, y, x, k;
		media_references = {};
		if (! Util.isarray(mash.media)) mash.media = [];
		x = Constant.track_types.length;
		for (k = 0; k < x; k++){
			key = Constant.track_types[k];
			if (! Util.isarray(mash[key])) mash[key] = [];
			tracks = mash[key];
			z = tracks.length;
			if (z) {
				for (i = 0; i < z; i++){
					track = Mash.init_track(tracks[i], i);
					y = track.clips.length;
					if (y){
						for (j = 0; j < y; j++){
							clip = track.clips[j];
							media = Mash.media(mash, clip);
							Mash.init_clip(mash, clip, media, i);
						}
						Mash.media_count_for_clips(mash, track.clips, media_references);
					}
				}
			} else tracks.push(Mash.init_track(key, 0));
		}
		for(key in media_references){
			media_references[key] = media_references[key].count;
		}
		return media_references;
	},
	init_media: function(media){
		
		var error = ! Util.isob(media);
		if (! error) {
			if (Util.isnt(media.id)) media.id = Util.uuid();
			switch(media.type) {
				case Constant.video: {
					if (Util.isnt(media.fps)) media.fps = 10;
					if (Util.isnt(media.duration)) media.duration = 0;
					if (Util.isnt(media.begin)) media.begin = 1;
					if (Util.isnt(media.pattern)) media.pattern = '%.jpg';
					if (Util.isnt(media.increment)) media.increment = 1;
					if (Util.isnt(media.zeropadding)) media.zeropadding = String(media.begin + (media.increment * Math.floor(media.fps * media.duration))).length;
					break;
				}
				case Constant.transition: {
					if (Util.isnt(media.to)) media.to = {};
					if (Util.isnt(media.from)) media.from = {};
					if (Util.isnt(media.to.scaler)) media.to.scaler = Defaults.module_from_type(Constant.scaler);
					if (Util.isnt(media.to.merger)) media.to.merger = Defaults.module_from_type(Constant.merger);
					if (Util.isnt(media.from.scaler)) media.from.scaler = Defaults.module_from_type(Constant.scaler);
					if (Util.isnt(media.from.merger)) media.from.merger = Defaults.module_from_type(Constant.merger);
			//console.log('init_media', media, media.id);
					break;
				}
			}
		}
		if (error) console.error('init_media got invalid media', media);
		return error;
	},
	init_module: function(type, module, media){
		if (media) {
			if (media.properties) {
				var k;
				for (k in media.properties){
					if (Util.isnt(module[k])) module[k] = media.properties[k].value;
				}
			}
		} else return console.error("could not find media for module", module);
	},
	init_track: function(track, index){
		if (! Util.isob(track)) track = {type:track};
		track.index = index;
		if (! Util.isarray(track.clips)) track.clips = [];
		return track;
	},
	is_modular_clip: function(mash, clip){
		return Mash.is_modular_media(Mash.media(mash, clip));
	},
	is_modular_media: function(media){
		var is = false;
		if (Util.isob(media) && (! Util.isnt(media.type))) {
			switch(media.type){
				case Constant.image:
				case Constant.audio:
				case Constant.video:
				case 'frame': break;
				default: is = true;
			}
		}
		return is;
	},
	is_visual_media: function(media){
		var is = false;
		if (Util.isob(media)) {
			switch(media.type){
				case Constant.image:
				case Constant.video:
				case Constant.transition:
				case Constant.theme: is = true;
			}
		}
		return is;
	},
	length_of_clips: function(clips){
		var clip, frames = 0;
		if (Util.isarray(clips) && clips.length) {
			clip = clips[clips.length -1];
			frames = clip.frame + clip.frames;
		}
		return frames;
	},
	loaded_range: function(mash, range, audio_on){
		var urls = Mash.urls_for_clips(mash, Mash.range_clips(mash, range, audio_on), range);
		return Loader.loaded_urls_of_type(urls);
	},
	max_frames_for_clip: function(clip, media, quantize){
		var max = 0;
		switch(media.type){
			case Constant.audio:
			case Constant.video: {
				max = Math.floor(media.duration * quantize) - clip.trim;
				break;
			}
		}
		return max;
	},
	max_trim_for_clip: function(clip, media, quantize){
		var max = 0;
		switch(media.type){
			case Constant.audio:
			case Constant.video: {
				max = Math.floor(media.duration * quantize) - Option.mash.minframes;
				break;
			}
		}
		return max;
	},
	media: function(mash, ob_or_id){
		return Util.array_find(mash.media, ob_or_id);
	},
	media_count_for_clips: function(mash, clips, referenced){
		var clip, media, j, y, i, z, key, keys, reference;
		if (Util.isob(referenced) && Util.isarray(clips)) {	
			y = clips.length;
			for (j = 0; j < y; j++){
				clip = clips[j];
				if (! clip) console.error('media_count_for_clips', clips);
				
				Mash.media_reference(mash, clip.id, referenced);
				reference = referenced[clip.id];
				if (reference){
					media = reference.media;
					if (media) {
						if (Mash.is_modular_media(media)) {
							keys = Mash.properties_for_media(media, Constant.font);
							z = keys.length;
							for (i = 0; i < z; i++){
								key = keys[i];
								key = clip[key];
								Mash.media_reference(mash, key, referenced, Constant.font);
							}
						}
						switch(media.type){
							case Constant.transition: {
								Mash.media_merger_scaler(mash, media.to, referenced);
								Mash.media_merger_scaler(mash, media.from, referenced);
								break;
							}
							case Constant.effect:
							case Constant.audio: break;
							default: {
								Mash.media_merger_scaler(mash, clip, referenced);
								Mash.media_count_for_clips(mash, clip.effects, referenced);
							}
						}
					} else {
						console.error('could not find media', clip.id, reference);
					}
				} else {
					console.error('could not find reference');
				}
			}
		}
	},
	media_for_clips: function(mash, clips, media){
		var reference, k, referenced = {}, medias = [];
		if (! Util.isnt(clips)) {
			if (Util.isob(media)) {
				referenced[media.id] = {
					media: media,
					count: 1,
				};
			}
			if (! Util.isarray(clips)) clips = [clips];
			Mash.media_count_for_clips(mash, clips, referenced);
			for(k in referenced){
				reference = referenced[k];
				if (reference.media) medias.push(reference.media);
				else console.error('could not find media referenced in mash', k, reference.count);
			}
		}
		return medias;
	},
	media_merger_scaler: function(mash, object, referenced){
		if (Util.isob(object)) {
			//console.log(object[Constant.merger].id, object[Constant.scaler].id);
			if (Util.isob(object[Constant.merger])) Mash.media_reference(mash, object[Constant.merger].id, referenced, Constant.merger);
			if (Util.isob(object[Constant.scaler])) Mash.media_reference(mash, object[Constant.scaler].id, referenced, Constant.scaler);
		}
	},
	media_range: function(clip, media, range, quantize, add_one_frame) {
		var result = TimeRange.fromTimes(Mash.clip_time(clip, media, range, quantize), Mash.clip_time(clip, media, range.endTime, quantize, add_one_frame));
		return result;
	},
	media_reference: function(mash, media_id, referenced, type){
		if (referenced[media_id]) referenced[media_id].count++;
		else {
			referenced[media_id] = {};
			referenced[media_id].count = 1;
			referenced[media_id].media = Mash.media_search(type, media_id, mash);
		} 
	},
	media_search: function(type, ob_or_id, mash){
		var ob = null;
		if ( ! Util.isnt(ob_or_id)) {
			if (mash) ob = Mash.media(mash, ob_or_id);
			if (! ob) ob = MovieMasher.find(type, ob_or_id);
			if (! ob) ob = Defaults.module_for_type(type);
		}
		return ob;
	},
	module_clips: function(mash){
		var clip, i, z, clips, vis_clips;
		vis_clips = Mash.visual_clips(mash);
		clips = Mash.effect_clips(vis_clips); // all effects are modules
		z = vis_clips.length;
		for (i = 0; i < z; i++) {
			clip = vis_clips[i];
			if (Mash.is_modular_clip(mash, clip)) clips.push(clip);
		}
		return clips;
	},
	modules_reference_media: function(mash, ob_or_id){
		var does, i, z, key, keys, j, y, media, clip, clips = Mash.module_clips(mash);
		if (Util.isob(ob_or_id)) ob_or_id = ob_or_id.id;
		if (ob_or_id) {
			z = clips.length;
			for (i = 0; i < z; i++) {
				clip = clips[i];
				if (clip.scaler) does = (ob_or_id === clip.scaler.id);
				if (clip.merger) does = (does || (ob_or_id === clip.merger.id));
				if (! does){
					media = Mash.media(mash, clip);
					if (media){
						keys = Mash.properties_for_media(media, Constant.font);
						y = keys.length;
						for (j = 0; j < y; j++){
							key = keys[j];
							does = (ob_or_id === clip[key]);
							if (does) break;
						}
					}
				}
				if (does) break;
			}
		}
		return does;
	},
	properties_for_media: function(media, type){
		var key, prop_keys = [];
		if ((! Util.isnt(type)) && Util.isob(media) && Util.isob(media.properties)){
			for(key in media.properties){
				if (type === media.properties[key].type){
					prop_keys.push(key);
				}
			}
		}
		return prop_keys;
	},
	range_clips: function(mash, time, include_audio){
		time = time.copyTimeRange();
		var clip_time, key, tracks, track, clips = [], clip, i, z, j, y, k, x;
		clip_time = new TimeRange(0, mash.quantize, 1);
		x = Constant.track_types.length;
		for (k = 0; k < x; k++){
			key = Constant.track_types[k];
			if ((key === Constant.audio) && (! include_audio)) continue;
			tracks = mash[key];
			z = tracks.length;
			for (i = 0; i < z; i++) {
				track = tracks[i];
				y = track.clips.length;
				for (j = 0; j < y; j++) {
					clip = track.clips[j];
					clip_time.frame = clip.frame;
					clip_time.frames = clip.frames;
					if (clip_time.intersection(time)) clips.push(clip);
				}
			}
		}
		return clips;
	},
	recalc_clips: function(clips){
		if (clips.length > 1) clips.sort(Util.sort_by_frame);
	},
	recalc_track: function(mash, track){
		if ((Constant.audio === track.type) || track.index) Mash.recalc_clips(track.clips);
		else Mash.recalc_video_clips(mash, track.clips);
	},
	recalc_video_clips: function(mash, clips) {
		var media, i, z, clip, start_time = 0;
		z = clips.length;
		for (i = 0; i < z; i++){
			clip = clips[i];
			media = Mash.media(mash, clip);
			if (i && (Constant.transition === media.type)) start_time -= clip.frames;
			clip.frame = start_time;
			if (Constant.transition !== media.type) start_time += clip.frames;
		}
		Mash.recalc_clips(clips); // sorts by frame 
	},
	track_for_clip: function(mash, clip, media){
		if (! media) media = Mash.media(mash, clip);
		var track, tracks, i = 0, z;
		tracks = mash[Constant.audio === media.type ? Constant.audio : Constant.video];
		if (! Util.isnt(clip.track)) {
			i = clip.track;
			z = i + 1;
		} else z = tracks.length;
		for (; i < z; i++){
			track = tracks[i];
			if (-1 < track.clips.indexOf(clip)) return track;
		}
	},
	urls_for_clip: function(mash, clip, range, resources){
		var quantize, media, i, z, key, keys, font;
		quantize = mash.quantize;
		media = Mash.media(mash, clip);
		if (! Util.isob(resources)) resources = {};
		if (clip && media) {
			switch(media.type){
				case 'frame':
				case Constant.video: {
					if (! resources.image) resources.image = {};
					Mash.urls_for_video_clip(clip, media, range, quantize, resources.image);
				}
				case Constant.audio: {
					if (Mash.clip_has_audio(clip, media)) {
						if (! resources.audio) resources.audio = {};
						resources.audio[Audio.media_url(media)] = true;
					}
					break;
				}
				case Constant.image: {
					if (! resources[media.type]) resources[media.type] = {};
					resources[media.type][media.url || media.source] = true;
					break;
				}
				default: { // modules
					keys = Mash.properties_for_media(media, Constant.font);
					z = keys.length;
					if (z) {
						for (i = 0; i < z; i++){
							key = keys[i];
							font = Mash.media_search(Constant.font, clip[key], mash);
							//console.log(key, clip[key], font);
							if (font){
								if (font.source) {
									//console.log(Constant.font, key, font.source);
									if (! resources.font) resources.font = {};
									resources.font[font.source] = true;
								}
							}
							else console.warn('could not find font', clip[key]);
						}
					}
				}
			}
			if (Mash.is_visual_media(media)){
				if (Util.isarray(clip.effects) && clip.effects.length) {
					//console.log('effects', clip.effects);
					z = clip.effects.length;
					for (i = 0; i < z; i++){
						Mash.urls_for_clip(mash, clip.effects[i], range, resources);
					}
				}
			}
		}
		return resources;
	},
	urls_for_clips: function(mash, clips, range, avb){
		return Mash.urls_of_type(Mash.urls_for_clips_by_type(mash, clips, range), avb);
	},
	urls_for_clips_by_type: function(mash, clips, range){
		// range is in this.__fps
		range = range.copyTimeRange();
		var resources = {};
		var clip, j, y;
		y = clips.length;
		for (j = 0; j < y; j++){
			clip = clips[j];
			Mash.urls_for_clip(mash, clip, range, resources);
		}
		return resources;
	},
	urls_for_video_clip: function(clip, media, range, quantize, resources){
		if (! resources) resources = {};
		var add_one_frame = (range.frames > 1);
		range = Mash.media_range(clip, media, range, quantize, add_one_frame);
		var s, url;
		var last_frame, frame,z;
		var media_time = new TimeRange(Math.floor(Number(media.duration) * Number(media.fps)), media.fps);
		var last_media_frame = media_time.frame;
		var limited_range = range.copyTimeRange();

		limited_range.minLength(media_time);
		z = limited_range.end;
		frame = limited_range.frame;
		for (; frame <= z; frame ++) {
			media_time = new TimeRange(frame, limited_range.fps);
			media_time.scale(media.fps);
			if ((frame !== limited_range.frame) && (last_frame === media_time.frame)) continue;
			last_frame = media_time.frame;
			last_frame = Math.min(last_frame, last_media_frame - 1);
			s = String((Math.min(last_frame, last_media_frame) * media.increment) + media.begin);
			if (media.zeropadding) s = Util.pad(s, media.zeropadding, '0');
			url = media.url + media.pattern;
			url = url.replace('%', s);
			//console.log('pattern', media.pattern, url);
			resources[url] = true;
		}
		return resources;
	},
	urls_of_type: function(urls_by_type, avb){
		var urls = {};
		var type, url;
		for (type in urls_by_type){
			switch(avb){
				case Constant.audio: {
					if (type !== avb) continue;
					break;
				}
				case Constant.video: {
					if (type === Constant.audio) continue;
					break;
				}
			}
			for (url in urls_by_type[type]){
				urls[url] = type;
			}
		}
		return urls;
	},
	visual_clips: function(mash){			
		var track, i, z, clips = [];
		z = mash.video.length;
		for (i = 0; i < z; i++) {
			track = mash.video[i];
			if (Util.isarray(track.clips) && track.clips.length) clips = clips.concat(track.clips);
		}
		return clips;
	},
};

var MovieMasher;
MovieMasher = function() { // it's not necessary to instantiate, but you can
	this.instance_arguments = arguments;
	this.MovieMasher = MovieMasher;
	this.initialize();
};
MovieMasher.prototype.initialize = function(){}; // override me to parse instance_arguments
MovieMasher.configure = function(options){
	if (Util.isob(options)) Option.set(options);
	return Option;
};
MovieMasher.find = function(type, ob_or_id, key){
	var ob;
	if (Util.isob(ob_or_id)) ob_or_id = ob_or_id[key || 'id'];
	if (ob_or_id){
		if (Util.isnt(MovieMasher.registered[type])) {
			//console.log('finding first type', type);		
			MovieMasher.registered[type] = [];
		}
		ob = Util.array_find(MovieMasher.registered[type], ob_or_id, key);
		if (! ob) {
			ob = Defaults.module_for_type(type, ob_or_id);
			if (ob) {
				MovieMasher.registered[type].push(ob);
				MovieMasher.registered[type].sort(Util.sort_by_label);
			} else console.log('could not find registered ' + type, ob_or_id);
		}
	}
	return ob;
};
MovieMasher.player = function(index_or_options){
	var result = null;
	if (Util.isnt(index_or_options)) index_or_options = {};
	if (Util.isob(index_or_options)) { // new player
		result = new Player(index_or_options);
		Players.instances.push(result);
	} else result = Players.instances[index_or_options];
	return result;
};
MovieMasher.register = function(type, media){
	if (! Util.isarray(media)) media = [media];
	if (Util.isob.apply(Util, media)) {
		var found_ob, first_for_type, found_default, ob, i, z = media.length;
		if (z) {
			first_for_type = Util.isnt(MovieMasher.registered[type]);
			if (first_for_type) {
				//console.log('registering first of type', type);
				MovieMasher.registered[type] = [];
			}
			for (i = 0; i < z; i++){
				ob = media[i];
				found_ob = Util.array_find(MovieMasher.registered[type], ob);
				if ('com.moviemasher.' + type + '.default' === ob.id) {
					found_default = true;
					if (found_ob) { // overwriting default
						Util.array_delete(MovieMasher.registered[type], found_ob);
						found_ob = null;
					}
				}
				if (! found_ob) {
					MovieMasher.registered[type].push(ob);
					MovieMasher.registered[type].sort(Util.sort_by_label);
				}
			}
		}
		if (first_for_type && (! found_default)) {
			ob = Defaults.module_for_type(type);
			if (ob) {
				MovieMasher.registered[type].push(ob);
				MovieMasher.registered[type].sort(Util.sort_by_label);
			}	
		}
	}
};
MovieMasher.registered = {};
MovieMasher.supported = !! (Object.defineProperty && document.createElement("canvas").getContext && (window.AudioContext || window.webkitAudioContext));

var Option = {
	mash: {
		minframes: 1,
		quantize: 10,
		transition_seconds: 1,
		frame_seconds: 2,
		image_seconds: 2,
		theme_seconds: 3,
		default: {label: 'Untitled Mash', quantize:1, backcolor:'rgb(0,0,0)'},
	},
	player: {
		autoplay: 0,
		buffertime: 10,
		fps: 30,
		loop: 1,
		minbuffertime: 1,
		unbuffertime: 1,
		volume: 0.75,
	},
	set: function(opts){
		Util.copy_keys_recursize(opts, Option);
	},
	timeline: {
		hscrollpadding: 20,
	}
};

var Player = function(evaluated) {
	if (! Util.isob(evaluated)) evaluated = {};
	var value, key, new_mash = {};
	Util.copy_ob_scalars(Option.player, evaluated);
	this.__drawing = {drawings: []};
	this.__load_timer = null;
	this.__moving = false;
	this.__muted = false;
	this.__paused = true;
	this.__stalling = false;
	this.__minbuffertime = new TimeRange(evaluated.minbuffertime, 1);
	this.__unbuffertime = new TimeRange(evaluated.unbuffertime, 1);	
	this.__buffertime = new TimeRange(evaluated.buffertime, 1);
	this.__time = new TimeRange(0, 1);
	this.__time_drawn = new TimeRange(0, 1);
	for (key in evaluated){
		value = evaluated[key];
		switch(key){
			case "mash": new_mash = value;
			case "minbuffertime":
			case "unbuffertime":
			case "buffertime":
			case "fps": continue;
			default: this[key] = value; // gain, loop, autoplay, volume, etc.
		}
	}
	this.fps = evaluated.fps; // sets this.__fps and scales other times
	this.mash = new_mash;
};
(function(pt){
	var dp = Object.defineProperty;
	dp(pt, "action_index", {
		get: function() { return this.__action_index;}
	}); // action_index
	dp(pt, "autoplay", {
		get: function() {return this.__autoplay;},
		set: function(bool) { 
			this.__autoplay = bool;
		}
	}); // autoplay
	dp(pt, "buffertime", {
		get: function() {return this.__buffertime.seconds;},
		set: function(seconds) { this.__buffertime = TimeRange.fromSeconds(seconds, this.__fps); }
	}); // buffertime
	dp(pt, "canvas_context", {
		get: function() { return this.__drawing.context; },
		set: function(drawing_context) {
			//console.log('canvas_context=', drawing_context);
			this.__drawing.context = drawing_context;
			this.__drawing.canvas = (drawing_context ? drawing_context.canvas : null);
			if (this.__mash) {
				this.__draw_context();
				this.redraw(); // will draw if buffered, otherwise start buffering
			}
		}
	}); // canvas_context
	dp(pt, "canvas_container", {
		get: function() { return this.__drawing.container; },
		set: function(element) {
			//console.log('canvas_container=', element);
			this.__drawing.container = element;
		}
	}); // canvas_container
	dp(pt, "currentTime", {
		get: function() { return this.__time.seconds; },
		set: function(seconds) { 
			this.time = TimeRange.fromSeconds(seconds, this.__fps);
		}
	}); // currentTime
	dp(pt, "duration", { 
		get: function() { return (this.__mash_length ? Number(this.__mash_length) / Number(this.__mash.quantize) : 0.0); } 
	}); // duration
	dp(pt, "fps", {
		get: function() { return this.__fps;},
		set: function(rate) { 
			if (rate) {
				rate = Math.round(Number(rate));
				if (rate && (this.__fps !== rate)) {
					this.__fps = rate;
					this.__time.scale(this.__fps);
					this.__minbuffertime.scale(this.__fps);
					this.__unbuffertime.scale(this.__fps);
					this.__buffertime.scale(this.__fps);
					this.__time_drawn.scale(this.__fps);
				}
			}
		}
	}); // fps
	dp(pt, "frame", {
		get: function() { return this.__time.frame;},
		set: function(num) {
			//console.log('frame=', num);
			this.time = new TimeRange(num, this.__time.fps);
		}
	}); // frame
	dp(pt, "frames", {
		get: function() { return Math.round(Number(this.__mash_length) / Number(this.__mash.quantize) * Number(this.__time.fps));}
	}); // frame
	dp(pt, "loop", {
		get: function() { return this.__loop;},
		set: function(bool) { 
			this.__loop = bool;
		}
	}); // loop
	dp(pt, "mash", {
		get: function() { return this.__mash; },
		set: function(obj) { 
			this.paused = true;
			this.__action_index = -1;
			this.__action_stack = [];
			this.__selected_effects = [];
			this.__mash = obj || {};
			this.__media_references = Mash.init_mash(this.__mash);
			this.selectedClips = []; // so mash gets copied into __pristine_clip
			this.mash_length_changed();
			this.rebuffer();
			this.redraw();
			if (this.__autoplay) this.paused = false;
		}
	}); // mash
	dp(pt, "minbuffertime", {
		get: function() {return this.__minbuffertime.seconds;},
		set: function(seconds) { this.__minbuffertime = TimeRange.fromSeconds(seconds, this.__fps); }
	}); // minbuffertime
	dp(pt, "muted", {
		get: function() { return this.__muted;},
		set: function(bool) { 
			this.__muted = bool;
			//console.log('muted=', this.__muted);
		}
	}); // muted
	dp(pt, "paused", {
		get: function() { return this.__paused;},
		set: function(bool) { 
			if (! this.__mash_length) bool = true;
			if (this.__paused !== bool){
				this.__paused = bool;
				if (this.__paused) {
					Players.stop_playing();
					this.__set_moving(false);
					if (this.__buffer_timer) {
						clearInterval(this.__buffer_timer);
						this.__buffer_timer = 0;
					}
				} else {
					Players.start_playing(this);
					if (! this.__buffer_timer){
						var $this = this;
						this.__buffer_timer = setInterval(function(){$this.rebuffer();}, 2000);
					}
					this.rebuffer();
					this.redraw();
				}
				this.__set_stalling((! this.__moving) && (! this.__paused));	
			}
		}
	}); // paused
	dp(pt, "position", {
		get: function() { 
			var dur, pos = 0;
			if (this.__time.frame) {
				dur = this.duration;
				if (dur) pos = this.__time.seconds / dur;
			}
			return pos;
		},
		set: function(per) {
			this.time = new TimeRange(this.duration * per, 1);
		}
	}); // position
	dp(pt, 'selectedClip', { get: function(){ 
		return (this.__selected_clips.length === 1 ? this.__selected_clips[0] : null); 
	}, set: function(item){
		this.selectedClips = (Util.isob(item) ? [item] : []);
	}}); // selectedClip
	dp(pt, "selectedClipOrMash", {
		get: function() { return this.selectedClip || this.__mash; },
	}); // selectedClipOrMash
	dp(pt, "selectedClips", {
		get: function() { return this.__selected_clips; },
		set: function(selection) {
			var key, media, clip, i, z, types;
			if (! Util.isob(selection)) selection = [];
			if (selection.length){
				types = {};
				z = selection.length;
				for (i = 0; i < z; i++){
					clip = selection[i];
					media = Mash.media(this.__mash, clip);
					key = media.type;
					switch(key){
						case Constant.audio: break;
						case Constant.effect: continue; // effects are ignored
						default: key = 'video-' + (clip.track || 0);
					}
					if (! types[key]) types[key] = [];
					types[key].push(clip);
				}
				for(key in types) {
					selection = types[key];
					break; // we only select first track type found
				}
			}
			this.__selected_clips = selection;
			this.selectedEffects = false;
			this.__pristine_clip = Util.copy_ob_scalars(this.selectedClipOrMash);
			//console.log('__pristine_clip', this.__pristine_clip);
			if (this.selectedClipOrMash.scaler) this.__pristine_clip.scaler = Util.copy_ob_scalars(this.selectedClipOrMash.scaler);
			if (this.selectedClipOrMash.merger) this.__pristine_clip.merger = Util.copy_ob_scalars(this.selectedClipOrMash.merger);
		},
	}); // selectedClips
	dp(pt, 'selectedEffect', { get: function(){ 
		return (this.__selected_effects.length === 1 ? this.__selected_effects[0] : null); 
	}, set: function(item){
		this.selectedEffects = (Util.isob(item) ? [item] : []);
	}}); // selectedEffect
	dp(pt, "selectedEffects", {
		get: function() { return this.__selected_effects; },
		set: function(selection) {
			var effect, i, z, media, effects, target;
			if (! Util.isarray(selection)) selection = [];
			if (selection.length && (this.__selected_clips.length < 2)){ // a clip or the mash
				target = this.selectedClip;
				effects = [];
				if (target && Util.isarray(target.effects)) {
					z = selection.length;
					for (i = 0; i < z; i++){
						effect = selection[i];
						media = Mash.media(this.__mash, effect);
						if (media && (Constant.effect === media.type) && (-1 < target.effects.indexOf(effect))) effects.push(effect);
					}
				}
				selection = effects;
			}
			this.__selected_effects = selection;
			this.__pristine_effect = Util.copy_ob_scalars(this.selectedEffect);
		}
	}); // selectedEffects
	dp(pt, "stalling", { 
		get: function() { return this.__stalling;} 
	}); // stalling
	dp(pt, "time", {
		get: function() { return this.__time;},
		set: function(something) {
			var new_time = TimeRange.fromSomething(something);
			new_time = this.__limit_time(new_time);
			if (! this.__time.isEqualToTime(new_time)) {
				this.__redraw_moving(new_time);
			}
		}
	}); // time
	dp(pt, "unbuffertime", {
		get: function() {return this.__unbuffertime.seconds;},
		set: function(seconds) { this.__unbuffertime = TimeRange.fromSeconds(seconds, this.__fps); }
	}); // unbuffertime
	dp(pt, "volume", {
		get: function() { return this.__gain;},
		set: function(per) { 
			this.__gain = per;
		}
	}); // volume (gain)
	pt.add = function(media, type, frame_or_index, track_index){
		var action, objects, clip;
		if (! Mash.init_media(media)) {
			if (! type) type = (Mash.is_visual_media(media) ? Constant.video : media.type);
			if (! track_index) track_index = 0;
			if (! frame_or_index) frame_or_index = 0;
			clip = Mash.clip_from_media(media);
			if (! clip) console.error('add got no clip from media', clip, media);
			Mash.init_clip(this.__mash, clip, media, track_index);
			if (Constant.effect === type) action = this.__action_create_effect_add(clip, frame_or_index);
			else if ((Constant.audio === type) || track_index) action = this.__action_create_track_add(media.type, clip, track_index, frame_or_index);
			else action = this.__action_create_video_add(clip, track_index, frame_or_index);
			if (action){
				objects = Mash.media_for_clips(this.__mash, clip, media);
				//console.log('media_for_clips', clip, objects, media);
				action.redo_add_objects = objects;
				action.undo_delete_objects = objects;
				if (Constant.effect === media.type) action.redo_selected_effects = [clip];
				else action.redo_selected_clips = [clip];
				this.__action_add(action);
			}
		}
		return clip;
	};
	pt.add_media = function(array){
		var media_id, media, i, z;
		if (! Util.isarray(array)) array = [array];
		z = array.length;
		for (i = 0; i < z; i++){
			media = array[i];
			media_id = (Util.isob(media) ? media.id : media);
			if (! this.__media_references[media_id]){
				this.__media_references[media_id] = 0;
				if (! Util.array_find(this.__mash.media, media)) {
					this.__mash.media.push(media);
				}
			}
			this.__media_references[media_id]++;
		}
	}; // called by Action
	pt.addTrack = function(type){
		this.__action_add(new Action(this, function(){
			this.player.__track_create(type);
		}, function(){
			this.player.__track_delete(type);
		}));
	};
	pt.can = function(method){
		var should_be_enabled = false;
		var z = this.__selected_clips.length;
		switch(method){
			case 'undo':{
				should_be_enabled = (this.__action_index > -1);
				break;
			}
			case 'redo':{
				should_be_enabled = (this.__action_index < (this.__action_stack.length - 1));
				break;
			}
			case 'adjust':{
				should_be_enabled = (z > 0);
				if (should_be_enabled) should_be_enabled = (this.__selected_clips[0].track > 0);
				break;
			}
			case 'copy':{
				should_be_enabled = (z > 0);
				break;
			}
			case 'cut':
			case 'remove':{
				should_be_enabled = (this.__selected_clips.length);
				break;
			}
			case 'split':{
				should_be_enabled = (z === 1);
				if (should_be_enabled) should_be_enabled = this.__canSplitAtTime(this.__selected_clips[0], this.__time);
				break;
			}
			/* TODO: implement old operations...
			case 'paste':{
				should_be_enabled = (clipboard.length > 0);
				if (should_be_enabled && clipboard[0].appearsOnVisualTrack())
				{
					var insert_index = __insertIndex();
					should_be_enabled = __isDropTarget(insert_index, clipboard);
				}
				break;
			}
			case 'snap':{
				should_be_enabled = getValue(property).boolean;
				break;
			}
			case 'freeze':{
				should_be_enabled = (z > 0);
				if (should_be_enabled)
				{
					should_be_enabled = __clipCanBeSplit(this.__selected_clips[0], true);
				}
				break;
			}
			*/
		}
		return should_be_enabled;
	};
	pt.change = function(prop, is_effect){
		var media, action, target, target_copy, id = 'change-property';
		target = (is_effect ? this.selectedEffect : this.selectedClipOrMash);
		target_copy = (is_effect ? this.__pristine_effect : this.__pristine_clip);
		if (prop && target){
			if (
				(this.__action_index > -1) && // at least one action
				(this.__action_index === this.__action_stack.length - 1) && // current one is last one
				(Util.keys_found_equal({id: id, target: target, property: prop}, this.__action_stack[this.__action_index]))
			) { // so, reuse existing action
				action = this.__action_stack[this.__action_index];
				action.value = Util.ob_property(target, prop);
				//console.warn('reusing action', action.value);
				action._redo();
				this.__redraw_moving();
			} else {
				var undo_func = function() { this.set_property(this.orig_value); };
				var redo_func = function() { this.set_property(this.value); };
				var action_is_id = false;
				media = Mash.media(this.__mash, target);
				// check to see if we're changing a module's property of type font
				if (media && Mash.is_modular_media(media)) action_is_id = ((-1 < Mash.properties_for_media(media, Constant.font).indexOf(prop)) ? Constant.font : null);
				// check to see if we're changing merger.id or scaler.id
				if (! action_is_id) action_is_id = (('.id' === prop.substr(-3)) ? prop.substr(0, prop.length-3) : null); 
				if (action_is_id) {
					undo_func = function() { this.change_data(this.orig_value, true); };
					redo_func = function(){ this.change_data(this.value); };
				}
				action = new Action(this, redo_func, undo_func);
				switch(prop){
					case 'frames': {
						action.max = Mash.max_frames_for_clip(target, media, this.__mash.quantize);
						action.set_property = function(new_value){
							new_value = Math.max(Option.mash.minframes, new_value);
							if (this.max) new_value = Math.min(this.max, new_value);
							Util.set_ob_property(this.target, this.property, new_value);
							Mash.recalc_track(this.player.mash, Mash.track_for_clip(this.player.mash, this.target));
							this.player.mash_length_changed();
						};
						break;
					}
					case 'trim': {
						action.orig_length = Util.ob_property(target, 'frames');
						action.max = Mash.max_trim_for_clip(target, media, this.__mash.quantize);
						action.set_property = function(new_value){
							new_value = Math.max(0, new_value);
							if (this.max) new_value = Math.min(this.max, new_value);
							Util.set_ob_property(this.target, this.property, new_value);
							new_value = this.orig_length - (new_value - this.orig_value);
							Util.set_ob_property(this.target, 'frames', new_value);
							Mash.recalc_track(this.player.mash, Mash.track_for_clip(this.player.mash, this.target));
							this.player.mash_length_changed();
						};
						break;
					}
					case Constant.gain: {
						action.set_property = function(new_value){
							Util.set_ob_property(this.target, this.property, new_value);
							Audio.gain_source(Audio.source_for_clip(this.target));
						};
						break;
					}
					default: {
						action.set_property = function(new_value){
							Util.set_ob_property(this.target, this.property, new_value);
						};
					}
				}
				action.target = target;
				action.id = id;
				action.property = prop;
				action.value = Util.ob_property(target, prop);
				action.orig_value = Util.ob_property(target_copy, prop);
				if (action_is_id) {
					action.is_id = action_is_id;
					action.last_value = action.orig_value;
					action.change_data = function(new_value, is_undo){
						//console.log('change_data', this.is_id, new_value);
						var new_ob = Mash.media_search(this.is_id, new_value, this.player.mash);
						if (! new_ob) return console.error("could not find " + this.is_id + " for " + new_value);
						this.player.add_media(new_ob);
						if (Constant.font === this.is_id) {
							this.set_property(new_value);
						} else this.target[this.is_id] = (is_undo ? target_copy[this.is_id] : Mash.clip_from_media(new_ob));
						//if (! Mash.modules_reference_media(this.player.mash, this.last_value)) 
						this.player.remove_media(Mash.media_search(this.is_id, this.last_value, this.player.mash));
						this.last_value = new_value;
					
					};
				}
				this.__action_add(action);
			}
		}
	};
	pt.changeEffect = function(prop){
		this.change(prop, true);
	};
	pt.deleteable_urls = function(urls){
		var url, unneeded_urls = {};
		for (url in urls) {
			if (! this.__needed_urls[url]) unneeded_urls[url] = true;
		}
		return unneeded_urls;
	}; // called by Loader
	pt.destroy = function(){ 
		this.mash = null;
		this.canvas_context = null;
	}; // call when player removed from DOM
	pt.did = function(){}; // override me for action undo/redo callback
	pt.mash_length_changed = function(){
		var i, z, x, k, key, tracks, mash_length = 0;
		x = Constant.track_types.length;
		for (k = 0; k < x; k++){
			key = Constant.track_types[k];
			tracks = this.__mash[key];
			z = tracks.length;
			for (i = 0; i < z; i++) {
				mash_length = Math.max(mash_length, Mash.length_of_clips(tracks[i].clips));
			}
		}
		if (this.__mash_length !== mash_length){
			this.__mash_length = mash_length;
			var time = new TimeRange(this.__mash_length, this.__mash.quantize);
			time.scale(this.__fps, 'floor');
			this.__mash_frames = time.frame;
			this.frame = Math.max(0, Math.min(this.__mash_frames - 1, this.__time.frame)); // move back if we need to
		}
	};
	pt.media = function(ob_or_id){
		return Mash.media(this.__mash, ob_or_id);
	};
	pt.move = function(ob_or_array, type, frame_or_index, track_index) {
		if (! Util.isnt(ob_or_array, type)) {
			if (! Util.isarray(ob_or_array)) ob_or_array = [ob_or_array];
			if (Util.isob.apply(Util, ob_or_array)) {
				if (! track_index) track_index = 0;
				if (! frame_or_index) frame_or_index = 0;
				var action;
				if (Constant.effect === type) {
					frame_or_index = Util.index_after_removal(frame_or_index, ob_or_array, this.selectedClipOrMash.effects);
					if (-2 < frame_or_index) action = this.__action_create_effects_move(frame_or_index, ob_or_array, this.selectedClipOrMash.effects);
				} else if ((Constant.audio === type) || track_index) {
					action = this.__action_create_clips_move(type, track_index, frame_or_index, ob_or_array);
				} else {
					frame_or_index = Util.index_after_removal(frame_or_index, ob_or_array, this.__mash[type][track_index].clips);
					if (-2 < frame_or_index) action = this.__action_create_video_move(track_index, frame_or_index, ob_or_array);
				}
				if (action) this.__action_add(action);
			}
		}
	};		
	pt.pause = function() { 
		this.paused = true; 
	};
	pt.play = function() { 
		this.paused = false; 
	};
	pt.rebuffer = function(){
		var delayed_draw, audio_on, range, media, clip, clips, i, z, needed_urls = {}, audio_clips = [];
		if (this.__mash) {
			audio_on = this.__audio_is_on();
			// time we want to buffer - just the current frame if paused, otherwise from it to it plus buffertime
			range = (this.__paused ? this.__time.copyTime() : new TimeRange(this.__time.frame, this.__time.fps, this.__buffertime.frame)); 
			// make sure range is within the mash range
			if (! range.intersection(new TimeRange(0, this.__mash.quantize, this.__mash_length))) range = null;
			if (range) {
				clips = Mash.range_clips(this.__mash, range, audio_on);
				needed_urls = Mash.urls_for_clips(this.__mash, clips, range, (audio_on ? Constant.both : Constant.video));
				Loader.load_urls_of_type(needed_urls);
				if (audio_on) {
					z = clips.length;
					for (i = 0; i < z; i++) {
						clip = clips[i];
						media = Mash.media(this.__mash, clip);
						if (Mash.clip_has_audio(clip, media)) {
							// makes sure there is a source for clip
							if (! Audio.source_for_clip(clip)) {
								Audio.source_from_clip(clip, media, this);
								delayed_draw = true;
							}
							audio_clips.push(clip);
						}
					}
					if (audio_clips.length) Audio.destroy_sources(audio_clips);
					if (delayed_draw) Players.draw_delayed(); // is this needed??
				}
			}
		}
		this.__needed_urls = needed_urls;
	};
	pt.redo = function(removed_count){
		if (this.__action_index < (this.__action_stack.length - 1)) {
			this.__action_index ++;
			//console.log('redoing', this.__action_stack[this.__action_index]);
			this.__action_stack[this.__action_index].redo();
			this.did(removed_count);
			this.__redraw_moving();		
		}
	};
	pt.redraw = function() {
		if (this.__drawing.context) {
			var url_types, audio_on, clips, audio_buffered, video_buffered;
			audio_on = this.__audio_is_on();
			clips = Mash.range_clips(this.__mash, this.__time, audio_on); // includes clips on audio tracks if audio_on
			url_types = Mash.urls_for_clips_by_type(this.__mash, clips, this.__time);
			video_buffered = Loader.loaded_urls_of_type(Mash.urls_of_type(url_types, Constant.video));
			audio_buffered = (audio_on ? Loader.loaded_urls_of_type(Mash.urls_of_type(url_types, Constant.audio)) : true); 
			//console.log('redraw', video_buffered, audio_buffered, this.__time);
			if ((video_buffered && audio_buffered) !== this.__moving){
				if (this.__moving) this.__set_moving(false);
				else if ( (! this.__paused) && Mash.loaded_range(this.__mash, this.__time_drawn.copyTime(this.__buffertime.frame), audio_on)) {
					this.__set_moving(true);
				}
			}
			if (video_buffered) {
				this.__time_drawn = this.__time.copyTime();
				this.__draw_request(clips);
			}
			else if (this.__paused) this.rebuffer(); // to reset the buffering
		}
	};
	pt.remove = function(ob_or_array, type, track_index){
		if (! Util.isnt(ob_or_array, type)) {
			if (! Util.isarray(ob_or_array)) ob_or_array = [ob_or_array];
			if (Util.isob.apply(Util, ob_or_array)) {
				if (! track_index) track_index = 0;
				var action, objects;
				if (Constant.effect === type) {
					action = this.__action_create_effects_remove(ob_or_array, this.selectedClipOrMash.effects);
					action.redo_selected_effects = [];
				} else {
					if ((Constant.audio === type) || track_index) {
						action = this.__action_create_clips_remove(type, track_index, ob_or_array);
					} else action = this.__action_create_video_remove(track_index, ob_or_array);
					action.redo_selected_clips = [];
				}
				if (action) {
					objects = Mash.media_for_clips(this.__mash, ob_or_array);
					action.undo_add_objects = objects;
					action.redo_delete_objects = objects;
					this.__action_add(action);
				}
			}
		}
	};
	pt.remove_media = function(array){
		var id, ob, i, z;
		if (! Util.isarray(array)) array = [array];
		z = array.length;
		for (i = 0; i < z; i++){
			ob = array[i];
			id = (Util.isob(ob) ? ob.id : ob);
			if (! this.__media_references[id]) console.warn('remove_media unreferenced media', id); 
			else this.__media_references[id]--;
			if (! this.__media_references[id]) {
				if (-1 === Util.array_delete_ref(this.__mash.media, ob)) {
					console.error("remove_media no mash media", id, this.__mash.media);
				}
				delete this.__media_references[id];
			}
			//console.log('remove_media', this.__media_references[id], id);
		}
	}; // called by Action
	pt.select = function(clip_or_effect, toggle_selected){
		//console.log('select', clip_or_effect, toggle_selected);
		var media, i, array = [], array_key = '__selected_clips', prop_key = 'selectedClips';
		media = Mash.media(this.__mash, clip_or_effect);
		if (media){
			if (Constant.effect === media.type){
				array_key = '__selected_effects';
				prop_key = 'selectedEffects';
			}
			if (toggle_selected) {
				i = this[array_key].indexOf(clip_or_effect);
				switch(this[array_key].length){
					case 0: {
						array.push(clip_or_effect);
						break;
					}
					case 1: {
						if (i > -1) break;  
					} // potential intentional fall through to default
					default: {
						if (i < 0) {
							array.push(clip_or_effect);
							array = array.concat(this[array_key]);
						} else {
							if (i) array = array.concat(this[array_key].slice(0, i));
							if (i < (this[array_key].length - 1)) array = array.concat(this[array_key].slice(i + 1));
						}						
					} 
				
				}
			}
			else {
				if (-1 < this[array_key].indexOf(clip_or_effect)) return;
				array.push(clip_or_effect);
			}
		}
		//console.log('select', prop_key, array);
		this[prop_key] = array;
	};
	pt.selected = function(clip_or_effect){
		return (-2 < (this.__selected_effects.indexOf(clip_or_effect) + this.__selected_clips.indexOf(clip_or_effect)));
	};
	pt.selectEffect = function(effect, toggle_selected){
		if (Util.isob(effect)) return this.select(effect, toggle_selected);
		else if (! toggle_selected) this.selectedEffect = effect;
	};
	pt.split = function(){
		var clip = this.selectedClip;
		var at_time = this.__time.copyTime();
		if (Util.isob(clip) && this.__canSplitAtTime(clip, at_time)) {
			var action = this.__action_create_split_clip(clip, at_time);
			this.__action_add(action);
		}
	};
	pt.undo = function() {
		if (this.__action_index > -1) {
			this.__action_stack[this.__action_index].undo();
			this.__action_index --;
			this.did();
			this.__redraw_moving();		
		}
	};
	pt.uuid = function() {
		return Util.uuid(); // so new mash IDs can be generated before mash itself
	};
	pt.__action_add = function(action){
		var i, z, removed;
		if (this.__action_index < this.__action_stack.length - 1) {
			removed = this.__action_stack.splice(this.__action_index + 1, this.__action_stack.length - (this.__action_index + 1));
			z = removed.length;
			for (i = 0; i < z; i++){
				removed[i].destroy();
			}
		}
		this.__action_stack.push(action);
		this.redo(z);
	};
	pt.__action_create_clips_move = function(type, track_index, frame, clips){
		clips.sort(Util.sort_by_frame); // so they are all a block
		var action, orig, orig_track, track, clip, i, z = clips.length;
		track = this.__mash[type][track_index];
		orig_track = track;
		clip = clips[0];
		if (-1 === track.clips.indexOf(clip)) { // move from different track
			orig_track = Mash.track_for_clip(this.__mash, clip);
			if (Util.isnt(orig_track)) {
				console.error('clip not found in tracks', clip);
				return false;
			}
		}
		orig = [];
		for (i = 0; i < z; i++) {
			clip = clips[i];
			orig.push({offset: (i ? clip.frame - clips[0].frame : 0), frame: clip.frame, track: clip.track, i: i, index: orig_track.clips.indexOf(clip)});
		}
		//console.log('orig', orig);
		action = new Action(this, function(){
			if (track !== orig_track) { // take them out
				orig.sort(function(a, b){return b.index-a.index;});
				for (i = 0; i < z; i++) orig_track.clips.splice(orig[i].index, 1);
			}
			orig.sort(function(a, b){return a.i - b.i;});
			if (track !== orig_track) track.clips = track.clips.concat(clips);
			for (i = z - 1; i > -1; i--) {
				clip = clips[i];
				clip.track = track_index;
				clip.frame = frame + orig[i].offset; 
			}
			if (track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		}, function(){
			orig.sort(function(a, b){return a.index-b.index;});
			if (track !== orig_track) { // we added to track, so remove
				for (i = 0; i < z; i++) Util.array_delete(track.clips, clips[i]);
			}
			for (i = 0; i < z; i++) {
				clip = clips[orig[i].i];
				clip.frame = orig[i].frame;
			}
			if (track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		});
		return action;
	};
	pt.__action_create_effects_move = function(index, effects, container){
		var action, i, z = effects.length;
		action = new Action(this, function(){
			this.orig.sort(function(a, b){return b.index-a.index;});
			for (i = 0; i < z; i++) container.splice(this.orig[i].index, 1);
			for (i = z - 1; i > -1; i--) container.splice(index, 0, effects[i]);
		}, function(){
			this.orig.sort(function(a, b){return a.index-b.index;});
			this.target.splice(index, z);
			for (i = 0; i < z; i++) {
				container.splice(this.orig[i].index, 0, effects[this.orig[i].i]);
			}
		});
		
		action.orig = [];
		for (i = 0; i < z; i++) action.orig.push({i: i, index: container.indexOf(effects[i])});
		return action;
	};
	pt.__action_create_video_move = function(track_index, index, clips){
		//console.log('__action_create_video_move', track_index, index, clips);
		var action, orig, orig_track, track, clip, i, z = clips.length;
		track = this.__mash.video[track_index];
		orig_track = track;
		clip = clips[0];
		if (-1 === track.clips.indexOf(clip)) { // move from different video track
			orig_track = Mash.track_for_clip(this.__mash, clip);
			if (! orig_track) return console.error('no track for first clip'); // problem, clip not found in any tracks
		}
		orig = [];
		for (i = 0; i < z; i++) {
			clip = clips[i];
			orig.push({frame: clip.frame, track: clip.track, i: i, index: orig_track.clips.indexOf(clip)});
		}
		action = new Action(this, function(){
			orig.sort(function(a, b){return b.index-a.index;});
			for (i = 0; i < z; i++) orig_track.clips.splice(orig[i].index, 1);
			for (i = z - 1; i > -1; i--) {
				clip = clips[i];
				track.clips.splice(index, 0, clip);
				clip.track = track_index;
			}
			if (track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		}, function(){
			orig.sort(function(a, b){return a.index-b.index;});
			var container_index;
			track.clips.splice(index, z);
			for (i = 0; i < z; i++) {
				container_index = orig[i].index;
				clip = clips[orig[i].i];
				orig_track.clips.splice(container_index, 0, clip);
				clip.track = orig[i].track;
				clip.frame = orig[i].frame;
			}
			if (track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		});
		return action;
	};
	pt.__action_create_clips_remove = function(type, track_index, clips) {
		clips.sort(Util.sort_by_frame); // so they are all a block
		var action, orig, track, clip, i, z = clips.length;
		track = this.__mash[type][track_index];
		clip = clips[0];
		orig = [];
		for (i = 0; i < z; i++) {
			clip = clips[i];
			orig.push({offset: (i ? clip.frame - clips[0].frame : 0), frame: clip.frame, track: clip.track, i: i, index: track.clips.indexOf(clip)});
		}
		//console.log('orig', orig);
		action = new Action(this, function(){
			orig.sort(function(a, b){return b.index-a.index;});
			for (i = 0; i < z; i++) track.clips.splice(orig[i].index, 1);
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		}, function(){
			orig.sort(function(a, b){return a.index-b.index;});
			for (i = 0; i < z; i++) {
				clip = clips[orig[i].i];
				track.clips.splice(orig[i].index, 0, clip);
				clip.track = orig[i].track;
				clip.frame = orig[i].frame;
			}
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		});
		return action;
	};
	pt.__action_create_effects_remove = function(effects, container){
		// index always -1
		var action, i, z = effects.length;
		action = new Action(this, function(){
			this.orig.sort(function(a, b){return b.index-a.index;});
			for (i = 0; i < z; i++) container.splice(this.orig[i].index, 1);
		}, function(){
			this.orig.sort(function(a, b){return a.index-b.index;});
			for (i = 0; i < z; i++) {
				container.splice(this.orig[i].index, 0, effects[this.orig[i].i]);
			}
		});
		
		action.orig = [];
		for (i = 0; i < z; i++) action.orig.push({i: i, index: container.indexOf(effects[i])});
		return action;
	};
	pt.__action_create_video_remove = function(track_index, clips){
		var action, orig, track, clip, i, z = clips.length;
		track = this.__mash.video[track_index];
		clip = clips[0];
		orig = [];
		for (i = 0; i < z; i++) {
			clip = clips[i];
			orig.push({frame: clip.frame, track: clip.track, i: i, index: track.clips.indexOf(clip)});
		}
		action = new Action(this, function(){
			orig.sort(function(a, b){return b.index-a.index;});
			for (i = 0; i < z; i++) {
				//console.log('removing', orig[i].index);
				track.clips.splice(orig[i].index, 1);
			}
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		}, function(){
			orig.sort(function(a, b){return a.index-b.index;});
			var container_index;
			for (i = 0; i < z; i++) {
				container_index = orig[i].index;
				clip = clips[orig[i].i];
				track.clips.splice(container_index, 0, clip);
				clip.track = orig[i].track;
				clip.frame = orig[i].frame;
			}
			Mash.recalc_track(this.player.mash, track);
			this.player.mash_length_changed();
		});
		return action;
	};
	pt.__action_create_effect_add = function(clip, index){
		// .add handles redo_add_objects and undo_delete_objects
		var action, target = this.selectedClipOrMash;
		if (target) {
			action = new Action(this, function(){
				this.target.splice(this.index, 0, this.clip);
			}, function() {
				Util.array_delete(this.target, this.clip);
			});
			action.clip = clip;
			action.index = index;
			action.target = target.effects;
		}
		return action;
	};
	pt.__action_create_split_clip = function(clip, at_time){
		var new_clip = Util.copy_keys_recursize(clip);
		at_time.scale(this.__mash.quantize);
		var trim_frames = clip.frames - (at_time.frame - clip.frame);
		var media = Mash.media(this.__mash, clip);
		var target = Mash.track_for_clip(this.__mash, clip).clips;
		var index = 1 + target.indexOf(clip);
		new_clip.frames = trim_frames;
		new_clip.frame = clip.frame + clip.frames - trim_frames;
		switch(media.type){
			case Constant.audio:
			case Constant.video: {
				new_clip.trim = clip.trim + trim_frames;
			}
		}
		var action = new Action(this, function(){
			target.splice(index, 0, new_clip);
			clip.frames -= trim_frames;
		}, function() {
			clip.frames += trim_frames;
			target.splice(index, 1);
		});
		action.redo_selected_clips = [clip];
		action.redo_add_objects = [media];
		action.undo_delete_objects = [media];
		return action;
	};
	pt.__action_create_track_add = function(media_type, clip, index, frame){
		// .add handles redo_add_objects and undo_delete_objects
		var action = new Action(this, function(){
			var target;
			for (var i = 0; i < this.tracks; i++){
				this.player.__track_create(this.type);
			}
			target = this.player.mash[this.type][this.index].clips;
			this.clip.frame = this.frame;
			target.push(this.clip);
			Mash.recalc_clips(target);
			this.player.mash_length_changed();
		}, function() {
			var target;
			target = this.player.mash[this.type][this.index].clips;
			Util.array_delete(target, this.clip);
			for (var i = 0; i < this.tracks; i++){
				this.player.__track_delete(this.type);
			}
			Mash.recalc_clips(target);
			this.player.mash_length_changed();
		});
		action.clip = clip;
		action.frame = frame;
		action.index = index;
		action.type = (Constant.audio === media_type ? media_type : Constant.video);
		action.tracks = (index + 1) - this.__mash[action.type].length;
		return action;
	};
	pt.__action_create_video_add = function(clip, track_index, index){
		// .add handles redo_add_objects and undo_delete_objects
		var action = new Action(this, function(){
			this.target.splice(this.index, 0, this.clip);
			Mash.recalc_video_clips(this.player.mash, this.target);
			this.player.mash_length_changed();
		}, function() {
			Util.array_delete(this.target, this.clip);
			Mash.recalc_video_clips(this.player.mash, this.target);
			this.player.mash_length_changed();
		});
		action.clip = clip;
		action.index = index;
		action.target = this.__mash.video[track_index].clips;
		return action;
	};
	pt.__audio_is_on = function(){
		return ((! this.__paused) && (! this.__mute) && this.__gain);
	};
	pt.__canSplitAtTime = function(clip, now){
		var clip_time = new TimeRange(clip.frame, this.__mash.quantize, clip.frames);
		
		var can_split = clip_time.intersection(now);
		if (can_split) {
			now = now.copyTime();
			now.scale(clip_time.fps);
			can_split = (now.frame !== clip_time.frame);
			
			if (can_split) {
				can_split = (now.end !== clip_time.end);
				//if (! can_split) console.log('end match');
			} //else console.log('frame match');
		} //else console.log('no intersection');
		return can_split;
	};
	pt.__delete_drawings = function(drawings){
		var drawing;
		if (drawings) {
			drawing = drawings.pop();
			while(drawing){
				this.__delete_drawings(drawing.drawings);
				if (drawing !== this.__drawing) Filter.destroy_drawing(drawing);
				drawing = drawings.pop();
			}
		}
	};
	pt.__draw_context = function(drawing_context) {
		if (! drawing_context) drawing_context = this.__drawing.context;
		if (drawing_context) {
			drawing_context.clearRect(0, 0, drawing_context.canvas.width, drawing_context.canvas.height);
			drawing_context.fillStyle = this.__mash.backcolor;
			drawing_context.fillRect(0, 0, drawing_context.canvas.width, drawing_context.canvas.height);
		}
	};
	pt.__draw_layer_clip = function(time, clip, media, quantize, drawing){
		var url, copy_time, resource, raw_drawing;
		var swidth,sheight;
		var __label = function(w, h, media){
			return w + 'x' + h + ' ' + media.type + ' clip ' + (media.label || media.id);
		};
		switch(media.type){
			case Constant.image: {
				url = (media.url || media.source);
				resource = Loader.cached_urls[url];
				if (resource) {
					swidth = resource.width;
					sheight = resource.height;
					raw_drawing = Filter.create_drawing(swidth, sheight, __label(swidth, sheight, media), drawing.container);
					raw_drawing.context.drawImage(resource,0,0,swidth,sheight,0,0,swidth,sheight);
				} //else console.error('attempt to draw unloaded' + media.type, url);
				break;
			}
			case 'frame': 
			case Constant.video: {
				copy_time = time.copyTime();
				copy_time.scale(media.fps);
				copy_time.frames = 1;
				for (url in Mash.urls_for_video_clip(clip, media, copy_time, quantize)){
					resource = Loader.cached_urls[url];
					if (resource) {
						swidth = resource.width;
						sheight = resource.height;
						raw_drawing = Filter.create_drawing(swidth, sheight, __label(swidth, sheight, media), drawing.container);
						raw_drawing.context.drawImage(resource,0,0,swidth,sheight,0,0,swidth,sheight);
					} //else console.error('attempt to draw unloaded' + media.type, url);
					break;
				}
				break;
			}
			case Constant.theme: {
				raw_drawing = this.__draw_module_filters(time, clip, [drawing], clip, media).shift();
				break;
			}
			default: console.error(media.type + ' unsupported on video track');
		}
		if (raw_drawing) {//console.error('no raw drawing', clip, time); else 
			drawing.drawings.push(raw_drawing);
			drawing = this.__draw_scale_and_effects(time, clip, raw_drawing);
		}
		return drawing;
	};
	pt.__draw_layer_clips = function(clips, time){
		//console.log('__draw_layer_clips', clips.length, time.description);
		this.__delete_drawings(this.__drawing.drawings);
		var back_drawing, drawing, transition_indexes, transition_index, medias, clip, media, w, h, y, i, z = clips.length;
		//transition_drawings = [], 
		medias = {};
		transition_index = -1;
		transition_indexes = [];
		for (i = 0; i < z; i++) {
			clip = clips[i];
			media = Mash.media(this.__mash, clip);
			medias[media.id] = media;
			if (Constant.audio === media.type) continue;
			if (0 === clip.track) {
				if (Constant.transition === media.type) transition_index = i;
				else transition_indexes.push(i);
			}
		}
		this.__draw_context(); // fill __drawing.context with background
		if (-1 < transition_index) {
			y = transition_indexes.length;
			if (0 < y) { // ignore if no clips to transition between
				w = this.__drawing.canvas.width;
				h = this.__drawing.canvas.height;
				for (i = 0; i < y; i++) {
					clip = clips[transition_indexes[i]];
					media = medias[clip.id];
					// each clip being transitioned gets it's own drawing, which it affects
					back_drawing = Filter.create_drawing(w, h, w + 'x' + h + ' background for ' + media.type + ' clip ' + (media.label || media.id), this.__drawing.container);
					this.__drawing.drawings.push(back_drawing);
					this.__draw_context(back_drawing.context);
					drawing = this.__draw_layer_clip(time, clip, media, this.__mash.quantize, back_drawing);
					this.__drawings_merge(time, clip, clip.merger, back_drawing, drawing);

					//transition_drawings.push(drawing);
				}
				clip = clips[transition_index];
				// this only affects this.__drawing.context, using the other drawing(s)
				this.__draw_transition(this.__drawing.drawings, clip, medias[clip.id], time);
			}
			transition_indexes.push(transition_index); // so caught below
		} else transition_indexes = [];
		for (i = 0; i < z; i++){
			if (-1 < transition_indexes.indexOf(i)) continue;
			clip = clips[i];
			media = medias[clip.id];
			if (Constant.audio === media.type) continue;
			// clips not being transitioned just affect main drawing
			drawing = this.__draw_layer_clip(time, clip, media, this.__mash.quantize, this.__drawing);
			this.__drawings_merge(time, clip, clip.merger, this.__drawing, drawing);
		}
	};
	pt.__draw_transition = function(clip_drawings, transition_clip, transition_media, time){
		//console.log('__draw_transition', clip_drawings, transition_clip, transition_media);
		if (2 > clip_drawings.length) clip_drawings.push(this.__drawing); // make another reference to the background
		var from_drawing = clip_drawings[0];
		var to_drawing = clip_drawings[1];
		if (transition_media.to.filters) {
			//console.log('to filters', to_drawing, transition_media.to);
			to_drawing = this.__draw_module_filters(time, transition_clip, [to_drawing], transition_clip, transition_media.to).shift();
		}
		if (transition_media.from.filters) from_drawing = this.__draw_module_filters(time, transition_clip, [from_drawing], transition_clip, transition_media.from).shift();
		this.__drawings_merge(time, transition_clip, transition_media.from.merger, from_drawing, to_drawing);
		this.__drawings_merge(time, transition_clip, transition_media.to.merger, this.__drawing, from_drawing);
	};
	pt.__draw_request = function(clips){
		var $this = this;
		requestAnimationFrame(function(){
			$this.__draw_layer_clips(clips, $this.__time_drawn);
		});	
	};
	pt.__drawings_merge = function(time, layer_clip, merger, btm_drawing, top_drawing) {
		var merger_media;
		if (merger) {
			merger_media = Mash.media_search(Constant.merger, merger, this.__mash);
			if (! merger_media) console.error('no merger media', merger);
			else btm_drawing = this.__draw_module_filters(time, layer_clip, [btm_drawing, top_drawing], merger, merger_media).shift();
		} else console.error('false merger', layer_clip);
	};
	pt.__draw_scale_and_effects = function(time, layer_clip, raw_drawing) {
		var scaler_media, scaler;
		scaler = layer_clip.scaler;
		if (scaler) {
			scaler_media = Mash.media_search(Constant.scaler, scaler, this.__mash);
			if (! scaler_media) console.error('no scaler media', scaler);
			else raw_drawing = this.__draw_module_filters(time, layer_clip, [raw_drawing], scaler, scaler_media).shift();
			if (! raw_drawing) console.error('scaler produced no drawing', scaler, layer_clip);
		}else console.error('no scaler found', layer_clip);
		
		if (Util.isarray(layer_clip.effects) && layer_clip.effects.length) {
			raw_drawing = this.__draw_effects([raw_drawing], layer_clip, time).shift();
		}
		return raw_drawing;
	};
	pt.__draw_module_filters = function(time, layer_clip, drawings, module, module_media) {
		var __evaluate_scope = function(time, clip, scope, module, filter_config){ 
			var eval_key, eval_str, filter, conditional_in, condition, test_bool, parameter, conditional, parameter_name, parameter_value, parameters_array, j, y, i, z, evaluated = {};
			filter = Filter[filter_config.id];
			scope = Util.copy_ob(scope);
			parameters_array = filter_config.parameters;
			if (! parameters_array) parameters_array = filter.parameters;
			if (parameters_array) {
				z = parameters_array.length;
				for (i = 0; i < z; i++){
					parameter = parameters_array[i];
					parameter_name = parameter.name;
					if (parameter_name){
						parameter_value = parameter.value;
						if (Util.isarray(parameter_value)){
							test_bool = false;
							y = parameter_value.length;
							for (j = 0; j < y; j++){
								conditional = parameter_value[j];
								condition = conditional.condition;
								// not strict equality, since we may have strings and numbers
								if (conditional.is) condition = condition + '==' + conditional.is;
								else if (conditional.in) {
									conditional_in = conditional.in;
									if (Util.isstring(conditional_in)) conditional_in = conditional_in.split(',');
								
									condition = '(-1 < [' + conditional_in.join(',') + '].indexOf(' + (Util.isstring(conditional_in[0]) ? 'String' : 'Number') + '(' + condition + ')))';
								}
								condition = condition.replace(' or ', ' || ');
								condition = condition.replace(' and ', ' && ');
								for (eval_key in scope) { 
									condition = condition.replace(new RegExp('\\b' + eval_key + '\\b', 'g'), 'scope.' + eval_key);
								}
								eval_str = 'test_bool = (' + condition + ');';
								try {
									eval(eval_str); 
								} catch (exception) {
									console.error(exception.message, eval_str);
								}
								if (test_bool) {
									parameter_value = conditional.value;
									//console.log(parameter_name, eval_str, parameter_value);
									break;
								} // else console.warn(parameter_name, eval_str, parameter_value);
							}
							if (! test_bool) console.error('no conditions were true', parameter_value);
						}
						if (Util.isstring(parameter_value)) { // could well be a number by now
							for (eval_key in scope) { 
								parameter_value = parameter_value.replace(new RegExp('\\b' + eval_key + '\\b', 'g'), 'scope.' + eval_key);
							}
						}
						eval_str = 'evaluated.' + parameter_name + ' = ' + parameter_value + ';';
						try {
							eval(eval_str); 
						} catch (exception) {
							//console.error(exception.message, eval_str, parameter_value);
							evaluated[parameter_name] = parameter_value;
						}
						// sort of like lookahead, but they have to be in order!
						scope[parameter_name] = evaluated[parameter_name];
					}
				}
			} else console.log('no parameters_array found', filter_config);
			return evaluated;
		};
		var ctime, scope, evaluated, filter_config, filter, i, z;
		if (module_media) {
			if (module_media.filters) {
				if (layer_clip.frames) {
					ctime = new TimeRange(0, this.__mash.quantize, this.__mash_length);
					ctime.frame = layer_clip.frame;
					ctime.frames = layer_clip.frames;
					z = module_media.filters.length;
					for (i = 0; i < z; i++){
						filter_config = module_media.filters[i];
						filter = Filter[filter_config.id];
						if (filter) { // otherwise, just ignore unknown filters
		
							scope = this.__module_scope(time, ctime, drawings, module, module_media);
							scope = filter.parse(drawings, scope, filter_config);
							evaluated = __evaluate_scope(time, layer_clip, scope, module, filter_config);
							drawings = filter.render(drawings, scope, evaluated, filter_config);	
						}
					}
				} else console.error('invalid layer clip with no frames', layer_clip);
			} else console.error('invalid module media with no filters', module, module_media);
		} else console.error('false media while drawing module filters', module, layer_clip);
		return drawings;
	};
	pt.__draw_effects = function(drawings, layer_clip, time) {
		var effect, effect_media, i, z;
		if (layer_clip) {
			if (layer_clip.frames){
				if (layer_clip.effects) {
					z = layer_clip.effects.length;
					for (i = z - 1; i > -1; i--){ // zero is 'top', so go backwards
						effect = layer_clip.effects[i];
						effect_media = Mash.media(this.__mash, effect);
						if (effect_media) drawings = this.__draw_module_filters(time, layer_clip, drawings, effect, effect_media);
						else console.error('could not find effect media', effect, layer_clip, this.__mash.media);
					}
				}  else console.error('invalid layer clip with no effects', layer_clip);
			} else console.error('invalid layer clip with no frames, so no effects', layer_clip);
		} else console.error('false layer clip, so no effects', drawings);
		return drawings;
	};
	pt.__limit_time = function(time){
		var start_time = time.copyTime();
		var limit_time = new TimeRange(this.__mash_length, this.__mash.quantize);
		limit_time.frame = Math.max(0, limit_time.frame - 1);
		start_time.min(limit_time);
		start_time.scale(this.__fps, 'floor');
		return start_time;
	};
	pt.__load_timed = function(){
		if (this.__moving){
			// hopefully runs twice a frame
			var now = TimeRange.fromSeconds(Audio.time(), this.__fps, 'ceil');
			if (now.frame !== this.__limit_time(now).frame) {
				// loop back to start or pause
				if (! this.__loop) {
					this.paused = true;
				} else this.frame = 0; 
			} else {
				if (! now.isEqualToTime(this.__time_drawn)) {
					this.__time.setToTime(now);
					this.redraw();
				}
			}
		}
	};
	pt.__module_scope = function(time, clip_time, drawings, module, media){
		if (time.fps !== this.__fps) console.warn('__module_scope FPS', time.fps, this.__fps);
		if (! this.__drawing.canvas) return {};
		var clip_value, module_properties, type_ob, type_id, property_key, property_options, drawing;
		module_properties = {};
		if (media.properties) {
			for (property_key in media.properties){
				clip_value = module[property_key];
				if (Util.isnt(clip_value)){
					property_options = media.properties[property_key];
					clip_value = property_options.value;
					if (Util.isnt(clip_value)){
						type_id = property_options.type;
						if (type_id){
							type_ob = Constant.property_types[type_id];
							if (type_ob) clip_value = type_ob.value;
						}
						if (Util.isnt(clip_value)) clip_value = '';
					}
				} else clip_value = module[property_key];
				module_properties[property_key] = clip_value;
			}
		}
		var __horz_vert = function(w_h, size, proud){
			var value = parseFloat(size);
			var w_h_value = parseFloat(module_properties[w_h]);
			var w_h_value_scaled = w_h_value * value;
			if (proud) {
				var h_w = ('mm_height' === w_h ? 'mm_width' : 'mm_height');
				var h_w_value = parseFloat(module_properties[h_w]);
				if (h_w_value > w_h_value) {
					w_h_value_scaled = w_h_value + (value - 1.0) * h_w_value;
				}
			}
			return (w_h_value_scaled);
		};
		module_properties.mm_vert = function(size, proud){
			return __horz_vert('mm_height', size, proud);
		};
		module_properties.mm_horz = function(size, proud){
			return __horz_vert('mm_width', size, proud);
		};
		module_properties.mm_cmp = function(a, b, a_val, b_val){
			return ((a > b) ? a_val : b_val);
		};
		module_properties.mm_max = Math.max;
		module_properties.mm_min = Math.min;
		module_properties.floor = Math.floor;
		module_properties.ceil = Math.ceil;
		module_properties.mm_fps = this.__fps;
		
		if (clip_time) module_properties.t = module_properties.mm_duration = clip_time.lengthSeconds;
		
		clip_time.scale(time.fps);
		module_properties.mm_t = (time.frame - clip_time.frame) / clip_time.frames;
		module_properties.mm_width = this.__drawing.canvas.width;
		module_properties.mm_height = this.__drawing.canvas.height;
		drawing = drawings[drawings.length-1];
		if (drawing && drawing.canvas) {
			module_properties.mm_input_width = drawing.canvas.width;
			module_properties.mm_input_height = drawing.canvas.height;
			module_properties.mm_input_dimensions = module_properties.mm_input_width + 'x' + module_properties.mm_input_height; // input height
		} else console.warn('no drawing?', drawings);
		module_properties.mm_dimensions = module_properties.mm_width + 'x' + module_properties.mm_height; // output height
		return module_properties;
	};
	pt.__redraw_moving = function(new_time){
		var moving = this.__moving;
		if (moving) this.__set_moving(false); 
		if (new_time) this.__time.setToTime(new_time);
		//this.rebuffer();
		this.redraw();
		if (moving) this.__set_moving(true);
	};
	pt.__set_moving = function(tf) {
		if (this.__moving !== tf) {
			//console.log('__set_moving', tf, this.__time_drawn.description, this.__time.description);
			this.__moving = tf;
			if (this.__moving) {
				var $this = this;
				this.__load_timer = setInterval(function() {$this.__load_timed();}, 500 / this.__fps);
				Audio.start(); // start up the sound buffer
				Audio.sync(this.__time.seconds); // sync our current time, rather than displayed
				this.rebuffer(); // get sounds bufferring now, rather than next timer execution
			} else {
				Audio.stop();
				//Audio.destroy_sources();
				clearInterval(this.__load_timer);
				this.__load_timer = 0;
			}
			this.__set_stalling((! this.__moving) && (! this.__paused));
		}
	};
	pt.__set_stalling = function(tf){
		var changed = false; // whether or not __stalling changed
		if (this.__stalling !== tf) {
			//console.log('__set_stalling', tf, this.__time.description);
			this.__stalling = tf;
			changed = true;
		}
		return changed;
	};
	pt.__stop_buffer_timer = function() {
		if (this.__bufferProcessTimer) {
			//console.log('__stop_buffer_timer');
			clearInterval(this.__bufferProcessTimer);
			this.__bufferProcessTimer = 0;
		}
	};
	pt.__track_create = function(audio_or_video){
		var container = this.__mash[audio_or_video];
		container.push(Mash.init_track(audio_or_video, container.length));
	};
	pt.__track_delete = function(audio_or_video){
		var track = this.__mash[audio_or_video].pop();
		if (this.__mash_length === Mash.length_of_clips(track.clips)) this.mash_length_changed();
	};
})(Player.prototype);

var Players = {
	draw_delayed: function(){
		// called when assets are cached
		if (! Players.delayed_timer) {
			Players.delayed_timer = setTimeout(function(){
				Players.delayed_timer = 0;
				var i, z = Players.instances.length;
				for (i = 0; i < z; i++){
					Players.instances[i].redraw();
				}
			}, 50);
		}
	},
	start_playing: function(instance){
		Players.stop_playing();
		Players.current = instance;
	},
	stop_playing: function(){
		if (Players.current) {
			Players.current.paused = true;
			Players.current = null;
		}
	},
	instances: [],
	current: null,
	delayed_timer: 0,

};

var TimeRange = function(start, rate, duration){
	if (start) this.frame = Number(start) || 0;
	if (rate) this.fps = Number(rate) || 0;
	if (duration) this.frames = Math.max(1, Number(duration));
};
TimeRange.fromTimes = function(start, end) {
	start.synchronize(end);
	return new TimeRange(start.frame, start.fps, Math.max(1, end.frame - start.frame));
};
TimeRange.fromSeconds = function(seconds, rate, rounding) {
	if (! rounding) rounding = 'round';
	if (! rate) rate = 1;
	return new TimeRange(Math[rounding](Number(seconds) * Number(rate)), rate);
};
TimeRange.fromSomething = function(something){
	var frame, frames, fps;
	if (! something) something = new TimeRange();
	else if (typeof something === 'number') something = new TimeRange.fromSeconds(something);
	else if (typeof something === 'string') {
		something = something.split('-');
		frame = something.shift();
		frames = fps = 1;
		if (something.length) { // there was a dash - frames was specified
			something = something.shift().split('@');
			frames = something.shift();
		} else {
			something = frame.split('@');
			frame = something.shift();
		}
		if (something.length) {
			fps = something.shift();
		}
		something = new TimeRange(frame, fps, frames);
	}
	return something;
};
(function(pt){
	pt.frames = 0;
	pt.frame = 0;
	pt.fps = 0;	
	Object.defineProperty(pt, 'end', { 
		get: function() { return this.frame + this.frames; },
		set: function(n) {this.frames = Math.max(1, Number(n) - Number(this.frame));}
	});
	Object.defineProperty(pt, 'endTime', { get: function() { return new TimeRange(this.end, this.fps); } } );
	Object.defineProperty(pt, 'description', { get: function() { 
		var descr = this.frame;
		if (this.frames) descr += '-' + this.end;
		descr += '@' + this.fps;
		return descr; 
	} } );
	Object.defineProperty(pt, 'seconds', { 
		get: function() { return Number(this.frame) / Number(this.fps); },
		set: function(time) { this.setToTime(time); },
	} );
	Object.defineProperty(pt, 'lengthSeconds', { get: function() { return Number(this.frames) / Number(this.fps); } } );
	Object.defineProperty(pt, 'timeRange', { get: function() { 
		var range = this.copyTime();
		range.frames = 1;
		return range;
	} } );	
	pt.add = function(time) {
		if (this.fps !== time.fps) {
			time = time.copyTime();
			this.synchronize(time);
		}
		this.frame += time.frame;
		return this;
	};
	pt.setToTime = function(something){
		something = TimeRange.fromSomething(something);
		this.synchronize(something);
		this.frame = something.frame;
		return something;
	};
	pt.setToTimeRange = function(something){
		something = this.setToTime(something);
		this.frames = something.frames;
		return something;
	};
	pt.copyTime = function(frames) {
		return new TimeRange(this.frame, this.fps, frames);			
	};
	pt.divide = function(number, rounding) {
		if (! rounding) rounding = 'round';
		this.frame = Math[rounding](Number(this.frame) / number);
	};
	pt.frameForRate = function(rate, rounding){
		if (! rounding) rounding = 'round';
		var start = this.frame;
		if (rate !== this.fps) {
			var time = TimeRange.fromSeconds(this.seconds, this.fps, rounding);
			start = time.frame;
		}
		return start;	
	};
	pt.isEqualToTime = function(time) {
		var equal = false;
		if (time && time.fps && this.fps) {
			if (this.fps === time.fps) equal = (this.frame === time.frame);
			else {
				// make copies so neither time is changed
				var time1 = this.copyTime();
				var time2 = time.copyTime();
				time1.synchronize(time2);
				equal = (time1.frame === time2.frame);
			}
		}
		return equal;
	};
	pt.lessThan = function(time) {
		var less = false;
		if (time && time.fps && this.fps) {
			if (this.fps === time.fps) less = (this.frame < time.frame);
			else {
				// make copies so neither time is changed
				var time1 = this.copyTime();
				var time2 = time.copyTime();
				time1.synchronize(time2);
				less = (time1.frame < time2.frame);
			}
		}
		return less;
	};
	pt.max = function(time) {
		if (time) {
			this.synchronize(time);
			this.frame = Math.max(time.frame, this.frame);
		}
	};
	pt.min = function(time) {
		if (time) {
			this.synchronize(time);
			this.frame = Math.min(time.frame, this.frame);
		}
	};
	pt.multiply = function(number, rounding) {
		if (! rounding) rounding = 'round';
		this.frame = Math[rounding](Number(this.frame) * number);
	};
	pt.ratio = function(time) {
		var n = 0;
		if (time && time.fps && this.fps && time.frame) {
			if (this.fps === time.fps) n = (this.frame / time.frame);
			else {
				// make copies so neither time is changed
				var time1 = this.copyTime();
				var time2 = time.copyTime();
				time1.synchronize(time2);
				n = (Number(time1.frame) / Number(time2.frame));
			}
		}
		return n;
	};
	pt.scale = function(rate, rounding) {
		if (this.fps !== rate) {
			if (! rounding) rounding = 'round';
			this.frame = Math[rounding](Number(this.frame) / (Number(this.fps) / Number(rate)));
			if (this.frames) this.frames = Math.max(1, Math[rounding](Number(this.frames) / (Number(this.fps) / Number(rate))));
			this.fps = rate;
		}
		return this;
	};
	pt.subtract = function(time) {
		if (this.fps !== time.fps) {
			time = time.copyTime();
			this.synchronize(time);
		}
		var subtracted = time.frame;
		if (subtracted > this.frame) {
			subtracted -= subtracted - this.frame;
		}
		this.frame -= subtracted;
		return subtracted;
	};
	pt.synchronize = function(time, rounding) {
		if (! rounding) rounding = 'round';
		if (time.fps !== this.fps) {
			var gcf = this.__lcm(time.fps, this.fps);
			this.scale(gcf, rounding);
			time.scale(gcf, rounding);
		}
	};
	pt.__gcd = function(a, b) {
		var t;
		while (b !== 0) {
			t = b;
			b = a % b;
			a = t;
		}
		return a;
	};
	pt.__lcm = function(a, b) { return (a * b / this.__gcd(a, b)); };
	pt.copyTimeRange = function() {
		return new TimeRange(this.frame, this.fps, this.frames);			
	};
	pt.touches = function(range){
		return this.intersection(range, true);
	};
	pt.intersection = function(range, or_equals) {
		var result = null;
		var range1 = this;
		var range2 = range;
		if (range1.fps !== range2.fps)
		{
			range1 = range1.copyTimeRange();
			range2 = range2.copyTimeRange();
			range1.synchronize(range2);
		}
		var last_start = Math.max(range1.frame, range2.frame);
		var first_end = Math.min(range1.end + (range1.frames ? 0 : 1), range2.end + (range2.frames ? 0 : 1));
		if ((last_start < first_end) || (or_equals && (last_start === first_end)))
		{
			result = new TimeRange(last_start, range1.fps, first_end - last_start);
		}
		//if (or_equals) console.log('intersection', result, range1.description, range2.description);
		return result;
	};
	pt.isEqualToTimeRange = function(range){
		var equal = false;
		if (range && range.fps && this.fps) {
			if (this.fps === range.fps) equal = ((this.frame === range.frame) && (this.frames === range.frames));
			else {
				// make copies so neither range is changed
				var range1 = this.copyTimeRange();
				var range2 = range.copyTimeRange();
				range1.synchronize(range2);
				equal = ((range1.frame === range2.frame) && (range1.frames === range2.frames));
			}
		}
		return equal;
	};
	pt.maxLength = function(time) {
		this.synchronize(time);
		this.frames = Math.max(time.frame, this.frames);
	};
	pt.minLength = function(time) {
		this.synchronize(time);
		this.frames = Math.min(time.frame, this.frames);
	};
})(TimeRange.prototype);

var Util = {
	array_empty: function(array){
		while(array.length > 0) array.pop();
	},
	array_add: function(array, value){
		var pos;
		if (array && Util.isarray(array)) {
			pos = array.indexOf(value);
			if (-1 === pos) array.push(value);
		}
	},
	array_find: function(array, value, key){
		var item = null, i, z;
		if (array && Util.isarray(array)) {
			if (Util.isnt(key)) key = 'id';
			if (Util.isob(value)) value = value[key];
			if (! Util.isnt(value)) {
				z = array.length;
				for (i = 0; i < z; i++){
					item = array[i];
					if (item && (item[key] === value)) break;
					item = null;
				}
			}
		}
		return item;
	},
	array_delete: function(array, value){
		var index;
		if (Util.isarray(array)){
			index = array.indexOf(value);
			if (-1 < index) array.splice(index, 1);
		}
	},
	array_delete_ref: function(array, value, key){
		var ob, index = -1;
		if (Util.isarray(array)){
			ob = this.array_find(array, value, key);
			if (ob) {
				index = array.indexOf(ob);
				if (-1 < index) array.splice(index, 1);
			}
		}
		return index;
	},
	array_replace: function(array, value, key){
		var index = this.array_delete_ref(array, value, key);
		if (-1 < index) array.splice(index, 0, value);
		else array.push(value);
	},
	contents_match: function(a1, a2){
		var i, z, match = true;
		if (a1 && a2 && (a1.length === a2.length)){
			z = a1.length;
			for (i = 0; i < z; i++){
				if (a1[i] !== a2[i]){
					match = false;
					break;
				}
			}
		}
		return match;
	},
	copy_array: function(a1, a2){
		if (! a2) a2 = [];
		var i, z = a1.length;
		for (i = 0; i < z; i++) a2.push(a1[i]);
		return a2;
	},
	copy_ob: function(ob1, ob2){
		if (! Util.isnt(ob1)) {
			if (! ob2) ob2 = {};
			var key;
			for (key in ob1) {
				if (Util.copy_key_valid(key)) ob2[key] = ob1[key];
			}
		}
		return ob2;
	},
	copy_key_valid: function(key){
		return (key.substr(0,1) !== '$');
	},
	copy_ob_scalars: function(ob1, ob2, dont_overwrite){
		if (! Util.isnt(ob1)) {
			if (Util.isnt(ob2)) ob2 = {};
			var key;
			for (key in ob1) {
				if (Util.copy_key_valid(key)){
					if (! Util.isob(ob1[key])) {
						if ((! dont_overwrite) || Util.isnt(ob2[key])) {
							ob2[key] = ob1[key];
						}
					}
				}
			}
		}
		return ob2;
	},
	copy_keys_recursize: function(ob1, ob2){
		var key, value1;
		if (Util.isob(ob1)){
			if (Util.isnt(ob2)) ob2 = {};
			for (key in ob1) {
				if (Util.copy_key_valid(key)){
					value1 = ob1[key];
					if (Util.isob(value1)) {
						if (Util.isarray(value1)) ob2[key] = Util.copy_array(value1);
						else ob2[key] = Util.copy_keys_recursize(value1, ob2[key]);
					} else ob2[key] = value1;
				}
			}
		}
		return ob2;
	},
	index_after_removal: function(index, items, container){
		var found, i, z, container_index, container_indexes = [];
		z = items.length;
		for (i = 0; i < z; i++){
			container_index = container.indexOf(items[i]);
			container_indexes.push(container_index);
			if ((-1 < container_index) && (index > container_index)) index --;
		}
		for (i = 0; i < z; i++){
			found = ((index + i) !== container_indexes[i]);
			if (found) break;
		}
		if (! found) index = -2;
		return index;
	},
	is: function(variable){
		return ! Util.isnt(variable);
	},
	is_typeof: function(){
		var value, i, z, found = false;
		z = arguments.length;
		for (i = 0; i < z; i++){
			if (i) found = (typeof arguments[i] === value);
			else value = arguments[i];
			if (found) break;
		}
		return found;
	},
	isarray: function() {
		var i, z, found = false;
		z = arguments.length;
		for (i = 0; i < z; i++){
			if (arguments[i]) {
				if (Util.isnt(Array.isArray)) found = (arguments[i] instanceof Array);
				else found = Array.isArray(arguments[i]);
			}
			if (! found) break;
		}
		return found;
	},
	isnt: function(){
		return this.is_typeof.apply(this, this.copy_array(arguments, ['undefined']));
	},
	isob: function(){
		return this.is_typeof.apply(this, this.copy_array(arguments, ['object']));
	},
	isstring: function(){
		return this.is_typeof.apply(this, this.copy_array(arguments, ['string']));
	},
	keys_found_equal: function(hash1,hash2){
		var key, match = true; 
		for (key in hash1){
			match = (hash1[key] === hash2[key]);
			if (! match) break;
		}
		return match;
	},
	keys_match: function(hash1, hash2){
		var key, match = true;
		for (key in hash1){
			if (Util.isnt(hash2[key])) {
				match = false;
				break;
			}
		}
		if (match) {
			for (key in hash2){
				if (Util.isnt(hash1[key])) {
					match = false;
					break;
				}
			}
		}
		return match;
	},
	ob_keys: function(ob){
		var key, array = [];
		if (Util.isob(ob)) for (key in ob) array.push(key);
		return array;
	},
	
	ob_property: function(ob, prop) {
		var i, z, val = null;
		if (Util.isob(ob) && (! Util.isnt(prop)) && prop.length) {
			prop = prop.split('.');
			z = prop.length;
			for (i = 0; i < z; i++){
				ob = ob[prop[i]];
				if (Util.isnt(ob)){
					val = null;
					break;
				}
				val = ob;
			}
		}
		return val;
	},
	ob_values: function(ob){
		var key, array = [];
		if (Util.isob(ob)) for (key in ob) array.push(ob[key]);
		return array;
	},
	pad: function(n, width, z) {
		z = z || '0';
		n = String(n);
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	},
	pluralize: function(n, s){
		if (n !== 1) s += 's';
		return s;
	},
	set_ob_property: function(ob, prop, val) {
		var i, z;
		if (Util.isob(ob) && (! Util.isnt(prop)) && prop.length) {
			prop = prop.split('.');
			z = prop.length - 1;
			for (i = 0; i < z; i++){
				ob = ob[prop[i]];
				if (! Util.isob(ob)){
					ob = null;
					break;
				}
			}
			if (ob) ob[prop[i]] = val;
		}
	},
	sort_by_frame: function(clip1, clip2) {
		return (clip1.frame - clip2.frame) || (clip1.frames - clip2.frames);
	},
	sort_by_label: function(a, b) {
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	},
	sort_numeric: function(a, b){return a-b;},
	sort_numeric_desc: function(a, b){return b-a;},
	uuid: function(){
		return (function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b);})();
	},
};
return MovieMasher; 
}); 
