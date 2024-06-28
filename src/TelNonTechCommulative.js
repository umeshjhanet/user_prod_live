import React, { useEffect, useState } from 'react'
import { API_URL } from './API';
import axios from 'axios';
import { priceCount } from './Components/priceCount';
import { useRef } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";

const TelNonTechCommulative = ({userData}) => {
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
  const [secondLastColumnTotal, setSecondLastColumnTotal] = useState(0);
  const [lastColumnTotal, setLastColumnTotal] = useState(0);
  const [price, setPrice] = useState([]);
  const [enhancedLocationReport, setEnhancedLocationReport] = useState();
  const ref = useRef(null);
  const [clickedRowIndex, setClickedRowIndex] = useState('');

  const handleLocationView = (locationName) => {
    setShowModal(true);
    console.log(locationName)
    fetchUserDetailed(locationName);
    fetchDetailedLocationWiseReportCsvFile(locationName)
    setLocationView(true);
    setUserView(false);
    console.log("click on location")

  };

  const handleUserView = (username, locationName, rowIndex) => {
    setIsLoading(true);
    setSelectedUsername(username);
    setLocationName(locationName);
    console.log("LocationName Fetched", locationName);
    console.log("UserName Fetched", username);
    fetchUserDetailedReport(username, locationName);
  setTimeout(() => {
    setUserView(true);
    setLocationView(false);
    setShowModal(true);
    setIsLoading(false);
  }, 1000);
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
      .get(`${API_URL}/alldetailedreportlocationwisenontechtelangana`, {
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
    axios.get(`${API_URL}/alluserdetailedreportlocationwisenontechtelangana`, {
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
    let apiUrl = `${API_URL}/alldetailedreportlocationwisecsvnontechtelangana`;

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

    let apiUrl = `${API_URL}/alluserdetailedreportlocationwisecsvnontechtelangana`;

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


  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchSummaryReport = () => {
      setIsLoading(true);
    
      let apiUrl = `${API_URL}/summaryreportnontechtelangana`;
    
      // Check if userData meets the conditions to include the locationName parameter
      const isCBSLUser = Array.isArray(userData.user_roles) && userData.user_roles.includes("CBSL Site User");
      const hasSingleProject = Array.isArray(userData.projects) && userData.projects[0] === 2;
    
      // Use the location name directly
      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
    
      // Check if locationName matches any location name in userData.locations
      const hasMatchingLocation = Array.isArray(userData.locations) && userData.locations.some(location => location.name === locationName);
    
      console.log("LocationName:", locationName);
      console.log("isCBSLUser:", isCBSLUser);
      console.log("userData.user_roles:", userData.user_roles);
      console.log("hasSingleProject:", hasSingleProject);
      console.log("userData.projects:", userData.projects);
      console.log("hasMatchingLocation:", hasMatchingLocation);
      console.log("userData.locations:", userData.locations);
    
      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        apiUrl += `?locationName=${encodeURIComponent(locationName)}`;
        console.log("Modified API URL with locationName:", apiUrl);
      } else {
        console.log("API URL without locationName:", apiUrl);
      }
    
      axios.get(apiUrl)
        .then((response) => {
          console.log("Response data:", response.data);  // Log the response data
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

      let apiUrl = `${API_URL}/detailedreportcummulativenontechtelangana`;

      // Dynamic locationName assignment
      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";

      // Check if userData meets the conditions to include the locationName parameter
      const isCBSLUser = Array.isArray(userData.user_roles) && userData.user_roles.includes("CBSL Site User");
      const hasSingleProject = Array.isArray(userData.projects) && userData.projects[0] === 2;

      // Append "District Court" to locationName
      const locationNameWithDistrictCourt = `${locationName}`;

      // Check if locationNameWithDistrictCourt matches any location name in userData.locations
      const hasMatchingLocation = Array.isArray(userData.locations) && userData.locations.some(location => `${location.name}` === locationNameWithDistrictCourt);

      console.log("LocationName:", locationNameWithDistrictCourt);
      console.log("isCBSLUser:", isCBSLUser);
      console.log("userData.user_roles:", userData.user_roles);
      console.log("hasSingleProject:", hasSingleProject);
      console.log("userData.projects:", userData.projects);
      console.log("hasMatchingLocation:", hasMatchingLocation);
      console.log("userData.locations:", userData.locations);

      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        apiUrl += `?locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
        console.log("Modified API URL with locationName:", apiUrl);
      } else {
        console.log("API URL without locationName:", apiUrl);
      }

      axios
        .get(apiUrl)
        .then((response) => {
          setLocationReport(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching location report:", error);
          setIsLoading(false);
        });
    };

    const fetchDetailedReportCsvFile = (startDate, endDate, userData) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => date.toISOString().split('T')[0];
    
      setIsLoading(true);
      let apiUrl = `${API_URL}/detailedreportcummulativecsvnontechtelangana`;
    
      if (formattedStartDate && formattedEndDate) {
        apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      }
    
      // Check userData structure
      if (!userData || !Array.isArray(userData.user_roles) || !Array.isArray(userData.projects) || !Array.isArray(userData.locations)) {
        console.error("Invalid userData structure:", userData);
        setIsLoading(false);
        return;
      }
    
      // Dynamic locationName assignment
      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
    
      // Check if userData meets the conditions to include the locationName parameter
      const isCBSLUser = userData.user_roles.includes("CBSL Site User");
      const hasSingleProject = userData.projects[0] === 2;
    
      // Append "District Court" to locationName
      const locationNameWithDistrictCourt = `${locationName}`;
    
      // Check if locationNameWithDistrictCourt matches any location name in userData.locations
      const hasMatchingLocation = userData.locations.some(location => `${location.name}` === locationNameWithDistrictCourt);
    
      console.log("LocationName:", locationNameWithDistrictCourt);
      console.log("isCBSLUser:", isCBSLUser);
      console.log("userData.user_roles:", userData.user_roles);
      console.log("hasSingleProject:", hasSingleProject);
      console.log("userData.projects:", userData.projects);
      console.log("hasMatchingLocation:", hasMatchingLocation);
      console.log("userData.locations:", userData.locations);
    
      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        const separator = apiUrl.includes('?') ? '&' : '?';
        apiUrl += `${separator}locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
        console.log("Modified API URL with locationName:", apiUrl);
      } else {
        console.log("API URL without locationName:", apiUrl);
      }
    
      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setDetailedCsv(url);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
          setIsLoading(false);
        });
    };
    // const fetchSummaryReport = () => {
    //   setIsLoading(true);
    //   axios.get(`${API_URL}/summaryreportnontechtelangana`)
    //     .then((response) => {
    //       setSummaryReport(response.data);
    //       setIsLoading(false);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching summary report:", error);
    //       setIsLoading(false);
    //     });
    // };
    // const fetchLocationReport = () => {
    //   setIsLoading(true);
    //   axios
    //     .get(`${API_URL}/detailedreportcummulativenontechtelangana`)
    //     .then((response) => {
    //       setLocationReport(response.data)
    //       setIsLoading(false);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching user data:", error);
    //       setIsLoading(false);
    //     });

    // };
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
    // const fetchDetailedReportCsvFile = (startDate, endDate) => {
    //   const formattedStartDate = startDate ? new Date(startDate) : null;
    //   const formattedEndDate = endDate ? new Date(endDate) : null;
    //   const formatDate = (date) => {
    //     return date.toISOString().split('T')[0];
    //   };
    //   setIsLoading(true);
    //   let apiUrl = `${API_URL}/detailedreportcummulativecsvnontechtelangana`;

    //   if (formattedStartDate && formattedEndDate) {
    //     apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    //   }

    //   axios.get(apiUrl, { responseType: "blob" })
    //     .then((response) => {
    //       const blob = new Blob([response.data], { type: "text/csv" });
    //       const url = window.URL.createObjectURL(blob);
    //       setDetailedCsv(url);
    //     })
    //     .catch((error) => {
    //       console.error("Error in exporting data:", error);
    //       setIsLoading(false);
    //     });

    // };


    fetchDetailedReportCsvFile(startDate, endDate,userData);
    // fetchDetailedLocationWiseReportCsvFile([locationName], startDate, endDate);

    fetchUserWiseReportCsvFile(selectedUsername, [locationName], startDate, endDate)
    fetchPrices();
    fetchSummaryReport();
    fetchLocationReport();
    if (locationName) {
      fetchUserDetailed(locationName);
    }
    fetchUserDetailedReport();
  }, [selectedUsername, locationName, startDate, endDate,userData]);
  // console.log("Location Data", locationReport);
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );


  const calculateColumnSum = () => {
    let Inventory = 0;
    let Counting = 0;
    let DocPreparation = 0;
    let Guard = 0;
    let totalExpenseRate = 0;
  
    if (detailedReportLocationWise && Array.isArray(detailedReportLocationWise)) {
      detailedReportLocationWise.forEach((elem) => {
        Inventory += parseInt(elem.Inventory) || 0;
        Counting += parseInt(elem.Counting) || 0;
        DocPreparation += parseInt(elem.DocPreparation) || 0;
        Guard += parseInt(elem.Guard) || 0;
        const normalizeName = (name) => name ? name.replace(/district court/gi, "").trim() : "";
        const priceData = price.find(
          
          (price) => normalizeName(price.LocationName) === normalizeName(elem.locationName)
        );
        const countingRate = priceData?.CountingRate || 0;
        const inventoryRate = priceData?.InventoryRate || 0;
        const docPreparationRate = priceData?.DocPreparationRate || 0;
        const guardRate = priceData?.GuardRate || 0;
        const countingRateTotal = (parseInt(elem.Counting) || 0) * countingRate;
        const inventoryRateTotal = (parseInt(elem.Inventory) || 0) * inventoryRate;
        const docPreparationRateTotal = (parseInt(elem.DocPreparation) || 0) * docPreparationRate;
        const otherRate = (parseInt(elem.Guard) || 0) * guardRate;
  
        const totalRate =countingRateTotal + inventoryRateTotal + docPreparationRateTotal + otherRate;
  
        totalExpenseRate += totalRate;
      });
    }
  
    return {
      Inventory,
      Counting,
      DocPreparation,
      Guard,
      totalExpenseRate,
    };
  };

  const calculateColumnSumUser = () => {
    let Inventory = 0;
    let Counting = 0;
    let DocPreparation = 0;
    let Guard = 0;
    let totalExpenseRate = 0;
  
    if (detailedUserReport && Array.isArray(detailedUserReport)) {
      detailedUserReport.forEach((elem) => {
        Inventory += parseInt(elem.Inventory) || 0;
        Counting += parseInt(elem.Counting) || 0;
        DocPreparation += parseInt(elem.DocPreparation) || 0;
        Guard += parseInt(elem.Guard) || 0;
        const normalizeName = (name) => name ? name.replace(/district court/gi, "").trim() : "";
        const priceData = price.find(
          
          (price) => normalizeName(price.LocationName) === normalizeName(elem.locationName)
        );
        const countingRate = priceData?.CountingRate || 0;
        const inventoryRate = priceData?.InventoryRate || 0;
        const docPreparationRate = priceData?.DocPreparationRate || 0;
        const guardRate = priceData?.GuardRate || 0;
  
        const countingRateTotal = (parseInt(elem.Counting) || 0) * countingRate;
        const inventoryRateTotal = (parseInt(elem.Inventory) || 0) * inventoryRate;
        const docPreparationRateTotal = (parseInt(elem.DocPreparation) || 0) * docPreparationRate;
        const otherRate = (parseInt(elem.Guard) || 0) * guardRate;
  
        const totalRate =countingRateTotal + inventoryRateTotal + docPreparationRateTotal + otherRate;
  
        totalExpenseRate += totalRate;
      });
    }
  
    return {
      Inventory,
      Counting,
      DocPreparation,
      Guard,
      totalExpenseRate,
    };
  };
  
  const columnSums = calculateColumnSum();
  const columnSumsUser = calculateColumnSumUser();


  useEffect(() => {
    if (price && locationReport && price.length > 0 && locationReport.length > 0) {
      // const normalizeName = (name) => (name ? name.replace(/district court/gi, '').trim() : '');

      const multipliedData = locationReport.map(location => {
        const normalizedLocationName = location.LocationName;

        const prices = price.find(p => p.LocationName === normalizedLocationName);

        if (prices) {
          const multipliedLocation = {
            ...location,
            Counting: Number(location.Counting) * prices.CountingRate,
            Inventory: Number(location.Inventory) * prices.InventoryRate,
            DocPreparation: Number(location.DocPreparation) * prices.DocPreparationRate,
            Guard: Number(location.Guard) * prices.GuardRate,
          };

          const rowSum =
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
        const normalizedLocationName = location.LocationName;
        const correspondingMultiplied = multipliedData.find(m => m.LocationName === normalizedLocationName);
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

  const handleBackToLocationView = () => {
    setLocationView(true);
    setUserView(false);
  };

  console.log("Locations", locationReport);
  console.log("Prices", price);
  //console.log("Scanned Value", summaryReport.Scanned)
  return (
    <>
      {isLoading && <Loader />}
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
                      <th>Inventory</th>
                      <th>Counting</th>
                      <th>Doc Pre</th>
                      <th>Other</th>
                      <th>Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{summaryReport.Inventory}</td>
                      <td>{summaryReport.Counting}</td>
                      <td>{summaryReport.DocPreparation}</td>
                      <td>{summaryReport.Guard}</td>
                      <td>{lastColumnTotal.toLocaleString()}</td>
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
                    <th>Inventory</th>
                    <th>Counting</th>
                    <th>Doc Pre</th>
                    <th>Other</th>
                    <th>Expense</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedLocationReport && enhancedLocationReport.map((elem, index) => (

                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td onClick={() => handleLocationView(elem.LocationName)}>{elem.LocationName || 0}</td>
                      <td>{isNaN(parseInt(elem.Inventory)) ? 0 : parseInt(elem.Inventory).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Counting)) ? 0 : parseInt(elem.Counting).toLocaleString()}</td>
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
        {locationView && !isLoading && showModal && (
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
                      <table className="table-modal mt-2">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Location</th>
                            <th>User Name</th>
                            <th>Inventory</th>
                            <th>Counting</th>
                            <th>Doc Pre</th>
                            <th>Other</th>
                            <th>Expense</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => {
                            const priceData = price.find(price => price.LocationName === elem.locationName);

                            // Calculate rates for each activity
                            const countingRate = elem.Counting * (priceData ? priceData.CountingRate : 0);
                            const inventoryRate = elem.Inventory * (priceData ? priceData.InventoryRate : 0);
                            const docPreparationRate = elem.DocPreparation * (priceData ? priceData.DocPreparationRate : 0);
                            const otherRate = elem.Guard * (priceData ? priceData.GuardRate : 0);

                            // Calculate total expense rate
                            const totalRate = countingRate + inventoryRate + docPreparationRate + otherRate;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationName}</td>
                                <td onClick={() => handleUserView(elem.user_type, elem.locationName)}>{elem.user_type || 0}</td>
                                <td>{elem.Inventory || 0}</td>
                                <td>{elem.Counting || 0}</td>
                                <td>{elem.DocPreparation || 0}</td>
                                <td>{elem.Guard || 0}</td>
                                <td>{totalRate.toLocaleString()}</td>
                                <td></td>
                              </tr>
                            );
                          })}
                          <tr style={{ color: "black" }}>
                    <td colSpan="3">
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{columnSums.Inventory.toLocaleString()}</strong>
                    </td>
                    <td>
                      <strong>{columnSums.Counting.toLocaleString()}</strong>
                    </td> 
                    <td>
                      <strong>{columnSums.DocPreparation.toLocaleString()}</strong>
                    </td>
                    <td>
                      <strong>{columnSums.Guard.toLocaleString()}</strong>
                    </td>
                    <td>
                      {/* Assuming `Expense Rate` sum calculation logic needs to be added if required */}
                      <strong>{columnSums.totalExpenseRate.toLocaleString()}</strong>
                    </td>
                  </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}


        {userView && !isLoading && showModal && (
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
                <div className="col-1">
                  <IoArrowBackCircle style={{ height: '30px', width: '30px' }} onClick={handleBackToLocationView} />
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
                            <th>Inventory</th>
                            <th>Counting</th>
                            <th>Doc Pre</th>
                            <th>Other</th>
                            <th>Expense</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedUserReport && detailedUserReport.map((elem, index) => {
                            const priceData = price.find(price => price.LocationName === elem.locationName);

                            // Calculate rates for each activity
                            const countingRate = elem.Counting * (priceData ? priceData.CountingRate : 0);
                            const inventoryRate = elem.Inventory * (priceData ? priceData.InventoryRate : 0);
                            const docPreparationRate = elem.DocPreparation * (priceData ? priceData.DocPreparationRate : 0);
                            const otherRate = elem.Guard * (priceData ? priceData.GuardRate : 0);

                            // Calculate total expense rate
                            const totalRate = countingRate + inventoryRate + docPreparationRate + otherRate;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationName}</td>
                                <td>{elem.user_type || 0}</td>
                                <td>{elem.Date}</td>
                                <td>{elem.Inventory || 0}</td>
                                <td>{elem.Counting || 0}</td>
                                <td>{elem.DocPreparation || 0}</td>
                                <td>{elem.Guard || 0}</td>
                                <td>{totalRate.toLocaleString()}</td>
                                <td></td>
                              </tr>
                            );
                          })}
                          <tr style={{ color: "black" }}>
                    <td colSpan="4">
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{columnSumsUser.Inventory.toLocaleString()}</strong>
                    </td>
                    <td>
                      <strong>{columnSumsUser.Counting.toLocaleString()}</strong>
                    </td> 
                    <td>
                      <strong>{columnSumsUser.DocPreparation.toLocaleString()}</strong>
                    </td>
                    <td>
                      <strong>{columnSumsUser.Guard.toLocaleString()}</strong>
                    </td>
                    <td>
                      {/* Assuming `Expense Rate` sum calculation logic needs to be added if required */}
                      <strong>{columnSumsUser.totalExpenseRate.toLocaleString()}</strong>
                    </td>
                  </tr>
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

export default TelNonTechCommulative