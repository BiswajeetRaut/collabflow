import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import {FaPlus,FaProjectDiagram,FaCross} from 'react-icons/fa'
import './LeftSiderbar.css'
export default function LeftSidebar() {
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
        <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="" className="profile mb-5" style={{
            height:`40%`,
            width:`60%`,
            borderRadius:`50%`,
        }}/>
        <div className="profile__name" style={{fontWeight:`bold`, fontSize:`20px`}}>Biswajeet Raut</div>
        <div className="profile__email" style={{fontSize:`12px`}}>biswajeetraut382@gmail.com</div>
      </div>
      <hr className='mb-5'/>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="#"
            icon={HiChartPie}
          >
            <p>
              Dashboard
            </p>
          </Sidebar.Item>
          <Sidebar.Collapse
            icon={FaProjectDiagram}
            label="Projects"
          >
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
          <Sidebar.Item
          >
            <p style={{display:`flex`,gap:`5px`,alignItems:`center`,justifyContent:`center`}}>
             New Project
             <FaPlus></FaPlus>
            </p>
          </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item
            href="#"
            icon={HiTable}
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


