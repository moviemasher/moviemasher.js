import { ModuleType } from "../../Types"
import { Merger, Scaler, Effect } from "../../Transform"
import { Module } from "../../Module"
import { Is } from "../../Is";

export const transform = {
  effects: { 
    get: function() { return this.__effects ||= this.effectsInitialize }
  }, 
  effectsInitialize: { 
    get: function() { 
      const array = this.object.effects || []
      return array.map(object => new Effect(object))
    }
  },
  merger: { 
    get: function() { return this.__merger ||= this.mergerInitialize },
    set: function(value) { this.__merger = new Merger({ id: value })}
  }, 
  mergerInitialize: { 
    get: function() { 
      const object = this.object.merger || Module.objectWithDefaultId(ModuleType.merger)
      return new Merger(object)
    }
  },
  scaler: { 
    get: function() { return this.__scaler ||= this.scalerInitialize },
    set: function(value) { this.__scaler = new Scaler({ id: value })}
  }, 
  scalerInitialize: { 
    get: function() { 
      const object = this.object.scaler || Module.objectWithDefaultId(ModuleType.scaler)
      return new Scaler(object)
    }
  },
  coreFilters: { 
    get: function() { 
      const filters = []
      if (Is.defined(this.media.filters)) filters.push(...this.media.filters)
      if (Is.defined(this.merger)) filters.push(...this.merger.media.filters)
      if (Is.defined(this.scaler)) filters.push(...this.scaler.media.filters)
      if (Is.defined(this.effects)) {
        filters.push(...this.effects.flatMap(effect => effect.media.filters))
      }
      return filters
    }
  },
}