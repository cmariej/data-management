const router = require('express').Router()

const fs = require('fs')
const path = require('path')

const auth = require('../middleware/auth')

const DATA_DIR = path.join(
  __dirname,
  '../data'
)

// Alle Routes schützen
router.use(auth)


// ========================================
// Projekte auflisten
// ========================================

router.get('/', (req, res) => {

  try {

    const projects =
      fs.readdirSync(DATA_DIR)

    const result = projects.map(project => {

      const projectPath = path.join(
        DATA_DIR,
        project
      )

      const files =
        fs.readdirSync(projectPath)

          .filter(file =>
            file
              .toLowerCase()
              .endsWith('.json')
              &&
            !file
              .toLowerCase()
              .endsWith('.schema.json')
          )

          .map(file =>
            file.replace('.json', '')
          )

      return {
        name: project,
        files
      }
    })

    res.json(result)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message:
        'Fehler beim Laden der Projekte'
    })
  }
})


// ========================================
// Schema laden
// WICHTIG:
// MUSS vor /:project/:file stehen
// ========================================

router.get(
  '/:project/:file/schema',
  (req, res) => {

    try {

      const schemaPath = path.join(
        DATA_DIR,
        req.params.project,
        `${req.params.file}.schema.json`
      )

      const schema = JSON.parse(
        fs.readFileSync(
          schemaPath,
          'utf-8'
        )
      )

      res.json(schema)

    } catch (err) {

      console.error(err)

      res.status(500).json({
        message:
          'Fehler beim Laden des Schemas'
      })
    }
  }
)


// ========================================
// Einzelne JSON-Datei laden
// ========================================

router.get('/:project/:file', (req, res) => {

  try {

    const filePath = path.join(
      DATA_DIR,
      req.params.project,
      `${req.params.file}.json`
    )

    const data = JSON.parse(
      fs.readFileSync(
        filePath,
        'utf-8'
      )
    )

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message:
        'Fehler beim Laden der Datei'
    })
  }
})


// ========================================
// Datei speichern
// ========================================

router.put('/:project/:file', (req, res) => {

  try {

    const filePath = path.join(
      DATA_DIR,
      req.params.project,
      `${req.params.file}.json`
    )

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        req.body,
        null,
        2
      )
    )

    res.json({
      success: true
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message:
        'Fehler beim Speichern'
    })
  }
})

module.exports = router