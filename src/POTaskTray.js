import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';
import { toast, ToastContainer } from 'react-toastify';
import { IoDownload } from 'react-icons/io5';
const POTaskTray = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [month, setMonth] = useState('');
    const [data, setData] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [datesOfMonth, setDatesOfMonth] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showConfirmationApprovalBox, setShowConfirmationApprovalBox] = useState(false);
    const [showConfirmationRejectionBox, setShowConfirmationRejectionBox] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const [currentIndex, setCurrentIndex] = useState(null);
    const userLog = JSON.parse(localStorage.getItem('user'));
    const [reason, setReason] = useState("");
    const locations = userLog ? userLog.locations : [];
    const projectId = userLog ? userLog.projects[0] : null;

    const calculateDates = () => {
        const today = new Date();

        // Set startDate to the 26th of the last month
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 27);
        if (start.getDate() < 26) {
            start.setMonth(start.getMonth() - 1); // Go back to the last month if today is before 26th
        }
        setStartDate(start.toISOString().split('T')[0]); // Format date as YYYY-MM-DD

        // Set endDate to the 25th of the current month
        const end = new Date(today.getFullYear(), today.getMonth(), 26);
        setEndDate(end.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    };

    useEffect(() => {
        calculateDates(); // Calculate dates when component mounts
    }, []);

    const handleProjectChange = (e) => setSelectedProject(e.target.value);
    const handleLocationChange = (e) => setSelectedLocation(e.target.value);

    const handleMonthChange = (e) => setMonth(e.target.value);
    const handleSubmit = async () => {
        setData("");
        try {
            // Retrieve projectId from userLog
            const userLog = JSON.parse(localStorage.getItem('user'));
            const projectId = userLog ? userLog.projects[0] : null; // Assuming the first project ID is used

            // Modify locationName if projectId is 1
            const locationNameWithSuffix = projectId === 1
                ? `${selectedLocation} District Court`
                : selectedLocation;

            const response = await axios.get(`${API_URL}/api/userdetailedreportmonthwise`, {
                params: {
                    locationName: locationNameWithSuffix,
                    startDate: startDate,
                    endDate: endDate,
                    project: projectId,
                },
            });

            const fetchedData = response.data;
            console.log("Data fetched:", fetchedData);

            const transformedData = {};
            const dates = new Set();
            console.log("Before Transformation", transformedData);

            fetchedData.forEach((item) => {
                const { user_type, Date, TotalExpense, IsApprovedPO } = item;
                if (!transformedData[user_type]) {
                    transformedData[user_type] = [];
                }
                transformedData[user_type].push({
                    Date,
                    TotalExpense: TotalExpense.toFixed(2),
                    status: IsApprovedPO,
                });
                dates.add(Date);
            });

            console.log("Transformed Data", transformedData);
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
        const locationNameWithSuffix = projectId === 1
            ? `${selectedLocation} District Court`
            : selectedLocation;

        // Check if the user has the 'PO' role
        if (!userRoles.includes('PO')) {
            toast.error('User does not have the required role to perform approval.');
            return;
        }

        const userData = {
            LocationCode: locationNameWithSuffix,
            UserName: selectedUsers, // Send all selected users as an array
            startDate: startDate,
            endDate: endDate,
            UserID: '0', // Assuming `user.user_id` is correct
            userProfile: '0',
            role: 'PO',
            project: projectId,
        };

        console.log('Sending approval request with data:', JSON.stringify(userData, null, 2));

        try {
            const approvalResponse = await axios.post(`${API_URL}/approve`, userData);
            console.log('Approval response:', approvalResponse.data);
            toast.success("Approved Successfully");
        } catch (error) {
            console.error('Error approving:', error.response?.data || error.message); // Include error message if no response data
            toast.error('An error occurred while approving.');
        }
        handleSubmit();
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);  // Update reason state
    };
    const handleReject = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userRoles = user?.user_roles || [];
        const locationNameWithSuffix = projectId === 1
            ? `${selectedLocation} District Court`
            : selectedLocation;

        for (const selectedUser of selectedUsers) {
            // Check if the user has the 'PO' role
            if (userRoles.includes('PO')) {
                const rejectData = {
                    LocationCode: locationNameWithSuffix,
                    UserName: selectedUser,
                    startDate: startDate,
                    endDate: endDate,
                    UserID: '0', // If needed, replace with actual user ID
                    userProfile: '0', // Replace with actual user profile if necessary
                    role: 'PO',
                    project: projectId,
                    remarks: reason, // Add the rejection reason
                };

                console.log('Sending rejection request with data:', rejectData);

                try {
                    const rejectionResponse = await axios.post(`${API_URL}/reject`, rejectData);
                    console.log('Rejection response:', rejectionResponse.data);
                    toast.success("Rejection status updated successfully");
                } catch (error) {
                    console.error('Error rejecting:', error.response?.data || error);
                    toast.error('An error occurred while rejecting.');
                }
            } else {
                toast.error('User does not have the required role to perform rejection.');
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
                    (statusFilter === 'Pending' && (status === 0 || status === null)) ||
                    (statusFilter === 'Rejected' && status === 2);
            });
            if (hasStatus) {
                filteredData[user] = userEntries;
            }
            return filteredData;
        }, {});
    };

    const fileHeaders = ['Sr No', 'User', 'Status'];
    function convertJSONToCSV(fetchedData, columnHeaders, datesOfMonth) {
        if (Object.keys(fetchedData).length === 0) return '';
        const headers = [...columnHeaders, ...datesOfMonth].join(',') + '\n';
        const rows = Object.keys(fetchedData).map((user, index) => {
            const status = fetchedData[user].some(entry => entry.status === 0)
                ? 'Pending'
                : fetchedData[user].some(entry => entry.status === 1)
                    ? 'Approved'
                    : 'Rejected';
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
    const handleDateChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from the event target
        if (name === 'startDate') {
            setStartDate(value); // Update startDate if input is for start date
        } else if (name === 'endDate') {
            setEndDate(value); // Update endDate if input is for end date
        }
    };
    const remarks = [...new Set(Array.isArray(data) ? data.map(entry => entry.Remarks) : [])];
    const isSubmitDisabled = !reason.trim();

    return (
        <>
            <ToastContainer />
            <Header />
            <div className='container-fluid mt-5'>
                <div className='row'>
                    <div className='col-2'>
                        <SideBar />
                    </div>
                    <div className='col-10'>
                        <div className='row mt-2 search-report-card' style={{ overflow: 'auto' }}>

                            <div className='col-3'>
                                <select className='form-select' value={selectedLocation} onChange={handleLocationChange}>
                                    <option value=''>Select Location</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.name}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-2'>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='startDate' // Add name attribute
                                    value={startDate}
                                    onChange={handleDateChange}
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <div className='col-2'>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='endDate' // Add name attribute
                                    value={endDate}
                                    onChange={handleDateChange}
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className='col-12'>
                                {Object.keys(data).length > 0 && (
                                    <>
                                        <div className='row mt-3 d-flex justify-content-between align-items-right'>
                                            <div className='col-3'>
                                                <select
                                                    className='form-select'
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                >
                                                    <option value='All'>All</option>
                                                    <option value='Pending'>Pending</option>
                                                    <option value='Rejected'>Rejected</option>
                                                    <option value='Approved'>Approved</option>
                                                </select>
                                            </div>
                                            <div className='col-8'></div>
                                            <div className='col-1'>
                                                <button
                                                    className='btn text-end ms-4'
                                                    style={{ backgroundColor: '#4BC0C0' }}
                                                    onClick={() => exportFilteredCSV(data, fileHeaders, datesOfMonth, selectedLocation, month, statusFilter)}
                                                >
                                                    <IoDownload style={{ color: 'white' }} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-12 mt-3' style={{ maxHeight: '500px', overflow: 'auto' }}>
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '50px' }}>
                                                           Select
                                                        </th>
                                                        <th>User</th>
                                                        <th>Status</th>
                                                        <th>Remarks</th>
                                                        {datesOfMonth.map((date) => (
                                                            <th key={date}>{date}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.keys(filterData(data)).map((user, index) => {
                                                         const userEntries = filterData[user] || [];
                                                        const userRemark = userEntries.find(entry => entry.Remarks) ? userEntries[0].Remarks : '-';
                                                        return (
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
                                                                            : 'red'
                                                                }}>
                                                                    {Array.isArray(data[user]) && data[user].some((entry) => entry.status === 0 || entry.status === null)
                                                                        ? 'Pending'
                                                                        : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 1)
                                                                            ? 'Approved'
                                                                            : 'Rejected'
                                                                    }
                                                                </td>
                                                                <td>{userRemark}</td>
                                                                {datesOfMonth.map((date) => (
                                                                    <td key={date}>
                                                                        {data[user].find((entry) => entry.Date === date)?.TotalExpense || 'N/A'}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='row mt-3'>
                                            <div className='col-10'></div>
                                            <div className='col-1'>
                                                <button className='btn success-btn' onClick={handleShowConfirmationApprovalBox}>Approve</button>
                                            </div>
                                            <div className='col-1'>
                                                <button className='btn danger-btn' onClick={handleShowConfirmationRejectionBox}>Reject</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {error && (
                                    <div className='col-12 mt-3'>
                                        <div className='alert alert-danger'>{error}</div>
                                    </div>
                                )}

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
                                    <div className='row'>
                                        <label>Give valid reason for rejection.</label>
                                        <input
                                            type='text'
                                            placeholder='Reason for rejection'
                                            value={reason}
                                            onChange={handleReasonChange}
                                        />
                                    </div>
                                    <div className='mt-2'>
                                        <button
                                            onClick={handleConfirmAction}
                                            className='btn btn-success me-5'
                                            disabled={isSubmitDisabled}  // Disable the button if no reason is entered
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={handleCloseConfirmationRejectionBox}
                                            className='btn btn-danger'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default POTaskTray;