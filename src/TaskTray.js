import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import { API_URL } from './API';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';

const TaskTray = () => {
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
            let url = `${API_URL}/merged-report`;
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
                return [];
        }
        
        const order = {
            'PM': ['IsApprovedCBSL'],
            'PO': ['IsApprovedPM', 'IsApprovedCBSL'],
            'HR': ['IsApprovedPO', 'IsApprovedPM', 'IsApprovedCBSL']
        };

        let filteredTasks = approvalStatus;

        
        Object.entries(order).forEach(([key, values]) => {
            
            values.forEach(value => {
                // Perform any operations with the individual values
                if(userRole === key) filteredTasks = filteredTasks.filter(task => task[value] === 1);
            });
        });
        
        console.log("Filtered Tasks",filteredTasks);
        
        if (cardType === 'approved') return filteredTasks.filter(task => task[statusKey] === 1);
        if (cardType === 'pending') return filteredTasks.filter(task => task[statusKey] === null || task[statusKey] === 0);
        // if (cardType === 'pending') {
        //     if (userRole === 'CBSL Site User') {
        //         return filteredTasks.filter(task => task[statusKey] === null);  
        //     } else {
        //         return filteredTasks.filter(task => task[statusKey] === 0);  
        //     }
        // } 
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
    
        try {
            const postData = {
                LocationCode: elem.locationId,
                UserName: elem.user_type,
                InMonth: elem.MonthNumber,
                UserID: elem.user_type,
                userProfile: elem.userProfile || 0,
                role: roleObj // Ensure this is correct
            };
    
            console.log('Rejection request data:', postData); // Debug log
    
            const response = await axios.post(`${API_URL}/reject`, postData);
            console.log('Rejection response:', response.data);
    
            // Update state
            setApprovalStatus(prevStatus => {
                const updatedStatus = [...prevStatus];
                const taskIndex = updatedStatus.findIndex(task => task.user_type === elem.user_type && task.MonthNumber === elem.MonthNumber);
                if (taskIndex !== -1) {
                    updatedStatus[taskIndex] = {
                        ...updatedStatus[taskIndex],
                        [roleObj]: 0
                    };
                }
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((elem, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationName}</td>
                                <td>{elem.user_type}</td>
                                <td>{elem.MonthYear}</td>
                                <td>{elem.Scanned}</td>
                                <td>{elem.QC}</td>
                                <td>{elem.Flagging}</td>
                                <td>{elem.Indexing}</td>
                                <td>{elem.CBSL_QA}</td>
                                <td>{elem.Client_QC}</td>
                                <td>
                                    <div className='row mt-2'>
                                        <div className='col-6'>
                                            {(isRejectedCard || isPendingCard) && (
                                                <button
                                                    className='btn btn-success'
                                                    onClick={() => handleApprove(index)}
                                                    disabled={isApprovedCard}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </div>
                                        <div className='col-6'>
                                            {(isApprovedCard || isPendingCard) && (
                                                <button
                                                    className='btn btn-danger'
                                                    onClick={() => handleReject(index)}
                                                    disabled={isRejectedCard}
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </td>
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
            <div className='container'>
                <div className="row mt-5" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                    <h6 className="ms-2" style={{ color: "white" }}>
                        <Link to='/home' style={{ color: 'white' }}>
                            <FaHome size={25} />
                        </Link> / Task Tray
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
                            <p>Count: {getCount('approved')}</p>
                        </div>
                    </div>
                    <div className="col-4">
                        <div
                            className={`pending-card ${selectedCard === 'pending' ? 'active-card' : ''}`}
                            onClick={() => handleCardClick('pending')}
                            style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'pending' ? 'lightgray' : 'white' }}
                        >
                            <h5>Pending Tasks</h5>
                            <p>Count: {getCount('pending')}</p>
                        </div>
                    </div>
                    <div className="col-4">
                        <div
                            className={`rejected-card ${selectedCard === 'rejected' ? 'active-card' : ''}`}
                            onClick={() => handleCardClick('rejected')}
                            style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: selectedCard === 'rejected' ? 'lightgray' : 'white' }}
                        >
                            <h5>Rejected Tasks</h5>
                            <p>Count: {getCount('rejected')}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                {renderTable()}
                </div>
            </div>
        </>
    );
};

export default TaskTray;

