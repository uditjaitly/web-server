require('./db/mongodb')
const express=require('express')
const User=require('./model/userModel')
const userRouter=require('./routers/user')

const app = express();
const port=process.env.PORT||5000
app.use(express.json())
app.use(userRouter)



app.listen(port, () => {
  console.log("serving ");
});
