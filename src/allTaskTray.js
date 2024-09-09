
// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Header from './Components/Header';
// // import SideBar from './Components/SideBar';
// // import { API_URL } from './API';

// // const AllTaskTray = () => {
// //   const [projects, setProjects] = useState([]);
// //   const [locations, setLocations] = useState([]);
// //   const [selectedProject, setSelectedProject] = useState('');
// //   const [selectedLocation, setSelectedLocation] = useState('');
// //   const [month, setMonth] = useState('');  // Replaced startDate and endDate with month
// //   const [data, setData] = useState({});
// //   const [datesOfMonth, setDatesOfMonth] = useState([]);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchProjects = async () => {
// //       try {
// //         const response = await axios.get(`${API_URL}/getproject`);
// //         setProjects(response.data);
// //       } catch (error) {
// //         console.error('Error fetching projects:', error);
// //       }
// //     };

// //     const fetchLocations = async () => {
// //       try {
// //         const response = await axios.get(`${API_URL}/locations`);
// //         setLocations(response.data);
// //       } catch (error) {
// //         console.error('Error fetching locations:', error);
// //       }
// //     };

// //     fetchProjects();
// //     fetchLocations();
// //   }, []);

// //   const handleProjectChange = (e) => setSelectedProject(e.target.value);
// //   const handleLocationChange = (e) => setSelectedLocation(e.target.value);
// //   const handleMonthChange = (e) => setMonth(e.target.value);  // Handle month input

// //   const handleSubmit = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/api/userdetailedreportdatewise`, {
// //         params: {
// //           locationName: selectedLocation,
// //           month,  // Send the month parameter
// //           project: selectedProject,
// //         },
// //       });

// //       const fetchedData = response.data;
// //       const transformedData = {};
// //       const dates = new Set();

// //       fetchedData.forEach((item) => {
// //         const { user_type, Date, TotalExpense } = item;
// //         if (!transformedData[user_type]) {
// //           transformedData[user_type] = {};
// //         }
// //         transformedData[user_type][Date] = TotalExpense.toFixed(2);
// //         dates.add(Date);
// //       });

// //       const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));

// //       setData(transformedData);
// //       setDatesOfMonth(sortedDates);
// //       setError(null);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //       setError('An error occurred while fetching data.');
// //     }
// //   };

// //   const handleExport = async (format) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/downloadcsv`, {
// //         params: {
// //           locationName: selectedLocation,
// //           month,  // Send the month parameter for export as well
// //           project: selectedProject,
// //         },
// //         responseType: 'blob', // Handle binary data
// //       });

// //       const blob = new Blob([response.data], { type: response.headers['content-type'] });
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.setAttribute('download', `report.csv`);
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
// //     } catch (error) {
// //       console.error(`Error exporting as ${format}:`, error);
// //       setError(`An error occurred while exporting as ${format}.`);
// //     }
// //   };

// //   return (
// //     <>
// //       <Header />
// //       <div className='container-fluid'>
// //         <div className='row'>
// //           <div className='col-2'>
// //             <SideBar />
// //           </div>
// //           <div className='col-10'>
// //             <div className='row mt-2 search-report-card' style={{ overflow: 'auto' }}>
// //               <div className='col-3'>
// //                 <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
// //                   <option value=''>Select Project</option>
// //                   {projects.map((project) => (
// //                     <option key={project.id} value={project.id}>
// //                       {project.ProjectName}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div className='col-3'>
// //                 <select className='form-select' value={selectedLocation} onChange={handleLocationChange}>
// //                   <option value=''>Select Location</option>
// //                   {locations.map((location) => (
// //                     <option key={location.LocationName} value={location.LocationName}>
// //                       {location.LocationName}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div className='col-3'>
// //                 <input type='month' className='form-control' value={month} onChange={handleMonthChange} />  {/* Month input */}
// //               </div>
// //               <div className='col-3'>
// //                 <button className='btn success-btn' onClick={handleSubmit}>Submit</button>
// //               </div>
// //               <div className='col-2 mt-3'>
// //                 <button className='btn btn-primary me-2' onClick={() => handleExport('csv')}>Export as CSV</button>
// //               </div>
// //               {Object.keys(data).length > 0 && (
// //               <div className='mt-3'>
// //                 <table className='table table-bordered'>
// //                   <thead>
// //                     <tr>
// //                       <th>User</th>
// //                       <th>Status</th>
// //                       {datesOfMonth.map((date) => (
// //                         <th key={date}>{date}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {Object.keys(data).map((user) => (
// //                       <tr key={user}>
// //                         <td>{user}</td>
// //                         <td>{data.IsApprovedHR}</td>
// //                         {datesOfMonth.map((date) => (
// //                           <td key={date}>{data[user][date] || 0}</td>
// //                         ))}
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //             </div>
           
