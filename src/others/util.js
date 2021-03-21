const array_find = (array, value, key) => {
  var item = null
  if (array && isarray(array)) {
    if (isnt(key)) key = 'id'
    if (isob(value)) value = value[key]
    if (!isnt(value)) {
      for (var i = 0; i < array.length; i++) {
        item = array[i]
        if (item && (item[key] === value)) break
        item = null
      }
    } else console.log("Util.array_find isnt value", value)
  } else console.log("Util.array_find not array", array, !!array)
  return item
}
const array_key = (array, value, key, id_key) => {
  return array_find(array, value, id_key)[key];
}

const array_delete = (array, value) => {
  if (isarray(array)){
    const index = array.indexOf(value);
    if (-1 < index) array.splice(index, 1);
  }
}
const copy_array = (a1, a2) => {
  if (! a2) a2 = []
  for (var i = 0; i < a1.length; i++) a2.push(a1[i])
  return a2
}
const copy_ob = (ob1, ob2) => {
  if (! isnt(ob1)) {
    if (! ob2) ob2 = {}
    for (var key in ob1) {
      if (copy_key_valid(key)) ob2[key] = ob1[key]
    }
  }
  return ob2
}
const copy_key_valid = (key) => {
  return key.substr(0,1) !== '$'
}
const copy_keys_recursize = (ob1, ob2) => {
  if (isob(ob1)){
    if (isnt(ob2)) ob2 = {}
    for (var key in ob1) {
      if (copy_key_valid(key)){
        const value1 = ob1[key]
        if (isob(value1)) {
          if (isarray(value1)) ob2[key] = copy_array(value1)
          else ob2[key] = copy_keys_recursize(value1, ob2[key])
        } else ob2[key] = value1
      }
    }
  }
  return ob2
}

const is = variable => !isnt(variable)

const isarray = (value) => {
  if (isnt(Array.isArray)) return (value instanceof Array)
  return Array.isArray(value)
}
const isob = (value) => typeof value === 'object'

const isempty = ob => !(isob(ob) && ob_keys(ob).length)
const isnt = value => typeof value === 'undefined'

const isstring = value => typeof value === 'string'

const ob_keys = (ob) => {
  var key, array = [];
  if (isob(ob)) for (key in ob) array.push(key);
  return array;
}

const sort_by_frame = (clip1, clip2) => {
  return (clip1.frame - clip2.frame) || (clip1.frames - clip2.frames);
}
const sort_by_label = (a, b) => {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;
  return 0;
}
const sort_numeric = (a, b) => a - b
const sort_numeric_desc = (a, b) => b - a

export {
  array_key,
  array_find,
  array_delete,
  copy_array,
  copy_ob,
  copy_key_valid,
  copy_keys_recursize,
  isstring,
  isarray,
  isempty,
  ob_keys,
  sort_by_frame, 
  sort_by_label,
  sort_numeric,
  sort_numeric_desc,
  is,
  isob, 
  isnt,
}
