import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';
import { toast, ToastContainer } from 'react-toastify'; 
const AllTaskTray = () => {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectID] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [month, setMonth] = useState('');
    const [data, setData] = useState({});
    const [datesOfMonth, setDatesOfMonth] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showConfirmationApprovalBox, setShowConfirmationApprovalBox] = useState(false);
    const [showConfirmationRejectionBox, setShowConfirmationRejectionBox] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const [currentIndex, setCurrentIndex] = useState(null);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/getproject`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        const fetchLocations = async (selectedProject) => {
            try {
                if (!selectedProject) {
                    setLocations([]); 
                    return;
                }
                const response = await axios.get(`${API_URL}/locations`, {
                    params: { project: selectedProject }
                });
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchProjects();
        if (selectedProject) {
            fetchLocations(selectedProject);
        } else {
            setLocations([]); 
        }
    }, [selectedProject]);
    const handleProjectChange = (e) => setSelectedProject(e.target.value);
    const handleLocationChange = (e) => setSelectedLocation(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);
    const handleSubmit = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/userdetailedreportdatewise`, {
                params: {
                    locationName: selectedLocation,
                    month,
                    project: selectedProject,
                },
            });
            const fetchedData = response.data;
            console.log("dataa",fetchedData)
            const transformedData = {};
            const dates = new Set();
            fetchedData.forEach((item) => {
                const { user_type, Date, TotalExpense, IsApprovedHR } = item;
                if (!transformedData[user_type]) {
                    transformedData[user_type] = [];
                }
                transformedData[user_type].push({
                    Date,
                    TotalExpense: TotalExpense.toFixed(2),
                    status: IsApprovedHR,
                });
                dates.add(Date);
            });
            const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
            setData(transformedData);
            setDatesOfMonth(sortedDates);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching data.');
        }
    };
    const handleExport = async (format) => {
        try {
            const response = await axios.get(`${API_URL}/downloadcsv`, {
                params: {
                    locationName: selectedLocation,
                    month,
                    project: selectedProject,
                },
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error exporting as ${format}:`, error);
            setError(`An error occurred while exporting as ${format}.`);
        }
    };
    const handleUserSelection = (user, isSelected) => {
        setSelectedUsers((prevSelected) => {
            if (isSelected) {
                return [...prevSelected, user];
            } else {
                return prevSelected.filter((item) => item !== user);
            }
        });
    };
    const extractMonthNumber = (monthStr) => {
        if (!monthStr) return '';
        const [year, month] = monthStr.split('-');
        return parseInt(month, 10);
    };
    const handleShowConfirmationApprovalBox = (index) => {
        setActionType('approve');
        setCurrentIndex(index);
        setShowConfirmationApprovalBox(true);
    };

    const handleCloseConfirmationApprovalBox = () => {
        setShowConfirmationApprovalBox(false);
    };

    const handleShowConfirmationRejectionBox = (index) => {
        setActionType('reject');
        setCurrentIndex(index);
        setShowConfirmationRejectionBox(true);
    };

    const handleCloseConfirmationRejectionBox = () => {
        setShowConfirmationRejectionBox(false);
    };

    const handleConfirmAction = () => {
        if (actionType === 'approve') {
            handleApproval(currentIndex);
        } else if (actionType === 'reject') {
            handleReject(currentIndex);
        }
        setShowConfirmationApprovalBox(false);
        setShowConfirmationRejectionBox(false);
    };
    const handleApproval = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userRoles = user?.user_roles || []; 
        const monthNumber = extractMonthNumber(month);
        for (const selectedUser of selectedUsers) {
            try {
                const fetchResponse = await axios.get(`${API_URL}/fetch-approved`, {
                    params: {
                        UserName: selectedUser,
                        InMonth: monthNumber,
                        project: selectedProject,
                    },
                });
                const currentStatus = fetchResponse.data[0]; 
                console.log('Current status:', currentStatus);
                if (currentStatus) {
                    if (
                        userRoles.includes('HR') &&
                        currentStatus.IsApprovedCBSL === 1 &&
                        currentStatus.IsApprovedPM === 1 &&
                        currentStatus.IsApprovedPO === 1 &&
                        (currentStatus.IsApprovedHR === 0 || currentStatus.IsApprovedHR === 2)
                    ) {
                        const userData = {
                            LocationCode: currentStatus.LocationCode,
                            UserName: selectedUser,
                            InMonth: monthNumber,
                            UserID: currentStatus.UserID,
                            userProfile: currentStatus.userProfile,
                            role: 'HR',
                            project: selectedProject,
                        };
                        console.log('Sending approval request with data:', userData);
                        try {
                            const approvalResponse = await axios.post(`${API_URL}/approve`, userData);
                            console.log('Approval response:', approvalResponse.data);
                            toast.success("Approved Successfully");
                        } catch (error) {
                            console.error('Error approving:', error.response.data); // Debugging info
                            toast.error('An error occurred while approving.');
                        }
                    } else {
                        toast.error('PO approval is pending.');
                    }
                } else {
                    toast.error('No record found for the given criteria.');
                }
            } catch (error) {
                console.error('Error fetching approval status:', error.response.data); // Debugging info
                toast.error('An error occurred while checking approval status.');
            }
        }
    };
    const handleReject = async () => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        const userRoles = userFromLocalStorage?.user_roles || [];
        const monthNumber = extractMonthNumber(month);
        for (const selectedUser of selectedUsers) {
            try {
                const fetchResponse = await axios.get(`${API_URL}/fetch-approved`, {
                    params: {
                        UserName: selectedUser,
                        InMonth: monthNumber,
                        project: selectedProject,
                    },
                });
                const currentStatus = fetchResponse.data[0]; 
                console.log('Current status:', currentStatus);
                if (currentStatus) {
                    if (
                        userRoles.includes('HR') &&
                        currentStatus.IsApprovedCBSL === 1 &&
                        currentStatus.IsApprovedPM === 1 &&
                        currentStatus.IsApprovedPO === 1 &&
                        (currentStatus.IsApprovedHR === 0 || currentStatus.IsApprovedHR === 1)
                    ) {
                        const rejectData = {
                            LocationCode: currentStatus.LocationCode,
                            UserName: selectedUser,
                            InMonth: monthNumber,
                            UserID: currentStatus.UserID,
                            userProfile: '0',
                            role: 'HR',
                            project: selectedProject,
                        };
                        console.log('Sending rejection request with data:', rejectData);
                        try {
                            const rejectionResponse = await axios.post(`${API_URL}/reject`, rejectData);
                            console.log('Rejection response:', rejectionResponse.data);
                            toast.success("Rejection status updated successfully");
                        } catch (error) {
                            console.error('Error rejecting:', error.response.data); // Debugging info
                            toast.error('An error occurred while rejecting.');
                        }
                    } else {
                        toast.error('Record does not meet the criteria for rejection.');
                    }
                } else {
                    toast.error('No record found for the given criteria.');
                }
            } catch (error) {
                console.error('Error fetching approval status:', error.response?.data || error); // Debugging info
                toast.error('An error occurred while checking approval status.');
            }
        }
    };

    const filterData = (data) => {
        if (statusFilter === 'All') {
            return data;
        }
        return Object.keys(data).reduce((filteredData, user) => {
            const userEntries = data[user];
            const hasStatus = userEntries.some(entry => {
                const status = entry.status;
                return (statusFilter === 'Approved' && status === 1) ||
                    (statusFilter === 'Pending' && (status === 0 || status === 'null')) ||
                    (statusFilter === 'Rejected' && status === 2);
            });
            if (hasStatus) {
                filteredData[user] = userEntries;
            }
            return filteredData;
        }, {});
    };


// const fileHeaders = ['User', 'Status']; 

// function convertJSONToCSV(fetchedData, columnHeaders, datesOfMonth) {
//     if (fetchedData.length === 0) return '';

//     // Add the dynamic date headers
//     const headers = [...columnHeaders, ...datesOfMonth].join(',') + '\n';

//     // Build rows for each user
//     const rows = Object.keys(fetchedData).map(user => {
//         // Extract user status (Pending, Approved, etc.)
//         const status = fetchedData[user].some(entry => entry.status === 0)
//             ? 'Pending'
//             : fetchedData[user].some(entry => entry.status === 1)
//             ? 'Approved'
//             : fetchedData[user].some(entry => entry.status === 2)
//             ? 'Rejected'
//             : 'Not Approved by PO';

//         // Extract expense data for each date, defaulting to '0' if no data is present
//         const expenseData = datesOfMonth.map(date => {
//             const entry = fetchedData[user].find(record => record.Date === date);
//             return entry ? entry.TotalExpense : '0'; // If no entry, display '0'
//         });

//         // Combine the user, status, and expense data into a single CSV row
//         return [user, status, ...expenseData].join(',');
//     }).join('\n');

//     return headers + rows;
// }

// function downloadCSV(fetchedData, headers, datesOfMonth,selectedLocation,month) {
//     const csvData = convertJSONToCSV(fetchedData, headers, datesOfMonth);
//     if (csvData === '') {
//         alert('No data to export');
//     } else {
//         // Create the file name using the location name, year, and month
//         const fileName = `${selectedLocation}-${month}.csv`;

//         const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.setAttribute('download', fileName);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }
// }

const fileHeaders = ['Sr No','User', 'Status']; 

function convertJSONToCSV(fetchedData, columnHeaders, datesOfMonth) {
    if (Object.keys(fetchedData).length === 0) return '';

    
    const headers = [...columnHeaders, ...datesOfMonth].join(',') + '\n';

    const rows = Object.keys(fetchedData).map((user, index) => {
        const status = fetchedData[user].some(entry => entry.status === 0)
            ? 'Pending'
            : fetchedData[user].some(entry => entry.status === 1)
            ? 'Approved'
            : fetchedData[user].some(entry => entry.status === 2)
            ? 'Rejected'
            : 'Not Approved by PO';
        
        const expenseData = datesOfMonth.map(date => {
            const entry = fetchedData[user].find(record => record.Date === date);
            return entry ? entry.TotalExpense : '0'; 
        });
        return [index + 1, user, status, ...expenseData].join(',');
    }).join('\n');

    return headers + rows;
}

function downloadCSV(fetchedData, headers, datesOfMonth, selectedLocation, month) {
    const csvData = convertJSONToCSV(fetchedData, headers, datesOfMonth);
    if (csvData === '') {
        alert('No data to export');
    } else {
        const fileName = `${selectedLocation}-${month}.csv`;
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function exportFilteredCSV(data, headers, datesOfMonth, selectedLocation, month, statusFilter) {
    const filteredData = filterData(data, statusFilter);
    downloadCSV(filteredData, headers, datesOfMonth, selectedLocation, month);
}

    return (
        <>
            <ToastContainer />
            <Header />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2'>
                        <SideBar />
                    </div>
                    <div className='col-10'>
                        <div className='row mt-2 search-report-card' style={{ overflow: 'auto' }}>
                            <div className='col-3'>
                                <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
                                    <option value=''>Select Project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id} onChange={handleProjectChange}>
                                            {project.ProjectName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <select className='form-select' value={selectedLocation} onChange={handleLocationChange}>
                                    <option value=''>Select Location</option>
                                    {locations.map((location) => (
                                        <option key={location.LocationName} value={location.LocationName}>
                                            {location.LocationName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <input type='month' className='form-control' value={month} onChange={handleMonthChange} style={{height:'38px'}}/>
                            </div>
                            <div className='col-3'>
                                <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className='row mt-4'>
                                <div className='col-2'>
                                    <select className='form-select' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value='All'>All</option>
                                        <option value='Approved'>Approved</option>
                                        <option value='Pending'>Pending</option>
                                        <option value='Rejected'>Rejected</option>
                                    </select>
                                </div>
                                <div className='col-8'></div>
                                <div className='col-2'>
                                <button 
    className='btn btn-primary' 
    onClick={() => exportFilteredCSV(data, fileHeaders, datesOfMonth, selectedLocation, month, statusFilter)}>
    Export
</button>
                                </div>
                            </div>
                            <div className='col-12'>
                                {Object.keys(data).length > 0 && (
                                    <div className='col-12 mt-3'>
                                        <table className='table table-bordered'>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '50px' }}>
                                                        <input
                                                            type='checkbox'
                                                            onChange={(e) => setSelectedUsers(e.target.checked ? Object.keys(data) : [])}
                                                        />
                                                    </th>
                                                    <th>User</th>
                                                    <th>Status</th>
                                                    {datesOfMonth.map((date) => (
                                                        <th key={date}>{date}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(filterData(data)).map((user, index) => (
                                                    <tr key={user}>
                                                        <td style={{ width: '50px' }}>
                                                            <input
                                                                type='checkbox'
                                                                data-index={index}
                                                                onChange={(e) => handleUserSelection(user, e.target.checked)}
                                                            />
                                                        </td>
                                                        <td>{user}</td>
                                                        <td style={{
                                                            color: Array.isArray(data[user]) && data[user].some((entry) => entry.status === 0)
                                                                ? 'orange' // Pending
                                                                : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 1)
                                                                    ? 'green' // Approved
                                                                    : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 2)
                                                                        ? 'red' // Rejected
                                                                        : 'gray' // Not Approved by PO
                                                        }}>
                                                            {Array.isArray(data[user]) && data[user].some((entry) => entry.status === 0)
                                                                ? 'Pending'
                                                                : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 1)
                                                                    ? 'Approved'
                                                                    : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 2)
                                                                        ? 'Rejected'
                                                                        : 'Not Approved by PO'}
                                                        </td>
                                                        {datesOfMonth.map((date) => (
                                                            <td key={date}>
                                                                {data[user].find((entry) => entry.Date === date)?.TotalExpense || 'N/A'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {error && (
                                    <div className='col-12 mt-3'>
                                        <div className='alert alert-danger'>{error}</div>
                                    </div>
                                )}
                                <div className='row mt-3'>
                                    <div className='col-10'></div>
                                    <div className='col-1'>
                                        <button className='btn success-btn' onClick={handleShowConfirmationApprovalBox}>Approve</button>
                                    </div>
                                    <div className='col-1'>
                                        <button className='btn danger-btn' onClick={handleShowConfirmationRejectionBox}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Confirmation Approval Box */}
                {showConfirmationApprovalBox && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p>Are you sure you want to approve this task?</p>
                        <button onClick={handleConfirmAction} className='btn btn-success'>Yes</button>
                        <button onClick={handleCloseConfirmationApprovalBox} className='btn btn-danger'>No</button>
                    </div>
                    </div>
                )}

                {/* Confirmation Rejection Box */}
                {showConfirmationRejectionBox && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p>Are you sure you want to reject this task?</p>
                        <button onClick={handleConfirmAction} className='btn btn-success'>Yes</button>
                        <button onClick={handleCloseConfirmationRejectionBox} className='btn btn-danger'>No</button>
                    </div>
                    </div>
                )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default AllTaskTray;