import {chatState} from "../store/User"
export default function SideBarElement({cht} : any) {
    const {setChat , chat ,setId} = chatState()

const style = chat==cht["messages"]  ?"p-2 m-2 rounded-sm border-2 border-black bg-white text-black" :"p-2 m-2 rounded-sm border-2 border-black bg-black text-white"


  return (
    <div key={cht.id} id={cht.id} className={style} onClick = {() => 
      {
        setChat(cht["messages"])
        setId(cht.id)
    }} >
                {cht.id}
    </div>
  )
}
