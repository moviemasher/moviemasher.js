## User

The Movie Masher client application provides a powerful, simplified interface that facilitates video editing and realtime switching within a web browser. It allows you to construct video files and livestreams that are rendered remotely, even when your local device has limited connectivity. 

## Key Concepts

**Video editors** typically work with some kind of 'edit decision list' which Movie Masher calls a _mash_. It describes how and when media elements should be presesented within a video file, including animated transformations of visual media. Usually it's edited within some sort of linear, time-based interface. 

**Video switchers** typically work with some collection of 'scenes' which Movie Masher calls a _cast_. Each scene only describes a visual arrangement of media assets. Usually some sort of scene list is presented, with a mechanism to select one of them as 'active'. 

**Movie Masher** extends this concept by representing each scene as a mash - _a cast is a collection of mashes._ Instead of switching between mashes, several of them can be active at once and thereby composited together. Since each mash has its own timing and animation information, it can be played independently of the others. 

## User Interface

The Movie Masher user interface is divided into several panels that contain different views, inputs, and specialized controls which help structure and organize specific tasks. 

- *Player* - video preview, volume control, playback controls
- *Timeline* - view with media clips in tracks, zoom controls, scrub controls
- *Browser* - source media grouped by type, upload/import controls
- *Inspector* - timing controls, inputs that size, position, colorize, blend
- *Composer* - view with mashes in layers, stream controls




