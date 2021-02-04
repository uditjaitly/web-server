const jwt=require('jsonwebtoken')


const auth=async (req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer','')
    //console.log(token)
    const vv= jwt.verify(token,'barca')

    console.log(vv.id)
    }
    catch(e){
        res.status(401).send({error:"Please Authenticate"})
    }
}

module.exports=auth