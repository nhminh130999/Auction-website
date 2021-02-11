const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth= require("../Middleware/check_auth")
const Post = require("../Models/Post_model");
const PostController = require("../Controllers/post")
const multer = require("multer");
const { query } = require("express");
const storage = multer.diskStorage({
  destination:function(req,file,cb)
  {
    cb(null,'./Photos/')
  },
  filename:function(req,file,cb ){
    cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname)
  }
})
const fileFilter = (req,file,cb)=>{
  if(file.mimetype==='image/jpeg'||file.mimetype==='image/png')
  {
    cb(null,true)
  }
  else
  {
    cb(null,false)
  }
}
const upload= multer({
  storage: storage,
  limits:{
    fileSize: 1024*1024*5
  },
  fileFilter: fileFilter
})
//const upload = multer({dest: 'uploads/'})

function escapeRegex(text) {
  text = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  return text
};

router.get("/search", (req, res, next) => {
  
 if(!req.query.brand && !req.query.amount && req.query.tittle)
 {
  const filtertittle = new RegExp(escapeRegex(req.query.tittle), 'gi');
  //console.log("TEST"+ req.query.brand);
  Post.find({tittle: filtertittle}).then((doc)=>{
    if(doc)
    {
      if(doc.length!=0)
      {
        doc.forEach((item)=>{
          res.status(200).json(item)
        })
      }
      else
      {
        res.status(200).json({
          message:"No item found"
        });
      }
    }
  }).catch((err)=>{
    res.status(501).json({
      error: err
    })
  })
 }
 ///****neu co start_bid_amount va k co brand */
else if(!req.query.brand && req.query.amount && req.query.tittle)//khong query dc cho trong array
{
  //console.log("This code make in the condition")
  const filtertittle = new RegExp(escapeRegex(req.query.tittle), 'gi');
  const filteramount = new RegExp(escapeRegex(req.query.amount), 'gi');
  /*var qamount = "bids.amount",qtittle="tittle";
  var q ={};
  q[qamount]= filteramount*/
  //q[qtittle]= filtertittle
  //console.log("TEST"+ req.query.amount);
  Post.find({tittle: filtertittle}).then((doc)=>{
    console.log("DOC IS: "+doc)
    if(doc)
    {
      if(doc.length!=0)
      {
        doc.forEach((item)=>{
          if(item.amount== req.query.amount)
          {
            res.status(200).json(item);
          }
        })
      }
      else
      {
        res.status(200).json({
          message: "No item found"
        });
      }
    }
  }).catch((err)=>{
    console.log("ERROR"+err)
    res.status(501).json({
      error: err
    })
  })
}
//neu co brand va khong co start_bid_amount
else if(req.query.brand && !req.query.amount && req.query.tittle)//
{
  const filtertittle = new RegExp(escapeRegex(req.query.tittle), 'gi');
  const filterbrand = new RegExp(escapeRegex(req.query.brand), 'gi');
  console.log("TEST"+ filterbrand+"AND"+filtertittle);
  Post.find({tittle: filtertittle, brand: filterbrand}).then((doc)=>{
    if(doc)
    {
      if(doc.length!=0)
      {
        doc.forEach((item)=>{
          res.status(200).json(item)
        })
      }
      else
      {
        res.status(200).json({
          message:"No item found"
        });
      }
    }
  }).catch((err)=>{
    res.status(501).json({
      error: err
    })
  })
}
//neu co ca 3
else if(req.query.brand && req.query.amount && req.query.tittle)
{
  const filtertittle = new RegExp(escapeRegex(req.query.tittle), 'gi');
  const filterbrand = new RegExp(escapeRegex(req.query.brand), 'gi');
  
  Post.find({tittle: filtertittle, brand: filterbrand}).then((doc)=>{
    console.log("DOC IS: "+doc)
    if(doc)
    {
      if(doc.length!=0)
      {
        
        doc.forEach((item)=>{
          console.log("MAKE IT LINE 151 "+ item.bid.amount)
          if(item.amount== req.query.amount)
          {
            
            res.status(200).json(item);
            res.end();
            
          }
        })
      }
      else
      {
        res.status(200).json({
          message: "No item found"
        });
      }
    }
  }).catch((err)=>{
    console.log("ERROR"+err)
    res.status(501).json({
      error: err
    })
  })
}
});

router.get("/",PostController.get_post_all );
router.post("/",upload.single('PhotoURLs'),auth,(req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    tittle: req.body.tittle,
    sellerid: req.userData.userid,
    description: req.body.description,
    brand: req.body.brand,
    condition: req.body.condition,
    photoURLs: req.file.path,
    //category: req.body.category,
    amount: req.body.amount,
    start_bid_amount: req.body.start_bid_amount,
    time_start: req.body.time_start,
    time_end: req.body.time_end
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "posted!!!",
      });
      res.end();
    })
    .catch((err) => console.log(err));

});

router.delete("/:postId",(req,res)=>{
  const id = req.params.postId;
  Post.remove({_id:id}).then((doc)=>{
    res.status(200).json({
      message:"Post deleted!"
    })
  }).catch((err)=>{
    console.log(err);
    res.json(err);
  })
})

router.patch("/:postId",(req,res)=>{
  const id= req.params.postId;
  updatedOps = new {};
  for(const ops of req.body)
  {
    updatedOps[ops.updatedName]=ops.value;
  }
  Post.update({_id:id},{$set: updatedOps}).then((doc)=>{
    res.status(200).json({
      message: "Updated"
    })
  }).catch(err=>{
    console.log(err);
    res.json({err});
  })
})

router.get("/:postId", (req, res, next) => {
  const id = req.params.postId;
  Post.findById(id).then((doc)=>{
    if(doc)
    {
      res.status(200).json(doc);
    }
    else
    {
      res.json({
        message: "No Post found"
      })
    }
  }).catch((err)=>{
    console.log(err);
    res.status(400).json(err)
  }) 
});





module.exports = router;
