const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



// Midleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.piqtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{
        await client.connect();
        const database = client.db('WorldTrip');
            const bookingCollection = database.collection('booking');

            // GET API
            app.get('/booking', async(req, res)=>{
                const cursor = bookingCollection.find({});
                const books = await cursor.toArray();
                res.send(books);
            })
            // GET SINGLE Item
            app.get('/books/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const book = await bookingCollection.findOne(query);
                res.json(book)
            })

            // POST API
            

            app.post('/booking', async(req, res)=>{
                const book = req.body;

               console.log('Hit the post api', book)
                const result = await bookingCollection.insertOne(book);
                console.log(result);
                res.json(result);
            })

             // DELETE API

             app.delete('/books/:id', async(req, res )=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const result = await bookingCollection.deleteOne(query);
                res.json(result);
                
            })

    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('World Trip server is running');
  
})
app.listen(port, ()=>{
    console.log('server running at port', port)
})