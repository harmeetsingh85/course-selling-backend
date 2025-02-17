const jwt=require('jsonwebtoken');
const JWT_USER_SECRET="hellouser";

function userMiddleware(req,res,next){
    let token=req.headers.token;
    let check=jwt.verify(token,JWT_USER_SECRET);
    if(check){
        req.id=check.id;
        next();
    }
    else{
        res.json({"msg":"not authorized user"});
    }
}
module.exports=userMiddleware;