import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';
import { authRouter } from './routes/auth'
import { authMiddleware } from './middleware/auth.middleware';

const app = new Hono()

app.use('*', logger(), cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type"],
  exposeHeaders: ["Set-Cookie"],
}));

app.route('/api/auth', authRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch.bind(app),
}
