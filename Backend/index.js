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
   console.log("User not found")
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
    const prompt = req.body.data
    const chatId = req.body.chatId
    const user = await User.find({name : req.body.UserName})
    const model = req.body.model
    const result = model === "Offline" ?
         await local(prompt)
        :
         await generate(prompt)
    user[0].Chats[chatId-1].messages.push({
      text: prompt,
      model: model,
      sender: "User"
    })
    user[0].Chats[chatId-1].messages.push({
      text: result,
      model: model,
      sender: "Ai"
    })
    await user[0].save()
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
app.post("/addChat", async (req,res) => {
  const name = req.body.UserName;
  const user = await User.find({name : name})
  const newChat = 
    {
      id: user[0].Chats.length + 1,
      messages: [
        {
          text: "Hello how can i help you today? ",
          model: "Default",
          sender: "Ai"
        }
      ]
    }
  
  user[0].Chats.push(newChat)
  await user[0].save()
  res.send({staus : "Chat Added", chat : newChat})
})


app.get("/getUserChats" , async (req,res) => {
  const name = req.query.user
  const user = await getUser(name)
  res.send(user[0].Chats)


})
 
app.listen(3000,() => {
    console.log("server is running at port 3k")
})

connectDB()
