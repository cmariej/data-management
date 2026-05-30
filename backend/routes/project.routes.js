const router = require('express').Router()
const auth = require('../middleware/auth')
const storage = require('../storage')


router.get('/', async (req, res) => {
  try {
    const projects = await storage.loadProjects()
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Fehler beim Laden der Projekte',
      error: err.message
    })
  }
})


router.get('/:project/:file/schema', async (req, res) => {
  try {
    const schema = await storage.loadSchema(
      req.params.project,
      req.params.file
    )
    res.json(schema)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Fehler beim Laden des Schemas',
      error: err.message
    })
  }
})


router.get('/:project/:file', async (req, res) => {
  try {
    const data = await storage.loadProject(
      req.params.project,
      req.params.file
    )
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Fehler beim Laden der Datei',
      error: err.message
    })
  }
})


router.put('/:project/:file', auth, async (req, res) => {
  try {
    await storage.saveProject(
      req.params.project,
      req.params.file,
      req.body
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Fehler beim Speichern',
      error: err.message
    })
  }
})


module.exports = router
