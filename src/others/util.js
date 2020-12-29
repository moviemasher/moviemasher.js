Util = {
  array_empty: function(array){
    while(array.length > 0) array.pop();
  },
  array_add: function(array, value){
    var pos;
    if (array && Util.isarray(array)) {
      pos = array.indexOf(value);
      if (-1 === pos) array.push(value);
    }
  },
  array_key: function(array, value, key, id_key){
    return Util.array_find(array, value, id_key)[key];
  },
  array_find: function(array, value, key){
    var item = null, i, z;
    if (array && Util.isarray(array)) {
      if (Util.isnt(key)) key = 'id';
      if (Util.isob(value)) value = value[key];
      if (! Util.isnt(value)) {
        z = array.length;
        for (i = 0; i < z; i++){
          item = array[i];
          if (item && (item[key] === value)) break;
          item = null;
        }
      }
    }
    return item;
  },
  array_delete: function(array, value){
    var index;
    if (Util.isarray(array)){
      index = array.indexOf(value);
      if (-1 < index) array.splice(index, 1);
    }
  },
  array_delete_ref: function(array, value, key){
    var ob, index = -1;
    if (Util.isarray(array)){
      ob = this.array_find(array, value, key);
      if (ob) {
        index = array.indexOf(ob);
        if (-1 < index) array.splice(index, 1);
      }
    }
    return index;
  },
  array_replace: function(array, value, key){
    var index = this.array_delete_ref(array, value, key);
    if (-1 < index) array.splice(index, 0, value);
    else array.push(value);
  },
  contents_match: function(a1, a2){
    var i, z, match = true;
    if (a1 && a2 && (a1.length === a2.length)){
      z = a1.length;
      for (i = 0; i < z; i++){
        if (a1[i] !== a2[i]){
          match = false;
          break;
        }
      }
    }
    return match;
  },
  copy_array: function(a1, a2){
    if (! a2) a2 = [];
    var i, z = a1.length;
    for (i = 0; i < z; i++) a2.push(a1[i]);
    return a2;
  },
  copy_ob: function(ob1, ob2){
    if (! Util.isnt(ob1)) {
      if (! ob2) ob2 = {};
      var key;
      for (key in ob1) {
        if (Util.copy_key_valid(key)) ob2[key] = ob1[key];
      }
    }
    return ob2;
  },
  copy_key_valid: function(key){
    return (key.substr(0,1) !== '$');
  },
  copy_ob_scalars: function(ob1, ob2, dont_overwrite){
    if (! Util.isnt(ob1)) {
      if (Util.isnt(ob2)) ob2 = {};
      var key;
      for (key in ob1) {
        if (Util.copy_key_valid(key)){
          if (! Util.isob(ob1[key])) {
            if ((! dont_overwrite) || Util.isnt(ob2[key])) {
              ob2[key] = ob1[key];
            }
          }
        }
      }
    }
    return ob2;
  },
  copy_keys_recursize: function(ob1, ob2){
    var key, value1;
    if (Util.isob(ob1)){
      if (Util.isnt(ob2)) ob2 = {};
      for (key in ob1) {
        if (Util.copy_key_valid(key)){
          value1 = ob1[key];
          if (Util.isob(value1)) {
            if (Util.isarray(value1)) ob2[key] = Util.copy_array(value1);
            else ob2[key] = Util.copy_keys_recursize(value1, ob2[key]);
          } else ob2[key] = value1;
        }
      }
    }
    return ob2;
  },
  index_after_removal: function(index, items, container){
    var found, i, z, container_index, container_indexes = [];
    z = items.length;
    for (i = 0; i < z; i++){
      container_index = container.indexOf(items[i]);
      container_indexes.push(container_index);
      if ((-1 < container_index) && (index > container_index)) index --;
    }
    for (i = 0; i < z; i++){
      found = ((index + i) !== container_indexes[i]);
      if (found) break;
    }
    if (! found) index = -2;
    return index;
  },
  is: function(variable){
    return ! Util.isnt(variable);
  },
  is_typeof: function(){
    var value, i, z, found = false;
    z = arguments.length;
    for (i = 0; i < z; i++){
      if (i) found = (typeof arguments[i] === value);
      else value = arguments[i];
      if (found) break;
    }
    return found;
  },
  isarray: function() {
    var i, z, found = false;
    z = arguments.length;
    for (i = 0; i < z; i++){
      if (arguments[i]) {
        if (Util.isnt(Array.isArray)) found = (arguments[i] instanceof Array);
        else found = Array.isArray(arguments[i]);
      }
      if (! found) break;
    }
    return found;
  },
  isempty: function(ob) {
    return !(this.isob(ob) && this.ob_keys(ob).length);
  },
  isnt: function(){
    return this.is_typeof.apply(this, this.copy_array(arguments, ['undefined']));
  },
  isob: function(){
    return this.is_typeof.apply(this, this.copy_array(arguments, ['object']));
  },
  isstring: function(){
    return this.is_typeof.apply(this, this.copy_array(arguments, ['string']));
  },
  keys_found_equal: function(hash1,hash2){
    var key, match = true;
    for (key in hash1){
      match = (hash1[key] === hash2[key]);
      if (! match) break;
    }
    return match;
  },
  keys_match: function(hash1, hash2){
    var key, match = true;
    for (key in hash1){
      if (Util.isnt(hash2[key])) {
        match = false;
        break;
      }
    }
    if (match) {
      for (key in hash2){
        if (Util.isnt(hash1[key])) {
          match = false;
          break;
        }
      }
    }
    return match;
  },
  ob_keys: function(ob){
    var key, array = [];
    if (Util.isob(ob)) for (key in ob) array.push(key);
    return array;
  },
  ob_property: function(ob, prop) {
    var i, z, val = null;
    if (Util.isob(ob) && (! Util.isnt(prop)) && prop.length) {
      prop = prop.split('.');
      z = prop.length;
      for (i = 0; i < z; i++){
        ob = ob[prop[i]];
        if (Util.isnt(ob)){
          val = null;
          break;
        }
        val = ob;
      }
    }
    return val;
  },
  ob_values: function(ob){
    var key, array = [];
    if (Util.isob(ob)) for (key in ob) array.push(ob[key]);
    return array;
  },
  pad: function(n, width, z) {
    z = z || '0';
    n = String(n);
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },
  pluralize: function(n, s){
    if (n !== 1) s += 's';
    return s;
  },
  set_ob_property: function(ob, prop, val) {
    var i, z;
    if (Util.isob(ob) && (! Util.isnt(prop)) && prop.length) {
      prop = prop.split('.');
      z = prop.length - 1;
      for (i = 0; i < z; i++){
        ob = ob[prop[i]];
        if (! Util.isob(ob)){
          ob = null;
          break;
        }
      }
      if (ob) ob[prop[i]] = val;
    }
  },
  sort_by_frame: function(clip1, clip2) {
    return (clip1.frame - clip2.frame) || (clip1.frames - clip2.frames);
  },
  sort_by_label: function(a, b) {
    if (a.label < b.label) return -1;
    if (a.label > b.label) return 1;
    return 0;
  },
  sort_numeric: function(a, b){return a-b;},
  sort_numeric_desc: function(a, b){return b-a;},
  uuid: function(){
    return (function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b);})();
  },
};
MovieMasher.Util = Util;
