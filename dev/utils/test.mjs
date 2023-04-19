export const updateCompetedPromise = el => {
  return new Promise((resolve) => {
    const id = setInterval(async () => {
      console.log(el, el.constructor.name)
      const updating = await el.updateComplete
      console.debug('updateCompetedPromise', updating)
      if (updating) {
        clearInterval(id)
        resolve(null)
      }
    }, 500)
  })
}