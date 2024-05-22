import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import "./App.css";
import PeriodicSummaryReport from "./periodicSummaryReport";
import CumulativeSummaryReport from "./cumulativeSummaryReport";
import { priceCount as initialPriceCount } from "./Components/priceCount"; // Import initial priceCount
import axios from "axios";
import { API_URL } from "./API";
import { ToastContainer, toast } from "react-toastify";
const Dashboard = () => {
  const [showPeriodicSummary, setShowPeriodicSummary] = useState(false);
  const [showCumulativeSummary, setShowCumulativeSummary] = useState(false);
  const [periodicSelected, setPeriodicSelected] = useState(true);
  const [cumulativeSelected, setCumulativeSelected] = useState(false);
  const [allSelected, setAllSelected] = useState(true);
  const [technicalSelected, setTechnicalSelected] = useState(false);
  const [nonTechnicalSelected, setNonTechnicalSelected] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const [summaryReport, setSummaryReport] = useState();
  const [prices, setPrices] = useState(); // Set initial priceCount
  const [editedPrices, setEditedPrices] = useState(initialPriceCount); // Define editedPrices state
  const [multipliedData, setMultipliedData] = useState([]); // Define multipliedData state
  const [refreshPage, setRefreshPage] = useState(false);
  const[location,setLocation]=useState([]);
  const [showFullTable, setShowFullTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [nonTechTableData, setNonTechTableData] = useState([]);
  const [nonTechTableHeaders, setNonTechTableHeaders] = useState([]);

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

    // Extract year and month from the selected date
    const [year, month] = selectedFromDate.split("-");

    // Calculate the last day of the selected month
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
    if (periodicSelected) {
      // If "Periodic" is selected, check if both "From Date" and "To Date" are provided
      if (fromDate && toDate) {
        // If both dates are provided, show the summary report
        setShowPeriodicSummary(true);
        setShowCumulativeSummary(false);
        setError("");
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
      setError("");
    } else {
      setError("Please choose an option.");
    }
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
  }, []);

  const handleSave = async (id, index) => {
    try {
      const updatedPrice = prices[index];
      const response = await axios.put(
        `${API_URL}/updatebusinessrate/${id}`,
        updatedPrice
      );
      console.log(response.data);
      const updatedPrices = [...prices];
      updatedPrices[index] = updatedPrice; // Update the corresponding row in the local state
      setPrices(updatedPrices); // Update the local state with the new values
      toast.success("Updated successfully");

      // Fetch updated prices from the database
      const updatedPricesResponse = await axios.get(
        `${API_URL}/getbusinessrate`
      );
      setPrices(updatedPricesResponse.data); // Update the local state with the new prices fetched from the database
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

  useEffect(() => {
    // Set editedPrices to initialPriceCount when component mounts
    setEditedPrices(initialPriceCount);

    const fetchSummaryReport = () => {
      axios
        .get(`${API_URL}/summaryReport`)
        .then((response) => setSummaryReport(response.data))
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    };

    const fetchLocation = () => {
        axios
          .get(`${API_URL}/locations`)
          .then((response) => setLocation(response.data))
          .catch((error) => {
            console.error("Error fetching location data:", error);
          });
      };

    const fetchBusinessRate = () => {
      axios
        .get(`${API_URL}/getbusinessrate`)
        .then((response) => setPrices(response.data))
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    };

    const fetchTechData = async () => {
      try {
        const response = await axios.get(`${API_URL}/gettask`);
        const data = response.data;
        if (data.length > 0) {
          // Assuming all objects have the same structure
          setTableHeaders(Object.keys(data[0]));
        }
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchNonTechData=async()=>{
        try{
            const response=await axios.get(`${API_URL}/getstaff`);
            const data=response.data;
            if(data.length>0){
                setNonTechTableHeaders(Object.keys(data[0]));
            }
            setNonTechTableData(data);
        } catch(error){
            console.error("Error Fetchinf in data",error);
        }
    }

   

    fetchSummaryReport();
    fetchBusinessRate();
    fetchTechData();
    fetchNonTechData();
    fetchLocation();
   
  }, []);
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
    setShowFullTable((prevState) => !prevState);
  };

  // Use multipliedData in your component as needed
  console.log("Business Rate", prices);



  return (
    <>
      <Header />
      <div className="container">
        <div className="row mt-3">
          <div
            className="card"
            style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
          >
            <h6 className="" style={{ color: "white" }}>
              Dashboard / Site Wise Production Summary Report
            </h6>
          </div>
          <div className="row ms-0 mt-2 search-report-card">
            <div
              className="row"
              style={{ marginTop: "0px", marginBottom: "-10px" }}
            >
              <div className="col-1">
                <h5>Filter</h5>
              </div>
              <div className="col-2">
                <input
                  type="radio"
                  id="all"
                  name="filterType"
                  value="all"
                  onChange={handleChange}
                  checked={allSelected}
                />
                <label htmlFor="all" className="ms-1">
                  All
                </label>
              </div>
              <div className="col-2">
                <input
                  type="radio"
                  id="technical"
                  name="filterType"
                  value="technical"
                  onChange={handleChange}
                  checked={technicalSelected}
                />
                <label htmlFor="technical" className="ms-1">
                  Technical
                </label>
              </div>
              <div className="col-2">
                <input
                  type="radio"
                  id="non-technical"
                  name="filterType"
                  value="non-technical"
                  onChange={handleChange}
                  checked={nonTechnicalSelected}
                />
                <label htmlFor="non-technical" className="ms-1">
                  Non-Technical
                </label>
              </div>
              <div className="col-6"></div>
            </div>
            <div className="row mt-4" style={{ marginBottom: "-10px" }}>
              <div className="col-1"></div>
              <div className="col-2">
                <input
                  type="radio"
                  id="cumulative"
                  name="reportType"
                  value="cumulative"
                  onChange={handleRadioChange}
                  checked={cumulativeSelected}
                />
                <label htmlFor="cumulative" className="ms-1">
                  Cumulative
                </label>
              </div>
              <div className="col-2">
                <input
                  type="radio"
                  id="periodic"
                  name="reportType"
                  value="periodic"
                  onChange={handleRadioChange}
                  checked={periodicSelected}
                />
                <label htmlFor="periodic" className="ms-1">
                  Periodic
                </label>
              </div>
              {periodicSelected && (
                <>
                  <div className="col-3">
                    <label className="me-1">From Date:</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="col-3">
                    <label className="me-1">To Date:</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}
              <div className="col-1">
                <button
                  className="btn btn-success"
                  style={{ marginTop: "-5px" }}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
          </div>
          {allSelected && (
            <div className="row mt-2 ms-0 me-0 search-report-card">
              <table className="table-bordered" style={{ paddingLeft: "5px" }}>
                <thead>
                  <h5 style={{ marginTop: "0px" ,whiteSpace: "nowrap"}}>
                    Expense Rate(per image)
                  </h5>
                  <button
                    className="btn btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "end",
                    }}
                    onClick={handleShowFullTable}
                  >
                    {showFullTable ? "Hide" : "View All"}
                  </button>
                  <tr>
                    <th>Location</th>
                    {tableData.map((rowData, index) => (
                        <th key={index}>{rowData.TaskName}</th>
                    ))}
                    {nonTechTableData.map((rowData, index) => (
                        <th key={index}>{rowData.TaskName}</th>
                    ))}
                    <th>Total Price</th>
                    <th>Edit Price</th>
                  </tr>
                </thead>
                {showFullTable && (
                  <tbody>
                    {prices &&
                      prices.map((elem, index) => (
                        <tr key={index}>
                          {/* <td>{elem.LocationName}</td> */}
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "ScanRate", index)
                            }
                          >
                            {elem.ScanRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) => handleEditPrice(e, "QcRate", index)}
                          >
                            {elem.QcRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "IndexRate", index)
                            }
                          >
                            {elem.IndexRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "FlagRate", index)
                            }
                          >
                            {elem.FlagRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "CbslQaRate", index)
                            }
                          >
                            {elem.CbslQaRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "ClientQcRate", index)
                            }
                          >
                            {elem.ClientQcRate}
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <button
                              className="btn btn-success"
                              style={{
                                paddingTop: "0px",
                                paddingBottom: "0px",
                                height: "28px",
                              }}
                              onClick={() => handleSave(elem.id, index)}
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                      {location.map((loc, index) => (
                  <tr key={index}>
                    <td>{loc.LocationName}</td>
                    <td colSpan={tableData.length + nonTechTableData.length + 4}></td>
                  </tr>
                ))}
                  </tbody>
                )}
              </table>
            </div>
          )}
          {technicalSelected && (<div className='row mt-2 ms-0 me-0 search-report-card'>
                        <table className='table-bordered' style={{ paddingLeft: '5px' }}>
                            <thead>
                                <h5 style={{ marginTop: '-15px' }}>Expense Rate(per image)</h5>
                                <button className='btn btn-primary' style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }} onClick={handleShowFullTable}>{showFullTable ? 'Hide' : 'View All'}</button>
                                {/* <tr>
                                    <th>Location</th>
                                    <th>Scanned</th>
                                    <th>QC</th>
                                    <th>Indexing</th>
                                    <th>Flagging</th>
                                    <th>CBSL_QA</th>
                                    <th>Client_QC</th>
                                    <th>Total Price</th>
                                    <th>Edit Price</th>
                                </tr> */}
                                <tr>
                                <th>Location</th>
                                {tableData.map((rowData, index) => (
                        <th key={index}>{rowData.TaskName}</th>
                    ))}
                                    <th>Total Price</th>
                                    <th>Edit Price</th>
                                </tr>

          </thead>
                            {showFullTable && (
                                <tbody>
                                    {prices && prices.map((elem, index) => (
                                        <tr key={index}>
                                            <td>{elem.LocationName}</td>
                                            <td contentEditable onBlur={(e) => handleEditPrice(e, 'ScanRate', index)}>{elem.ScanRate}</td>
                                            <td contentEditable onBlur={(e) => handleEditPrice(e, 'QcRate', index)}>{elem.QcRate}</td>
                                            <td contentEditable onBlur={(e) => handleEditPrice(e, 'IndexRate', index)}>{elem.IndexRate}</td>
                                            <td contentEditable onBlur={(e) => handleEditPrice(e, 'FlagRate', index)}>{elem.FlagRate}</td>
                                            <td contentEditable onBlur={(e) => handleEditPrice(e, 'CbslQaRate', index)}>{elem.CbslQaRate}</td>
                                            <td contentEditable onBlur={(e) => handleEditPrice(e, 'ClientQcRate', index)}>{elem.ClientQcRate}</td>
                                            <td></td>
                                            <td><button className="btn btn-success" style={{ paddingTop: '0px', paddingBottom: '0px', height: '28px' }} onClick={() => handleSave(elem.id, index)}>Save</button></td>
                                        </tr>
                                    ))}
                                     {location.map((loc, index) => (
                  <tr key={index}>
                    <td>{loc.LocationName}</td>
                    <td colSpan={tableData.length + nonTechTableData.length + 4}></td>
                  </tr>
                ))}
                                </tbody>
                            )
                            }
                        </table>
           </div>)} 

          {nonTechnicalSelected && (
            <div className="row mt-2 ms-0 me-0 search-report-card">
              <table className="table-bordered" style={{ paddingLeft: "5px" }}>
                <thead>
                  <h5 style={{ marginTop: "-15px" }}>
                    Expense Rate(per image)
                  </h5>
                  <button
                    className="btn btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "end",
                    }}
                    onClick={handleShowFullTable}
                  >
                    {showFullTable ? "Hide" : "View All"}
                  </button>
                  <tr>
                    <th>Location</th>
                    {/* <th>Counting</th>
                    <th>Inventory</th>
                    <th>Doc Preparation</th> */}
                    
