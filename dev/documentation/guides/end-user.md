## End User

The Movie Masher client application provides a powerful, simplified interface that facilitates video editing and realtime switching within a web browser. It allows you to construct video files and livestreams that are rendered remotely, even when your local device has limited connectivity. 


## Key Concepts

**Video editors** typically work with some kind of 'edit decision list' which Movie Masher calls a _mash_. It describes how and when media elements should be presesented within a video file, including animated transformations of visual media. Usually it's edited within some sort of linear, time-based interface. 

**Video switchers** typically work with some collection of 'scenes' which Movie Masher calls a _cast_. Each scene only describes a visual arrangement of media assets. Usually some sort of scene list is presented, with a mechanism to select one of them as 'active'. 

**Movie Masher** extends this concept by representing each scene as a mash - _a cast is a collection of mashes._ Instead of switching between mashes, several of them can be active at once and thereby composited together. Since each mash has its own timing and animation information, it can be played independently of the others. 

## User Interface

The Movie Masher user interface is divided into several panels that contain different views, inputs, and specialized controls which help structure and organize specific tasks. 

<!-- MAGIC:START (COLORSVG:replacements=black&src=../svg/masher.svg) -->
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 360" class='diagram'>
<path d="M 0.00 0.00 L 219.76 0.00 L 219.76 175.37 L 0.00 175.37 Z M 0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 0.00 L 640.00 0.00 L 640.00 299.97 L 460.00 299.97 Z M 460.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 228.82 0.00 L 450.00 0.00 L 450.00 175.37 L 228.82 175.37 Z M 228.82 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 0.00 185.00 L 219.76 185.00 L 219.76 360.00 L 0.00 360.00 Z M 0.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="14.00" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Player]]</text>
<text x="242.82" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Browser]]</text>
<text x="14.00" y="219.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Composer]]</text>
<text x="474.00" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Inspector]]</text>
<text x="242.82" y="219.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Timeline]]</text>
<path d="M 228.82 185.00 L 448.54 185.00 L 448.54 360.00 L 228.82 360.00 Z M 228.82 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 310.00 L 640.00 310.00 L 640.00 360.00 L 460.00 360.00 Z M 460.00 310.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="474.00" y="344.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Activity]]</text>
</svg>
<!-- MAGIC:END -->

- *Player* - video preview, volume control, playback controls
- *Timeline* - view of media clips in tracks, zoom controls, scrub controls
- *Browser* - source media grouped by type, upload/import controls
- *Inspector* - timing controls, inputs that size, position, colorize, blend
- *Composer* - view of mashes in layers, stream controls
- *Activity* - view of history related to imports, exports, renderings, etc.



## Drag and Drop
While not required, Drag and Drop interactions provide the most intuitive means to import and arrange media elements. Video, audio, and images can all be dragged from the file system or other applications, and then dropped directly on the Browser, Timeline, or Player panels to import. Once preprocessed locally, the file will appear in the Browser panel and information about it will appear in the Activity panel. 

When files are dropped on the Player panel, a new track is created for each one containing a clip that references it. Each clip starts at the current playhead position. When files are dropped on the Timeline panel, the behavior is similar but each clip starts at the time that corresponds to the drop location. 

When files are dropped on an existing track within the Timeline, the clips appear consecutively on that track but the start time of the sequence depends on whether it is a dense or sparse track. On a sparse track, the start time is the time that corresponds to the drop location - or if a clip is already there, the start of the next available space that can contain the whole sequence. On a dense track, the start time is the end time of the track or if files are dropped directly on a clip, the start time of that clip. 

