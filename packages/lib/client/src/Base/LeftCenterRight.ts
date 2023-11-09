import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component.js'
import { Slotted } from './Slotted.js'

export const LeftSlot = 'left'
export const RightSlot = 'right'
export const CenterSlot = 'center'

export class LeftCenterRight extends Slotted {
  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    switch (part) {
      case LeftSlot: return this.leftContent(slots)
      case RightSlot: return this.rightContent(slots)
      case CenterSlot: return this.centerContent(slots)
    }
    return super.partContent(part, slots)
  }

  protected centerContent(htmls: Htmls): OptionalContent { 
    return html`<span part='${CenterSlot}' class='${CenterSlot}'>${htmls}</span>` 
  }

  protected leftContent(htmls: Htmls): OptionalContent { 
    if (!htmls.length) return

    return html`<span part='${LeftSlot}' class='${LeftSlot}'>${htmls}</span>` 
  }
  
  protected rightContent(htmls: Htmls): OptionalContent { 
    if (!htmls.length) return
    
    return html`<span part='${RightSlot}' class='${RightSlot}'>${htmls}</span>` 
  }
  
  override parts = [LeftSlot, CenterSlot, RightSlot].join(Slotted.partSeparator)

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
        line-height: var(--height-control);
        font-size: var(--height-control);
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

export class HeaderElement extends LeftCenterRight {
  icon = ''
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { icon } = this
    if (icon) {
      this.importTags('movie-masher-component-icon')
      htmls.push(
        html`<movie-masher-component-icon 
          part='icon' icon='${icon}'
        ></movie-masher-component-icon>`
      )
    }
    return super.leftContent(htmls)
  }

  protected override content(contents: Contents): Content {
    return html`<header 
      @export-parts='${this.handleExportParts}'
    >${contents}</header>`
  }

  static override properties: PropertyDeclarations = {
    ...LeftCenterRight.properties,
    icon: { type: String }
  }
}

export class FooterElement extends LeftCenterRight {
  protected override content(contents: Contents): Content {
    return html`<footer 
      @export-parts='${this.handleExportParts}'
    >${contents}</footer>`
  }
}


export class ContentElement extends LeftCenterRight {
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
