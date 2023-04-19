import type { ClientReadParams } from '@moviemasher/client-core'
import { consume } from '@lit-labs/context'

import { customElement } from 'lit/decorators/custom-element.js'
import { css, html } from 'lit'
import { Div } from '../Base/LeftCenterRight.js'
import { clientReadParamsContext } from '../Context/clientReadParamsContext.js'
import { property } from 'lit/decorators/property.js'
import { Htmls, SlottedContent } from '../declarations.js'
import { ifDefined } from 'lit/directives/if-defined.js'


@customElement('moviemasher-selector-div')
export class SelectorDivElement extends Div {
  @consume({ context: clientReadParamsContext, subscribe: true })
  @property({ attribute: false })
  clientReadParams?: ClientReadParams

  protected override leftContent(htmls: Htmls): SlottedContent {
    const slotsCopy = [...htmls]
    const mediaType = this.clientReadParams?.type || 'video'

    this.importTags('moviemasher-icon')
    slotsCopy.push(
      html`<moviemasher-icon 
        exportparts='${ifDefined(this.exportsForSlot('icon'))}'
        part='icon' slotted='icon'
        icon='${mediaType}'
      ></moviemasher-icon>`
    )
    
    return super.leftContent(slotsCopy)
  }

  protected override rightContent(htmls: Htmls): SlottedContent {



    const slotsCopy = [...htmls]
    const tagged = html`<span>${this.clientReadParams?.type}</span>`
    // slotsCopy.push(html`${this.clientReadParams?.type || 'video'}`)
    // this.importTags('moviemasher-span')

    slotsCopy.push(tagged)
    
    return super.rightContent(slotsCopy)
  }


  static override styles = [css`
    :host {
      display: flex;
    }

    div .dropping {
      box-shadow: var(--dropping-shadow);
    }

    div > span.center {
      flex-grow: 1;
      padding: var(--padding);
      display: grid;
      grid-template-columns: repeat(auto-fit, calc(var(--viewer-width) * var(--icon-ratio)));
      grid-auto-rows: calc(var(--viewer-height) * var(--icon-ratio));
      gap: var(--spacing);
      overflow-y: auto;
    }

    div > span.center > *:hover,
    div > span.center > *.selected {
      border-color: var(--item-fore-selected);
      color: var(--item-fore-selected);
      background-color: var(--item-back-selected);
    }

    div > span.center > *.selected:hover {
      border-color: var(--item-fore-hover);
      color: var(--item-fore-hover);
      background-color: var(--item-back-hover);
    }
  `]
}


