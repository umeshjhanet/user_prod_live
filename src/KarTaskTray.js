import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import { API_URL } from './API';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import SideBar from './Components/SideBar';

const KarTaskTray = () => {
    const [approvalStatus, setApprovalStatus] = useState([]);
    const [selectedCard, setSelectedCard] = useState('pending'); // Default to 'pending'
    const [userRole, setUserRole] = useState('');
    const [locationID, setLocationID] = useState('');
    const [locationName, setLocationName] = useState('');
    const [projects, setProjects] = useState([]);

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

    useEffect(() => {
        // Fetch approval status if locationName or projects change
        const fetchApprovalStatus = () => {
            let url = `${API_URL}/karmerged-report`;
            let params = {};

            // Determine if locationName should be included based on projects and role
            if (locationName && !(projects.length > 0 && userRole === 'PM')) {
                params = { locationName };
            }

            console.log('Fetching approval status with params:', params); // Debug log

            axios.get(url, { params })
                .then(response => setApprovalStatus(response.data))
                .catch(error => {
                    console.error('Error fetching approval status:', error);
                    setApprovalStatus([]);
                });
        };

        if (locationName || projects.length) {
            fetchApprovalStatus();
        }
    }, [locationName, projects, userRole]); 

    const handleCardClick = (cardType) => {
        setSelectedCard(cardType);
    };
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
    
        const order = {
            'PM': ['IsApprovedCBSL'],
            'PO': ['IsApprovedPM', 'IsApprovedCBSL'],
            'HR': ['IsApprovedPO', 'IsApprovedPM', 'IsApprovedCBSL']
        };
    
        // Initialize filteredTasks with approvalStatus and ensure it's an array
        let filteredTasks = Array.isArray(approvalStatus) ? approvalStatus : [];
        
        // Filter tasks based on the role hierarchy
        Object.entries(order).forEach(([key, values]) => {
            if (userRole === key) {
                values.forEach(value => {
                    filteredTasks = filteredTasks.filter(task => task[value] === 1);
                });
            }
        });
        
        console.log("Filtered Tasks", filteredTasks);
    
        // Filter tasks based on the card type
        if (cardType === 'approved') return filteredTasks.filter(task => task[statusKey] === 1);
        if (cardType === 'pending') return filteredTasks.filter(task => task[statusKey] === null || task[statusKey] === 0);
        if (cardType === 'rejected') return filteredTasks.filter(task => task[statusKey] === 2);
    
        return [];
    };
    

   
    const handleApprove = async (index) => {
        const elem = getFilteredTasks(selectedCard)[index];
        const user = JSON.parse(localStorage.getItem('user'));
        const userRoles = user?.user_roles || [];
        const locationCode = user?.locations[0]?.id || '';
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
                UserID: elem.user_type,
                userProfile: elem.userProfile || 0,
                role: roleObj // Ensure this is correct
            };
    
            console.log('Approval request data:', postData); // Debug log
    
            const response = await axios.post(`${API_URL}/karapprove`, postData);
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
            const response = await axios.get(`${API_URL}/karfetch-approved`, {
                params: {
                    LocationCode: elem.locationId,
                    UserName: elem.user_type,
                    InMonth: elem.MonthNumber
                }
            });
    
            const approvedData = response.data;
            console.log('Response received from API:', response);
            console.log('Approved data fetched:', JSON.stringify(approvedData, null, 2));
    
            if (!approvedData || approvedData.length === 0) {
                console.log('No approval data found for user:', elem.user_type);
                return toast.error('You are not eligible to reject.');
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
    
            // Send rejection request
            const postData = {
                LocationCode: elem.locationId,
                UserName: elem.user_type || 'defaultUser',
                InMonth: elem.MonthNumber,
                UserID: elem.user_type || 0,
                userProfile: elem.userProfile || 0,
                role: roleObj
            };
    
            console.log('Post data to be sent:', postData);
    
            // Send rejection request
            const rejectResponse = await axios.post(`${API_URL}/karreject`, postData);
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
    
    const renderTable = () => {
        const filteredTasks = getFilteredTasks(selectedCard);

        const isApprovedCard = selectedCard === 'approved';
        const isPendingCard = selectedCard === 'pending';
        const isRejectedCard = selectedCard === 'rejected';

        return (
            <div className='mb-5' style={{ height: '500px', overflowY: 'auto', backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                <table className='table table-bordered'>
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
                        {filteredTasks.map((elem, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{whiteSpace:'nowrap'}}>{elem.locationName}</td>
                                <td style={{whiteSpace:'nowrap'}}>{elem.user_type}</td>
                                <td style={{whiteSpace:'nowrap'}}>{elem.MonthYear}</td>
                                <td>{elem.Scanned}</td>
                                <td>{elem.QC}</td>
                                <td>{elem.Flagging}</td>
                                <td>{elem.Indexing}</td>
                                <td>{elem.CBSL_QA}</td>
                                <td>{elem.Client_QC}</td>
                                <td>{elem.DistinctDateCount}</td>
                                <td style={{whiteSpace:'nowrap'}}>
                                {(isApprovedCard) && (
                                        <div className='row mt-2'>
                                             <button
                                                    className='btn btn-danger'
                                                    onClick={() => handleReject(index)}
                                                    disabled={isRejectedCard}
                                                    style={{width:'59px',padding:'5px 0px',fontSize:'12px',marginLeft:'12px'}}
                                                >
                                                    Reject
                                                </button>
                                        </div>
                                    )}
                                    {(isRejectedCard) && (
                                        <div className='row mt-2'>
                                             <button
                                                    className='btn btn-success'
                                                    onClick={() => handleApprove(index)}
                                                    disabled={isApprovedCard}
                                                    style={{width:'59px',padding:'5px 0px',fontSize:'12px',marginLeft:'11px'}}
                                                >
                                                    Approve
                                                </button>
                                        </div>
                                    )}
                                    {(isPendingCard) && (
                                    <div className='row mt-2 ms-1'>
                                        {/* <div className='col-6'> */}
                                                <button
                                                    className='btn btn-success'
                                                    onClick={() => handleApprove(index)}
                                                    style={{width: '45px',
                                                        fontSize: '11px',
                                                        padding: '5px 0px'}}
                                                >
                                                    Approve
                                                </button>
                                        {/* </div> */}
                                        {/* <div className='col-6'> */}
                                                <button
                                                    className='btn btn-danger mt-1'
                                                    onClick={() => handleReject(index)}
                                                    style={{width: '45px',
                                                        fontSize: '11px',
                                                        padding: '5px 0px'}}
                                                >
                                                    Reject
                                                </button>
                                        {/* </div> */}
                                    </div>
                                     )}
                                </td>
                                <td style={{whiteSpace:'nowrap'}}>{elem.Remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2'><SideBar/></div>
                    <div className='col-10'>

                   
                    <div className="row mt-5" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                    <h6 className="ms-2" style={{ color: "white" }}>
                        Task Tray
                    </h6>
                </div>
                <div className="row mt-4">
                    <div className="col-4">
                        <div
                            className={`approved-card ${selectedCard === 'approved' ? 'active-card' : ''}`}
                            onClick={() => handleCardClick('approved')}
                            style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'approved' ? 'lightgray' : 'white' }}
                        >
                            <h5>Approved Tasks</h5>
                            <h6>Count: {getCount('approved')}</h6>
                        </div>
                    </div>
                    <div className="col-4">
                        <div
                            className={`pending-card ${selectedCard === 'pending' ? 'active-card' : ''}`}
                            onClick={() => handleCardClick('pending')}
                            style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'pending' ? 'lightgray' : 'white' }}
                        >
                            <h5>Pending Tasks</h5>
                            <h6>Count: {getCount('pending')}</h6>
                        </div>
                    </div>
                    <div className="col-4">
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
                <div className='mt-4'>
                {renderTable()}
                </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default KarTaskTray;





