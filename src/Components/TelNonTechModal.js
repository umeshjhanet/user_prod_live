import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdCloseCircle } from "react-icons/io";
import axios from 'axios';
import { API_URL } from '../API';
import { FiDownload } from 'react-icons/fi';

const TelNonTechModal = ({ onClose, userInfo }) => {
  const { projects = [], locations = [] } = userInfo;
  const projectId = projects[0];
  
  const selectedLocation = projectId === 1 ? `${locations[0].name} District Court` 
                        : projectId === 2 ? locations[0].name.toUpperCase()
                        : projectId === 3 ? locations[1].name 
                        : "";

  const selectedLocationId = projectId === 1 || projectId === 2 ? locations[0].id 
                        : projectId === 3 ? locations[1].id 
                        : "";

  const [excelSelected, setExcelSelected] = useState(true);
  const [manualSelected, setManualSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [excelData, setExcelData] = useState(null);
  const [downloadExcel,setDownloadExcel]=useState(null);
  const [newFormData, setNewFormData] = useState({
    LocationID: selectedLocationId,
    LocationName: selectedLocation,
    StaffName: '',
    Date: '',
    Counting: '',
    Inventory: '',
    DocPreparation: '',
    Guard: '',
  });
  
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
      let apiUrl = `${API_URL}/downloadformat`;
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
    fetchDownloadExcel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', excelData);
    formData.append('ProjectId', projectId);
    formData.append('ProjectName', projectId === 1 ? "Project 1" : projectId === 3 ? "Project 3" : "");
    formData.append('LocationID', selectedLocationId);
    formData.append('LocationName', selectedLocation);

    if (!excelData) {
      Object.entries(newFormData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      if (excelData) {
        const response = await axios.post(`${API_URL}/teluploadExcel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Data from Excel file submitted:", response.data);
        toast.success("File Uploaded Successfully");
      } else {
        const response = await axios.post(`${API_URL}/telcreatestaff`, newFormData);
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
    // Update state when the filter type is changed
    setExcelSelected(event.target.value === "excelFile");
    setManualSelected(event.target.value === "manual");
  };

  return (
    <>
      <ToastContainer />
      <div className="custom-modal-overlay">
        <div className="custom-modal" style={{overflowY:'auto'}}>
          <div className="modal-header" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
            <h6 className="ms-2" style={{ color: "white" }}>
              User Wise Summary Report
            </h6>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              <IoMdCloseCircle />
            </button>
          </div>
          <div className="modal-body mb-5">
            <div className='row'>
              <form className='non-tech mb-5' onSubmit={handleSubmit}>
                <div className="row mt-2 me-1 search-report-card">
                  <div className='row upload-options ms-1'>
                    <div className='col-3'>
                      <h5>Upload Data with:</h5>
                    </div>
                    <div className='col-2'>
                      <input type='radio' id='excelFile' name='filterType' value='excelFile' onChange={handleChange} checked={excelSelected} />
                      <label htmlFor='excelFile' className='ms-1'>Excel File</label>
                    </div>
                    <div className='col-2'>
                      <input type='radio' id='manual' name='filterType' value='manual' onChange={handleChange} checked={manualSelected} />
                      <label htmlFor='manual' className='ms-1'>Manually</label>
                    </div>
                  </div>
                 
                  {excelSelected && <>
                    <div className="row ms-2 justify-content-end">
                      <button className="non-tech mt-1 d-flex align-items-center" onClick={handleDownloadFormat}>
                        <FiDownload className="me-2" />Format
                      </button>
                    </div>
                  <div className='row mt-2'>
                    <div className='col-2'>
                    <label className='mt-2'>Upload Excel:</label>
                    </div>
                    <div className='col-10 mt-2'>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    </div>
                    
                  </div>
                    <div className='row mt-3 ms-4'>                   
                    <button type='submit'>Submit</button>
                  </div>
                  </>}
                  {manualSelected && <>
                  <div className='row'>
                    <div className='col-3'>
                    <label className='mt-2 ms-0'>Staff Name</label>
                    </div>
                    <div className='col-9'>
                    <input type='text' name='StaffName' onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-3'>
                    <label className='mt-2'>Counting</label>
                    </div>
                    <div className='col-9'>
                    <input type='number' name='Counting' onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-3'>
                    <label className='mt-2'>Inventory</label>
                    </div>
                    <div className='col-9'>
                    <input type='number' name='Inventory' onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-3'>
                    <label className='mt-2'>DocPreparation</label>
                    </div>
                    <div className='col-9'>
                    <input type='number' name='DocPreparation' onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-3'>
                    <label className='mt-2'>Other</label>
                    </div>
                    <div className='col-9'>
                    <input type='number' name='Guard' onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-3'>
                    <label className='mt-2'>Date</label>
                    </div>
                    <div className='col-9'>
                    <input type='date' name='Date' onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className='row mt-2'>
                  <div className='col-3'></div>
                    <div className='col-9'>
                    <button type='submit'>Submit</button>
                    </div>
                  </div>
                  </>}
                  
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TelNonTechModal;
