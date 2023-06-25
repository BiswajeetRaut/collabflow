import React, { useState } from 'react'
import './Overview.css';
import { Link } from 'react-router-dom';
const Overview = () => {
    const project = {
        name: 'XYZ Project',
        tasks: {
          todo: 5,
          inProgress: 3,
          completed: 2,
        },
      };
      const tasks = [
        { title: 'Task 1', deadline: '2023-07-01' },
        { title: 'Task 2', deadline: '2023-07-05' },
        { title: 'Task 3', deadline: '2023-07-10' },
        { title: 'Task 4', deadline: '2023-07-15' },
        { title: 'Task 5', deadline: '2023-07-20' },
        { title: 'Task 6', deadline: '2023-07-25' },
        { title: 'Task 7', deadline: '2023-07-30' },
      ];
      const options = ['To Do', 'In progress', 'Completed'];
      const [taskoption, settaskoption] = useState(options[0]);
  return (
    <div className="overview__part">
        <div className="overview__heading">
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-4xl font-bold text-gray-900/60 text-center mb-4">Overview</h1> 
      <h1 className="text-4xl md:text-4xl font-bold text-gray-900 ">{project.name}</h1>
      <span className='text-sm text-gray-500'>
        Project Started On: 27 August 2022
      </span>
      <br />
      <span className='text-sm text-gray-500'>
        Expected End Date: 27 August 2023
      </span>
      <br />
      <span className='text-sm text-gray-500 mb-8'>
        Your Role: UI Designer
      </span>
      <div className="flex justify-between gap-5 mt-5">
        <div className="w-1/3 bg-white bg-opacity-40 rounded-lg p-4 cursor-pointer hover:scale-105 transition-all ease-in" onClick={()=>{
            settaskoption(options[0]);
          }}
          style={{
            boxShadow: `0 0 11px #00000042`,
          }}
          >
          <h2 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer">To Do</h2>
          <p className="text-2xl font-bold text-gray-900">{project.tasks.todo}</p>
        </div>
        <div className="w-1/3 bg-white bg-opacity-40 rounded-lg p-4 cursor-pointer hover:scale-110 transition-all ease-in" onClick={()=>{
            settaskoption(options[1]);
          }}
          style={{
            boxShadow: `0 0 11px #00000042`,
          }}
          >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">In Progress</h2>
          <p className="text-2xl font-bold text-gray-900">{project.tasks.inProgress}</p>
        </div>
        <div className="w-1/3 bg-white bg-opacity-40 rounded-lg p-4 cursor-pointer hover:scale-110 transition-all ease-in" onClick={()=>{
            settaskoption(options[2]);
          }}
          style={{
            boxShadow: `0 0 11px #00000042`,
          }}
          >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Completed</h2>
          <p className="text-2xl font-bold text-gray-900">{project.tasks.completed}</p>
        </div>
      </div>
    </div>
        </div>
        <div className="overview__works mx-auto px-4">
            <h1 className='text-md text-gray-500 '>{taskoption}</h1>
            <div className="container mx-auto px-4 py-8">
      <div className="bg-white bg-opacity-40 rounded-lg p-4 max-w-screen-lg mx-auto overflow-y-auto max-h-96">
        <div className="flex flex-wrap -mx-2">
          {tasks.map((task, index) => (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
      <p className="text-gray-700">Deadline: {task.deadline}</p>
    </div>
            </div>
          ))}
        </div>
      </div>
    </div>
        </div>
    </div>
  )
}

export default Overview
