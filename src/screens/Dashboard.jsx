import React, { useState } from 'react';
import './dashboard.css';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
const Dashboard = () => {
    const [iseditable, setiseditable] = useState(false)
    const users =
    {
        id: 1,
        name: 'John Doe',
        username: 'JohnD',
        email: 'john.doe@example.com',
        dp: 'https://randomuser.me/api/portraits/men/1.jpg',
    }
    // Add more users as needed
    const projects = [
        {
            project_id: '2e33g',
            project_name: 'CollabFlow',
            start_date: '22-06-2023',
        },
        {
            project_id: '2e33g',
            project_name: 'Estate360',
            start_date: '22-06-2023',
        },
        {
            project_id: '2e33g',
            project_name: 'Microsoft',
            start_date: '22-06-2023',
        },
        {
            project_id: '2e33g',
            project_name: 'CollabFlow2',
            start_date: '22-06-2023',
        },
    ]

    return (
        <div className="dash-cont">
            <div className="dashboard">
                <div className="dashboard-sidebar">

                    <div key={users.id} className="user-card">
                        <img src={users.dp} alt={users.name} className="user-dp" />
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
                                        {project.project_name}
                                    </div>
                                    <div className="pro-id">
                                        id: {project.project_id}
                                    </div>
                                    <div className="datess">
                                        deadline: {project.start_date}
                                    </div>
                                </div>
                                <div className="project-bottom">
                                    <button><ExitToAppIcon />LEAVE PROJECT</button>
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
