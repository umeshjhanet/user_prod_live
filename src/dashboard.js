import React, { useState } from 'react';
import Header from './Components/Header';
import './App.css';
import SummaryReport from './periodicSummaryReport';
import PeriodicSummaryReport from './periodicSummaryReport';
import CumulativeSummaryReport from './cumulativeSummaryReport';

const Dashboard = () => {
    const [showPeriodicSummary, setShowPeriodicSummary] = useState(false);
    const [showCumulativeSummary, setShowCumulativeSummary] = useState(false);
    const [periodicSelected, setPeriodicSelected] = useState(false);
    const [cumulativeSelected, setCumulativeSelected] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [error, setError] = useState('');

    const handleRadioChange = (event) => {
        // Update state when the radio button is changed
        if (event.target.value === 'periodic') {
            setPeriodicSelected(true);
        } else {
            setPeriodicSelected(false);
        }
        if (event.target.value === 'cumulative') {
            setCumulativeSelected(true);
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
        } else if(cumulativeSelected) {
            // If "Cumulative" is selected, show the summary report without requiring dates
            
            setShowCumulativeSummary(true);
            setFromDate("");
            setToDate("");
            setShowPeriodicSummary(false);
            setError('');
        }
        else{
            setError('Please choose an option.')
        }
    };


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
                                        <th>Scanned</th>
                                        <th>QC</th>
                                        <th>Segregation</th>
                                        <th>Indexing</th>
                                        <th>Flagging</th>
                                        <th>CBSL-QA</th>
                                        <th>Client-QC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Arrow</td>
                                        <td>Set Business</td>
                                        <td>0.032</td>
                                        <td>0.031</td>
                                        <td>0.011</td>
                                        <td>0.012</td>
                                        <td>0.013</td>
                                        <td>0.026</td>
                                        <td>0.025</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                
            </div>
            {showPeriodicSummary && <PeriodicSummaryReport />}
            {showCumulativeSummary && <CumulativeSummaryReport />}
        </>
    );
};

export default Dashboard;
