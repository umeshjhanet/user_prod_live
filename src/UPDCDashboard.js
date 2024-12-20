import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import './App.css';
import PeriodicSummaryReport from './periodicSummaryReport';
import CumulativeSummaryReport from './cumulativeSummaryReport';
import { priceCount as initialPriceCount } from './Components/priceCount'; // Import initial priceCount
import axios from 'axios';
import { API_URL } from './API';
import { ToastContainer, toast } from 'react-toastify';
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import NonTechCumulative from './NonTechCumulative';
import NonTechPeriodic from './NonTechPeriodic';
import CalculatorModal from './Components/CalculatorModal';
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';
import AllCummulative from './AllCummulative';
import AllPeriodic from './AllPeriodic';
import { FaRegSquarePlus, FaRegSquareMinus } from "react-icons/fa6";
import NonTechModal from './Components/NonTechModal';
import SideBar from './Components/SideBar';


const UPDCDashboard = () => {
    const [showPeriodicSummary, setShowPeriodicSummary] = useState(false);
    const [showCumulativeSummary, setShowCumulativeSummary] = useState(false);
    const [shownonTechPeriodicSummary, setShowNonTechPeriodicSummary] = useState(false);
    const [shownonTechCumulativeSummary, setShowNonTechCumulativeSummary] = useState(false);
    const [showAllPeriodicSummary, setShowAllPeriodicSummary] = useState(false);
    const [showAllCumulativeSummary, setShowAllCumulativeSummary] = useState(false);
    const [periodicSelected, setPeriodicSelected] = useState(true);
    const [cumulativeSelected, setCumulativeSelected] = useState(false);
    const [allSelected, setAllSelected] = useState(true);
    const [technicalSelected, setTechnicalSelected] = useState(false);
    const [nonTechnicalSelected, setNonTechnicalSelected] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [error, setError] = useState('');
    const [summaryReport, setSummaryReport] = useState();
    const [prices, setPrices] = useState(); // Set initial priceCount
    const [editedPrices, setEditedPrices] = useState(initialPriceCount); // Define editedPrices state
    const [multipliedData, setMultipliedData] = useState([]); // Define multipliedData state
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showFullTable, setShowFullTable] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showFilter, setShowFilter] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localPrices, setLocalPrices] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setLocalPrices(prices);
    }, [prices]);
    const handleBlur = (e, rateType, index) => {
        const updatedPrices = [...localPrices];
        updatedPrices[index][rateType] = parseFloat(e.target.innerText) || 0; // Ensure a valid number
        setLocalPrices(updatedPrices);
        handleEditPrice(e, rateType, index);
    };

    const calculateTotalRate = (elem) => {
        return (
            elem.ScanRate +
            elem.QcRate +
            elem.FlagRate +
            elem.IndexRate +
            elem.CbslQaRate +
            elem.ClientQcRate 
        ).toFixed(3);
    };

    const renderRow = (elem, index, fields) => {
        return (
            <tr key={elem.id}>
                <td>{elem.LocationName}</td>
                {fields.map((field, idx) => (
                    <td key={idx} contentEditable onBlur={(e) => handleEditPrice(e, field, index)}>{elem[field]}</td>
                ))}
                <td>{calculateTotalRate(elem)}</td>
                <td>
                    <button
                        className="btn btn-success"
                        style={{ paddingTop: '0px', paddingBottom: '0px', height: '28px' }}
                        onClick={() => handleSave(elem.id, index)}
                    >
                        Save
                    </button>
                </td>
            </tr>
        );
    };



    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    const handleRadioChange = (event) => {
        // Update state when the radio button is changed
        if (event.target.value === "periodic") {
            setPeriodicSelected(true);
            setCumulativeSelected(false);
            setShowCumulativeSummary(false);
            setShowPeriodicSummary(false);
        } else if (event.target.value === "cumulative") {
            setCumulativeSelected(true);
            setPeriodicSelected(false);
            setShowPeriodicSummary(false);
            setShowCumulativeSummary(false);
        }
    };


    const handleChange = (event) => {
        // Update state when the filter type is changed
        setAllSelected(event.target.value === "all");
        setTechnicalSelected(event.target.value === "technical");
        setNonTechnicalSelected(event.target.value === "non-technical");
    };


    const handleFromDateChange = (event) => {
        // Update state when "From Date" is changed
        const selectedFromDate = event.target.value;
        setFromDate(selectedFromDate);
        const [year, month] = selectedFromDate.split("-");
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        // Format the last day of the month as a date string
        const lastDateOfMonth = `${year}-${month}-${lastDayOfMonth}`;
        // Set the toDate state to the last date of the selected month
        setToDate(lastDateOfMonth);
    };
    const handleToDateChange = (event) => {
        // Update state when "To Date" is changed
        setToDate(event.target.value);
    };

    const handleSubmit = () => {
        // Check if "Periodic" is selected
        if 
        // (technicalSelected && 
           (periodicSelected) {
            // If "Periodic" is selected, check if both "From Date" and "To Date" are provided
            if 
            (fromDate && toDate) {
                // If both dates are provided, show the summary report
                setShowPeriodicSummary(true);
                setShowCumulativeSummary(false);
                // setShowAllPeriodicSummary(false);
                // setShowAllCumulativeSummary(false);
                // setShowNonTechCumulativeSummary(false);
                // setShowNonTechPeriodicSummary(false);
                setError('');
            } else {
                // If any date is missing, show an error message
                setError('Please provide both "From Date" and "To Date".');
            }
        } else if 
        // (technicalSelected && 
            (cumulativeSelected) {
            // If "Cumulative" is selected, show the summary report without requiring dates
            setShowCumulativeSummary(true);
            setFromDate("");
            setToDate("");
            setShowPeriodicSummary(false);
            // setShowAllPeriodicSummary(false);
            // setShowAllCumulativeSummary(false);
            // setShowNonTechCumulativeSummary(false);
            // setShowNonTechPeriodicSummary(false);
            setError('');
        } 
        // else if (nonTechnicalSelected && cumulativeSelected) {
        //     setShowNonTechCumulativeSummary(true);
        //     setShowAllPeriodicSummary(false);
        //     setShowAllCumulativeSummary(false);
        //     setShowCumulativeSummary(false);
        //     setFromDate("");
        //     setToDate("");
        //     setShowPeriodicSummary(false);
        //     setShowNonTechPeriodicSummary(false);
        //     setError('');
        // } else if (nonTechnicalSelected && periodicSelected) {
        //     // If "Periodic" is selected, check if both "From Date" and "To Date" are provided
        //     if (fromDate && toDate) {
        //         // If both dates are provided, show the summary report
        //         setShowNonTechPeriodicSummary(true);
        //         setShowAllPeriodicSummary(false);
        //         setShowAllCumulativeSummary(false);
        //         setShowPeriodicSummary(false);
        //         setShowCumulativeSummary(false);
        //         setShowNonTechCumulativeSummary(false);
        //         setError('');
        //     }
        // } else if (allSelected && cumulativeSelected) {
        //     setShowAllCumulativeSummary(true);
        //     setShowCumulativeSummary(false);
        //     setFromDate("");
        //     setToDate("");
        //     setShowPeriodicSummary(false);
        //     setShowAllPeriodicSummary(false);
        //     setShowNonTechPeriodicSummary(false);
        //     setShowNonTechCumulativeSummary(false);
        //     setError('');
        // } else if (allSelected && periodicSelected) {
        //     // If "Periodic" is selected, check if both "From Date" and "To Date" are provided
        //     if (fromDate && toDate) {
        //         // If both dates are provided, show the summary report
        //         setShowAllPeriodicSummary(true);
        //         setShowPeriodicSummary(false);
        //         setShowCumulativeSummary(false);
        //         setShowAllCumulativeSummary(false);
        //         setShowNonTechPeriodicSummary(false);
        //         setShowNonTechCumulativeSummary(false);
        //         setError('');
        //     } else {
        //         // If any date is missing, show an error message
        //         setError('Please provide both "From Date" and "To Date".');
        //     }
        // } else {
        //     setError('Please choose an option.');
        // }
    };
    useEffect(() => {
        // Set "Periodic" as selected by default when component mounts
        setPeriodicSelected(true);
        setCumulativeSelected(false);
        setAllSelected(true);
        // Get current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
        const firstDateOfMonth = `${currentYear}-${currentMonth}-01`;


        // Set default "From Date" to the first date of the current month
        setFromDate(firstDateOfMonth);


        // Set default "To Date" to the current date
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedCurrentDate = `${year}-${month}-${day}`;
        setToDate(formattedCurrentDate);
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/getproject`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);


    const handleSave = async (id, index) => {
        try {
            const updatedPrice = prices[index];
            const response = await axios.put(
                `${API_URL}/updatebusinessrate/${id}`,
                updatedPrice
            );

            console.log("Update Response:", response.data); // Log the response for debugging

            const updatedPrices = [...prices];
            updatedPrices[index] = updatedPrice; // Update the corresponding row in the local state
            setPrices(updatedPrices); // Update the local state with the new values
            toast.success("Updated successfully");

            // Fetch updated prices from the database
            fetchBusinessRate(userData);
            // const updatedPricesResponse = await axios.get(
            //     `${API_URL}/getbusinessrate`
            // );
            // setPrices(updatedPricesResponse.data); // Update the local state with the new prices fetched from the database
        } catch (error) {
            console.error("Error updating business rate:", error);
            toast.error("Failed to update business rate");
        }
    };

    const handleEditPrice = (e, field, index) => {
        const newPrices = [...prices];
        newPrices[index][field] = parseFloat(e.target.innerText);
        setPrices(newPrices);
    };
    const fetchBusinessRate = (userData) => {
        console.log("fetchBusinessRate function called");

        // Check userData structure
        if (!userData || !Array.isArray(userData.user_roles) || !Array.isArray(userData.projects) || !Array.isArray(userData.locations)) {
            console.error("Invalid userData structure:", userData);
            return;
        }

        // Dynamic locationName assignment
        const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";

        // Check if userData meets the conditions to include the locationName parameter
        const isCBSLUser = userData.user_roles.includes("CBSL Site User");
        const hasSingleProject = userData.projects[0] === 1;

        // Check if locationName matches any location name in userData.locations
        const hasMatchingLocation = userData.locations.some(location => location.name === locationName);

        console.log("LocationName:", locationName);
        console.log("isCBSLUser:", isCBSLUser);
        console.log("userData.user_roles:", userData.user_roles);
        console.log("hasSingleProject:", hasSingleProject);
        console.log("userData.projects:", userData.projects);
        console.log("hasMatchingLocation:", hasMatchingLocation);
        console.log("userData.locations:", userData.locations);

        let apiUrl = `${API_URL}/getbusinessrate`;

        if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
            const separator = apiUrl.includes('?') ? '&' : '?';
            apiUrl += `${separator}locationName=${encodeURIComponent(locationName)}`;
            console.log("Modified API URL with locationName:", apiUrl);
        } else {
            console.log("API URL without locationName:", apiUrl);
        }

        axios
            .get(apiUrl)
            .then((response) => {
                console.log("Response data:", response.data);
                setPrices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    };
    useEffect(() => {
        // Set editedPrices to initialPriceCount when component mounts
        setEditedPrices(initialPriceCount);



        // Ensure userData is available before calling fetchBusinessRate
        if (userData) {
            fetchBusinessRate(userData);
        } else {
            console.error("userData is not available:", userData);
        }

    }, [userData]);

    console.log("Summary Data", summaryReport);
    const multiplyData = (summaryData, priceData) => {
        if (!summaryData || !priceData) return []; // Ensure both data arrays are provided


        return summaryData.map((report) => {
            const multipliedValues = priceData.map((price) => {
                const multipliedValue =
                    parseFloat(report[price.name]) * parseFloat(price.value);
                return isNaN(multipliedValue) ? 0 : multipliedValue; // Handle NaN values
            });
            return { multipliedValues };
        });
    };
    // Update multipliedData whenever editedPrices changes
    useEffect(() => {
        const newMultipliedData = multiplyData(summaryReport, editedPrices);
        setMultipliedData(newMultipliedData);
    }, [summaryReport, editedPrices]);
    const handleShowFullTable = () => {
        setShowFullTable(prevState => !prevState);
    }
    const handleCloseCalculator = () => {
        setShowCalculator(!showCalculator);
        console.log("Modal closed.")
    }
    const handleShowCalculator = (rate, rateType) => {
        setShowCalculator(true);
    }


    const handleSaveCalculatedRate = (newRate, rateType) => {
        const updatedPrices = [...prices];
        const index = updatedPrices.findIndex(price => price.id === price);
        if (index !== -1) {
            updatedPrices[index][rateType] = newRate;
            setPrices(updatedPrices);
        }
        setShowCalculator(false);
    }
    const handleShowFilter = () => {
        setShowFilter(prevState => !prevState);
    }
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    const navigate = useNavigate();
    const handleProjectChange = (e) => setSelectedProject(Number(e.target.value));
    const handleSearch = () => {
        if (selectedProject === 1) {
            navigate('/UPDCDashboard');
        } else if (selectedProject === 2) {
            navigate('/TelDashboard');
        } else if (selectedProject === 3) {
            navigate('/KarDashboard');
        } else if ([4, 5, 6, 7, 8, 9, 10].includes(selectedProject)) {
            navigate(`/Dashboard/${selectedProject}`);
        } else {
            navigate('/UPDCDashboard');
        }
    };
    

    return (
        <>
            <Header />
            <div className='container-fluid mt-5'>
                <div className='row'>
                    <div className='col-2'>
                        <SideBar />
                    </div>
                    <div className='col-9 ms-5'>
                        <div className='row mt-2 search-report-card' style={{height:"60px",padding:'10px 0px',borderRadius:'0px'}}>
                        <div className='col-3'>
                                <select className='form-select' value={selectedProject} onChange={handleProjectChange}>
                                    <option value=''>Select Project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id} onChange={handleProjectChange}>
                                            {project.ProjectName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <button className='btn btn-primary' onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className="card" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                                <h6 className="ms-2" style={{ color: "white" }}>
                                    {userData && userData.projects && userData.projects.includes(1) ? (
                                        <span style={{ color: 'white' }}><FaHome style={{ marginTop: '-2px' }} /></span>
                                    ) : (
                                       <></>
                                    )} Uttar Pradesh Courts
                                </h6>
                            </div>
                            <div className='row ms-0 mt-2 search-report-card'>
                                {/* <div className='row' style={{ marginTop: '0px', marginBottom: '-10px' }}>
                                    <div className='col-1'><h5>Filter<button style={{ border: 'none', backgroundColor: 'white', padding: "0px" }} onClick={handleShowFilter}>{showFilter ? <FaRegSquareMinus /> : <FaRegSquarePlus />}</button> </h5></div>
                                   
                                    <div className='col-1'>
                                        <input type='radio' id='all' name='filterType' value='all' onChange={handleChange} checked={allSelected} />
                                        <label htmlFor='all' className='ms-1'>All</label>
                                    </div>
                                    <div className='col-2'>
                                        <input type='radio' id='technical' name='filterType' value='technical' onChange={handleChange} checked={technicalSelected} />
                                        <label htmlFor='technical' className='ms-1'>Technical</label>
                                    </div>
                                    <div className='col-2' style={{ marginLeft: '-20px' }}>
                                        <input type='radio' id='non-technical' name='filterType' value='non-technical' onChange={handleChange} checked={nonTechnicalSelected} />
                                        <label htmlFor='non-technical' className='ms-1'>Non-Technical</label>
                                    </div>
                                    {nonTechnicalSelected && userData && userData.user_roles && userData.user_roles.includes("CBSL Site User") ? (
                                        <div className='col-2'>
                                            <button className='btn btn-success' style={{ marginTop: '-5px', paddingTop: '0px', paddingBottom: '0px', height: '28px' }} onClick={handleOpenModal}>Upload</button>
                                        </div>
                                    ) : (
                                        <div className='col-4'></div>
                                    )}


                                </div>
                                {showFilter && (<> */}
                                    <div className='row mt-2' style={{ marginBottom: '-10px' }}>
                                    <div className='col-1'><h5 style={{marginTop:'-2px'}}>Filter</h5></div>
                                        <div className='col-2'>
                                            <input type='radio' id='cumulative' name='reportType' value='cumulative' onChange={handleRadioChange} checked={cumulativeSelected} />
                                            <label htmlFor='cumulative' className='ms-1'>Cumulative</label>
                                        </div>
                                        <div className='col-2'>
                                            <input type='radio' id='periodic' name='reportType' value='periodic' onChange={handleRadioChange} checked={periodicSelected} />
                                            <label htmlFor='periodic' className='ms-1'>Periodic</label>
                                        </div>
                                        {periodicSelected && (
                                            <>
                                                <div className='col-3'>
                                                    <label className='me-1'>From Date:</label>
                                                    <input type='date' value={fromDate} onChange={handleFromDateChange} />
                                                </div>
                                                <div className='col-3'>
                                                    <label className='me-1'>To Date:</label>
                                                    <input type='date' value={toDate} onChange={handleToDateChange} />
                                                </div>
                                            </>
                                        )}
                                        <div className='col-1'>
                                            <button className='btn btn-success' style={{ marginTop: '-5px', paddingTop: '0px', paddingBottom: '0px', height: '28px' }} onClick={handleSubmit}>Submit</button>
                                        </div>
                                    </div>
                                {/* </>)} */}
                                {error && <p className='text-danger'>{error}</p>}
                            </div>
                            {/* {allSelected && (
                                <div className='row mt-2 ms-0 me-0 search-report-card'>
                                    <div className='row'>
                                        <div className='col-3'>
                                            <h5 >Expense Rate(per image)</h5>
                                        </div>
                                        <div className='col-8'></div>
                                        <div className='col-1'>
                                            <button style={{ border: 'none', backgroundColor: 'white' }} title={showFullTable ? 'Show Less' : 'Show More'} onClick={handleShowFullTable}>{showFullTable ? <TiArrowUpThick /> : <TiArrowDownThick />}</button>
                                        </div>
                                    </div>

                                    <table className='table-bordered' style={{ paddingLeft: '5px' }}>
                                        <thead>
                                            <tr>
                                                <th>Location</th>
                                                <th>Inventory</th>
                                                <th>Counting</th>
                                                <th>Doc Prepared</th>
                                                <th>Other</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Flagging</th>
                                                <th>Indexing</th>
                                                <th>CBSL-QA</th>
                                                <th>Client-QA</th>
                                                <th>Total Price</th>
                                                <th>Edit Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prices && prices.slice(0, 1).map((elem, index) => renderRow(elem, index, ['InventoryRate', 'CountingRate', 'DocPreparationRate', 'GuardRate', 'ScanRate', 'QcRate', 'FlagRate', 'IndexRate', 'CbslQaRate', 'ClientQcRate']))}
                                            {showFullTable && prices && prices.slice(1).map((elem, index) => renderRow(elem, index + 1, ['InventoryRate', 'CountingRate', 'DocPreparationRate', 'GuardRate', 'ScanRate', 'QcRate', 'FlagRate', 'IndexRate', 'CbslQaRate', 'ClientQcRate']))}
                                        </tbody>
                                    </table>

                                </div>
                            )} */}
                            {/* {technicalSelected && ( */}
                            {userData && userData.user_roles.includes("CBSL Site User")? (
                                <div className='row'>
                                </div>
                                 ):(
                                    <div className='row mt-2 ms-0 me-0 search-report-card'>
                                    <div className='row'>
                                        <div className='col-3'>
                                            <h5 >Expense Rate(per image)</h5>
                                        </div>
                                        <div className='col-8'></div>
                                        <div className='col-1'>
                                            <button style={{ border: 'none', backgroundColor: 'white' }} title={showFullTable ? 'Show Less' : 'Show More'} onClick={handleShowFullTable}>{showFullTable ? <TiArrowUpThick /> : <TiArrowDownThick />}</button>
                                        </div>
                                    </div>

                                    <table className='table-bordered' style={{ paddingLeft: '5px' }}>
                                        <thead>
                                            <tr>
                                                <th>Location</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Flagging</th>
                                                <th>Indexing</th>
                                                <th>CBSL-QA</th>
                                                <th>Client-QA</th>
                                                <th>Total Price</th>
                                                <th>Edit Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prices && prices.slice(0, 1).map((elem, index) => renderRow(elem, index, ['ScanRate', 'QcRate', 'FlagRate', 'IndexRate', 'CbslQaRate', 'ClientQcRate']))}
                                            {showFullTable && prices && prices.slice(1).map((elem, index) => renderRow(elem, index + 1, ['ScanRate', 'QcRate', 'FlagRate', 'IndexRate', 'CbslQaRate', 'ClientQcRate']))}
                                        </tbody>
                                    </table>

                                </div> 
                                 )} 
                            {/* )} */}
                            {/* {nonTechnicalSelected && (
                                <div className='row mt-2 ms-0 me-0 search-report-card'>
                                    <div className='row'>
                                        <div className='col-3'>
                                            <h5 >Expense Rate(per image)</h5>
                                        </div>
                                        <div className='col-8'></div>
                                        <div className='col-1'>
                                            <button style={{ border: 'none', backgroundColor: 'white' }} title={showFullTable ? 'Show Less' : 'Show More'} onClick={handleShowFullTable}>{showFullTable ? <TiArrowUpThick /> : <TiArrowDownThick />}</button>
                                        </div>
                                    </div>

                                    <table className='table-bordered' style={{ paddingLeft: '5px' }}>
                                        <thead>
                                            <tr>
                                                <th>Location</th>
                                                <th>Inventory</th>
                                                <th>Counting</th>
                                                <th>Doc Prepared</th>
                                                <th>Other</th>
                                                <th>Total Price</th>
                                                <th>Edit Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prices && prices.slice(0, 1).map((elem, index) => renderRow(elem, index, ['InventoryRate', 'CountingRate', 'DocPreparationRate', 'GuardRate']))}
                                            {showFullTable && prices && prices.slice(1).map((elem, index) => renderRow(elem, index + 1, ['InventoryRate', 'CountingRate', 'DocPreparationRate', 'GuardRate']))}
                                        </tbody>
                                    </table>

                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
            {showPeriodicSummary && <PeriodicSummaryReport multipliedData={multipliedData} prices={prices} editedPrices={editedPrices} startDate={fromDate} endDate={toDate} userData={userData} />}
            {showCumulativeSummary && <CumulativeSummaryReport multipliedData={multipliedData} editedPrices={editedPrices} prices={prices} userData={userData} />}
            {/* {shownonTechCumulativeSummary && <NonTechCumulative userData={userData} />}
            {shownonTechPeriodicSummary && <NonTechPeriodic multipliedData={multipliedData} prices={prices} editedPrices={editedPrices} startDate={fromDate} endDate={toDate} userData={userData} />}
            {showAllCumulativeSummary && <AllCummulative userData={userData} />}
            {showAllPeriodicSummary && <AllPeriodic multipliedData={multipliedData} prices={prices} editedPrices={editedPrices} startDate={fromDate} endDate={toDate} userData={userData} />} */}
            {showCalculator && <CalculatorModal onClose={handleCloseCalculator} />}
            {isModalOpen && <NonTechModal onClose={handleCloseModal} userInfo={userData} />}
            <ToastContainer />
        </>
    );
};


export default UPDCDashboard;