import type { Content, Contents, Nodes } from '../declarations.js'

import { LitElement, html, css, nothing } from 'lit'

export class Component extends LitElement {

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

  protected error(msg: string) {
    this.dispatchEvent(new ErrorEvent('error', { error: new Error(msg) }))
  }
  
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

  static cssDivFlex = css`div { display: flex; flex-grow: 1; }`
  
  static cssHostFlex = css`:host { display: flex; flex-grow: 1; }`
}
