import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';
import { toast, ToastContainer } from 'react-toastify';

const HRView = () => {
    const [projects, setProjects] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [month, setMonth] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);
    const [datesOfMonth, setDatesOfMonth] = useState([]);
    const [error, setError] = useState(null);

    const calculateDates = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 26);
        if (start.getDate() < 26) {
            start.setMonth(start.getMonth() - 1); // Go back to the last month if today is before 26th
        }
        setStartDate(start.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 25);
        setEndDate(end.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    };

    useEffect(() => {
        calculateDates(); // Calculate dates when component mounts
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/getproject`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        const fetchLocations = async (selectedProject) => {
            try {
                if (!selectedProject) {
                    setLocations([]);
                    return;
                }
                const response = await axios.get(`${API_URL}/locations`, {
                    params: { project: selectedProject },
                });
                const modifiedLocations = response.data.map(location => ({
                    ...location,
                    LocationName: selectedProject === '1'
                        ? (location.LocationName ? `${location.LocationName} District Court` : 'Unknown District Court')
                        : location.LocationName,
                }));
                setLocations(modifiedLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchProjects();
        if (selectedProject) {
            fetchLocations(selectedProject);
        } else {
            setLocations([]);
        }
    }, [selectedProject, startDate, endDate]);

    const handleProjectChange = (e) => setSelectedProject(e.target.value);
    const handleLocationChange = (e) => setSelectedLocation(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    const handleSubmit = async () => {
        setData([]); // Clear previous data

        try {
            const response = await axios.get(`${API_URL}/api/userworkreportmonthwise`, {
                params: {
                    locationName: selectedLocation,
                    startDate: startDate ? startDate : null,
                    endDate: endDate ? endDate : null,
                    project: selectedProject,
                },
            });

            const fetchedData = response.data;
            setData(fetchedData);
            const dates = new Set(fetchedData.map(item => item.Date));
            const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
            setDatesOfMonth(sortedDates);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching data.');
        }
    };

    const dates = [...new Set(data && data.map(entry => entry.Date))];
    const users = [...new Set(data && data.map(entry => entry.user_type))];

    const metrics = ['QC', 'Flagging', 'Indexing', 'CBSL_QA'];
    // const exportToCSV = () => {
    //     // Prepare header with User, dates with metrics, and Total Expense
    //     const headerRow = ['User', ...dates.flatMap(date => [date, '', '', '']), 'Total Expense'];
    //     // const headerRow = ['User', ...dates.flatMap(date => metrics.map(metric => `${date}`)), 'Total Expense'];
    
    //     // Prepare process header row (subrow for processes, only the word "Process" followed by empty cells for metrics)
    //     const processHeaderRow = ['', ...dates.flatMap(date => metrics.map(metric => `${metric}`))];
    
    //     // Prepare data rows
    //     const rows = users.map((user) => {
    //         // Calculate the total expense for the user
    //         const userTotalExpense = data
    //             .filter(item => item.user_type === user)
    //             .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);
    
    //         // Prepare the row for the user with data for each date and metric
    //         const userData = [
    //             user,
    //             ...dates.flatMap((date) =>
    //                 metrics.map((metric) => {
    //                     const entry = data.find(item => item.user_type === user && item.Date === date);
    //                     const value = entry ? entry[metric] : 0;  // Default to '0' if no data found
    //                     return value === undefined || value === null ? 0 : value;  // Handle undefined/null values
    //                 })
    //             ),
    //             userTotalExpense.toFixed(2), // Total expense per user
    //         ];
    
    //         return { userData };
    //     });
    
    //     // Prepare the final CSV data
    //     const csvContent = [
    //         headerRow.join(','), // Header
    //         processHeaderRow.join(','), // Process Header Row (Just the word 'Process')
    //         ...rows.map(row => row.userData.join(',')), // User Data Rows
    //     ].join('\n');
    
    //     // Create a Blob with the CSV data
    //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    //     const link = document.createElement('a');
    
    //     // Create a link and trigger download
    //     link.href = URL.createObjectURL(blob);
    //     link.download = `${selectedLocation}-${startDate}.csv`;
    //     link.click();
    // };
    

    const exportToCSV = () => {
        // First header row: Each date appears once followed by three empty cells for colspan effect
        const headerRow = ['User', ...dates.flatMap(date => [date, '', '', '']), 'Total Expense'];
    
        // Second header row for metrics (each metric under each date)
        const processHeaderRow = ['', ...dates.flatMap(date => metrics), ''];
    
        // Prepare data rows
        const rows = users.map((user) => {
            const userTotalExpense = data
                .filter(item => item.user_type === user)
                .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);
    
            const userData = [
                user,
                ...dates.flatMap((date) => 
                    metrics.map((metric) => {
                        const entry = data.find(item => item.user_type === user && item.Date === date);
                        return entry ? entry[metric] : 0;
                    })
                ),
                userTotalExpense.toFixed(2),
            ];
    
            return { userData };
        });
    
        // Prepare the final CSV content with the two header rows
        const csvContent = [
            headerRow.join(','),              // Date header row with "colspan" effect
            processHeaderRow.join(','),        // Metric header row
            ...rows.map(row => row.userData.join(',')),  // User data rows
        ].join('\n');
    
        // Create a Blob with the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'report.csv';
        link.click();
    };
    

    return (
        <>
            <ToastContainer />
            <Header />
            <div className='container-fluid mt-5'>
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
                            <div className='col-2'>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='startDate'
                                    value={startDate}
                                    onChange={handleDateChange}
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <div className='col-2'>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='endDate'
                                    value={endDate}
                                    onChange={handleDateChange}
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className='col-12'>
                                {Object.keys(data).length > 0 && (
                                    <>
                                    <div className='mt-3 d-flex justify-content-between align-items-right'>
                                    <button className='btn text-end' style={{backgroundColor:'#4BC0C0'}} onClick={exportToCSV}>Export</button>
                                </div>
                                    <div className='col-12 mt-2' style={{ maxHeight: '500px', overflow: 'auto' }}>
                                        
                                        <table className='table table-bordered'>
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    {dates.map((date, index) => (
                                                        <th colSpan={metrics.length} key={index}>
                                                            {date}
                                                        </th>
                                                    ))}
                                                    <th>Total Expense</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    {dates.map((date, index) => (
                                                        metrics.map((metric, idx) => (
                                                            <th key={`${index}-${idx}`}>{metric}</th>
                                                        ))
                                                    ))}
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user, index) => {
                                                    // Calculate the total expense for the user, defaulting to 0 if no data found
                                                    const userTotalExpense = data
                                                        .filter(item => item.user_type === user)
                                                        .reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0);

                                                    return (
                                                        <tr key={index}>
                                                            <td>{user}</td>
                                                            {dates.map((date, dateIndex) => {
                                                                return metrics.map((metric, idx) => {
                                                                    // Find the entry for the user and the date
                                                                    const entry = data.find(item => item.user_type === user && item.Date === date);

                                                                    // If no entry or no data for the metric, show 0
                                                                    const metricValue = entry ? entry[metric] : 0;
                                                                    return (
                                                                        <td key={`${dateIndex}-${idx}`}>
                                                                            {metricValue === undefined || metricValue === null ? 0 : metricValue}
                                                                        </td>
                                                                    );
                                                                });
                                                            })}
                                                            <td>{userTotalExpense.toFixed(2)}</td> {/* Total expense per user */}
                                                        </tr>
                                                    );
                                                })}
                                                <tr>
                                                    <td colSpan={dates.length * metrics.length + 1}><b>Total Expense Sum</b></td>
                                                    <td>
                                                        {data.reduce((sum, item) => sum + parseFloat(item.TotalExpense || 0), 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tbody>


                                        </table>
                                    </div>
                                    </>
                                )}
                                {error && (
                                    <div className='col-12 mt-3'>
                                        <div className='alert alert-danger'>{error}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HRView;
