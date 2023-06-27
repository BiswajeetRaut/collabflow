import React, { useState } from 'react'
import './Meet.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const Meet = () => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('')
    const meets = [
        {
            name: 'Designing discuss meet',
            created_by: 'John Doe',
            start: '12-06-2023 12:30:56',
            end: '12-06-2023 12:30:56',
        },
        {
            name: 'functionality discuss meet',
            created_by: 'John Doe',
            start: '12-06-2023 12:30:56',
            end: '12-06-2023 12:30:56',
        },
        {
            name: 'Marketing discuss meet',
            created_by: 'John Doe',
            start: '12-06-2023 12:30:56',
            end: '12-06-2023 12:30:56',
        }
    ]
    return (
        <div className="cont">
            <div className="navbar">
                <div className="head">
                    <span>Project Name</span>
                </div>
                <div className="butt">
                    <button className='button' onClick={() => { setShowModal(true); setMode('Create') }}>
                        Create Meet
                    </button>
                    <button className='button' onClick={() => { setShowModal(true); setMode('Join') }}>
                        Join Meet
                    </button>
                </div>
            </div>
            <div className="cont-body">
                <div className="meet-cont">
                    {
                        meets.map((meet) => (
                            <div className="meet-history-cont">
                                <div className="meet-icon">
                                    <CalendarMonthIcon sx={{ height: '2rem', width: '3rem' }} />
                                </div>
                                <div className="txt">
                                    <div className='meet-text'>
                                        <span className="meet-name">{meet.name}</span>
                                        <span><span style={
                                            {
                                                color: 'grey'
                                            }
                                        }>created by-</span> {meet.created_by}</span>
                                    </div>
                                    <div className="meet-dates">
                                        <span><span style={
                                            {
                                                color: 'grey'
                                            }
                                        }>started at-</span>{meet.start}</span>
                                        <span><span style={
                                            {
                                                color: 'grey'
                                            }
                                        }>ended at-</span>{meet.end}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {showModal && (
                <div className="modals-overlay">
                    <div className="modals-container">
                        <div className="modals-header">
                            <div className="empty">

                            </div>
                            <h2 className="modals-title">{`${mode} meet`}</h2>
                            <button className="modals-close" onClick={() => setShowModal(false)}>
                                <span className="sr-only">Close</span>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modals-body">
                            {
                                mode == 'Create'
                                    ?
                                    <>

                                        <input type="text" placeholder='Enter Meet Name...' required />

                                        <p><span>Your Meet Id is: </span><strong>uh1x1h9222d9uji</strong></p>
                                    </>
                                    :
                                    <>
                                        <input type="text" placeholder='Enter Meet id' required />
                                    </>
                            }
                            <div className="but">
                                <button className='button'>
                                    {mode}
                                </button>
                                <button className='button'>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Meet
