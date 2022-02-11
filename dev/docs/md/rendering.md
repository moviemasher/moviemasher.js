## Rendering

Previews are built using interfaces similar to those provided by
[FFmpeg's Filters](https://www.ffmpeg.org/ffmpeg-filters.html):

- {@link FilterGraph}
- {@link FilterChain}
- {@link GraphFilter}
- {@link Filter}

<!-- MAGIC:START (COLORSVG:replacements=black&src=../moviemasher/dev/graphics/media.svg) -->
<svg width="900" height="900" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 900 900">
<path d="M 361.00 292.89 L 515.29 292.89 L 515.29 342.89 L 361.00 342.89 Z M 361.00 292.89" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="366.84" y="327.37" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Definition]]</text>
<path d="M 322.34 421.73 L 322.34 448.01 M 320.22 438.01 L 322.34 448.01 L 324.47 438.01" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 438.14 342.89 L 438.14 395.45 L 322.34 395.45 L 322.34 448.01" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 215.91 448.01 L 428.78 448.01 L 428.78 498.01 L 215.91 498.01 Z M 215.91 448.01" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="228.37" y="482.49" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[ClipDefinition]]</text>
<path d="M 215.91 150.82 L 428.78 150.82 L 428.78 200.82 L 215.91 200.82 Z M 215.91 150.82" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="225.05" y="185.30" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[FontDefinition]]</text>
<path d="M 487.99 150.82 L 716.23 150.82 L 716.23 200.82 L 487.99 200.82 Z M 487.99 150.82" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="501.47" y="185.30" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[FilterDefinition]]</text>
<path d="M 454.98 448.01 L 716.23 448.01 L 716.23 498.01 L 454.98 498.01 Z M 454.98 448.01" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="467.63" y="482.49" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[ModularDefinition]]</text>
<path d="M 585.61 421.73 L 585.61 448.01 M 583.48 438.01 L 585.61 448.01 L 587.73 438.01" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 438.14 342.89 L 438.14 395.45 L 585.61 395.45 L 585.61 448.01" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 322.34 223.84 L 322.34 200.82 M 324.47 210.82 L 322.34 200.82 L 320.22 210.82" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 322.34 200.82 L 322.34 246.86 L 438.14 246.86 L 438.14 292.89" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 602.11 223.84 L 602.11 200.82 M 604.24 210.82 L 602.11 200.82 L 599.99 210.82" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 438.14 292.89 L 438.14 246.86 L 602.11 246.86 L 602.11 200.82" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
</svg>
<!-- MAGIC:END -->
