import type { Elements } from '../declarations'
import { Base } from './Base'

export class Importer extends Base {
  constructor() {
    super()
    this.importElements(Array.from(this.children))
  }

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

  importElements(elements: Elements):void {
    if (!elements.length) return

    const names = this.elementNames(elements)
    const uniqueNames = Array.from(new Set(names))
    const { customElements } = globalThis.window
    const unloaded = uniqueNames.filter(name => !customElements.get(name))
    if (uniqueNames.length) console.debug(this.constructor.name, 'importElements found', ...uniqueNames)
    if (unloaded.length) console.debug(this.constructor.name, 'importElements loading', ...unloaded)

    unloaded.forEach(name => {
      const nameComponents = name.split('-').slice(1)
      const [first, second] = nameComponents
      const lib = second ? `${second}/${first}` : first
      console.log(this.constructor.name, 'importElements', name, lib)
      import(new URL(`../${lib}.js`, import.meta.url).href)
    })
  } 
}
