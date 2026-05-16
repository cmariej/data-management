const router = require('express').Router()

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const auth = require('../middleware/auth')

const UPLOAD_DIR = path.join(
  __dirname,
  '../uploads/books'
)

const DEFAULT_COVER =
  '/uploads/books/cover-not-available.png'

if (!fs.existsSync(UPLOAD_DIR)) {

  fs.mkdirSync(
    UPLOAD_DIR,
    {
      recursive: true
    }
  )
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      UPLOAD_DIR
    )
  },

  filename: (req, file, cb) => {

    const ext = path.extname(
      file.originalname
    )

    const fileName =
      Date.now() + ext

    cb(
      null,
      fileName
    )
  }
})

const upload = multer({
  storage
})

router.post(
  '/',
  auth,
  upload.single('image'),

  (req, res) => {
    if (!req.file) {

      return res.status(400).json({
        error: 'Kein Bild hochgeladen'
      })
    }
    res.json({

      path:
        `/uploads/books/${req.file.filename}`
    })
  }
)

router.delete('/', auth, (req, res) => {

  try {

    const { path: imagePath } = req.body

    if (
      !imagePath
      ||
      imagePath === DEFAULT_COVER
    ) {

      return res.status(400).json({
        error: 'Ungültiges Bild'
      })
    }

    // Nur uploads/books erlauben
    if (
      !imagePath.startsWith(
        '/uploads/books/'
      )
    ) {

      return res.status(400).json({
        error: 'Ungültiger Pfad'
      })
    }

    const filePath = path.join(
      __dirname,
      '..',
      imagePath
    )

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath)

      return res.json({
        success: true
      })
    }

    return res.status(404).json({
      error: 'Datei nicht gefunden'
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: 'Serverfehler'
    })
  }
})

module.exports = router