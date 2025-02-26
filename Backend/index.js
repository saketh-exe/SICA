const express = require("express")
const cors = require("cors")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("dotenv")
const mongoose = require("mongoose")
const User = require("./models/User")


const app = express()
env.config() // this loads env variables 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(cors())
app.use(express.json())

const connectDB  = async () => {
  try{
    await mongoose.connect(process.env.MONGO_DB_URL)
    console.log("connected to MDB ")
  }
  catch(e){
    console.log(e);
  }
}


// mongodb function to get user
async function getUser(nam) {
  const user = await User.find({name : nam})
  if(user.length != 0){
    return user
  }
  else{
    console.log("ntg niga/")
    return []
  }
 
}


app.post("/", async (req,res) => {
  
  const name = req.body.UserName;
  const password = req.body.Password
  const user = await getUser(name)
  if(user.length === 0){
    await User.create({
      name : name,
      Password : password,
      Chats : []
    })
   

    res.send(true)
  }
  
  else if(user[0].Password === password){
    res.send(true)
  }
  else{
    res.send(false)
  }

})

app.post("/api/models" ,async (req,res) => {
    const smt = req.body.data
    const model = req.body.model
    const result = model === "Offline" ?
         await local(smt)
        :
         await generate(smt)
    
    res.send(result)
})
async function generate(prompt){
    try{
        res = await model.generateContent(prompt)
        return res.response.text();

    }
    catch{
        return "Error Please Check your internet connection "
    }
}

async function local(smt) {
    let res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral:latest",
        prompt: smt
      })
    });
  
    const rawData = await res.text();
    console.log(rawData);
  
    // Split by newline and filter out any empty lines
    const lines = rawData.split('\n').filter(line => line.trim());
  
    let fullResponse = "";
    for (let line of lines) {
      try {
        const parsed = JSON.parse(line);
        // Append the 'response' field from each chunk
        fullResponse += parsed.response;
        
        // Optionally break if the chunk indicates it's done
        if (parsed.done) break;
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    
    return fullResponse;
  }
  


// function to add chats to the user
app.post("/getChats", async (req,res) => {
  const name = req.body.UserName;
  const user = await User.find({name : name})
  console.log(user)
  const testchat = {
    id: 2,
    messages: [{
      text: "Hello there, thanks for using sak app",
      user : "User",
      model: "User"
    }]
  }

  // user[0].Chats.push(testchat)
  // await user[0].save()
  res.send(user[0].Chats)
})


app.get("/getUserChats" , async (req,res) => {
  const name = req.query.user
  const user = await getUser(name)
  console.log(user[0].Chats)
  
  res.send(user[0].Chats)


})
 
app.listen(3000,() => {
    console.log("server is running at port 3k")
})

connectDB()
