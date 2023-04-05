import type { Htmls, SlottedContent } from '../declarations.js'
import type { LocalClient } from '@moviemasher/client-core'


import { customElement } from '@lit/reactive-element/decorators/custom-element.js'

import { Footer, LeftCenterRight } from '../Base/LeftCenterRight.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { consume } from '@lit-labs/context'
import { clientContext } from '../Context/clientContext.js'

@customElement('moviemasher-viewer-footer')
export class ViewerFooterElement extends Footer {

  @consume({context: clientContext, subscribe: true })
  clientContext: LocalClient | undefined

  override leftContent(slots: Htmls): SlottedContent {
    const slotsCopy = [...slots]
    import((new URL('../a.js', import.meta.url)).href)
    slotsCopy.push(html`<moviemasher-a
      icon='play' emit='toggle' detail='play'
    ></moviemasher-a>`)

    return super.leftContent(slotsCopy)
  }

  override rightContent(slots: Htmls): SlottedContent {
    const slotsCopy = [...slots]
    slotsCopy.push(html`<span>!${this.clientContext?.constructor.name}!</span>`)
    return super.rightContent(slotsCopy)
    // import((new URL('../right/right.js', import.meta.url)).href)
    // return html``
  }

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
