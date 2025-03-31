import {useState,useEffect} from "react"
import {userState} from "../store/User"
import axios from "axios";
import SideBarElement from "./SideBarElement";
import img from "../assets/image.png"
export default function Sidebar() {
  
  
  
  const {user} = userState();
  const [chats,SetChats] = useState<{ text: string; sender: string; model: string }[]>([])



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

  return (
   <div className='w-[15%] min-w-[125px] bg-gray-700 h-screen flex flex-col items-center'>
      {/* Profile section  */}
      <div className="bg-white w-full text-2xl p-2 flex justify-evenly items-center font-bold rounded-b-lg">
      <img src={img}  className="w-18 h-12"/>
      {user}
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
