require('dotenv').config()

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())

// Default Bilder lokal

app.use(
  '/media',
  express.static(
    path.join(__dirname, 'media')
  )
)


// Upload API

app.use(
  '/api/media',
  require('./routes/media.routes')
)

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/projects', require('./routes/project.routes'))

app.use(
  '/api/upload',
  require('./routes/media.routes')
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server läuft auf ${PORT}`)
})