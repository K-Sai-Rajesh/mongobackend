import express from 'express'
import cors from 'cors'
import { GridFSBucket, MongoClient } from 'mongodb'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const Url = "mongodb+srv://Sai_AWS:7024899020Ra@cluster0.jdovpis.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(Url)

app.use(express.json())
app.use(cors)

app.listen(5000,async () => {
    console.log('Server is Listening at Port 5000')
    client.connect()

    const db = client.db('FilesData')
    const collection = db.collection('Files')
    const data = await collection.find({}).limit(10).toArray()
    console.log(data)

    const bucket = new GridFSBucket(db,{bucketName:"Images"})
    // fs.createReadStream(`${__dirname}/Images/image.jpg`).
    //     pipe(bucket.openUploadStream("image",{
    //         chunkSizeBytes:1048576,
    //         metadata:{
    //             field:"firstImageData",
    //             value : "firstImageFile"
    //         }
    //     }))

    const cursor = bucket.find({})
    cursor.forEach(doc => console.log(doc._id))

    bucket.openDownloadStreamByName("image").
        pipe(fs.createWriteStream(`${__dirname}/Images/file.jpg`))
    
})

// ObjectId("62caf665a3e33c3e7c6ef6e9")