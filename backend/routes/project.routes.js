const router = require('express').Router()

const auth = require('../middleware/auth')

const supabase = require('../supabase')


// ========================================
// Projekte laden
// ========================================

router.get('/', async (req, res) => {

  try {

    const {
      data,
      error
    } =
      await supabase
        .storage
        .from('data')
        .download('projects.json')

    if (error) {
      throw error
    }

    const text =
      await data.text()

    const projects =
      JSON.parse(text)

    res.json(projects)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message:
        'Fehler beim Laden der Projekte',

      error:
        err.message
    })
  }
})


// ========================================
// Schema laden
// ========================================

router.get(
  '/:project/:file/schema',

  async (req, res) => {

    try {

      const filePath =
        `${req.params.project}/${req.params.file}.schema.json`

      const {
        data,
        error
      } =
        await supabase
          .storage
          .from('data')
          .download(filePath)

      if (error) {
        throw error
      }

      const text =
        await data.text()

      res.json(
        JSON.parse(text)
      )

    } catch (err) {

      console.error(err)

      res.status(500).json({
        message:
          'Fehler beim Laden des Schemas',

        error:
          err.message
      })
    }
  }
)


// ========================================
// JSON laden
// ========================================

router.get(
  '/:project/:file',

  async (req, res) => {

    try {

      const filePath =
        `${req.params.project}/${req.params.file}.json`

      const {
        data,
        error
      } =
        await supabase
          .storage
          .from('data')
          .download(filePath)

      if (error) {
        throw error
      }

      const text =
        await data.text()

      res.json(
        JSON.parse(text)
      )

    } catch (err) {

      console.error(err)

      res.status(500).json({
        message:
          'Fehler beim Laden der Datei',

        error:
          err.message
      })
    }
  }
)


// ========================================
// JSON speichern
// ========================================

router.put(
  '/:project/:file',

  auth,

  async (req, res) => {

    try {

      const filePath =
        `${req.params.project}/${req.params.file}.json`

      const json =
        JSON.stringify(
          req.body,
          null,
          2
        )

      const { error } =
        await supabase
          .storage
          .from('data')
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

      res.json({
        success: true
      })

    } catch (err) {

      console.error(err)

      res.status(500).json({
        message:
          'Fehler beim Speichern',

        error:
          err.message
      })
    }
  }
)

module.exports = router