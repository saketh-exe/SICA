import {useState,useEffect} from "react"
import {userState , chatState} from "../store/User"
import axios from "axios";
import SideBarElement from "./SideBarElement";
import { useNavigate } from "react-router-dom"
export default function Sidebar({opened} : {opened : boolean}) {
  
  
  
  const {user , clearUser} = userState();
  const [chats,SetChats] = useState<{ text: string; sender: string; model: string }[]>([])
  const {clearChat , setChat} = chatState();
  const Nav = useNavigate()


  // for loading chats
  useEffect(() => {

    async function getChats(){
      const res = await axios.get("http://Localhost:3000/getUserChats",{
        params : {
          user : user
        }
      })
      const data = res.data || []
      SetChats(data)
      setChat(data[0]?.messages || [])
      chatState.setState({id : data[0]?.id || 0})
    }

    getChats()

  },[])


  // need to be fixed : new chat isn't upadting global state 
  async function addNewChat(){
    const res = await axios.post("http://Localhost:3000/addChat",{
      UserName : user
    })
    const data = res.data
    const chat: { text: string; sender: string,model:string } =  data.chat
    SetChats([...chats,chat])
  }
  let sty = " ";
  if (opened) {
    sty = "w-[15%] min-w-[125px] bg-gray-700 h-screen flex flex-col items-center"
    
  }
  else{
    sty = "hidden"
  }

  return (
   <div className={sty}>
      {/* Profile section  */}
      <div className="bg-white w-full text-2xl p-2 flex justify-evenly items-center font-bold rounded-b-lg flex-wrap">
            {user}
            <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 transition-all cursor-pointer font-bold text-sm " onClick={() => {
              clearUser();
              clearChat();
              SetChats([])
              Nav("/")
              }}>
              Logout
            </button>
      </div>

      {/* action buttons  */}
      <div className="flex items-center justify-evenly w-full gap-2">
    <button className="bg-black text-white w-3/4 p-2 mt-4 rounded-md hover:bg-amber-50 hover:text-black transition-all cursor-crosshair font-bold" onClick={() => addNewChat()} >
     ➕ New Chat
    </button>
      </div>

      {/* Chat list  */}
      <div className=" w-full overflow-y-auto">
          {chats.map((chat : any) => {
            return (
              <SideBarElement key={chat.id} cht={chat} id= {chat.id}/>
            )
          })}
      </div>


         
    </div>
  )
}
