// import type { ClientReadParams } from '@moviemasher/client-core'
// import { consume } from '@lit-labs/context'

import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { Div } from '../Base/LeftCenterRight.js'
// import { selectorContext } from '../Context/selector.js'


@customElement('moviemasher-selector-div')
export class SelectorDivElement extends Div {
  // @consume({context: selectorContext, subscribe: true })
  // context?: ClientReadParams

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
