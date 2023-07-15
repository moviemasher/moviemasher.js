import type { CSSResultGroup } from 'lit'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { Div } from '../Base/LeftCenterRight.js'
import { Htmls, OptionalContent } from '../declarations.js'


export class ComposerDivElement extends Div {
  protected override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.importTags('movie-masher-composer-content')
    htmls.push(html`<movie-masher-composer-content></movie-masher-composer-content>`)
    return html`${htmls}`
  }

  // protected override content(contents: Contents): Content { 
  //   return html`<div>${contents}</div>` 
  // }
  
  static override styles: CSSResultGroup = [
    Div.styles,
    css`
     
    `
  ]
}


// register web component as custom element
customElements.define('movie-masher-composer-div', ComposerDivElement)