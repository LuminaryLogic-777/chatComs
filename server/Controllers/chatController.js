const chatModel=require('../Models/chatModel');



//create chats
const createChats=async(req,res)=>{
    const {firstId,secondId}=req.body;
    try{
        const chat=await chatModel.findOne({
            members:{$all:[firstId,secondId]}
        });
        if(chat){
            return res.status(200).json(chat);
        }else{
            const newChat=new chatModel({
                members:[firstId,secondId]
            });
            await newChat.save();
            res.status(200).json(newChat);
        }
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}
//get User chats

const getUserChats=async(req,res)=>{
    const chatId=req.params.userId;
    try{
        const chats=await chatModel.find({
            members:{$in:[chatId]}
        });
        res.status(200).json(chats);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}
//find chats

const findChats=async(req,res)=>{
    const {firstId,secondId}=req.params;
    try{
        const chats=await chatModel.find({
            members:{$all:[firstId,secondId]}
        });
        res.status(200).json(chats);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}


module.exports={createChats,getUserChats,findChats};