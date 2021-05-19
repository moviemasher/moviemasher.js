import { Errors } from "../Setup"
import { Is } from "./Is"

const unlessInstanceOf = (object, klass, error) => {
  if (!Is.instanceOf(object, klass)) throw error || Errors.wrongClass + klass.name
}

const Throw = {
  unlessInstanceOf,
}

export { Throw }