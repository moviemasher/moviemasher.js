const Id = () : string => {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`
}

export { Id }
