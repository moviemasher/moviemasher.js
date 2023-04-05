import { createContext } from '@lit-labs/context'

interface Section {
  open: boolean
  openable: boolean
}

export class SectionContextClass { constructor(public section: Section) {} }
export const sectionContext = createContext<SectionContextClass>('moviemasher-section')

