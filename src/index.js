import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const app = express()
const Url = "mongodb+srv://Sai_AWS:7024899020Ra@cluster0.jdovpis.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(Url)

app.use(express.json())
app.use(cors)

app.listen(5000,async () => {
    console.log('Server is Listening at Port 5000')
    client.connect()

    const db = client.db('sample_restaurants')
    const collection = db.collection('restaurants')
    const data = await collection.find({}).limit(10).toArray()
    console.log(data)

})