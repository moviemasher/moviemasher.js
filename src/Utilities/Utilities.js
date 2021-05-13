import { Errors } from "../Errors"
import { Is } from '../Is'

const findBy = (array, object, key = 'id') => {
  if (! Is.array(array)) throw(Errors.array)
  if (Is.undefined(key)) throw(Errors.argument)

  const value = Is.object(object) ? object[key] : object
  if (Is.undefined(value)) throw(Errors.argument)
  return array.find(item => item[key] === value)
}

const deleteFromArray = (array, value) => {
  const is_array = Is.array(array)
  const include = is_array && array.includes(value)
  if (include) array.splice(array.indexOf(value), 1)
}


const keyShouldBeCopied = (key) => {
  return key.substr(0,1) !== '$'
}
const deepCopy = (ob1, ob2) => {
  if (Is.object(ob1)){
    if (Is.undefined(ob2)) ob2 = {}
    for (var key in ob1) {
      if (keyShouldBeCopied(key)){
        const value1 = ob1[key]
        if (Is.object(value1)) {
          if (Is.array(value1)) ob2[key] = [...value1]
          else ob2[key] = deepCopy(value1, ob2[key])
        } else ob2[key] = value1
      }
    }
  }
  return ob2
}

const capitalize = value => {
  const string = Is.string(value) ? value : String(value)
  if (Is.emptystring(string)) return string

  return `${string[0].toUpperCase()}${string.substr(1)}`
}

const Utilities = {
  findBy,
  deleteFromArray,
  keyShouldBeCopied,
  deepCopy,
  capitalize,
}

export { Utilities }
