import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'
import { useState } from 'react'
function Home() {

  const [open, setOpen] = useState(true)

  return (
    <>
    <div className='flex'>
    <Sidebar opened = {open}/>
    <div className='bg-transparent text-2xl text-white h-screen flex flex-col justify-center'>
      
      <div className='bg-white text-black pb-1 px-1 text-3xl rounded-tr-full rounded-br-full flex  items-center justify-center hover:bg-gray-200 transition-all cursor-pointer font-bold' onClick={() => setOpen(!open)}>
        &rarr;
      </div>
      </div>
    <ChatBox/>
    </div>
    </>
  )
}

export default Home
