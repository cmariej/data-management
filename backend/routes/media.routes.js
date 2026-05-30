const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs/promises')
const auth = require('../middleware/auth')

const MEDIA_DIR = path.join(__dirname, '..', 'media', 'book-covers')
const DEFAULT_COVER = '/media/book-covers/cover-not-available.png'

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, MEDIA_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  }
})

const upload = multer({ storage })


router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Kein Bild hochgeladen' })
    }
    res.json({ path: `/media/book-covers/${req.file.filename}` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


router.delete('/', auth, async (req, res) => {
  try {
    const { path: imagePath } = req.body

    if (!imagePath || imagePath === DEFAULT_COVER) {
      return res.status(400).json({ error: 'Ungültiges Bild' })
    }

    if (!imagePath.startsWith('/media/book-covers/')) {
      return res.status(400).json({ error: 'Ungültiger Pfad' })
    }

    const fileName = path.basename(imagePath)
    await fs.unlink(path.join(MEDIA_DIR, fileName))
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Serverfehler' })
  }
})


module.exports = router
