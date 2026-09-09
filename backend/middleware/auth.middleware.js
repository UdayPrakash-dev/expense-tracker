const jwt = require("jsonwebtoken");

function authMiddleWare(req,res,next){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                error:"Authorization token required!!"
            });
        }

        const [scheme, token ] = authHeader.split(" ");

        if(scheme!=="Bearer"||!token){
            return res.status(401).json({
                message:"Invalid authorisation token"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();


    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            message:"Invalid or expired token!"
        });
    }
}

module.exports = authMiddleWare;