import React, { useState } from 'react'
import Mentions from './Mentions';
import Calendar from './Calender';

const RightSidebar = () => {
  const [rightoption, setrightoption] = useState(true);
  return (
    <div className="home__right" style={{}}>
        <nav className="bg-gradient-to-br from-FC95B4 to-FFCE62" 
        style={{
      height: `90px`,
    display: `flex`,
    }}
    >
      <div className="container mx-auto px-4 py-3" 
      style={{
            display: `flex`,
    justifyContent: `flex-start`,
    width: `100%`,
    overflowX: `auto`,
    scrollbarColor:`auto`,
    scrollbarWidth: `none`,
      }}
      >
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex space-x-4">
            <a
              className="text-FFFAE5 hover:text-white hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              onClick={()=>{
                setrightoption(true);
              }}
              style={{
                boxShadow: `rgb(102 102 102 / 73%) 0px 0px 11px`,
              }}
            >
            Calender
            </a>
            <a
              className="text-FFFAE5 hover:text-white hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              onClick={()=>{
                setrightoption(false);
              }}
              style={{
                boxShadow: `rgb(102 102 102 / 73%) 0px 0px 11px`,
              }}
            >
              @Mentions
            </a>
          </div>
        </div>
      </div>
    </nav>
    <div style={{
        width:`100%`,
        border:`none`,
        height:`1px`,
        backgroundColor:`gray`,
    }}/>
    <div className="right__content py-8" style={{overflowY:`auto`,
    width:`80%`,
    }}>
      {rightoption?<Calendar/>:
      <Mentions/>
      }
    </div>
    </div>
  )
}

export default RightSidebar
