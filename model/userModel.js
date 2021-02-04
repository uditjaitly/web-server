const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Invalid Email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:5
    },
    age:{
        type:Number,
        required:true,
        trim:true,
        validate(value){
            if(value<0){
                throw new Error("Age must be >0")
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }

    ]
}) 

userSchema.pre('save', async function(next){
    const user=this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    next()

})

const User=mongoose.model('User',userSchema)

module.exports=User