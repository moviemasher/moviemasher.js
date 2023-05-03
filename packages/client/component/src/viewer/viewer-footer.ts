import type { Htmls, OptionalContent } from '../declarations.js'

import { Footer, LeftCenterRight } from '../Base/LeftCenterRight.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { html } from 'lit'

@customElement('movie-masher-viewer-footer')
export class ViewerFooterElement extends Footer {

  override leftContent(slots: Htmls): OptionalContent {
    const slotsCopy = [...slots]
    this.importTags('movie-masher-icon')
    slotsCopy.push(html`<movie-masher-icon
      icon='play' emit='toggle' detail='play'
    ></movie-masher-icon>`)

    return super.leftContent(slotsCopy)
  }

  static override styles = [
    LeftCenterRight.cssSection,
    css`
      footer .time {
        font-size: 0.75em;
        text-align: right;
        flex-grow: 1;
      }
    `
  ]
}
