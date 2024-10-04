import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import SideBar from './Components/SideBar';
import { API_URL } from './API';

const SetTarget = () => {
    const [location, setLocation] = useState([]);
    const [project, setProject] = useState([]);
    const [locationDropdown, setLocationDropdown] = useState(false);
    const [projectDropdown, setProjectDropdown] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [selectedLocationName, setSelectedLocationName] = useState('');
    const [dailyTarget, setDailyTarget] = useState('');

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

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchLocation = (projectId) => {
            if (projectId) {
                fetch(`${API_URL}/locations?project=${projectId}`)
                    .then((response) => response.json())
                    .then((data) => setLocation(data))
                    .catch((error) => console.error(error));
            }
        };

        const fetchProject = () => {
            fetch(`${API_URL}/getproject`)
                .then((response) => response.json())
                .then((data) => setProject(data))
                .catch((error) => console.error(error));
        };

        fetchProject();
        if (selectedProjectId) {
            fetchLocation(selectedProjectId);
        }
    }, [selectedProjectId]);

    const handleProjectDropdown = () => {
        setProjectDropdown(!projectDropdown);
    };

    const handleLocationDropdown = () => {
        setLocationDropdown(!locationDropdown);
    };

    const handleSelectProject = (id, name) => {
        setSelectedProject(name);
        setSelectedProjectId(parseInt(id));
        setProjectDropdown(false);
    };

    const handleSelectLocation = (id, name) => {
        setSelectedLocationId(id);
        setSelectedLocationName(name);
        setLocationDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const targetData = {
            ProjectId: selectedProjectId,
            LocationId: selectedLocationId,
            DailyTarget: dailyTarget,
        };

        // Send the data to the insert API
        fetch(`${API_URL}/api/target`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(targetData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    alert('Target inserted successfully');
                } else {
                    alert('Error inserting target');
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <>
            <Header />
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-2">
                        <SideBar />
                    </div>
                    <div className="col-9 ms-5">
                        <form onSubmit={handleSubmit}>
                            <div className="target-card">
                                <label>Select Project</label><br />
                                <input
                                    type="text"
                                    placeholder="Select Project"
                                    className="form-control"
                                    style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }}
                                    value={selectedProject || ''}
                                    onClick={handleProjectDropdown}
                                    readOnly
                                />
                                {projectDropdown && (
                                    <div className="group-dropdown">
                                        {project.map((elem, index) => (
                                            <div
                                                key={index}
                                                className="group-card"
                                                onClick={() => handleSelectProject(elem.id, elem.ProjectName)}
                                            >
                                                <p>{elem.ProjectName}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label>Select Location</label><br />
                                <input
                                    ref={locationDropdownRef}
                                    type="text"
                                    placeholder="Select Location"
                                    className="form-control"
                                    value={selectedLocationName || ''}
                                    style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }}
                                    onClick={handleLocationDropdown}
                                    readOnly
                                />
                                {locationDropdown && location.length > 0 && (
                                    <div className="group-dropdown">
                                        {location.map((elem, index) => (
                                            <div
                                                key={index}
                                                className="group-card"
                                                onClick={() => handleSelectLocation(elem.LocationID, elem.LocationName)}
                                            >
                                                <p>{elem.LocationName}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label>Set Target</label><br />
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Target"
                                    value={dailyTarget}
                                    onChange={(e) => setDailyTarget(e.target.value)}
                                    required
                                />
                                <input type="submit" className="btn btn-primary mt-3" value="Submit" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SetTarget;
