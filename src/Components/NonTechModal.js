import React, {useState, useEffect,useRef} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import { IoMdCloseCircle } from "react-icons/io";
import axios from 'axios';
import { API_URL } from '../API';

const NonTechModal = ({onClose}) => {
    const [showLocation, setShowLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [showProject, setShowProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const dropdownRef = useRef(null);
  const projectDropdownRef = useRef(null);
  const [location, setLocation] = useState([]);
  const [project, setProject] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const[excelData,setExcelData]=useState(null);
  const [newFormData, setNewFormData] = useState({
    ProjectId: '',
    ProjectName:'',
    LocationID: '',
    LocationName:'',
    StaffName: '',
    Date: '',
    Counting: '',
    Inventory: '',
    DocPreparation: '',
    Guard: '',
    
  });


  useEffect(() => {
    const handleClickOutside = (event) => {
      if ( (dropdownRef.current && !dropdownRef.current.contains(event.target)) && 
      (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target))
     ) {
        setShowLocation(false);
        setShowProject(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef,projectDropdownRef]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(`${API_URL}/alllocations`);
        setLocation(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getproject`);
        setProject(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjectData();
    fetchLocationData();
  }, []);


  const handleSelectLocation = (id, name) => {
    setSelectedLocation(name);
    setSelectedLocationId(parseInt(id))
    setShowLocation(false);
    console.log("location",name)
    console.log("location",id)
  };


  const handleShowLocation = (e) => {
    e.stopPropagation();
    setShowLocation(!showLocation);
  };


  const handleSelectProject = (id, name) => {
    setSelectedProject(name);
    setSelectedProjectId(parseInt(id))
    setShowProject(false);
    
  };


  const handleShowProject = (e) => {
    e.stopPropagation();
    setShowProject(!showProject);
  };

  const handleForm = async () => {
    const formData = new FormData();
    formData.append('file', excelData);
    formData.append('ProjectId', selectedProjectId );
    formData.append('ProjectName',selectedProject);
    formData.append('LocationID',selectedLocationId);
    formData.append('LocationName', selectedLocation);
    
    if (!excelData) {
      Object.entries(formData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
  
    try {
      if (excelData) {
       
        const response = await axios.post(`${API_URL}/uploadExcel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Data from Excel file submitted:", response.data);
      } else {
        
        const response = await axios.post(`${API_URL}/createstaff`, newFormData);
        console.log("Data from input fields submitted:", response.data);
      }
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error submitting data. Please try again.');
      console.error("Error submitting data:", error);
    }
  };
  
  
  const handleFileUpload = (e) => {
    setExcelData(e.target.files[0]);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData({ ...newFormData, [name]: value, ProjectId: selectedProjectId, ProjectName: selectedProject, LocationID: selectedLocationId, LocationName: selectedLocation});
  }
    return (
        <>
          <ToastContainer />
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <div className="modal-header" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                <h6 className="ms-2" style={{ color: "white" }}>
                  User Wise Summary Report
                </h6>
                <button type="button" className="btn btn-danger" onClick={onclose}>
                  <IoMdCloseCircle />
                </button>
              </div>
              <div className="modal-body">
              <div className='row'>
          <form onSubmit={handleForm}>
            <div className="row mt-2 me-1 search-report-card">
              <label className='mt-2'>Select Project</label>
              <input
              className='form-input'
                type='text'
                placeholder='Project'
                name='Project'
                value={selectedProject}
                onClick={handleShowProject}
                readOnly
              />
              {showProject && (
                <div className='locations-card' ref={projectDropdownRef}>
                  {project.map((elem, index) => (
                    <div key={index} onClick={() => handleSelectProject(elem.id, elem.ProjectName)}>
                      <p>{elem.ProjectName}</p>
                    </div>
                  ))}
                </div>
              )}
              <label className='mt-2'>Select Location</label>
              <input
                type='text'
                placeholder='Location'
                name='Location'
                value={selectedLocation}
                onClick={handleShowLocation}
                readOnly
              />
              {showLocation && (
                <div className='locations-card' ref={dropdownRef}>
                  {location.map((elem, index) => (
                    <div key={index} onClick={() => handleSelectLocation(elem.LocationID, elem.LocationName)}>
                      <p>{elem.LocationName}</p>
                    </div>
                  ))}
                </div>
              )}
              <label className='mt-2'>Upload Excel</label>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <label className='mt-2'>Staff Name</label>
              <input type='text' name='StaffName' onChange={handleInputChange} /><br />
              <label className='mt-2'>Counting</label>
              <input type='text' name='Counting' onChange={handleInputChange} /><br />
              <label className='mt-2'>Inventory</label>
              <input type='text' name='Inventory' onChange={handleInputChange} /><br />
              <label className='mt-2'>DocPreparation</label>
              <input type='text' name='DocPreparation' onChange={handleInputChange} /><br />
              <label className='mt-2'>Other</label>
              <input type='text' name='Guard' onChange={handleInputChange} /><br />
              <label className='mt-2'>Date</label>
              <input type='date' name='Date' onChange={handleInputChange} /><br />
              <input type='submit' value='Submit'  />
            </div>
          </form>
        </div>
              </div>

            </div>
          </div>
        </>
      )
}

export default NonTechModal