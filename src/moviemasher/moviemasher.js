
import { Is } from '../Is'
import { CacheCleaner } from "../Cache/CacheCleaner"
import { Module } from "../Module"
import { Default } from "../Default"
import { Errors } from "../Errors"
import { Masher } from '../Masher/Masher'
import { Property } from '../Utilities'
const MovieMasher = function(...args) {
  this.instance_arguments = args
  this.cacheCleaner = CacheCleaner // cache is shared between mashers
  this.initialize()
}
MovieMasher.register = (type, objects) => { 
  return Module.addModulesOfType(objects, type) 
}
MovieMasher.configure = (object) => {
  if (Is.object(object)) console.warn(Errors.deprecation.configure.set)
  else console.warn(Errors.deprecation.configure.get)
  return Default
}
MovieMasher.player = (object_or_index) => {
  const argument = Is.defined(object_or_index) ? object_or_index : {}
  if (Is.object(argument)) return new Masher(argument)
    
  return Masher.instances[argument]
}
MovieMasher.supported = true
MovieMasher.registered = Module
MovieMasher.defaults = Default
MovieMasher.Constant = Property
MovieMasher.CoreFilter = Property

Object.defineProperties(MovieMasher, {
  initialize: { value: function() { console.log("MovieMasher.initialize") } },
  MovieMasher: { get: function() { return MovieMasher } },
})
Object.defineProperties(MovieMasher.prototype, {
   MovieMasher: { get: function() { return MovieMasher } },
})

// deprecated as of 4.0.26
//   supported,
//   register,
//   registered,
//   player, 

//MovieMasher.MovieMasher = MovieMasher
export { MovieMasher }

