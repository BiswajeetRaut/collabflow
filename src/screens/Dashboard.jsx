import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { useSelector } from 'react-redux'
import firebase from 'firebase';
import { storage } from '../firebase';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { selectUserId } from '../features/user/userSlice';
import db from '../firebase';
import { useHistory } from 'react-router-dom';
import { setProject } from '../features/project/projectSlice';
import {useDispatch} from 'react-redux';
const Dashboard = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const [img,setimg]=useState('');
    const [name,setname] = useState('');
    const [users, setUsers] = useState({})
    const [projects, setProjects] = useState([])
    const getData = () => {
        db.collection('Users').doc(userId).get().then((res) => {
            setUsers(res.data());
            setname(res.data().username==undefined?'':res.data().username);
        })
    }
    const getProjects = () => {
        var projects = [];
        db.collection('Projects').get().then((res) => {
            res.docs.forEach((doc) => {
                doc.data().members.map((member) => {
                    if (member.id == userId) {
                        var obj = doc.data();
                        obj['id'] = doc.id;
                        projects.push(obj)
                    }
                })
            })
            setProjects(projects);
        })
    }
    useEffect(() => {
        getData()
        getProjects()
    }, [])
    const [iseditable, setiseditable] = useState(false)
    const handleUpdate = ()=>{
        const fileName = `${Date.now()}_${img.name}`;
    }
    return (
        <div className="dash-cont">
            <div className="dashboard">
                <div className="dashboard-sidebar">

                    <div key={users.id} className="user-card">
                        <img src={users.photo} alt={users.name} className="user-dp" />
                        {
                            iseditable ? <input type="file" onChange={(e)=>{setimg(e.target.files[0])
                                console.log(e.target.files[0]);
                            }}/> : <></>
                        }
                    </div>

                </div>
                <div className="dashboard-content">

                    <div className="user-details">
                        <h2 className="user-name">{
                            iseditable ?
                                <input type="text" value={users.name} />
                                :
                                users.name
                        }
                        </h2>
                        <p className="user-email">username: {
                            iseditable ?
                                <input type="text" value={name} onChange={(e)=>{
                                    setname(e.target.value);
                                }}/>
                                :
                                users.username
                        }</p>
                        <p className="user-email">email: {
                            users.email
                        }</p>
                        {/* Add more user details as needed */}
                    </div>
                    {/*<button className='button' onClick={() => {
                        setiseditable(!iseditable)
                    }}>{iseditable ? '' : 'EDIT'}</button>*/}
                </div>
                <div className="empty">

                </div>
            </div>
            <div className='pro'>Projects:</div>
            <div className="showProject">
                {
                    projects.map((project) => {
                        return (
                            <div className="project-card cursor-pointer hover:scale-105 transition-all ease-in-out" onClick={()=>{
                                dispatch(setProject({
                                    id: project.id,
                                }))
                                history.push('/home/1');
                            }}>
                                <div className="project-top">

                                    <div className="pro-name">
                                        {project.name}
                                    </div>

                                    <div className="datess">
                                        deadline: {new Date(project.endDate?.toDate().toISOString()).toLocaleString().slice(0, 10)}
                                    </div>
                                </div>
                                <div className="project-bottom flex flex-col items-center justify-center">
                                    {<img src={project?.admin[0]?.photo} alt="" className='h-20 w-20 rounded-full'/>}
                                    created by: {project?.admin[0]?.name}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Dashboard;
