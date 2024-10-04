import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import { API_URL } from './API';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import SideBar from './Components/SideBar';

const UPDCTaskTray = () => {
    const [approvalStatus, setApprovalStatus] = useState([]);
    const [selectedCard, setSelectedCard] = useState('pending'); // Default to 'pending'
    const [userRole, setUserRole] = useState('');
    const [locationID, setLocationID] = useState('');
    const [month, setMonth] = useState('');
    const [locationName, setLocationName] = useState('');
    const [projects, setProjects] = useState([]);
    const [showConfirmationApprovalBox, setShowConfirmationApprovalBox] = useState(false);
    const [showConfirmationRejectionBox, setShowConfirmationRejectionBox] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const [currentIndex, setCurrentIndex] = useState(null);

    useEffect(() => {
        // Fetch user info including role and location code
        const fetchUserInfo = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setUserRole(user.user_roles[0] || '');
                setLocationID(user.locations[0]?.id || '');
                setLocationName(user.locations[0]?.name || '');
                setProjects(user.projects || []);
            }
        };

        fetchUserInfo();
    }, []); // Empty dependency array to run only once on mount
    const fetchApprovalStatus = () => {
        let url = `${API_URL}/updcmerged-report`;
        let params = { month }; // Always pass the selected month

        // Conditionally include locationName and append "District Court" if applicable
        if (locationName && !(projects.length > 0 && userRole === 'PM')) {
            params.locationName = `${locationName} District Court`; // Add locationName to params if needed
        }

        console.log('Fetching approval status with params:', params); // Debug log for checking the request

        // Make the GET request to the API with the query parameters
        axios.get(url, { params })
            .then(response => setApprovalStatus(response.data)) // Update the approval status state with the response
            .catch(error => {
                console.error('Error fetching approval status:', error);
                setApprovalStatus([]); // Reset approval status on error
            });
    };

  
    const handleCardClick = (cardType) => {
        setSelectedCard(cardType);
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
            handleApprove(currentIndex);
        } else if (actionType === 'reject') {
            handleReject(currentIndex);
        }
        setShowConfirmationApprovalBox(false);
        setShowConfirmationRejectionBox(false);
    };
    const handleMonthChange = (e) => setMonth(e.target.value);
    const getFilteredTasks = (cardType) => {
        let statusKey = '';
        
        // Determine the status key based on the user role
        switch (userRole) {
            case 'CBSL Site User':
                statusKey = 'IsApprovedCBSL';
                break;
            case 'PM':
                statusKey = 'IsApprovedPM';
                break;
            case 'PO':
                statusKey = 'IsApprovedPO';
                break;
            case 'HR':
                statusKey = 'IsApprovedHR';
                break;
            default:
                return []; // Return an empty array if the user role is invalid
        }
    
        // Initialize filteredTasks with approvalStatus (make sure it's an array)
        let filteredTasks = Array.isArray(approvalStatus) ? approvalStatus : [];
    
        // Hierarchy for approval (higher roles need lower roles' approval first)
        const order = {
            'PM': ['IsApprovedCBSL'],                // PM needs CBSL approval first
            'PO': ['IsApprovedPM', 'IsApprovedCBSL'], // PO needs both PM and CBSL approval
            'HR': ['IsApprovedPO', 'IsApprovedPM', 'IsApprovedCBSL'] // HR needs PO, PM, and CBSL approval
        };
    
        // Apply hierarchical filtering based on the role
        if (userRole in order) {
            order[userRole].forEach((approvalKey) => {
                filteredTasks = filteredTasks.filter(task => task[approvalKey] === 1);
            });
        }
    
        // Filter based on card type (approved, pending, rejected, or all)
        if (cardType === 'all') {
            return filteredTasks.filter(task =>
                task[statusKey] === 0 || task[statusKey] === 1 || task[statusKey] === 2
            );
        }
        if (cardType === 'approved') {
            return filteredTasks.filter(task => task[statusKey] === 1);
        }
        if (cardType === 'pending') {
            return filteredTasks.filter(task => task[statusKey] === null || task[statusKey] === 0);
        }
        if (cardType === 'rejected') {
            return filteredTasks.filter(task => task[statusKey] === 2);
        }
    
        return [];
    };
    
    const handleApprove = async (index) => {
        const elem = getFilteredTasks(selectedCard)[index];
        const user = JSON.parse(localStorage.getItem('user'));
        const userRoles = user?.user_roles || [];
        const locationCode = user?.locations[0]?.id || '';
        const projectId = user?.projects[0] || '';
        const userID = user?.user_id || 0;
    
        // Determine role
        const roleObj = userRoles.find(role => ['CBSL Site User', 'PM', 'PO', 'HR'].includes(role));
        if (!roleObj) {
            return toast.error('Role not found.');
        }
    
        try {
            const postData = {
                LocationCode: elem.locationId,
                UserName: elem.user_type,
                InMonth: elem.MonthNumber,
                UserID: elem.user_id|| 0,
                userProfile: elem.userProfile || 0,
                role: roleObj,
                project: projectId 
            };
    
            console.log('Approval request data:', postData); // Debug log
    
            const response = await axios.post(`${API_URL}/approve`, postData);
            console.log('Approval response:', response.data);
    
            // Update state
            setApprovalStatus(prevStatus => {
                const updatedStatus = [...prevStatus];
                const taskIndex = updatedStatus.findIndex(task => task.user_type === elem.user_type && task.MonthNumber === elem.MonthNumber);
                if (taskIndex !== -1) {
                    updatedStatus[taskIndex] = {
                        ...updatedStatus[taskIndex],
                        [roleObj]: 1
                    };
                }
                return updatedStatus;
            });
            toast.success('Approved successfully');
        } catch (error) {
            console.error('Error processing approval:', error);
            toast.error('Error processing approval.');
        }
    };
    const roleHierarchy = ['CBSL Site User', 'PM', 'PO', 'HR'];
    const canReject = (role, status) => {
        if (!status) return false;
        switch (role) {
          case 'CBSL Site User':
            return !status.IsApprovedPM && !status.IsApprovedPO && !status.IsApprovedHR; // CBSL Site User can reject only if no higher role has approved
          case 'PM':
            return !status.IsApprovedPO && !status.IsApprovedHR; // PM can reject only if PO and HR have not approved
          case 'PO':
            return !status.IsApprovedHR; // PO can reject only if HR has not approved
          case 'HR':
            return true; // HR can always reject
          default:
            return false;
        }
      };
      const handleReject = async (index) => {
        const elem = getFilteredTasks(selectedCard)[index];
        const user = JSON.parse(localStorage.getItem('user'));
        const userRoles = user?.user_roles || [];
        const projectId = user?.projects[0] || '';
        const locationCode = user?.locations[0]?.id || '';
        const userID = user?.user_id || 0;
    
        // Determine role
        const roleObj = userRoles.find(role => ['CBSL Site User', 'PM', 'PO', 'HR'].includes(role));
        if (!roleObj) {
            return toast.error('Role not found.');
        }
    
        console.log('Selected Role:', roleObj);
    
        try {
            // Fetch the approval status
            const response = await axios.get(`${API_URL}/fetch-approved`, {
                params: {
                    LocationCode: elem.locationId,
                    UserName: elem.user_type,
                    InMonth: elem.MonthNumber,
                    project: projectId
                }
            });
    
            const approvedData = response.data;
            console.log('Response received from API:', response);
            console.log('Approved data fetched:', JSON.stringify(approvedData, null, 2));
    
            if (!approvedData || approvedData.length === 0) {
                // No approval data found, directly send rejection request
                console.log('No approval data found for user:', elem.user_type);
                const postData = {
                    LocationCode: elem.locationId,
                    UserName: elem.user_type || 'defaultUser',
                    InMonth: elem.MonthNumber,
                    UserID: elem.user_id || 0,
                    userProfile: elem.userProfile || 0,
                    role: roleObj,
                    project: projectId
                };
    
                console.log('No data found. Sending direct rejection:', postData);
    
                const rejectResponse = await axios.post(`${API_URL}/reject`, postData);
                console.log('Reject response:', rejectResponse.data);
    
                setApprovalStatus(prevStatus => {
                    const updatedStatus = {
                        ...prevStatus,
                        [elem.user_type]: {
                            ...prevStatus[elem.user_type],
                            [roleObj]: 2 // Set rejection status
                        }
                    };
                    console.log('Updated rejection status:', updatedStatus);
                    return updatedStatus;
                });
    
                return toast.success('Rejected successfully, even without approval data.');
            }
    
            const userStatus = approvedData[0];
            console.log('Current approval status:', userStatus);
    
            if (!userStatus) {
                return toast.error('Error: User status data is missing.');
            }
    
            // Check if rejection is allowed based on the role hierarchy
            const canUserReject = canReject(roleObj, userStatus);
    
            if (!canUserReject) {
                const approvedRoles = roleHierarchy.slice(roleHierarchy.indexOf(roleObj) + 1).filter(role => {
                    switch (role) {
                        case 'PM':
                            return userStatus.IsApprovedPM === 1;
                        case 'PO':
                            return userStatus.IsApprovedPO === 1;
                        case 'HR':
                            return userStatus.IsApprovedHR === 1;
                        default:
                            return false;
                    }
                });
                const firstApprovedRole = approvedRoles[0];
                return toast.error(`You cannot reject this task because ${firstApprovedRole} has already approved the task.`);
            }
    
            // Send rejection request with the available data
            const postData = {
                LocationCode: elem.locationId,
                UserName: elem.user_type || 'defaultUser',
                InMonth: elem.MonthNumber,
                UserID: elem.user_id || 0,
                userProfile: elem.userProfile || 0,
                role: roleObj,
                project: projectId
            };
    
            console.log('Post data to be sent:', postData);
    
            const rejectResponse = await axios.post(`${API_URL}/reject`, postData);
            console.log('Reject response:', rejectResponse.data);
    
            setApprovalStatus(prevStatus => {
                const updatedStatus = {
                    ...prevStatus,
                    [elem.user_type]: {
                        ...prevStatus[elem.user_type],
                        [roleObj]: 2 // Set rejection status
                    }
                };
                console.log('Updated rejection status:', updatedStatus);
                return updatedStatus;
            });
    
            toast.success('Rejected successfully');
        } catch (error) {
            console.error('Error processing rejection:', error);
            toast.error('Error processing rejection.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form behavior
        fetchApprovalStatus(); // Fetch approval status when the form is submitted
    };
    
    const renderTable = () => {
        const filteredTasks = getFilteredTasks(selectedCard);
        const isApprovedCard = selectedCard === 'approved';
        const isPendingCard = selectedCard === 'pending';
        const isRejectedCard = selectedCard === 'rejected';
    
        // Reusable function for rendering confirmation boxes
        const renderConfirmationBox = (isVisible, message, onConfirm, onClose) => (
            isVisible && (
                <div className="confirmation-dialog">
                    <div className="confirmation-content">
                        <p>{message}</p>
                        <button onClick={onConfirm} className="btn btn-success">Yes</button>
                        <button onClick={onClose} className="btn btn-danger">No</button>
                    </div>
                </div>
            )
        );
    
        return (
            <div className="mb-5" style={{ height: '500px', overflowY: 'auto', backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Location Name</th>
                            <th>User Name</th>
                            <th>Month</th>
                            <th>Scanned</th>
                            <th>QC</th>
                            <th>Flagging</th>
                            <th>Indexing</th>
                            <th>CBSL QA</th>
                            <th>Client QC</th>
                            <th>Working Days</th>
                            <th>Actions</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task, index) => {
                            const isDisabledApprovePM = userRole === 'PM' && task.IsApprovedCBSL !== 1;
                            const isDisabledApprovePO = userRole === 'PO' && (task.IsApprovedPM !== 1 || task.IsApprovedCBSL !== 1);
    
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{task.locationName}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{task.user_type}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{task.MonthYear}</td>
                                    <td>{task.Scanned}</td>
                                    <td>{task.QC}</td>
                                    <td>{task.Flagging}</td>
                                    <td>{task.Indexing}</td>
                                    <td>{task.CBSL_QA}</td>
                                    <td>{task.Client_QC}</td>
                                    <td>{task.DistinctDateCount}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {/* Rejected Tasks */}
                                        {isRejectedCard && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleShowConfirmationApprovalBox(index)}
                                                disabled={userRole === 'PM' ? isDisabledApprovePM : isDisabledApprovePO}
                                                style={{ width: '59px', padding: '5px 0px', fontSize: '12px', marginLeft: '11px' }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {/* Approved Tasks */}
                                        {isApprovedCard && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleShowConfirmationRejectionBox(index)}
                                                style={{ width: '59px', padding: '5px 0px', fontSize: '12px', marginLeft: '11px' }}
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {/* Pending Tasks */}
                                        {isPendingCard && (
                                            <div className="row mt-2 ms-1">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleShowConfirmationApprovalBox(index)}
                                                    style={{ width: '45px', fontSize: '11px', padding: '5px 0px' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger mt-1"
                                                    onClick={() => handleShowConfirmationRejectionBox(index)}
                                                    style={{ width: '45px', fontSize: '11px', padding: '5px 0px' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{task.Remarks}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
    
                {/* Render confirmation dialogs */}
                {renderConfirmationBox(
                    showConfirmationApprovalBox,
                    "Are you sure you want to approve this task?",
                    handleConfirmAction,
                    handleCloseConfirmationApprovalBox
                )}
                {renderConfirmationBox(
                    showConfirmationRejectionBox,
                    "Are you sure you want to reject this task?",
                    handleConfirmAction,
                    handleCloseConfirmationRejectionBox
                )}
            </div>
        );
    };
    

    const getCount = (cardType) => {
        return getFilteredTasks(cardType).length;
    };

    return (
        <>
            <ToastContainer />
            <Header />
            <div className='container-fluid mt-5'>
                <div className='row'>
                    <div className='col-2'><SideBar/></div>
                    <div className='col-10'>

                   
                    <div className="row mt-5" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                    <h6 className="" style={{ color: "white" }}>
                        Task Tray
                    </h6>
                </div>
                <div className="row mt-4">
                            <div className='col-3'>
                            <div
                                    className={`all-card ${selectedCard === 'all' ? 'active-card' : ''}`}
                                    onClick={() => handleCardClick('all')}
                                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'all' ? 'lightgray' : 'white' }}
                                >
                                    <h5>All Tasks</h5>
                                    <h6>Count: {getCount('all')}</h6>
                                </div>
                            </div>
                            <div className="col-3">
                                <div
                                    className={`approved-card ${selectedCard === 'approved' ? 'active-card' : ''}`}
                                    onClick={() => handleCardClick('approved')}
                                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'approved' ? 'lightgray' : 'white' }}
                                >
                                    <h5>Approved Tasks</h5>
                                    <h6>Count: {getCount('approved')}</h6>
                                </div>
                            </div>
                            <div className="col-3">
                                <div
                                    className={`pending-card ${selectedCard === 'pending' ? 'active-card' : ''}`}
                                    onClick={() => handleCardClick('pending')}
                                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'pending' ? 'lightgray' : 'white' }}
                                >
                                    <h5>Pending Tasks</h5>
                                    <h6>Count: {getCount('pending')}</h6>
                                </div>
                            </div>
                            <div className="col-3">
                                <div
                                    className={`rejected-card ${selectedCard === 'rejected' ? 'active-card' : ''}`}
                                    onClick={() => handleCardClick('rejected')}
                                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'rejected' ? 'lightgray' : 'white' }}
                                >
                                    <h5>Rejected Tasks</h5>
                                    <h6>Count: {getCount('rejected')}</h6>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-3'>
                                <label>Select Month:</label>
                            <input type='month' className='form-control' value={month} onChange={handleMonthChange} style={{height:'38px'}}/>
                            </div>
                            <div className='col-3'>
                                <input type='submit' className='mt-4' onClick={handleSubmit} />
                            </div>
                         
                        </div>
                <div className='mt-4'>
                {renderTable()}
                </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default UPDCTaskTray;





