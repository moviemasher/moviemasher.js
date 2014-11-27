/*global opentype:true*/
var Loader = {
	load_audio: function(url){
		Audio.load(url);
	},
	load_font: function(url){
		var font = MovieMasher.find(Constant.font, url, Constant.source);
		if (font) {
			Loader.cached_urls[url] = font;
			opentype.load(url, function (err, font) {
				if (err) console.error('could not find registered font with url', url);
				else {
					Loader.cached_urls[url] = font;
					delete Loader.requested_urls[url];
					Players.draw_delayed();
				}
			});

		} else console.error('could not find registered font with url', url);
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
