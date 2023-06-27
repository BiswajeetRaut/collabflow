import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calender.css'
import { useSelector } from 'react-redux';
import img from '../assets/photo-1529665253569-6d01c0eaf7b6.jpeg'
import { selectProjectId } from '../features/project/projectSlice';
import db from '../firebase';
import { selectUserId, selectUserPhoto } from '../features/user/userSlice';
import { useEffect } from 'react';
const Calendar = () => {
    const [events, setEvents] = useState([]);
    const projectId = useSelector(selectProjectId);
    const userId = useSelector(selectUserId);
    console.log(projectId)
    const userPhoto = useSelector(selectUserPhoto);
    useEffect(() => {
        db.collection('Projects').doc(projectId?projectId:'123').collection('Tasks').onSnapshot(snapshot => {
            var documents = [];
            snapshot.docs.forEach((doc) => {
                var flag = 0;
                doc.data().members.forEach((member) => {
                    if (member.id == userId) {
                        flag = 1;
                    }
                });
                if (flag == 1) {
                    var start = (new Date(doc.data().startDate?.toDate().toDateString())).toLocaleDateString()
                    var temp = {};
                    temp.title = doc.data().title;
                    temp.start = new Date(doc.data().startDate?.toDate().toDateString());
                    temp.end = new Date(doc.data().endDate?.toDate().toDateString());
                    temp.id = doc.id;
                    temp.color = getRandomColor()
                    documents.push(temp);
                }
            })
            setEvents(documents);
        })
    }, [projectId]);
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
        return (
            <div
                className='events'
                style={{
                    backgroundColor: eventInfo.event.extendedProps.color || eventInfo.backgroundColor,
                    color: 'white',
                    borderRadius: '23px',
                }}
            >
                <div className="photo" style={{ backgroundImage: `url(${userPhoto})` }}>
                </div>
                <div className="text">
                    <span>{eventInfo.event.title}</span>
                </div>
            </div>
        );
    };


    const getRandomColor = () => {
        const colors = [
            'rgba(32, 78, 97, 1)',      // deep teal
            'rgba(153, 50, 204, 1)',    // dark orchid
            'rgba(219, 68, 55, 1)',     // fiery red
            'rgba(244, 160, 0, 1)',     // sunburst orange
            'rgba(0, 123, 167, 1)',     // steel blue
            'rgba(0, 168, 133, 1)',     // aquamarine
            'rgba(74, 35, 90, 1)',      // plum purple
            'rgba(255, 102, 102, 1)',   // coral pink
            'rgba(0, 162, 232, 1)',     // electric blue
            'rgba(134, 194, 50, 1)',    // lime green
            'rgba(202, 108, 27, 1)',    // rusty orange
            'rgba(58, 166, 154, 1)',    // jade green
            'rgba(208, 80, 102, 1)',    // raspberry
            'rgba(255, 170, 0, 1)',     // goldenrod
            'rgba(49, 99, 149, 1)',     // steel gray
            'rgba(98, 24, 140, 1)',     // deep purple
            'rgba(217, 83, 79, 1)',     // brick red
            'rgba(0, 128, 128, 1)',     // teal
            'rgba(94, 186, 125, 1)',    // spring green
            'rgba(237, 145, 33, 1)'     // burnt orange
        ];
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
                    eventContent={eventContent}
                    headerToolbar={{
                        start: "prev,next",
                        center: "title",
                        end: "dayGridMonth,dayGridWeek",
                    }}
                    height={'70vh'}
                />
            </div>
        </div>
    );
};

export default Calendar;
