import express from 'express'
import cors from 'cors'
import { GridFSBucket, MongoClient } from 'mongodb'
import fs from 'fs'
import fileupload from "express-fileupload";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const Url = "mongodb+srv://Sai_AWS:7024899020Ra@cluster0.jdovpis.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(Url)

app.use(express.json())
app.use(cors())
app.use(fileupload())
let db = null

app.listen(5000,async () => {
    console.log('Server is Listening at Port 5000')
    client.connect()

    db = client.db('FilesData')
    // const collection = db.collection('Files')
    // const data = await collection.find({}).limit(10).toArray()

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
    cursor.forEach(doc => {

        console.log(doc.filename)

        bucket.openDownloadStreamByName(doc.filename).
        pipe(fs.createWriteStream(`${__dirname}/Images/${doc.filename}`))
    })
    
})

app.post('/data', async (req, res) => {
    console.log('/data Called')
    // console.log(`${__dirname}/Images/${req.files.Image.name}`)
    const Image = req.files.Image
    Image.mv(`${__dirname}/Images/${Image.name}`,Image.name)

    console.log(Image)

    const bucket = new GridFSBucket(db,{bucketName:"Images"})
    fs.createReadStream(`${__dirname}/Images/${req.files.Image.name}`).
        pipe(bucket.openUploadStream(`${Image.name}`,{
            chunkSizeBytes:1048576,
            metadata:{
                name : Image.name
            }
        }))

})