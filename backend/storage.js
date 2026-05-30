const fs = require('fs/promises')
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')


async function loadProjects() {
  const text = await fs.readFile(
    path.join(DATA_DIR, 'projects.json'),
    'utf8'
  )
  return JSON.parse(text)
}


async function loadProject(projectName, fileName) {
  const text = await fs.readFile(
    path.join(DATA_DIR, projectName, `${fileName}.json`),
    'utf8'
  )
  return JSON.parse(text)
}


async function loadSchema(projectName, fileName) {
  const text = await fs.readFile(
    path.join(DATA_DIR, projectName, `${fileName}.schema.json`),
    'utf8'
  )
  return JSON.parse(text)
}


async function saveProject(projectName, fileName, jsonData) {
  await fs.writeFile(
    path.join(DATA_DIR, projectName, `${fileName}.json`),
    JSON.stringify(jsonData, null, 2),
    'utf8'
  )
}


module.exports = {
  loadProjects,
  loadProject,
  loadSchema,
  saveProject
}
