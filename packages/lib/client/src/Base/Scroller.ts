import type { CSSResultGroup } from 'lit'
import type { ScrollRootEvent } from '@moviemasher/runtime-client'
import type { Content, Contents } from '../declarations.js'
// import type { Point } from '@moviemasher/runtime-shared'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { ImporterComponent } from './ImporterComponent.js'
import { Component } from './Component.js'
// import { PointZero } from '@moviemasher/lib-shared'

export class Scroller extends ImporterComponent {
  protected override content(contents: Contents): Content {
    return html`<div 
      class='root'
      @scroll-root='${this.handleScrollRoot}'
    >${contents}</div>`
      // @scroll='${this.handleScroll}'
  }

  protected handleScrollRoot(event: ScrollRootEvent): void {
    event.detail.root = this.element('div.root')
    event.stopImmediatePropagation()
  }

  // protected scrollPoint: Point = { ...PointZero }

  // protected handleScroll() {
  //   const { rootElement } = this
  //   if (rootElement) {
  //     console.log('scroll', rootElement.scrollLeft, rootElement.scrollTop) 
  //     this.scrollPoint = { x: rootElement.scrollLeft, y: rootElement.scrollTop }
  //   }
  // }
  // private _rootElement: HTMLElement | null | undefined
  // protected get rootElement(): HTMLElement | null | undefined {
  //   return this._rootElement ||= this.shadowRoot?.querySelector() 
  // }

  static cssDivDropping = css`
    div.drop-box {
      top: 0;
      left: 0;
      pointer-events: none;
      color: transparent;
      right: 0px;
      bottom: 0px;
      position: absolute;
      display: block;
    }

    :host(.dropping) div.drop-box {
      box-shadow: var(--dropping-shadow);
    }
  `

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        flex-grow: 1;
        position: relative;
        display: flex;
      }
      div.root {
        flex-grow: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `
  ]
}

