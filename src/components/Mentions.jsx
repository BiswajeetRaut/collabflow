import { Button, Timeline } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {HiCalendar} from 'react-icons/hi';
import {useSelector} from 'react-redux';
import { selectProjectId } from '../features/project/projectSlice';
import { selectUserId } from '../features/user/userSlice';
import db from '../firebase';
export default function Mentions() {
  const projectId = useSelector(selectProjectId);
  const userId = useSelector(selectUserId);
  const [mentions,setmentions]=useState([]);
  useEffect(()=>{
    try{db.collection('Projects').doc(projectId).collection('Discussions').orderBy('timestamp','desc').onSnapshot(snapshot=>{
        var documents =[];
        snapshot.docs.map(doc=>{
          if(doc.data().mentions?.includes(userId))
          {
            var temp ={};
            temp.message = doc.data().message;
            temp.name = doc.data().name;
            temp.photo = doc.data().photo;
            temp.timestamp = new Date (doc.data().timestamp.toDate().toUTCString()).toLocaleString();
            documents.push(temp);
          }
        })
        setmentions(documents);
    })}catch(e){
      
    }
  },[projectId,userId])
  return (
    <Timeline style={{
        borderLeft:`2px solid black`
    }}>
      {mentions.length == 0 ? <Timeline.Item>
        <Timeline.Point style={{zIndex:`950`}} className='point'/>
        <Timeline.Content>
          <Timeline.Time>
          <p className='text-gray-900/75'>
          {new Date().toLocaleString()}
          </p>
          </Timeline.Time>
          <Timeline.Title>
            You have No mentions Yet
          </Timeline.Title>
          <Timeline.Body>
            
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item> :
        mentions.map((mention)=>{
          return(
        <Timeline.Item>
        <Timeline.Point style={{zIndex:`950`}} className='point'/>
        <Timeline.Content>
          <Timeline.Time>
          <p className='text-gray-900/75'>
            {mention.timestamp}
          </p>
          </Timeline.Time>
          <Timeline.Title>
            {mention.name + ' mentioned you in Discussions'}
          </Timeline.Title>
          <Timeline.Body>
            <p className='flex gap-3 text-gray-900/75 items-center'>
              <img src={mention.photo} alt="" className='h-10 w-10 rounded-full'/>
              {mention.message}
            </p>
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
          )
        })
      
      }
    </Timeline>
  )
}


