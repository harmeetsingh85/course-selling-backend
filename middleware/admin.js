const jwt=require('jsonwebtoken');
const JWT_ADMIN_SECRET="helloadmin";
function adminMiddleware(req,res,next){
    let token=req.headers.token;
    let check=jwt.verify(token,JWT_ADMIN_SECRET);
    if(check){
        req.id=token.id;
        next();
    }
    else{
        res.json({"msg":"not authorized admin"});
    }
}
module.exports=adminMiddleware;