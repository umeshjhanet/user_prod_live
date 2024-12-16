// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Components/Header';
// import SideBar from './Components/SideBar';
// import { API_URL } from './API';
// import { toast, ToastContainer } from 'react-toastify';

// const HRView = () => {
//     const [projects, setProjects] = useState([]);
//     const [locations, setLocations] = useState([]);
//     const [selectedProject, setSelectedProject] = useState('');
//     const [selectedLocation, setSelectedLocation] = useState('');
//     const [month, setMonth] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [data, setData] = useState([]);
//     const [datesOfMonth, setDatesOfMonth] = useState([]);
//     const [error, setError] = useState(null);

//     const calculateDates = () => {
//         const today = new Date();
//         const start = new Date(today.getFullYear(), today.getMonth(), 26);
//         if (start.getDate() < 26) {
//             start.setMonth(start.getMonth() - 1); // Go back to the last month if today is before 26th
//         }
//         setStartDate(start.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
//         const end = new Date(today.getFullYear(), today.getMonth() + 1, 25);
//         setEndDate(end.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
//     };

//     useEffect(() => {
//         calculateDates(); // Calculate dates when component mounts
//     }, []);
//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/getproject`);
//                 setProjects(response.data);
//             } catch (error) {
//                 console.error('Error fetching projects:', error);
//             }
//         };
//         const fetchLocations = async (selectedProject) => {
//             try {
//                 if (!selectedProject) {
//                     setLocations([]);
//                     return;
//                 }
//                 const response = await axios.get(`${API_URL}/locations`, {
//                     params: { project: selectedProject },
//                 });
//                 const modifiedLocations = response.data.map(location => ({
//                     ...location,
//                     LocationName: selectedProject === '1'
//                         ? (location.LocationName ? `${location.LocationName} District Court` : 'Unknown District Court')
//                         : location.LocationName,
//                 }));
//                 setLocations(modifiedLocations);
//             } catch (error) {
//                 console.error('Error fetching locations:', error);
//             }
//         };
//         fetchProjects();
//         if (selectedProject) {
//             fetchLocations(selectedProject);
//         } else {
//             setLocations([]);
//         }
//     }, [selectedProject, startDate, endDate]);
//     const handleProjectChange = (e) => setSelectedProject(e.target.value);
//     const handleLocationChange = (e) => setSelectedLocation(e.target.value);
//     const handleMonthChange = (e) => setMonth(e.target.value);
//     const handleDateChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'startDate') {
//             setStartDate(value);
//         } else if (name === 'endDate') {
//             setEndDate(value);
//         }
//     };
//     const handleSubmit = async () => {
//         setData([]); // Clear previous data
//         try {
//             const response = await axios.get(`${API_URL}/api/userworkreportmonthwise`, {
//                 params: {
//                     locationName: selectedLocation,
//                     startDate: startDate ? startDate : null,
//                     endDate: endDate ? endDate : null,
//                     project: selectedProject,
//                 },
//             });

//             const fetchedData = response.data;
//             setData(fetchedData);
//             const dates = new Set(fetchedData.map(item => item.Date));
//             const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
//             setDatesOfMonth(sortedDates);
//             setError(null);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setError('An error occurred while fetching data.');
//         }
//     };
//     const dates = [...new Set(data && data.map(entry => entry.Date))];
//     const users = [...new Set(data && data.map(entry => entry.user_type))];
//     const metrics = ['QC', 'Flagging', 'Indexing', 'CBSL_QA'];
//     const exportToCSV = () => {
//         const headerRow = ['User', ...dates.flatMap(date => [date, '', '', '']), 'Total Expense'];
//         const processHeaderRow = ['', ...dates.flatMap(date => metrics), ''];
//         const rows = users.map((user) => {
//             const userTotalExpense = data
//                 .filter(item => item.user_type === user)
//                 .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);
//             const userData = [
//                 user,
//                 ...dates.flatMap((date) => 
//                     metrics.map((metric) => {
//                         const entry = data.find(item => item.user_type === user && item.Date === date);
//                         return entry ? entry[metric] : 0;
//                     })
//                 ),
//                 userTotalExpense.toFixed(2),
//             ];
//             return { userData };
//         });
//         const csvContent = [
//             headerRow.join(','),              // Date header row with "colspan" effect
//             processHeaderRow.join(','),        // Metric header row
//             ...rows.map(row => row.userData.join(',')),  // User data rows
//         ].join('\n');
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = `${selectedLocation}-${startDate}.csv`;
//         link.click();
//     };


