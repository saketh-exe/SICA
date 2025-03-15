const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");  // Replacing node-fetch with axios
const { generateHistory } = require("../utils/historyUtils");
const User = require("../models/User");
const Docu = require("../models/document")
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Generate response using online model
async function generate(prompt) {
  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch {
    return "Error: Please check your internet connection.";
  }
}
async function genEmb(s){

  const emb = genAI.getGenerativeModel({model : "gemini-embedding-exp-03-07"})
  const res = await emb.embedContent(s)
  
  return res.embedding.values

}
function cosineSim(A,B){
  const dotPoduct = A.reduce((sum,a,idx) => sum + a* B[idx] , 0);
  const NormA = Math.sqrt(A.reduce((sum,a)=> sum + a*a,0))
  const NormB = Math.sqrt(B.reduce((sum,b)=> sum + b*b,0))
  return dotPoduct/(NormA*NormB);
  }
async function getContext(prompt){
  const docu = await Docu.find()
    const query = await genEmb(prompt)
    
    const simlarityVec = docu.map((doc) => {
        const sim = cosineSim(doc['embedding'],query)

        return {sim, doc}
    })
    simlarityVec.sort((a, b) => b.sim - a.sim);
    console.log(simlarityVec[0].sim)
    return simlarityVec[0].doc.text

}
// Generate response considering chat history
async function hisgen(prompt, prevChat) {

  const context = await getContext(prompt)
  const history =  generateHistory(prevChat);
  const chat = model.startChat({ history });
  
  const result = await chat.sendMessage(`Using only the following context ,if context is not related to question then ignore the context , answer the question: ${context} Question:`+prompt);
  return result.response.text();
}

// Generate response using local model (Ollama)
async function local(smt) {
  try {
    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "mistral:latest",
      prompt: smt,
    });

    const rawData = res.data; // Axios automatically parses JSON

    let fullResponse = "";
    if (Array.isArray(rawData)) {
      rawData.forEach((chunk) => {
        fullResponse += chunk.response;
      });
    } else {
      fullResponse = rawData.response;
    }

    return fullResponse;
  } catch (error) {
    console.error("Error fetching response from local model:", error.message);
    return "Error fetching response from local model.";
  }
}

// AI interaction
const generateResponse = async (req, res) => {
  const { data: prompt, chatId, UserName, model } = req.body;
  const user = await User.findOne({ name: UserName });

  const response =
    model === "Offline"
      ? await local(prompt)
      : await hisgen(prompt, user.Chats[chatId - 1]);

  user.Chats[chatId - 1].messages.push({ text: prompt, model, sender: "User" });
  user.Chats[chatId - 1].messages.push({ text: response, model, sender: "Ai" });

  await user.save();
  res.send(response);
};





module.exports = { generateResponse };
