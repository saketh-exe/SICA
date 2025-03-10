import {chatState} from "../store/User"
export default function SideBarElement({cht} : any) {
    const {setChat , setId,id} = chatState()

const style = cht.id == id  ?"p-2 m-2 rounded-sm border-2 border-black bg-white text-black cursor-pointer" :"p-2 m-2 rounded-sm border-2 border-black bg-black text-white cursor-pointer hover:bg-white hover:text-black"


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
