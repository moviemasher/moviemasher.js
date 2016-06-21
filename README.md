[![Image](https://github.com/moviemasher/angular-moviemasher/raw/master/README/logo-120x60.png "MovieMasher.com")](http://moviemasher.com)
**moviemasher.js | [angular-moviemasher](https://github.com/moviemasher/angular-moviemasher "sits between moviemasher.js and moviemasher.rb, providing an editing GUI and simple CMS middleware layer") | [moviemasher.rb](https://github.com/moviemasher/moviemasher.rb "sits behind angular-moviemasher, providing processor intensive video transcoding services through a simple API")**

*JavaScript library for realtime, browser-based video and audio editing*
# moviemasher.js

Use moviemasher.js to edit and display mashups of video, audio and images within a canvas element. Its player works like the native HTML5 video player, but adds support for multitrack compositing, transitions and titling using your custom fonts.

- **visual composition** with transformations
- **audio mixing** utilizing WebAudio
- **undo/redo** history and commands
- **framework** for custom effects, titles and transitions

### Overview: Canvas + Mash = Player

Each instance of the player is bound to a canvas element and displays just a single mash within it, but this mash can contain any number of audio or video tracks having any number of clips on them. A mash is just a simple JavaScript Object that describes a collection of media and how to arrange it over time.

- **Documentation:** [MovieMasher.com](http://moviemasher.com/docs/)

A player binds to its mash object directly, without copying or adding any methods. It may add default objects, arrays and scalar values though, for faster runtime parsing. Changes you make to the mash are reflected in the player the next time redraw() is called. Or as an alternative to direct data manipulation, you can use the player's add(), change() and remove() methods. When using these you can also call undo() and redo() to provide a complete edit history.

##### Basic slideshow with audio
```JavaScript
var context = document.getElementById("mm-canvas").getContext('2d');
var mm_player = MovieMasher.player({canvas_context: context, autoplay: true});
MovieMasher.register(MovieMasher.Constant.filter, [
  { "id":"overlay", "source": "../dist/filters/overlay.js" },
  { "id":"scale", "source": "../dist/filters/scale.js" },
  { "id":"setsar", "source": "../dist/filters/setsar.js" }
]);

mm_player.add({ type: 'image', url: 'media/image/cable.jpg', frames: 2 });
mm_player.add({ type: 'image', url: 'media/image/frog.jpg', frames: 2 });
mm_player.add({ type: 'audio', url: 'media/audio/loop.mp3', duration: 2 });

// OR, more verbosely...

mm_player.mash = {
  "media": [
    { "id": "image-cable", "type": "image", "url": "media/image/cable.jpg" },
    { "id": "image-frog", "type": "image", "url": "media/image/frog.jpg" },
    { "id": "audio-id", "type": "audio", "duration": "2", "url": "media/audio/loop.mp3" }
  ],
  "video": [ {
    "type": "video",
    "clips": [
      { "id": "image-cable", "frame": 0, "frames": 2 },
      { "id": "image-frog", "frame": 0, "frames": 2 }
    ]
  } ],
  "audio": [ {
    "type": "audio",
    "clips": [ { "id": "audio-id", "frame": 0, "frames": 2 } ]
  } ]
};
```

### Related Projects
Three separate projects - *moviemasher.js, angular-moviemasher and moviemasher.rb* - can be combined to engineer a complete, browser-based audio/video editing and encoding system. Or projects can be utilized independently, if editing or encoding features are all that's needed. Only angular-moviemasher is dependent on the other projects, since it's designed to sit between them as a middleware layer providing content managemnt functions.

### Included Requirements
- opentype.js
- script.js

### User Feedback
If any problems arise while utilizing this repository, a [GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed. Please include the mash description that's causing problems and any relevant console entries. Please post your issue ticket in the appropriate repository and refrain from cross posting - all projects are monitored with equal zeal.

### Contributing
Please join in the shareable economy by gifting your efforts towards improving this project in any way you feel inclined. Pull requests for fixes, features and refactorings are always appreciated, as are documentation updates. Creative help with graphics, video and the web site is also needed. Please contact through [MovieMasher.com](http://moviemasher.com) to discuss your ideas.

#### Developer Setup
Various components of this project can be updated or rebuilt after installing git, npm, bower, and grunt. Once applications are installed `cd` to project directory and execute:

1. install git, npm, bower and grunt
1. npm install
1. bower install --production --allow-root
1. grunt

Or if docker is being used, `cd` into the *config/docker/grunt* directory and execute...

- `docker-compose run --rm grunt`

- `docker-compose run --rm grunt bower install --production `

#### Known issues in this version
- new convolution filter is very beta - does not always match ffmpeg output
- little documentation - see angular-moviemasher for usage and moviemasher.rb for mash syntax
- video file playback not yet supported - they must be converted to image sequences and MP3 soundtracks
- audio filters not yet supported

#### Migrating from Version 4.0.7
- The `begin` key in video clips has been renamed `first`.
- The `length` key in clips has been renamed `frames`.
- The `audio` and `video` keys in mash tracks have been moved to mash.
- The `tracks` key in mashes has been removed.
