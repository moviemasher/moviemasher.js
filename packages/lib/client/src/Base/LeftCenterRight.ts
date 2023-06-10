import type { 
  Content, Contents, Htmls, OptionalContent, LeftSlot, RightSlot, CenterSlot
} from '../declarations.js'

import { css } from 'lit'
import { html } from 'lit'
import { property } from 'lit/decorators/property.js'

import { Slotted } from './Slotted.js'
import { Component } from './Component.js'

const LeftSlot: LeftSlot = 'left'
const RightSlot: RightSlot = 'right'
const CenterSlot: CenterSlot = 'center'

export class LeftCenterRight extends Slotted {
  protected override defaultSlottedContent(key: string, htmls: Htmls): OptionalContent { 
    switch (key) {
      case LeftSlot: return this.leftContent(htmls)
      case RightSlot: return this.rightContent(htmls)
      case CenterSlot: return this.centerContent(htmls)
    }
  }

  protected centerContent(htmls: Htmls): OptionalContent { 
    this.importTags('movie-masher-span')
    return html`<movie-masher-span 
      part='${CenterSlot}' slotted='${CenterSlot}' class='${CenterSlot}'
    >${htmls}</movie-masher-span>` 
  }

  protected leftContent(htmls: Htmls): OptionalContent { 
    this.importTags('movie-masher-span')
    return html`<movie-masher-span
      part='${LeftSlot}' slotted='${LeftSlot}' class='${LeftSlot}'
    >${htmls}</movie-masher-span>` 
  }
  
  protected rightContent(htmls: Htmls): OptionalContent { 
    this.importTags('movie-masher-span')
    return html`<movie-masher-span 
      part='${RightSlot}' slotted='${RightSlot}' class='${RightSlot}'
    >${htmls}</movie-masher-span>` 
  }
  
  override slots = [LeftSlot, CenterSlot, RightSlot]

  static cssHostOverflowY = css`
  :host {
    display: flex;
    overflow-y: auto;
  }
`

  static cssHostSection = css`
   :host {
      --padding: var(--section-padding);
      --spacing: var(--section-spacing);
      --back: var(--section-back);
      --fore: var(--section-fore);
    }
  `
  static cssSection = css`
    header, footer, div {
      padding: 0;
      flex-grow: 1;
      display: grid;
      grid-template-columns: min-content 1fr min-content;
    }


    header, footer {
      gap: var(--spacing);
      background-color: var(--back);
      color: var(--fore);
      line-height: var(--icon-size);
      font-size: var(--icon-size);
      /* border: 1px solid yellow; */
    }
    .right {
      text-align: right;
      background-color: pink;
    }

    header > .left,
    footer > .left,
    div > .left {
      background-color: yellow;
      display: flex;
    }
 
  `
  static override styles = [
    Component.cssHostFlex,
    Component.cssDivFlex,
    this.cssHostSection,
    this.cssSection,
  ]
}

export class Header extends LeftCenterRight {
  @property() icon = ''
  override leftContent(slots: Htmls): OptionalContent {
    const slotsCopy = [...slots]
    const { icon } = this
    if (icon) {
      this.importTags('movie-masher-icon')
      slotsCopy.push(
        html`<movie-masher-icon 
          part='icon' slotted='icon'
          icon='${icon}'
        ></movie-masher-icon>`
      )
    }
    return super.leftContent(slotsCopy)
  }

  protected override content(contents: Contents): Content {
    return html`<header 
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
    >${contents}</header>`
  }
}

export class Footer extends LeftCenterRight {
  protected override content(contents: Contents): Content {
    return html`<footer 
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
    >${contents}</footer>`
  }
}


export class Div extends LeftCenterRight {
  protected override content(contents: Contents): Content {
    return html`<div 
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
    >${contents}</div>`
  }
}

