import React from 'react';

const HomeNavbar = () => {
  return (
    <nav className="bg-gradient-to-br from-FC95B4 to-FFCE62" style={{
      width:`88%`,
      height: `90px`,
    display: `flex`,
    flexDirection:`column-reverse`,
    justifyContent: `flex-start`,
    alignItems: `center`,
    position:`absolute`,
    top:`-10px`,
    }}>
      <div className="container mx-auto px-4 py-3" style={{
            display: `flex`,
    justifyContent: `flex-start`,
    width: `100%`,
    overflowX: `auto`,
    scrollbarColor:`auto`,
    scrollbarWidth: `none`,
      }}>
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex space-x-4">
            <a
              href="/"
              className="text-FFFAE5 hover:text-white hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              style={{
                boxShadow: `0 0 11px #b3b3b3ba`,
              }}
            >
              Overview
            </a>
            <a
              href="/"
              className="text-FFFAE5 hover:text-white hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              style={{
                boxShadow: `0 0 11px #b3b3b3ba`,
              }}
            >
              Teams
            </a>
            <a
              href="/"
              className="text-FFFAE5 hover:text-white  hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              style={{
                boxShadow: `0 0 11px #b3b3b3ba`,
              }}
            >
              Tasks
            </a>
            <a
              href="/"
              className="text-FFFAE5 hover:text-white hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              style={{
                boxShadow: `0 0 11px #b3b3b3ba`,
              }}
            >
              Timeline
            </a>
            <a
              href="/"
              className="text-FFFAE5 hover:text-white hover:bg-black transition duration-300 ease-in-out bg-white bg-opacity-40 px-4 py-2 rounded-lg"
              style={{
                boxShadow: `0 0 11px #b3b3b3ba`,
              }}
            >
              Discussion
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
