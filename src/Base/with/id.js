import { Is } from "../../Utilities"

export const id = {
  id: {
    get() {
      if (Is.undefined(this.__id)) this.__id = this.initializeId
      return this.__id
    }
  },
  initializeId: { get() { return this.object.id || 'id' } },
}
