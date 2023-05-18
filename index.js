const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())











app.get('', (req, res) => {
  res.send('ok ok')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})