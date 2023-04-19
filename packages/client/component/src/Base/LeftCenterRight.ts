import type { 
  Content, Contents, Htmls, SlottedContent, LeftSlot, RightSlot, 
} from '../declarations'

import { css } from 'lit'
import { html } from 'lit'
import { property } from 'lit/decorators/property.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import { Slotted } from './Slotted'

const LeftSlot: LeftSlot = 'left'
const RightSlot: RightSlot = 'right'

export class LeftCenterRight extends Slotted {
  protected override defaultSlottedContent(key: string, htmls: Htmls): SlottedContent { 
    switch (key) {
      case LeftSlot: return this.leftContent(htmls)
      case RightSlot: return this.rightContent(htmls)
    }
  }

  protected leftContent(htmls: Htmls): SlottedContent { 
    this.importTags('moviemasher-span')
    return html`<moviemasher-span
      exportparts='${ifDefined(this.exportsForSlot(LeftSlot))}'
      part='${LeftSlot}' slotted='${LeftSlot}' class='${LeftSlot}'
    >${htmls}</moviemasher-span>` 
  }
  protected rightContent(htmls: Htmls): SlottedContent { 
    this.importTags('moviemasher-span')
    return html`<moviemasher-span 
      exportparts='${ifDefined(this.exportsForSlot(RightSlot))}'
      part='${RightSlot}' slotted='${RightSlot}' class='${RightSlot}'
    >${htmls}</moviemasher-span>` 
  }
  
  override slots = [LeftSlot, RightSlot]

  static styleHost = css`
    :host {
      flex-grow: 1;
      display: flex;
      --padding: var(--section-padding);
      --spacing: var(--section-spacing);
      --back: var(--section-back);
      --fore: var(--section-fore);
    }

    footer,
    header {
      flex-grow: 1;
      display: flex;
      align-items: flex-start;
      gap: var(--spacing);
      padding: var(--padding);
      background-color: var(--back);
      color: var(--fore);
      line-height: var(--icon-size);
      font-size: var(--icon-size);
    }
    header>*:first-child,
    footer>*:first-child {
      flex-grow: 1;
    }
    header>*,
    footer>* {
      margin-block: auto;
    }


  `
  static override styles = [
    this.styleHost
  ]
}

export class Header extends LeftCenterRight {
  @property() icon = ''
  override leftContent(htmls: Htmls): SlottedContent {
    const slotsCopy = [...htmls]
    const { icon } = this
    if (icon) {
      this.importTags('moviemasher-icon')
      slotsCopy.push(
        html`<moviemasher-icon 
          exportparts='${ifDefined(this.exportsForSlot('icon'))}'
          part='icon' slotted='icon'
          icon='${icon}'
        ></moviemasher-icon>`
      )
    }
    return super.leftContent(slotsCopy)
  }

  override slottedContent(contents: Contents): Content {
    return html`<header 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
    >${contents}</header>`
  }
}

export class Footer extends LeftCenterRight {
  override slottedContent(contents: Contents): Content {
    return html`<footer 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
    >${contents}</footer>`
  }
}


export class Div extends LeftCenterRight {
  override slottedContent(contents: Contents): Content {
    return html`<div 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
    >${contents}</div>`
  }
}

