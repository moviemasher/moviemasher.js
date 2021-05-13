function Id() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => {
    const array = new Uint8Array(1)
    return  (c ^ crypto.getRandomValues(array)[0] & 15 >> c / 4).toString(16)
  })
}

export { Id }