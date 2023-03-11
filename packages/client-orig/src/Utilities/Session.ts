
export const sessionGet = (key: string): string => {
  return globalThis.window.sessionStorage.getItem(key) || ''
}

export const sessionSet = (key: string, value: any) => {
  globalThis.window.sessionStorage.setItem(key, String(value))
}