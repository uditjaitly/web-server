const express=require('express')
const bcrypt=require('bcrypt')
const auth=require('../middleware/auth')
const generateWebToken=require('../utils/generateWebToken')
const user=new express.Router()
const User=require('../model/userModel')
user.get('/users',async (req,res)=>{
    try{
        const users= await User.find({})
       
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }

})

user.get("/users/:id", async (req, res) => {
    const userID= req.params.id
    try{
        const user=await User.findById(userID)
        if(!user){
            return res.status(400).send("User Not Found")
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
});
//////SIGN UP////////
user.post("/users/",async (req,res)=>{
    const user=await new User(req.body)
    const token=await generateWebToken(user._id)
    user.tokens=user.tokens.concat({token:token})

    try{
        await user.save()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)

    }
    res.send("Received");
})

user.patch("/users/:id",async (req,res)=>{
    const updates=Object.keys(req.body)
    console.log(updates)
    try{
        const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })

        await user.save()
       


        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        if(!user){
            return res.status(400).send("User Not Found")
        }
        res.send(user)
    }catch(e){
        res.send(e)
    }

})

user.delete("/users/:id",async (req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(400).send("User Not Found")
        }
        res.send(user)
    }catch(e){
        res.send(e)
    }
})
///////LOG IN/////////
user.post('/users/login/',auth,async (req,res)=>{
    try{
        const user=await User.findOne({'email':req.body.email})
        
        console.log(user)
        if(!user){
            console.log("not found")
            return res.status(404).send('User not found')
        }
        
        const checkPassword= await bcrypt.compare(req.body.password,user.password)
        console.log(checkPassword)
        if(checkPassword){
            const token=await generateWebToken(user._id)
            user.tokens=user.tokens.concat({token:token})
            return res.send({user,token})
        }
        res.status(400).send('Incorrect Password')
    }catch(e){
        res.send(e)
    }
})

module.exports=user