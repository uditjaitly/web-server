const jwt=require('jsonwebtoken')

const generateWebToken=async (userID)=>{
    const token=jwt.sign({id:userID.toString()},'barca',{expiresIn:"1 days"})
    console.log(token)
    return token
}

module.exports=generateWebToken