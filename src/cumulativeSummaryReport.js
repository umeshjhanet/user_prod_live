import React, { useEffect, useState } from 'react'
import { API_URL } from './API';
import axios from 'axios';
import { priceCount } from './Components/priceCount';

const CumulativeSummaryReport = ({ multipliedData, prices }) => {
    const [locationView, setLocationView] = useState(false);
    const [userView, setUserView] = useState(false);
    const [summaryReport, setSummaryReport] = useState();
    const [locationReport, setLocationReport] = useState();
    const handleLocationView = () => {
        setLocationView(true);
    }
    const handleUserView = () => {
        setUserView(true);
    }
    useEffect(() => {
        const fetchSummaryReport = () => {
            axios.get(`${API_URL}/summaryReport`)
                .then((response) => setSummaryReport(response.data))
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
        const fetchLocationReport = () => {
            axios.get(`${API_URL}/detailedReport`)
                .then((response) => setLocationReport(response.data))
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
        fetchSummaryReport();
        fetchLocationReport();
    }, [])
    console.log('Location Data', locationReport);
    


    return (
        <>
            <div className='container'>
                <div className='row mt-3'>
                    <div className='search-report-card'>
                        <h4>Summary Report</h4>
                        <div className='row ms-2 me-2'>
                            <table className='table-bordered mt-2'>
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Scanned</th>
                                        <th>QC</th>
                                        <th>Indexing</th>
                                        <th>Flagging</th>
                                        <th>CBSL-QA</th>
                                        <th>Client-QC</th>
                                        <th>Business Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {multipliedData.map((item, index) => {
                                        // Calculate total sum for each row
                                        const rowTotalSum = item.multipliedValues.reduce((sum, value) => sum + value, 0);

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                {item.multipliedValues.map((value, i) => (
                                                    <td key={i}>{typeof value === 'number' ? value.toFixed(2) : 'Invalid Value'}</td>
                                                ))}
                                                <td>{rowTotalSum.toFixed(2)}</td> {/* Display total sum for this row */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='search-report-card'>
                        <h4>Detailed Report</h4>
                        <div className='row'>
                            <div className='col-2'>
                                <p>Total row(s) affected: 1</p>
                            </div>
                            <div className='col-8'></div>
                            <div className='col-2'>
                                <button className='btn btn-success'>Export CSV</button>
                            </div>
                        </div>

                        <div className='row ms-2 me-2'>
                            <table className='table-bordered mt-2'>
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Location Name</th>
                                        <th>Scanned</th>
                                        <th>QC</th>
                                        <th>Indexing</th>
                                        <th>Flagging</th>
                                        <th>CBSL-QA</th>
                                        <th>Client-QC</th>
                                        <th>Business Value</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locationReport && locationReport.map((elem, index) => (
                                        <tr onClick={handleLocationView} key={index}>
                                            <td>{index + 1}</td>
                                            <td>{elem.locationname || 0}</td>
                                            <td>{elem.Total_Scanned || 0}</td>
                                            <td>{elem.Total_QC || 0}</td>
                                            <td>{elem.Total_Index || 0}</td>
                                            <td>{elem.Total_Flagging || 0}</td>
                                            <td>{elem.Total_CBSL_QA || 0}</td>
                                            <td>{elem.Total_Client_QC || 0}</td>
                                            <td>
                                                {parseFloat(elem.Total_Scanned || 0) + parseFloat(elem.Total_QC || 0) + parseFloat(elem.Total_Index || 0) + parseFloat(elem.Total_Flagging || 0) + parseFloat(elem.Total_CBSL_QA || 0) + parseFloat(elem.Total_Client_QC || 0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {locationView &&
                    <>
                        <div className='row mt-3'>
                            <div className='search-report-card'>
                                <h4>Detailed Report</h4>
                                <div className='row'>
                                    <div className='col-2'>
                                        <p>Total row(s) affected: 1</p>
                                    </div>
                                    <div className='col-8'></div>
                                    <div className='col-2'>
                                        <button className='btn btn-success'>Export CSV</button>
                                    </div>
                                </div>

                                <div className='row ms-2 me-2'>
                                    <table className='table-bordered mt-2'>
                                        <thead>
                                            <tr>
                                                <th>Sr.No.</th>
                                                <th>User Name</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Indexing</th>
                                                <th>Flagging</th>
                                                <th>CBSL-QA</th>
                                                <th>Client-QC</th>
                                                <th>Business Value</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr onClick={handleUserView}>
                                                <td>Arrow</td>
                                                <td>Rohit</td>
                                                <td>1782528</td>
                                                <td>414478</td>
                                                <td>237903</td>
                                                <td>555857</td>
                                                <td>45095</td>
                                                <td>3868</td>
                                                <td>81239.39</td>
                                                <td>Approved</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {userView &&
                    <>
                        <div className='row mt-3'>
                            <div className='search-report-card'>
                                <h4>Detailed Report</h4>
                                <div className='row'>
                                    <div className='col-2'>
                                        <p>Total row(s) affected: 1</p>
                                    </div>
                                    <div className='col-8'></div>
                                    <div className='col-2'>
                                        <button className='btn btn-success'>Export CSV</button>
                                    </div>
                                </div>

                                <div className='row ms-2 me-2'>
                                    <table className='table-bordered mt-2'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>User Name</th>
                                                <th>Date</th>
                                                <th>LotNo</th>
                                                <th>File Barcode</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Indexing</th>
                                                <th>Flagging</th>
                                                <th>CBSL-QA</th>
                                                <th>Client-QC</th>
                                                <th>Business Value</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr onClick={handleUserView}>
                                                <td>Arrow</td>
                                                <td>Rohit</td>
                                                <td>26-04-2024</td>
                                                <td>001</td>
                                                <td>123423</td>
                                                <td>1782528</td>
                                                <td>414478</td>
                                                <td>237903</td>
                                                <td>555857</td>
                                                <td>45095</td>
                                                <td>3868</td>
                                                <td>81239.39</td>
                                                <td>Approved</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default CumulativeSummaryReport