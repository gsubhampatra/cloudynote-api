const connectToMongo = require('./db');
const express = require('express')
const auth = require('./routes/auth');
const notes = require('./routes/notes');
connectToMongo()
const app = express()
const port = process.env.PORT || 3030
require('dotenv').config()

app.use(express.json())

app.use('/api/auth',auth)
app.use('/api/notes',notes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
