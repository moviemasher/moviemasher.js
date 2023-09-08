import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Div } from '../Base/LeftCenterRight.js'
import { Scroller } from '../Base/Scroller.js'

export const TimelineDivName = 'movie-masher-timeline-div'

export class TimelineDivElement extends Div {
  protected override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.importTags('movie-masher-timeline-content')
    htmls.push(html`
      <movie-masher-timeline-content></movie-masher-timeline-content>
    `)
    return html`${htmls}`
  }
  
  static override styles: CSSResultGroup = [
    Div.styles,
    Scroller.cssDivRoot,
    css`
     .right {
        width: var(--inspector-width);
        position: relative;
      }
      div.root {
        display: flex;
        overflow-y: auto;
      }
      movie-masher-inspector-target {
        padding: var(--inspector-padding);
      }
    `
  ]
}

// register web component as custom element
customElements.define(TimelineDivName, TimelineDivElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineDivName]: TimelineDivElement
  }
}
