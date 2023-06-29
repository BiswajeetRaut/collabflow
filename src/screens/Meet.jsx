import React, { useEffect, useState } from 'react'
import './Meet.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import db from '../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { selectProjectId } from '../features/project/projectSlice';
import { selectUserId, selectUserName, selectUserPhoto } from '../features/user/userSlice';
import { useHistory } from 'react-router-dom';
const Meet = () => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('');
    const [projectName, setprpojectName] = useState('');
    const [meetname, setmeetname] = useState('');
    const [meetid, setmeetid] = useState('');
    const [joinmeetid, setjoinmeetid] = useState('');
    const projectId = useSelector(selectProjectId);
    if (projectId == '' || projectId == null) {
        history.push('/home/1');
        alert('Please select a project');
    }
    const user = {};
    user.id = useSelector(selectUserId);
    user.name = useSelector(selectUserName);
    user.photo = useSelector(selectUserPhoto);
    const history = useHistory();
    const createMeet = () => {
        db.collection('Projects').doc(projectId).collection('Meets').add({
            createdBy: user,
            name: meetname,
            startTime: firebase.firestore.FieldValue.serverTimestamp(),
        }).then((res) => {
            console.log(res.id);
            setmeetid(res.id);
        }).catch(() => {
            alert('Could not create you meet');
        })
    }
    const joinMeet = () => {
        db.collection('Projects').doc(projectId).collection('Meets').doc(joinmeetid).get().then((res) => {
            if (res.exists) {
                if (res.data()?.endTime != undefined && res.data()?.endTime != null) {
                    alert('This meet has already been ended');
                    return;
                }
                history.push('/room' + '/' + joinmeetid);
            }
            else {
                alert('Please Enter a proper meet');
            }
        })
    }
    const [meet, setmeet] = useState([]);
    useEffect(() => {
        db.collection('Projects').doc(projectId).collection('Meets').orderBy('startTime', 'desc').onSnapshot(snapshot => {
            var documents = [];
            snapshot.docs.forEach(doc => {
                var temp = doc.data();
                temp.id = doc.id;
                documents.push(temp);
            })
            setmeet(documents);
            console.log(documents);
        })
        db.collection('Projects').doc(projectId).get().then((res) => {
            setprpojectName(res.data().name)
        })
    }, [])
    return (
        <div className="cont">
            <div className="navbar">
                <div className="head">
                    <span>{projectName}</span>
                </div>
                <div className="butt">
                    <button className='button' onClick={() => { setShowModal(true); setMode('Create') }}>
                        Create Meet
                    </button>
                    <button className='button' onClick={() => { setShowModal(true); setMode('Join') }}>
                        Join Meet
                    </button>
                </div>
            </div>
            <div className="cont-body">
                <div className="meet-cont">
                    {
                        meet.map((m) => (
                            <div className="meet-history-cont">
                                <div className="meet-icon">
                                    <CalendarMonthIcon sx={{ height: '2rem', width: '3rem' }} />
                                </div>
                                <div className="txt">
                                    <div className='meet-text'>
                                        <span className="meet-name">{m.name}</span>
                                        <span className='flex gap-2'>created By-<img src={m.createdBy.photo} alt="" className='w-6 h-6 rounded-full' /> {m.createdBy.name}</span>
                                    </div>
                                    <div className="meet-dates">
                                        <span>started at-{new Date(m.startTime?.toDate().toUTCString()).toLocaleString()}</span>
                                        <span>{m.endTime == undefined ? 'meet id is:' + m.id : 'ended at- ' + new Date(m?.endTime?.toDate().toUTCString()).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {showModal && (
                <div className="modals-overlay">
                    <div className="modals-container">
                        <div className="modals-header">
                            <div className="empty">

                            </div>
                            <h2 className="modals-title">{`${mode} meet`}</h2>
                            <button className="modals-close" onClick={() => setShowModal(false)}>
                                <span className="sr-only">Close</span>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modals-body">
                            {
                                mode == 'Create'
                                    ?
                                    <>

                                        <input type="text" placeholder='Enter Meet Name...' value={meetname} onChange={(e) => {
                                            setmeetname(e.target.value);
                                        }} required />

                                        <p><span>Your Meet Id is: </span><strong>{meetid}</strong>{'  Use this meet Id to join the meet.'}</p>
                                    </>
                                    :
                                    <>
                                        <input type="text" placeholder='Enter Meet id' value={joinmeetid} onChange={(e) => {
                                            setjoinmeetid(e.target.value);
                                        }} required />
                                    </>
                            }
                            <div className="but">
                                <button className='button' onClick={() => {
                                    mode == 'Create' ? createMeet() : joinMeet();
                                }}>
                                    {mode}
                                </button>
                                <button className='button' onClick={() => {
                                    setShowModal(false);
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Meet