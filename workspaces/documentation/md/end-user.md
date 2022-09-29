The Movie Masher client application provides a powerful, simplified interface that facilitates video editing and realtime switching within a web browser. It allows you to construct video files and livestreams that are rendered remotely, even when your local device has limited connectivity. 


## Where to Run

Non-developers or anyone with an Amazon account may find launching Movie Masher within their
[AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6) to be the simplest option. The image available there can be used to launch an EC2 instance of any size, to which you have full access. You can even make your own images based on it, including any custom changes or additions.


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
- *Activity* - view of history related to imports, exports, renderings, etc.

## Drag and Drop
While not required, Drag and Drop interactions provide the most intuitive means to import and arrange media elements. Video, audio, and images can all be dragged from the file system or other applications, and then dropped directly on the Browser, Timeline, or Player panels to import. Once preprocessed locally, the file will appear in the Browser panel and information about it will appear in the Activity panel. 

When files are dropped on the Player panel, a new track is created for each one containing a clip that references it. Each clip starts at the current playhead position. When files are dropped on the Timeline panel, the behavior is similar but each clip starts at the time that corresponds to the drop location. 

When files are dropped on an existing track within the Timeline, the clips appear consecutively on that track but the start time of the sequence depends on whether it is a dense or sparse track. On a sparse track, the start time is the time that corresponds to the drop location - or if a clip is already there, the start of the next available space that can contain the whole sequence. On a dense track, the start time is the end time of the track or if files are dropped directly on a clip, the start time of that clip. 

