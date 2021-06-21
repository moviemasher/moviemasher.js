import { ScalarValue } from "../../Setup/declarations";

interface TypeValueObject {
  id : ScalarValue
  identifier : string
  label : string
}

class TypeValue {
  constructor(object : TypeValueObject) {
    const { id, identifier, label } = object
    this.id = id
    this.identifier = identifier
    this.label = label
  }

  id : ScalarValue

  identifier : string

  label : string
}

export { TypeValue, TypeValueObject }
