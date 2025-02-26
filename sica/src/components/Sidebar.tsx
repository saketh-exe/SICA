import {useState,useEffect} from "react"
import {userState} from "../store/User"
import axios from "axios";
import SideBarElement from "./SideBarElement";
export default function Sidebar() {
  const {user} = userState();
  const [chats,SetChats] = useState([])
  useEffect(() => {

    async function getChats(){
      const res = await axios.get("http://Localhost:3000/getUserChats",{
        params : {
          user : user
        }
      })
      const data = res.data || []
      console.log(data)
      SetChats(data)
    }

    getChats()

  },[])

  

  return (
   <div className='w-[20%] bg-amber-50 h-screen flex flex-col items-center'>
      {/* Profile section  */}
      <div className="bg-white w-full text-2xl text-center p-2 font-bold">
      {user}
      </div>

      {/* action buttons  */}
      <div className="flex items-center justify-evenly w-full gap-2">
    <button className="bg-black text-white w-1/2 p-2 m-2 rounded-md">
      New Chat
    </button>
    <input 
    className="bg-gray-700 text-white w-1/2 p-2 m-2 rounded-md"
    type = "text"
    placeholder="Search"
    />
      </div>

      {/* Chat list  */}
      <div className="bg-white w-full overflow-y-auto">
          {chats.map((chat : any) => {
            return (
              <SideBarElement key={chat.id} cht={chat}/>
            )
          })}
      </div>


         
    </div>
  )
}
