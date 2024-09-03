import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { API_URL } from './API';
import SideBar from './Components/SideBar';
import Header from './Components/Header';


const Attendance = ({ userName }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/attendance/Pooja`);
                setAttendanceData(response.data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        fetchAttendanceData();
    }, [userName]);

    const getAttendanceForDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return attendanceData.find(
            (attendance) => attendance.In_Time.split('T')[0] === formattedDate
        );
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const attendance = getAttendanceForDate(date);
            if (attendance) {
                return (
                    <div className="attendance-info">
                        <p className="in-time"><strong>In:</strong> {new Date(attendance.In_Time).toLocaleTimeString()}</p>
                        <p className="out-time"><strong>Out:</strong> {new Date(attendance.Out_Time).toLocaleTimeString()}</p>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <>
            <Header />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2'><SideBar /></div>
                    <div className='col-10'>
                        <div className=''>
                            <Calendar
                                value={selectedDate}
                                onClickDay={setSelectedDate}
                                tileContent={tileContent}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Attendance;
