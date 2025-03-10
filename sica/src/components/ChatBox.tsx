import { useState , useEffect, useRef} from "react";
import Usertext from "../components/Usertext";
import axios from "axios";
import {chatState , userState} from "../store/User";
interface Message {
  text: string;
  sender : string;
  model : string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const {user} = userState();
  const [model , setModel] = useState("Online")
  const chat = chatState((state) => state.chat)
  const addMessage = chatState((state) => state.addMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [id,setId] = useState(0);
  
  
  useEffect(()=>{
    setMessages(chat)
    setId(chatState.getState().id)
  },[chat])
  
  useEffect(() =>{

    messagesEndRef.current?.scrollIntoView({behavior : "instant"})

  },[messages])

  // for sending message to backend 
  function sendRes() {
   
    if (!prompt.trim()) return; // Prevent empty messages
    const newMessage : Message = {
      text : prompt,
      sender : "User",
      model : model
    }
    addMessage(newMessage)
    getRes(prompt,model)
    setPrompt("");
  }
  async function getRes(mes : string, model :string) {
        const res = await axios.post("http://localhost:3000/api/models",
        {data : mes , 
         model : model,
         chatId : id,
         UserName : user
        })
        const data = res.data
        const newMessage : Message = {
          text : data,
          sender : "Ai",
          model : model
        }
        addMessage(newMessage)
      }
      
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setPrompt(e.target.value);
  }

  function handelClick(e : React.KeyboardEvent){
    if (e.key != "Enter") return

    sendRes()



  }
      
      return (
        <div className="w-[80%] bg-gray-900 h-screen">
      <div className="bg-black/25 h-[90%] overflow-y-auto p-4 scrollbar-none">
        {messages.map((m, index) => (
          <Usertext key={index} message={m.text} user = {m.sender}/>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="bg-amber-950 h-[10%] flex justify-center items-center gap-3 p-2">
        
        <label className="text-white" htmlFor="Online">Online :</label>
        <input type="radio" name="model" id="Online" checked = {model === "Online"} onClick={() => setModel("Online")}/>
        <label className="text-white" htmlFor="Offline">Offline :</label>
        <input type="radio" name="model" id="Offline" checked = {model === "Offline"}  onClick={() => setModel("Offline")}/>
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handelClick}
          value={prompt}
          placeholder="Enter text"
          className="bg-gray-500 w-[80%] text-2xl rounded-2xl p-4 border-black border-2"
          />
        <button className="bg-white text-2xl p-4 rounded-xl "  onClick={sendRes} >
          Send
        </button>
       
      </div>
    </div>
  );
}
