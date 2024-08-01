import React, { useState, useEffect } from 'react';
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

const SiteUser = ({ onClose }) => {
  const [excelSelected, setExcelSelected] = useState(true);
  const [manualSelected, setManualSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [downloadExcel, setDownloadExcel] = useState(null);
  const [newFormData, setNewFormData] = useState({
    BiomatrixNo: '',
    EmpReferenceNo: '',
    DOJ: '',
    FixedSalary: '',
    Project: '',
    Location: '',
    HRcumAdminName: '',
    ProjectManager: '',
    ProjectOwner: '',
    IsActive: '',
    LastUpdateDate: '',
    FatherName: '',
    UserName:''
  });

  const [editingEmployee, setEditingEmployee] = useState(null); // State for the employee being edited
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
    const fetchEmployeeDetails = () => {
      setIsLoading(true);
      axios
        .get(`${API_URL}/employeeDetails`)
        .then((response) => {
          setEmployee(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        });
    };
    fetchDownloadExcel();
    fetchEmployeeDetails();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData({ ...newFormData, [name]: value });
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

  return (
    <>
      <Header />
      <div className="container mt-3">
        <div className="row" style={{ overflowY: 'auto' }}>
          <div className="row" style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
            <h6 className="ms-2" style={{ color: 'white' }}>
              Upload Employee Details
            </h6>
          </div>
          <div className="row ">
            <div className="row">
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
                      <div className="row ms-2 justify-content-end">
                        <button className="non-tech mt-1 d-flex align-items-center" onClick={handleDownloadFormat}>
                          <FiDownload className="me-2" />Format
                        </button>
                      </div>
                      <div className="row mt-0">
                        <div className="col-2">
                          <label className="mt-0">Upload Excel:</label>
                        </div>
                        <div className="col-10 mt-0">
                          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                        </div>
                      </div>
                      <div className="row mt-3 ms-4">
                        <button type="submit">Submit</button>
                      </div>
                    </>
                  )}
                  {manualSelected && (
                    <>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="row mt-2">
                            <div className="col-4">
                              <label className="mt-2 ms-0">Biomatrix No:</label>
                            </div>
                            <div className="col-8">
                              <input type="text" name="BiomatrixNo" value={newFormData.BiomatrixNo} onChange={handleInputChange} />
                            </div>
                          </div>
                          {/* Add other fields similarly */}
                        </div>
                        <div className='col-6'>
                          {/* Add other fields similarly */}
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
          </div>
          <div className="row" style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
            <h6 className="ms-2" style={{ color: 'white' }}>
              Manage Employee Details
            </h6>
          </div>
          <div className='row mt-2 search-report-card'>
          <div className="row mt-2" style={{overflow:'auto'}}>
            <div className="col-12">
              <h5>Employee Details</h5>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{whiteSpace:'nowrap'}}>Sr.No</th>
                      <th style={{whiteSpace:'nowrap'}}>User Name</th>
                      <th style={{whiteSpace:'nowrap'}}>Biomatrix No</th>
                      <th style={{whiteSpace:'nowrap'}}>Emp Reference No</th>
                      <th style={{whiteSpace:'nowrap'}}>Father's Name</th>
                      <th style={{whiteSpace:'nowrap'}}>DOJ</th>
                      <th style={{whiteSpace:'nowrap'}}>Project</th>
                      <th style={{whiteSpace:'nowrap'}}>Location</th>
                      <th style={{whiteSpace:'nowrap'}}>Fixed Salary</th>
                      <th style={{whiteSpace:'nowrap'}}>HR cum Admin Name</th>
                      <th style={{whiteSpace:'nowrap'}}>Project Manager</th>
                      <th style={{whiteSpace:'nowrap'}}>Project Owner</th>
                      <th style={{whiteSpace:'nowrap'}}>Is Active</th>
                      <th style={{whiteSpace:'nowrap'}}>Last Update Date</th>
                      <th style={{whiteSpace:'nowrap'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee && employee.map((elem, index) => (
                      <tr key={index}>
                        <td style={{whiteSpace:'nowrap'}}>{index + 1}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.UserName}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.BiomatrixNo}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.EmpReferenceNo}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.FatherName}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.DOJ}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.Project}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.Location}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.FixedSalary}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.HRcumAdminName}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.ProjectManager}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.ProjectOwner}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.IsActive}</td>
                        <td style={{whiteSpace:'nowrap'}}>{elem.LastUpdateDate}</td>
                        <td style={{whiteSpace:'nowrap'}}>
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

        {/* Modal for editing employee */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicBiomatrixNo">
                <Form.Label>Biomatrix No</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="BiomatrixNo" value={newFormData.BiomatrixNo} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicEmpReferenceNo">
                <Form.Label>Emp Reference No</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="EmpReferenceNo" value={newFormData.EmpReferenceNo} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicDOJ">
                <Form.Label>DOJ</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="DOJ" value={newFormData.DOJ} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicFixedSalary">
                <Form.Label>Fixed Salary</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="FixedSalary" value={newFormData.FixedSalary} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicProject">
                <Form.Label>Project</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="Project" value={newFormData.Project} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="Location" value={newFormData.Location} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicHRcumAdminName">
                <Form.Label>HR cum Admin Name</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="HRcumAdminName" value={newFormData.HRcumAdminName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicProjectManager">
                <Form.Label>Project Manager</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="ProjectManager" value={newFormData.ProjectManager} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicProjectOwner">
                <Form.Label>Project Owner</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="ProjectOwner" value={newFormData.ProjectOwner} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicIsActive">
                <Form.Label>Is Active</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="IsActive" value={newFormData.IsActive} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicLastUpdateDate">
                <Form.Label>Last Update Date</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="LastUpdateDate" value={newFormData.LastUpdateDate} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicFatherName">
                <Form.Label>Father Name</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="FatherName" value={newFormData.FatherName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBasicFatherName">
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" style={{border:'1px solid black'}} name="UserName" value={newFormData.UserName} onChange={handleInputChange} />
              </Form.Group>
              <Button variant="primary" className='mt-2' type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer />
      </div>
    </>
  );
};

export default SiteUser;
