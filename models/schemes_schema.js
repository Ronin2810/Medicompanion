const mongoose = require('mongoose')
const schema = mongoose.Schema

const schemes_schema = new schema({
    name:{
        type:String,
        required:true
    },
    data:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('schemes',schemes_schema)
