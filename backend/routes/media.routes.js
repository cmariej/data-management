const router = require('express').Router()

const multer = require('multer')

const auth = require('../middleware/auth')

const supabase = require('../supabase')

const DEFAULT_COVER =
  '/media/book-covers/cover-not-available.png'


// ========================================
// Multer
// ========================================

const upload = multer({
  storage: multer.memoryStorage()
})


// ========================================
// Bild hochladen
// ========================================

router.post(
  '/',
  auth,
  upload.single('image'),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: 'Kein Bild hochgeladen'
        })
      }

      const ext =
        req.file.originalname
          .split('.')
          .pop()

      const fileName =
        `${Date.now()}.${ext}`

      const filePath =
        `book-covers/${fileName}`

      const { error } =
        await supabase
          .storage
          .from('media')
          .upload(
            filePath,
            req.file.buffer,
            {
              contentType:
                req.file.mimetype,

              upsert: true
            }
          )

      if (error) {
        throw error
      }

      const { data } =
        supabase
          .storage
          .from('media')
          .getPublicUrl(filePath)

      res.json({
        path: data.publicUrl
      })

    } catch (err) {

      console.error(err)

      res.status(500).json({
        error: 'Upload fehlgeschlagen'
      })
    }
  }
)


// ========================================
// Bild löschen
// ========================================

router.delete(
  '/',
  auth,

  async (req, res) => {

    try {

      const { path: imagePath } =
        req.body

      if (
        !imagePath
        ||
        imagePath === DEFAULT_COVER
      ) {

        return res.status(400).json({
          error: 'Ungültiges Bild'
        })
      }

      // Nur Supabase media URLs erlauben

      if (
        !imagePath.includes('/media/')
      ) {

        return res.status(400).json({
          error: 'Ungültiger Pfad'
        })
      }

      // Dateipfad aus URL extrahieren

      const split =
        imagePath.split('/media/')

      if (split.length < 2) {

        return res.status(400).json({
          error: 'Ungültiger Pfad'
        })
      }

      const filePath =
        split[1]

      const { error } =
        await supabase
          .storage
          .from('media')
          .remove([filePath])

      if (error) {
        throw error
      }

      res.json({
        success: true
      })

    } catch (err) {

      console.error(err)

      res.status(500).json({
        error: 'Serverfehler'
      })
    }
  }
)

module.exports = router