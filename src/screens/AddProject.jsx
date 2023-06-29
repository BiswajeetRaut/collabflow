import React, { useState } from 'react';
import './ProjectForm.css';
import Datepicker from "react-tailwindcss-datepicker";
import db from '../firebase';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import firebase from 'firebase';
import { useHistory } from 'react-router-dom'
import { selectUserId, selectUserName, selectUserPhoto } from '../features/user/userSlice';
import { setProject } from '../features/project/projectSlice';
const AddProject = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const user = {}
  user.id = useSelector(selectUserId)
  user.name = useSelector(selectUserName)
  user.photo = useSelector(selectUserPhoto)
  const [dates, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }
  const [People, setPeople] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([user]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(People);
  const getPeople = () => {
    db.collection('Users').onSnapshot((snapshot) => {
      var documents = [];
      snapshot.docs.forEach((doc) => {
        var temp = doc.data();
        temp.id = doc.id;
        if (doc.id != user?.id)
          documents.push(temp);
      })
      setPeople(documents)
      setFilteredPeople(documents)
    })
  }
  useEffect(() => {
    getPeople()
  }, [])
  console.log(selectedMembers)
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
    if (dates.startDate == null || dates.endDate == null) {
      alert("please enter dates")
      return
    }
    const startdate = new Date(dates.startDate)
    const enddate = new Date(dates.endDate)
    db.collection('Projects').add({
      name: projectName,
      startDate: firebase.firestore.Timestamp.fromDate(startdate),
      endDate: firebase.firestore.Timestamp.fromDate(enddate),
      admin: selectedMembers,
      members: selectedMembers
    }).then((res) => {
      // console.log(res.id)
      dispatch(setProject({ id: res.id }))
      history.push('/home/1')
    })
      .catch((err) => {
        console.log(err)
      })
    console.log('Form submitted');

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
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="startDate" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Date:
            </label>
            <Datepicker
              primaryColor={"fuchsia"}
              value={dates}
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
                  <img src={member.photo} alt={member.name} className="member-image" />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-members-button button"
              onClick={handleAddMembers}
            >
              Add Admins
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
                  <img src={person.photo} alt={person.name} className="member-card-image" />
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
