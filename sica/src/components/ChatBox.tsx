import { useState , useEffect} from "react";
import Usertext from "../components/Usertext";
import axios from "axios";
import {userState,chatState} from "../store/User";
interface Message {
  text: string;
  user : string;
  model : string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [model , setModel] = useState("Offline")
  const {user} = userState()
  const chat = chatState((state) => state.chat)
  
  useEffect(()=>{
    setMessages(chat)
  },[chat])
  
  
  function sendRes(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!prompt.trim()) return; // Prevent empty messages
    const newMessage :Message = {
        text : prompt,
        user : "User",
        model : model
    }
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    getRes(prompt,model)
    setPrompt("");
  }
 

useEffect(()=>{





  
},[])









  async function getRes(mes : string, model :string) {
        const res = await axios.post("http://localhost:3000/api/models", {data : mes , model : model})
        const data = res.data
        const newMessage :Message = {
            text : data,
            user : "Ai",
            model : model
        }
        setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <div className="w-[80%] bg-blue-300 h-screen">
      <div className="bg-black/25 h-[90%] overflow-auto p-4">
        {messages.map((m, index) => (
          <Usertext key={index} message={m.text} user = {m.user}/>
        ))}
      </div>


      <div className="bg-amber-950 h-[10%] flex justify-center items-center gap-3 p-2">
        
        <label className="text-white" htmlFor="Online">Online :</label>
        <input type="radio" name="model" id="Online" checked = {model === "Online"} onClick={() => setModel("Online")}/>
        <label className="text-white" htmlFor="Offline">Offline :</label>
        <input type="radio" name="model" id="Offline" checked = {model === "Offline"}  onClick={() => setModel("Offline")}/>
        <input
          type="text"
          onChange={handleChange}
          value={prompt}
          placeholder="Enter text"
          className="bg-gray-500 w-[80%] text-2xl rounded-2xl p-4 border-black border-2"
        />
        <button className="bg-white text-2xl p-4 rounded-xl "  onClick={sendRes}>
          Send
        </button>
       
      </div>
    </div>
  );
}
