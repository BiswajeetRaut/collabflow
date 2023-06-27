import React, { useState } from 'react';
import './TaskForm.css';

const AddTask = ({ showModal, setShowModal }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [visible, setvisible] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedOption, setSelectedOption] = useState('assignToTeam');
    const [selectedItems, setSelectedItems] = useState([]);


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('title:', taskTitle)
        console.log('start:', startDate)
        console.log('end:', deadline)
        console.log('selectedPerson:', selectedItems)
        console.log('access:', visible)
        // Perform form submission logic here
        console.log('Form submitted');
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
        const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

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
                        {team}
                    </div>
                ))}
            </div>
        );
    };

    const renderIndividualList = () => {
        const people = [
            { name: 'John Doe', dp: 'https://randomuser.me/api/portraits/men/1.jpg' },
            { name: 'Jane Smith', dp: 'https://randomuser.me/api/portraits/women/2.jpg' },
            { name: 'David Johnson', dp: 'https://randomuser.me/api/portraits/men/3.jpg' },
            { name: 'Emma Williams', dp: 'https://randomuser.me/api/portraits/women/4.jpg' },
            // Add more people as needed
        ];

        return (
            <div className="item-list">
                {people.map((person, index) => (
                    <div
                        key={index}
                        className={`item ${selectedItems.includes(person.name) ? 'selected' : ''}`}
                        onClick={() => {
                            selectedItems.includes(person.name) ?
                                handleItemDeselected(person.name)
                                :
                                handleItemSelected(person.name)
                        }}
                    >
                        <img src={person.dp} alt={person.name} className="item-image" />
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
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date:</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="deadline">Deadline:</label>
                                    <input
                                        type="date"
                                        id="deadline"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
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
                                        <option value="global">global</option>
                                        <option value="individual">individual</option>
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
