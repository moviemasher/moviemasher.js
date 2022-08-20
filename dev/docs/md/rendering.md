## Rendering

At the lowest level, [FFmpeg](https://www.ffmpeg.org) is used server-side through the
[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) library to render
a [[Mash]] into files of various types. To run FFmpeg commands Movie Masher wraps an instance from this library with an instance of the [[Command]] class, that itself is wrapped by a [[RunningCommand]] instance which allows the FFmpeg process to be monitored and potentially stopped.

At the highest level, the [[RenderingServer]] receives a request to render a [[MashObject]] into one or more output files, represented by [[CommandOutputs]]. It validates the request and passes it to a new [[RenderingProcess]] instance. This creates a specific type of [[RenderingOutput]] instance for each [[CommandOutput]] provided, which is responsible for converting the [[Mash]] into a corresponding [[RenderingDescription]] object. The [[RenderingProcess]] then converts each of them to a [[CommandDescription]] that it creates a [[RunningCommand]] with:

<!-- MAGIC:START (COLORSVG:replacements=black&src=../svg/ffmpeg-abstraction.svg) -->
<svg width="640" height="190" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 190">
<path d="M 380.00 0.00 L 640.00 0.00 L 640.00 190.00 L 380.00 190.00 Z M 380.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="385.25" y="29.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[RunningCommand]]</text>
<path d="M 389.00 40.00 L 630.00 40.00 L 630.00 180.00 L 389.00 180.00 Z M 389.00 40.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="394.25" y="69.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Command]]</text>
<path d="M 20.00 80.00 L 260.00 80.00 L 260.00 120.00 L 20.00 120.00 Z M 20.00 80.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="25.25" y="109.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[RenderingOutput]]</text>
<path d="M 10.00 40.00 L 270.00 40.00 L 270.00 180.00 L 10.00 180.00 Z M 10.00 40.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="15.25" y="69.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[RenderingProcess]]</text>
<path d="M 347.40 100.00 L 363.10 100.00 M 363.10 103.59 L 363.10 96.41 L 380.00 100.00 Z M 363.10 103.59" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 260.00 100.00 L 380.00 100.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 399.67 80.00 L 620.00 80.00 L 620.00 170.00 L 399.67 170.00 Z M 399.67 80.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="404.92" y="109.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >  fluent-ffmpeg</text>
<path d="M 409.33 120.00 L 610.00 120.00 L 610.00 160.00 L 409.33 160.00 Z M 409.33 120.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="414.58" y="149.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >  FFmpeg</text>
<path d="M 0.10 0.00 L 279.90 0.00 L 279.90 190.00 L 0.10 190.00 Z M 0.10 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="5.35" y="29.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[RenderingServer]]</text>
<path d="M 20.00 130.00 L 260.00 130.00 L 260.00 170.00 L 20.00 170.00 Z M 20.00 130.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="25.25" y="159.73" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >…</text>
</svg>
<!-- MAGIC:END -->

Hence, the [[RenderingProcess]] interface greatly simplifies generating
multiple output files from a [[MashObject]], [[DefinitionObjects]], and [[CommandOutputs]]. The underlying [[RunningCommand]] interface can be used directly to render output, though any inputs specified must be locally sourced. The base-level [[Command]] interface can be used when monitoring isn't needed, or when synchronous results are required.

## Outputs

Movie Masher supports five [[RenderingOutput]] interfaces that convert a
[[Mash]] into the [[RenderingDescription]] that will render its specific output:

- [[VideoOutput]]: a single video file, with audio tracks
- [[AudioOutput]]: a single audio file
- [[ImageOutput]]: a single image file
- [[ImageSequenceOutput]]: multple image files, one for each frame
- [[WaveformOutput]]: a single image file, representing audio visually

Each [[RenderingOutput]] will return a different [[RenderingDescription]] for the same [[Mash]]
content. For instance, one returned by an [[AudioOutput]] will only describe a range of its audible content while one from an [[ImageOutput]] will only describe its visible content at a single point in time. A [[VideoOutput]] will return one describing a range of both, with the visible content potentially broken up into smaller chunks. To accommodate all these cases, the [[RenderingDescription]] can contain:

