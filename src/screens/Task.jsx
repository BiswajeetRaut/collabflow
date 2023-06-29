import React, { useRef, useState } from 'react';
import './Task.css'
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import AddSubtask from '../modals/AddSubtask';
import AddTaskMember from '../modals/AddTaskMember';
import { useSelector } from 'react-redux';
import ShowMembers from '../modals/ShowMembers';
import firebase from 'firebase';
import EditTime from '../modals/EditTime';
import { useParams } from 'react-router-dom';
import { selectProjectId } from '../features/project/projectSlice';
import db from '../firebase';
import { useEffect } from 'react';
import { selectUserId, selectUserName, selectUserPhoto } from '../features/user/userSlice';
import { useHistory } from 'react-router-dom';
const Task = () => {
  const bottomRef = useRef(null);
  const history = useHistory()
  const [discussion, setDiscussion] = useState([]);
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [discussion]);
  const user = {}
  user.id = useSelector(selectUserId)
  user.name = useSelector(selectUserName)
  user.photo = useSelector(selectUserPhoto)
  const { taskid } = useParams()
  const projectId = useSelector(selectProjectId);
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskTitle, setTaskTitle] = useState('taskTitle');
  const [visibility, setvisibility] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [dates, setDates] = useState({});
  const [edititime, setedititme] = useState(false);
  const [showmember, setshowmember] = useState(false);
  const [member, setmember] = useState(false);
  const [members, setMembers] = useState([]);
  const [subtaskshow, setsubtaskshow] = useState(false);
  const [message, setMessage] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const getData = () => {
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).get().then((res) => {
      const task = res.data();
      setTaskTitle(task.title)
      setTaskDescription(task.description)
      setMembers(task.members)
      setCreatedBy(task.created_by)
      var dat = {
        startDate: '',
        endDate: ''
      }
      dat.startDate = (new Date(task.startDate?.toDate().toDateString())).toLocaleDateString()
      dat.endDate = (new Date(task.endDate?.toDate().toDateString())).toLocaleDateString()
      setDates(dat);
      setvisibility(task.status)
    })
    getSubtask()
  }
  const getSubtask = () => {
    var documents = []
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).collection('SubTasks').onSnapshot((res) => {
      res.docs.forEach((doc) => {
        var obj = {
          id: doc.id,
          subtaskTitle: doc.data().subtaskTitle,
          description: doc.data().description,
          startDate: (new Date(doc.data().startDate?.toDate().toDateString())).toLocaleDateString(),
          endDate: (new Date(doc.data().endDate?.toDate().toDateString())).toLocaleDateString(),
        }
        documents.push(obj)
      })
      setSubtasks(documents)
    })
  }
  const getComments = () => {
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).collection('Comments').orderBy('date', 'asc').onSnapshot((snapshot) => {
      var docs = [];
      snapshot.docs.forEach((doc) => {
        var dat = new Date(doc.data().date?.toDate().toISOString()).toLocaleString()
        var obj = doc.data()
        obj.date = dat
        // console.log(dat)
        docs.push(obj);
      })
      setDiscussion(docs);
    })
  }
  useEffect(() => {
    getData();
    getComments();
  }, [edititime])
  const setupdate = () => {
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).update({
      title: taskTitle,
      description: taskDescription,
    })
    getData()
  }
  const updateVisibility = (e) => {
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).update({
      status: e.target.value,
    })
  }
  const handleAddSubtask = () => {
    setsubtaskshow(true);
  };
  const handleAddMember = () => {
    // Perform add member logic here
    if (members.find((member) => member.id == selectedMember.id)) {
      alert('member already exists please select another member')
      return
    }
    var mem = members
    mem.push(selectedMember);
    setMembers(mem);
    //db calling part here 
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).update({
      members: members
    })
    setmember(!member);
  };
  const handleSubtaskDescriptionChange = (e, index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].description = e.target.value;
    setSubtasks(updatedSubtasks);
  };

  const handleSendMessage = () => {
    if (message) {
      const newMessage = {
        sender_id: user.id,
        sender_name: user.name,
        message: message,
        date: new Date(),
        sender_photo: user.photo
      };
      db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).collection('Comments').add(newMessage);
      setDiscussion([newMessage, ...discussion]);
      setMessage('');
    }
  };
  const updatesubtask = (id, ind) => {
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).collection('SubTasks').doc(id).update({
      description: subtasks[ind].description,
    })
    getSubtask()
  }
  const deleteSubtask = (id) => {
    db.collection('Projects').doc(projectId).collection('Tasks').doc(taskid).collection('SubTasks').doc(id).delete()
    getSubtask()
  }
  return (
    <div className="flex h-full task__page bg-transparent overflow-y-hidden">
      {/* Left Section */}
      <div className="flex-1 bg-transparent p-4 overflow-y-auto" style={{
        borderRight: `1px solid black`,
        borderBottom: `1px solid black`
      }}>
        <div className="flex items-center mb-4 justify-evenly">
          <FaArrowLeft className='mr-2 text-gray-800/75 cursor-pointer' onClick={()=>history.goBack()}/>
          <div className="relative">
            <div className="inline-block relative">
              <select
                className="block appearance-none bg-white bg-opacity-40 w-50 py-2 border-0 px-4 pr-8 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={updateVisibility}
              >
                <option value="todo" selected={visibility == 'todo' ? true : false}>To Do</option>
                <option value="inprogress" selected={visibility == 'inprogress' ? true : false}>In Progress</option>
                <option value="complete" selected={visibility == 'complete' ? true : false}>Done</option>
              </select>
            </div>
          </div>
          <button className="ml-2 px-2 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
            onClick={() => {
              setmember(true);
            }}
          >
            Add Member
          </button>
          <button className="ml-2 px-2 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
            onClick={() => {
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
          <button className="px-2 py-2 text-sm font-medium text-black bg-white/40 bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md" onClick={() => setupdate()}>
            Update
          </button>
        </div>
        <label className=" mt-4 text-center block font-medium text-gray-700 mb-2 text-2xl">
          Subtasks
        </label>
        <div className="bg-white bg-opacity-50 px-3 py-3 overflow-y-auto rounded-lg shadow-xl">
          <div style={{ textAlign: 'right', margin: '10px' }}>
            <button
              onClick={handleAddSubtask}
              className="px-4 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
            >
              Add Subtask
            </button>
          </div>
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex flex-col items-center mb-2 bg-white rounded-md px-3 py-3 shadow-md" style={{ background: `linear-gradient(182deg, #e8e8e8, #f9f9f9)` }}>
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
                <div className='text-sm text-gray-600'>{subtask.startDate} - {subtask.endDate}</div>
                <button className="px-1 py-1 text-xs text-black bg-white/40 bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
                  onClick={() => deleteSubtask(subtask.id)}>
                  Delete
                </button>
                <button className="px-1 py-1 text-xs text-black bg-white/40 bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md" onClick={() => updatesubtask(subtask.id, index)}>
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-transparent p-4 right__section overflow-y-auto">
        <div className="flex items-center mb-4 justify-evenly w-full">
          <div>
            <p className="text-gray-700 font-medium text-sm">Task started</p>
            <p className="text-gray-600 text-xs">{dates.startDate}</p>
          </div>
          <div className="">
            <p className="text-gray-700 font-medium text-sm">Task Deadline</p>
            <p className="text-gray-600 text-xs">{dates.endDate}</p>
          </div>
          <div className="">
            <p className="text-gray-700 font-medium text-sm">Created by</p>
            <p className="text-gray-600 text-xs">{createdBy}</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
            onClick={() => {
              setedititme(true);
            }}
          >
            Edit 🕛
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ height: `85%` }}>
          <div className="bg-white bg-opacity-40 rounded-lg p-4 mb-4 max-w-screen-md mx-auto" style={{ height: `95%`, overflow: 'auto' }}>
            {discussion.map((message, index) => (
              <div
                ref={bottomRef}
                key={index}
                className="flex items-center mb-2 bg-white bg-opacity-40 rounded-md px-2 py-2 shadow-lg"
              >
                <img
                  src={message.sender_photo}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-gray-700 mb-2 overflow-y-auto text-sm" style={{ maxHeight: `200px`, width: `95%` }}>
                    {message.message}
                  </p>
                  <p className="text-gray-500 mb-1 text-xs">
                    {message.sender_name + " " + message.date}
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
            type='submit'
            onClick={handleSendMessage}
            className="ml-4 px-4 py-2 text-sm font-medium text-black bg-white bg-opacity-40 rounded-md hover:bg-black hover:text-white shadow-md"
          >
            Send
          </button>
        </div>
      </div>
      {subtaskshow && <AddSubtask setsubtaskshow={setsubtaskshow} taskid={taskid} getSubtask={getSubtask} />}
      {member && <AddTaskMember setmember={setmember} member={member} selectedMember={selectedMember} setSelectedMember={setSelectedMember} handleAddMember={handleAddMember} />}
      {showmember && <ShowMembers setmember={setshowmember} member={showmember} members={members} />}
      {edititime && <EditTime settime={setedititme} taskid={taskid} dates={dates} />}
      {(subtaskshow || member || showmember || edititime) && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>} {/* Overlay */}
    </div>
  );
};

export default Task;
