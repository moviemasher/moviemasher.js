import type { Htmls, OptionalContent } from '../Types.js'

import { html } from 'lit-html'
import { HeaderBase } from '../base/LeftCenterRight.js'

const InspectorHeaderTag = 'movie-masher-inspector-header'
/**
 * @category Component
 */
export class InspectorHeaderElement extends HeaderBase {

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-inspector-picker')
    htmls.push(html`
      <movie-masher-inspector-picker
      ></movie-masher-inspector-picker>
    `)
    return super.leftContent(htmls)
  }
}

customElements.define(InspectorHeaderTag, InspectorHeaderElement)