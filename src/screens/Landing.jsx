import React, { useEffect } from 'react';
import './Landing.css';
import landing from '../assets/landing.png'
import {FaGoogle} from 'react-icons/fa';
import firebase from 'firebase';
import {storage} from '../firebase';
import { selectUserName,
  selectUserPhoto,
  setUserLoginDetails,
  setSignOutState, 
  selectUserId} from '../features/user/userSlice.js';
import {useDispatch,useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import db from '../firebase';
import {auth,provider} from '../firebase';
const Landing = () => {
  const dispatch= useDispatch();
  const history= useHistory();
  const userName = useSelector(selectUserName);
  const userPhoto= useSelector(selectUserPhoto);
  // useEffect(()=>{
  //   auth.onAuthStateChanged(async(user)=>{
  //     if(user){
  //       setUser(user)
  //       history.push("/home/1");
  //     }
  //   })
  // },[userName]);
  const userid = useSelector(selectUserId);
  useEffect(()=>{
    if(userid!=''&&userid!=null&&userid!=undefined)
    {
      console.log('userid == '+ userid);
      history.push('home/1');
    }
  })
  const handle= ()=>{
    console.log(userName);
    auth.signInWithPopup(provider).then((result)=>{
      setUser(result.user);
    }).catch((error)=>{
      alert(error.message);
    });
  }
  const setUser=(user)=>{
    console.log(user.email);
    db.collection('Users').where('email','==',user.email).get()
    .then((res)=>{
      var id;
      if(res.docs.length>0)
      {
        id=res.docs[0].id;
        dispatch(
          setUserLoginDetails({
            name: res.docs[0].data().name,
            id: res.docs[0].id,
            photo: res.docs[0].data().photo,
            email:res.docs[0].data().email,
          }
          )
        )
        history.push('/home/1');
      }
      else if (res.docs.length ==0){
        db.collection('Users').add({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }).then((docRef)=>{
          dispatch(
            setUserLoginDetails({
              name: user.displayName,
              id: docRef.id,
              photo: user.photoURL,
              email:user.email,
            }
            )
          )
          history.push('/home/1');
        }).catch((e)=>{
          console.log(e);
        })
      }

    }).catch((e)=>{
      console.log(e.message);
    })
}
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-FC95B4 to-FFCE62 landing__page">
      <header className="bg-transparent w-full py-8 px-8">
        <nav className="container mx-auto flex items-center justify-between">
          <a  className="text-FFFAE5 text-2xl font-bold">
            CollabFlow
          </a>
        </nav>
      </header>

      <main className="container mx-auto flex flex-col items-center justify-center px-4 mt-20 mb-40">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-FFFAE5 mb-8 font-clash-display">
          Manage and collaborate in your projects with CollabFlow
        </h1>
        <div className="flex space-x-4 mb-12">
          <a className="bg-transparent border border-EB7B26  text-EB7B26  py-3 px-6 rounded-lg font-bold text-lg transition duration-300 ease-in-out login_button flex justify-center items-center gap-2"
          onClick={()=>{
          handle();
        }}
          >
          <FaGoogle/> Continue With Google
          </a>
        </div>
        <p className="text-FFFAE5 text-center mb-8">
          Collaborate, manage tasks, and communicate effectively in your projects with CollabFlow. Simplify project management and improve productivity.
        </p>
        <p className="text-FFFAE5 text-center mb-8">
          CollabFlow provides features like task assignment, daily routines, chat functionality, and more. It is a comprehensive project management tool for individuals and teams.
        </p>
        <p className="text-FFFAE5 text-center">
          Sign up today and take control of your projects with CollabFlow!
        </p>
      </main>

      <footer className="bg-FFFAE5 w-full py-8 fixed bottom-0">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Your Website. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
