import type { Elements } from '../declarations'

import { Base } from './Base'

export class Importer extends Base {
  // constructor() {
  //   super()
  //   this.importElements(Array.from(this.children))
  // }

  elementNames(elements?: Elements): string[] {
    const descendents = elements || Array.from(this.children)
    return descendents.flatMap(element => {
      const name = element.nodeName.toLowerCase()
      // console.debug(this.constructor.name, 'importElements elementNames', name)
      if (name.startsWith('moviemasher-')) return [name]
      
      if (!element.childElementCount) return [] 

      return this.elementNames(Array.from(element.children))
    })
  }

  protected importElements(elements: Elements): void {
    if (!elements.length) return

    const names = this.elementNames(elements)
    if (!names.length) return

    // console.debug(this.constructor.name, 'importElements', elements.length, names)
    Importer.importTag(...names)
  } 

  protected importTags(...names: string[]) {

    Importer.importTag(...names)
  }

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
      const nameComponents = name.split('-').slice(1)
      const [first, second] = nameComponents
      const lib = second ? `${second}/${first}` : first
      // console.debug(this.name, 'importTag', name, lib)
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
