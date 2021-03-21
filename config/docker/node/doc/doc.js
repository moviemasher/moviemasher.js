const fs = require('fs')
const content_replacement = 'CONTENT'
const navigation_replacement = 'NAVIGATION'
const description = 'This is a description that is long enough to get a sense of how this object will look once I actually write a description for it.'
const object_tag = 'article'

function fileRead(path) {
  try {
    return fs.readFileSync(path, 'utf8')
  } catch (err) {
    console.error('Error reading ' + path, err)
  }
}
function buildDocs() {
  const template = fileRead('/template.html')
  const sections_json = fileRead('/sections.json')
  const sections = JSON.parse(sections_json)
  sections.sort( (a, b) => a.id.localeCompare(b.id) )

  const content_tags = tagsForContent(sections)
  const navigation_tags = tagsForNavigation(sections)
  const content_html = template.replace(content_replacement, content_tags.join('\n'))
  const html = content_html.replace(navigation_replacement, navigation_tags.join('\n'))
  fs.writeFileSync('/doc/index.html', html)
}

function tagsForNavigation(sections) {
  const tags = []
  tags.push('<ul>')
  sections.forEach(object => {
    const type_tags = tagsForType(object.id, sections)
    tags.push('<li>')
    tags.push(...type_tags)
    tags.push('</li>')
  })
  tags.push('</ul>')
  return tags
}

function tagsForContent(sections) {
  const tags = []
  sections.forEach(object => {
    tags.push('<' + object_tag + ' id="' + object.id + '">')
    tags.push('<h2>' + object.id + '</h2>')
    tags.push('<div>' + description + '</div>')
    if (object.attributes) {
      const property_tags = tagsFromAttributes(object.attributes, sections)
      tags.push(...property_tags)
    }
    tags.push('</' + object_tag + '>')
  })
  return tags
}

function findById(sections, id) {
  return sections.find(object => id === object.id)
}

function tagsForType(type, sections) {
  const tags = []
  if (type) {
    const object = findById(sections, type)
    if (object) tags.push('<a href="#' + type + '">')
    tags.push(type)
    if (object) tags.push('</a>')
  }
  return tags
}

function tagsFromAttributes(attributes, sections) {
  const tags = []
  tags.push('<div class="attributes">')
  tags.push('<h3>Attributes</h3>')
  attributes.forEach( attribute => {
    const type_tags = tagsForType(attribute.type, sections)

    tags.push('<div class="attribute">')
    tags.push('<h4>' + attribute.id + ' ')
    tags.push(...type_tags)

    tags.push('</h3>')
    tags.push('<div>' + description + '</div>')
    tags.push('</div>')
  })
  tags.push('</div>')
  return tags
}

buildDocs()

