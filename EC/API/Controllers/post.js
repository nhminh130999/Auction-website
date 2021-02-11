const express = require("express");
const mongoose = require("mongoose");
const auth= require("../Middleware/check_auth")
const Post = require("../Models/Post_model");
exports.get_post_all= (req, res, next) => {
    //console.log("TITTLE"+req.query)
    Post.find()
        .then((doc)=>{
      if(doc.length>0)
      {
        res.status(200).json(doc);
      }
      else
      {
        res.json({
          message:"No post found"
        });
      }
    }).catch(err=>{
      console.log(err);
      res.json(err);
    })
  
  }