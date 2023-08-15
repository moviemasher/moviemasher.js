import type { DataType, PropertyId } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { ClassRow } from '@moviemasher/runtime-client'
import { DotChar, End } from '@moviemasher/runtime-shared'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { ControlInputElement } from './control-input.js'

export class ControlRowElement extends ImporterComponent {
  protected override content(contents: Contents): Content {
    return html`
      <div class='${ClassRow}'>${contents}</div>
    `
  }

  dataType?: DataType

  private get icon(): DataType | undefined {
    const { propertyId } = this
    if (!propertyId) return
    const name = propertyId.split(DotChar).pop() 
    if (!name) return

    if (name.endsWith(End)) return name.slice(0, -End.length)
    
    if (name.endsWith('Id')) return name.slice(0, -2)

    return name
  }

  protected override get defaultContent(): OptionalContent {
    const { icon, propertyId, dataType } = this
    if (!(icon && propertyId)) return

    this.importTags('movie-masher-component-icon')
    this.importTags('movie-masher-control-input')
    return html`
      <movie-masher-component-icon icon='${icon}'></movie-masher-component-icon>
      <movie-masher-control-input
        data-type='${ifDefined(dataType)}' property-id='${propertyId}'
      ></movie-masher-control-input>
    `
  }

  propertyId?: PropertyId

  static override properties: PropertyDeclarations = {
    propertyId: { type: String, attribute: 'property-id' },
    ...ControlInputElement.dataTypeDeclaration,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        display: flex;
        /* height: min-content; */
        line-height: var(--icon-size);
        font-size: var(--icon-size);
        margin-bottom: var(--spacing);
      }
      div.row {
        flex-grow: 1;
        display: grid;
        gap: var(--inspector-spacing);
        grid-template-columns: min-content 1fr;
      }
    `,
  ]
}

// register web component as custom element
customElements.define('movie-masher-control-row', ControlRowElement)
