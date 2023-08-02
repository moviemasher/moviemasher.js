import type { PropertyValues, PropertyDeclarations } from 'lit'
import type { EventDispatcherListenerRecord } from '@moviemasher/runtime-shared'
import type { Content, Contents, Elements, Nodes, OptionalContent } from '../declarations.js'


import { LitElement } from 'lit-element/lit-element.js'
import { html } from 'lit-html/lit-html.js'
import { nothing } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { isDefined } from '@moviemasher/runtime-shared'
import { MovieMasher, EventTypeExportParts } from '@moviemasher/runtime-client'

import { assertPopulatedString } from '@moviemasher/lib-shared'

const partFirst = (element: Element): string => element.part[0] || ''

export class Component extends LitElement {
  override connectedCallback(): void {
    MovieMasher.eventDispatcher.listenersAdd(this.listeners)
    this.handleExportParts()
    this.dispatchExportParts()
    super.connectedCallback()
  }

  protected content(contents: Contents): Content { return html`${contents}` }

  protected get contents(): Contents {
    const { unslottedNodes } = this
    if (unslottedNodes.length) return unslottedNodes
    
    const { defaultContent } = this
    if (defaultContent) return [defaultContent]
 
    return []
  }

  protected get defaultContent(): OptionalContent { return }

  override disconnectedCallback(): void {
    // console.debug(this.tagName, 'disconnectedCallback')
    this.dispatchExportParts()
    MovieMasher.eventDispatcher.listenersRemove(this.listeners)
    super.disconnectedCallback()
  }

  protected dispatchExportParts(): void {
    // console.log(this.tagName, 'dispatchExportParts')
    const init = { bubbles: true, composed: true }
    this.dispatchEvent(new CustomEvent(EventTypeExportParts, init))
  }

  protected element(selector = 'div.root') {
    return this.shadowRoot!.querySelector(selector)!
  }

  protected error(msg: string) {
    this.dispatchEvent(new ErrorEvent('error', { error: new Error(msg) }))
  }

  protected get exportElements(): Element[] {
    const nestedElements = (child: Element): Elements => {
      if (partFirst(child)) return [child]

      return Array.from(child.children).flatMap(nestedElements)
    }
    return Array.from(this.shadowRoot?.children || []).flatMap(nestedElements)
  }

  protected _exportParts?: string | undefined

  get exportParts(): string | undefined {
    const { _exportParts } = this
    if (!isDefined(_exportParts)) this._exportParts = this.exportPathsInitialize
    
    return this._exportParts ? this._exportParts : undefined
  }

  set exportParts(_: string | undefined) {}

  private get exportPathsInitialize(): string {
    const { exportElements: childParts } = this
    if (!childParts.length) return ''

    const part = partFirst(this)
    const childrenExports = childParts.flatMap(child => {
      const childPart = partFirst(child)
      const exported = []
      if (part) exported.push([childPart, [part, childPart].join('-')].join(':'))
      if (child instanceof Component) {
        const { exportParts } = child 
        if (exportParts) {
          const reexported = exportParts.split(',').map(exportPart => {
            assertPopulatedString(exportPart, 'exportPart')
            const [_, childExportedPart] = exportPart.split(':')
            assertPopulatedString(childExportedPart, 'childExportedPart')
             
            const exportedAs = part ? [part, childExportedPart].join('-') : childExportedPart
            if (childExportedPart === exportedAs) return exportedAs

            return [childExportedPart, exportedAs].join(':')
          })
          exported.push(...reexported)
        }
      } 
      return exported
    })
    // console.log(this.tagName, 'get exportParts', childrenExports)
    return childrenExports.join(',') 
  }

  protected handleExportParts() { this.requestUpdate('exportParts', '') }

  protected listeners: EventDispatcherListenerRecord = {}

  protected override render(): unknown {
    const { contents } = this
    return contents.length ? this.content(contents) : nothing
  }

  protected get unslottedNodes(): Nodes {
    return Array.from(this.childNodes).filter(node => {
      if (node instanceof Text) return node.textContent?.trim()
      if (node instanceof Element) return !node.slot
      return false
    })
  }

  protected variable(name: string) {
    const style = getComputedStyle(this)
    const value = style.getPropertyValue(`--${name}`) || '0'
    const withOutPx = value.replace('px', '')
    // console.log(this.tagName, 'variable', name, withOutPx, Number(withOutPx))
    return Number(withOutPx)
  }
  
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('exportParts')) delete this._exportParts
  }

  static cssBorderBoxSizing = css`
    * {
      box-sizing: border-box;
    }
  `

  static cssHostDropping = css`
    :host(.dropping) {
      box-shadow: var()
        0 var(--drop-size) 0 0 var(--color-drop),
        0 calc(-1 * var(--drop-size)) 0 0 var(--color-drop)
      ;
    }
  `
  
  static cssHostFlex = css`:host { display: flex; flex-grow: 1; }`

  static override properties: PropertyDeclarations = {
    exportParts: { reflect: true, type: String, noAccessor: true },
  }
}
