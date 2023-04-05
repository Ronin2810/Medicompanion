const mongoose = require('mongoose')
const schema = mongoose.Schema

const comment_schema = new schema({
    user:{
        type:String,
        required:true
    },
    data:{
        type:String,
        required:true,
    },
    blog_id:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model('comments',comment_schema)
