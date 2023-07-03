import type { CSSResultGroup } from 'lit'
import type { 
  Content, Contents, Htmls, OptionalContent, LeftSlot, RightSlot, CenterSlot
} from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

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
    this.importTags('movie-masher-component-span')
    return html`<movie-masher-component-span 
      part='${CenterSlot}' slotted='${CenterSlot}' class='${CenterSlot}'
    >${htmls}</movie-masher-component-span>` 
  }

  protected leftContent(htmls: Htmls): OptionalContent { 
    if (!htmls.length) return

    this.importTags('movie-masher-component-span')
    return html`<movie-masher-component-span
      part='${LeftSlot}' slotted='${LeftSlot}' class='${LeftSlot}'
    >${htmls}</movie-masher-component-span>` 
  }
  
  protected rightContent(htmls: Htmls): OptionalContent { 
    if (!htmls.length) return
    
     this.importTags('movie-masher-component-span')
    return html`<movie-masher-component-span 
      part='${RightSlot}' slotted='${RightSlot}' class='${RightSlot}'
    >${htmls}</movie-masher-component-span>` 
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
  
    }
  `
  static cssSection = css`
    header, footer, div {
      padding: 0;
      flex-grow: 1;
      display: flex;
    }


    header, footer {
      --padding: 0;
      gap: var(--spacing);
      line-height: var(--icon-size);
      font-size: var(--icon-size);
      /* border: 1px solid yellow; */
    }
  

    header > .left,
    footer > .left,
    div > .left {
      flex-grow: 0;
      display: flex;
    }
 
  `

  static cssDiv = css`div { 
    padding: 0;
    display: flex; 
    flex-grow: 1; 
    background-color: var(--div-back);
    color: var(--div-fore);
  }`


  static cssDivLeft = css`
    .left {
      flex-grow: 0;
      display: flex;
      border-right-width: var(--border-size);
      border-right-color: var(--section-back);
      border-right-style: solid;
      align-items: flex-start;
      --flex-direction: column;
    }
  `
  static cssDivCenter = css`
    .center {
      flex-grow: 1;
      padding: var(--content-padding);
    }
  `

  static cssDivRight = css`
    .right {
      flex-grow: 0;
      display: flex;
      border-right-width: var(--border-size);
      border-right-color: var(--section-back);
      border-right-style: solid;
    }
  `
  static cssHeader = css`header { 
    padding: 0;
    display: flex; 
    flex-grow: 1; 
    background-color: var(--section-back);
    color: var(--section-fore);
    gap: var(--spacing);
    line-height: var(--icon-size);
    font-size: var(--icon-size);
  }`

  static cssFooter = css`footer { 
    padding: 0;
    display: flex; 
    flex-grow: 1; 
    background-color: var(--section-back);
    color: var(--section-fore);
    gap: var(--spacing);
    line-height: var(--icon-size);
    font-size: var(--icon-size);
  }`

  static cssCenter = css`
    .center {
      flex-grow: 1;
    }
  `

  static cssLeft = css`
    .left {
      flex-grow: 0;
    }
  `
  static cssRight = css`
    .right {
      flex-grow: 0;
    }
  `
}

export class Header extends LeftCenterRight {
  icon = ''
  override leftContent(slots: Htmls): OptionalContent {
    const slotsCopy = [...slots]
    const { icon } = this
    if (icon) {
      this.importTags('movie-masher-component-icon')
      slotsCopy.push(
        html`<movie-masher-component-icon 
          part='icon' slotted='icon'
          icon='${icon}'
        ></movie-masher-component-icon>`
      )
    }
    return super.leftContent(slotsCopy)
  }

  protected override content(contents: Contents): Content {
    return html`<header 
      @slotted='${this.slottedHandler}'
    >${contents}</header>`
  }


  static override properties = {
    ...LeftCenterRight.properties,
    icon: { type: String }
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    LeftCenterRight.cssHeader,
    LeftCenterRight.cssLeft,
    LeftCenterRight.cssRight,
  ]
}

export class Footer extends LeftCenterRight {
  protected override content(contents: Contents): Content {
    return html`<footer 
      @slotted='${this.slottedHandler}'
    >${contents}</footer>`
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    LeftCenterRight.cssFooter,
    LeftCenterRight.cssLeft,
    LeftCenterRight.cssRight,
  ]
}


export class Div extends LeftCenterRight {
  protected override content(contents: Contents): Content {
    return html`<div 
      @slotted='${this.slottedHandler}'
    >${contents}</div>`
  }
  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    LeftCenterRight.cssDiv,
    LeftCenterRight.cssDivLeft,
    LeftCenterRight.cssDivCenter,
    LeftCenterRight.cssDivRight,
  ]
}

