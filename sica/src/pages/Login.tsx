import React, { useState ,useEffect} from "react"
import axios from "axios"
import {userState} from "../store/User"
import { useNavigate } from "react-router-dom"
export default function Login() {
    const Navigator = useNavigate()
    let [userName,setUserName] = useState("")
    let [password,setPassword] = useState("")
    let {setUser ,clearUser} = userState()
    
    useEffect(() => {
      
      clearUser()
    },[])


    function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
        const elem = e.target.id
        const value = e.target.value

        if(elem === "UserName"){
            setUserName(value)
        }
        else{
            setPassword(value)
        }

    }
  
   async function handelSubmit(){
      if(await login(userName,password)){
        setUser(userName)
        Navigator("/home")

      }
      else{
        alert("wrong password")
      }
    }
    

    async function login(Name:String , Password : String) : Promise<boolean> {
      const res =  await axios.post("http://localhost:3000/",{UserName : Name , Password : Password})
      const data = res.data
      if(data){
        return true
      }
      else{
        return false
      }
    }




  
    return (
    <div className="w-full h-screen bg-blue-300/50 flex justify-center items-center flex-col gap-4">
      <h3 className="font-bold text-3xl">Login</h3>
        <div>
      <label className="mr-1" htmlFor="UserName">Name :</label><br/>
      <input  onChange={(e) => handleChange(e)}  className="border-2 p-1  rounded-sm" type="text" id="UserName" value={userName} placeholder="Enter your User Name">
      </input>
        </div>
        <div>
      <label className="mr-1" htmlFor="Password">Password :</label><br/>
      <input onChange={(e) => handleChange(e)} className="border-2 p-1 rounded-sm" type="password" id="Password" value={password} placeholder="Enter your Password">
      </input>
        </div>
        <button className="bg-gray-950 text-white p-2 text-2xl rounded-lg" onClick={handelSubmit}>
            Login
        </button>

    </div>
  )
}