//     return (
//         <>
//             <ToastContainer />
//             <Header />
//             <div className='container-fluid mt-5'>
//                 <div className='row'>
//                     <div className='col-2'>
//                         <SideBar />
//                     </div>
//                     <div className='col-10'>
//                         <div className='row mt-2 search-report-card' style={{ overflow: 'auto' }}>
//                             <div className='col-3'>
//                                 <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
//                                     <option value=''>Select Project</option>
//                                     {projects.map((project) => (
//                                         <option key={project.id} value={project.id}>
//                                             {project.ProjectName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className='col-3'>
//                                 <select className='form-select' value={selectedLocation} onChange={handleLocationChange}>
//                                     <option value=''>Select Location</option>
//                                     {locations.map((location) => (
//                                         <option key={location.LocationName} value={location.LocationName}>
//                                             {location.LocationName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className='col-2'>
//                                 <input
//                                     type='date'
//                                     className='form-control'
//                                     name='startDate'
//                                     value={startDate}
//                                     onChange={handleDateChange}
//                                     style={{ height: '38px' }}
//                                 />
//                             </div>
//                             <div className='col-2'>
//                                 <input
//                                     type='date'
//                                     className='form-control'
//                                     name='endDate'
//                                     value={endDate}
//                                     onChange={handleDateChange}
//                                     style={{ height: '38px' }}
//                                 />
//                             </div>
//                             <div className='col-2'>
//                                 <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
//                             </div>
//                             <div className='col-12'>
//                                 {Object.keys(data).length > 0 && (
//                                     <>
//                                     <div className='mt-3 d-flex justify-content-between align-items-right'>
//                                     <button className='btn text-end' style={{backgroundColor:'#4BC0C0'}} onClick={exportToCSV}>Export</button>
//                                 </div>
//                                     <div className='col-12 mt-2' style={{ maxHeight: '500px', overflow: 'auto' }}>

//                                         <table className='table table-bordered'>
//                                             <thead>
//                                                 <tr>
//                                                     <th>User</th>
//                                                     {dates.map((date, index) => (
//                                                         <th colSpan={metrics.length} key={index}>
//                                                             {date}
//                                                         </th>
//                                                     ))}
//                                                     <th>Total Expense</th>
//                                                 </tr>
//                                                 <tr>
//                                                     <th></th>
//                                                     {dates.map((date, index) => (
//                                                         metrics.map((metric, idx) => (
//                                                             <th key={`${index}-${idx}`}>{metric}</th>
//                                                         ))
//                                                     ))}
//                                                     <th></th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {users.map((user, index) => {
//                                                     // Calculate the total expense for the user, defaulting to 0 if no data found
//                                                     const userTotalExpense = data
//                                                         .filter(item => item.user_type === user)
//                                                         .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);

//                                                     return (
//                                                         <tr key={index}>
//                                                             <td>{user}</td>
//                                                             {dates.map((date, dateIndex) => {
//                                                                 return metrics.map((metric, idx) => {
//                                                                     // Find the entry for the user and the date
//                                                                     const entry = data.find(item => item.user_type === user && item.Date === date);

//                                                                     // If no entry or no data for the metric, show 0
//                                                                     const metricValue = entry ? entry[metric] : 0;
//                                                                     return (
//                                                                         <td key={`${dateIndex}-${idx}`}>
//                                                                             {metricValue === undefined || metricValue === null ? 0 : metricValue}
//                                                                         </td>
//                                                                     );
//                                                                 });
//                                                             })}
//                                                             <td>{userTotalExpense.toFixed(2)}</td> {/* Total expense per user */}
//                                                         </tr>
//                                                     );
//                                                 })}
//                                                 <tr>
//                                                     <td colSpan={dates.length * metrics.length + 1}><b>Total Expense Sum</b></td>
//                                                     <td>
//                                                         {data.reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0).toFixed(2)}
//                                                     </td>
//                                                 </tr>
//                                             </tbody>


