import React, { useState } from 'react';

const ShowMembers = ({ member,setmember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
    { id: 4, name: 'Emily Davis' },
  ]);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleMemberSelection = (member) => {
    setSelectedMember(member);
  };
  const handleAddMember = () => {
    // Perform add member logic here
    console.log('Member:', selectedMember);
    //db calling part here 

    setmember(!member);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-hidden">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-xl overflow-y-scroll" style={{height:`400px`,width:`95%`}}>
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Members</h2>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search member..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className=" flex flex-col gap-3 mb-4 overflow-y-auto">
            {members
              .filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((member) => (
                <label key={member.id} className="flex items-center space-x-2">
                  <img class="w-8 h-8 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene Avatar"/>
                  <span className="text-gray-900">{member.name}</span>
                </label>
              ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={()=>{
                setmember(!member);
              }}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Go Back/Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMembers;
