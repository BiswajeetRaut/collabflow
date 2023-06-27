import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import {FaPlus,FaProjectDiagram,FaCross} from 'react-icons/fa'
import './LeftSiderbar.css';
import { setUserLoginDetails,setSignOutState } from '../features/user/userSlice';
import { selectUserId,selectUserName,selectUserPhoto,selectEmail } from '../features/user/userSlice';
import { selectProjectId,setProject,setSignOutProject } from '../features/project/projectSlice';
import {useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import db from '../firebase';
import {useSelector} from 'react-redux';

export default function LeftSidebar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  const userEmail = useSelector(selectEmail);
  const userid = useSelector(selectUserId);
  const [projects, setprojects] = useState([]);
  useEffect(() => {
    db.collection('Projects').onSnapshot(snapshot=>{
      var documents = [];
      snapshot.docs.map((doc)=>{
        doc.data().members.map((member)=>{
          if(member.id == userid)
          {
            var temp = doc.data();
            temp.id=doc.id;
            documents.push(temp);
          }
        })
      })
      setprojects(documents);
      console.log(projects);
    })
  }, [])
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example" style={{height:`100vh`,    
    background: `#ffffff6b`,
    boxShadow: `0 0 11px #bf68ff8f`,
    width:`220px`,
    zIndex:`999`,
    position:`absolute`,
    top:`0`,
    bottom:`0`,
    }}
    id='side'
    >
    <div className="toggler" onClick={()=>{
        try{
            document.getElementById('side').classList.toggle('close');
        }
        catch(e){

        }
    }}>
    </div>
    <Sidebar.Logo
        style={{
            display:`flex`,
            justifyContent:`center`,
            paddingLeft:'0px',
            alignItems:`center`,flexDirection:`row`
        }}  
      >
        <p className='text-2xl flex flex-row items-center justify-between gap-5'>
          CollabFlow
        </p>
      </Sidebar.Logo>
      <hr />
      <div className="profile mt-5 flex flex-col justify-center items-center align-middle mb-8">
        <img src={userPhoto ? userPhoto:"https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="" className="profile mb-5" style={{
            height:`40%`,
            width:`60%`,
            borderRadius:`50%`,
        }}/>
        <div className="profile__name" style={{fontWeight:`bold`, fontSize:`20px`}}>{userName!=undefined?userName:"User Name"}</div>
        <div className="profile__email" style={{fontSize:`12px`}}>{userEmail!=undefined?userEmail:"UserEmail"}</div>
      </div>
      <hr className='mb-5'/>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            icon={HiChartPie}
          >
            <a onClick={()=>history.push('/dashboard')}>
              Dashboard
            </a>
          </Sidebar.Item>
          <Sidebar.Collapse
            icon={FaProjectDiagram}
            label="Projects"
          >
            {
              projects.map(project=>{
                return(
              <Sidebar.Item onClick={()=>{
                console.log("Project");
                dispatch(setProject({
                  id: project.id,
                }))
              }}>  
              {project.name}
            </Sidebar.Item>
                )
              })
            }
          <Sidebar.Item
          >
            <a style={{display:`flex`,gap:`5px`,alignItems:`center`,justifyContent:`center`}}  onClick={() => history.push('/addProject')}>
             New Project
             <FaPlus></FaPlus>
            </a >
          </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item
            icon={HiTable}
            onClick={()=>{
              dispatch(setSignOutState());
              dispatch(setSignOutProject());
              history.push('/');
            }}
          >
            <p>
              Log Out
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}


