const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    text : { type : String , required : true},
    model : { type : String , required : true},
})

const ChatSchema = new mongoose.Schema({

    id : {type : Number , required : true , unique : true ,autoIncrement : true, default : 1 },
    messages : {type : [MessageSchema] , required : true }


})

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = Chat