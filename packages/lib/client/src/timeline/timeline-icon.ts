import type { ClipLocation } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Contents, DropTarget, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'

export const TimelineIconName = 'movie-masher-timeline-icon'
const WithDropTargetMixin = DropTargetMixin(ImporterComponent)
export class TimelineIconElement extends WithDropTargetMixin implements DropTarget {
  protected override get defaultContent(): OptionalContent { 
    const { dense } = this
 
    const contents: Contents = []

    this.importTags('movie-masher-timeline-icon')
    const icon = dense ? 'trackDense' : 'track'

    contents.push(html`
      <movie-masher-component-icon icon='${icon}'></movie-masher-component-icon>
    `)
    
    return html`${contents}`
  }

  dense = false

  override mashIndex(_event: DragEvent): ClipLocation | undefined {
    return { track: this.trackIndex, index: 0, frame: 0 }
  }

  trackIndex = -1

  static override properties: PropertyDeclarations = { 
    // ...Component.properties,
    dense: { type: Boolean },
    trackIndex: { type: Number, attribute: 'track-index' },
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        --height: var(--height-control);

        cursor: grab;
        border-block: var(--border);
        background-color: var(--back);
        color: var(--fore);
        display: flex;
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        z-index: 3;
        height: var(--height-track);
        font-size: var(--height);
        line-height: var(--height);
      }

      :host(.dropping) {
        box-shadow: var(--dropping-shadow);
      }

      :host > * {
        margin: auto;
      }

    `
  ]
  
}

// register web component as custom element
customElements.define(TimelineIconName, TimelineIconElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineIconName]: TimelineIconElement
  }
}
