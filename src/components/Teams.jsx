import React, { useState } from 'react'
import './Overview.css';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import AddMember from '../modals/AddMember';
import AddTeam from '../modals/AddTeam';
const Teams = () => {
      const tasks = [
        { title: 'Task 1', deadline: '2023-07-01' },
        { title: 'Task 2', deadline: '2023-07-05' },
        { title: 'Task 3', deadline: '2023-07-10' },
        { title: 'Task 4', deadline: '2023-07-15' },
        { title: 'Task 5', deadline: '2023-07-20' },
        { title: 'Task 6', deadline: '2023-07-25' },
        { title: 'Task 7', deadline: '2023-07-30' },
      ];
      const [member, setmember] = useState(false);
      const [team,setteam] = useState(false);
  return (
    <div className="overview__part">
    <h1 className='text-4xl text-black text-center mt-5 font-bold'>Teams</h1>
        <div className="overview__works mx-auto px-4 flex flex-col justify-center items-center">
    <Button color="gray" className='mt-4 w-40 shadow-md' onClick={()=>{
      setteam(!team);
    }}>
            <p>
              Add a Team
            </p>
          </Button>
    <div className="container mx-auto px-4 py-8 flex flex-col gap-5">
      <div className="bg-white bg-opacity-40 rounded-lg p-4 max-w-screen-lg mx-auto overflow-y-auto max-h-96 shadow-xl">
          <div className='flex justify-between items-center'>
          <h1 className='text-2xl text-gray-500 mb-2'>Team Name</h1>
          <Button color="gray" className='w-40 shadow-md' onClick={()=>{
            setmember(true);
          }}>
            <p>
              Add a Member
            </p>
          </Button>
          </div>
        <div className="flex flex-wrap -mx-2 gap-5 py-2 justify-center items-center">
          {tasks.map((task, index) => (
            <div class="text-center text-gray-500 dark:text-gray-400">
              <img class="mx-auto mb-4 w-20 h-20 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene Avatar"/>
              <h3 class="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  <a>Helene Engels</a>
              </h3>
              <p className='text-sm'>CTO/Co-founder</p>
          </div>
          ))}
        </div>
      </div>
    </div>
        </div>
        {member && <AddMember member={member} setmember={setmember}/>}
        {team && <AddTeam team={team} setteam={setteam}/>}
        {(member || team)  && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>} {/* Overlay */}
    </div>
  )
}

export default Teams
