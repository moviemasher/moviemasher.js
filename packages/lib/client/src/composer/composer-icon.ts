import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit'
import type { MashIndex } from '@moviemasher/runtime-client'
import type { Contents, DropTarget, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { DropTargetMixin } from '../Base/DropTargetMixin.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'

const WithDropTargetMixin = DropTargetMixin(ImporterComponent)
export class ComposerIconElement extends WithDropTargetMixin implements DropTarget {
  protected override get defaultContent(): OptionalContent { 
    const { dense } = this
 
    const contents: Contents = []

    this.importTags('movie-masher-composer-icon')
    const icon = dense ? 'trackDense' : 'track'

    contents.push(html`
      <movie-masher-component-icon icon='${icon}'></movie-masher-icon>
    `)
    
    return html`${contents}`
  }

  dense = false

  override mashIndex(_event: DragEvent): MashIndex {
    return { track: this.trackIndex, clip: 0 }
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
        cursor: grab;
        border-block: var(--border);
        background-color: var(--section-back);
        color: var(--section-fore);
        display: flex;
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        z-index: 3;
        height: var(--track-height);
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
customElements.define('movie-masher-composer-icon', ComposerIconElement)
