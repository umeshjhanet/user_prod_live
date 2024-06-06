import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import axios from 'axios';
import { API_URL } from './API';


const NonTechForm = () => {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocation(false);
      }
    };


    document.addEventListener('click', handleClickOutside);


    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);


  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(`${API_URL}/locations`);
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
    // setFormData(prevFormData => ({
    //   ...prevFormData,
    //   LocationID: parseInt(id),
    //   LocationName:name
    // }));
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


  // const handleSubmit = async (e) => {
  //   e.preventDefault();


  //   try {
  //     const response = await axios.post(`${API_URL}/createstaff`, formData);
  //     console.log("Non-tech staff created:", response.data);
  //   } catch (error) {
  //     console.error("Error creating non-tech staff:", error);
  //   }
  // };



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
      <Header />
      <div className='container'>
        <div className='row'>
          <form onSubmit={handleForm}>
            <div className="row mt-2 me-1 search-report-card">
              <label>Select Project</label>
              <input
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
              <label>Select Location</label>
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
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <label>Staff Name</label>
              <input type='text' name='StaffName' onChange={handleInputChange} /><br />
              <label>Counting</label>
              <input type='text' name='Counting' onChange={handleInputChange} /><br />
              <label>Inventory</label>
              <input type='text' name='Inventory' onChange={handleInputChange} /><br />
              <label>DocPreparation</label>
              <input type='text' name='DocPreparation' onChange={handleInputChange} /><br />
              <label>Guard</label>
              <input type='text' name='Guard' onChange={handleInputChange} /><br />
              
              <label>Date</label>
              <input type='date' name='Date' onChange={handleInputChange} /><br />
              <input type='submit' value='Submit'  />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


export default NonTechForm;
