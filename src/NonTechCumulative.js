import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL } from './API';

const NonTechCumulative = () => {
    const [staffData, setStaffData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [locationView, setLocationView] = useState(false);
    useEffect(() => {
        const fetchNonTech = () => {
            setIsLoading(true);
            axios
                .get(`${API_URL}/getstaff`)
                .then((response) => {
                    setStaffData(response.data)
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setIsLoading(false);
                });

        };
        fetchNonTech();
    }, []);
    const handleLocationView = () => {
        setLocationView(true);
    }

    console.log("Non Tech Staff", staffData);
    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
    return (
        <>
            {isLoading && <Loader />}
            <div className={`container mb-5 ${isLoading ? 'blur' : ''}`}>
                <div className="row mt-3">
                    <div className="search-report-card">
                        <h4>Summary Report</h4>
                        <div className="row ms-2 me-2">
                            <table className="table-bordered mt-2" >
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Location</th>
                                        <th>Date</th>
                                        <th>Counting</th>
                                        <th>Inventory</th>
                                        <th>DocPreparation</th>
                                        <th>Guard</th>
                                        <th>Business Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffData && staffData.map((elem, index) => (
                                        <>
                                            <tr onClick={() => handleLocationView(elem.locationname)} key={index} >
                                                <td key={index}>{index + 1}</td>
                                                <td>{elem.LocationName}</td>
                                                <td>{elem.date}</td>
                                                <td>{elem.Counting}</td>
                                                <td>{elem.Inventory}</td>
                                                <td>{elem.DocPreparation}</td>
                                                <td>{elem.Guard}</td>
                                                <td></td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>
                {locationView && 
                <div className="row mt-3">
                    <div className="search-report-card">
                        <h4>Summary Report</h4>
                        <div className="row ms-2 me-2">
                            <table className="table-bordered mt-2" >
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Location</th>
                                        <th>Staff Name</th>
                                        <th>Date</th>
                                        <th>Counting</th>
                                        <th>Inventory</th>
                                        <th>DocPreparation</th>
                                        <th>Guard</th>
                                        <th>Business Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffData && staffData.map((elem, index) => (
                                        <>
                                            <tr>

                                                <td key={index}>{index + 1}</td>
                                                <td>{elem.LocationName}</td>
                                                <td>{elem.StaffName}</td>
                                                <td>{elem.date}</td>
                                                <td>{elem.Counting}</td>
                                                <td>{elem.Inventory}</td>
                                                <td>{elem.DocPreparation}</td>
                                                <td>{elem.Guard}</td>
                                                <td></td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>
                }
            </div>

        </>
    )
}

export default NonTechCumulative