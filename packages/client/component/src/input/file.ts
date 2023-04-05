

import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { LitElement } from 'lit-element'

@customElement('moviemasher-form')
export class FileInputlement extends LitElement  {

  static override styles = css`
    :host {
      display: block;
      user-select: none;
      -webkit-user-select: none;
      input[type=file] {
        visibility: hidden;
        vertical-align: bottom;
        width: 0px;
      }
    }
  `


}


