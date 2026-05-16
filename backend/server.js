const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())


app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
)

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/projects', require('./routes/project.routes'))

app.use(
  '/api/upload',
  require('./routes/upload.routes')
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server läuft auf ${PORT}`)
})