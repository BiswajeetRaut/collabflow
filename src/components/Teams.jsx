import React, { useEffect, useState } from 'react'
import './Overview.css';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import AddMember from '../modals/AddMember';
import AddTeam from '../modals/AddTeam';
import { selectProjectId } from '../features/project/projectSlice';
import {useSelector} from 'react-redux';
import db from '../firebase';
import { selectUserId } from '../features/user/userSlice';
const Teams = () => {
      const [admin,setadmin] = useState(false);
      const projectId = useSelector(selectProjectId);
      const userId = useSelector(selectUserId);
      const [teams,setteams] = useState([]);
      const [teamid,setteamid]=useState('');
      console.log(teams);
      console.log(admin);
      useEffect(()=>{
        db.collection('Projects').doc(projectId).get().then(
          (res)=>{
            res.data().admin.map((a)=>{
              if(a.id == userId)
              {
                setadmin(true);
              }
            })
          }
        ).catch((err) => {});
        db.collection('Projects').doc(projectId).collection('Teams').onSnapshot(snapshot=>{
          var documents = [];
          snapshot.docs.forEach(doc=>{
            var temp = doc.data();
            temp.id = doc.id;
            documents.push(temp);
          })
          setteams(documents);
        })
      },[])
      const [member, setmember] = useState(false);
      const [team,setteam] = useState(false);
  return (
    <div className="overview__part">
    <h1 className='text-4xl text-black text-center mt-5 font-bold'>Teams</h1>
              <div className="overview__works mx-auto px-4 flex flex-col justify-center items-center">
    {admin && <Button color="gray" className='mt-4 w-30 shadow-md' onClick={()=>{
      setteam(!team);
    }}>
            <p>
              Add a Team
            </p>
          </Button>}
        {
          teams.map(t=>{
            return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-5">
      <div className="bg-white bg-opacity-40 rounded-lg p-4 max-w-screen-lg mx-auto overflow-y-auto max-h-96 shadow-xl">
          <div className='flex justify-between items-center'>
          <h1 className='text-2xl text-gray-500 mb-2'>{t.name}</h1>
          { admin && <Button color="gray" className='ml-2 w-30 shadow-md' onClick={()=>{
            setmember(true);
            setteamid(t.id);
          }}>
            <p>
              Add a Member
            </p>
          </Button>}
          </div>
        <div className="flex flex-wrap -mx-2 gap-5 py-2 justify-center items-center">
          {t.members.map((m, index) => (
            <div class="text-center text-gray-500 dark:text-gray-400">
              <img class="mx-auto mb-4 w-20 h-20 rounded-full" src={m.photo} alt="Profile"/>
              <h3 class="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  <a>{m.name}</a>
              </h3>
              <p className='text-sm'>{m.designation}</p>
          </div>
          ))}
        </div>
      </div>
    </div>
        )
          })
        }
        </div>
        {member && <AddMember member={member} setmember={setmember} teamid={teamid}/>}
        {team && <AddTeam team={team} setteam={setteam}/>}
        {(member || team)  && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>} {/* Overlay */}
    </div>
  )
}

export default Teams
