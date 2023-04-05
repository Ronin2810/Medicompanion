const express=require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const path = require('path')
const app = express()

// create application/json parser
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//use css files
app.use("/static",express.static("static"))

// data
app.use(express.static('data'))

const db_name = 'mongodb://127.0.0.1:27017/db_web'
mongoose.connect(db_name)
.then(()=>{
    console.log("MongoDB Connection Successful");
})
.catch((err)=>{
    console.log(err);
})
const db = mongoose.connection


app.set('view engine','ejs')

const port = process.env.port || 8080
app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
})

app.use('/',router)










// adityapatilsy
// d18gRExdmkf7xWDw