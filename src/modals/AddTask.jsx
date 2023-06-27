import React, { useState } from 'react';
import './TaskForm.css';
import Datepicker from "react-tailwindcss-datepicker";
import { useSelector, useDispatch } from 'react-redux';
import { selectUserId, selectUserName, selectUserPhoto } from '../features/user/userSlice';
import { useEffect } from 'react';
import db from '../firebase';
import { selectProjectId } from '../features/project/projectSlice';

const AddTask = ({ showModal, setShowModal }) => {
    const user = {}
    const dispatch = useDispatch()
    user.id = useSelector(selectUserId)
    const projectId = useSelector(selectProjectId)
    user.name = useSelector(selectUserName)
    user.photo = useSelector(selectUserPhoto)
    const [teams, setTeams] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dates, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const [people, setPeople] = useState([])
    const [visible, setvisible] = useState("");
    const [deadline, setDeadline] = useState('');
    const [selectedOption, setSelectedOption] = useState('assignToTeam');
    const [selectedItems, setSelectedItems] = useState([]);
    const getPeople = () => {
        db.collection('Projects').doc(projectId).get().then((res) => {
            setPeople(res.data().members)
        })
    }
    const getTeams = () => {
        db.collection('Projects').doc(projectId).collection('Teams').onSnapshot((snapsot) => {
            var documents = [];
            snapsot.docs.forEach((doc) => {
                documents.push(doc.data());
            })
            setTeams(documents)
        })
    }
    useEffect(() => {
        getPeople()
        getTeams()
    }, [])
    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue);
        setValue(newValue);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        var members = [];
        if (visible === "") {
            alert("please select the visibility")
            return;
        }
        if (dates.startDate == null || dates.endDate == null) {
            alert("please select a date")
            return;
        }
        if (selectedItems.length == 0) {
            alert("please select a member or team for the task")
            return;
        }
        if (selectedOption == 'assignToTeam') {
            selectedItems.map((item) => {
                members = members.concat(item.members);
            })
        }
        if (selectedOption == 'assignToIndividuals') {
            members = selectedItems;
        }
        const startdate = new Date(dates.startDate)
        const enddate = new Date(dates.endDate)
        const date = new Date()
        var status = '';
        if (enddate < date) {
            status = "complete"
        }
        else status = "todo"
        db.collection('Projects').doc(projectId).collection('Tasks').add({
            title: taskTitle,
            startDate: startdate,
            endDate: enddate,
            status: status,
            visibility: visible,
            members: members,
        })
        // console.log('title:', taskTitle)
        // console.log('start:', dates.startDate)
        // console.log('end:', dates.endDate)
        // console.log('selectedPerson:', selectedItems)
        // console.log('access:', visible)
        // // Perform form submission logic here
        // console.log('Form submitted');
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleItemSelected = (item) => {
        setSelectedItems((prevItems) => [...prevItems, item]);
    };

    const handleItemDeselected = (item) => {
        setSelectedItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    };

    const renderTeamList = () => {
        return (
            <div className="item-list">
                {teams.map((team, index) => (
                    <div
                        key={index}
                        className={`item ${selectedItems.includes(team) ? 'selected' : ''}`}
                        onClick={() => {
                            selectedItems.includes(team) ?
                                handleItemDeselected(team)
                                :
                                handleItemSelected(team)
                        }}
                    >
                        {team.name}
                    </div>
                ))}
            </div>
        );
    };

    const renderIndividualList = () => {
        // const people = [
        //     { name: 'John Doe', dp: 'https://randomuser.me/api/portraits/men/1.jpg' },
        //     { name: 'Jane Smith', dp: 'https://randomuser.me/api/portraits/women/2.jpg' },
        //     { name: 'David Johnson', dp: 'https://randomuser.me/api/portraits/men/3.jpg' },
        //     { name: 'Emma Williams', dp: 'https://randomuser.me/api/portraits/women/4.jpg' },
        //     // Add more people as needed
        // ];

        return (
            <div className="item-list">
                {people.map((person, index) => (
                    <div
                        key={index}
                        className={`item ${selectedItems.includes(person) ? 'selected' : ''}`}
                        onClick={() => {
                            selectedItems.includes(person) ?
                                handleItemDeselected(person)
                                :
                                handleItemSelected(person)
                        }}
                    >
                        <img src={person.photo} alt={person.name} className="item-image" />
                        <p className="item-name">{person.name}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {showModal && (
                <div className="modals-overlay">
                    <div className="modals-container">
                        <div className="modals-header">
                            <div className="empty">

                            </div>
                            <h2 className="modals-title">Add Task</h2>
                            <button className="modals-close" onClick={closeModal}>
                                <span className="sr-only">Close</span>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modals-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="taskTitle">Task Title:</label>
                                    <input
                                        type="text"
                                        id="taskTitle"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
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
                                <div className="containers">
                                    <div className="button-container">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setSelectedOption('assignToTeam')
                                                setSelectedItems([])
                                            }}
                                            className={`option-button ${selectedOption === 'assignToTeam' ? 'selected' : ''}`}
                                        >
                                            Assign to Team
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setSelectedOption('assignToIndividuals')
                                                setSelectedItems([])

                                            }}
                                            className={`option-button ${selectedOption === 'assignToIndividuals' ? 'selected' : ''
                                                }`}
                                        >
                                            Assign to Individuals
                                        </button>
                                    </div>
                                    <div className="content-container">
                                        {selectedOption === 'assignToTeam' && renderTeamList()}
                                        {selectedOption === 'assignToIndividuals' && renderIndividualList()}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="taskTitle">Accessable:</label>
                                    <select name="visible" onChange={(e) => setvisible(e.target.value)}>
                                        <option value="">--select a option--</option>
                                        <option value="general">general</option>
                                        <option value="personal">personal</option>
                                    </select>
                                </div>
                                <div className="but">
                                    <button type="submit" className='button'>Create Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTask;
