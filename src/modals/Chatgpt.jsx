import React, { useEffect, useState } from 'react';
import {} from 'react-icons/fa';
import axios from 'axios';
const ChatGPT = ({ setchatgpt, messages, responses, setMessages, setResponses }) => {
const chatFunction = ()=>{
    const options = {
        method: 'POST',
        url: 'https://chatgpt-api7.p.rapidapi.com/ask',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '3a2c9f5e70msh4fd22237ba94150p1b8d77jsn9bed91208b46',
          'X-RapidAPI-Host': 'chatgpt-api7.p.rapidapi.com'
        },
        data: {
          query: inputValue,
        }
      };
      
    axios.request(options).then((response)=>{
        console.log(response.data);
        setResponses([...responses,{text: response.data.response}]);
        setsuccess(true);
    }
    ).catch((error)=>{
        const options = {
            method: 'POST',
            url: 'https://chatgpt53.p.rapidapi.com/',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': '3a2c9f5e70msh4fd22237ba94150p1b8d77jsn9bed91208b46',
              'X-RapidAPI-Host': 'chatgpt53.p.rapidapi.com'
            },
            data: {
              messages: [
                {
                  role: 'user',
                  content: inputValue,
                }
              ],
              temperature: 1
            }
          };
          
    axios.request(options).then((response)=>{
                  console.log(response.data);
                  setResponses([...responses,{text: response.data.response}])
                  setsuccess(true);
              }
              ).catch((error)=>{
              console.error(error);
              alert('Sorry, Something went wrong');
              setResponses([...responses,{text:'Something went wrong'}]);
              setsuccess(true);
          })
      });
}
  const [success,setsuccess]=useState(true);
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if(success == false)
    {
        alert('alerady processing one query. Wait for a momemnt');
        return;
    }
    if (inputValue.trim() !== '') {
      setsuccess(false);
      setMessages([...messages, { text: inputValue }]);
      localStorage.setItem('messages',JSON.stringify(messages));        
      chatFunction();
    //   setInputValue('');
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 h-full w-full">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg" style={{
        height:`85%`,
        width:`90%`,
      }}>
        <div className="px-4 py-6 h-full">
          <div className='flex justify-between items-center w-full mb-4'>
          <h2 className="text-2xl font-bold text-gray-900">Chat Bot</h2>
          <div onClick={()=>{
            setchatgpt(false);
          }}
          className='text-md text-gray-900/50 '
          >X</div>
          </div>
          <div className="overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4" style={{height:`80%`}}>
          <div
                key={'keyeyehey'}
                className={`${
                'text-left'
                } mb-2`}
              >
                <p className="inline-block px-4 py-2 bg-gray-200 rounded-lg">
                  {responses[0].text}
                </p>
              </div>
            {messages.map((message, index) => (
              <>
              <div
                key={index}
                className={`${
                  'text-right'
                } mb-2`}
              >
                <p className="inline-block px-4 py-2 bg-gray-200 rounded-lg">
                  {message.text}
                </p>
              </div>
              {responses[index+1] && <div
                key={index*100+1}
                className={`${
                'text-left'
                } mb-2`}
              >
                <p className="inline-block px-4 py-2 bg-gray-200 rounded-lg">
                  {responses[index+1].text}
                </p>
              </div>}
              </>
            ))}
          </div>
          <div className="flex overflow-x-auto">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT;
