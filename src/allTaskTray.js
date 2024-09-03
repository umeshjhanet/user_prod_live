import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';

const AllTaskTray = () => {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState({});
  const [datesOfMonth, setDatesOfMonth] = useState([]);
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
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`${API_URL}/userdetailedreportdatewise`, {
        params: {
          locationName: selectedLocation,
          startDate,
          endDate,
          project: selectedProject,
        },
      });

      const fetchedData = response.data;
      const transformedData = {};
      const dates = new Set();

      fetchedData.forEach((item) => {
        const { user_type, Date, TotalExpense } = item;
        if (!transformedData[user_type]) {
          transformedData[user_type] = {};
        }
        transformedData[user_type][Date] = TotalExpense.toFixed(2);
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
          startDate,
          endDate,
          project: selectedProject,
        },
        responseType: 'blob', // Handle binary data
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      setError(`An error occurred while exporting as ${format}.`);
    }
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
                <input type='date' className='form-control' value={startDate} onChange={handleStartDateChange} />
              </div>
              <div className='col-3'>
                <input type='date' className='form-control' value={endDate} onChange={handleEndDateChange} />
              </div>
              <div className='col-3'>
                <button className='btn success-btn' onClick={handleSubmit}>Submit</button>
              </div>
              <div className='col-2 mt-3'>
                <button className='btn btn-primary me-2' onClick={() => handleExport('csv')}>Export as CSV</button>
              </div>
              {Object.keys(data).length > 0 && (
              <div className='mt-3'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>User</th>
                      {datesOfMonth.map((date) => (
                        <th key={date}>{date}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(data).map((user) => (
                      <tr key={user}>
                        <td>{user}</td>
                        {datesOfMonth.map((date) => (
                          <td key={date}>{data[user][date] || 0}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
           
            {error && <div className='alert alert-danger mt-3'>{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTaskTray;
