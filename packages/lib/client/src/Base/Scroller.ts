import type { CSSResultGroup } from 'lit'
import type { ScrollRootEvent } from '@moviemasher/runtime-client'
import type { Content, Contents } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { ImporterComponent } from './ImporterComponent.js'
import { Component } from './Component.js'

export class Scroller extends ImporterComponent {
  protected override content(contents: Contents): Content {
    return html`<div 
      class='root'
      @scroll-root='${this.handleScrollRoot}'
    >${contents}</div>`
  }

  protected handleScrollRoot(event: ScrollRootEvent): void {
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
  `
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    Scroller.cssDivRoot,
    css`
      :host {
        position: relative;
      }
      
    `
  ]
}

