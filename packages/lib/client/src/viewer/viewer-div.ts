import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { Div } from '../Base/LeftCenterRight.js'

export class ViewerDivElement extends Div {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-viewer-content')
    htmls.push(html`<movie-masher-viewer-content
      part='center' class='center'
    ></movie-masher-viewer-content>`)
    return html`${htmls}`
  }

  static override styles: CSSResultGroup = [
    Div.styles,
    css`
      .center {
        padding: 0;
      }
    `
  ]

}

// register web component as custom element
customElements.define('movie-masher-viewer-div', ViewerDivElement)