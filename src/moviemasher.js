
var MovieMasher = function() { // it's not necessary to instantiate, but you can
  this.instance_arguments = arguments;
  this.MovieMasher = MovieMasher;
  this.initialize();
};
MovieMasher.prototype.initialize = function(){}; // override me to parse instance_arguments
MovieMasher.configure = function(options){
  if (Util.isob(options)) Option.set(options);
  return Option;
};
MovieMasher.find = function(type, ob_or_id, key){
  var ob;
  if (Util.isob(ob_or_id)) ob_or_id = ob_or_id[key || 'id'];
  if (ob_or_id){
    if (Util.isnt(MovieMasher.registered[type])) {
      //console.log('finding first type', type);
      MovieMasher.registered[type] = [];
    }
    ob = Util.array_find(MovieMasher.registered[type], ob_or_id, key);
    if (! ob) {
      ob = Defaults.module_for_type(type, ob_or_id);
      if (ob) {
        MovieMasher.registered[type].push(ob);
        MovieMasher.registered[type].sort(Util.sort_by_label);
      } else console.error('could not find registered ' + type, ob_or_id);
    }
  }
  return ob;
};
MovieMasher.player = function(index_or_options){
  var result = null;
  if (Util.isnt(index_or_options)) index_or_options = {};
  if (Util.isob(index_or_options)) { // new player
    result = new Player(index_or_options);
    Players.instances.push(result);
  } else result = Players.instances[index_or_options];
  return result;
};
MovieMasher.register = function(type, media){
  if (! Util.isarray(media)) media = [media];
  if (Util.isob.apply(Util, media)) {
    var do_sort, found_ob, first_for_type, found_default, ob, i, z = media.length;
    if (z) {
      first_for_type = Util.isnt(MovieMasher.registered[type]);
      if (first_for_type) {
        MovieMasher.registered[type] = [];
      }
      for (i = 0; i < z; i++){
        ob = media[i];
        found_ob = Util.array_find(MovieMasher.registered[type], ob);
        if ('com.moviemasher.' + type + '.default' === ob.id) {
          found_default = true;
          if (found_ob) { // overwriting default
            Util.array_delete(MovieMasher.registered[type], found_ob);
            found_ob = null;
          }
        }
        if (! found_ob) {
          if (! ob.type) ob.type = type;
          MovieMasher.registered[type].push(ob);
          do_sort = true;

        }
      }
    }
    if (first_for_type && (! found_default)) {
      ob = Defaults.module_for_type(type);
      if (ob) {
        MovieMasher.registered[type].push(ob);
        do_sort = true;
        MovieMasher.registered[type].sort(Util.sort_by_label);
      }
    }
    if (do_sort) MovieMasher.registered[type].sort(Util.sort_by_label);
  }
};
MovieMasher.registered = {};
MovieMasher.supported = !! (Object.defineProperty && document.createElement("canvas").getContext && (window.AudioContext || window.webkitAudioContext));
