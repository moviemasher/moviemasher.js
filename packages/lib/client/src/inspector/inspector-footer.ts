import type { PropertyDeclarations } from '@lit/reactive-element'
import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { Footer } from '../Base/LeftCenterRight.js'

export class InspectorFooterElement extends Footer {
  
  protected override leftContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-chooser')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-inspector-chooser
        
      ></movie-masher-inspector-chooser>
    `)
    return super.leftContent(htmls)
  }

  static override properties: PropertyDeclarations = {
    ...Footer.properties,
  }
  
}

// register web component as custom element
customElements.define('movie-masher-inspector-footer', InspectorFooterElement)