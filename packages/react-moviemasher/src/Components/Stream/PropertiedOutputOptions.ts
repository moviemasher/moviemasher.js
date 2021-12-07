import { Propertied, Property, SelectionValue } from "@moviemasher/moviemasher.js"

class PropertiedOutputOptions implements Propertied {
  constructor() {

  }
  property(key: string): Property | undefined {
    return
  }

  value(key: string): SelectionValue {
    return ''
  }
  setValue(key: string, value: SelectionValue): boolean {
    return true
  }
  properties: Property[] = []
}

export { PropertiedOutputOptions }
