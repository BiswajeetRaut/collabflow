import React, { useState } from 'react';
import { selectProjectId } from '../features/project/projectSlice';
import {useSelector} from 'react-redux'
import db from '../firebase';
const AddTeam = ({ team,setteam }) => {
  const [teamName, setTeamName] = useState('');

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };
  const projectId= useSelector(selectProjectId);
  const handleAddTeam = () => {
    // Perform add team logic here
    console.log('Team Name:', teamName);
    db.collection('Projects').doc(projectId).collection('Teams').add({
      name: teamName,
      members:[],
    }).then(()=>{

    }).catch((err)=>{
      alert(err.message);
    })
    setteam(!team);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Team</h2>
          <div className="mb-4">
            <input
              type="text"
              value={teamName}
              onChange={handleTeamNameChange}
              placeholder="Enter team name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddTeam}
              className="bg-indigo-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-indigo-600"
            >
              Add Team
            </button>
            <button
              onClick={()=>{
                setteam(!team);
              }}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Go Back/Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeam;
