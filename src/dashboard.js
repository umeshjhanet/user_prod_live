import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import './App.css';
import PeriodicSummaryReport from './periodicSummaryReport';
import CumulativeSummaryReport from './cumulativeSummaryReport';
import { priceCount as initialPriceCount } from './Components/priceCount'; // Import initial priceCount
import axios from 'axios';
import { API_URL } from './API';

const Dashboard = () => {
    const [showPeriodicSummary, setShowPeriodicSummary] = useState(false);
    const [showCumulativeSummary, setShowCumulativeSummary] = useState(false);
    const [periodicSelected, setPeriodicSelected] = useState(false);
    const [cumulativeSelected, setCumulativeSelected] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [error, setError] = useState('');
    const [summaryReport, setSummaryReport] = useState();
    const [prices, setPrices] = useState(initialPriceCount); // Set initial priceCount
    const [editedPrices, setEditedPrices] = useState(initialPriceCount); // Define editedPrices state
    const [multipliedData, setMultipliedData] = useState([]); // Define multipliedData state
    const [refreshPage, setRefreshPage] = useState(false);

    const handleRadioChange = (event) => {
        // Update state when the radio button is changed
        if (event.target.value === 'periodic') {
            setPeriodicSelected(true);
            setShowCumulativeSummary(false);
        } else {
            setPeriodicSelected(false);
        }
        if (event.target.value === 'cumulative') {
            setCumulativeSelected(true);
            setShowPeriodicSummary(false);
        } else {
            setCumulativeSelected(false);
        }
       
    };

    const handleFromDateChange = (event) => {
        // Update state when "From Date" is changed
        setFromDate(event.target.value);
    };

    const handleToDateChange = (event) => {
        // Update state when "To Date" is changed
        setToDate(event.target.value);
    };

    const handleSubmit = () => {
        // Check if "Periodic" is selected
        if (periodicSelected) {
            // If "Periodic" is selected, check if both "From Date" and "To Date" are provided
            if (fromDate && toDate) {
                // If both dates are provided, show the summary report
                setShowPeriodicSummary(true);
                setShowCumulativeSummary(false);
                setError('');
              
            } else {
                // If any date is missing, show an error message
                setError('Please provide both "From Date" and "To Date".');
            }
        } else if (cumulativeSelected) {
            // If "Cumulative" is selected, show the summary report without requiring dates

            setShowCumulativeSummary(true);
            setFromDate("");
            setToDate("");
            setShowPeriodicSummary(false);
            setError('');
           
        }
        else {
            setError('Please choose an option.')
        }
    };

    const handleSave = () => {
        // Update priceCount with edited prices
        setPrices(editedPrices);
    };

    useEffect(() => {
        // Set editedPrices to initialPriceCount when component mounts
        setEditedPrices(initialPriceCount);
        
        const fetchSummaryReport = () => {
            axios.get(`${API_URL}/summaryReport`)
            .then((response) => setSummaryReport(response.data))
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
        }
        fetchSummaryReport();
    },[])
    console.log('Summary Data', summaryReport);

    const multiplyData = (summaryData, priceData) => {
        if (!summaryData || !priceData) return []; // Ensure both data arrays are provided
    
        return summaryData.map((report) => {
            const multipliedValues = priceData.map((price) => {
                const multipliedValue = parseFloat(report[price.name]) * parseFloat(price.value);
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

    // Use multipliedData in your component as needed
    console.log("MultipliedData", multipliedData);
    
    return (
        <>
            <Header />
            <div className='container'>
                <div className='row mt-3'>
                    <div
                        className="card"
                        style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
                    >
                        <h6 className="" style={{ color: "white" }}>
                            Dashboard / Site Wise Production Summary Report
                        </h6>
                    </div>
                    <div className='row ms-0 mt-2 search-report-card'>
                        <p>Filter</p>
                        <div className='row'>
                            <div className='col-2'>
                                <input type='radio' id='cumulative' name='filterType' value='cumulative' onChange={handleRadioChange} />
                                <label className='ms-1'>Cumulative</label>
                            </div>
                            <div className='col-2'>
                                <input type='radio' id='periodic' name='filterType' value='periodic' onChange={handleRadioChange} />
                                <label className='ms-1'>Periodic</label>
                            </div>
                            <div className='col-3'>
                                <label className='me-1'>From Date:</label>
                                <input type='date' value={fromDate} onChange={handleFromDateChange} />
                            </div>
                            <div className='col-3'>
                                <label className='me-1'>To Date:</label>
                                <input type='date' value={toDate} onChange={handleToDateChange} />
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                        {error && <p className='text-danger'>{error}</p>}
                    </div>
                    <div className='row mt-2 ms-0 me-0 search-report-card'>
                        <table className='table-bordered mt-2'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Stack</th>
                                    {prices.map((elem, index) => (
                                        <th key={index}>{elem.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Arrow</td>
                                    <td>Set Business</td>
                                    {prices.map((elem, index) => (
                                        <td key={index} contentEditable onBlur={(e) => {
                                            const newPrices = [...editedPrices];
                                            newPrices[index].value = parseFloat(e.target.innerText);
                                            setEditedPrices(newPrices);
                                        }}>{elem.value}</td>
                                    ))}
                                </tr>
                            </tbody>

                        </table>
                        <div className='row mt-2'>
                            <div className='col-11'></div>
                            <div className='col-1'> <button className="btn btn-success" onClick={handleSave}>Save</button></div>
                        </div>
                    </div>
                    
                </div>

            </div >
            {showPeriodicSummary && <PeriodicSummaryReport multipliedData={multipliedData} prices={prices} editedPrices={editedPrices} startDate={fromDate} endDate={toDate}/>
            }
            {showCumulativeSummary && <CumulativeSummaryReport multipliedData={multipliedData} editedPrices={editedPrices} prices={prices} />}
        </>
    );
};

export default Dashboard;
