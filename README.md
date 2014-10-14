[![Image](https://github.com/moviemasher/moviemasher.js/blob/master/README/logo-120x60.png "MovieMasher.com")](http://moviemasher.com)
**moviemasher.js | [angular-moviemasher](https://github.com/moviemasher/angular-moviemasher "sits between moviemasher.js and moviemasher.rb, providing an editing GUI and simple CMS middleware layer") | [moviemasher.rb](https://github.com/moviemasher/moviemasher.rb "sits behind angular-moviemasher, providing processor intensive video transcoding services through a simple API")**

*JavaScript library for realtime, browser-based video and audio editing*
#moviemasher.js

Use moviemasher.js to edit and display mashups of video, audio and images within a canvas element. Its player works like the native HTML5 video player, but adds support for multitrack compositing, transitions and titling using your custom fonts. 

- **visual composition** with transformations
- **audio mixing** utilizing WebAudio
- **undo/redo** history and commands
- **framework** for custom effects, titles and transitions

### Canvas + Mash = Player

Each instance of the player is bound to a canvas element and displays just a single mash within it, but this mash can contain any number of audio or video tracks having any number of clips on them. A mash is just a simple JavaScript Object that describes a collection of media and how to arrange it over time. 

A player binds to its mash object directly, without copying or adding any methods. It may add default objects, arrays and scalar values though, for faster runtime parsing. Changes you make to the mash are reflected in the player the next time redraw() is called. Or as an alternative to direct data manipulation, you can use the player's add(), change() and remove() methods. When using these you can also call undo() and redo() to provide a complete edit history. 

##### Basic slideshow with audio

	var context = document.getElementById("mm-canvas").getContext('2d');
	var mm_player = MovieMasher.player({canvas_context: context, autoplay: true});
	
	mm_player.add({ type: 'image', url: 'media/image/cable.jpg', length: 2 });
	mm_player.add({ type: 'image', url: 'media/image/frog.jpg', length: 2 });
	mm_player.add({ type: 'audio', url: 'media/audio/loop.mp3', duration: 2 });
	
	// OR, more verbosely...
	
	mm_player.mash = {
		"media": [
			{ "id": "image-cable", "type": "image", "url": "media/image/cable.jpg" },
			{ "id": "image-frog", "type": "image", "url": "media/image/frog.jpg" },
			{ "id": "audio-id", "type": "audio", "duration": "2", "url": "media/audio/loop.mp3" }
		],
		"tracks": {
			"video": [ {
				"type": "video",
				"clips": [ 
					{ "id": "image-cable", "frame": 0, "length": 2 },
					{ "id": "image-frog", "frame": 0, "length": 2 }
				]
			} ],
			"audio": [ {
				"type": "audio",
				"clips": [ { "id": "audio-id", "frame": 0, "length": 2 } ]
			} ]
		}
	};

### Related Projects
Three separate projects - *moviemasher.js, angular-moviemasher and moviemasher.rb* - can be combined to engineer a complete, browser-based audio/video editing and encoding system. Or projects can be utilized independently, if editing or encoding features are all that's needed. Only angular-moviemasher is dependent on the other projects, since it's designed to sit between them as a middleware layer providing content managemnt functions.


### Included Requirements 
- Font.js

### Developer Steps
1. install git, npm, bower and grunt
2. npm install
3. bower install
4. grunt

##### Known issues in Version 4.0.07
- little documentation - see angular-moviemasher for usage
- video file playback not yet supported - they must be converted to image sequences and MP3 soundtracks
- audio filters not yet supported
