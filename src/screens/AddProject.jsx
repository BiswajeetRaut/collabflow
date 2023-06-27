import React, { useState } from 'react';
import './ProjectForm.css';
import Datepicker from "react-tailwindcss-datepicker";

const AddProject = () => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }
  const [People, setPeople] = useState([
    { name: 'John Doe', dp: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Jane Smith', dp: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'David Johnson', dp: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Emma Williams', dp: 'https://randomuser.me/api/portraits/women/4.jpg' },
    // Add more people as needed
  ]);
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(People);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterPeople(e.target.value);
  };

  const filterPeople = (query) => {
    const filtered = People.filter((person) =>
      person.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPeople(filtered);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'projectName':
        setProjectName(value);
        break;
      case 'startDate':
        setStartDate(value);
        break;
      case 'endDate':
        setEndDate(value);
        break;
      default:
        break;
    }
  };

  const handleAddMembers = () => {
    setShowModal(true);
  };

  const handleMemberSelection = (member, ind) => {
    if (selectedMembers.find((mem) => mem == member)) {
      return
    }
    else {
      setSelectedMembers([...selectedMembers, member]);
      var arr = filteredPeople
      arr.splice(ind, 1)
      setFilteredPeople(arr)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form submission logic here
    console.log('Form submitted');
    console.log('Project Name:', projectName);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Selected Members:', selectedMembers);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Random list of people with names and profile pictures

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-FC95B4 to-FFCE62 form__page">
      <div className="containar mx-auto px-4 py-8 bg-transparent rounded-lg shadow-lg">
        <h1 className="heading">Create a new project</h1>
        <form className="max-w-md mx-auto p-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="projectName" className="block mb-2 text-lg text-FFFAE5 font-bold">
              Project Name:
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={projectName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter project name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="startDate" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Date:
            </label>
            <Datepicker
              primaryColor={"fuchsia"}
              value={value}
              onChange={handleValueChange}
              showShortcuts={true}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="members" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Members:
            </label>
            <div className="selected-members">
              {selectedMembers.map((member, index) => (
                <div key={index} className="selected-member">
                  <img src={member.dp} alt={member.name} className="member-image" />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-members-button button"
              onClick={handleAddMembers}
            >
              Add Members
            </button>
          </div>
          <div className="submit-button button">
            <button
              type="submit"
              className="w-full bg-EB7B26 hover:bg-OBC56D text-FFFAE5 py-3 px-6 rounded-lg font-bold text-lg transition duration-300 ease-in-out"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Select Members</h2>
              <button className="modal-close" onClick={closeModal}>
                <span className="sr-only">Close</span>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-search">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="modal-search-input"
              />
            </div>
            <div className="modal-body">
              {filteredPeople.map((person, index) => (
                <div
                  key={index}
                  className="member-card"
                  onClick={() => handleMemberSelection(person, index)}
                >
                  <img src={person.dp} alt={person.name} className="member-card-image" />
                  <p className="member-card-name">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProject;
