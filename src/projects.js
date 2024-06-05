import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from './API'


const Projects = () => {
    const [updcprojectDetails, setUPDCProjectDetails] = useState([]);
    const [telprojectDetails, setTelProjectDetails] = useState([]);
    const [karprojectDetails, setKarProjectDetails] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    

    useEffect(() => {

        const userLog = JSON.parse(localStorage.getItem("user"));
        if (!userLog) {
            setIsLoggedIn(false);  // If user is not logged in, update the state
            return;
        }

        console.log("User's Info", userLog);

        const fetchUPDCProjectDetails = () => {
            axios.get(`${API_URL}/updcSummary`)
                .then(response => setUPDCProjectDetails(response.data))
                .catch(error => console.error(error));
        }
        const fetchTelProjectDetails = () => {
            axios.get(`${API_URL}/telSummary`)
                .then(response => setTelProjectDetails(response.data))
                .catch(error => console.error(error));
        }

        const fetchKarProjectDetails = () => {
            axios.get(`${API_URL}/karSummary`)
                .then(response => setKarProjectDetails(response.data))
                .catch(error => console.error(error));
        }
        fetchTelProjectDetails();
        fetchKarProjectDetails();
        fetchUPDCProjectDetails();
    }, []);

    const computeSums = (details) => {
        const categories = ["NonTech", "Tech"];
        const sum = {
            Inventory: 0,
            Counting: 0,
            Doc_Pre: 0,
            Guard: 0,
            Scanned: 0,
            QC: 0,
            Indexing: 0,
            Flagging: 0,
            CBSL_QA: 0,
            Client_QC: 0
        };

        categories.forEach(category => {
            if (details[category]) {
                details[category].forEach(project => {
                    Object.keys(project).forEach(key => {
                        sum[key] = (sum[key] || 0) + (parseInt(project[key], 10) || 0);
                    });
                });
            }
        });

        return sum;
    };

    const updcSums = computeSums(updcprojectDetails);
    const telSums = computeSums(telprojectDetails);
    const karSums = computeSums(karprojectDetails);

    const allSums = {};
    const categories = [
        "Inventory", "Counting", "Doc_Pre", "Guard", "Scanned", 
        "QC", "Indexing", "Flagging", "CBSL_QA", "Client_QC"
    ];

    categories.forEach(category => {
        allSums[category] = 
            (updcSums[category] || 0) + 
            (telSums[category] || 0) + 
            (karSums[category] || 0);
    });

    return (
        
        <>
        
            <Header />
            <div className='container'>
                <div className='row mt-5 mb-2'>
                    <div className='col-4 allproject-card mt-2 mb-2 ms-3'>
                        <div className="border-left"></div>
                        <div className="border-right"></div>
                        <div className="border-top"></div>
                        <div className="border-bottom"></div>
                        <div className='row text-center'>
                            <Link to="#" style={{ textDecoration: 'none', color: 'black' }}>
                                <h3 style={{ textDecoration: 'none', color: 'black' }}>All Projects</h3>
                            </Link>
                        </div>
                        <div className='row mt-2 mb-2'>
                            <div className='col-1'></div>
                            <div className='col-6' style={{ textAlign: 'right' }}>
                                {categories.map(category => (
                                    <p key={category}><b>{category}:</b></p>
                                ))}
                            </div>
                            <div className='col-4' style={{ padding: '0' }}>
                                {categories.map(category => (
                                    <p key={category} style={{ color: '#508D69' }}>
                                        <b>{allSums[category].toLocaleString()}</b>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='col-4 project-card mt-2 mb-2 ms-3' style={{ borderColor: '#193860' }}>
                        <div className='row text-center'>
                            <Link to='/UPDCDashboard' style={{ textDecoration: 'none' }}>
                                <h3 style={{ color: '#193860' }}>UPDC</h3>
                            </Link>
                        </div>
                        <div className='row mt-2 mb-2'>
                            <div className='col-1'></div>
                            <div className='col-6' style={{ textAlign: 'right' }}>
                                {Object.keys(updcprojectDetails).map((category, categoryIndex) => (
                                    Object.keys(updcprojectDetails[category][0]).map((key, keyIndex) => (
                                        <p key={`${categoryIndex}-${keyIndex}`}><b>{key}:</b></p>
                                    ))
                                ))}
                            </div>
                            <div className='col-4' style={{ padding: '0' }}>
                                {Object.keys(updcprojectDetails).map((category, categoryIndex) => (
                                    Object.values(updcprojectDetails[category][0]).map((value, valueIndex) => (
                                        <p
                                            key={`${categoryIndex}-${valueIndex}`}
                                            style={{ color: category === 'NonTech' ? '#508D69' : '#65B741' }}
                                        >
                                            <b>{isNaN(parseInt(value)) ? "0" : parseInt(value).toLocaleString()}</b>
                                        </p>
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='col-4 project-card mt-2 mb-2 ms-3' style={{ borderColor: '#4BC0C0' }}>
                        <div className='row text-center'>
                            <Link to='/TelDashboard' style={{ textDecoration: 'none' }}>
                                <h3 style={{ color: '#4BC0C0' }}>Telangana</h3>
                            </Link>
                        </div>
                        <div className='row mt-2 mb-2'>
                            <div className='col-1'></div>
                            <div className='col-6' style={{ textAlign: 'right' }}>
                                {Object.keys(telprojectDetails).map((category, categoryIndex) => (
                                    Object.keys(telprojectDetails[category][0]).map((key, keyIndex) => (
                                        <p key={`${categoryIndex}-${keyIndex}`}><b>{key}:</b></p>
                                    ))
                                ))}
                            </div>
                            <div className='col-4' style={{ padding: '0' }}>
                                {Object.keys(telprojectDetails).map((category, categoryIndex) => (
                                    Object.values(telprojectDetails[category][0]).map((value, valueIndex) => (
                                        <p
                                            key={`${categoryIndex}-${valueIndex}`}
                                            style={{ color: category === 'NonTech' ? '#508D69' : '#65B741' }}
                                        >
                                            <b>{isNaN(parseInt(value)) ? "0" : parseInt(value).toLocaleString()}</b>
                                        </p>
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='col-4 project-card mt-2 mb-2 ms-3' style={{ borderColor: 'rgb(148, 78, 99)' }}>
                        <div className='row text-center'>
                            <Link to='/KarDashboard' style={{ textDecoration: 'none' }}>
                                <h3 style={{ color: 'rgb(148, 78, 99)' }}>Karnataka</h3>
                            </Link>
                        </div>
                        <div className='row mt-2 mb-2'>
                            <div className='col-1'></div>
                            <div className='col-6' style={{ textAlign: 'right' }}>
                                {Object.keys(karprojectDetails).map((category, categoryIndex) => (
                                    Object.keys(karprojectDetails[category][0]).map((key, keyIndex) => (
                                        <p key={`${categoryIndex}-${keyIndex}`}><b>{key}:</b></p>
                                    ))
                                ))}
                            </div>
                            <div className='col-4' style={{ padding: '0' }}>
                                {Object.keys(karprojectDetails).map((category, categoryIndex) => (
                                    Object.values(karprojectDetails[category][0]).map((value, valueIndex) => (
                                        <p
                                            key={`${categoryIndex}-${valueIndex}`}
                                            style={{ color: category === 'NonTech' ? '#508D69' : '#65B741' }}
                                        >
                                            <b>{isNaN(parseInt(value)) ? "0" : parseInt(value).toLocaleString()}</b>
                                        </p>
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Projects