//                                         </table>
//                                     </div>
//                                     </>
//                                 )}
//                                 {error && (
//                                     <div className='col-12 mt-3'>
//                                         <div className='alert alert-danger'>{error}</div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default HRView;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';
import { toast, ToastContainer } from 'react-toastify';
import { IoDownload } from 'react-icons/io5';

const HRView = () => {
    const [projects, setProjects] = useState([]);
    const [locations, setLocations] = useState([]);
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

    const calculateDates = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 27);
        if (start.getDate() < 26) {
            start.setMonth(start.getMonth() - 1); // Go back to the last month if today is before 26th
        }
        setStartDate(start.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        const end = new Date(today.getFullYear(), today.getMonth(), 26);
        setEndDate(end.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    };

    useEffect(() => {
        calculateDates(); // Calculate dates when component mounts
    }, []);

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
                    params: { project: selectedProject },
                });
                const modifiedLocations = response.data.map(location => ({
                    ...location,
                    LocationName: selectedProject === '1'
                        ? (location.LocationName ? `${location.LocationName} District Court` : 'Unknown District Court')
                        : location.LocationName,
                }));
                setLocations(modifiedLocations);
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
    }, [selectedProject, startDate, endDate]);

    const handleProjectChange = (e) => setSelectedProject(e.target.value);
    const handleLocationChange = (e) => setSelectedLocation(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    const handleSubmit = async () => {
        setData([]); // Clear previous data
        try {
            const response = await axios.get(`${API_URL}/api/userworkreportmonthwise`, {
                params: {
                    locationName: selectedLocation,
                    startDate: startDate ? startDate : null,
                    endDate: endDate ? endDate : null,
                    project: selectedProject,
                },
            });

            const fetchedData = response.data;
            setData(fetchedData);
            const dates = new Set(fetchedData.map(item => item.Date));
            const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
            setDatesOfMonth(sortedDates);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching data.');
        }
    };

    const dates = [...new Set(Array.isArray(data) ? data.map(entry => entry.Date) : [])];
    const users = [...new Set(Array.isArray(data) ? data.map(entry => entry.user_type) : [])];
    const remarks = [...new Set(Array.isArray(data) ? data.map(entry => entry.Remarks) : [])];

    const metrics = ['QC', 'Flagging', 'Indexing', 'CBSL_QA'];

    const exportToCSV = () => {
        const headerRow = ['User', ...dates.flatMap(date => [date, '', '', '']), 'Total Expense', 'No. of Working Days'];
        const processHeaderRow = ['', ...dates.flatMap(date => metrics), '', ''];
        const rows = users.map((user) => {
            const userTotalExpense = data
                .filter(item => item.user_type === user)
                .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);
            const workingDays = dates.reduce((count, date) => {
                const entry = data.find(item => item.user_type === user && item.Date === date);
                return count + (entry && metrics.some(metric => entry[metric] > 0) ? 1 : 0);
            }, 0);
            const userData = [
                user,
                ...dates.flatMap((date) =>
                    metrics.map((metric) => {
                        const entry = data.find(item => item.user_type === user && item.Date === date);
                        return entry && entry[metric] != null ? entry[metric] : 0;
                    })
                ),
                userTotalExpense.toFixed(2),
                workingDays,
            ];
            return { userData };
        });

        const csvContent = [
            headerRow.join(','),              // Date header row with "colspan" effect
            processHeaderRow.join(','),        // Metric header row
            ...rows.map(row => row.userData.join(',')),  // User data rows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedLocation}-${startDate}.csv`;
        link.click();
    };
    const calculateApprovalStatus = (user, data) => {
        // Get all IsApprovedPO statuses for the user
        const statusesPO = data
            .filter(item => item.user_type === user)
            .map(item => item.IsApprovedPO);
        const statusesHR = data
            .filter(item => item.user_type === user)
            .map(item => item.IsApprovedHR);

        // Count occurrences of each status
        const statusCount = {
            rejected: statusesPO.filter(status => status === 2).length && statusesHR.filter(status => status === 2).length,
            pending: statusesPO.filter(status => status === 0).length && statusesPO.filter(status => status === 2).length,
            tobeapproved: statusesPO.filter(status => status === 1).length && statusesHR.filter(status => status === 0).length,
            approved: statusesHR.filter(status => status === 1).length,
        };

        // Determine the most frequent status based on counts
        const maxCount = Math.max(statusCount.rejected, statusCount.pending, statusCount.tobeapproved, statusCount.approved);

        if (maxCount === statusCount.rejected && statusCount.rejected > 0) return 'Rejected';
        if (maxCount === statusCount.pending && statusCount.pending > 0) return 'Pending';
        if (maxCount === statusCount.tobeapproved && statusCount.tobeapproved > 0) return 'ToBeApproved';
        if (maxCount === statusCount.approved && statusCount.approved > 0) return 'Approved';

        // If there’s a mix, return 'Mixed'
        if (statusCount.rejected > 0 && (statusCount.pending > 0 || statusCount.tobeapproved > 0 || statusCount.approved > 0)) {
            return 'Mixed';
        }

        // Default to 'Pending' if no status
        return 'Pending';
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
        for (const selectedUser of selectedUsers) {
            try {
                const fetchResponse = await axios.get(`${API_URL}/fetch-approved`, {
                    params: {
                        UserName: selectedUser,
                        startDate: startDate,
                        endDate: endDate,
                        project: selectedProject,
                    },
                });
                const currentStatus = fetchResponse.data[0];
                console.log('Current status:', currentStatus);
                if (currentStatus) {
                    if (
                        userRoles.includes('HR') &&
                        currentStatus.IsApprovedPO === 1 &&
                        (currentStatus.IsApprovedHR === 0 || currentStatus.IsApprovedHR === null || currentStatus.IsApprovedHR === 2)
                    ) {
                        const userData = {
                            LocationCode: currentStatus.LocationCode,
                            UserName: [selectedUser],
                            startDate: startDate,
                            endDate: endDate,
                            UserID: '0',
                            userProfile: '0',
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
    const handleReasonChange = (e) => {
        setReason(e.target.value);  // Update reason state
    };
    const handleReject = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userRoles = user?.user_roles || [];
        const locationNameWithSuffix = selectedProject === 1
            ? `${selectedLocation} District Court`
            : selectedLocation;

        for (const selectedUser of selectedUsers) {
            if (userRoles.includes('HR')) {
                const rejectData = {
                    LocationCode: locationNameWithSuffix,
                    UserName: selectedUser,
                    startDate: startDate,
                    endDate: endDate,
                    UserID: '0', // Ensure this is a unique identifier
                    userProfile: '0',
                    role: 'HR', // Correct role matching the condition
                    project: selectedProject,
                    remarks: reason,
                };

                console.log('Checking existing approvals for:', rejectData);

                try {
                    // Step 1: Log the parameters to check they match exactly with what the backend expects
                    console.log('Sending parameters to fetch-approved API:', {
                        UserName: rejectData.UserName,
                        startDate: rejectData.startDate,
                        endDate: rejectData.endDate,
                        project: rejectData.project
                    });

                    // Step 2: Fetch the existing record to verify it exists and is approved by PO
                    const response = await axios.get(`${API_URL}/fetch-approved`, {
                        params: {
                            UserName: rejectData.UserName,
                            startDate: rejectData.startDate,
                            endDate: rejectData.endDate,
                            project: rejectData.project, // Ensure this is the correct project identifier
                        },
                    });

                    // Check if response.data is an array and contains the data
                    const existingRecord = response.data && response.data.length > 0 ? response.data[0] : null;

                    if (!existingRecord) {
                        toast.error('Record does not exist.');
                        continue;
                    }

                    // Check if PO has approved
                    if (existingRecord.IsApprovedPO !== 1) {
                        toast.error('PO has not approved this record yet.');
                        continue;
                    }

                    console.log('Record exists and PO has approved. Proceeding with rejection:', existingRecord);

                    // Step 2: Proceed with rejection since the record exists and is approved by PO
                    const rejectionResponse = await axios.post(`${API_URL}/reject`, rejectData);

                    console.log('Rejection response:', rejectionResponse.data);
                    toast.success("Rejection status updated successfully");
                } catch (error) {
                    console.error('Error handling rejection:', error.response?.data || error);
                    toast.error('An error occurred while processing the rejection.');
                }
            } else {
                toast.error('User does not have the required role to perform rejection.');
            }
        }
    };

    const getFilteredUsers = () => {
        if (statusFilter === 'All') return users;

        return users.filter(user => {
            const approvalStatus = calculateApprovalStatus(user, data);
            return approvalStatus === statusFilter;
        });
    };

    const isSubmitDisabled = !reason.trim();
    console.log("Remarks", data);
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
                                <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
                                    <option value=''>Select Project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
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
                            <div className='col-2'>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='startDate'
                                    value={startDate}
                                    onChange={handleDateChange}
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <div className='col-2'>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='endDate'
                                    value={endDate}
                                    onChange={handleDateChange}
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                            </div>
                            {/* <div className='row mt-4'>
                                <div className='col-2'>
                                    <select className='form-select' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value='All'>All</option>
                                        <option value='Approved'>Approved</option>
                                        <option value='Pending'>Pending</option>
                                        <option value='Rejected'>Rejected</option>
                                    </select>
                                </div>
                            </div> */}
                            {/* <div className='col-12'>
                                {Object.keys(data).length > 0 && (
                                    <>
                                        <div className=' row mt-3 d-flex justify-content-between align-items-right'>
                                            <div className='col-11'></div>
                                            <div className='col-1'>
                                                <button className='btn text-end ms-4' style={{ backgroundColor: '#4BC0C0' }} onClick={exportToCSV}><IoDownload style={{ color: 'white' }} /></button>
                                            </div>
                                        </div>
                                        <div className='col-12 mt-2' style={{ maxHeight: '500px', overflow: 'auto' }}>
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr style={{ textAlign: 'center' }}>
                                                        <th rowSpan={2} style={{ width: '50px' }}>
                                                            <input
                                                                type='checkbox'
                                                                onChange={(e) => setSelectedUsers(e.target.checked ? Object.keys(data) : [])}
                                                            />
                                                        </th>
                                                        <th rowSpan={2}>Status</th>
                                                        <th rowSpan={2} >User</th>
                                                        {dates.map((date, index) => (
                                                            <th colSpan={metrics.length} key={index}>
                                                                {date}
                                                            </th>
                                                        ))}
                                                        <th rowSpan={2}>Total Expense</th>
                                                        <th rowSpan={2}>No. of Working Days</th>
                                                    </tr>
                                                    <tr>
                                                        {dates.map((date, index) => (
                                                            metrics.map((metric, idx) => (
                                                                <th key={`${index}-${idx}`}>{metric}</th>
                                                            ))
                                                        ))}

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user, index) => {

                                                        const userTotalExpense = data
                                                            .filter(item => item.user_type === user)
                                                            .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);

                                                        const workingDays = dates.reduce((count, date) => {
                                                            const entry = data.find(item => item.user_type === user && item.Date === date);
                                                            return count + (entry && metrics.some(metric => entry[metric] > 0) ? 1 : 0);
                                                        }, 0);

                                                        const approvalStatus = calculateApprovalStatus(user, data);
                                                        const statusStyle = {
                                                            Rejected: { color: 'red', fontWeight: 'bold' },
                                                            Approved: { color: 'green', fontWeight: 'bold' },
                                                            Pending: { color: 'orange', fontWeight: 'bold' },
                                                        };
                                                        return (
                                                            <tr key={index}>
                                                                <td style={{ width: '50px' }}>
                                                                    <input
                                                                        type='checkbox'
                                                                        data-index={index}
                                                                        onChange={(e) => handleUserSelection(user, e.target.checked)}
                                                                    />
                                                                </td>
                                                                <td style={statusStyle[approvalStatus]}>{approvalStatus}</td>
                                                                <td>{user}</td>
                                                                {dates.map((date, dateIndex) => {
                                                                    return metrics.map((metric, idx) => {
                                                                        const entry = data.find(item => item.user_type === user && item.Date === date);
                                                                        const metricValue = entry ? entry[metric] : 0;
                                                                        return (
                                                                            <td key={`${dateIndex}-${idx}`}>
                                                                                {metricValue === undefined || metricValue === null ? 0 : metricValue}
                                                                            </td>
                                                                        );
                                                                    });
                                                                })}
                                                                <td>{userTotalExpense.toFixed(2)}</td>
                                                                <td>{workingDays}</td>
                                                            </tr>
                                                        );
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
                            </div> */}
                            <div className='row mt-4'>
                                <div className='col-2'>

                                </div>
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
                                                    <option value='ToBeApproved'>To Be Approved</option>
                                                    <option value='Rejected'>Rejected</option>
                                                    <option value='Approved'>Approved</option>
                                                </select>
                                            </div>
                                            <div className='col-8'></div>
                                            <div className='col-1'>
                                                <button
                                                    className='btn text-end ms-4'
                                                    style={{ backgroundColor: '#4BC0C0' }}
                                                    onClick={exportToCSV}
                                                >
                                                    <IoDownload style={{ color: 'white' }} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='col-12 mt-2' style={{ maxHeight: '500px', overflow: 'auto' }}>
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr style={{ textAlign: 'center' }}>
                                                        <th rowSpan={2} style={{ width: '50px' }}>
                                                            Select
                                                        </th>
                                                        <th rowSpan={2}>Status</th>
                                                        <th rowSpan={2}>Remarks</th>
                                                        <th rowSpan={2}>User</th>
                                                        {dates.map((date, index) => (
                                                            <th colSpan={metrics.length} key={index}>
                                                                {date}
                                                            </th>
                                                        ))}
                                                        <th rowSpan={2}>Total Expense</th>
                                                        <th rowSpan={2}>No. of Working Days</th>
                                                    </tr>
                                                    <tr>
                                                        {dates.map((date, index) =>
                                                            metrics.map((metric, idx) => (
                                                                <th key={`${index}-${idx}`}>{metric}</th>
                                                            ))
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getFilteredUsers().map((user, index) => {
                                                        const userTotalExpense = data
                                                            .filter(item => item.user_type === user)
                                                            .reduce(
                                                                (sum, item) => sum + parseFloat(item.TotalExpense || 0),
                                                                0
                                                            );

                                                        const workingDays = dates.reduce((count, date) => {
                                                            const entry = data.find(
                                                                item => item.user_type === user && item.Date === date
                                                            );
                                                            return (
                                                                count +
                                                                (entry && metrics.some(metric => entry[metric] > 0) ? 1 : 0)
                                                            );
                                                        }, 0);

                                                        const approvalStatus = calculateApprovalStatus(user, data);
                                                        const statusStyle = {
                                                            Rejected: { color: 'red', fontWeight: 'bold' },
                                                            Approved: { color: 'green', fontWeight: 'bold' },
                                                            ToBeApproved: { color: 'red', fontWeight: 'bold' },
                                                            Pending: { color: 'orange', fontWeight: 'bold' },
                                                        };
                                                        

                                                        return (
                                                            <tr key={index}>
                                                                <td style={{ width: '50px' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        data-index={index}
                                                                        onChange={(e) =>
                                                                            handleUserSelection(user, e.target.checked)
                                                                        }
                                                                    />
                                                                </td>
                                                                <td style={statusStyle[approvalStatus]}>{approvalStatus}</td>
                                                                <td>{remarks[index] || "-"}</td>
                                                                <td>{user}</td>
                                                                {dates.map((date, dateIndex) =>
                                                                    metrics.map((metric, idx) => {
                                                                        const entry = data.find(
                                                                            item =>
                                                                                item.user_type === user &&
                                                                                item.Date === date
                                                                        );
                                                                        const metricValue = entry ? entry[metric] : 0;
                                                                        return (
                                                                            <td key={`${dateIndex}-${idx}`}>
                                                                                {metricValue === undefined ||
                                                                                    metricValue === null
                                                                                    ? 0
                                                                                    : metricValue}
                                                                            </td>
                                                                        );
                                                                    })
                                                                )}
                                                               
                                                                <td>{userTotalExpense.toFixed(2)}</td>
                                                                <td>{workingDays}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>

                                            </table>
                                        </div>

                                        <div className='row mt-3'>
                                            <div className='col-10'></div>
                                            <div className='col-1'>
                                                <button
                                                    className='btn success-btn'
                                                    onClick={handleShowConfirmationApprovalBox}
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                            <div className='col-1'>
                                                <button
                                                    className='btn danger-btn'
                                                    onClick={handleShowConfirmationRejectionBox}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {showConfirmationApprovalBox && (
                                <div className="confirmation-dialog">
                                    <div className="confirmation-content">
                                        <p>Are you sure you want to approve this task?</p>
                                        <button onClick={handleConfirmAction} className='btn btn-success'>Yes</button>
                                        <button onClick={handleCloseConfirmationApprovalBox} className='btn btn-danger'>No</button>
                                    </div>
                                </div>
                            )}


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
            </div>
        </>
    );
};

export default HRView;
