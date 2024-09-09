import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './API';
import { FiDownload } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

const DynamicDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [tableData, setTableData] = useState(null);
    const [licData, setLicData] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [downloadExcel, setDownloadExcel] = useState(null);

    const projects = [
        { id: 1, name: 'UPDC', description: 'Details about Nimhans project...' },
        { id: 2, name: 'Telangana', description: 'Details about Nimhans project...' },
        { id: 3, name: 'Karnataka', description: 'Details about Nimhans project...' },
        { id: 4, name: 'Nimhans', description: 'Details about Nimhans project...' },
        { id: 5, name: 'LIC', description: 'Details about LIC project...' },
        { id: 6, name: 'NMML', description: 'Details about NMML project...' },
        { id: 7, name: 'CAG', description: 'Details about CAG project...' },
        { id: 8, name: 'Tata Power', description: 'Details about Tata Power project...' },
        { id: 9, name: 'Allahbad HC', description: 'Details about Allahbad HC project...' },
        { id: 10, name: 'BLR', description: 'Details about Allahbad HC project...' },
    ];

    const { projectId } = useParams();
    const project = projects.find(p => p.id === parseInt(projectId));

    useEffect(() => {
        if (projectId) {
            fetchTableData();
            fetchLICData();
        }
    }, [projectId, fromDate, toDate]);

    const fetchTableData = async () => {
        try {
            let url = `${API_URL}/fetchexcel/${projectId}`;

            // Append fromDate and toDate as query parameters if selected
            if (fromDate && toDate) {
                url += `?startDate=${fromDate}&endDate=${toDate}`;
            }
            const response = await axios.get(url);
            setTableData(response.data);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    const fetchLICData = async () => {
        try {
            let url = `${API_URL}/licSummary/${projectId}`;

            // Append fromDate and toDate as query parameters if selected
            if (fromDate && toDate) {
                url += `?startDate=${fromDate}&endDate=${toDate}`;
            }

            const response = await axios.get(url);
            setLicData(response.data);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('No file selected');
            return;
        }

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            let uploadEndpoint = `${API_URL}/uploadExcelLic/${projectId}`; // Default endpoint

            // Conditionally change the upload endpoint based on the projectId
            if (projectId === '6') { // NMML project
                uploadEndpoint = `${API_URL}/uploadExcelNMML`;
            }

            const response = await axios.post(uploadEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message);
            fetchTableData(); // Fetch the table data again after upload
        } catch (error) {
            setMessage('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchDownloadExcel = async () => {
            let apiUrl;
    
            if (projectId === '6') {
                apiUrl = `${API_URL}/downloadformatnmml`;
            } else {
                apiUrl = `${API_URL}/downloadformatlic`;
            }
    
            try {
                const response = await axios.get(apiUrl, { responseType: "blob" });
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);
                setDownloadExcel(url);
            } catch (error) {
                console.error("Error in exporting data:", error);
            }
        };
    
        fetchDownloadExcel(projectId);
    }, [projectId]);
    

    const handleFromDateChange = (event) => {
        const selectedFromDate = event.target.value;
        setFromDate(selectedFromDate);

        const [year, month] = selectedFromDate.split("-");
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        const lastDateOfMonth = `${year}-${month}-${lastDayOfMonth}`;
        setToDate(lastDateOfMonth);
    };

    const handleToDateChange = (event) => {
        setToDate(event.target.value);
    };
    const handleDownloadFormat = (e) => {
        e.preventDefault();
        if (downloadExcel) {
            const link = document.createElement("a");
            link.href = downloadExcel;
            link.setAttribute("download", "ExcelFormat.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!project) {
        return <h2>Project not found!</h2>;
    }

    return (
        <>
            <Header />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2'>
                        <SideBar />
                    </div>
                    <div className='col-10'>
                        <div className='row mt-5 me-1'>
                            <div className="card" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                                <Link to='/projects' style={{ textDecoration: 'none' }}>
                                    <h6 className="ms-2" style={{ color: "white" }}>
                                        <FaHome /> /{project.name}
                                    </h6>
                                </Link>

                            </div>
                            <div className='row search-report-card mt-3 ms-1'>
                                <div className='col-3'>
                                    <input type='file' onChange={handleFileChange} />
                                </div>
                                <div className='col-6'>
                                    <button
                                        className='btn btn-success'
                                        style={{ width: '200px' }}
                                        onClick={handleUpload}
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                    {message && <div className="mt-3">{message}</div>}
                                </div>
                                <div className='col-2'>
                                    <button className="btn btn-primary d-flex align-items-center ms-5" style={{ width: '120px' }} onClick={handleDownloadFormat}>
                                        <FiDownload className="me-2" />Format
                                    </button>
                                </div>
                            </div>
                            {/* Table to display fetched data */}
                            <div className='row search-report-card mt-2 ms-1'>
                                <div className='row'>
                                    <div className='col-3'>
                                        <label className='me-1'>From Date:</label>
                                        <input type='date' value={fromDate} onChange={handleFromDateChange} />
                                    </div>
                                    <div className='col-3'>
                                        <label className='me-1'>To Date:</label>
                                        <input type='date' value={toDate} onChange={handleToDateChange} />
                                    </div>
                                </div>
                                {tableData && (
                                    <table className="table table-bordered mt-4">
                                        <thead>
                                            <tr>
                                                <th>Received</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Flagging</th>
                                                <th>Indexing</th>
                                                <th>CBSL QA</th>
                                                <th>Client QC</th>
                                                <th>Export</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.Received}</td>
                                                    <td>{row.Scanned}</td>
                                                    <td>{row.QC}</td>
                                                    <td>{row.Flagging}</td>
                                                    <td>{row.Indexing}</td>
                                                    <td>{row.CBSL_QA}</td>
                                                    <td>{row.Client_QC}</td>
                                                    <td>{row.Export}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DynamicDashboard;

