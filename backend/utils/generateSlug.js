// turns a name into a url-friendly slug
// "Jane Doe" -> "jane-doe"

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

module.exports = generateSlug
