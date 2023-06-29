import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { useSelector } from 'react-redux'

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { selectUserId } from '../features/user/userSlice';
import db from '../firebase';
const Dashboard = () => {
    const userId = useSelector(selectUserId)
    const [users, setUsers] = useState({})
    const [projects, setProjects] = useState([])
    const getData = () => {
        db.collection('Users').doc(userId).get().then((res) => {
            setUsers(res.data());
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

    // Add more users as needed


    return (
        <div className="dash-cont">
            <div className="dashboard">
                <div className="dashboard-sidebar">

                    <div key={users.id} className="user-card">
                        <img src={users.photo} alt={users.name} className="user-dp" />
                        {
                            iseditable ? <input type="file" /> : <></>
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
                                <input type="text" value={users.username} />
                                :
                                users.username
                        }</p>
                        <p className="user-email">email: {
                            users.email
                        }</p>
                        {/* Add more user details as needed */}
                    </div>
                    <button className='button' onClick={() => setiseditable(!iseditable)}>{iseditable ? 'UPDATE' : 'EDIT'}</button>
                </div>
                <div className="empty">

                </div>
            </div>
            <div className='pro'>Projects:</div>
            <div className="showProject">
                {
                    projects.map((project) => {
                        return (
                            <div className="project-card">
                                <div className="project-top">

                                    <div className="pro-name">
                                        {project.name}
                                    </div>

                                    <div className="datess">
                                        deadline: {new Date(project.endDate?.toDate().toISOString()).toLocaleString().slice(0, 10)}
                                    </div>
                                </div>
                                <div className="project-bottom">
                                    <div className="pro-id">
                                        id: {project.id}
                                    </div>
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
