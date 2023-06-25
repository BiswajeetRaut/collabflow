import React, { useState } from 'react';
import './Discussion.css';
import { Button } from 'flowbite-react';
const Discussion = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if(newMessage.trim().length==0)
    {
      return;
    }
    const newMessageObj = {
      text: newMessage,
      sender: 'John Doe',
      timestamp: new Date().toLocaleString(),
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  return (
    <div className="discussion__page w-full flex flex-col justify-start items-center absolute h-full" style={{position:`absolute`,top:`90px`}}>
      <div className="discussion__heading text-2xl md:text-md text-center font-bold w-full py-2" style={{height:`10%`}}>General Discussion</div>
      <div className="chats__section flex flex-col gap-2 justify-start items-start overflow-y-auto px-5" style={{height:`65%`,width:`96%`}}>
        {messages.length ==0 ? (<>There are no Messages yet</>):messages.map(message=>{
          return(
            <div className="chat flex flex-row gap-2">
              <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" className='w-10 h-10 rounded-full' alt="" />
              <div className='flex flex-col'>
              <div className="message text-md font-bold">{message.text}</div>
              <div className="message_details flex flex-row text-xs gap-2">
                <div>{message.sender}</div>
                <div>{message.timestamp}</div>
              </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="bg-white bg-opacity-40 rounded-lg shadow-lg p-4 input flex gap-2 items-center justify-center" style={{
        width:`95%`,
      }}>
            <input
              type="text"
              value={newMessage}
              onChange={handleNewMessageChange}
              className="px-4 py-2 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a Message..."
              style={{width:`65%`}}
            />
            <Button
              onClick={handleSendMessage}
              color="transparent"
              style={{
                border:`1px solid gray`
              }}
              className='hover:bg-white transition-all transition-duration-300 ease-in-out'
            >
              Post Message
            </Button>
          </div>
    </div>
  );
};

export default Discussion;
