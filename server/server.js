import express from 'express'
import 'dotenv/config'
import http from 'http'
import cors from 'cors'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'

// Create express app and HTTP server
const app = express()
const server = http.createServer(app)

// Middleware setup
app.use(express.json({limit: '4mb'}))
app.use(cors())

// Routes Setup
app.get('/api/status', (req,res) => {
    res.send('Server is running')
})

app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// Connect to Database
await connectDB()

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})