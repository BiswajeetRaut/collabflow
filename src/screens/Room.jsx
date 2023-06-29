import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { selectUserId, selectUserName } from '../features/user/userSlice';
import db from '../firebase';
import firebase from 'firebase'
import { selectProjectId } from '../features/project/projectSlice';
const Room = () => {
    const { roomid } = useParams();
    const user = {};
    const history = useHistory();
    const projectId = useSelector(selectProjectId);
    user.id = useSelector(selectUserId);
    user.name = useSelector(selectUserName);
    const [appid, setappid] = useState(0);
    const [serversecret, setserversecret] = useState('');
    const [roomhost, setroomhost] = useState('');
    useEffect(() => {
        db.collection('MeetIDS').get().then((res) => {
            res.docs.forEach((doc) => {
                setappid(doc.data().appID);
                setserversecret(doc.data().serverSecret);
            })
        })
        db.collection('Projects').doc(projectId).collection('Meets').doc(roomid).get().then((res) => {
            setroomhost(res.data().createdBy.id);
        })
    }, [roomid, user,])
    const myMeeting = async (element) => {

        try {
            const appID = appid;
            const serverSecret = serversecret;
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, user.id, user.name);
            const zc = ZegoUIKitPrebuilt.create(kitToken);
            zc.joinRoom({
                container: element,
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
                showScreenSharingButton: true,
                showMyCameraToggleButton: true,
                onLeaveRoom: () => {
                    if (user.id != roomhost) {
                        return;
                    }
                    var check = window.confirm('Do You want to end the meeting ?');
                    if (check) {
                        db.collection('Projects').doc(projectId).collection('Meets').doc(roomid).update({
                            endTime: firebase.firestore.FieldValue.serverTimestamp(),
                        }).then(() => {
                            history.push('/home/1');
                        }).catch(() => {

                        });
                    }
                    else {

                    }
                },
                onUserJoin: () => {
                    console.log('Joined');
                },
                whiteboardConfig: {
                    showAddImageButton: true,
                    showCreateAndCloseButton: true,
                },
            })
        } catch (err) {
            // alert('Something went wrong');
        }

    }
    return (
        <div ref={myMeeting} className='h-full w-full'>

        </div>
    )
}

export default Room