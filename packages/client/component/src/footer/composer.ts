import type { Htmls, SlottedContent } from '../declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'

import { Footer } from '../Base/LeftCenterRight.js'

@customElement('moviemasher-composer-footer')
export class ComposerFooterElement extends Footer {

  override leftContent(slots: Htmls): SlottedContent {
    return super.leftContent(slots)
    // import((new URL('../left/right.js', import.meta.url)).href)
    // return html`<moviemasher-right-left></moviemasher-right-left>`
  }

  override rightContent(slots: Htmls): SlottedContent {
    return super.rightContent(slots)
    // import((new URL('../right/right.js', import.meta.url)).href)
    // return html``
  }
}
