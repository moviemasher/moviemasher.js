import type { Htmls, SlottedContent } from '../declarations.js'
import type { ClientReadParams } from '@moviemasher/client-core'

import { css } from 'lit'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { eventOptions } from 'lit/decorators/event-options.js'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { provide } from '@lit-labs/context'

import { Section } from '../Base/Section.js'
import { clientReadParamsContext } from '../Context/clientReadParamsContext.js'

@customElement('moviemasher-selector-section')
export class SelectorSectionElement extends Section {

  @provide({ context: clientReadParamsContext })
  @property()
  clientReadParams: ClientReadParams = { type: 'video' }
  
  override divContent(slots: Htmls): SlottedContent {
    this.importTags('moviemasher-selector-div')
    return html`<moviemasher-selector-div
      exportparts='${ifDefined(this.exportsForSlot('div'))}'
      part='div' slotted='div'
    >${slots}</moviemasher-selector-div>`
  }
    
  override footerContent(slots: Htmls): SlottedContent {
    this.importTags('moviemasher-selector-footer')
    return html`<moviemasher-selector-footer
      exportparts='${ifDefined(this.exportsForSlot('footer'))}'
      part='footer' slotted='footer'
    >${slots}</moviemasher-selector-footer>`
  }

  override headerContent(slots: Htmls): SlottedContent {
    this.importTags('moviemasher-selector-header')
    return html`<moviemasher-selector-header
      icon='${this.icon}'
      exportparts='${ifDefined(this.exportsForSlot('header'))}'
      part='header' slotted='header'
    >${slots}</moviemasher-selector-header>`
  }

  @eventOptions({ capture: true })
  protected override onSection(event: CustomEvent<string>) {
    event.stopPropagation()
    const { detail } = event
    switch (detail) {
      case 'audio':
      case 'video':
      case 'font':
      case 'image': {
        // console.debug(this.constructor.name, 'onSection', detail)
        this.clientReadParams = { ...this.clientReadParams, type: detail }
        break
      }
      default: {

        break
      }
    }
  }

  static override styles = [...Section.styles, css`
  
    /* media.css */
    :host {
      grid-area: media;
    }

    .panel.media footer label {
      text-align: right;
      flex-grow: 1;
    }
    .media label > svg:hover {
      color: var(--control-fore-hover);
    }

  `]
  
}
