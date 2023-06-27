import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calender.css'
import img from '../assets/photo-1529665253569-6d01c0eaf7b6.jpeg'
const Calendar = () => {
    const [events, setEvents] = useState([]);

    const handleDateClick = (arg) => {
        const title = prompt('Event Title:');
        if (title) {
            const color = getRandomColor(); // Generate a random color
            const newEvent = {
                title,
                start: arg.date,
                color,
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };
    const handleEventAdd = async (eventInfo) => {
        eventInfo.preventDefault();
        const title = eventInfo.target[0].value;
        const start = eventInfo.target[1].value;
        const end = eventInfo.target[2].value;
        const color = getRandomColor()
        const newEvent = {
            title: title,
            start: start,
            end: end,
            color
        };
        setEvents((prevEvents) => [...prevEvents, newEvent])
    }
    const eventContent = (eventInfo) => {
        console.log(eventInfo)
        return (
            <div
                className='events'
                style={{
                    backgroundColor: eventInfo.event.extendedProps.color || eventInfo.backgroundColor,
                    color: 'white',
                    borderRadius: '23px',
                }}
            >
                <div className="photo" style={{ backgroundImage: `url(${img})` }}>
                </div>
                <div className="text">
                    <span>{eventInfo.event.title}</span>
                </div>
            </div>
        );
    };


    const getRandomColor = () => {
        const colors = ['#FF5733', '#C70039', '#900C3F', '#581845'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    return (
        <div>
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    eventContent={eventContent}

                    headerToolbar={{
                        start: "prev,next",
                        center: "title",
                        end: "dayGridMonth,timeGridWeek",
                    }}
                    height={'70vh'}
                />
            </div>
        </div>
    );
};

export default Calendar;
