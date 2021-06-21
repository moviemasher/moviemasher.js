version 4.0.26:
  - modernize codebase
  - port to typescript
  - remove all dependencies
  - switch to rollup bundler
  - provide Universal module (UMD)
  - provide CommonJS module (CJS)
  - provide ES module (ESM)
  - automatically register standard filters
  - add jest tests, including snapshots
  - add Video.mute property
  - change Video.video_rate to Video.fps
  - add support for transparency in mash.backcolor
  - restrict Masher.mash setter to Mash objects
  - base Masher.add's track type on type key in 1st parameter (definition type)
  - remove Masher.add's 2nd parameter (track type)
  - Masher.canvas_context now called canvasRenderingContext2D
  - Masher.buffertime now called buffer

version 4.0.25:
  - fix audio buffer source security issue in safari

version 4.0.23:
  - update dependencies

version 4.0.22:
  - use npm instead of bower

version 4.0.21:
  - support for npm installation
  - fixed example

version 4.0.20:
  - all classes now accessible from MovieMasher export

version 4.0.19:
  - fixed issues related to split functionality
  - fixed issues related to trim functionality

version 4.0.18:
  - new blend filter suports merging with blend modes
  - added support for values that are objects in constant types
  - fixed issues related to split functionality
  - fixed several issues related to audio playback

version 4.0.17:
- fixed issue undoing moves from track to track in timeline
- fixed issue undoing effect reordering

version 4.0.16
- fixed issue with some filters manipulating assets loaded from another domain
- now mounting package.json in grunt container
- simpler docker-compose instructions in README

version 4.0.15:
- switched indent_style to double space
- locked version of digitallyseamless/nodejs-bower-grunt image to 0.10
- now running concat first in Gruntfile
- new chromakey filter
- added utility methods to Filter
- docker-compose for grunt

version 4.0.14:
- new (very beta) convolution filter
- new colorchannelmixer filter
- filters no longer have to define no-op methods
- upgraded dependencies

version 4.0.13:
- utilize script.js
- ffmpeg filters now configurable
- new Filter object with utility methods
- new Loader object with asset loading methods

version 4.0.12:
- new split clip feature

version 4.0.11:
- lazy font look up on load

version 4.0.10:
- REAME improvements

version 4.0.9:
- fixed versioning
- default filter parameters
- switch to opentype.js

version 4.0.8:
- The `begin` key in video clips has been renamed `first`.
- The `length` key in clips has been renamed `frames`.
- The `audio` and `video` keys in mash tracks have been moved to mash.
- better evaluation
