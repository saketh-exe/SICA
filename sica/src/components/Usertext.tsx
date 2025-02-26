import ReactMarkdown from 'react-markdown';



interface UsertextProps {
  message: string;
  user : string
}

export default function Usertext({message,user}: UsertextProps) {
  return (
    <>
    {user === 'User' ? <div className="bg-gray-900/70 text-sky-50 text-left w-fit max-w-[50%] ml-auto p-4 rounded-2xl  rounded-br-none mb-1">
      {message}
    </div>
    :
    <ReactMarkdown className= "bg-green-900/70 text-white/80 text-left w-fit max-w-[50%] mr-auto p-4 rounded-2xl rounded-bl-none mb-1">
      {message}
    </ReactMarkdown>
    
    }
    </>
  )
}
