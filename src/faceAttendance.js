import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';

const FaceAttendance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchData = async () => {
        const apiUrl = 'https://face.softhris.com/api/mis-attendance-log'; 
        const apiKey = '2392ca6c9612a475addaa7302c1b0304';  
        const param1 = 'DC';  
        const param2 = '2024-11-11';  
    
        try {
          const response = await axios.post(apiUrl,
            { 
              projectname: param1,   // Parameters in the body
              date: param2,
            }, 
            {
              headers: {
                'Api-Key': apiKey,  // API Key as a custom header
                'Content-Type': 'application/json',  // Ensure it's JSON
              },
            });
         
          setData(response.data);  // Store the fetched data
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
  
    useEffect(() => {
      fetchData(); // Call fetchData when component mounts
    }, []);
  

    // useEffect(() => {
    //   // API URL
    //   const url = 'https://face.softhris.com/api/mis-attendance-log'; // Replace with your actual URL
  
    //   // API key
    //   const apiKey = '2392ca6c9612a475addaa7302c1b0304'; // Replace with your actual API key
  
    //   // Request payload (data)
    //   const data = {
    //     projectname: 'High Court',
    //     date: '2024-09-17'
    //   };
  
    //   // Function to fetch data using Axios
    //   const fetchData = async () => {
    //     try {
    //       const response = await axios.post(url, data, {
    //         headers: {
    //           'Api-Key': apiKey,
    //           'Content-Type': 'application/json'
    //         }
    //       });
  
    //       // Check if the response contains the 'status' field
    //       if (response.data && response.data.status === 'success') {
    //         console.log("Message:", response.data.message);
    //         console.log("Attendance Data:");
    //         response.data.Data.forEach(entry => {
    //           // Check if the entry is a valid object
    //           if (typeof entry === 'object') {
    //             console.log("Employee ID:", entry.emp_id ?? 'N/A');
    //             console.log("Name:", entry.name ?? 'N/A');
    //             console.log("Mark Date:", entry.mark_date ?? 'N/A');
    //             console.log("Attendance Status:", entry.attendance_status ?? 'N/A');
    //             console.log("Punch In:", entry.punch_in ?? 'N/A');
    //             console.log("Punch Out:", entry.punch_out ?? 'N/A');
    //             console.log("\n");
    //           } else {
    //             console.error("Error: Invalid entry format.");
    //           }
    //         });
    //       } else {
    //         console.error("Error:", response.data.message ?? 'Unknown error');
    //       }
    //     } catch (error) {
    //       console.error("API Request Error:", error.message);
    //     }
    //   };
  
    //   // Call the fetch function when the component mounts
    //   fetchData();
    // }, []);
   
    console.log("Attendance", data);
  return (
    <>
    <Header />
      <div className="container-fluid mt-5">
        <div className='row'>
          <div className='col-2'>
            <SideBar />
          </div>
          </div>
          </div>
    </>
  )
}

export default FaceAttendance