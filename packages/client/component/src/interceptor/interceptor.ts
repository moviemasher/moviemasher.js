import type { Content, Contents } from '../declarations.js'

import { html } from 'lit'

import { Component } from '../Base/Component.js'
import { Importer } from '../Base/Importer.js'

export class Interceptor extends Importer {
  protected override content(contents: Contents): Content { 
    return html`<div>${contents}</div>` 
  }

  static override styles = [Component.cssHostFlex, Component.cssDivFlex] 
}