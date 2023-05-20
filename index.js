const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // get all data 
    app.get('/all_toys', async (req, res) => {
      const sortBy = req.headers?.sortby;
      const result = await toysCollection.find().sort({price:parseInt(sortBy)}).limit(20).toArray()
      res.send(result)
    })
    // dynamic search
    await toysCollection.createIndex({ name: 1 })
    app.get('/search/:searchText', async (req, res) => {
      const searchText = req.params.searchText;
      if (searchText) {
        const query = { name: { $regex: searchText, $options: 'i' } }
        const result = await toysCollection.find(query).limit(20).toArray()
        res.send(result)
      }
    })
 // filter by email
 app.get('/my_toys', async (req, res) => {
      
  const result = await toysCollection.find({ seller_email: req.query.email }).toArray()
  res.send(result)
})


    // patch single data
    app.patch('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updated = req.body
      const updateToy = {
        $set: {
          name: updated.name,
          seller_name: updated.seller_name,
          seller_email: updated.seller_email,
          img: updated.img,
          recommended_age: updated.recommended_age,
          manufacturer: updated.manufacturer,
          price: updated.price,
          size: updated.size,
          category: updated.category,
          sports_name: updated.sport_Name,
          description: updated.description,
          available_stock: updated.available_stock,
          material: updated.material
        },
      };
      const options = { upsert: true }
      const result = await toysCollection.updateOne(filter, updateToy, options)
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

    // delete
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query)
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