const mongoose = require('mongoose')

const schema = mongoose.Schema
const user_schema = new schema({
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    blood:{
        type:String,
        required:true
    },
    pmh:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pwd:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('registeruser',user_schema)