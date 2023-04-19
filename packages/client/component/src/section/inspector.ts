import type { Htmls, SlottedContent } from '../declarations.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import { css } from 'lit'
import { html } from 'lit'
import { Section } from '../Base/Section.js'

@customElement('moviemasher-inspector-section')
export class InspectorSectionElement extends Section {
  
  override divContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-inspector-div')
    return html`<moviemasher-inspector-div
      exportparts='${ifDefined(this.exportsForSlot('div'))}'
      part='div' slotted='div'
    >${htmls}</moviemasher-inspector-div>`
  }
    
  override footerContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-inspector-footer')
    return html`<moviemasher-inspector-footer
      exportparts='${ifDefined(this.exportsForSlot('footer'))}'
      part='footer' slotted='footer'
    >${htmls}</moviemasher-inspector-footer>`
  }

  override headerContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-inspector-header')
    return html`<moviemasher-inspector-header
      exportparts='${ifDefined(this.exportsForSlot('header'))}'
      part='header' slotted='header'
      icon='${this.icon}' 
    >${htmls}</moviemasher-inspector-header>`
  }

  static override styles = [...Section.styles, css`
  
    /* inspect.css */


    :host {
      grid-area: inspect;

    }

    .panel.inspect .content fieldset {
      width: 100%;
      max-width: 100%;
      line-height: var(--icon-size);
      font-size: var(--icon-size);
      padding: var(--spacing);
      background-color: initial;
    }


    .panel.inspect .content .start-end {
      display: flex;
      float: right;
    }
    .panel.inspect .content fieldset > legend {
      width: 100%;
    }
    .panel.inspect .content fieldset > legend > div {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 1fr min-content;
      width: 100%;
    }

    .panel.inspect .content fieldset > div {
      display: flex;
      gap: var(--spacing);
      grid-auto-flow: column;
    }

    .panel.inspect .content fieldset > div > input {
      min-width: 50px;
      width: 100%;
    }

    .panel.inspect .content {
      overflow-y: auto;
      padding: var(--padding);
    }

    .panel.inspect .content>* {
      margin-bottom: var(--spacing);
    }
    .panel.inspect .content > .row {
      display: grid;
      gap: var(--spacing);
      grid-template-columns: var(--icon-size) 1fr;
    }


    .panel.inspect .content > .row > *:first-child {
      line-height: var(--icon-size);
      font-size: var(--icon-size);
    }

    .panel.inspect .content > .row .icons {
      display: grid;
      grid-template-rows: 1fr auto;
      gap: var(--spacing);
    }

    .panel.inspect .content > .row input {
      min-width: 20px;
    }

    .panel.inspect .content > .row.tween {
      grid-template-columns: var(--icon-size) minmax(50px, 1fr) min-content;
    }

    .panel.inspect .content > div > label,
    .panel.inspect .content > div > button {
      margin-right: var(--spacing);
    }

    .panel.inspect .row .list {
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

    .panel.inspect .row .list .movable {
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

    .panel.inspect .row .list .selected {
      color: var(--item-fore-selected);
      border-color: var(--item-fore-selected);
      background-color: var(--item-back-selected);
    }

    .panel.inspect .row .list .movable:hover,
    .panel.inspect .row .list .selected:hover {
      color: var(--item-fore-hover);
      border-color: var(--item-fore-hover);
      background-color: var(--item-back-hover);
    }


    .panel.inspect .drop-container {
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


    .panel.inspect .dropping {
      box-shadow: var(--dropping-shadow);
    } 


    .panel.inspect .row .list {
      --padding: 5px;
      --spacing: 2px;  
    }

    .panel.inspect .content > .row .icons {
      --spacing: 2px;
    }

  `]
}
