const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())






const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.sgqndpo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const toysCollection = client.db("sportsToysDB").collection("toys");

    app.get('/toys', async (req, res) => {
      const result = await toysCollection.find().toArray()
      res.send(result)
    })
    // post
    app.post('/', async (req, res) => {
      const newToy = req.body
      console.log(newToy);
      const result = await toysCollection.insertOne(newToy)
      res.send(result)
    })
    // get by category
    app.get('/category/:text', async (req, res) => {
      const category = req.params.text;
      const result = await toysCollection.find({ sport_Name: { $regex: new RegExp(category, 'i') } }).toArray()
      res.send(result)
    })

    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('ok ok')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})