// //             {error && <div className='alert alert-danger mt-3'>{error}</div>}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default AllTaskTray;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Components/Header';
// import SideBar from './Components/SideBar';
// import { API_URL } from './API';

// const AllTaskTray = () => {
//   const [projects, setProjects] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [selectedProject, setSelectedProject] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [month, setMonth] = useState('');
//   const [data, setData] = useState({});
//   const [datesOfMonth, setDatesOfMonth] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/getproject`);
//         setProjects(response.data);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };

//     const fetchLocations = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/locations`);
//         setLocations(response.data);
//       } catch (error) {
//         console.error('Error fetching locations:', error);
//       }
//     };

//     fetchProjects();
//     fetchLocations();
//   }, []);

//   const handleProjectChange = (e) => setSelectedProject(e.target.value);
//   const handleLocationChange = (e) => setSelectedLocation(e.target.value);
//   const handleMonthChange = (e) => setMonth(e.target.value);

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/userdetailedreportdatewise`, {
//         params: {
//           locationName: selectedLocation,
//           month,
//           project: selectedProject,
//         },
//       });

//       const fetchedData = response.data;
//       const transformedData = {};
//       const dates = new Set();

//       fetchedData.forEach((item) => {
//         const { user_type, Date, TotalExpense, IsApprovedHR } = item;
//         if (!transformedData[user_type]) {
//           transformedData[user_type] = {};
//         }
//         transformedData[user_type][Date] = {
//           TotalExpense: TotalExpense.toFixed(2),
//           status: IsApprovedHR,  // Add status to the data
//         };
//         dates.add(Date);
//       });

//       const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));

//       setData(transformedData);
//       setDatesOfMonth(sortedDates);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('An error occurred while fetching data.');
//     }
//   };

//   const handleExport = async (format) => {
//     try {
//       const response = await axios.get(`${API_URL}/downloadcsv`, {
//         params: {
//           locationName: selectedLocation,
//           month,
//           project: selectedProject,
//         },
//         responseType: 'blob',
//       });

//       const blob = new Blob([response.data], { type: response.headers['content-type'] });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `report.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error(`Error exporting as ${format}:`, error);
//       setError(`An error occurred while exporting as ${format}.`);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className='container-fluid'>
//         <div className='row'>
//           <div className='col-2'>
//             <SideBar />
//           </div>
//           <div className='col-10'>
//             <div className='row mt-2 search-report-card' style={{ overflow: 'auto' }}>
//               <div className='col-3'>
//                 <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
//                   <option value=''>Select Project</option>
//                   {projects.map((project) => (
//                     <option key={project.id} value={project.id}>
//                       {project.ProjectName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className='col-3'>
//                 <select className='form-select' value={selectedLocation} onChange={handleLocationChange}>
//                   <option value=''>Select Location</option>
//                   {locations.map((location) => (
//                     <option key={location.LocationName} value={location.LocationName}>
//                       {location.LocationName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className='col-3'>
//                 <input type='month' className='form-control' value={month} onChange={handleMonthChange} />
//               </div>
//               <div className='col-3'>
//                 <button className='btn success-btn' onClick={handleSubmit}>Submit</button>
//               </div>
//               <div className='col-2 mt-3'>
//                 <button className='btn btn-primary me-2' onClick={() => handleExport('csv')}>Export as CSV</button>
//               </div>
//               {Object.keys(data).length > 0 && (
//                 <>
//                 <div className='mt-3'>
//                   <table className='table table-bordered'>
//                     <thead>
//                       <tr>
//                         <th>Options</th>
//                         <th>User</th>
//                         <th>Status</th>
//                         {datesOfMonth.map((date) => (
//                           <th key={date}>{date}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {Object.keys(data).map((user) => (
//                         <tr key={user}>
//                             <td style={{width:'50px'}}><input type='checkbox' /></td>
//                           <td>{user}</td>
//                           <td>
//                             {Object.values(data[user]).some((entry) => entry.status === 0)
//                               ? 'Pending'
//                               : Object.values(data[user]).some((entry) => entry.status === 1)
//                               ? 'Approved'
//                               : Object.values(data[user]).some((entry) => entry.status === 2)
//                               ? 'Rejected'
//                               : 'Unknown'}
//                           </td>
//                           {datesOfMonth.map((date) => (
//                             <td key={date}>
//                               {data[user][date] ? data[user][date].TotalExpense : 0}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className='row'>
//                 <div className='col-10'></div>
//                 <div className='col-1'>
//                 <button className='btn approve-btn'>Approve</button>
//                 </div>
//                 <div className='col-1'>
//                     <button className='btn reject-btn'>Reject</button>
//                 </div>
//               </div>
//               </>
//               )}
              
