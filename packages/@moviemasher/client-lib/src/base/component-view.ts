import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { TemplateContent, TemplateContents, Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventScrollRoot } from '../utility/events.js'
import { html } from 'lit-html'
import { Component, ComponentLoader, ComponentSlotter } from './component.js'

const LeftSlot = 'left'
const RightSlot = 'right'
export const CENTER = 'center'

export class LeftCenterRight extends ComponentSlotter {
  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    switch (part) {
      case LeftSlot: return this.leftContent(slots)
      case RightSlot: return this.rightContent(slots)
      case CENTER: return this.centerContent(slots)
    }
    return super.partContent(part, slots)
  }

  protected centerContent(htmls: Htmls): OptionalContent { 
    return html`<span 
      part='${CENTER}' 
      class='${CENTER}'
    >${htmls}</span>` 
  }

  protected leftContent(htmls: Htmls): OptionalContent { 
    if (!htmls.length) return

    return html`<span part='${LeftSlot}' class='${LeftSlot}'>${htmls}</span>` 
  }
  
  protected rightContent(htmls: Htmls): OptionalContent { 
    if (!htmls.length) return
    
    return html`<span part='${RightSlot}' class='${RightSlot}'>${htmls}</span>` 
  }
  
  override parts = [LeftSlot, CENTER, RightSlot].join(ComponentSlotter.partSeparator)

  static cssShared = css`
    :host {
      --flex-direction: column;
    }
    .center, .left, .right {
      display: flex;
    }
    .center {
      flex-grow: 1;
    }
    .left, .right {
      flex-grow: 0;
    }
  `

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    LeftCenterRight.cssShared,
    css`
      header, footer {
        --fore: var(--fore-chrome);
        --back: var(--back-chrome);
        --over: var(--over-chrome);
        --on: var(--on-chrome);
        --off: var(--off-chrome);
        --pad: var(--pad-chrome);
        --gap: var(--gap-chrome);

        background-color: var(--back);
        color: var(--fore);
        
        padding: 0;
        display: flex; 
        flex-grow: 1; 
        gap: var(--gap);
      }
      .center, .left, .right {
        white-space: nowrap;
        gap: var(--gap);
        padding: var(--pad);
      }
      .center > *, .left > *, .right > * {
        margin-block: auto;
      }
      .center {
        justify-content: right;
      }
    `,
  ]
}

export class HeaderBase extends LeftCenterRight {

  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`<header 
      @export-parts='${this.handleExportParts}'
    >${contents}</header>`
  }

  static override properties: PropertyDeclarations = {
    ...LeftCenterRight.properties,
  }
}

export class FooterBase extends LeftCenterRight {
  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`<footer 
      @export-parts='${this.handleExportParts}'
    >${contents}</footer>`
  }
}

export class ContentBase extends LeftCenterRight {
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    LeftCenterRight.cssShared,
    css`
      :host {
        --fore: var(--fore-content);
        --back: var(--back-content);
        --over: var(--over-content);
        --on: var(--on-content);
        --off: var(--off-content);
        --pad: var(--pad-content);

        background-color: var(--back);
        color: var(--fore);
      }
      .left, .right {
        padding: var(--pad);
      }

      .left {
        border-right-width: var(--size-border);
        border-right-color: var(--back-chrome);
        border-right-style: solid;
        align-items: flex-start;
        flex-direction: var(--flex-direction, row);
      }
      .right {
        border-left-width: var(--size-border);
        border-left-color: var(--back-chrome);
        border-left-style: solid;
      }
    ` 
  ]
}

export class Scroller extends ComponentLoader {
  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`<div 
      class='root'
      @scroll-root='${this.handleScrollRoot}'
    >${contents}</div>`
  }

  protected handleScrollRoot(event: EventScrollRoot): void {
    event.detail.root = this.element('div.root')
    event.stopImmediatePropagation()
  }

  static cssDivRoot = css`
    div.root {
      padding: 0px;
      flex-grow: 1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `;
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    Scroller.cssDivRoot,
    css`
      :host {
        position: relative;
      }
      
    `
  ];
}
export const HEADER = 'header'
export const FOOTER = 'footer'
export const CONTENTS = 'contents'

export class Section extends ComponentSlotter {
  protected override partContent(part: string, slots: Htmls): OptionalContent {
    switch (part) {
      case CONTENTS: return this.contentContent(slots)
      case FOOTER: return this.footerContent(slots)
      case HEADER: return this.headerContent(slots)
    }
    return super.partContent(part, slots)
  }

  contentContent(_htmls: Htmls): OptionalContent {}

  footerContent(_htmls: Htmls): OptionalContent {}

  headerContent(_htmls: Htmls): OptionalContent {}

  override parts = [HEADER, CONTENTS, FOOTER].join(ComponentSlotter.partSeparator);

  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`<section
      @export-parts='${this.handleExportParts}'
    >${contents}</section>`
  }

  static styleHost = css`
    :host {
      flex-grow: 1;
      display: flex;
    }
  `;

  static styleSection = css`
    section {
      flex-grow: 1;
      overflow: hidden;
      display: grid;
      grid-template-rows: var(--height-header) 1fr var(--height-footer);
      grid-template-columns: 1fr;
      border: var(--border);
      border-color: var(--back-chrome);
      border-radius: var(--radius-border);
    }
  `;

  static override properties: PropertyDeclarations = {
    ...ComponentSlotter.properties,
  };

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    this.styleHost,
    this.styleSection,
  ];
}