- a single [[CommandDescription]] object, describing the audible content
- multiple [[CommandDescriptions]] object, describing the visual content
- a single [[RenderingCommandOutput]] object that specifies output options

The [[CommandDescription]] object structure closely matches FFmpeg's command line options and as such can contain:

- multiple [[CommandInputs]], each describing a raw media `source` file plus related input `options` like start time or duration
- a single [[CommandOutput]] object describing the output file's AV codecs, bitrates, and dimensions as well as its file extension and format plus related output `options`
- multiple [[GraphFilters]], each describing an FFmpeg filter to apply (AKA a [filtergraph](https://ffmpeg.org/ffmpeg-filters.html#Filtergraph-description))

## Descriptions
To generate an appropriate [[RenderingDescription]], a [[RenderingOutput]] will have its [[Mash]] create a new [[FilterGraphs]] instance - a specialized collection of [[FilterGraph]] objects:

- a single [[FilterGraph]] instance, describing audible content
- multiple [[FilterGraph]] instances, describing visible content

Each [[FilterGraph]] describes a section of the [[Mash]] that can be conveniently
cached and rendered together, including just the [[Clips]] in that section relevant to the [[RendingOutput]].
Together that are used to build the remaining [[RenderingDescription]] data:

- multiple [[CommandInput]] objects, describing any input files
- mutiple [[GraphFilter]] objects, describing any filters to apply

In keeping with FFmpeg, the [[RenderingOutput]] will supply input files and/or filters. For instance, the default [[Clip]] is a simple colored rectangle which is adequately described by just the [color](https://ffmpeg.org/ffmpeg-filters.html#color)
filter. A [[Clip]] with a [[ShapeContainer]] is adequately described by just an SVG input file. A [[Clip]] with an [[Image]] or [[Video]] will typically be described both by an input file and multiple filters that size, position and crop it. 

The [[CommandInput]] interface extends [[GraphFile]], which ultimately describes a file on disk that is made available to FFmpeg during [[Command]] execution. Typically this is the raw asset associated with [[Video]], [[Image]], or [[Audio]] clips but other resources are also supported. FFmpeg requires files to be specified either as a [[CommandInput]] or [[GraphFilter]] option value.


## File Caching
Internally, a [[RenderingOutput]] will build its [[CommandInputs]] from a set of [[GraphFiles]] provided by the [[FilterGraphs]]. 
A single [[Clip]] may require multiple [[GraphFiles]] which may or may not all be converted to [[CommandInputs]]. They will all be cached locally though, and their paths ultimately utilized either as direct input, or as filter options. 

For instance, a [[Clip]] with a [[TextContainer]] and [[ColorContent]] will require two [[Graphfiles]] - one for the [[Font]] and another containing the text itself. Neither of these
are converted to [[CommandInputs]] because FFmpeg's underlying
[drawtext](https://ffmpeg.org/ffmpeg-filters.html#drawtext)
filter expects paths to these files to be specified as option values. The font file is cached though, and the text is written to disk. 

To assure that all files in a [[RenderingDescription]] are available locally, a [[RenderingOutput]] will retrieve a promise from its [[Mash]] to cache them. In some cases, it will retrieve one directly from its [[Loader]] to load specific [[GraphFiles]] from the [[FilterGraphs]] which are required to determine output duration or dimensions, if it can't be calculated from information supplied in the [[DefinitionObjects]].

The [[NodeLoader]] handles all the complexity of caching each [[GraphFile]]
locally and correctly providing its file path to [[GraphFilters]].
Caching a [[GraphFile]] triggers different postprocessing, depending on its `type` property
which can be either a [[GraphFileType]] or [[LoadType]].

In the simplest case, the `type` property is a [[GraphFileType]] which implies the `file`
property will be the actual file content. This is simply saved to the `cacheDirectory` of
the [[RenderingOutput]] as, for instance, a TEXT, SVG or PNG file. Binary files must be
Base64 encoded.

In cases where the `type` property is a [[LoadType]], the `file` property will be a
relative or absolute URL. The [[NodeLoader]]
instance is configured by the [[RenderingProcess]] instance to download absolute URLs, but resolve relative ones to a local directory. Typically, the [[RenderingServer]] specifies this as the user's upload directory.
