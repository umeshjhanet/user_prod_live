import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from './API'
import SideBar from './Components/SideBar'

const Projects = () => {
    const [updcprojectDetails, setUPDCProjectDetails] = useState([]);
    const [telprojectDetails, setTelProjectDetails] = useState([]);
    const [licprojectDetails, setLicProjectDetails] = useState([]);
    const [karprojectDetails, setKarProjectDetails] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUPDCProjectDetails = () => {
            axios.get(`${API_URL}/updcSummary`)
                .then(response => {
                    console.log('UPDC Project Details:', response.data);
                    setUPDCProjectDetails(response.data);
                })
                .catch(error => console.error(error));
        };
        const fetchTelProjectDetails = () => {
            axios.get(`${API_URL}/telSummary`)
                .then(response => {
                    console.log('Telangana Project Details:', response.data);
                    setTelProjectDetails(response.data);
                })
                .catch(error => console.error(error));
        };
        const fetchKarProjectDetails = () => {
            axios.get(`${API_URL}/karSummary`)
                .then(response => {
                    console.log('Karnataka Project Details:', response.data);
                    setKarProjectDetails(response.data);
                })
                .catch(error => console.error(error));
        };
        const fetchLicProjectDetails = () => {
            axios.get(`${API_URL}/licSummary`)
                .then(response => {
                    console.log('Karnataka Project Details:', response.data);
                    setLicProjectDetails(response.data);
                })
                .catch(error => console.error(error));
        };
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/fetchexcel`);
                console.log("fetch excel", response.data);
                setProjectData(response.data);
            } catch (error) {
                console.error('Error fetching project data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        fetchUPDCProjectDetails();
        fetchTelProjectDetails();
        fetchKarProjectDetails();
        fetchLicProjectDetails();
    }, []);

    const computeSums = (details) => {
        const sum = {
            Received: 0,
            Scanned: 0,
            QC: 0,
            Flagging: 0,
            Indexing: 0,
            CBSL_QA: 0,
            Client_QC: 0,
            Export: 0
        };

        // Loop through each category in project details
        Object.keys(details).forEach(category => {
            if (Array.isArray(details[category])) {
                // Case 1: If details[category] is an array, loop through it
                details[category].forEach(project => {
                    Object.keys(project).forEach(key => {
                        if (sum.hasOwnProperty(key)) {
                            const value = parseInt(project[key], 10);
                            sum[key] += value || 0; // Add values to the respective sum key
                        }
                    });
                });
            } else if (typeof details[category] === 'object' && details[category] !== null) {
                // Case 2: If details[category] is a single object
                Object.keys(details[category]).forEach(key => {
                    if (sum.hasOwnProperty(key)) {
                        const value = parseInt(details[category][key], 10);
                        sum[key] += value || 0; // Add values to the respective sum key
                    }
                });
            } else {
                console.warn(`Unexpected data type for ${category}:`, details[category]);
            }
        });
    
        return sum;
    };

    // Compute sums for individual project categories
    const updcSums = computeSums(updcprojectDetails);
    const telSums = computeSums(telprojectDetails);
    const karSums = computeSums(karprojectDetails);
    const fetchSums = computeSums(projectData);

    // Aggregate all sums into one object
    const allSums = {};
    const categories = ["Received", "Scanned", "QC", "Flagging", "Indexing", "CBSL_QA", "Client_QC", "Export"];

    categories.forEach(category => {
        allSums[category] =
            (updcSums[category] || 0) +
            (telSums[category] || 0) +
            (karSums[category] || 0) +
            (fetchSums[category] || 0); // Summing the category from all projects
    });

    console.log("All Projects Sums:", allSums);



    const allcategories = [
        'Received', 'Scanned', 'QC',
        'Flagging', 'Indexing', 'CBSL_QA',
        'Client_QC', 'Export'
    ];
    const projects = [
        { id: 4, name: 'Nimhans' },
        { id: 5, name: 'LIC' },
        { id: 6, name: 'NMML' },
        { id: 7, name: 'CAG' },
        { id: 8, name: 'Tata Power' },
        { id: 9, name: 'Allahbad HC' },
        { id: 10, name: 'BLR' },
    ];

    return (
        <>
            <Header />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-9 ms-5'>
                        <SideBar />
                        <div className='row mt-3 mb-2'>
                            <div className='col-12 all-project-card mt-2 mb-2 ms-3' style={{ borderColor: '#193860' }}>
                                <div className='row text-center'>
                                    <Link to="/AllProjectDashboard" style={{ textDecoration: 'none', color: 'black' }}>
                                        <h3 style={{ textDecoration: 'none', color: 'black' }}>All Projects</h3>
                                    </Link>
                                </div>
                                <Link to="/AllProjectDashboard" style={{ textDecoration: 'none', color: '#5f5f5f' }}>
                                    <div className='row mb-2'>
                                        {/* Grouping items into columns with two rows each */}
                                        {categories.reduce((rows, category, index) => {
                                            // Every two items, create a new column
                                            if (index % 2 === 0) {
                                                rows.push([]);
                                            }
                                            rows[rows.length - 1].push(category);
                                            return rows;
                                        }, []).map((group, groupIndex) => (
                                            <div key={groupIndex} className='col-3'>
                                                {group.map(category => (
                                                    <p key={category} style={{ textAlign: 'left' }}>
                                                        <b><span style={{color:'#0288b1'}}>{category}:</span> <span style={{color:'#619389'}}>{(allSums[category] || 0).toLocaleString()}</span></b>
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                        <div className='col-1'></div>
                                    </div>
                                    
                                </Link>
                            </div>
                        </div>




                        <div className='row mt-3 mb-2'>
                            <div className='col-4 project-card mt-2 mb-2 ms-4' style={{ borderColor: '#193860' }}>
                                <div className='row text-center'>
                                    <Link to='/UPDCDashboard' style={{ textDecoration: 'none' }}>
                                        <h3 style={{ color: '#193860' }}>UPDC</h3>
                                    </Link>
                                </div>
                                <Link to='/UPDCDashboard' style={{ textDecoration: 'none', color: '#5f5f5f' }}>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-1'></div>
                                        <div className='col-5' style={{ textAlign: 'right' }}>
                                            {updcprojectDetails && updcprojectDetails.length > 0 &&
                                                Object.keys(updcprojectDetails[0]).map((key, keyIndex) => (
                                                    <p key={keyIndex}><b>{key}:</b></p>
                                                ))
                                            }
                                        </div>
                                        <div className='col-4' style={{ padding: '0', textAlign: 'right' }}>
                                            {updcprojectDetails && updcprojectDetails.length > 0 &&
                                                Object.values(updcprojectDetails[0]).map((value, valueIndex) => (
                                                    <p
                                                        key={valueIndex}
                                                        style={{ color: '#2A629A', textAlign: 'right' }}
                                                    >
                                                        <b>{isNaN(parseInt(value)) ? "0" : parseInt(value).toLocaleString()}</b>
                                                    </p>
                                                ))
                                            }
                                            <p><Link to="/UPDCDashboard" style={{ color: '#193860' }}>More...</Link></p>
                                        </div>
                                        <div className='col-1'></div>
                                    </div>
                                </Link>
                            </div>
                            <div className='col-4 project-card mt-2 mb-2 ms-3' style={{ borderColor: '#4BC0C0' }}>
                                <div className='row text-center'>
                                    <Link to='/TelDashboard' style={{ textDecoration: 'none' }}>
                                        <h3 style={{ color: '#4BC0C0' }}>Telangana</h3>
                                    </Link>
                                </div>
                                <Link to='/TelDashboard' style={{ textDecoration: 'none', color: '#5f5f5f' }}>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-1'></div>
                                        <div className='col-5' style={{ textAlign: 'right' }}>
                                            {telprojectDetails && telprojectDetails.length > 0 &&
                                                Object.keys(telprojectDetails[0]).map((key, keyIndex) => (
                                                    <p key={keyIndex}><b>{key}:</b></p>
                                                ))
                                            }
                                        </div>
                                        <div className='col-4' style={{ padding: '0' }}>
                                            {telprojectDetails && telprojectDetails.length > 0 &&
                                                Object.values(telprojectDetails[0]).map((value, valueIndex) => (
                                                    <p
                                                        key={valueIndex}
                                                        style={{ color: '#2A629A', textAlign: 'right' }}
                                                    >
                                                        <b>{isNaN(parseInt(value)) ? "0" : parseInt(value).toLocaleString()}</b>
                                                    </p>
                                                ))
                                            }
                                            <p><Link to="/TelDashboard" style={{ color: '#4BC0C0' }}>More...</Link></p>
                                        </div>
                                        <div className='col-1'></div>
                                    </div>
                                </Link>
                            </div>
                            <div className='col-4 project-card mt-2 mb-2 ms-3' style={{ borderColor: 'rgb(148, 78, 99)' }}>
                                <div className='row text-center'>
                                    <Link to='/KarDashboard' style={{ textDecoration: 'none' }}>
                                        <h3 style={{ color: 'rgb(148, 78, 99)' }}>Karnataka</h3>
                                    </Link>
                                </div>
                                <Link to='/KarDashboard' style={{ textDecoration: 'none', color: '#5f5f5f' }}>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-1'></div>
                                        <div className='col-5' style={{ textAlign: 'right' }}>
                                            {karprojectDetails && karprojectDetails.length > 0 &&
                                                Object.keys(karprojectDetails[0]).map((key, keyIndex) => (
                                                    <p key={keyIndex}><b>{key}:</b></p>
                                                ))
                                            }
                                        </div>
                                        <div className='col-4' style={{ padding: '0' }}>
                                            {karprojectDetails && karprojectDetails.length > 0 &&
                                                Object.values(karprojectDetails[0]).map((value, valueIndex) => (
                                                    <p
                                                        key={valueIndex}
                                                        style={{ color: '#2A629A', textAlign: 'right' }}
                                                    >
                                                        <b>{isNaN(parseInt(value)) ? "0" : parseInt(value).toLocaleString()}</b>
                                                    </p>
                                                ))
                                            }
                                            <p><Link to="/KarDashboard" style={{ color: 'rgb(148, 78, 99)' }}>More...</Link></p>
                                        </div>
                                        <div className='col-1'></div>
                                    </div>
                                </Link>
                            </div>
                            {projectData.map((project, index) => {
                                // Ensure that the project names align with project data
                                const projectID = projects[index]?.id || 'Unknown Project';
                                const projectName = projects[index]?.name || 'Unknown Project';

                                return (
                                    <div className='col-4 project-card mt-2 mb-2 ms-3' key={index}>
                                        <div className="border-left"></div>
                                        <div className="border-right"></div>
                                        <div className="border-top"></div>
                                        <div className="border-bottom"></div>
                                        <div className='row text-center'>
                                            <Link
                                                to={`/Dashboard/${projectID}`}
                                                style={{ textDecoration: 'none', color: 'black' }}
                                            >
                                                <h3>{projectName}</h3>
                                            </Link>
                                        </div>
                                        <Link to={`/Dashboard/${projectID}`} style={{ textDecoration: 'none', color: '#5f5f5f' }}>
                                            <div className='row mt-2 mb-2'>
                                                <div className='col-1'></div>
                                                <div className='col-5' style={{ textAlign: 'right' }}>
                                                    {allcategories.map(category => (
                                                        <p key={category}><b>{category}:</b></p>
                                                    ))}
                                                </div>
                                                <div className='col-4' style={{ padding: '0' }}>
                                                    {allcategories.map(category => (
                                                        <p key={category} style={{ color: '#508D69', textAlign: 'right' }}>
                                                            <b>{project[category]?.toLocaleString()}</b>
                                                        </p>
                                                    ))}
                                                    <p><Link to={`/Dashboard/${projectID}`} style={{ color: '#508D69' }}>More...</Link></p>
                                                </div>
                                                <div className='col-1'></div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='row mt-2 mb-2'>

                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Projects