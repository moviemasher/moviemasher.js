import type { DataType, PropertyId } from '@moviemasher/shared-lib/types.js';
import type { CSSResultGroup, PropertyDeclarations } from 'lit-element/lit-element.js';
import type { TemplateContent, TemplateContents, OptionalContent } from '../client-types.js';
import { css } from '@lit/reactive-element/css-tag.js';
import { ROW } from '../runtime.js';
import { DOT, $END } from '@moviemasher/shared-lib/runtime.js';
import { html, nothing } from 'lit-html';
import { Component, ComponentLoader } from '../base/Component.js';
import { ControlInputElement } from './control-input.js';




export const ControlRowTag = 'movie-masher-control-row';
/**
 * @category Elements
 */
export class ControlRowElement extends ComponentLoader {
  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`
      <div class='${ROW}'>${contents}</div>
    `;
  }

  dataType?: DataType;

  private get icon(): DataType | undefined {
    const { propertyId } = this;
    if (!propertyId) return;
    const name = propertyId.split(DOT).pop();
    if (!name) return;

    if (name.endsWith($END)) return name.slice(0, -$END.length);

    if (name.endsWith('Id')) return name.slice(0, -2);

    return name;
  }

  protected override get defaultContent(): OptionalContent {
    const { icon, propertyId, dataType } = this;
    if (!(icon && propertyId)) return;

    this.loadComponent('movie-masher-icon');
    return html`
      <movie-masher-icon icon='${icon}'></movie-masher-icon>
      <movie-masher-control-input
        data-type='${dataType || nothing}' property-id='${propertyId}'
      ></movie-masher-control-input>
    `;
  }

  propertyId?: PropertyId;

  static override properties: PropertyDeclarations = {
    propertyId: { type: String, attribute: 'property-id' },
    ...ControlInputElement.dataTypeDeclaration,
  };

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        display: flex;
        /* height: min-content; */
        line-height: var(--height-control);
        font-size: var(--height-control);
        margin-bottom: var(--spacing);
      }
      div.row {
        flex-grow: 1;
        display: grid;
        gap: var(--gap-control);
        grid-template-columns: min-content 1fr;
      }
    `,
  ];
}
customElements.define(ControlRowTag, ControlRowElement);
