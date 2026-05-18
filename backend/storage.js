const supabase =
  require('./supabase')

const BUCKET =
  'data'


// ========================================
// Projekte laden
// ========================================

async function loadProjects() {

  const {
    data,
    error
  } =
    await supabase
      .storage
      .from(BUCKET)
      .download('projects.json')

  if (error) {
    throw error
  }

  const text =
    await data.text()

  return JSON.parse(text)
}


// ========================================
// Datei laden
// ========================================

async function loadProject(
  projectName,
  fileName
) {

  const filePath =
    `${projectName}/${fileName}.json`

  const {
    data,
    error
  } =
    await supabase
      .storage
      .from(BUCKET)
      .download(filePath)

  if (error) {
    throw error
  }

  const text =
    await data.text()

  return JSON.parse(text)
}


// ========================================
// Schema laden
// ========================================

async function loadSchema(
  projectName,
  fileName
) {

  const filePath =
    `${projectName}/${fileName}.schema.json`

  const {
    data,
    error
  } =
    await supabase
      .storage
      .from(BUCKET)
      .download(filePath)

  if (error) {
    throw error
  }

  const text =
    await data.text()

  return JSON.parse(text)
}


// ========================================
// Datei speichern
// ========================================

async function saveProject(
  projectName,
  fileName,
  jsonData
) {

  const filePath =
    `${projectName}/${fileName}.json`

  const json =
    JSON.stringify(
      jsonData,
      null,
      2
    )

  const {
    error
  } =
    await supabase
      .storage
      .from(BUCKET)
      .upload(
        filePath,
        Buffer.from(json),
        {
          upsert: true,
          contentType:
            'application/json'
        }
      )

  if (error) {
    throw error
  }
}

module.exports = {

  loadProjects,

  loadProject,

  loadSchema,

  saveProject
}