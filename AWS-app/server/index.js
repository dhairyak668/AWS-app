import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import listingRoutes from './routes/listings.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`))


