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
        if (!Array.isArray(details)) {
            console.error("Expected details to be an array, but got:", details);
            return {};
        }
        return details.reduce((sums, project) => {
            Object.keys(project).forEach(key => {
                sums[key] = (sums[key] || 0) + (parseInt(project[key]) || 0);
            });
            return sums;
        }, {});
    };

    const updcSums = updcprojectDetails;
    const telSums = telprojectDetails;
    const karSums = karprojectDetails;

    const allSums = {
        Counting: (updcSums.Counting || 0) + (telSums.Counting || 0) + (karSums.Counting || 0),
        Inventory: (updcSums.Inventory || 0) + (telSums.Inventory || 0) + (karSums.Inventory || 0),
        DocPreparation: (updcSums.DocPreparation || 0) + (telSums.DocPreparation || 0) + (karSums.DocPreparation || 0),
        Guard: (updcSums.Guard || 0) + (telSums.Guard || 0) + (karSums.Guard || 0),
        Scanned: (updcSums.Scanned || 0) + (telSums.Scanned || 0) + (karSums.Scanned || 0),
        QC: (updcSums.QC || 0) + (telSums.QC || 0) + (karSums.QC || 0),
        Indexing: (updcSums.Indexing || 0) + (telSums.Indexing || 0) + (karSums.Indexing || 0),
        Flagging: (updcSums.Flagging || 0) + (telSums.Flagging || 0) + (karSums.Flagging || 0),
        CBSL_QA: (updcSums.CBSL_QA || 0) + (telSums.CBSL_QA || 0) + (karSums.CBSL_QA || 0),
        Client_QC: (updcSums.Client_QC || 0) + (telSums.Client_QC || 0) + (karSums.Client_QC || 0),
    };

    console.log("UPDC Project Details:", updcprojectDetails);
    console.log("Telangana Project Details:", telprojectDetails);
    console.log("Karnataka Project Details:", karprojectDetails);
    console.log("Computed Sums:", { updcSums, telSums, karSums, allSums });

    console.log("ProjectDetails", updcprojectDetails);
    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }
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
                            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'black' }}>
                                <h3 style={{ textDecoration: 'none', color: 'black' }}>All Projects</h3>
                            </Link>
                        </div>
                        <div className='row mt-2 mb-2'>
                            <div className='col-1'></div>
                            <div className='col-6' style={{ textAlign: 'right' }}>
                                <p><b>Counting :</b></p>
                                <p><b>Inventory :</b></p>
                                <p><b>DocPrepared :</b></p>
                                <p><b>Guard :</b></p>
                                <p><b>Scanned :</b></p>
                                <p><b>QC :</b></p>
                                <p><b>Indexing :</b></p>
                                <p><b>Flagging :</b></p>
                                <p><b>CBSL_QA :</b></p>
                                <p><b>Client_QC :</b></p>
                            </div>
                            <div className='col-4' style={{ padding: '0' }}>
                                <p style={{ color: '#508D69' }}><b>{allSums.Counting.toLocaleString()}</b></p>
                                <p style={{ color: '#508D69' }}><b>{allSums.Inventory.toLocaleString()}</b></p>
                                <p style={{ color: '#508D69' }}><b>{allSums.DocPreparation.toLocaleString()}</b></p>
                                <p style={{ color: '#508D69' }}><b>{allSums.Guard.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{allSums.Scanned.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{allSums.QC.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{allSums.Indexing.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{allSums.Flagging.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{allSums.CBSL_QA.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{allSums.Client_QC.toLocaleString()}</b></p>
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


