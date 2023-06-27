import React, { useEffect, useState } from 'react';
import './Discussion.css';
import { Button } from 'flowbite-react';
import {useSelector} from 'react-redux';
import { selectProjectId } from '../features/project/projectSlice';
import db from '../firebase';
import { selectUserName, selectUserPhoto } from '../features/user/userSlice';
import firebase from 'firebase';
const Discussion = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const projectId = useSelector(selectProjectId);
  const userPhoto = useSelector(selectUserPhoto);
  const userName = useSelector(selectUserName);
  const change = useState(true);
  const [mentions,setMentions] = useState([]);
  useEffect(()=>{
    db.collection('Projects').doc(projectId).get().then((res)=>{
      setMentions(res.data());
    })
  },[])
  useEffect(()=>{
    db.collection('Projects').doc(projectId).collection('Discussions').orderBy('timestamp','asc').onSnapshot((snapshot)=>{
      var documents = [];
      snapshot.docs.forEach((doc)=>{
        var temp = doc.data();
        temp.id = doc.id;
        documents.push(temp);
      })
      setMessages(documents);
    })
  },[change]);
  const [mention,setmention]=useState('');
  const handleNewMessageChange = (e) => {
    if(e.target.value[e.target.value.length-1] == '@' || mention!='')
    {
      
    }
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if(newMessage.trim().length==0)
    {
      return;
    }
    // const date = new Date('2023-06-30');
    const newMessageObj = {
      message: newMessage,
      name: userName,
      photo: userPhoto,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      // customTimeStamp: firebase.firestore.Timestamp.fromDate(date),
    };
    db.collection('Projects').doc(projectId).collection('Discussions').add(newMessageObj).then(()=>{}).catch(()=>{
      alert('something went wrong');
    });
    setNewMessage('');
  };

  return (
    <div className="discussion__page w-full flex flex-col justify-start items-center absolute h-full" style={{position:`absolute`,top:`90px`}}>
      <div className="discussion__heading text-2xl md:text-md text-center font-bold w-full py-2" style={{height:`10%`}}>General Discussion</div>
      <div className="chats__section flex flex-col gap-2 justify-start items-start overflow-y-auto px-5" style={{height:`65%`,width:`96%`}}>
        {messages.length ==0 ? (<>There are no Messages yet</>):messages.map(message=>{
          return(
            <div className="chat flex flex-row gap-2 mt-2 bg-purple-300 bg-opacity-30 rounded-lg px-2 py-2 shadow-md">
              <img src={message.photo} className='w-8 h-8 rounded-full mt-auto mb-auto' alt="" />
              <div className='flex flex-col'>
              <div className="message_details flex flex-row text-xs gap-2">
                <div>{message.name}</div>
                <div>{
                  new Date(message.timestamp?.toDate().toISOString()).toLocaleString()
                }</div>
              </div>
              <div className="message text-sm">{message.message}</div>
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
