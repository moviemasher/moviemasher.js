Laying out a Movie Masher application involves creating a tagging structure that properly
nests components within a functional hierarchy. A given child component may have to be
positioned under a particular parent component in order to access the context it needs
to fully function.
Here we discuss each of the components that supply context to their children, in the
order they usually appear within the hierarchy.

## API

The [[Api]] component is typically the root component wrapping the entire application,
which allows all child components that require server interaction to share its [[ApiContext]].
This contains an `enabled` array containing a [[ServerType]] for each supported server,
and an `endpointPromise` method returning a fetch promise for each request. Some child components use the array to
hide themselves if their required server is unsupported, or use the method to post
requests to it.

## Caster

The [[Caster]] component can be the root component or a descendent of [[Api]].
In the later case, it will make a [[DataCastDefaultRequest]] to retrieve a [[Cast]]
to load. It supplies a [[CasterContext]] to its children which simply contains a
`castEditor` reference to the underlying [[CastEditor]]. Some child components use this
reference to subscribe to its events, access its properties, and call its methods.
It typically contains the following children:

<!-- MAGIC:START (COLORSVG:replacements=black&src=../moviemasher/dev/graphics/caster.svg) -->
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 360">
<path d="M 190.00 184.63 L 409.76 184.63 L 409.76 360.00 L 190.00 360.00 Z M 190.00 184.63" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M -0.00 0.00 L 180.00 0.00 L 180.00 360.00 L -0.00 360.00 Z M -0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 418.82 184.63 L 640.00 184.63 L 640.00 360.00 L 418.82 360.00 Z M 418.82 184.63" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 190.00 0.00 L 640.00 0.00 L 640.00 175.00 L 190.00 175.00 Z M 190.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="213.01" y="219.11" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Inspector]]</text>
<text x="441.83" y="219.11" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Browser]]</text>
<text x="213.01" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Switcher]]</text>
<text x="23.01" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Layers]]</text>
</svg>
<!-- MAGIC:END -->

## Masher

The [[Masher]] component can be the root component or placed under an [[Api]] or [[Caster]]
component. When under an [[Api]] component it will make a [[DataMashDefaultRequest]] to retrieve a
a [[Mash]] to load. When under a [[Caster]] component it will instead load its selected one.
It supplies a [[MasherContext]] to its children which simply contains a
`mashEditor` reference to the underlying [[MashEditor]].
The user interface presented on the [Demo](demo/index.html) page uses the
[[MasherDefault]] method to suppy default props to this component.
It supplies the following children:

<!-- MAGIC:START (COLORSVG:replacements=black&src=../moviemasher/dev/graphics/masher.svg) -->
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 360">
<path d="M 0.00 0.00 L 219.76 0.00 L 219.76 175.37 L 0.00 175.37 Z M 0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 0.00 L 640.00 0.00 L 640.00 360.00 L 460.00 360.00 Z M 460.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 228.82 0.00 L 450.00 0.00 L 450.00 175.37 L 228.82 175.37 Z M 228.82 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 0.00 185.00 L 450.00 185.00 L 450.00 360.00 L 0.00 360.00 Z M 0.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="21.66" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Player]]</text>
<text x="249.84" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Browser]]</text>
<text x="21.20" y="219.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Timeline]]</text>
<text x="480.00" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Inspector]]</text>
</svg>
<!-- MAGIC:END -->

## Streamer

The [[Streamer]] component can be the root component or appear anywhere within the
hierarchy.

## Webrtc

The [[Webrtc]] component

## Player

The [[Player]] component

## Browser

The [[Browser]] component

## Timeline

The [[Timeline]] component

## Inspector

The [[Inspector]] component

## Layers

The [[Layers]] component

## Switcher

The [[Switcher]] component
