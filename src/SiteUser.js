import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdCloseCircle } from "react-icons/io";
import axios from 'axios';
import { API_URL } from './API';
import { FiDownload } from 'react-icons/fi';
import Header from './Components/Header';
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal, Button, Form } from 'react-bootstrap'; // Import Modal and Form
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SideBar from './Components/SideBar';

const SiteUser = ({ onClose }) => {
  const [excelSelected, setExcelSelected] = useState(true);
  const [manualSelected, setManualSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [location, setLocation] = useState([]);
  const [project, setProject] = useState([]);
  const [locationDropdown, setLocationDropdown] = useState();
  const [projectDropdown, setProjectDropdown] = useState();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [showProject, setShowProject] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [downloadExcel, setDownloadExcel] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newFormData, setNewFormData] = useState({
    BiomatrixNo: '',
    EmpReferenceNo: '',
    UserName: '',
    FatherName: '',
    DOJ: '',
    FixedSalary: '',
    Project: '',
    locationname: '',
    HRcumAdminName: '',
    ProjectManager: '',
    ProjectOwner: '',
    AdhaarNo: '',
    IsActive: '',
    LastUpdateDate: '',
  });

  const [editingEmployee, setEditingEmployee] = useState(null); // State for the employee being edited
  const [showModal, setShowModal] = useState(false);
  const [employeeDetailedCsv, setEmployeeDetailedCsv] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);// State to control modal visibility

  const locationDropdownRef = useRef(null);
  const projectDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setLocationDropdown(false);
      }
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target)
      ) {
        setProjectDropdown(false);
      }
    };


    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  const handleExport = () => {
    setShowConfirmation(true);
  };

  const handleDetailedExport = () => {
    if (employeeDetailedCsv) {
      const link = document.createElement("a");
      link.href = employeeDetailedCsv;
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowConfirmation(false);
  };

  const handleCancelExport = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    const fetchDownloadExcel = () => {
      let apiUrl = `${API_URL}/downloadformatemployees`;
      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          setDownloadExcel(url);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
    };



    const fetchDetailedEmployeeCsvFile = () => {
      let apiUrl = `${API_URL}/downloademployee`;
      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setEmployeeDetailedCsv(url);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
    };

    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_URL}/getproject`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    const fetchLocation = async (selectedProject) => {
      try {
        if (!selectedProject) {
          setLocation([]);
          return;
        }

        const response = await axios.get(`${API_URL}/locations`, {
          params: { project: selectedProject }
        });
        console.log("selectedproject", selectedProject);
        // Log the response to check the structure
        console.log("Fetched Locations Data:", response.data);

        // Map over the data and conditionally append "District Court" to LocationName
        const modifiedLocations = response.data.map(location => ({
          ...location,
          LocationName: selectedProject === "1"
            ? (location.LocationName ? `${location.LocationName} District Court` : 'Unknown District Court')
            : location.LocationName
        }));

        console.log("Modified Locations:", modifiedLocations);
        setLocation(modifiedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchProject();
    if (selectedProject) {
      fetchLocation(selectedProject);
    } else {
      setLocation([]);
    }
    fetchDownloadExcel();

    fetchDetailedEmployeeCsvFile();
  }, [selectedProject]);

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = (isFiltered = false) => {
    setIsLoading(true);
    let params = {};

    // If a location is selected, add it to the params object
    if (isFiltered && selectedLocation) {
      params.locationname = selectedLocation;  // Add location filter if provided
    }
    axios
      .get(`${API_URL}/fetch-unique-users`, { params })
      .then((response) => {
        // Ensure you're setting the correct part of the response (e.g., response.data.users if the array is nested)
        if (response.data && response.data.users) {
          setUsers(response.data.users);  // Assuming response contains { users: [...] }
        } else {
          setUsers([]);  // Handle case where users array is not present
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      });
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 8 && !e.target.value) {
      switch (e.target.name) {
        case 'selectedLocation':
          setSelectedLocations(null);
          setSelectedLocationId('');
          break;
        default:
          break;
      }
    }
  };

  const handleLocationDropdown = () => {
    setLocationDropdown(!locationDropdown);
  }

  const handleProjectDropdown = () => {
    setProjectDropdown(!projectDropdown);
  }

  const handleInputChangeProject = (e) => {
    setSelectedProject(e.target.value); // Allow user to clear the input
  };

  const handleInputChangeLocation = (e) => {
    setSelectedLocations(e.target.value); // Allow user to clear the input
  };

  const handleRemoveLocation = (indexToRemove) => {
    setSelectedLocations(prevLocations => prevLocations.filter((_, index) => index !== indexToRemove));
  };


  const handleSelectLocation = (id, name) => {
    const index = selectedLocations.findIndex(loc => loc.id === id);
    if (index === -1) {
      setSelectedLocations([...selectedLocations, { id, name }]);
      setSelectedLocationId(id);
      setSelectedLocationName(name);  // Update selectedLocationId
    } else {
      const updatedLocations = [...selectedLocations];
      updatedLocations.splice(index, 1);
      setSelectedLocations(updatedLocations);
      setSelectedLocationId(null);
      setSelectedLocationName(null);// Clear selectedLocationId if deselected
    }
  };

  const handleSelectProject = (id, name) => {
    setSelectedProject(name);
    setSelectedProjectId(parseInt(id));
    setShowProject(!showProject);
    setProjectDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', excelData);

    try {
      if (excelData) {
        const response = await axios.post(`${API_URL}/uploadExcelUser`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Data from Excel file submitted:", response.data);
        toast.success("File Uploaded Successfully");
      } else if (editingEmployee) {
        // Update existing record
        const response = await axios.put(`${API_URL}/updateSiteUserDetails/${editingEmployee.userid}`, newFormData);
        console.log("Employee updated:", response.data);
        toast.success("Employee updated successfully");
        setEditingEmployee(null);
        setShowModal(false);
      } else {
        // Create new record
        const response = await axios.post(`${API_URL}/createAttendance`, newFormData);
        console.log("Data from input fields submitted:", response.data);
        toast.success("Entry created Successfully");
      }

      setNewFormData({
        // Reset form fields as needed
        Location: '',
        Project: '',
        // Add other form fields to reset them
      });
      setSelectedLocationName('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error submitting data. Please try again.');
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again.");
    }
  };

  const handleFileUpload = (e) => {
    setExcelData(e.target.files[0]);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewFormData({ ...newFormData, [name]: value });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedLocation") {
      // Handle location selection
      const [id, locationName] = value.split('|'); // Assuming value is in the format "id|name"
      handleSelectLocation(id, locationName);
    } else {
      setNewFormData({ ...newFormData, [name]: value, Location: selectedLocationName, Project: selectedProjectId });
    }
  };


  const handleChange = (event) => {
    setExcelSelected(event.target.value === "excelFile");
    setManualSelected(event.target.value === "manual");
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewFormData({
      BiomatrixNo: employee.BiomatrixNo,
      EmpReferenceNo: employee.EmpReferenceNo,
      DOJ: employee.DOJ,
      FixedSalary: employee.FixedSalary,
      Project: employee.Project,
      Location: employee.Location,
      HRcumAdminName: employee.HRcumAdminName,
      ProjectManager: employee.ProjectManager,
      ProjectOwner: employee.ProjectOwner,
      IsActive: employee.IsActive,
      LastUpdateDate: employee.LastUpdateDate,
      FatherName: employee.FatherName,
      UserName: employee.UserName,
    });
    setShowModal(true); // Show the modal
  };

  const handleDelete = async (userid) => {
    try {
      await axios.delete(`${API_URL}/deleteSiteUserDetails/${userid}`);
      setEmployee(employee.filter(emp => emp.userid !== userid)); // Remove deleted employee from state
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee. Please try again.");
    }
  };
  const handleProjectChange = (e) => setSelectedProject(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  //   const handleSubmitFilter = (e) => {
  //     console.log("button clicked")
  //     e.preventDefault(); // Prevent form submission reload

  //     // Define a mapping of project IDs to project names
  //     const projectMapping = {
  //         1: "UPDC",
  //         2: "Telangana",
  //         3: "Karnataka"
  //     };

  //     // Get the project name from the selectedProject
  //     const projectName = projectMapping[selectedProject];

  //     // Apply filtering logic
  //     const filtered = users.filter(user => {

  //         // Check if project and location match the selected values
  //         const matchesProject = selectedProject ? user.project === projectName : true;
  //         const matchesLocation = selectedLocation ? user.locationname === selectedLocation : true;

  //         console.log(matchesLocation, matchesProject);

  //         return matchesProject && matchesLocation;
  //     });

  //     // Do something with the filtered data
  //     console.log(filtered);
  //     setFilteredUsers(filtered);

  // };

  const handleSubmitFilter = () => {
    // Check if all fields are selected
    if (!selectedProject || !selectedLocation || !selectedStatus) {
      toast.error('Please select Project, Location, and Status');
      return;
    }

    // Check if status is inactive
    if (selectedStatus === 'inactive') {
      toast.error('No inactive users present');
      return;
    }

    // If all validations pass, proceed with the action
    fetchEmployeeDetails(true);
  }

  const exportToCSV = () => {
    if (!users || users.length === 0) {
      return;
    }

    // Define the header for the CSV
    const headers = [
      "User ID",
      "Emp. Reference No",
      "Biomatrix No",
      "User Name",
      "Father Name",
      "Adhaar No",
      "DOJ",
      "Designation",
      "Fixed Salary",
      "Project",
      "Location",
      "HR cum Admin Name",
      "Project Manager",
      "Project Owner",
      "Is Active",
      "Last Update Date"
    ];

    // Map the data rows for the CSV
    const rows = users.map(user => [
      user.userid || '',
      user.EmpReferenceNo || '',
      user.BiomatrixNo || '',
      user.username || '',
      user.FatherName || '',
      user.AdhaarNo || '',
      user.DOJ || '',
      user.designations || 'Data Entry Operator',
      user.FixedSalary || '',
      user.project || 'UPDC',
      user.locationname || '',
      user.HRcumAdminName || '',
      user.ProjectManager || '',
      user.ProjectOwner || '',
      user.IsActive || 'Yes',
      user.LastUpdateDate || ''
    ]);

    // Combine the headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_data.csv';
    a.click();

    // Clean up the URL and the link element
    window.URL.revokeObjectURL(url);
  };
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="container-fluid mt-5">
        <div className='row'>
          <div className='col-2'>
            <SideBar />
          </div>
          <div className='col-9 ms-5'>
            <div className="row" style={{ overflowY: 'auto' }}>
              <div className="row" style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                <h6 className="ms-2" style={{ color: 'white' }}>
                  <Link to='' style={{ color: 'white' }}>
                    <FaHome style={{ marginTop: '-2px' }} />
                  </Link> / Upload Employee Details
                </h6>
              </div>

              <form className="non-tech mb-5" onSubmit={handleSubmit}>
                <div className="row mt-2  search-report-card">
                  <div className="row upload-options ms-1">
                    <div className="col-3">
                      <h5>Upload Data with:</h5>
                    </div>
                    <div className="col-2">
                      <input type="radio" id="excelFile" name="filterType" value="excelFile" onChange={handleChange} checked={excelSelected} />
                      <label htmlFor="excelFile" className="ms-1">Excel File</label>
                    </div>
                    <div className="col-2">
                      <input type="radio" id="manual" name="filterType" value="manual" onChange={handleChange} checked={manualSelected} />
                      <label htmlFor="manual" className="ms-1">Manually</label>
                    </div>
                  </div>

                  {excelSelected && (
                    <>
                      <div className="row mt-1">
                        <div className="col-2">
                          <label className="mt-1">Upload Excel:</label>
                        </div>
                        <div className="col-3 mt-1">
                          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                        </div>
                        <div className='col-2'>
                          <button type="submit">Submit</button>
                        </div>
                        <div className='col-3'></div>
                        <div className='col-2'>
                          <button className="non-tech d-flex align-items-center" onClick={handleDownloadFormat}>
                            <FiDownload className="me-2" />Format
                          </button>
                        </div>
                      </div>

                    </>
                  )}
                  {manualSelected && (
                    <>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">User Name:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="UserName" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Biomatrix No:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="BiomatrixNo" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Father Name:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="FatherName" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Emp. Reference No:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="EmpReferenceNo" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">DOJ:</label>
                            </div>
                            <div className="col-8">
                              <input type="date" name="DOJ" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Fixed Salary:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="FixedSalary" onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                        <div className='col-6'>

                          <label className='mt-1'>Select Project </label><br />
                          <input type='text' placeholder='Select Project' className='form-control' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedProject || ''} onClick={handleProjectDropdown} onChange={handleInputChangeProject} />
                          {projectDropdown && (
                            <div className='group-dropdown'>
                              {project && project.map((elem, index) => (
                                <div key={index} className='group-card' onClick={() => handleSelectProject(elem.id, `${elem.ProjectName}`)} >
                                  <p>{elem.ProjectName}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <label className='mt-1'>Select Location</label><br />
                          <div>
                            {selectedLocations.map((location, index) => (
                              <span key={index} style={{ color: '#107393' }}>
                                {location.name}
                                <button className='close-btn' onClick={() => handleRemoveLocation(index)}>&times;</button> {/* Delete button */}
                              </span>
                            ))}
                          </div>
                          <input
                            ref={locationDropdownRef}
                            type="text"
                            placeholder="Select Location"
                            className="form-control"
                            style={{ width: "100%", height: "35px", border: "1px solid lightgray", borderRadius: "2px" }}
                            onClick={handleLocationDropdown}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                          />

                          {locationDropdown && location && Array.isArray(location) && (
                            <div className='group-dropdown'>
                              {location.map((elem, index) => (
                                <div key={index} className='group-card' onClick={() => handleSelectLocation(elem.LocationID, `${elem.LocationName}`)} >
                                  <p>{elem.LocationName}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">HR cum Admin Name:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="HRcumAdminName" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Project Manager:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="ProjectManager" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Project Owner:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="ProjectOwner" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Is Active:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="IsActive" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Last Update Date:</label>
                            </div>
                            <div className="col-8">
                              <input type="date" name="LastUpdateDate" onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3 ms-4">
                        <button type="submit">Submit</button>
                      </div>
                    </>
                  )}
                </div>
              </form>

            </div>
            <div className='row search-report-card' style={{ height: '120px' }}>
              <h5>Filters</h5>
              <div className='col-3'>
                <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
                  <option value=''>Select Project</option>
                  {project.map((projects) => (
                    <option key={projects.id} value={projects.id} onChange={handleProjectChange}>
                      {projects.ProjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-3'>
                <select className='form-select' value={selectedLocation} onChange={handleLocationChange}>
                  <option value=''>Select Location</option>
                  {location.map((locations) => (
                    <option key={locations.LocationName} value={locations.LocationName}>
                      {locations.LocationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-3'>
                <select className='form-select' value={selectedStatus} onChange={handleStatusChange}>
                  <option value=''>Select Status</option>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>
              <div className='col-3'>
                <input type='submit' onClick={handleSubmitFilter} style={{ height: "37px", marginTop: '0px' }} />
              </div>
            </div>
            <div className="row search-report-card mt-2 mb-3" style={{ overflow: 'auto', height: '500px' }}>
              <div className='d-flex justify-content-between'style={{height:'60px'}} >
                <h3>Site User Details</h3>
                <button className='btn btn-primary' onClick={exportToCSV} style={{ marginBottom: '20px',height:'40px' }}>
                  Export as CSV
                </button>
                </div>
                <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th style={{ whiteSpace: "nowrap" }}>User ID</th>
                        <th style={{ whiteSpace: "nowrap" }}>Emp. Reference No</th>
                        <th style={{ whiteSpace: "nowrap" }}>Biomatrix No</th>
                        <th style={{ whiteSpace: "nowrap" }}>User Name</th>
                        <th style={{ whiteSpace: "nowrap" }}>Father Name</th>
                        <th style={{ whiteSpace: "nowrap" }}>Adhaar No</th>
                        <th style={{ whiteSpace: "nowrap" }}>DOJ</th>
                        <th style={{ whiteSpace: "nowrap" }}>Designation</th>
                        <th style={{ whiteSpace: "nowrap" }}>Fixed Salary</th>
                        <th style={{ whiteSpace: "nowrap" }}>Project</th>
                        <th style={{ whiteSpace: "nowrap" }}>Location</th>
                        <th style={{ whiteSpace: "nowrap" }}>HR cum Admin Name</th>
                        <th style={{ whiteSpace: "nowrap" }}>Project Manager</th>
                        <th style={{ whiteSpace: "nowrap" }}>Project Owner</th>
                        <th style={{ whiteSpace: "nowrap" }}>Is Active</th>
                        <th style={{ whiteSpace: "nowrap" }}>Last Update Date</th>
                        <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users && Array.isArray(users) && users.map((elem, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.userid || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.EmpReferenceNo || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.BiomatrixNo || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.username || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.FatherName || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.AdhaarNo || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.DOJ || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.designations || "Data Entry Operator"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.FixedSalary || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.project || "UPDC"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.locationname || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.HRcumAdminName || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.ProjectManager || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.ProjectOwner || ""}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.IsActive || "Yes"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{elem.LastUpdateDate || ""}</td>
                          <td>
                            <div className='row'>
                              <div className='col-3'>
                                <button className='btn' onClick={() => handleEdit(elem)}>
                                  <BiSolidEditAlt />
                                </button>
                              </div>
                              <div className='col-2'></div>
                              <div className='col-3'>
                                <button className='btn' onClick={() => handleDelete(elem.userid)}>
                                  <RiDeleteBin6Line />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            </div>
          </div>
        </div>
        {/* Modal for editing employee details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="UserName" value={newFormData.UserName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicFatherName">
                <Form.Label>Father Name</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="FatherName" value={newFormData.FatherName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicBiomatrixNo">
                <Form.Label>Biomatrix No</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="BiomatrixNo" value={newFormData.BiomatrixNo} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicEmpReferenceNo">
                <Form.Label>Emp Reference No</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="EmpReferenceNo" value={newFormData.EmpReferenceNo} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicDOJ">
                <Form.Label>DOJ</Form.Label>
                <Form.Control type="date" style={{ border: '1px solid black' }} name="DOJ" value={newFormData.DOJ} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicFixedSalary">
                <Form.Label>Fixed Salary</Form.Label>
                <Form.Control type="number" style={{ border: '1px solid black' }} name="FixedSalary" value={newFormData.FixedSalary} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicProject">
                <Form.Label>Project</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="Project" value={newFormData.Project} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="Location" value={newFormData.Location} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicHRcumAdminName">
                <Form.Label>HR cum Admin Name</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="HRcumAdminName" value={newFormData.HRcumAdminName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicProjectManager">
                <Form.Label>Project Manager</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="ProjectManager" value={newFormData.ProjectManager} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicProjectOwner">
                <Form.Label>Project Owner</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="ProjectOwner" value={newFormData.ProjectOwner} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicIsActive">
                <Form.Label>Is Active</Form.Label>
                <Form.Control type="text" style={{ border: '1px solid black' }} name="IsActive" value={newFormData.IsActive} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicLastUpdateDate">
                <Form.Label>Last Update Date</Form.Label>
                <Form.Control type="date" style={{ border: '1px solid black' }} name="LastUpdateDate" value={newFormData.LastUpdateDate} onChange={handleInputChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};

export default SiteUser;

