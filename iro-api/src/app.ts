import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import config from './app/config'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFoundAPIHandler from './app/middlewares/notFoundAPIHandler'
import { globalLimiter } from './app/middlewares/rateLimit'
import requestLogger from './app/middlewares/requestLogger'
import router from './app/routes'

const app: Application = express()
app.disable('x-powered-by')
// correct client IP behind a reverse proxy (needed for rate limits and audit logs)
if (config.NODE_ENV === 'production') app.set('trust proxy', 1)

app.use(requestLogger)
app.use(helmet())
app.use(compression())

//parsers
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

/** credentials: true is required for the refresh-token cookie */
app.use(cors({ origin: config.cors_origins, credentials: true }))

// welcome route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the IRO API Server')
})

// health checks (liveness / readiness) for load balancers and Docker
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})
app.get('/health/ready', (req: Request, res: Response) => {
  const ready = mongoose.connection.readyState === 1
  res
    .status(ready ? 200 : 503)
    .json({ status: ready ? 'ready' : 'unavailable' })
})

app.use(globalLimiter)

// application routes
app.use('/api/v1', router)

// global error handler
app.use(globalErrorHandler)

//Not Found API Route Handler
app.use(notFoundAPIHandler)

export default app
