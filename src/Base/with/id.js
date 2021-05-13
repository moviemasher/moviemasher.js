import { Id } from "../../Utilities/Id"

export const id = { 
  id: { get: function() { return this.__id ||= this.initializeId } },
  initializeId: { get: function() { return this.object.id || Id() } },
}
