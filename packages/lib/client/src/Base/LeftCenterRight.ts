import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component.js'
import { Slotted } from './Slotted.js'

const LeftSlot = 'left'
const RightSlot = 'right'
const CenterSlot = 'center'

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

  static cssHeaderFooter = css`
    header, footer {
      padding: 0;
      display: flex; 
      flex-grow: 1; 
      background-color: var(--section-back);
      color: var(--section-fore);
      gap: var(--section-spacing);
      line-height: var(--icon-size);
      font-size: var(--icon-size);
    }
    .center, .left, .right {
      white-space: nowrap;
      gap: var(--section-spacing);
      padding: var(--section-padding);
    }
    .center > *, .left > *, .right > * {
      margin-block: auto;
    }
    .center {
      justify-content: right;
    }
  
  `
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
    LeftCenterRight.cssHeaderFooter,
  ]
}

export class Header extends LeftCenterRight {
  icon = ''
  protected override leftContent(slots: Htmls): OptionalContent {
    const slotsCopy = [...slots]
    const { icon } = this
    if (icon) {
      this.importTags('movie-masher-component-icon')
      slotsCopy.push(
        html`<movie-masher-component-icon 
          part='icon' icon='${icon}'
        ></movie-masher-component-icon>`
      )
    }
    return super.leftContent(slotsCopy)
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

export class Footer extends LeftCenterRight {
  protected override content(contents: Contents): Content {
    return html`<footer 
      @export-parts='${this.handleExportParts}'
    >${contents}</footer>`
  }
}


export class Div extends LeftCenterRight {
  static cssDivHostBackground = css`
    :host {
      background-color: var(--div-back);
      color: var(--div-fore);
    }
  `
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Div.cssDivHostBackground,
    Component.cssHostFlex,
    LeftCenterRight.cssShared,
    css`
      .left {
        border-right-width: var(--border-size);
        border-right-color: var(--section-back);
        border-right-style: solid;
        align-items: flex-start;
        flex-direction: var(--flex-direction);
      }
    
      .right {
        border-left-width: var(--border-size);
        border-left-color: var(--section-back);
        border-left-style: solid;
      }
    ` 
  ]
}
