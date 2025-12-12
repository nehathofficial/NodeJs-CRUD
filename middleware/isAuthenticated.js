const jwt = require('jsonwebtoken');

const isAuthenticated = (req,res,next) => {

    const token = req.header('auth-token');

    if(!token){
        return res.status(401).json({message:"Please provide authentication token!"});
    }

    try{
        const string = jwt.verify(token, process.env.JWT_SECRET);
        req.user = string.user;
        next();

    }catch(err){
        return res.status(400).json({message:err});
    }
}

module.exports = isAuthenticated;