import React, { useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import HomeNavbar from '../components/HomeNavbar'
import './Home.css';
import RightSidebar from '../components/RightSidebar';
import { useParams } from 'react-router-dom';
import Task from '../components/Tasks';
import Timeline from '../components/Timeline';
import Teams from '../components/Teams';
import Overview from '../components/Overview';
import Discussion from '../components/Discussion';
import Mentions from '../components/Mentions';
import {AiFillWechat} from 'react-icons/ai';
import ChatGPT from '../modals/Chatgpt';
const Home = () => {
    const {id} = useParams();
    const [chatgpt,setchatgpt]=useState(false);
    const [messages,setMessages]=useState([]);
    const [responses,setResponses] = useState([{
        text: "Hola I am your assistant. I will help you regarding planning, scheduling any technical issues you are having while doing your task."
        
    }]);
    return (
        <div className='home'>
        <div
        style={{
            width: `100%`,
    position: `absolute`,
    top: `90px`,
    height:`1px`,
    backgroundColor:`black`,
    border:`none`,
        }}/>
        <div className="home_part" style={{
        }}>
        <HomeNavbar/>
        {
            id==1 ? <Overview/>: id == 2 ?<Teams/> : id==3 ? <Task/> :id==4 ?<Timeline/> : <Discussion/>
        }
        </div>
        <div className="calender_part">
        <RightSidebar/>
        </div>
        <LeftSidebar/>
        <div className="absolute bottom-5 right-5 h-10 w-10 rounded-full shadow-md bg-purple-500 bg-opacity-80 flex items-center justify-center cursor-pointer hover:scale-110 transition-all ease-in-out hover:bg-opacity-100" onClick={()=>{
            setchatgpt(true);
        }}>
            <AiFillWechat color='white' style={{transform:`scale(1.5)`}}/>
        </div>
        {chatgpt && <ChatGPT setchatgpt={setchatgpt} messages={messages} responses={responses} setMessages={setMessages} setResponses={setResponses} />}
    </div>

  )
}

export default Home
