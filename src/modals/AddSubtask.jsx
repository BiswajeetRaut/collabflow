import React, { useState } from 'react';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { selectProjectId } from '../features/project/projectSlice';
import db from '../firebase';
import Datepicker from "react-tailwindcss-datepicker";
const AddSubtask = ({ setsubtaskshow, getSubtask, taskid }) => {
  const projectId = useSelector(selectProjectId);
  const [teamName, setTeamName] = useState('');
  const [description, setdescription] = useState('');
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });
  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };
  const handleValueChange = (newValue) => {
    setValue(newValue);
  }
  const handleAddTeam = () => {
    const startdate = new Date(value.startDate)
    const enddate = new Date(value.endDate)
    var subtask = {
      subtaskTitle: teamName,
      description: description,
      startDate: firebase.firestore.Timestamp.fromDate(startdate),
      endDate: firebase.firestore.Timestamp.fromDate(enddate)
    }
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).collection('SubTasks').add(subtask)
    setsubtaskshow(false)
    getSubtask()
  };
  const handleDescriptionChange = (e) => {
    setdescription(e.target.value);
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add a Sub Task</h2>
          <div className="mb-4">
            <input
              type="text"
              value={teamName}
              onChange={handleTeamNameChange}
              placeholder="Enter Sub Task Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Datepicker
            value={value}
            onChange={handleValueChange}
            showShortcuts={true}
          />
          <div className="flex justify-end mt-5">
            <button
              onClick={handleAddTeam}
              className="bg-indigo-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-indigo-600"
            >
              Add Sub Task
            </button>
            <button
              onClick={() => {
                setsubtaskshow(false);
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

export default AddSubtask;
