const connectToMongo = require('./db');
const express = require('express')
const auth = require('./routes/auth');
const notes = require('./routes/notes');
const cors = require('cors')
connectToMongo()
const app = express()
const port = process.env.PORT || 3030
require('dotenv').config()

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

app.use('/api/auth',auth)
app.use('/api/notes',notes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
