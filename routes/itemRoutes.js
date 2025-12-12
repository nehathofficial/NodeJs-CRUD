const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');
const multer = require('multer');
const path = require('path');
const isAuthenticated = require('../middleware/isAuthenticated');
const {body, validationResult} = require('express-validator');

// 1. Define storage strategy
const storage = multer.diskStorage({
  // Define the destination folder for the uploaded files
  destination: (req, file, cb) => {
    // Note: The 'uploads/' directory must exist in your project root!
    cb(null, 'uploads/'); 
  },
  // Define how the file should be named
  filename: (req, file, cb) => {
    // Create a unique file name: fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
// 2. Initialize the upload middleware
// 'upload' is now a function you can use in your routes.
const upload = multer({ storage: storage });

// POST /items - Create a new item
router.post( '/',isAuthenticated,[
  body('title','Title must be required and enter atleast 3 characters.').notEmpty().isLength({min:3,max:200}),
  body('description','Description must be required and enter atleast 3 characters.').notEmpty().isLength({min:3,max:400}),
  body('status','Status must be a string').optional().isString(),
] , upload.single('itemImage') ,async(req,res)=>{
    try{
        if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }
      const userID = req.user.id;
      const data = {
        "title": req.body.title,
        "user_id": userID,
        "description": req.body.description,
        "status": req.body.status,
        "fileName": req.file.filename,
        "filePath": req.file.path,
      }
      const newItem = await Item.create(data);
      return res.status(200).json({
          newItem,
          fileName: req.file.filename,
          filePath: req.file.path
        });
    }catch(err){
        return res.status(400).json({message:err.message});
    }
});

// GET /items - get all items 
router.get('/fetch-items',isAuthenticated , async (req,res)=>{
    try{
      const userID = req.user.id;
        const allItems = await Item.find({user_id:userID});
        return res.status(200).json(allItems);
    }catch(err){
        return res.status(400).json({message:err});
    }
});

// GET single item by id 
router.get('/item-detail/:id',isAuthenticated , async (req,res)=>{
    try{
      const userId = req.user.id;
        const singleItem = await Item.findById(req.params.id);
        if(singleItem == null){
            return res.status(400).json({message:"No record found by this id"});
        }
        return res.status(200).json(singleItem);
    }catch(err){
        return res.status(400).json({message:err});
    }
});

// Find by id and delete
router.delete('/item-delete/:id',isAuthenticated , async (req,res)=>{
    try{
      const userID = req.user.id;
        const check = await Item.findById(req.params.id);
        if(!check){
            return res.status(400).json({message:"Item not found!"});
        }

        if(check.user_id.toString() !== userID){
            return res.status(400).json({message:"You are not allowed to delete!"});
        }

        const deleteItem = await Item.findByIdAndDelete(req.params.id);
        if(deleteItem == null){
            return res.status(400).json({message:"Item deletion failed!"});
        }
        return res.status(200).json({message:"Item deleted successfully!"});
    }catch(err){
        return res.status(400).json({message:err});
    }
});


// Patch Update an item 
router.patch('/item-update/:id',isAuthenticated, upload.single('itemImage') , async (req,res)=>{
    try{
        const userID = req.user.id;
        const check = await Item.findById(req.params.id);
        if(!check){
            return res.status(400).json({message:"Item not found!"});
        }

        if(check.user_id.toString() !== userID){
            return res.status(400).json({message:"You are not allowed to update!"});
        }

         const data = {};
         data.title = req.body.title;
         data.description = req.body.description;
         if (req.file) {
          data.fileName = req.file.filename;
          data.filePath = req.file.path;
         }

        const updateItem = await Item.findByIdAndUpdate(req.params.id, {$set:data}, {new:true});
       // const updateItem = await Item.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(updateItem == null){
            return res.status(400).json({message:"No record found by this id"});
        }
        return res.status(200).json(updateItem);
    }catch(err){
        return res.status(400).json({message:err});
    }
});

// POST /item/upload-single
router.post('/upload-single', upload.single('itemImage'), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // The file information is available in req.file
  //console.log(req.file);

  // You can now save the path (req.file.path) to your MongoDB database
  res.status(200).json({
    message: 'File uploaded successfully!',
    fileName: req.file.filename,
    filePath: req.file.path
  });
});

// POST /item/upload-multiple
// maxCount is optional, e.g., 5
router.post('/upload-multiple', upload.array('itemImages', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // The file information is available in req.files (an array)
  console.log(req.files);

  res.status(200).json({
    message: 'Files uploaded successfully!',
    count: req.files.length,
    files: req.files.map(f => f.filename)
  });
});

module.exports = router;