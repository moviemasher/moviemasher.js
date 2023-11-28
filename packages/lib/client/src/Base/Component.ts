import type { Elements, Nodes, StringEvent } from '@moviemasher/runtime-client'
import type { EventDispatcherListeners, Strings } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { MOVIEMASHER, SELECTED } from '@moviemasher/runtime-client'
import { DASH, PIPE, STRING, isDefined } from '@moviemasher/runtime-shared'
import { LitElement } from 'lit-element/lit-element.js'
import { html, nothing } from 'lit-html'

const EventTypeExportParts = 'export-parts'

const partFirst = (element: Element): string => element.part[0] || ''

export class Component extends LitElement {
  override connectedCallback(): void {
    MOVIEMASHER.eventDispatcher.listenersAdd(this.listeners)
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
    MOVIEMASHER.eventDispatcher.listenersRemove(this.listeners)
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
    const { exportElements: childParts } = this
    if (!childParts.length) return ''

    const part = partFirst(this)
    const childrenExports = childParts.flatMap(child => {
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
        0 var(--size-drop) 0 0 var(--color-drop),
        0 calc(-1 * var(--size-drop)) 0 0 var(--color-drop)
      ;
    }
  `
  
  static cssHostFlex = css`:host { display: flex; flex-grow: 1; }`

  static override properties: PropertyDeclarations = {
    exportParts: { reflect: true, type: String, noAccessor: true },
  }
}

export class ImporterComponent extends Component {
  override connectedCallback() {
    super.connectedCallback()
    this.importElements(Array.from(this.children))
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

  protected importElements(elements: Elements): void {
    if (!elements.length) return

    const names = this.elementNames(elements)
    // console.log(this.constructor.name, 'importElements', names)
    if (!names.length) return

    this.importTags(...names)
  }

  protected importTag(name: string, file?: string) {
    ImporterComponent.importTag(name, file)
  }

  protected importTags(...names: string[]) { 
    const uniqueNames = Array.from(new Set(names))
    uniqueNames.forEach(name => {
      ImporterComponent.importTag(name)
    })
  }

  protected static get importFinished(): boolean {
    return !this.promises.size
  }

  private static importTag(name: string, file?: string) {
    const { customElements } = globalThis.window
    if (customElements.get(name)) return
    const { promises } = this
    const id = file || name
    if (promises.has(id)) return 

    const idComponents = id.split(DASH).slice(2)
    const first = idComponents.shift()
    const second = idComponents.join(DASH)
    const lib = second ? `${first}/${first}-${second}` : first || name
    // console.debug(this.name, 'importTag', name, '->', lib)
    const libPromise = import(new URL(`../${lib}.js`, import.meta.url).href).then(() => {
      promises.delete(name)
      return lib
    })
    promises.set(id, libPromise)
  }

  private static promises: Map<string, Promise<string>> = new Map();
}

export class Slotted extends ImporterComponent {
  private get slotChildren() {
    return Array.from(this.children).filter(child => child.slot)
  }

  protected override get defaultContent(): OptionalContent {
    const rendereds: Contents = []
    const { slotChildren } = this
    this.slots.forEach(childSlot => {
      const slots: Htmls = []
      const childSlotElements = slotChildren.filter(child => child.slot.startsWith(childSlot)
      )
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

  parts = '';

  private slotChangeHandler(event: Event) {
    this.importElements(Array.from((event.target as HTMLSlotElement).children))
  }

  protected get slots(): Strings {
    const { parts } = this
    return parts ? parts.split(Slotted.partSeparator) : []
  }

  static partSeparator = PIPE;

  static override properties: PropertyDeclarations = { parts: { type: String } };
}

export const ICON = 'icon'

export class IconString extends Slotted {
  protected override content(contents: Contents): Content {
    const { selected } = this

    return html`<a 
      class='${selected ? SELECTED : ''}' 
      tabindex='0'
      @click='${this.handleClick}'
      @keydown='${this.handleKeydown}'
      @export-parts='${this.handleExportParts}'
    >${contents}</a>`
  }

  detail = '';

  emit = '';

  private dispatchStringEvent() {
    const { emit, detail } = this
    const stringEvent: StringEvent = new CustomEvent(emit, { detail })
    MOVIEMASHER.eventDispatcher.dispatch(stringEvent)
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

  icon = '';

  private iconContent(_htmls: Htmls): OptionalContent {
    const { icon } = this
    if (!icon) return

    this.importTags('movie-masher-component-icon')
    return html`<movie-masher-component-icon 
      part='${ICON}' icon='${icon}'
    ></movie-masher-component-icon>`
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    switch (part) {
      case STRING: return this.stringContent(slots)
      case ICON: return this.iconContent(slots)
    }
    return super.partContent(part, slots)
  }

  override parts = [STRING, ICON].join(Slotted.partSeparator);

  selected = false;

  string = '';

  private stringContent(_htmls: Htmls): OptionalContent {
    const { string } = this
    if (!string) return

    this.importTags('movie-masher-component-string')
    return html`<movie-masher-component-string 
      part='${STRING}' string='${string}'
    ></movie-masher-component-string>`
  }

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    detail: { type: String },
    emit: { type: String },
    string: { type: String },
    icon: { type: String },
    selected: { type: Boolean, reflect: true },
  };

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
  ];
}
