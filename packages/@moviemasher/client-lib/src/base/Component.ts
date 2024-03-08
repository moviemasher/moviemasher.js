import type { Elements, EventDispatcherListeners, Nodes, Scalar, Strings } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Htmls, OptionalContent, TemplateContent, TemplateContents } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { $ICON, $STRING, DASH, MOVIE_MASHER, PIPE, SLASH, arrayUnique } from '@moviemasher/shared-lib/runtime.js'
import { isDefined } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { LitElement } from 'lit-element/lit-element.js'
import { html, nothing } from 'lit-html'
import { $SELECTED } from '../utility/constants.js'
import { StringEvent } from '../module/event.js'

const EventTypeExportParts = 'export-parts'

const partFirst = (element: Element): string => element.part[0] || ''

export class Component extends LitElement {
  override connectedCallback(): void {
    // console.log(this.tagName, 'connectedCallback')
    MOVIE_MASHER.listenersAdd(this.listeners)
    this.handleExportParts()
    this.dispatchExportParts()
    super.connectedCallback()
  }

  protected templateContent(contents: TemplateContents): TemplateContent { return html`${contents}` }

  protected get contents(): TemplateContents {
    const { unslottedNodes } = this
    if (unslottedNodes.length) return unslottedNodes
    
    const { defaultContent } = this
    if (defaultContent) return [defaultContent]
 
    return []
  }

  protected get defaultContent(): OptionalContent { return }

  override disconnectedCallback(): void {
    this.dispatchExportParts()
    MOVIE_MASHER.listenersRemove(this.listeners)
    super.disconnectedCallback()
  }

  protected dispatchExportParts(): void {
    // console.log(this.tagName, 'dispatchExportParts')
    const init = { bubbles: true, composed: true }
    this.dispatchEvent(new CustomEvent(EventTypeExportParts, init))
  }

  protected element<T extends Element = Element>(selector: string = 'div.root'): T {
    return this.selectElement(selector)!
  }
  protected selectElement<T extends Element = Element>(selector?: string): T | undefined {
    if (!selector) return 
    
    const { shadowRoot } = this
    return shadowRoot?.querySelector(selector) || undefined
  }

  protected get exportElements(): Element[] {
    const nestedElements = (child: Element): Elements => {
      if (partFirst(child)) return [child]

      return Array.from(child.children).flatMap(nestedElements)
    }
    return Array.from(this.shadowRoot?.children || []).flatMap(nestedElements)
  }

  private _exportParts?: string | undefined

  /**
   * @attr export-parts
   * @returns comma separated list of export parts
   */
  get exportParts(): string | undefined {
    const { _exportParts } = this
    if (!isDefined(_exportParts)) this._exportParts = this.exportPathsInitialize
    
    return this._exportParts ? this._exportParts : undefined
  }
  /**
   * @internal
   */
  set exportParts(_: string | undefined) {}

