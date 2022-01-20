
const fetchJson = (object: Object): Object => {
  return {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(object),
  }
}

export { fetchJson }
