const jwt = require("jsonwebtoken")
const withTokenAuth = (req,res,next)=>{
    console.log(req.headers);
    const token  = req.headers?.authorization?.split(" ")[1];
    if(!token){
        console.log(`here`);
        return res.status(403).json({msg:"invalid token"})
    }
    try {
        const tokenData = jwt.verify(token,process.env.JWT_SECRET)
        req.tokenData=tokenData;
        console.log(`This is called`);
        console.log(req.tokenData);
        next()
    } catch (error) {
        console.log(`here II`);
        return res.status(403).json({msg:"invalid token"})
    }
};

module.exports = withTokenAuth;