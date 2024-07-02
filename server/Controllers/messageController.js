const messageModel=require("../Models/messageModel");

//creating a message
const createMessage=async(req,res)=>{
    const {chatId,senderId,text}=req.body;
    const message=new messageModel({chatId,senderId,text});
    try{    
        const response=await message.save();
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

//getting a messages
const getMessage=async(req,res)=>{
    const {chatId}=req.params;
    try{
        const messages=await messageModel.find({chatId});
        res.status(200).json(messages);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

module.exports={createMessage,getMessage}