  private get exportPathsInitialize(): string {
    const { exportElements: exportElements } = this
    if (!exportElements.length) return ''

    const part = partFirst(this)
    const childrenExports = exportElements.flatMap(child => {
      const childPart = partFirst(child)
      const exported = []
      if (part) exported.push([childPart, [part, childPart].join(DASH)].join(':'))
      if (child instanceof Component) {
        const { exportParts } = child 
        if (exportParts) {
          const reexported = exportParts.split(',').flatMap(exportPart => {
            if (!exportPart) return []
            
            const [_, childExportedPart] = exportPart.split(':')
            if (!childExportedPart) return []
             
            const exportedAs = part ? [part, childExportedPart].join(DASH) : childExportedPart
            if (childExportedPart === exportedAs) return [exportedAs]

            return [[childExportedPart, exportedAs].join(':')]
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

  protected listeners: EventDispatcherListeners = {}

  protected override render(): unknown {
    const { contents } = this
    return contents.length ? this.templateContent(contents) : nothing
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
    return Number(withOutPx)
  }

  protected variableSet(name: string, value?: Scalar) {
    if (isDefined(value)) this.style.setProperty(`--${name}`, String(value))
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
      box-shadow: 
        0 var(--size-drop) 0 0 var(--color-drop),
        0 calc(-1 * var(--size-drop)) 0 0 var(--color-drop);
    }
  `
  
  static cssHostFlex = css`
    :host { 
      display: flex; 
      flex-grow: 1; 
    }
  `

  static override properties: PropertyDeclarations = {
    exportParts: { reflect: true, type: String, noAccessor: true },
  }
}

export class ComponentLoader extends Component {
  override connectedCallback() {
    super.connectedCallback()
    this.loadElements(Array.from(this.children))
  }

  private elementNames(elements?: Elements): string[] {
    const descendents = elements || Array.from(this.children)
    return descendents.flatMap(element => {
      const name = element.nodeName.toLowerCase()
      if (name.startsWith('movie-masher')) return [name]

      if (!element.childElementCount) return []

      return this.elementNames(Array.from(element.children))
    })
  }

  protected loadElements(elements: Elements): void {
    arrayUnique(this.elementNames(elements)).forEach(name => this.loadComponent(name))
  }

  protected loadComponent(name: string) { ComponentLoader.importComponent(name) }

  private static importComponent(name: string) {
    if (globalThis.window.customElements.get(name)) return

    const { promises } = this
    if (promises.has(name)) return 

    const idComponents = name.split(DASH).slice(2) // remove 'movie-masher'
    const first = idComponents.shift() 
    assertDefined(first)

    const second = idComponents.join(DASH)
    const known = ['browser', 'timeline', 'inspector', 'player', 'exporter', 'importer']
    const directory = second || known.includes(first) ? first : 'component'
    const file = second ? `${first}-${second}` : first
    const lib = [directory, file].join(SLASH)
    const relativePath = `../${lib}.js`
    const { href } = new URL(relativePath, import.meta.url)
    const libPromise = import(href).then(() => {
      promises.delete(name)
      return lib
    })
    promises.set(name, libPromise)
  }

  private static promises: Map<string, Promise<string>> = new Map()
}

export class ComponentSlotter extends ComponentLoader {
  private get slotChildren() {
    return Array.from(this.children).filter(child => child.slot)
  }

  protected override get defaultContent(): OptionalContent {
    const rendereds: TemplateContents = []
    const { slotChildren } = this
    this.slots.forEach(childSlot => {
      const slots: Htmls = []
      const childSlotElements = slotChildren.filter(child => (
        child.slot.startsWith(childSlot)
      ))
      const terminated = childSlotElements.some(slotChild => {
        const { slot } = slotChild
        if (slot === childSlot) {
          rendereds.push(html`
            <slot 
              name='${childSlot}' class='${childSlot}'
              @slotchange='${this.slotChangeHandler}'
            ></slot>
          `)
          return true
        }
        slots.push(html`
          <slot 
            name='${slot}' 
            slot='${slot.split(DASH).slice(1).join(DASH)}'
          ></slot>
        `)
        return false
      })
      if (!terminated) {
        const content = this.partContent(childSlot, slots)
        if (content) rendereds.push(content)
      }
    })
    if (rendereds.length) return html`${rendereds}`
  }

  protected partContent(_part: string, slots: Htmls): OptionalContent {
    return html`${slots}`
  }

  parts = ''

  private slotChangeHandler(event: Event) {
    this.loadElements(Array.from((event.target as HTMLSlotElement).children))
  }

  protected get slots(): Strings {
    const { parts } = this
    return parts ? parts.split(ComponentSlotter.partSeparator) : []
  }

  static partSeparator = PIPE

  static override properties: PropertyDeclarations = { parts: { type: String } }
}

export class ComponentClicker extends ComponentSlotter {
  protected override templateContent(contents: TemplateContents): TemplateContent {
    const { selected } = this

    return html`<a 
      class='${selected ? $SELECTED : ''}' 
      tabindex='0'
      @click='${this.handleClick}'
      @keydown='${this.handleKeydown}'
      @export-parts='${this.handleExportParts}'
    >${contents}</a>`
  }

  detail = ''

  emit = ''

  private dispatchStringEvent() {
    const { emit, detail } = this
    const stringEvent: StringEvent = new CustomEvent(emit, { detail })
    MOVIE_MASHER.dispatchCustom(stringEvent)
  }

  protected handleClick(event: PointerEvent): void {
    const { emit } = this
    if (!emit) return

    event.stopPropagation()
    this.dispatchStringEvent()
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const { emit } = this
    if (!emit) return

    const { code } = event
    if (code !== 'Enter') return

    event.stopPropagation()
    this.dispatchStringEvent()
  }

  icon = ''

  private iconContent(_htmls: Htmls): OptionalContent {
    const { icon } = this
    if (!icon) return

    this.loadComponent('movie-masher-icon')
    return html`<movie-masher-icon 
      part='${$ICON}' icon='${icon}'
    ></movie-masher-icon>`
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    switch (part) {
      case $STRING: return this.stringContent(slots)
      case $ICON: return this.iconContent(slots)
    }
    return super.partContent(part, slots)
  }

  override parts = [$STRING, $ICON].join(ComponentSlotter.partSeparator)

  selected = false

  string = ''

  private stringContent(_htmls: Htmls): OptionalContent {
    const { string } = this
    if (!string) return

    this.loadComponent('movie-masher-word')
    return html`<movie-masher-word 
      part='${$STRING}' string='${string}'
    ></movie-masher-word>`
  }

  static override properties: PropertyDeclarations = {
    ...ComponentSlotter.properties,
    detail: { type: String },
    emit: { type: String },
    string: { type: String },
    icon: { type: String },
    selected: { type: Boolean, reflect: true },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --padding: var(--pad-control);
        --size: var(--height-control);
        --gap: var(--gap-control);
        --cursor: pointer;
        display: inline-block;
        height: var(--size);
      }

      a {
        color: var(--fore);
        cursor: var(--cursor);
        display: inline-flex;
        gap: var(--gap);
        transition: color var(--color-transition);
        font-size: var(--size);
        line-height: var(--size);
      }

      a.selected {
        color: var(--on);
      }

      a:hover {
        color: var(--over);
      }
    `
  ]
}
