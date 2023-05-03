import type { Htmls, OptionalContent } from '../declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'

import { Footer } from '../Base/LeftCenterRight.js'

@customElement('movie-masher-inspector-footer')
export class InspectorFooterElement extends Footer {
  override leftContent(slots: Htmls): OptionalContent {
    return super.leftContent(slots)
    // import((new URL('../left/right.js', import.meta.url)).href)
    // return html`<movie-masher-right-left></movie-masher-right-left>`
  }

  override rightContent(slots: Htmls): OptionalContent {
    return super.rightContent(slots)
    // import((new URL('../right/right.js', import.meta.url)).href)
    // return html``
  }
}
