import type { Contents, Content } from './declarations.js'

import { css } from 'lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { IconString } from './Base/IconString.js'

@customElement('movie-masher-a')
export class AElement extends IconString {
  static override styles = [css`
    :host {
      --cursor: pointer;
      --fore: var(--control-fore);
      --fore-selected: var(--control-fore-selected);
      --fore-disabled: var(--control-fore-disabled);
      --fore-hover: var(--control-fore-hover);

      --size: var(--button-size);
      display: inline-block;
      height: var(--size);
    }
    :hover {
      --fore: var(--fore-hover);
    }
    :host(.selected){
      --fore: var(--fore-selected);
    }
     :host(.disabled), :host(.disabled):hover {
      --cursor: default;
      --fore: var(--fore-disabled);
    }
    a {
      cursor: var(--cursor);
      color: var(--fore);
      font-size: var(--size);
      line-height: var(--size);
      transition: var(--transition);
    }
  `]
  
  protected override content(contents: Contents): Content {
    return html`<a 
      @click='${this.clickHandler}'
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
    >${contents}</a>`
  }
}
