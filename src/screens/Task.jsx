import React, { useState } from 'react';
import './Task.css'
import {FaArrowLeft,FaTrash} from 'react-icons/fa';
import AddSubtask from '../modals/AddSubtask';
import AddTaskMember from '../modals/AddTaskMember';
import ShowMembers from '../modals/ShowMembers';
import EditTime from '../modals/EditTime';
const Task = () => {
  const [taskTitle, setTaskTitle] = useState('taskTitle');
  const [taskDescription, setTaskDescription] = useState('');
  const [subtasks, setSubtasks] = useState([
    {
        subtaskTitle:'Subtask 1',
        description:'Sub task Description',
        deadline:{
            startDate:'25August 2015',
            endDate:'23 August 2015'
        },
    }
  ]);
  const [edititime,setedititme]=useState(false);
  const [showmember,setshowmember] =useState(false);
  const [member,setmember] = useState(false);
  const [subtaskshow,setsubtaskshow] = useState(false);
  const [message, setMessage] = useState('');
  const [discussion, setDiscussion] = useState([]);

  const handleAddSubtask = () => {
    setsubtaskshow(true);
  };

  const handleSubtaskDescriptionChange = (e, index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].description = e.target.value;
    setSubtasks(updatedSubtasks);
  };

  const handleSendMessage = () => {
    if (message) {
      const newMessage = {
        author: 'John Doe',
        content: message,
        timestamp: new Date().toLocaleString(),
      };
      setDiscussion([newMessage, ...discussion]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-full task__page bg-transparent overflow-y-hidden">
      {/* Left Section */}
      <div className="flex-1 bg-transparent p-4 overflow-y-auto" style={{borderRight:`1px solid black`,
      borderBottom:`1px solid black`
      }}>
        <div className="flex items-center mb-4 justify-evenly">
        <FaArrowLeft className='mr-2 text-gray-800/75 cursor-pointer'/>
          <div className="relative">
            <div className="inline-block relative">
              <select
                className="block appearance-none bg-white bg-opacity-40 w-50 py-2 border-0 px-4 pr-8 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                defaultValue="todo"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <button className="ml-2 px-2 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
          onClick={()=>{
            setmember(true);
          }}
          >
            Add Member
          </button>
          <button className="ml-2 px-2 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
          onClick={()=>{
            setshowmember(true);
          }}
          >
            Show Members
          </button>
        </div>
        <div>
          <label className="block text-2xl text-center font-medium text-gray-700 mb-1">
            {taskTitle}
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
          ></textarea>
           <button className="px-2 py-2 text-sm font-medium text-black bg-white/40 bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md">
            Update
          </button>
        </div>
          <label className=" mt-4 text-center block font-medium text-gray-700 mb-2 text-2xl">
            Subtasks
          </label>
        <div className="bg-white bg-opacity-50 px-3 py-3 overflow-y-auto rounded-lg shadow-xl">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex flex-col items-center mb-2 bg-white rounded-md px-3 py-3 shadow-md" style={{background: `linear-gradient(182deg, #e8e8e8, #f9f9f9)`}}>
              <div className='text-md text-gray-700 text-center'>
                {subtask.subtaskTitle}
              </div>
              <textarea
                type="text"
                value={subtask.description}
                onChange={(e) => handleSubtaskDescriptionChange(e, index)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto overflow-x-clip"
              />
              <div className='flex justify-center items-center gap-4 mt-2'>
                <div className='text-sm text-gray-600'>{subtask.deadline.startDate} - {subtask.deadline.endDate}</div>
                <button className="px-1 py-1 text-xs text-black bg-white/40 bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md">
            Delete
          </button>
                <button className="px-1 py-1 text-xs text-black bg-white/40 bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md">
            Update
          </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddSubtask}
            className="px-4 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
          >
            Add Subtask
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-transparent p-4 right__section overflow-y-auto">
        <div className="flex items-center mb-4 justify-evenly w-full">
          <div>
            <p className="text-gray-700 font-medium text-sm">Task Created</p>
            <p className="text-gray-600 text-xs">June 1, 2023</p>
          </div>
          <div className="">
            <p className="text-gray-700 font-medium text-sm">Task Deadline</p>
            <p className="text-gray-600 text-xs">June 15, 2023</p>
          </div>
          <div className="">
            <p className="text-gray-700 font-medium text-sm">Created by</p>
            <p className="text-gray-600 text-xs">John Doe</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
          onClick={()=>{
            setedititme(true);
          }}
          >
            Edit 🕛
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{height:`85%`}}>
          <div className="bg-white bg-opacity-40 rounded-lg p-4 mb-4 max-w-screen-md mx-auto" style={{height:`95%`}}>
            {discussion.map((message, index) => (
              <div
                key={index}
                className="flex items-center mb-2 bg-white bg-opacity-40 rounded-md px-2 py-2 shadow-lg"
              >
                <img
                  src="https://via.placeholder.com/32"
                  alt="User"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-gray-700 mb-2 overflow-y-auto text-sm" style={{maxHeight:`200px`,width:`95%`}}>
                    {message.content}
                  </p>
                  <p className="text-gray-500 mb-1 text-xs">
                    {message.author+" "+message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 px-4 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
          >
            Send
          </button>
        </div>
      </div>
      {subtaskshow && <AddSubtask setsubtaskshow={setsubtaskshow} setSubtasks={setSubtasks} subtasks={subtasks}/>}
      {member && <AddTaskMember setmember={setmember} member={member}/>}
      {showmember && <ShowMembers setmember={setshowmember} member={showmember}/>}
      {edititime && <EditTime settime={setedititme}/>}
      {(subtaskshow || member || showmember || edititime)  && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>} {/* Overlay */}
    </div>
  );
};

export default Task;
