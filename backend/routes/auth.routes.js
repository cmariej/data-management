const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // users.json laden
    const usersPath = path.join(__dirname, '../users.json')

    const users = JSON.parse(
      fs.readFileSync(usersPath, 'utf-8')
    )

    // Benutzer suchen
    const user = users.find(u => u.username === username)

    if (!user) {
      return res.status(401).json({
        message: 'Ungültiger Benutzername oder Passwort'
      })
    }

    // Passwort prüfen
    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({
        message: 'Ungültiger Benutzername oder Passwort'
      })
    }

    // JWT erzeugen
    const token = jwt.sign(
      {
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    )

    // Antwort
    res.json({
      token
    })

  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: 'Serverfehler'
    })
  }
})

module.exports = router