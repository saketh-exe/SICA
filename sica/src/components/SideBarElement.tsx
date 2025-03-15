import {chatState , userState} from "../store/User"
import { useState } from "react";
import ReactLoading from 'react-loading';
import axios from "axios";
export default function SideBarElement({cht} : any) {
    const {setChat , setId,id} = chatState()
    const {user} = userState()
let style = cht.id == id  ?"p-2 m-2 rounded-sm border-2 border-black bg-white text-black cursor-pointer flex justify-between" :"p-2 m-2 rounded-sm border-2 border-black bg-black text-white cursor-pointer hover:bg-white hover:text-black flex justify-between";

let [deleted , setDeleted] = useState(false)
let [loading , setLoading] = useState(false)


  return (
    !deleted && (!loading ? <div key={cht.id} id={cht.id} className={style } onClick = {() => 
      {
        setChat(cht["messages"])
        setId(cht.id)
    }} >
                {cht.id}
                <button className="bg-red-500 text-white p-1 rounded-sm cursor-pointer hover:bg-amber-900" onClick = {async () => {
                    setLoading(true)
                    
                    let res = await axios.delete("http://Localhost:3000/deleteChat",{ 
                      data: {
                      userName : user,
                      chatId : cht.id
                     },

                    })
                    console.log(res.data.status)
                    setChat([])
                    setId(0)
                    setLoading(false)
                    setDeleted(!deleted)
                }}>
                  Delete
                </button>
    </div>
    :
      <ReactLoading type={"cylon"} color={"black"} height={50} width={50} className="mx-auto" />
    )
  )
}
