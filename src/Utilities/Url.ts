
const urlAbsolute = (url: string): string => (new URL(url, document.baseURI)).href

const Url = { absolute: urlAbsolute }

export { Url, urlAbsolute }
