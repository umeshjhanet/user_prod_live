import React, { useEffect, useState } from 'react'
import { API_URL } from './API';
import axios from 'axios';
import { priceCount } from './Components/priceCount';
import { useRef } from 'react';
import { IoMdCloseCircle } from "react-icons/io";

const AllPeriodic = ({ multipliedData, startDate, endDate }) => {
    const [locationView, setLocationView] = useState(false);
  const [userView, setUserView] = useState(false);
  const [summaryReport, setSummaryReport] = useState(null);
  const [locationReport, setLocationReport] = useState();
  const [locationName, setLocationName] = useState("");
  const [showModal, setShowModal] = useState(true);
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
  const [secondLastColumnTotal, setSecondLastColumnTotal] = useState(0);
  const [lastColumnTotal, setLastColumnTotal] = useState(0);
  const [price, setPrice] = useState([]);
  const [enhancedLocationReport, setEnhancedLocationReport] = useState([]);
  const ref = useRef(null);

  // useEffect(() => {
  //   if (locationView || userView) {
  //     // Scroll to the referenced div when locationView or userView changes
  //     ref.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [locationView, userView]);

  const handleLocationView = (locationName) => {
    setShowModal(true);
    fetchUserDetailed(locationName, startDate, endDate);
    fetchDetailedLocationWiseReportCsvFile(locationName, startDate, endDate)
    setLocationView(true);
    setUserView(false);
  };

  const handleUserView = (username, locationName) => {
    setLocationView(false);
    setShowModal(true);
    setSelectedUsername(username);
    setLocationName(locationName);
    console.log("LocationName Fetched", locationName);
    console.log("UserName Fetched", username);
    fetchUserDetailedReport(username, locationName, startDate, endDate);
    setUserView(true);
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleBackToLocationView = () => {
    setLocationView(true);
    setUserView(false);
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

  const fetchUserDetailed = (locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    setIsLoading(true);
    axios
      .get(`${API_URL}/alldetailedreportlocationwise`, {
        params: {
          locationName: locationName,
          startDate: formattedStartDate ? formatDate(formattedStartDate) : null,
          endDate: formattedEndDate ? formatDate(formattedEndDate) : null
        },
      })
      .then((response) => {
        setDetailedReportLocationWise(response.data)
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      });
  };


  const fetchUserDetailedReport = (username, locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    setIsLoading(true);
    axios.get(`${API_URL}/alluserdetailedreportlocationwise`, {
      params: {
        username: username,
        locationName: locationName,
        startDate: formattedStartDate ? formatDate(formattedStartDate) : null,
        endDate: formattedEndDate ? formatDate(formattedEndDate) : null
      }
    })
      .then((response) => {
        setDetailedUserReport(response.data)
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user detailed report:", error);
        setIsLoading(false);
      });
  };

  const fetchDetailedLocationWiseReportCsvFile = (locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    let apiUrl = `${API_URL}/alldetailedreportlocationwisecsv`;

    if (locationName && formattedStartDate && formattedEndDate) {
      apiUrl += `?locationName=${locationName}&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    } else if (locationName) {
      apiUrl += `?locationName=${locationName}`;
    } else if (formattedStartDate && formattedEndDate) {
      apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    }
    setIsLoading(true);
    axios.get(apiUrl, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        setDetailedLocationWiseCsv(url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error in exporting data:", error);
        setIsLoading(false);
      });
  };


  const fetchUserWiseReportCsvFile = (username, locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    let apiUrl = `${API_URL}/alluserdetailedreportlocationwisecsv`;

    if (username && locationName) {
      const locationQueryString = Array.isArray(locationName) ? locationName.join(',') : locationName;
      apiUrl += `?username=${username}&locationName=${locationQueryString}`;
    }
    if (formattedStartDate && formattedEndDate) {
      const separator = apiUrl.includes('?') ? '&' : '?';
      apiUrl += `${separator}startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    }
    setIsLoading(true);
    axios.get(apiUrl, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        setUserWiseCSv(url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error in exporting data:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchSummaryReport = async () => {
      setIsLoading(true);
      try {
        const formattedStartDate = startDate ? new Date(startDate) : null;
        const formattedEndDate = endDate ? new Date(endDate) : null;
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };

        let apiUrl = `${API_URL}/summaryreportcummulative`;
        const queryParams = {};
        if (formattedStartDate && formattedEndDate) {
          apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
        }

        const response = await axios.get(apiUrl, { params: queryParams });
        setSummaryReport(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setIsLoading(false);
      }
    };

    const fetchLocationReport = async () => {
      setIsLoading(true);
      try {
        const formattedStartDate = startDate ? new Date(startDate) : null;
        const formattedEndDate = endDate ? new Date(endDate) : null;
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };

        let apiUrl = `${API_URL}/detailedreportcummulative`;
        const queryParams = {};
        if (formattedStartDate && formattedEndDate) {
          apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
        }

        const response = await axios.get(apiUrl, { params: queryParams });
        setLocationReport(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setIsLoading(false);
      }
    };

    const fetchDetailedReportCsvFile = (startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      let apiUrl = `${API_URL}/detailedreportcummulativecsv`;

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
        });
    };
    const fetchPrices = () => {
      setIsLoading(true); // Set loading to true when fetching data
      axios
        .get(`${API_URL}/getbusinessrate`)
        .then((response) => {
          setPrice(response.data);
          setIsLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false); // Set loading to false in case of error
        });
    };
    fetchPrices();

    fetchSummaryReport();
    fetchLocationReport();
    fetchDetailedReportCsvFile(startDate, endDate);
    fetchDetailedLocationWiseReportCsvFile([locationName], startDate, endDate);
    fetchUserWiseReportCsvFile(selectedUsername, [locationName], startDate, endDate);

  }, [selectedUsername, locationName, startDate, endDate]);


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
  useEffect(() => {
    if (price && locationReport && price.length > 0 && locationReport.length > 0) {
      const normalizeName = (name) => (name ? name.toLowerCase().replace(/district court/gi, '').trim() : '');

      const multipliedData = locationReport.map(location => {
        const normalizedLocationName = normalizeName(location.LocationName);

        const prices = price.find(p => normalizeName(p.LocationName) === normalizedLocationName);

        if (prices) {
          const multipliedLocation = {
            ...location,
            Scanned: Number(location.Scanned || 0) * (prices.ScanRate || 0),
            QC: Number(location.QC || 0) * (prices.QcRate || 0),
            Client_QC: Number(location.Client_QC || 0) * (prices.ClientQcRate || 0),
            Flagging: Number(location.Flagging || 0) * (prices.FlagRate || 0),
            Indexing: Number(location.Indexing || 0) * (prices.IndexRate || 0),
            CBSL_QA: Number(location.CBSL_QA || 0) * (prices.CbslQaRate || 0),
            Counting: Number(location.Counting || 0) * (prices.Counting || 0),
            Inventory: Number(location.Inventory || 0) * (prices.Inventory || 0),
            DocPreparation: Number(location.DocPreparation || 0) * (prices.DocPreparation || 0),
            Guard: Number(location.Guard || 0) * (prices.Guard || 0),
          };

          const rowSum =
            multipliedLocation.Scanned +
            multipliedLocation.QC +
            multipliedLocation.Client_QC +
            multipliedLocation.Flagging +
            multipliedLocation.Indexing +
            multipliedLocation.CBSL_QA +
            multipliedLocation.Counting +
            multipliedLocation.Inventory +
            multipliedLocation.DocPreparation +
            multipliedLocation.Guard;

          multipliedLocation.rowSum = rowSum;

          return multipliedLocation;
        } else {
          console.error(`No matching price found for location: ${location.LocationName}`);
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
        const normalizedLocationName = normalizeName(location.LocationName);
        const correspondingMultiplied = multipliedData.find(m => normalizeName(m.LocationName) === normalizedLocationName);
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
  console.log("Location Data", enhancedLocationReport);
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

              {summaryReport && (
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
              <th>Expense Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{isNaN(parseInt(summaryReport.Scanned)) ? 0 : parseInt(summaryReport.Scanned).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.QC)) ? 0 : parseInt(summaryReport.QC).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.Flagging)) ? 0 : parseInt(summaryReport.Flagging).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.Indexing)) ? 0 : parseInt(summaryReport.Indexing).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.CBSL_QA)) ? 0 : parseInt(summaryReport.CBSL_QA).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.Client_QC)) ? 0 : parseInt(summaryReport.Client_QC).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.Counting)) ? 0 : parseInt(summaryReport.Counting).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.Inventory)) ? 0 : parseInt(summaryReport.Inventory).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.DocPreparation)) ? 0 : parseInt(summaryReport.DocPreparation).toLocaleString()}</td>
              <td>{isNaN(parseInt(summaryReport.Guard)) ? 0 : parseInt(summaryReport.Guard).toLocaleString()}</td>
              <td>{lastColumnTotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
     
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
                  <th>Expense Rate</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
              {enhancedLocationReport && enhancedLocationReport.map((elem, index) => (
                    <tr  key={index}>
                      <td>{index + 1}</td>
                      <td onClick={() => handleLocationView(elem.LocationName)}>{elem.LocationName || 0}</td>
                      <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Counting)) ? 0 : parseInt(elem.Counting).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Inventory)) ? 0 : parseInt(elem.Inventory).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.DocPreparation)) ? 0 : parseInt(elem.DocPreparation).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Guard)) ? 0 : parseInt(elem.Guard).toLocaleString()}</td>
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
                  <div className="modal-table row ms-2 me-2">
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
                          <th>Expense Rate</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => {
                          const rowTotalSum = multipliedUserWiseData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
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
                              <td>{elem.Counting || 0}</td>
                        <td>{elem.Inventory || 0}</td>
                        <td>{elem.DocPreparation || 0}</td>
                        <td>{elem.Guard || 0}</td>
                              <td>{isNaN(parseInt(rowTotalSum.toFixed(2))) ? 0 : parseInt(rowTotalSum.toFixed(2)).toLocaleString()}</td>
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
                          <th>Counting</th>
                          <th>Inventory</th>
                          <th>DocPreparation</th>
                          <th>Guard</th>
                          <th>Expense Rate</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedUserReport && detailedUserReport.map((elem, index) => {
                          const rowTotalSum = multipliedUserData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
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
                              <td>{elem.Counting || 0}</td>
                        <td>{elem.Inventory || 0}</td>
                        <td>{elem.DocPreparation || 0}</td>
                        <td>{elem.Guard || 0}</td>
                              <td>{isNaN(parseInt(rowTotalSum.toFixed(2))) ? 0 : parseInt(rowTotalSum.toFixed(2)).toLocaleString()}</td>
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
  )
}

export default AllPeriodic