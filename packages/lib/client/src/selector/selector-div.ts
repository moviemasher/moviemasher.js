import type { CSSResultGroup } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { Div, LeftCenterRight } from '../Base/LeftCenterRight.js'
import { Component } from '../Base/Component.js'

export class SelectorDivElement extends Div {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-selector-content')
    htmls.push(html`<movie-masher-selector-content></movie-masher-selector-content>`) 
    return html`${htmls}`
  }

  protected override content(contents: Contents): Content { 
    return html`<div>${contents}</div>` 
  }
 
  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    LeftCenterRight.cssDiv,
    LeftCenterRight.cssDivLeft,
    LeftCenterRight.cssDivRight,
  ]
}

// register web component as custom element
customElements.define('movie-masher-selector-div', SelectorDivElement)