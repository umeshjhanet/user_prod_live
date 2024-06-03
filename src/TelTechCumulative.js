import React, { useEffect, useState } from "react";
import { API_URL } from "./API";
import axios from "axios";
import { priceCount } from "./Components/priceCount";
import { useRef } from 'react';
import { IoMdCloseCircle } from "react-icons/io";

const TelTechCumulative = ({ multipliedData, prices, editedPrices }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationView, setLocationView] = useState(false);
  const [showModal, setShowModal] = useState(true); // Initially set to true to show the modal
  const [userView, setUserView] = useState(false);
  const [summaryReport, setSummaryReport] = useState();
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
  const [clickedRowIndex, setClickedRowIndex] = useState('');
  const [price, setPrice] = useState([]);
  const[enhancedLocationReport,setEnhancedLocationReport] = useState([]);
  const [secondLastColumnTotal, setSecondLastColumnTotal] = useState(0);
  const [lastColumnTotal, setLastColumnTotal] = useState(0);
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
    setSelectedUsername(username);
    setLocationName(locationName);
    console.log("LocationName Fetched", locationName);
    console.log("UserName Fetched", username);
    fetchUserDetailedReport(username, locationName);

    setUserView(true);
  };
  //sdfd
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
      .get(`${API_URL}/teldetailedreportlocationwise`, {
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
    axios.get(`${API_URL}/teluserdetailedreportlocationwise`, {
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
    let apiUrl = `${API_URL}/teldetailedreportlocationwisecsv`;

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

    let apiUrl = `${API_URL}/teluserdetailedreportlocationwisecsv`;

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
      setIsLoading(true); // Set loading to true when fetching data
      axios
        .get(`${API_URL}/telsummaryreport`)
        .then((response) => {
          setSummaryReport(response.data);
          setIsLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false); // Set loading to false in case of error
        });
    };
    const fetchLocationReport = () => {
      setIsLoading(true);
      axios
        .get(`${API_URL}/teldetailedReport`)
        .then((response) => {
          setLocationReport(response.data)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        });

    };
    const fetchPrices = () => {
      setIsLoading(true); // Set loading to true when fetching data
      axios
        .get(`${API_URL}/telgetbusinessrate`)
        .then((response) => {
          setPrice(response.data);
          setIsLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false); // Set loading to false in case of error
        });
    };
    const fetchDetailedReportCsvFile = (startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };
      setIsLoading(true);
      let apiUrl = `${API_URL}/teldetailedreportcsv`;

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
fetchPrices();
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
  

  const handleBackToLocationView = () => {
    setLocationView(true);
    setUserView(false);
  };

  useEffect(() => {
    if (price && locationReport && price.length > 0 && locationReport.length > 0) {
      const normalizeName = (name) => (name ? name.toLowerCase().replace(/district court/gi, '').trim() : '');

      const multipliedData = locationReport.map(location => {
        const normalizedLocationName = normalizeName(location.locationname);

        const prices = price.find(p => normalizeName(p.LocationName) === normalizedLocationName);

        if (prices) {
          const multipliedLocation = {
            ...location,
            Scanned: Number(location.Scanned) * prices.ScanRate,
            QC: Number(location.QC) * prices.QcRate,
            Client_QC: Number(location.Client_QC) * prices.ClientQcRate,
            Flagging: Number(location.Flagging) * prices.FlagRate,
            Indexing: Number(location.Indexing) * prices.IndexRate,
            CBSL_QA: Number(location.CBSL_QA) * prices.CbslQaRate,
          };

          const rowSum =
            multipliedLocation.Scanned +
            multipliedLocation.QC +
            multipliedLocation.Client_QC +
            multipliedLocation.Flagging +
            multipliedLocation.Indexing +
            multipliedLocation.CBSL_QA;

          multipliedLocation.rowSum = rowSum;

          return multipliedLocation;
        } else {
          console.error(`No matching price found for location: ${location.locationname}`);
          return {
            ...location,
            Scanned: 0,
            QC: 0,
            Client_QC: 0,
            Flagging: 0,
            Indexing: 0,
            CBSL_QA: 0,
            Counting: 0,
            Inventory: 0,
            DocPreparation: 0,
            Guard: 0,
            rowSum: 0,
          };
        }
      });

      const enhancedLocationReport = locationReport.map(location => {
        const normalizedLocationName = normalizeName(location.locationname);
        const correspondingMultiplied = multipliedData.find(m => normalizeName(m.locationname) === normalizedLocationName);
        return {
          ...location,
          rowSum: correspondingMultiplied ? correspondingMultiplied.rowSum : 0,
        };
      });

      setEnhancedLocationReport(enhancedLocationReport);
      const sumOfRowSums = enhancedLocationReport.reduce((acc, curr) => acc + curr.rowSum, 0);
      setSecondLastColumnTotal(sumOfRowSums);
      console.log("Total", sumOfRowSums);
      console.log(enhancedLocationReport);
    }
  }, [price, locationReport]);

  useEffect(() => {
    if (enhancedLocationReport && enhancedLocationReport.length > 0) {
      const sumOfLastColumn = enhancedLocationReport.reduce((acc, curr) => acc + curr.rowSum, 0);
      console.log("Sum of Last Column", sumOfLastColumn);
      setLastColumnTotal(sumOfLastColumn);
    }
  }, [enhancedLocationReport]);

console.log("Prices",price);
console.log("LOCations",locationReport);

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
                    <th>Scanned</th>
                    <th>QC</th>
                    <th>Indexing</th>
                    <th>Flagging</th>
                    <th>CBSL-QA</th>
                    <th>Client-QC</th>
                    <th>Expense Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {summaryReport && summaryReport.map((elem, index) => (
                      <>
                        <td key={index}>{index + 1}</td>
                        <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                        <td>{lastColumnTotal.toLocaleString()}</td>
                      </>
                    ))}
                  </tr>
                </tbody>
              </table>

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
                    <th>Expense Rate</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedLocationReport && enhancedLocationReport.map((elem, index) => (
                    <tr  key={index}>
                      <td>{index + 1}</td>
                      <td onClick={() => handleLocationView(elem.locationname)}>{elem.locationname || 0}</td>
                      <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                      <td>{elem.rowSum ? elem.rowSum.toLocaleString() : 0}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {locationView && showModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <div className="modal-header" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                <h6 className="ms-2" style={{ color: "white" }}>
                  User Wise Summary Report
                </h6>
                <button type="button" className="btn btn-danger" onClick={toggleModal}>
                  <IoMdCloseCircle />
                </button>
                <button type="button" className="close" onClick={toggleModal}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="row " ref={ref}>
                  <div className="search-report-card">
                    <div className="row" style={{ marginTop: '-10px' }}>
                      <div className="col-10 d-flex align-items-center">
                        <p className="mb-0 me-8" >Total row(s): {detailedReportLocationWise ? detailedReportLocationWise.length : 0}</p>
                      </div>
                      <div className="col-2">
                        <button className="btn btn-success" onClick={handleLocationExport} style={{ padding: '2px' }}>
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
                    <div className="modal-table row ms-2 me-2">
                      <table className="table-modal mt-2">
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
                            <th>Expense Rate</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => {
                            // const rowTotalSum = multipliedUserWiseData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                            return (
                              <tr  key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationName}</td>
                                <td onClick={() => handleUserView(elem.user_type, elem.locationName)}>{elem.user_type || 0}</td>
                                <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                                {/* <td>{isNaN(parseInt(rowTotalSum.toFixed(2))) ? 0 : parseInt(rowTotalSum.toFixed(2)).toLocaleString()}</td> */}
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
              <div className="modal-header" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                <h6 className="" style={{ color: "white" }}>
                  User Wise Detailed Report
                </h6>
                <button type="button" className="btn btn-danger" onClick={toggleModal}>
                  <IoMdCloseCircle />
                </button>
              </div>
              <div className="row">
                <div className="col-11"></div>
                <div className="col-1" style={{ textAlign: 'right' }}>
                  <button className="btn btn-success" onClick={handleBackToLocationView}>
                    <i className="fa fa-arrow-left"></i> Back
                  </button>
                </div>


              </div>
              <div className="modal-body">

                <div className="row mt-3" ref={ref}>
                  <div className="search-report-card">
                    <div className="row">
                      <div className="col-2">
                        <p>Total row(s):{detailedUserReport ? detailedUserReport.length : 0}</p>
                      </div>
                      <div className="col-8"></div>
                      <div className="col-md-2">
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
                    <div className="modal-table row ms-2 me-2">
                      <table className="table-modal mt-2">
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
                            <th>Expense Rate</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedUserReport && detailedUserReport.map((elem, index) => {
                            // const rowTotalSum = multipliedUserData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                            return (
                              <tr  key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationName}</td>
                                <td>{elem.user_type || 0}</td>
                                <td>{elem.Date}</td>
                                <td>{elem.lotno}</td>
                                <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                                {/* <td>{isNaN(parseInt(rowTotalSum.toFixed(2))) ? 0 : parseInt(rowTotalSum.toFixed(2)).toLocaleString()}</td> */}
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
};

export default TelTechCumulative;