{nonTechTableData.map((rowData, index) => (
                        <th key={index}>{rowData.TaskName}</th>
                    ))}
                    <th>Total Price</th>
                    <th>Edit Price</th>
                  </tr>
                </thead>
                {showFullTable && (
                  <tbody>
                    {prices &&
                      prices.map((elem, index) => (
                        <tr key={index}>
                          <td>{elem.LocationName}</td>
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "ScanRate", index)
                            }
                          >
                            {elem.ScanRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) => handleEditPrice(e, "QcRate", index)}
                          >
                            {elem.QcRate}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) =>
                              handleEditPrice(e, "IndexRate", index)
                            }
                          >
                            {elem.IndexRate}
                          </td>

                          <td></td>
                          <td>
                            <button
                              className="btn btn-success"
                              style={{
                                paddingTop: "0px",
                                paddingBottom: "0px",
                                height: "28px",
                              }}
                              onClick={() => handleSave(elem.id, index)}
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                       {location.map((loc, index) => (
                  <tr key={index}>
                    <td>{loc.LocationName}</td>
                    <td colSpan={tableData.length + nonTechTableData.length + 4}></td>
                  </tr>
                ))}
                  </tbody>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
      {showPeriodicSummary && (
        <PeriodicSummaryReport
          multipliedData={multipliedData}
          prices={prices}
          editedPrices={editedPrices}
          startDate={fromDate}
          endDate={toDate}
        />
      )}
      {showCumulativeSummary && (
        <CumulativeSummaryReport
          multipliedData={multipliedData}
          editedPrices={editedPrices}
          prices={prices}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default Dashboard;
