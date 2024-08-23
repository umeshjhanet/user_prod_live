import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import axios from 'axios';
import { API_URL } from './API';

const NonTechForm = () => {
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showProject, setShowProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const dropdownRef = useRef(null);
  const projectDropdownRef = useRef(null);
  const [location, setLocation] = useState([]);
  const [project, setProject] = useState([]);
  const [formData, setFormData] = useState({
    ProjectId: '',
    LocationId: '',
    StaffName: '',
    Date: '',
    TaskName: '',
    Volume: '',
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
    setFormData(prevFormData => ({
      ...prevFormData,
      LocationId: parseInt(id)
    }));
    setShowLocation(false);
  };

  const handleShowLocation = (e) => {
    e.stopPropagation();
    setShowLocation(!showLocation);
  };

  const handleSelectProject = (id, name) => {
    setSelectedProject(name);
    setFormData(prevFormData => ({
      ...prevFormData,
      ProjectId: parseInt(id)
    }));
    setShowProject(false);
  };

  const handleShowProject = (e) => {
    e.stopPropagation();
    setShowProject(!showProject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/createstaff`, formData);
      console.log("Non-tech staff created:", response.data);
    } catch (error) {
      console.error("Error creating non-tech staff:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  return (
    <>
      <Header />
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
             <p>Select your favorite fruit:</p>
        <label>
            <input type="radio" name="fruit" value="apple"></input>
            Apple
        </label>
        <br></br>
        <label>
            <input type="radio" name="fruit" value="banana"></input>
            Banana
        </label>
        </div>
          <div className='col-6'><h1>Excel</h1></div>
        </div>
        <div className='row'>
          <form onSubmit={handleSubmit}>
            <div className="row mt-2 me-1 search-report-card">
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
              <label>Staff Name</label>
              <input type='text' name='StaffName' onChange={handleInputChange} /><br />
              <label>Task Name</label>
              <input type='text' name='TaskName' onChange={handleInputChange} /><br />
              <label>Volume</label>
              <input type='number' name='Volume' onChange={handleInputChange} /><br />
              <label>Date</label>
              <input type='date' name='Date' onChange={handleInputChange} /><br />
              <input type='submit' value='Submit' />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NonTechForm;
