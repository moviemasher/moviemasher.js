import type { Contents, Content } from './declarations.js'


import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'

import { IconString } from './Base/IconString.js'


@customElement('moviemasher-button')
export class ButtonElement extends IconString {
  override slottedContent(contents: Contents): Content {
    return html`<button 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
      @click='${this.onClicked}'
    >${contents}</button>`
  }
  static override styles = [css`
    :host {
      display: inline-block;
      --padding: var(--control-padding);
      --spacing: var(--control-spacing);
      --cursor: pointer;
      --fore: var(--control-fore);
      --fore-selected: var(--control-fore-selected);
      --fore-disabled: var(--control-fore-disabled);
      --fore-hover: var(--control-fore-hover);

      --back: var(--control-back);
      --back-selected: var(--control-back-selected);
      --back-disabled: var(--control-back-disabled);
      --back-hover: var(--control-back-hover);
    }
    :hover {
      --fore: var(--fore-hover);
      --back: var(--back-hover);
    }

    :host(.disabled), :host(.disabled):hover,
    button:disabled, button:disabled:hover {
      --cursor: default;
      --fore: var(--fore-disabled);
      --back: var(--back-disabled);
    }
    
    :host(.selected){
      --fore: var(--fore-selected);
      --back: var(--back-selected);
    }

    button {
      display: inline-flex;
      gap: var(--spacing);
      padding: var(--padding);
      align-items: center;
      min-width: var(--button-size);
      font-size: calc(var(--button-size) - 2 * var(--spacing));
      line-height: calc(var(--button-size) - 2 * var(--spacing));
      height: var(--button-size);
      cursor: var(--cursor);
      appearance: none;
      outline: none;
      font-weight: 500;

      border: var(--border);
      border-radius: var(--border-radius);
      border-color: var(--fore);

      color: var(--fore);
      background-color: var(--back);
      transition: var(--button-transition);
    }

  `]
}
