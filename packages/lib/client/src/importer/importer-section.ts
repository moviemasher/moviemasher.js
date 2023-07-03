import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Section } from '../Base/Section.js'

export class InspectorSectionElement extends Section {
  
  override divContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-div')
    return html`<movie-masher-importer-div
      part='div' slotted='div'
    >${htmls}</movie-masher-importer-div>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-footer')
    return html`<movie-masher-importer-footer
      part='footer' slotted='footer'
    >${htmls}</movie-masher-importer-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-header')
    return html`<movie-masher-importer-header
      part='header' slotted='header'
      icon='add' 
    >${htmls}</movie-masher-importer-header>`
  }

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
  

    :host {
      /* grid-area: importer; */

    }

    .panel.importer .content fieldset {
      width: 100%;
      max-width: 100%;
      line-height: var(--icon-size);
      font-size: var(--icon-size);
      padding: var(--spacing);
      background-color: initial;
    }


    .panel.importer .content .start-end {
      display: flex;
      float: right;
    }
    .panel.importer .content fieldset > legend {
      width: 100%;
    }
    .panel.importer .content fieldset > legend > div {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 1fr min-content;
      width: 100%;
    }

    .panel.importer .content fieldset > div {
      display: flex;
      gap: var(--spacing);
      grid-auto-flow: column;
    }

    .panel.importer .content fieldset > div > input {
      min-width: 50px;
      width: 100%;
    }

    .panel.importer .content {
      overflow-y: auto;
      padding: var(--padding);
    }

    .panel.importer .content>* {
      margin-bottom: var(--spacing);
    }
    .panel.importer .content > .row {
      display: grid;
      gap: var(--spacing);
      grid-template-columns: var(--icon-size) 1fr;
    }


    .panel.importer .content > .row > *:first-child {
      line-height: var(--icon-size);
      font-size: var(--icon-size);
    }

    .panel.importer .content > .row .icons {
      display: grid;
      grid-template-rows: 1fr auto;
      gap: var(--spacing);
    }

    .panel.importer .content > .row input {
      min-width: 20px;
    }

    .panel.importer .content > .row.tween {
      grid-template-columns: var(--icon-size) minmax(50px, 1fr) min-content;
    }

    .panel.importer .content > div > label,
    .panel.importer .content > div > button {
      margin-right: var(--spacing);
    }

    .panel.importer .row .list {
      width: 100%;
      height: calc((4 * var(--icon-size)) + (5 * var(--spacing)));
      border: var(--border);
      border-radius: var(--border-radius);
      padding: var(--padding);
      color: var(--div-fore);
      border-color: var(--div-fore);
      background-color: var(--div-back);
      overflow-y: scroll;
    }

    .panel.importer .row .list .movable {
      display: grid;
      grid-template-columns: min-content 1fr;
      width: 100%;
      gap: var(--spacing);
      border: var(--border);
      border-radius: var(--border-radius);
      margin-bottom: var(--padding);
      padding: var(--spacing);
      color: var(--control-fore);
      border-color: var(--control-fore);
      background-color: var(--control-back);
    }

    .panel.importer .row .list .selected {
      color: var(--item-fore-selected);
      border-color: var(--item-fore-selected);
      background-color: var(--item-back-selected);
    }

    .panel.importer .row .list .movable:hover,
    .panel.importer .row .list .selected:hover {
      color: var(--item-fore-hover);
      border-color: var(--item-fore-hover);
      background-color: var(--item-back-hover);
    }


    .panel.importer .drop-container {
      display: grid;
      aspect-ratio: var(--viewer-aspect-ratio);
      border: var(--border);
      border-radius: var(--border-radius);
      padding: var(--spacing);
      color: var(--div-fore);
      border-color: var(--div-fore);
      background-color: var(--div-back);
      height: calc((2 * var(--spacing)) + var(--viewer-height) * var(--icon-ratio));
    }


    .panel.importer .dropping {
      box-shadow: var(--dropping-shadow);
    } 


    .panel.importer .row .list {
      --padding: 5px;
      --spacing: 2px;  
    }

    .panel.importer .content > .row .icons {
      --spacing: 2px;
    }

  `]
}

// register web component as custom element
customElements.define('movie-masher-importer-section', InspectorSectionElement)
