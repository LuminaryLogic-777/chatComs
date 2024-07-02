const express=require('express');
const {createChats,getUserChats,findChats}=require('../Controllers/chatController');
const router=express.Router();

router.post("/",createChats);
router.get("/:userId",getUserChats);
router.get("/:firstId/:secondId",findChats);

module.exports=router;