import type { Content, Contents, Nodes } from '../declarations.js'
import type { EventDispatcherListenerRecord } from '@moviemasher/runtime-shared'

import { LitElement } from 'lit-element/lit-element.js'
import { html } from 'lit-html/lit-html.js'
import { nothing } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { MovieMasher } from '@moviemasher/runtime-client'

export class Component extends LitElement {
  private get childElements(): Element[] {
    const { shadowRoot } = this
    if (!shadowRoot) return []
    const { children } = shadowRoot
    const [firstChild] = children
    if (!firstChild) return []

    return Array.from(firstChild.children)
  }

  private get childSlotteds(): Component[] {
    return this.childElements.filter<Component>((child): child is Component => 
      child instanceof Component
    )
  }


  override connectedCallback(): void {
    MovieMasher.eventDispatcher.listenersAdd(this.listeners)
    super.connectedCallback()
  }

  protected content(contents: Contents): Content { 
    return html`${contents}` 
  }

  protected get contents(): Contents {
    const { unslottedNodes } = this
    if (unslottedNodes.length) return unslottedNodes
    
    const { defaultContent } = this
    if (defaultContent) return [defaultContent]
 
    return []
  }

  protected get defaultContent(): Content | void { return }

  override disconnectedCallback(): void {
    MovieMasher.eventDispatcher.listenersRemove(this.listeners)
    super.disconnectedCallback()
  }

  protected error(msg: string) {
    this.dispatchEvent(new ErrorEvent('error', { error: new Error(msg) }))
  }

  get exportParts(): string | undefined {
    console.log(this.tagName, 'get exportParts')
    const { part: mySlot } = this
    if (!mySlot) return undefined

    const { childSlotteds } = this
    if (!childSlotteds.length) return undefined

    const childrenExports = childSlotteds.flatMap(child => {
      const { exportParts, part: childSlot } = child 
      const exported = [[childSlot, [mySlot, childSlot].join('-')].join(':')]
      if (exportParts) {
        const reexported = exportParts.split(',').map(exportPart => {
          const [_childPart, childExportedPart] = exportPart.split(':')
          const exportedAs = [mySlot, childExportedPart].join('-')
          return [childExportedPart, exportedAs].join(':')
        })
        exported.push(...reexported)
      }
      return exported
    })
    return childrenExports.join(',') 
  }
  set exportParts(value: string | undefined) {

    console.log(this.tagName, 'set exportParts', value)
  }

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

  static cssHostFlex = css`:host { display: flex; flex-grow: 1; }`


  static override properties = {
    exportParts: { reflect: true, type: String, noAccessor: true }
  }


}
