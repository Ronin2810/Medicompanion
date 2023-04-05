const mongoose = require('mongoose')
const schema = mongoose.Schema

const meds_schema = new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    alt:{
        type:String,
        required:true
    }
})

// const data1 = new meds_schema({
//     name:"M1",
//     alt:"A1"
// })
// const data2 = new meds_schema({
//     name:"M2",
//     alt:"A2"
// })
// const data3 = new meds_schema({
//     name:"M3",
//     alt:"A3"
// })

// data1.save()
// .then(()=>{
//     console.log("data1 saved");
// })
// data2.save()
// .then(()=>{
//     console.log("data2 saved");
// })
// data3.save()
// .then(()=>{
//     console.log("data3 saved");
// })


module.exports = mongoose.model('meds',meds_schema)
