import fs from 'fs'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const svgStringFromComponent = component => {
  const element = React.createElement(component, {})
  const svgString = ReactDOMServer.renderToStaticMarkup(element)
  const string = svgStringClean(svgString)

  if (!string.includes('currentColor')) {
    console.warn(`Component ${component.name} does not include 'currentColor'`)
  }
  return string
}

export const svgStringClean = svgString => {
  // extract just the SVG tag
  const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/
  const svgMatch = svgString.match(svgRegex)
  let string = svgMatch ? svgMatch[0] : ''
  if (!string) throw new Error(`No SVG element in ${svgString}`)

  // remove whitespace between tags
  const whitespaceBetweenTagsRegex = />\s+</g
  string = string.replace(whitespaceBetweenTagsRegex, '><')

  // remove whitespace before tag close
  const whitespaceBeforeEndtag = /\s+\/>/g 
  string = string.replace(whitespaceBeforeEndtag, '/>')

  // remove whitespace around equals sign
  const whitespaceAroundEqualsRegex = /\s*=\s*/g
  string = string.replace(whitespaceAroundEqualsRegex, '=')

  // replace all whitespace and newlines with single space
  const whitespaceRegex = /\s+/g
  string = string.replace(whitespaceRegex, ' ')
  
  // convert double quoted attributes to single quotes where possible
  const attributesRegex = /(\w+)="([^"]*)"/g
  string = string.replace(attributesRegex, (full, name, value) => {
    const trimmed = value.trim()
    const quoteMark = trimmed.includes("'") ? '"' : "'"
    return `${name}=${quoteMark}${trimmed}${quoteMark}`
  })

  // // remove single quoted width attribute from first tag
  // const widthRegex = /\swidth='[^']+'[^>]*?/
  // string = string.replace(widthRegex, '')

  // // remove single quoted height attribute from first tag
  // const heightRegex = /\sheight='[^']+'[^>]*?/
  // string = string.replace(heightRegex, '')
  
  // include version attribute unless specified
  if (!string.includes('version=')) {
    string = string.replace(/<svg/, "<svg version='1.1'")
  }

  // include namespace attribute unless specified
  if (!string.includes('xmlns=')) {
    string = string.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'")
  }
  
  return string
}

export const svgStringFromFile = svgPath => {
  return svgStringClean(fs.readFileSync(svgPath, 'utf8')) 
}