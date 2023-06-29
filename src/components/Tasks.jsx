import React, { useState } from 'react'
import AddTask from '../modals/AddTask';
import { Button, Dropdown } from 'flowbite-react';
import db from '../firebase';
import { useSelector } from 'react-redux'
import { selectProjectId } from '../features/project/projectSlice';
import { selectUserId } from '../features/user/userSlice';
import { useEffect } from 'react';
const Tasks = () => {
  const projectId = useSelector(selectProjectId)
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [todo, settodo] = useState([]);
  const [inprogress, setinprogress] = useState([]);
  const [complete, setcomplete] = useState([]);
  const [project, setproject] = useState({});
  const userid = useSelector(selectUserId);
  const userId = useSelector(selectUserId);
  const [generaltasks, setgeneraltasks] = useState([]);
  const getData = () => {
    db.collection('Projects').doc(projectId).collection('Tasks').onSnapshot((snapshot) => {
      var general_documents = [];
      var personal_documents = [];
      snapshot.docs.forEach((doc) => {
        if (doc.data().visibility == 'general') {
          var temp = doc.data();
          temp.id = doc.id;
          general_documents.push(temp);
          console.log(temp);
        }
        else {
          var flag = 0
          doc.data().members.forEach((member) => {
            if (member.id == userId) {
              flag = 1;
            }
            if (flag == 1) {
              var temp = doc.data();
              temp.id = doc.id;
              personal_documents.push(temp);
            }
          })
        }
      })
      setTasks(general_documents);
    })
  }
  useEffect(() => {
    // getData();
    db.collection('Projects').doc(projectId).get().then((res) => {
      setproject(res.data());
    }).catch((err) => { });
    db.collection('Projects').doc(projectId).collection('Tasks').orderBy('endDate', 'asc').onSnapshot(snapshot => {
      var todos = [];
      var progress = [];
      var completes = [];
      snapshot.docs.forEach(doc => {
        if (doc.data().visibility == 'general') {
          var temp = doc.data();
          temp.id = doc.id;
          if (doc.data().status == 'todo') {
            todos.push(temp);
          }
          else if (doc.data().status == 'inprogress') {
            progress.push(temp);
          }
          else if (doc.data().status == 'complete') {
            completes.push(temp);
          }
        }
        else {
          doc.data().members.forEach(member => {
            if (member.id == userid) {
              var temp = doc.data();
              temp.id = doc.id;
              if (doc.data().status == 'todo') {
                todos.push(temp);
              }
              else if (doc.data().status == 'inprogress') {
                progress.push(temp);
              }
              else if (doc.data().status == 'complete') {
                completes.push(temp);
              }
            }
          })
        }
      });
      settodo(todos);
      setinprogress(progress);
      setcomplete(completes);
    })
  }, [])
  const options = ['To Do', 'In progress', 'Completed'];
  const [taskoption, settaskoption] = useState(options[0]);
  const [type, settype] = useState('Global');
  return (
    <div className="overview__part">
      <div className="overview__heading">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900/60 text-center mb-4">Tasks</h1>
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 ">{project.name}</h1>
          <span className='text-sm text-gray-500'>
            Project Started On: 27 August 2022
          </span>
          <br />
          <span className='text-sm text-gray-500'>
            Expected End Date: 27 August 2023
          </span>
          <br />
          <div className="heading">
            <Button color="gray" className='mt-4 w-40 shadow-md' onClick={() => {
              setShowModal(!showModal);
            }}>
              <p>
                Add a Task
              </p>
            </Button>
          </div>
          <div className="flex justify-between gap-5 mt-5">
            <div className="w-1/3 bg-white bg-opacity-40 rounded-lg p-4 cursor-pointer hover:scale-105 transition-all ease-in" onClick={() => {
              settaskoption(options[0]);
            }}
              style={{
                boxShadow: `0 0 11px #00000042`,
              }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer">To Do</h2>
              <p className="text-2xl font-bold text-gray-900">{todo.length}</p>
            </div>
            <div className="w-1/3 bg-white bg-opacity-40 rounded-lg p-4 cursor-pointer hover:scale-110 transition-all ease-in" onClick={() => {
              settaskoption(options[1]);
            }}
              style={{
                boxShadow: `0 0 11px #00000042`,
              }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">In Progress</h2>
              <p className="text-2xl font-bold text-gray-900">{inprogress.length}</p>
            </div>
            <div className="w-1/3 bg-white bg-opacity-40 rounded-lg p-4 cursor-pointer hover:scale-110 transition-all ease-in" onClick={() => {
              settaskoption(options[2]);
            }}
              style={{
                boxShadow: `0 0 11px #00000042`,
              }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Completed</h2>
              <p className="text-2xl font-bold text-gray-900">{complete.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="overview__works mx-auto px-4">
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-md text-gray-500 '>{taskoption}</h1>
          <Dropdown
            label={type + ' Type'}
            color="#e7e7e775"
            className='rounded-md shadow-sm'
          >
            <Dropdown.Item onClick={() => {
              settype('Personalised');
            }}>
              Personalised
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
              settype('Global');
            }}>
              Global
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white bg-opacity-40 rounded-lg p-4 max-w-screen-lg mx-auto overflow-y-auto max-h-96">
            <div className="flex flex-wrap -mx-2">
              {taskoption == options[0] ? type == 'Global' ? todo.map((task, index) => {
                if (task.visibility == "general") {
                  return (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Deadline: {new Date(task?.endDate?.toDate().toDateString()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )
                }
              }
              ) : todo.map((task, index) => {
                if (task.visibility == 'personal') {
                  return (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Deadline: {new Date(task?.endDate?.toDate().toDateString()).toLocaleDateString() }</p>
                      </div>
                    </div>
                  )
                }
              }
              ) : taskoption == options[1] ? type == 'Global' ? inprogress.map((task, index) => {
                if (task.visibility == "general") {
                  return (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Deadline: {new Date(task?.endDate?.toDate().toDateString()).toLocaleDateString() }</p>
                      </div>
                    </div>
                  )
                }
              }
              ) : inprogress.map((task, index) => {
                if (task.visibility == 'personal') {
                  return (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Deadline: {new Date(task?.endDate?.toDate().toDateString()).toLocaleDateString() }</p>
                      </div>
                    </div>
                  )
                }
              }
              ) : type == 'Global' ? complete.map((task, index) => {
                if (task.visibility == "general") {
                  return (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Deadline: {new Date(task?.endDate?.toDate().toDateString()).toLocaleDateString() }</p>
                      </div>
                    </div>
                  )
                }
              }
              ) : complete.map((task, index) => {
                if (task.visibility == 'personal') {
                  return (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2" key={index}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Deadline: { new Date(task?.endDate?.toDate().toDateString()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )
                }
              }
              )
              }
            </div>
          </div>
        </div>
      </div>
      <AddTask showModal={showModal} setShowModal={setShowModal} />

    </div>
  )
}

export default Tasks
