const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

// POST /User - Create a new User
router.post( '/register',[
  body('username','ENter atleast 4 characters').notEmpty().isLength({min:4}),
  body('name','ENter atleast 4 characters').notEmpty().isLength({min:4}),
  body('password','ENter atleast 4 characters').notEmpty().isLength({min:4}),
  body('age','SHould be numeric').notEmpty().isNumeric(),
],async(req,res)=>{
      const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        const {username, password, age, name} = req.body;

        //check duplicate username
        const check = await User.findOne({ username });
        if (check) {
        return res.status(401).json({ message: 'username already in use.' });
        }

        // 1. Define the salt rounds (e.g., 10)
        const saltRounds = 10;

        // 2. Generate the hash
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Create the user with the HASHED password
        const newUser = await User.create({
        username,
        name,
        age,
        password: hashedPassword // <--- Store the hash, NOT the plaintext password
        });

        res.status(200).json(newUser);
    }catch(err){
        res.status(400).json({message:err.message});
    }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. Compare the plaintext password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Passwords do not match
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Password matched! Proceed with generating a JWT token (as discussed previously)
    // ... JWT generation logic here ...
    const payload = {
        user:{
            // The user's ID is the most important claim
            id: user.id, 
            // Other necessary data, like role
            username: user.username 
          }
        };

        //  Token Generation
        const token = jwt.sign(
        payload,
        process.env.JWT_SECRET, // The secret key from .env
        { expiresIn: '1h' }     // Option: Token expires in 1 hour
        );
    
        res.status(200).json({
        message: 'Login successful!',
        token: token, // Send the token back to the client
        user: { id: user._id, username: user.username }
        });

  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;