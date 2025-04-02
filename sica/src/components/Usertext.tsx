import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus'; 
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface UsertextProps {
  message: string;
  user: string;
}

export default function Usertext({ message, user }: UsertextProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [message]);

  const customComponents: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <pre
          className={`language-${match[1]} overflow-x-auto max-w-full whitespace-pre-wrap break-all p-4 rounded-lg`}
        >
          <code {...props} className={className}>
            {children}
          </code>
        </pre>
      ) : (
        <code {...props} className={`bg-gray-100 text-red-900 p-1 rounded break-words ${className}`}>
          {children}
        </code>
      );
    },
  };
  
  

  return (
    <>
      {user === 'User' ? (
        <div className="bg-gray-100 text-sky-900 text-left w-fit max-w-[70%] ml-auto p-4 rounded-2xl rounded-br-none my-6 border-4 border-amber-700">
          {message}
        </div>
      ) : (
        <ReactMarkdown
          className="bg-green-900/70 text-white/80 text-left w-fit max-w-[70%] mr-auto p-4 rounded-2xl rounded-bl-none mb-1 prose prose-invert"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypePrism]}
          components={customComponents}
        >
          {message}
        </ReactMarkdown>
      )}
    </>
  );
}
