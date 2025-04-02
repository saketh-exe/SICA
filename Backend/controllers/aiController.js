const { GoogleGenerativeAI } = require("@google/generative-ai");
const { generateHistory } = require("../utils/historyUtils");
const User = require("../models/User");
const Docu = require("../models/document");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
const emb = genAI.getGenerativeModel({ model: "gemini-embedding-exp-03-07" });


async function genEmb(s) {
  
    
    
  const res = await emb.embedContent(s);
  if (res.error) {
    console.error("Error generating embedding:", res.error);
    throw new Error("Embedding generation failed");
  }

  return res.embedding.values;
}

// Optimized Cosine Similarity Calculation
function cosineSim(A, B) {
  let dotProduct = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Optimized Context Retrieval
async function getContext(prompt) {
  const [docu, query] = await Promise.all([Docu.find().lean(), genEmb(prompt)]);

  const similarityVec = docu.map((doc) => ({
    sim: cosineSim(doc.embedding, query),
    doc,
  }));

  function partition(left, right, pivotIndex) {
    let pivotValue = similarityVec[pivotIndex].sim;
    [similarityVec[pivotIndex], similarityVec[right]] = [similarityVec[right], similarityVec[pivotIndex]];
    let storeIndex = left;
    for (let i = left; i < right; i++) {
      if (similarityVec[i].sim > pivotValue) {
        [similarityVec[storeIndex], similarityVec[i]] = [similarityVec[i], similarityVec[storeIndex]];
        storeIndex++;
      }
    }
    [similarityVec[right], similarityVec[storeIndex]] = [similarityVec[storeIndex], similarityVec[right]];
    return storeIndex;
  }

  function quickSelect(left, right, k) {
    while (left < right) {
      let pivotIndex = left + Math.floor(Math.random() * (right - left + 1));
      pivotIndex = partition(left, right, pivotIndex);
      if (k === pivotIndex) return;
      k < pivotIndex ? (right = pivotIndex - 1) : (left = pivotIndex + 1);
    }
  }

  quickSelect(0, similarityVec.length - 1, 1);
  return [similarityVec[0].doc.text, similarityVec[1].doc.text];
}

// Generate response considering chat history and context
async function hisgen(prompt, prevChat) {
  const [context, history] = await Promise.all([getContext(prompt), generateHistory(prevChat)]);
  const chat = model.startChat({ history });
  const contextStr = context.join(",");
  const result = await chat.sendMessage(
    "" + prompt + "\n\nContext: " + contextStr + "\n\nHistory: " + history,
  );
  return result.response.text();
}

// AI interaction
const generateResponse = async (req, res) => {
  const { data: prompt, chatId, UserName } = req.body;
  const user = await User.findOne({ name: UserName });

  const response = await hisgen(prompt, user.Chats[chatId - 1]);

  user.Chats[chatId - 1].messages.push({ text: prompt, sender: "User" ,model : "Online"});
  user.Chats[chatId - 1].messages.push({ text: response, sender: "Ai" , model : "Online"});

  await user.save();
  res.send(response);
};

module.exports = { generateResponse };