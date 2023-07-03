import type { Elements } from '../declarations'

import { Component } from './Component'

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

    ImporterComponent.importTag(...names)
  } 

  protected importTags(...names: string[]) { ImporterComponent.importTag(...names) }

  protected static get importFinished(): boolean {
    return !this.promises.size
  }
  protected static importTag(...names: string[]) {
    
    const uniqueNames = Array.from(new Set(names))
    const { customElements } = globalThis.window
    const { promises } = this
    const unloaded = uniqueNames.filter(name => {
      if (promises.has(name)) return false

      const found = customElements.get(name)
      return !found 
    })
    // if (uniqueNames.length) console.debug(this.name, 'importTag found', ...uniqueNames)
    // if (unloaded.length) console.debug(this.name, 'importTag loading', ...unloaded)

    unloaded.forEach(name => {
      const nameComponents = name.split('-').slice(2)
      const [first, second] = nameComponents
      const lib = second ? `${first}/${first}-${second}` : first || name
      // console.debug(this.name, 'importTag', name, '->', lib)
      const promise = import(new URL(`../${lib}.js`, import.meta.url).href)
      const libPromise = promise.then(() => {
        promises.delete(name)
        return lib
      })
      promises.set(name, libPromise)
    })
  }

  private static promises: Map<string, Promise<string>> = new Map()
}
