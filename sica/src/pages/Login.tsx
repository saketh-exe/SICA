import React, { useState ,useEffect} from "react"
import axios from "axios"
import {userState} from "../store/User"
import { useNavigate } from "react-router-dom"
import ReactLoading from 'react-loading';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
export default function Login() {
    const Navigator = useNavigate()
    let [userName,setUserName] = useState("")
    let [password,setPassword] = useState("")
    let {setUser ,clearUser} = userState()
    let [loading , setLoading ] = useState(false)
    let [wrong , setWrong] = useState(false)
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
      setLoading(true)
      if(await login(userName,password)){
        setUser(userName)
        Navigator("/home")

      }
      else{
        setLoading(false)
        setWrong(true)
      }
    }
    

    async function login(Name:String , Password : String) : Promise<boolean> {
      try{
        const res =  await axios.post("http://localhost:3000/",{UserName : Name , Password : Password})
        const data = res.data
        if(data){
          return true
        }
        else{
          return false
        }
      }
      catch(e){
        console.log(e)
        return false

      }
    }


    const words = [
      {
        text: "Your",
        className: "text-blue-100 dark:text-blue-100",
      },
      {
        text: "Ultimate",
        className: "text-blue-100 dark:text-blue-100",
      },
      {
        text: "College",
        className: "text-blue-100 dark:text-blue-100",
      },
      {
        text: "Guide!",
        className: "text-blue-100 dark:text-blue-100",
      },
    ];
    const words2 = [
      {
        text: "Fast.",
        className: "text-red-100 dark:text-blue-100",
      },
      {
        text: "Accurate.",
        className: "text-yellow-100 dark:text-blue-100",
      },
      {
        text: "Reliable.",
        className: "text-gray-100 dark:text-blue-100",
      }
    ];
    

  
    return (
    <div className="w-full h-screen text-gray-100 flex justify-center items-center flex-col gap-4 bg-gray-900">
      <h1 className="smt text-6xl font-mono font-thin">
        SICA
      </h1>
      <TypewriterEffectSmooth words={words}/>
      <TypewriterEffectSmooth words={words2}/>
      <div className="bg-gray-100/50 text-black p-8 rounded-lg flex flex-col gap-4 backdrop:blur-2xl">

  
      <h3 className="font-bold text-3xl">Login/Signup:</h3>
        <div >
      <label className="text-xl" htmlFor="UserName" >Username :</label><br/>
      <input  onChange={(e) => handleChange(e)}  className="border-2 p-3 pl-4 mt-2 font-bold font-sans rounded-lg text-3xl" type="text" id="UserName" value={userName} placeholder="Enter your Username">
      </input>
        </div>
        <div>
      <label className="mr-1 text-xl" htmlFor="Password">Password :</label><br/>
      <input onChange={(e) => handleChange(e)} className="border-2 p-3 pl-4 rounded-lg text-3xl mt-2 font-bold font-sans" type="password" id="Password" value={password} placeholder="Enter your Password">
      </input>
      {wrong && <p className="text-red-700">Please check Username or Password</p>}
        </div>
        {!loading && <button className="bg-gray-50 text-black p-2 text-2xl rounded-lg hover:bg-black hover:text-white cursor-pointer transition-all duration-300" onClick={handelSubmit}>
            Login
        </button> 
      }
      { loading && <ReactLoading type={"cylon"} color={"white"} height={50} width={50} />}
      </div>
    </div>
  )
}
