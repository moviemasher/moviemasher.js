


import Registry from "../others/registry"
import Option from "../others/option"
import Player from "../others/player"
import Players from "../others/players"
import {isnt, isob } from "../others/util"


const MovieMasher = function() { // it's not necessary to instantiate, but you can
  this.instance_arguments = arguments;
  this.MovieMasher = MovieMasher;
  this.initialize();
};
MovieMasher.prototype.initialize = function(){}; // override me to parse instance_arguments
MovieMasher.configure = function(options){
  if (isob(options)) Option.set(options);
  return Option;
};

MovieMasher.player = function(index_or_options){
  var result = null;
  if (isnt(index_or_options)) index_or_options = {};
  if (isob(index_or_options)) { // new player
    result = new Player(index_or_options);
    Players.instances.push(result);
  } else result = Players.instances[index_or_options];
  return result;
};

MovieMasher.supported = !! (Object.defineProperty && document.createElement("canvas").getContext && (window.AudioContext || window.webkitAudioContext));
MovieMasher.register = Registry.register
export default MovieMasher
