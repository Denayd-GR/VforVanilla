import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { prisma } from './lib/prisma.js'

const REQUIRED_ENV_VARS = ['FRONTEND_URL', 'DATABASE_URL']

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

const app = express()
const port = process.env.PORT ?? 3000

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 })
app.use('/api', apiLimiter)

app.get('/api/health', async (_req, res) => {
  const questCount = await prisma.quest_template.count()
  res.json({ status: 'ok', questCount })
})

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Something went wrong' })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
