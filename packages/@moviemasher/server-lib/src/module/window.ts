import { JSDOM } from 'jsdom'

export default () => {
  const dom = new JSDOM(
    '<html><body></body></html>',
    { runScripts: 'dangerously', resources: 'usable' }
  )
  const { window } = dom
  return { data: window }
}

