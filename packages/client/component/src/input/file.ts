

import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { LitElement } from 'lit-element/lit-element.js'

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


