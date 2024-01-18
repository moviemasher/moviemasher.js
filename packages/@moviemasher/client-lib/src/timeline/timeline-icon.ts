import type { ClipLocation } from '../types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { DropTarget } from '../types.js'
import type { TemplateContents, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { DropTargetMixin } from '../mixin/component.js'
import { ComponentLoader } from '../base/Component.js'

export const TimelineIconTag = 'movie-masher-timeline-icon'
const WithDropTargetMixin = DropTargetMixin(ComponentLoader)
/**
 * @category Elements
 */
export class TimelineIconElement extends WithDropTargetMixin implements DropTarget {
  protected override get defaultContent(): OptionalContent { 
    const { dense } = this
 
    const contents: TemplateContents = []

    this.loadComponent('movie-masher-timeline-icon')
    const icon = dense ? 'trackDense' : 'track'

    contents.push(html`
      <movie-masher-icon icon='${icon}'></movie-masher-icon>
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

customElements.define(TimelineIconTag, TimelineIconElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineIconTag]: TimelineIconElement
  }
}
