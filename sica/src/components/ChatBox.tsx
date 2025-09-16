import { useState , useEffect, useRef} from "react";
import Usertext from "../components/Usertext";
import axios from "axios";
import {chatState , userState} from "../store/User";
import ReactLoading from 'react-loading';
import config from "../config/env";
interface Message {
  text: string;
  sender : string;
  model : string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const {user} = userState();
  const model = "Online"
  const chat = chatState((state) => state.chat)
  const addMessage = chatState((state) => state.addMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [id,setId] = useState(0);
  const [loading , setLoading ] = useState(false)
  
  useEffect(()=>{
    setMessages(chat)
    setId(chatState.getState().id)
  },[chat])
  
  useEffect(() =>{

    messagesEndRef.current?.scrollIntoView({behavior : "instant"})

  },[messages])

  // for sending message to backend 
  function sendRes() {
   setLoading(true)
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
        const res = await axios.post(`${config.backendUrl}/api/models`,
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
        setLoading(false)
      }
      
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setPrompt(e.target.value);
  }

  function handelClick(e : React.KeyboardEvent){
    if (e.key != "Enter") return

    sendRes()



  }
      
      return (
        <div className="w-[100%] bg-gray-900 h-screen">
      <div className="bg-black/25 h-[90%] overflow-y-auto p-4 scrollbar-none">
        {messages.map((m, index) => (
          <Usertext key={index} message={m.text} user = {m.sender}/>
        ))}
        {loading && <ReactLoading width={60} height={10} type="cubes"/>}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="bg-transparent h-[10%] flex justify-center items-center gap-3 p-2">
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handelClick}
          value={prompt}
          placeholder="Enter your query regarding the college"
          className="bg-gray-700 w-[90%] text-2xl rounded-2xl p-4 border-black border-1 text-white active:outline-none focus:outline-none"
          />
        <button className="bg-white text-2xl p-4 rounded-xl hover:bg-green-200 transition-all cursor-pointer"  onClick={sendRes} >
          Send
        </button>
       
      </div>
    </div>
  );
}
