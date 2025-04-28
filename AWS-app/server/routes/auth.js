import jwt from 'jsonwebtoken'
import express from 'express';
import db from '../db.js';

const router = express.Router();

// Add secret key to .env
// JWT_SECRET=supersecretkey

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