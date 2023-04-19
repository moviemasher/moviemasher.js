import type { Htmls, SlottedContent } from '../declarations.js'

import { Footer, LeftCenterRight } from '../Base/LeftCenterRight.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { html } from 'lit'

@customElement('moviemasher-viewer-footer')
export class ViewerFooterElement extends Footer {

  override leftContent(slots: Htmls): SlottedContent {
    const slotsCopy = [...slots]
    this.importTags('moviemasher-icon')
    slotsCopy.push(html`<moviemasher-icon
      icon='play' emit='toggle' detail='play'
    ></moviemasher-icon>`)

    return super.leftContent(slotsCopy)
  }

  // override rightContent(slots: Htmls): SlottedContent {
  //   const slotsCopy = [...slots]
  //   // slotsCopy.push(html`<span>!${this.clientContext?.constructor.name}!</span>`)
  //   return super.rightContent(slotsCopy)
  //   // import((new URL('../right/right.js', import.meta.url)).href)
  //   // return html``
  // }

  static override styles = [
    LeftCenterRight.styleHost,
    css`
      footer .time {
        font-size: 0.75em;
        text-align: right;
        flex-grow: 1;
      }
    `
  ]
}
