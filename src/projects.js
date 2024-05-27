import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from './API'


const Projects = () => {
    const [projectDetails, setProjectDetails] = useState([]);
    
    useEffect(() => {
        const fetchProjectDetails = () => {
            axios.get(`${API_URL}/commonReport`)
                .then(response => setProjectDetails(response.data))
                .catch(error => console.error(error));
        }
        fetchProjectDetails();
    }, []);

    const colors = ['#193860', '#4BC0C0', 'rgb(148, 78, 99)'];

    const computeSums = (details) => {
        return details.reduce((sums, project) => {
            sums.Counting += parseInt(project.Counting) || 0;
            sums.Inventory += parseInt(project.Inventory) || 0;
            sums.DocPreparation += parseInt(project.DocPreparation) || 0;
            sums.Guard += parseInt(project.Guard) || 0;
            sums.Scanned += parseInt(project.Scanned) || 0;
            sums.QC += parseInt(project.QC) || 0;
            sums.Indexing += parseInt(project.Indexing) || 0;
            sums.Flagging += parseInt(project.Flagging) || 0;
            sums.CBSL_QA += parseInt(project.CBSL_QA) || 0;
            sums.Client_QC += parseInt(project.Client_QC) || 0;
            return sums;
        }, {
            Counting: 0,
            Inventory: 0,
            DocPreparation: 0,
            Guard: 0,
            Scanned: 0,
            QC: 0,
            Indexing: 0,
            Flagging: 0,
            CBSL_QA: 0,
            Client_QC: 0,
        });
    };

    // Compute the sums only if projectDetails is defined and is an array
    const sums = projectDetails.length > 0 ? computeSums(projectDetails) : {
        Counting: 0,
        Inventory: 0,
        DocPreparation: 0,
        Guard: 0,
        Scanned: 0,
        QC: 0,
        Indexing: 0,
        Flagging: 0,
        CBSL_QA: 0,
        Client_QC: 0,
    };

    const getProjectPath = (project) => {
        if (project.ProjectName === "UPDC" && project.id === 1) {
            return "/UPDCDashboard";
        }
        // Add more conditions for other projects
        if (project.ProjectName === "Telangana" && project.id === 2) {
            return "/TelDashboard";
        }
        if (project.ProjectName === "Karnataka" && project.id === 3) {
            return "/KarDashboard";
        }
        return "/defaultPath";
    };

    console.log("ProjectDetails", projectDetails);
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
                                <p style={{ color: '#508D69' }}><b>{sums.Counting.toLocaleString()}</b></p>
                                <p style={{ color: '#508D69' }}><b>{sums.Inventory.toLocaleString()}</b></p>
                                <p style={{ color: '#508D69' }}><b>{sums.DocPreparation.toLocaleString()}</b></p>
                                <p style={{ color: '#508D69' }}><b>{sums.Guard.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{sums.Scanned.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{sums.QC.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{sums.Indexing.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{sums.Flagging.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{sums.CBSL_QA.toLocaleString()}</b></p>
                                <p style={{ color: '#65B741' }}><b>{sums.Client_QC.toLocaleString()}</b></p>
                            </div>
                        </div>
                    </div>

                    {projectDetails && projectDetails.map((elem, index) => (
                        <div className='col-4 project-card mt-2 mb-2 ms-3' style={{ borderColor: colors[index % colors.length] }} key={index}>
                            <div className='row text-center'>
                                <Link to={getProjectPath(elem)} style={{ textDecoration: 'none', color: colors[index % colors.length] }}>
                                    <h3>{elem.ProjectName}</h3>
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
                                    <p style={{ color: '#508D69' }}><b>{isNaN(parseInt(elem.Counting)) ? "0" : parseInt(elem.Counting).toLocaleString()}</b></p>
                                    <p style={{ color: '#508D69' }}><b>{isNaN(parseInt(elem.Inventory)) ? "0" : parseInt(elem.Inventory).toLocaleString()}</b></p>
                                    <p style={{ color: '#508D69' }}><b>{isNaN(parseInt(elem.DocPreparation)) ? "0" : parseInt(elem.DocPreparation).toLocaleString()}</b></p>
                                    <p style={{ color: '#508D69' }}><b>{isNaN(parseInt(elem.Guard)) ? "0" : parseInt(elem.Guard).toLocaleString()}</b></p>
                                    <p style={{ color: '#65B741' }}><b>{isNaN(parseInt(elem.Scanned)) ? "0" : parseInt(elem.Scanned).toLocaleString()}</b></p>
                                    <p style={{ color: '#65B741' }}><b>{isNaN(parseInt(elem.QC)) ? "0" : parseInt(elem.QC).toLocaleString()}</b></p>
                                    <p style={{ color: '#65B741' }}><b>{isNaN(parseInt(elem.Indexing)) ? "0" : parseInt(elem.Indexing).toLocaleString()}</b></p>
                                    <p style={{ color: '#65B741' }}><b>{isNaN(parseInt(elem.Flagging)) ? "0" : parseInt(elem.Flagging).toLocaleString()}</b></p>
                                    <p style={{ color: '#65B741' }}><b>{isNaN(parseInt(elem.CBSL_QA)) ? "0" : parseInt(elem.CBSL_QA).toLocaleString()}</b></p>
                                    <p style={{ color: '#65B741' }}><b>{isNaN(parseInt(elem.Client_QC)) ? "0" : parseInt(elem.Client_QC).toLocaleString()}</b></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Projects