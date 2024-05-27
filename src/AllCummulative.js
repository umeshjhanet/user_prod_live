import React, { useEffect, useState } from "react";
import { API_URL } from "./API";
import axios from "axios";

import { priceCount } from "./Components/priceCount";
import { useRef } from 'react';

const AllCummulative = ({ multipliedData, prices, editedPrices }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [locationView, setLocationView] = useState(false);
    const [showModal, setShowModal] = useState(true); // Initially set to true to show the modal
    const [userView, setUserView] = useState(false);
    //const [summaryReport, setSummaryReport] = useState([]);
    const [summaryReport, setSummaryReport] = useState(null); // Initialize as null
    const [locationReport, setLocationReport] = useState();
    const [locationName, setLocationName] = useState("");
    const [detailedReportLocationWise, setDetailedReportLocationWise] = useState();
    const [detailedUserReport, setDetailedUserReport] = useState();
    const [selectedUsername, setSelectedUsername] = useState('');
    const [detailedcsv, setDetailedCsv] = useState(null);
    const [detailedlocationwisecsv, setDetailedLocationWiseCsv] = useState(null);
    const [userwisecsv, setUserWiseCSv] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showConfirmationLocation, setShowConfirmationLocation] = useState(false);
    const [showConfirmationUser, setShowConfirmationUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const ref = useRef(null);    
    const[clickedRowIndex,setClickedRowIndex]=useState('');
     
    const handleLocationView = (locationName) => {
      setShowModal(true); 
      fetchUserDetailed(locationName);
      fetchDetailedLocationWiseReportCsvFile(locationName)
      setLocationView(true);
      setUserView(false);
      console.log("click on location")
  
    };
  
    const handleUserView = (username, locationName, rowIndex) => {
      setLocationView(false);
      setShowModal(true);
      ref.current?.scrollIntoView({ behavior: 'smooth' });
      setSelectedUsername(username);
      setLocationName(locationName);
      console.log("LocationName Fetched", locationName);
      console.log("UserName Fetched", username);
      fetchUserDetailedReport(username, locationName);
  
      setUserView(true);
    };

    const handleExport = () => {
      setShowConfirmation(true);
    };
  
    const handleDetailedExport = () => {
      if (detailedcsv) {
        const link = document.createElement("a");
        link.href = detailedcsv;
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setShowConfirmation(false);
    };
  
    const handleCancelExport = () => {
      setShowConfirmation(false);
    };
  
    const handleLocationExport = () => {
      setShowConfirmationLocation(true);
    }
  
    const handleDetailedLocationWiseExport = () => {
      if (detailedlocationwisecsv) {
        const link = document.createElement("a");
        link.href = detailedlocationwisecsv;
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setShowConfirmationLocation(false);
    };
  
    const handleCancelLocationExport = () => {
      setShowConfirmationLocation(false);
    }
  
    const handleUserExport = () => {
      setShowConfirmationUser(true);
    }
  
  
    const handleUserWiseExport = () => {
      if (userwisecsv) {
        const link = document.createElement("a");
        link.href = userwisecsv;
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setShowConfirmationUser(false)
    }
  
    const handleCancelUserExport = () => {
      setShowConfirmationUser(false);
    }
  
    const fetchUserDetailed = (locationName) => {
      setIsLoading(true);
      axios
        .get(`${API_URL}/alldetailedreportlocationwise`, {
          params: { locationName: locationName },
        })
        .then((response) => {
          setDetailedReportLocationWise(response.data);
          setIsLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false); // Set loading to false even if there's an error
        });
    };
    
  
    const fetchUserDetailedReport = (username, locationName) => {
      setIsLoading(true);
      axios.get(`${API_URL}/alluserdetailedreportlocationwise`, {
        params: {
          username: username,
          locationName: locationName
        }
      })
        .then((response) => setDetailedUserReport(response.data))
        .catch((error) => {
          console.error("Error fetching user detailed report:", error);
        });
    };
  
    const fetchDetailedLocationWiseReportCsvFile = (locationName, startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };
  setIsLoading(true);
      let apiUrl = `${API_URL}/detailedreportlocationwisecsv`;
  
      if (locationName && formattedStartDate && formattedEndDate) {
        apiUrl += `?locationName=${locationName}&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      } else if (locationName) {
        apiUrl += `?locationName=${locationName}`;
      } else if (formattedStartDate && formattedEndDate) {
        apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      }
  
      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setDetailedLocationWiseCsv(url);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
        setIsLoading(false);
    };
  
  
    const fetchUserWiseReportCsvFile = (username, locationName, startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };
  
      let apiUrl = `${API_URL}/userdetailedreportlocationwisecsv`;
  
      if (username && locationName) {
        // If locationName is an array, join its elements with commas
        const locationQueryString = Array.isArray(locationName) ? locationName.join(',') : locationName;
        apiUrl += `?username=${username}&locationName=${locationQueryString}`;
      } else if (formattedStartDate && formattedEndDate) {
        apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      }
  
      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setUserWiseCSv(url);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
    };
    const multiplyLocationData = (locationData, priceData) => {
      if (!locationData || !priceData) return []; // Ensure both data arrays are provided
  
      return locationData.map((report) => {
        const multipliedValues = priceData.map((price) => {
          const multipliedValue = parseFloat(report[price.name]) * parseFloat(price.value);
          return isNaN(multipliedValue) ? 0 : multipliedValue; // Handle NaN values
        });
        return { multipliedValues };
      });
    };
  
    const multipliedLocationData = multiplyLocationData(locationReport, priceCount());
  
    const multiplyUserWiseData = (userWiseData, priceData) => {
      if (!userWiseData || !priceData) return []; // Ensure both data arrays are provided
  
      return userWiseData.map((report) => {
        const multipliedValues = priceData.map((price) => {
          const multipliedValue = parseFloat(report[price.name]) * parseFloat(price.value);
          return isNaN(multipliedValue) ? 0 : multipliedValue; // Handle NaN values
        });
        return { multipliedValues };
      });
    };
  
    const multipliedUserWiseData = multiplyUserWiseData(detailedReportLocationWise, priceCount());
  
    const multiplyUserData = (userData, priceData) => {
      if (!userData || !priceData) return []; // Ensure both data arrays are provided
  
      return userData.map((report) => {
        const multipliedValues = priceData.map((price) => {
          const multipliedValue = parseFloat(report[price.name]) * parseFloat(price.value);
          return isNaN(multipliedValue) ? 0 : multipliedValue; // Handle NaN values
        });
        return { multipliedValues };
      });
    };
  
    const multipliedUserData = multiplyUserData(detailedUserReport, priceCount());
  
    // Use multipliedData in your component as needed
    console.log("MultipliedUserWiseData", multipliedLocationData);
  
    const toggleModal = () => {
      setShowModal(!showModal);
    };
  
    useEffect(() => {
        const fetchSummaryReport = () => {
            setIsLoading(true);
            axios.get(`${API_URL}/summaryreportcummulative`)
              .then((response) => {
                setSummaryReport(response.data);
                setIsLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching summary report:", error);
                setIsLoading(false);
              });
          };
      const fetchLocationReport = () => {
        setIsLoading(true);
        axios
          .get(`${API_URL}/detailedreportcummulative`)
          .then((response) => { 
            setLocationReport(response.data)
          setIsLoading(false);})
          .catch((error) => {
            console.error("Error fetching user data:", error);
            setIsLoading(false);
          });
          
      };
  
      const fetchDetailedReportCsvFile = (startDate, endDate) => {
        const formattedStartDate = startDate ? new Date(startDate) : null;
        const formattedEndDate = endDate ? new Date(endDate) : null;
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        setIsLoading(true);
        let apiUrl = `${API_URL}/detailedreportcsv`;
  
        if (formattedStartDate && formattedEndDate) {
          apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
        }
  
        axios.get(apiUrl, { responseType: "blob" })
          .then((response) => {
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            setDetailedCsv(url);
          })
          .catch((error) => {
            console.error("Error in exporting data:", error);
            setIsLoading(false);
          });
          
      };
  
  
      fetchDetailedReportCsvFile(startDate, endDate);
      // fetchDetailedLocationWiseReportCsvFile([locationName], startDate, endDate);
  
      fetchUserWiseReportCsvFile(selectedUsername, [locationName], startDate, endDate)
  
      fetchSummaryReport();
      fetchLocationReport();
      if (locationName) {
        fetchUserDetailed(locationName);
      }
      fetchUserDetailedReport();
    }, [selectedUsername, locationName, startDate, endDate]);
    // console.log("Location Data", locationReport);
    const Loader = () => (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
    const totalPrice = 0.141;
  
    const handleBackToLocationView = () => {
      setLocationView(true);
      setUserView(false);
    };
  
  console.log("summary report",summaryReport)
  //console.log("Scanned Value", summaryReport.Scanned)
    return (
      <>
      {isLoading && <Loader/>}
        <div className={`container mb-5 ${isLoading ? 'blur' : ''}`}>
          <div className="row mt-3">
            <div className="search-report-card">
              <h4>Summary Report</h4>
              <div className="row ms-2 me-2">

              {summaryReport ? (
        <table className="table-bordered mt-2">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Scanning ADF</th>
              <th>Image QC</th>
              <th>Flagging</th>
              <th>Indexing</th>
              <th>CBSL QA</th>
              <th>Client QA</th>
              <th>Counting</th>
              <th>Inventory</th>
              <th>Doc Preparation</th>
              <th>Guard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{summaryReport.Scanned}</td>
              <td>{summaryReport.QC}</td>
              <td>{summaryReport.Flagging}</td>
              <td>{summaryReport.Indexing}</td>
              <td>{summaryReport.CBSL_QA}</td>
              <td>{summaryReport.Client_QC}</td>
              <td>{summaryReport.Counting}</td>
              <td>{summaryReport.Inventory}</td>
              <td>{summaryReport.DocPreparation}</td>
              <td>{summaryReport.Guard}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
               
              </div>
  
            </div>
          </div>
          <div className="row mt-3">
            <div className="search-report-card">
              <div className="row">
                <div className="col-6">
                  <h4>Location Wise Summary Report</h4>
                </div>
                
                <div className="row">
                <div className="col-2">
                  <p>Total row(s):{locationReport ? locationReport.length : 0}</p>
                </div>
                <div className="col-8"></div>
                <div className="col-2">
                  <button className="btn btn-success" onClick={handleExport}>Export CSV</button>
                </div>
                {showConfirmation && (
                  <div className="confirmation-dialog">
                    <div className="confirmation-content">
                      <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                      <button className="btn btn-success mt-3 ms-5" onClick={handleDetailedExport}>Yes</button>
                      <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelExport}>No</button>
                    </div>
                  </div>
                )}
              </div>
                {showConfirmation && (
                  <div className="confirmation-dialog">
                    <div className="confirmation-content">
                      <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                      <button className="btn btn-success mt-3 ms-5" onClick={handleDetailedExport}>Yes</button>
                      <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelExport}>No</button>
                    </div>
                  </div>
                )}
              </div>
             
              <div className="all-tables row ms-2 me-2">
                <table className="table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Location Name</th>
                      <th>Scanned</th>
                      <th>QC</th>
                      <th>Indexing</th>
                      <th>Flagging</th>
                      <th>CBSL-QA</th>
                      <th>Client-QC</th>
                      <th>Counting</th>
                    <th>Inventory</th>
                    <th>DocPreparation</th>
                    <th>Guard</th>
                      <th>Business Value</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationReport &&
                      locationReport.map((elem, index) => {
                        const rowTotalSum = multipliedLocationData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                        return (
                          <tr onClick={() => handleLocationView(elem.locationname)} key={index} >
                            <td>{index + 1}</td>
                            <td>{elem.LocationName || 0}</td>
                            <td>{elem.Scanned || 0}</td>
                            <td>{elem.QC || 0}</td>
                            <td>{elem.Indexing || 0}</td>
                            <td>{elem.Flagging || 0}</td>
                            <td>{elem.CBSL_QA || 0}</td>
                            <td>{elem.Client_QC || 0}</td>
                            <td>{elem.Counting || 0}</td>
                        <td>{elem.Inventory || 0}</td>
                        <td>{elem.DocPreparation || 0}</td>
                        <td>{elem.Guard || 0}</td>
                            <td>
                              {rowTotalSum.toFixed(2)}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  {locationView && showModal && (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h4 className="modal-title">User Wise Summary Report</h4>
          <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={toggleModal}>
            Close
          </button>
        </div>
          <button type="button" className="close" onClick={toggleModal}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="row mt-3" ref={ref}>
            <div className="search-report-card">
              <div className="row">
              <div className="col-10 d-flex align-items-center">
                      <p className="mb-0 me-8">Total row(s):{detailedReportLocationWise ? detailedReportLocationWise.length : 0}</p>
                    </div>
                <div className="col-2">
                  <button className="btn btn-success" onClick={handleLocationExport}>
                    Export CSV
                  </button>
                </div>
                <div className="col-md-8 text-end">
                  {showConfirmationLocation && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p className="fw-bold">
                          Are you sure you want to export the CSV file?
                        </p>
                        <button className="btn btn-success mt-3 ms-5" onClick={handleDetailedLocationWiseExport}>
                          Yes
                        </button>
                        <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelLocationExport}>
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="all-tables row ms-2 me-2">
                <table className="table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Location</th>
                      <th>User Name</th>
                      <th>Scanned</th>
                      <th>QC</th>
                      <th>Indexing</th>
                      <th>Flagging</th>
                      <th>CBSL-QA</th>
                      <th>Client-QC</th>
                      <th>Counting</th>
                    <th>Inventory</th>
                    <th>DocPreparation</th>
                    <th>Guard</th>
                      <th>Business Value</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => {
                      const rowTotalSum = multipliedUserWiseData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                      return (
                        <tr onClick={() => handleUserView(elem.user_type, elem.locationName)} key={index}>
                          <td>{index + 1}</td>
                          <td>{elem.locationName}</td>
                          <td>{elem.user_type || 0}</td>
                          <td>{elem.Scanned || 0}</td>
                          <td>{elem.QC || 0}</td>
                          <td>{elem.Indexing || 0}</td>
                          <td>{elem.Flagging || 0}</td>
                          <td>{elem.CBSL_QA || 0}</td>
                          <td>{elem.Client_QC || 0}</td>
                          <td>{elem.Counting || 0}</td>
                        <td>{elem.Inventory || 0}</td>
                        <td>{elem.DocPreparation || 0}</td>
                        <td>{elem.Guard || 0}</td>
                          <td>{rowTotalSum.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )}
  
  
  {userView && showModal && (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h4 className="modal-title">User Wise Detailed Report</h4>
          <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={toggleModal}>
            Close
          </button>
        </div>
          <button type="button" className="close" onClick={toggleModal}>&times;</button>
        </div>
        <div className="modal-body">
        <button className="back-arrow-btn" onClick={handleBackToLocationView}>
                    <i className="fa fa-arrow-left"></i> Back
                  </button>
          <div className="row mt-3" ref={ref}>
            <div className="search-report-card">
              <div className="row">
              <div className="col-2">
                      <p>Total row(s):{detailedUserReport ? detailedUserReport.length : 0}</p>
                    </div>
                <div className="col-md-6">
                  <button className="btn btn-success" onClick={handleUserExport}>
                    Export CSV
                  </button>
                </div>
                <div className="col-md-6 text-end">
                  {showConfirmationUser && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p className="fw-bold">
                          Are you sure you want to export the CSV file?
                        </p>
                        <button className="btn btn-success mt-3 ms-5" onClick={handleUserWiseExport}>
                          Yes
                        </button>
                        <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelUserExport}>
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="all-tables row ms-2 me-2">
                <table className="table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Location</th>
                      <th>User Name</th>
                      <th>Date</th>
                      <th>Lot No</th>
                      <th>Scanned</th>
                      <th>QC</th>
                      <th>Indexing</th>
                      <th>Flagging</th>
                      <th>CBSL-QA</th>
                      <th>Client-QC</th>
                      <th>Business Value</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedUserReport && detailedUserReport.map((elem, index) => {
                      const rowTotalSum = multipliedUserData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                      return (
                        <tr onClick={() => handleUserView(elem.user_type, elem.locationName)} key={index}>
                          <td>{index + 1}</td>
                          <td>{elem.locationName}</td>
                          <td>{elem.user_type || 0}</td>
                          <td>{elem.Date}</td>
                                <td>{elem.lotno}</td>
                          <td>{elem.Scanned || 0}</td>
                          <td>{elem.QC || 0}</td>
                          <td>{elem.Indexing || 0}</td>
                          <td>{elem.Flagging || 0}</td>
                          <td>{elem.CBSL_QA || 0}</td>
                          <td>{elem.Client_QC || 0}</td>
                          <td>{rowTotalSum.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  )}
        </div>
      </>
    );
}

export default AllCummulative