//             </div>
//             {error && <div className='alert alert-danger mt-3'>{error}</div>}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AllTaskTray;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const AllTaskTray = () => {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [month, setMonth] = useState('');
  const [data, setData] = useState({});
  const [datesOfMonth, setDatesOfMonth] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/getproject`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/locations`);
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchProjects();
    fetchLocations();
  }, []);

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

  const handleApprove = async () => {
    if (selectedUsers.length === 0) {
      return toast.error('Please select at least one user to approve.');
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userRoles = user?.user_roles || [];

      for (const userId of selectedUsers) {
        const userData = Object.keys(data).find((key) => data[key].some((entry) => entry.id === userId));

        if (!userData) {
          continue;
        }

        const roleObj = userRoles.find(role => ['CBSL Site User', 'PM', 'PO', 'HR'].includes(role));

        if (!roleObj) {
          return toast.error('Role not found.');
        }

        const postData = {
          LocationCode: data[userData][0]?.locationId,
          UserName: userData,
          InMonth: month,
          UserID: userId,
          role: roleObj
        };

        await axios.post(`${API_URL}/approve`, postData);
        toast.success('Approved successfully');
      }

    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error('Error processing approval.');
    }
  };

  const canReject = (role, status) => {
    if (!status) return false;
    switch (role) {
      case 'CBSL Site User':
        return !status.IsApprovedPM && !status.IsApprovedPO && !status.IsApprovedHR;
      case 'PM':
        return !status.IsApprovedPO && !status.IsApprovedHR;
      case 'PO':
        return !status.IsApprovedHR;
      case 'HR':
        return true;
      default:
        return false;
    }
  };

  const handleReject = async () => {
    if (selectedUsers.length === 0) {
      return toast.error('Please select at least one user to reject.');
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userRoles = user?.user_roles || [];

      for (const userId of selectedUsers) {
        const userData = Object.keys(data).find((key) => data[key].some((entry) => entry.id === userId));

        if (!userData) {
          continue;
        }

        const roleObj = userRoles.find(role => ['CBSL Site User', 'PM', 'PO', 'HR'].includes(role));

        if (!roleObj) {
          return toast.error('Role not found.');
        }

        const response = await axios.get(`${API_URL}/fetch-approved`, {
          params: {
            LocationCode: data[userData][0]?.locationId,
            UserName: userData,
            InMonth: month
          }
        });

        const approvedData = response.data;

        if (!approvedData || approvedData.length === 0) {
          return toast.error('You are not eligible to reject.');
        }

        const userStatus = approvedData[0];

        if (!userStatus) {
          return toast.error('Error: User status data is missing.');
        }

        const canUserReject = canReject(roleObj, userStatus);

        if (!canUserReject) {
          return toast.error('You are not eligible to reject based on the role hierarchy.');
        }

        const postData = {
          LocationCode: data[userData][0]?.locationId,
          UserName: userData,
          InMonth: month,
          UserID: userId,
          role: roleObj
        };

        await axios.post(`${API_URL}/reject`, postData);
        toast.success('Rejected successfully');
      }

      handleSubmit(); // Refresh data after rejection
    } catch (error) {
      console.error('Error processing rejection:', error);
      toast.error('Error processing rejection.');
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

  return (
    <>
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
              <div className='col-3'>
                <input type='month' className='form-control' value={month} onChange={handleMonthChange} />
              </div>
              <div className='col-3'>
                <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                <button className='btn btn-primary' onClick={() => handleExport('excel')}>Export as Excel</button>
              </div>
              <div className='col-12 mt-3'>
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
                        {Object.keys(data).map((user, index) => (
                          <tr key={user}>
                            <td style={{ width: '50px' }}>
                              <input
                                type='checkbox'
                                data-index={index}
                                onChange={(e) => handleUserSelection(user, e.target.checked)}
                              />
                            </td>
                            <td>{user}</td>
                            <td>
                              {Array.isArray(data[user]) && data[user].some((entry) => entry.status === 0)
                                ? 'Pending'
                                : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 1)
                                ? 'Approved'
                                : Array.isArray(data[user]) && data[user].some((entry) => entry.status === 2)
                                ? 'Rejected'
                                : 'Unknown'}
                            </td>
                            {datesOfMonth.map((date) => (
                              <td key={date}>
                                {Array.isArray(data[user]) && data[user].find((entry) => entry.Date === date)
                                  ? data[user].find((entry) => entry.Date === date).TotalExpense
                                  : 0}
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
                    <button className='btn approve-btn' onClick={handleApprove}>Approve</button>
                  </div>
                  <div className='col-1'>
                    <button className='btn reject-btn' onClick={handleReject}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTaskTray;


