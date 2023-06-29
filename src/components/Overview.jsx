import React, { useEffect, useState } from 'react'
import './Overview.css';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProjectId } from '../features/project/projectSlice';
import db from '../firebase';
import { selectUserId } from '../features/user/userSlice';
const Overview = () => {
  const projectId = useSelector(selectProjectId);
  const [tasks, settasks] = useState([]);
  const [todo, settodo] = useState([]);
  const [inprogress, setinprogress] = useState([]);
  const [complete, setcomplete] = useState([]);
  const [project, setproject] = useState({});
  const [datewisetodo, setdatewisetodo] = useState([]);
  const [datewiseprogress, setdatewiseprogress] = useState([]);
  const [datewisecomplete, setdatewisecomplete] = useState([]);
  const [incompletetask, setincompletetask] = useState([]);
  const [clickshow, setclickshow] = useState(false);
  const history = useHistory();
  const userid = useSelector(selectUserId);
  useEffect(() => {
    db.collection('Projects').doc(projectId).get().then((res) => {
      setproject(res.data());
    }).catch((err) => { });
    db.collection('Projects').doc(projectId).collection('Tasks').orderBy('endDate', 'asc').onSnapshot(snapshot => {
      var todos = [];
      var progress = [];
      var completes = [];
      snapshot.docs.forEach(doc => {
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
      });
      settodo(todos);
      setinprogress(progress);
      setcomplete(completes);
    })
  }, [projectId,]);
  useEffect(() => {
    // console.log(todo[0]?.endDate?.toDate > new Date());
    var uniqueDate = {};
    var incomplete = [];
    todo.map((task) => {
      if (new Date(task?.endDate?.toDate()) < new Date()) {
        incomplete.push(task);
      }
      else {
        uniqueDate[new Date(task.endDate?.toDate().toDateString())] = uniqueDate[new Date(task.endDate?.toDate().toDateString())] == undefined ? [task] : [...uniqueDate[new Date(task.endDate?.toDate().toDateString())], task];
      }
    })
    console.log(Object.entries(uniqueDate));
    setdatewisetodo(Object.entries(uniqueDate));
    uniqueDate = {};
    inprogress.map((task) => {
      if (new Date(task?.endDate?.toDate()) < new Date()) {
        incomplete.push(task);
      }
      else {
        uniqueDate[new Date(task.endDate?.toDate().toDateString())] = uniqueDate[new Date(task.endDate?.toDate().toDateString())] == undefined ? [task] : [...uniqueDate[new Date(task.endDate?.toDate().toDateString())], task];
      }
    })
    setdatewiseprogress(Object.keys(uniqueDate));
    uniqueDate = {};
    complete.map((task) => {
      uniqueDate[new Date(task.endDate?.toDate().toDateString())] = uniqueDate[new Date(task.endDate?.toDate().toDateString())] == undefined ? [task] : [...uniqueDate[new Date(task.endDate?.toDate().toDateString())], task];
    })
    setincompletetask(incomplete);
  }, [todo, inprogress, complete])
  const options = ['To Do', 'In progress', 'Completed'];
  const [taskoption, settaskoption] = useState(options[0]);
  console.log(todo, inprogress, complete);
  return (
    <div className="overview__part">
      <div className="overview__heading">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900/60 text-center mb-4">Overview</h1>
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 ">{project?.name}</h1>
          <span className='text-sm text-gray-500'>
            Project Started On: {new Date(project?.startDate?.toDate()).toDateString()}
          </span>
          <br />
          <span className='text-sm text-gray-500'>
            Expected End Date: {new Date(project?.endDate?.toDate()).toDateString()}
          </span>
          <br />
          <span className='text-sm text-gray-500 mb-8'>
            Your Role: UI Designer
          </span>
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
        <h1 className='text-md text-gray-500 '>{taskoption}</h1>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white bg-opacity-40 rounded-lg p-4 max-w-screen-lg mx-auto overflow-y-auto max-h-96">
            <div className="flex flex-wrap -mx-2">
              {taskoption == options[0] ? (datewisetodo.map((task, index) => (
                <div className='w-full text-gray-600 font-semibold flex flex-col flex-wrap mb-2 text-center justify-center'>
                  <div className=''>
                    {task[0]}
                  </div>
                  <div className='flex flex-wrap w-full justify-center items-center'>
                    {
                      task[1].map((t, index) => {
                        return (<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mt-2 hover:scale-105 cursor-pointer" key={index} onClick={() => {
                          var taskredirect = '/task' + '/' + t.id;
                          history.push(taskredirect);
                        }}>
                          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h2>
                            <p className="text-gray-700">Started On: {new Date(t.startDate?.toDate()).toDateString()}</p>
                          </div>
                        </div>)
                      })
                    }
                  </div>
                </div>
              )
              )) : taskoption == options[1] ? (datewiseprogress.map((task, index) => (
                <div className='w-full text-gray-600 font-semibold flex flex-col flex-wrap mb-2 text-center justify-center' >
                  <div className=''>
                    {task[0]}
                  </div>
                  <div className='flex flex-wrap w-full justify-center items-center'>
                    {
                      task[1].map((t, index) => {
                        return (<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mt-2" key={index} onClick={() => {
                          var taskredirect = '/task' + '/' + t.id;
                          history.push(taskredirect);
                        }}>
                          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h2>
                            <p className="text-gray-700">Started On: {new Date(t.startDate?.toDate()).toDateString()}</p>
                          </div>
                        </div>)
                      })
                    }
                  </div>
                </div>
              )
              )) : (datewisecomplete.map((task, index) => (
                <div className='w-full text-gray-600 font-semibold flex flex-col flex-wrap mb-2 text-center justify-center'>
                  <div className=''>
                    {task[0]}
                  </div>
                  <div className='flex flex-wrap w-full justify-center items-center'>
                    {
                      task[1].map((t, index) => {
                        return (<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mt-2" key={index} onClick={() => {
                          var taskredirect = '/task' + '/' + t.id;
                          history.push(taskredirect);
                        }}>
                          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h2>
                            <p className="text-gray-700">Started On: {new Date(t.startDate?.toDate()).toDateString()}</p>
                          </div>
                        </div>)
                      })
                    }
                  </div>
                </div>
              )
              ))}
            </div>
          </div>
          <div className='w-full text-center mt-3'>
            <button className='bg-white bg-opacity-70 rounded-md px-2 py-2 shadow-md text-black hover:text-white hover:bg-black cursor-pointer'
              onClick={() => {
                setclickshow(!clickshow);
              }}
            >
              Click to check Incomplete Tasks
            </button>
            {
              clickshow &&
              <div className='w-full overflow-y-auto px-4 py-4 flex flex-wrap bg-white bg-opacity-40 mt-5 rounded-md shadow-md'>
                {
                  incompletetask.map((task, index) => {
                    return (<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mt-2" key={index} onClick={() => {
                      var taskredirect = '/task' + '/' + task.id;
                      history.push(taskredirect);
                    }}>
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-700">Ended On: {new Date(task.endDate?.toDate()).toDateString()}</p>
                      </div>
                    </div>)
                  })
                }
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
