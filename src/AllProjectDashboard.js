import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from './API'
import { FaHome } from "react-icons/fa";


const AllProjectDashboard = () => {
    const [updcprojectDetails, setUPDCProjectDetails] = useState([]);
    const [updcDetails, setUPDCDetails] = useState([]);
    const [telprojectDetails, setTelProjectDetails] = useState([]);
    const [telDetails, setTelDetails] = useState([]);
    const [karprojectDetails, setKarProjectDetails] = useState([]);
    const [karDetails, setKarDetails] = useState([]);
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
        const fetchUPDCDetails = () => {
            axios.get(`${API_URL}/summaryreportcummulative`)
                .then(response => setUPDCDetails(response.data))
                .catch(error => console.error(error));
        }
        const fetchTelProjectDetails = () => {
            axios.get(`${API_URL}/telSummary`)
                .then(response => setTelProjectDetails(response.data))
                .catch(error => console.error(error));
        }
        const fetchTelDetails = () => {
            axios.get(`${API_URL}/summaryreportcummulativetelangana`)
                .then(response => setTelDetails(response.data))
                .catch(error => console.error(error));
        }
        const fetchKarProjectDetails = () => {
            axios.get(`${API_URL}/karSummary`)
                .then(response => setKarProjectDetails(response.data))
                .catch(error => console.error(error));
        }
        const fetchKarDetails = () => {
            axios.get(`${API_URL}/summaryreportcummulativekarnataka`)
                .then(response => setKarDetails(response.data))
                .catch(error => console.error(error));
        }
        fetchTelProjectDetails();
        fetchKarProjectDetails();
        fetchUPDCProjectDetails();
        fetchUPDCDetails();
        fetchTelDetails();
        fetchKarDetails();
    }, []);

    const computeSums = (details) => {
        const categories = ["NonTech", "Tech"];
        const sum = {
            Inventory: 0,
            Counting: 0,
            DocPre: 0,
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
        "Inventory", "Counting", "DocPre", "Guard", "Scanned",
        "QC", "Indexing", "Flagging", "CBSL_QA", "Client_QC"
    ];

    categories.forEach(category => {
        allSums[category] =
            (updcSums[category] || 0) +
            (telSums[category] || 0) +
            (karSums[category] || 0);
    });
    console.log("UPDC", updcDetails);

    return (
        <>
            <Header />
            <div className='container'>
                <div className='row mt-3'>
                    <div className="card" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                        <h6 className="ms-2" style={{ color: "white" }}>

                            <Link to='/projects' style={{ color: 'white' }} title="Back to Home">
                                <FaHome style={{ marginTop: '-2px' }} />
                            </Link>

                            / All Projects Summary
                        </h6>
                    </div>

                </div>
                <div className="search-report-card mt-3">
                    <h4>Summary Report</h4>
                    <div className="row ms-2 me-2">
                        <table className="table-bordered mt-2" >
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Inventory</th>
                                    <th>Counting</th>
                                    <th>Doc Pre</th>
                                    <th>Other</th>
                                    <th>Scanned</th>
                                    <th>QC</th>
                                    <th>Indexing</th>
                                    <th>Flagging</th>
                                    <th>CBSL-QA</th>
                                    <th>Client-QC</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{isNaN(parseInt(allSums.Inventory)) ? 0 : parseInt(allSums.Inventory).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.Counting)) ? 0 : parseInt(allSums.Counting).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.DocPre)) ? 0 : parseInt(allSums.DocPre).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.Guard)) ? 0 : parseInt(allSums.Guard).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.Scanned)) ? 0 : parseInt(allSums.Scanned).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.QC)) ? 0 : parseInt(allSums.QC).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.Indexing)) ? 0 : parseInt(allSums.Indexing).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.Flagging)) ? 0 : parseInt(allSums.Flagging).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.CBSL_QA)) ? 0 : parseInt(allSums.CBSL_QA).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(allSums.Client_QC)) ? 0 : parseInt(allSums.Client_QC).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="search-report-card">
                        <div className="row">
                            <div className="col-6">
                                <h4>Project Wise Summary Report</h4>
                            </div>
                        </div>
                        <div className="all-tables row ms-2 me-2">
                            <table className="table-bordered mt-2">
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Project Name</th>
                                        <th>Inventory</th>
                                        <th>Counting</th>
                                        <th>Doc Pre</th>
                                        <th>Other</th>
                                        <th>Scanned</th>
                                        <th>QC</th>
                                        <th>Indexing</th>
                                        <th>Flagging</th>
                                        <th>CBSL-QA</th>
                                        <th>Client-QC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td><Link to="/UPDCDashboard" style={{textDecoration:'none',color:'black'}}>UPDC</Link></td>
                                        <td>{isNaN(parseInt(updcDetails.Inventory)) ? 0 : parseInt(updcDetails.Inventory).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.Counting)) ? 0 : parseInt(updcDetails.Counting).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.DocPreparation)) ? 0 : parseInt(updcDetails.DocPreparation).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.Guard)) ? 0 : parseInt(updcDetails.Guard).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.Scanned)) ? 0 : parseInt(updcDetails.Scanned).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.QC)) ? 0 : parseInt(updcDetails.QC).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.Indexing)) ? 0 : parseInt(updcDetails.Indexing).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.Flagging)) ? 0 : parseInt(updcDetails.Flagging).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.CBSL_QA)) ? 0 : parseInt(updcDetails.CBSL_QA).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(updcDetails.Client_QC)) ? 0 : parseInt(updcDetails.Client_QC).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td><Link to="/TelDashboard" style={{textDecoration:'none',color:'black'}}>Telangana</Link></td>
                                        <td>{isNaN(parseInt(telDetails.Inventory)) ? 0 : parseInt(telDetails.Inventory).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.Counting)) ? 0 : parseInt(telDetails.Counting).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.DocPreparation)) ? 0 : parseInt(telDetails.DocPreparation).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.Guard)) ? 0 : parseInt(telDetails.Guard).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.Scanned)) ? 0 : parseInt(telDetails.Scanned).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.QC)) ? 0 : parseInt(telDetails.QC).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.Indexing)) ? 0 : parseInt(telDetails.Indexing).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.Flagging)) ? 0 : parseInt(telDetails.Flagging).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.CBSL_QA)) ? 0 : parseInt(telDetails.CBSL_QA).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(telDetails.Client_QC)) ? 0 : parseInt(telDetails.Client_QC).toLocaleString()}</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td><Link to="/KarDashboard" style={{textDecoration:'none',color:'black'}}>Karnataka</Link></td>
                                        <td>{isNaN(parseInt(karDetails.Inventory)) ? 0 : parseInt(karDetails.Inventory).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.Counting)) ? 0 : parseInt(karDetails.Counting).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.DocPreparation)) ? 0 : parseInt(karDetails.DocPreparation).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.Guard)) ? 0 : parseInt(karDetails.Guard).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.Scanned)) ? 0 : parseInt(karDetails.Scanned).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.QC)) ? 0 : parseInt(karDetails.QC).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.Indexing)) ? 0 : parseInt(karDetails.Indexing).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.Flagging)) ? 0 : parseInt(karDetails.Flagging).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.CBSL_QA)) ? 0 : parseInt(karDetails.CBSL_QA).toLocaleString()}</td>
                                        <td>{isNaN(parseInt(karDetails.Client_QC)) ? 0 : parseInt(karDetails.Client_QC).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AllProjectDashboard