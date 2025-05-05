import jwt from 'jsonwebtoken'
import express from 'express';
import db from '../db.js';

const router = express.Router();

// Add secret key to .env
// JWT_SECRET=supersecretkey

// Signup Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    const user = users[0]

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.status(200).json({ message: 'Login successful', token, name: user.name })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router;