import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { TemplateContent, TemplateContents } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { ComponentClicker } from '../base/Component.js'

export const ButtonTag = 'movie-masher-button'

/**
 * @category Elements
 */
export class ButtonElement extends ComponentClicker {
  protected override templateContent(contents: TemplateContents): TemplateContent {
    const title = this.string || this.icon 
    return html`<button 
      title='${title}'
      ?disabled='${this.disabled}' 
      @export-parts='${this.handleExportParts}'
      @click='${this.handleClick}'
    >${contents}</button>`
  }

  protected disabled = false

  static override properties: PropertyDeclarations = {
    ...ComponentClicker.properties,
    disabled: { type: Boolean },
  }
    
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --pad: var(--pad-control);
        --height: var(--height-control);
        --height-text: calc(var(--height) - ((2 * var(--pad)) + (2 * var(--size-border))));
        --gap: var(--gap-control);
        --cursor: pointer;
        display: inline-block;
      }

      button {
        color: var(--fore);
        border-color: var(--fore);
        background-color: var(--back);
        cursor: var(--cursor);
        display: inline-flex;
        gap: var(--gap);
        padding: var(--pad);
        height: var(--height);
        min-width: var(--height);
        transition: 
          background-color var(--color-transition),
          border-color var(--color-transition),
          color var(--color-transition);
  
        align-items: center;
        /* appearance: none; */
        border-radius: var(--radius-border);
        border: var(--border);
        font-size: var(--height-text);
        line-height: var(--height-text);
        font-weight: 500;
        /* outline: none; */
      }

      button:hover {
        color: var(--over);
        border-color: var(--over);
      }

      button:disabled {
        color: var(--off);
        border-color: var(--off);
        cursor: default;
      }

      progress {
        accent-color: var(--over);
      }
     
    `
  ]
}

customElements.define(ButtonTag, ButtonElement)

declare global {
  interface HTMLElementTagNameMap {
    [ButtonTag]: ButtonElement
  }
}

