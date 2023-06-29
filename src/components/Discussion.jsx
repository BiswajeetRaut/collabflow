import React, { useEffect, useRef, useState } from 'react';
import './Discussion.css';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
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
  const [mentions, setMentions] = useState([]);
  const [showmention, setshowmention] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    db.collection('Projects').doc(projectId).get().then((res) => {
      setMentions(res.data().members);
      console.log(res.data().members);
    })
  }, [])
  useEffect(() => {
    db.collection('Projects').doc(projectId).collection('Discussions').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      var documents = [];
      snapshot.docs.forEach((doc) => {
        var temp = doc.data();
        temp.id = doc.id;
        documents.push(temp);
      })
      setMessages(documents);
    })
  }, [change]);
  const [mention, setmention] = useState([]);
  const [presentmention, setpresentmention] = useState('');
  const handleNewMessageChange = (e) => {
    if (e.target.value[e.target.value.length - 2] == '@' || presentmention.length > 0) {
      setpresentmention('@');
      setshowmention(true);
    }
    else {
      // setpresentmention('');
      setNewMessage(e.target.value);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim().length == 0) {
      return;
    }
    // const date = new Date('2023-06-30');
    const newMessageObj = {
      message: newMessage,
      name: userName,
      photo: userPhoto,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      mentions: mention,
      // customTimeStamp: firebase.firestore.Timestamp.fromDate(date),
    };
    db.collection('Projects').doc(projectId).collection('Discussions').add(newMessageObj).then(() => { }).catch(() => {
      alert('something went wrong');
    });
    setNewMessage('');
  };

  return (
    <div className="discussion__page w-full h-full flex flex-col justify-start items-center" style={{ paddingTop: '90px' }}>
      <div className="discussion__heading text-2xl md:text-md text-center font-bold w-full py-2" style={{ height: '10%' }}>General Discussion</div>
      <div className="chats__section flex flex-col gap-2 justify-start items-start overflow-y-auto px-5" style={{ height: '65%', width: '96%' }}>
        {messages.length === 0 ? (
          <>There are no Messages yet</>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? bottomRef : null}
              className="chat flex flex-row gap-2 mt-2 bg-purple-300 bg-opacity-30 rounded-lg px-2 py-2 shadow-md"
            >
              <img src={message.photo} className="w-8 h-8 rounded-full mt-auto mb-auto" alt="" />
              <div className="flex flex-col">
                <div className="message_details flex flex-row text-xs gap-2">
                  <div>{message.name}</div>
                  <div>{new Date(message.timestamp?.toDate().toISOString()).toLocaleString()}</div>
                </div>
                <div className="message text-sm">{message.message}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {showmention && (
        <ul className="rounded-md bg-white flex-col overflow-y-auto px-2 py-2 items-start justify-center absolute mt-auto mb-auto" style={{ width: '50%' }} id="mention">
          <li className="flex items-center justify-center gap-2 mt-1">
            {' '}
            <input
              type="text"
              className="rounded-md h-8"
              value={presentmention}
              onChange={(e) => {
                setpresentmention(e.target.value);
              }}
            />{' '}
            <div
              onClick={() => {
                setpresentmention('');
                setshowmention(false);
                setNewMessage(newMessage.slice(0, newMessage.length - 2));
              }}
            >
              X
            </div>
          </li>
          {mentions.map((m) => {
            if (m.name.includes(presentmention.slice(1, presentmention.length - 1))) {
              return (
                <li
                  key={m.id}
                  className="flex gap-1 items-start justify-center border-b-2 cursor-pointer px-2 py-2"
                  onClick={() => {
                    console.log(m.name);
                    setmention([...mention, m.id]);
                    setNewMessage(newMessage + m.name);
                    setpresentmention('');
                    setshowmention(false);
                  }}
                >
                  {' '}
                  <img src={m?.photo} alt="Profile" className="h-8 w-8 rounded-full" /> <div>{m?.name}</div>
                </li>
              );
            }
            return null;
          })}
        </ul>
      )}

      <div
        className="bg-white bg-opacity-40 rounded-lg shadow-lg p-4 input flex gap-2 items-center justify-center"
        style={{ width: '95%', marginTop: 'auto' }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleNewMessageChange}
          className="px-4 py-2 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add a Message..."
          style={{ width: '65%' }}
        />
        <Button
          onClick={handleSendMessage}
          color="transparent"
          style={{ border: '1px solid gray' }}
          className="hover:bg-white transition-all transition-duration-300 ease-in-out"
        >
          Post Message
        </Button>
      </div>
    </div>

  );
};

export default Discussion;
