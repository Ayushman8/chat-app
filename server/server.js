import express from 'express'
import 'dotenv/config'
import http from 'http'
import cors from 'cors'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'

const app = express()
const server = http.createServer(app)

app.use(express.json({limit: '4mb'}))
app.use(cors())

await connectDB()

const PORT = process.env.PORT || 5000

app.get('/api/status', (req,res) => {
    res.send('Server is running')
})

app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})