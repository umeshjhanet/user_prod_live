import React, { useEffect, useState } from 'react'
import { API_URL } from './API';
import axios from 'axios';
import { priceCount } from './Components/priceCount';
import { useRef } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";


const PeriodicSummaryReport = ({ multipliedData, startDate, endDate, userData }) => {

  const [locationView, setLocationView] = useState(false);
  const [userView, setUserView] = useState(false);
  const [summaryReport, setSummaryReport] = useState();
  const [price, setPrice] = useState([]);
  const [enhancedLocationReport, setEnhancedLocationReport] = useState([]);
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
  const ref = useRef(null);



  const handleLocationView = (locationName) => {
    setShowModal(true);
    fetchUserDetailed(locationName, startDate, endDate);
    fetchDetailedLocationWiseReportCsvFile(locationName, startDate, endDate)
    setLocationView(true);
    setUserView(false);
  };

  const handleUserView = (username, locationName, rowIndex) => {
    setIsLoading(true);
    setSelectedUsername(username);
    setLocationName(locationName);
    console.log("LocationName Fetched", locationName);
    console.log("UserName Fetched", username);
    fetchUserDetailedReport(username, locationName,startDate,endDate);
    setTimeout(() => {
      setUserView(true);
      setLocationView(false);
      setShowModal(true);
      setIsLoading(false);
    }, 1000);
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


  const calculateColumnSum = () => {
    let Scanned = 0;
    let QC = 0;
    let Flagging = 0;
    let Indexing = 0;
    let CBSL_QA = 0;
    let Client_QC = 0;
    let totalExpenseRate = 0;

    if (detailedReportLocationWise && Array.isArray(detailedReportLocationWise)) {
      detailedReportLocationWise.forEach((elem) => {
        Scanned += parseInt(elem.Scanned) || 0;
        QC += parseInt(elem.QC) || 0;
        Flagging += parseInt(elem.Flagging) || 0;
        Indexing += parseInt(elem.Indexing) || 0;
        CBSL_QA += parseInt(elem.CBSL_QA) || 0;
        Client_QC += parseInt(elem.Client_QC) || 0;
        const normalizeName = (name) => name ? name.replace(/district court/gi, "").trim() : "";
        const priceData = price.find(

          (price) => normalizeName(price.LocationName) === normalizeName(elem.locationName)
        );

        const scanRate = priceData?.ScanRate || 0;
        const qcRate = priceData?.QcRate || 0;
        const indexRate = priceData?.IndexRate || 0;
        const flagRate = priceData?.FlagRate || 0;
        const cbslQaRate = priceData?.CbslQaRate || 0;
        const clientQcRate = priceData?.ClientQcRate || 0;
        const scannedRate = (parseInt(elem.Scanned) || 0) * scanRate;
        const qcRateTotal = (parseInt(elem.QC) || 0) * qcRate;
        const indexRateTotal = (parseInt(elem.Indexing) || 0) * indexRate;
        const flagRateTotal = (parseInt(elem.Flagging) || 0) * flagRate;
        const cbslQaRateTotal = (parseInt(elem.CBSL_QA) || 0) * cbslQaRate;
        const clientQcRateTotal = (parseInt(elem.Client_QC) || 0) * clientQcRate;

        const totalRate = scannedRate + qcRateTotal + indexRateTotal + flagRateTotal + cbslQaRateTotal + clientQcRateTotal;

        totalExpenseRate += totalRate;
      });
    }

    return {
      Scanned,
      QC,
      Flagging,
      Indexing,
      CBSL_QA,
      Client_QC,
      totalExpenseRate,
    };
  };

  const calculateColumnSumUser = () => {
    let Scanned = 0;
    let QC = 0;
    let Flagging = 0;
    let Indexing = 0;
    let CBSL_QA = 0;
    let Client_QC = 0;
    let totalExpenseRate = 0;

    if (detailedUserReport && Array.isArray(detailedUserReport)) {
      detailedUserReport.forEach((elem) => {
        Scanned += parseInt(elem.Scanned) || 0;
        QC += parseInt(elem.QC) || 0;
        Flagging += parseInt(elem.Flagging) || 0;
        Indexing += parseInt(elem.Indexing) || 0;
        CBSL_QA += parseInt(elem.CBSL_QA) || 0;
        Client_QC += parseInt(elem.Client_QC) || 0;
        const normalizeName = (name) => name ? name.replace(/district court/gi, "").trim() : "";
        const priceData = price.find(

          (price) => normalizeName(price.LocationName) === normalizeName(elem.locationName)
        );

        const scanRate = priceData?.ScanRate || 0;
        const qcRate = priceData?.QcRate || 0;
        const indexRate = priceData?.IndexRate || 0;
        const flagRate = priceData?.FlagRate || 0;
        const cbslQaRate = priceData?.CbslQaRate || 0;
        const clientQcRate = priceData?.ClientQcRate || 0;


        const scannedRate = (parseInt(elem.Scanned) || 0) * scanRate;
        const qcRateTotal = (parseInt(elem.QC) || 0) * qcRate;
        const indexRateTotal = (parseInt(elem.Indexing) || 0) * indexRate;
        const flagRateTotal = (parseInt(elem.Flagging) || 0) * flagRate;
        const cbslQaRateTotal = (parseInt(elem.CBSL_QA) || 0) * cbslQaRate;
        const clientQcRateTotal = (parseInt(elem.Client_QC) || 0) * clientQcRate;


        const totalRate = scannedRate + qcRateTotal + indexRateTotal + flagRateTotal + cbslQaRateTotal + clientQcRateTotal;

        totalExpenseRate += totalRate;
      });
    }

    return {
      Scanned,
      QC,
      Flagging,
      Indexing,
      CBSL_QA,
      Client_QC,
      totalExpenseRate,
    };
  };

  const columnSums = calculateColumnSum();
  const columnSumsUser = calculateColumnSumUser();

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

  // const fetchUserDetailed = (locationName, startDate, endDate) => {
  //   const formattedStartDate = startDate ? new Date(startDate) : null;
  //   const formattedEndDate = endDate ? new Date(endDate) : null;
  //   const formatDate = (date) => {
  //     return date.toISOString().split('T')[0];
  //   };
  //   setIsLoading(true);
  //   axios
  //     .get(`${API_URL}/detailedreportlocationwise`, {
  //       params: {
  //         locationName: locationName,
  //         startDate: formattedStartDate ? formatDate(formattedStartDate) : null,
  //         endDate: formattedEndDate ? formatDate(formattedEndDate) : null
  //       },
  //     })
  //     .then((response) => {
  //       setDetailedReportLocationWise(response.data)
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //       setIsLoading(false);
  //     });
  // };

  const fetchUserDetailed = (locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    setIsLoading(true);
    setDetailedReportLocationWise([]);
    axios
      .get(`${API_URL}/detailedreportlocationwise`, {
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
    setDetailedUserReport(null);
    axios.get(`${API_URL}/userdetailedreportlocationwise`, {
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

    let apiUrl = `${API_URL}/detailedreportlocationwisecsv`;

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

    let apiUrl = `${API_URL}/userdetailedreportlocationwisecsv`;

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
      if (!userData || !Array.isArray(userData.user_roles) || !Array.isArray(userData.projects) || !Array.isArray(userData.locations)) {
        console.error("Invalid or undefined userData structure:", userData);
        return;
      }
      setIsLoading(true);
      try {
        const formattedStartDate = startDate ? new Date(startDate) : null;
        const formattedEndDate = endDate ? new Date(endDate) : null;
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };

        const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
        let apiUrl = `${API_URL}/summaryreport`;

        // Check conditions for including locationName
        const isCBSLUser = userData.user_roles.includes("CBSL Site User");
        const hasSingleProject = userData.projects[0] === 1;
        const locationNameWithDistrictCourt = `${locationName} District Court`;
        const hasMatchingLocation = userData.locations.some(location => `${location.name} District Court` === locationNameWithDistrictCourt);

        let queryParams = [];

        if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
          queryParams.push(`locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`);
        }

        if (formattedStartDate && formattedEndDate) {
          queryParams.push(`startDate=${formatDate(formattedStartDate)}`, `endDate=${formatDate(formattedEndDate)}`);
        }

        if (queryParams.length > 0) {
          apiUrl += `?${queryParams.join('&')}`;
        }

        const response = await axios.get(apiUrl);
        setSummaryReport(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching summary report:", error);
        setIsLoading(false);
      }
    };
    // const fetchSummaryReport = async () => {
    //   if (!userData || !Array.isArray(userData.user_roles) || !Array.isArray(userData.projects) || !Array.isArray(userData.locations)) {
    //     console.error("Invalid or undefined userData structure:", userData);
    //     return;
    //   }
    //   setIsLoading(true);
    //   try {
    //     const formattedStartDate = startDate ? new Date(startDate) : null;
    //     const formattedEndDate = endDate ? new Date(endDate) : null;
    //     const formatDate = (date) => {
    //       return date.toISOString().split('T')[0];
    //     };

    //     const locationName = userData.locations.length > 0 ? userData.locations.name : "";
    //     let apiUrl = `${API_URL}/summaryreport`;

    //     // Check conditions for including locationName
    //     const isCBSLUser = userData.user_roles.includes("CBSL Site User");
    //     const hasSingleProject = userData.projects.length === 1 && userData.projects[0] === 1;
    //     const locationNameWithDistrictCourt = `${locationName} District Court`;
    //     const hasMatchingLocation = userData.locations.some(location => `${location.name} District Court` === locationNameWithDistrictCourt);

    //     let queryParams = [];

    //     if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
    //       queryParams.push(`locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`);
    //     }

    //     if (formattedStartDate && formattedEndDate) {
    //       queryParams.push(`startDate=${formatDate(formattedStartDate)}`, `endDate=${formatDate(formattedEndDate)}`);
    //     }

    //     if (queryParams.length > 0) {
    //       apiUrl += `?${queryParams.join('&')}`;
    //     }

    //     const response = await axios.get(apiUrl);
    //     setSummaryReport(response.data);
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching summary report:", error);
    //     setIsLoading(false);
    //   }
    // };
    // const fetchSummaryReport = async () => {
    //   if (!userData || !Array.isArray(userData.user_roles) || !Array.isArray(userData.projects) || !Array.isArray(userData.locations)) {
    //     console.error("Invalid or undefined userData structure:", userData);
    //     return;
    //   }
    //   setIsLoading(true);
    //   try {
    //     const formattedStartDate = startDate ? new Date(startDate) : null;
    //     const formattedEndDate = endDate ? new Date(endDate) : null;
    //     const formatDate = (date) => {
    //       return date.toISOString().split('T')[0];
    //     };

    //     const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
    //     let apiUrl = `${API_URL}/summaryreport`;

    //     // Check conditions for including locationName
    //     const isCBSLUser = userData.user_roles.includes("CBSL Site User");
    //     const hasSingleProject = userData.projects.length === 1 && userData.projects[0] === 1;
    //     const locationNameWithDistrictCourt = `${locationName} District Court`;
    //     const hasMatchingLocation = userData.locations.some(location => `${location.name} District Court` === locationNameWithDistrictCourt);

    //     if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
    //       apiUrl += `?locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
    //     }

    //     if (formattedStartDate && formattedEndDate) {
    //       apiUrl += `&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    //     }

    //     const response = await axios.get(apiUrl);
    //     setSummaryReport(response.data);
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching summary report:", error);
    //     setIsLoading(false);
    //   }
    // };

    const fetchLocationReport = async () => {
      setIsLoading(true);
      try {
        const formattedStartDate = startDate ? new Date(startDate) : null;
        const formattedEndDate = endDate ? new Date(endDate) : null;
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };

        const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
        let apiUrl = `${API_URL}/detailedreport`;

        // Check if userData meets the conditions to include the locationName parameter
        const isCBSLUser = userData.user_roles.includes("CBSL Site User");
        const hasSingleProject =  userData.projects[0] === 1;
        const locationNameWithDistrictCourt = `${locationName} District Court`;
        const hasMatchingLocation = userData.locations.some(location => `${location.name} District Court` === locationNameWithDistrictCourt);

        if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
          apiUrl += `?locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
        }

        if (formattedStartDate && formattedEndDate) {
          // Determine whether to use '?' or '&' based on existing query parameters
          apiUrl += apiUrl.includes('?') ? '&' : '?';
          apiUrl += `startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
        }

        const response = await axios.get(apiUrl);
        setLocationReport(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching detailed report:", error);
        setIsLoading(false);
      }
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



    const fetchDetailedReportCsvFile = (startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
      let apiUrl = `${API_URL}/detailedreportcsv`;

      // Check if userData meets the conditions to include the locationName parameter
      const isCBSLUser = userData.user_roles.includes("CBSL Site User");
      const hasSingleProject =  userData.projects[0] === 1;
      const locationNameWithDistrictCourt = `${locationName} District Court`;
      const hasMatchingLocation = userData.locations.some(location => `${location.name} District Court` === locationNameWithDistrictCourt);

      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        apiUrl += `?locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
      }

      if (formattedStartDate && formattedEndDate) {
        // Determine whether to use '?' or '&' based on existing query parameters
        apiUrl += apiUrl.includes('?') ? '&' : '?';
        apiUrl += `startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
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

    fetchPrices();
    fetchSummaryReport(userData);
    fetchLocationReport(userData);
    fetchDetailedReportCsvFile(startDate, endDate, userData);
    fetchDetailedLocationWiseReportCsvFile([locationName], startDate, endDate);
    fetchUserWiseReportCsvFile(selectedUsername, [locationName], startDate, endDate);
    fetchUserDetailed(locationName, startDate, endDate);
    fetchUserDetailedReport(selectedUsername, locationName, startDate, endDate);

  }, [selectedUsername, locationName, startDate, endDate, userData]);


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

  const totalPrice = 0.141;
  console.log("Location Data", multipliedLocationData);
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
  useEffect(() => {
    if (price && locationReport && price.length > 0 && locationReport.length > 0) {
      const normalizeName = (name) => (name ? name.replace(/district court/gi, '').trim() : '');

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

  return (
    <>
      {isLoading && <Loader />}
      <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
        <div className='row'>
          <div className='col-2'></div>
          <div className='col-9 ms-5'>
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
                    <th>Flagging</th>
                    <th>Indexing</th>
                    <th>CBSL-QA</th>
                    <th>Client-QA</th>
                    <th>Expense</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {summaryReport && summaryReport.map((elem, index) => (
                      <>
                        <td key={index}>{index + 1}</td>
                        <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
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
                <div className="confirmation-dialog ">
                  <div className="confirmation-content">
                    <p className="confirmation-text fw-bold ">Are you sure you want to export the CSV file?</p>
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
                    <th>Flagging</th>
                    <th>Indexing</th>
                    <th>CBSL-QA</th>
                    <th>Client-QA</th>
                    <th>Expense</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                {enhancedLocationReport && enhancedLocationReport.map((elem, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style={{whiteSpace:'nowrap'}} className="hover-text" onClick={() => handleLocationView(elem.locationname)}>{elem.locationname || 0}</td>
                      <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
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
                            <th>Flagging</th>
                            <th>Indexing</th>
                            <th>CBSL-QA</th>
                            <th>Client-QA</th>
                            <th>Expense</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>


                          {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => {
                            const normalizeName = (name) =>
                              name ? name.replace(/district court/gi, "").trim() : "";
                            const normalizedLocationName = normalizeName(elem.locationName);
                            console.log("Normalized Location Name:", normalizedLocationName);

                            const priceData = price.find(
                              (price) => normalizeName(price.LocationName) === normalizedLocationName
                            );

                            // Calculate rates for each activity
                            const scannedRate = elem.Scanned * (priceData ? priceData.ScanRate : 0);
                            const qcRate = elem.QC * (priceData ? priceData.QcRate : 0);
                            const indexRate = elem.Indexing * (priceData ? priceData.IndexRate : 0);
                            const flagRate = elem.Flagging * (priceData ? priceData.FlagRate : 0);
                            const cbslqaRate = elem.CBSL_QA * (priceData ? priceData.CbslQaRate : 0);
                            const clientqcRate = elem.Client_QC * (priceData ? priceData.ClientQcRate : 0);

                            // Calculate total expense rate
                            const totalRate = scannedRate + qcRate + indexRate + flagRate + cbslqaRate + clientqcRate;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{whiteSpace:'nowrap'}}>{elem.locationName}</td>
                                <td style={{whiteSpace:'nowrap'}} className="hover-text" onClick={() => handleUserView(elem.user_type, elem.locationName)}>{elem.user_type || 0}</td>
                                <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
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
                              <strong>{columnSums.Scanned.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSums.QC.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSums.Flagging.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSums.Indexing.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSums.CBSL_QA.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSums.Client_QC.toLocaleString()}</strong>
                            </td>

                            <td>
                              {/* Assuming `Expense Rate` sum calculation logic needs to be added if required */}
                              <strong>{columnSums.totalExpenseRate.toLocaleString()}</strong>
                            </td>
                            <td></td>
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
                      {/* <table className="table-modal mt-2">
                        <thead>
                          <tr>
                            <th>Sr.No.</th>
                            <th>Location</th>
                            <th>User Name</th>
                            <th>Date</th>
                            <th>Lot No</th>
                            <th>Scanned</th>
                            <th>QC</th>
                            <th>Flagging</th>
                            <th>Indexing</th>
                            <th>CBSL-QA</th>
                            <th>Client-QA</th>
                            <th>Expense</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedUserReport && detailedUserReport.map((elem, index) => {
                            const normalizeName = (name) =>
                              name ? name.replace(/district court/gi, "").trim() : "";
                            const normalizedLocationName = normalizeName(elem.locationName);
                            console.log("Normalized Location Name:", normalizedLocationName);

                            const priceData = price.find(
                              (price) => normalizeName(price.LocationName) === normalizedLocationName
                            );

                            // Calculate rates for each activity
                            const scannedRate = elem.Scanned * (priceData ? priceData.ScanRate : 0);
                            const qcRate = elem.QC * (priceData ? priceData.QcRate : 0);
                            const indexRate = elem.Indexing * (priceData ? priceData.IndexRate : 0);
                            const flagRate = elem.Flagging * (priceData ? priceData.FlagRate : 0);
                            const cbslqaRate = elem.CBSL_QA * (priceData ? priceData.CbslQaRate : 0);
                            const clientqcRate = elem.Client_QC * (priceData ? priceData.ClientQcRate : 0);

                            // Calculate total expense rate
                            const totalRate = scannedRate + qcRate + indexRate + flagRate + cbslqaRate + clientqcRate;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationName}</td>
                                <td>{elem.user_type || 0}</td>
                                <td>{elem.Date}</td>
                                <td>{elem.lotno}</td>
                                <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                                <td>{totalRate.toLocaleString()}</td>
                                <td></td>
                              </tr>
                            );
                          })}
                          <tr style={{ color: "black" }}>
                            <td colSpan="5">
                              <strong>Total</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.Scanned.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.QC.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.Flagging.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.Indexing.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.CBSL_QA.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.Client_QC.toLocaleString()}</strong>
                            </td>
                            <td>
                              <strong>{columnSumsUser.totalExpenseRate.toLocaleString()}</strong>
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table> */}
                      {isLoading ? (
                    <p>Loading data...</p>
                  ) : detailedUserReport && detailedUserReport.length > 0 ? (
                    <table className="table-modal mt-2">
                      <thead>
                        <tr>
                          <th>Sr.No.</th>
                          <th>Location</th>
                          <th style={{whiteSpace:'nowrap'}}>User Name</th>
                          <th>Date</th>
                          <th>Lot No</th>
                          <th>Scanned</th>
                          <th>QC</th>
                          <th>Flagging</th>
                          <th>Indexing</th>
                          <th>CBSL-QA</th>
                          <th>Client-QA</th>
                          <th>Expense</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedUserReport.map((elem, index) => {
                          const normalizeName = (name) =>
                            name ? name.replace(/district court/gi, "").trim() : "";
                          const normalizedLocationName = normalizeName(elem.locationName);
                          console.log("Normalized Location Name:", normalizedLocationName);

                          const priceData = price.find(
                            (price) => normalizeName(price.LocationName) === normalizedLocationName
                          );

                          // Calculate rates for each activity
                          const scannedRate = elem.Scanned * (priceData ? priceData.ScanRate : 0);
                          const qcRate = elem.QC * (priceData ? priceData.QcRate : 0);
                          const indexRate = elem.Indexing * (priceData ? priceData.IndexRate : 0);
                          const flagRate = elem.Flagging * (priceData ? priceData.FlagRate : 0);
                          const cbslqaRate = elem.CBSL_QA * (priceData ? priceData.CbslQaRate : 0);
                          const clientqcRate = elem.Client_QC * (priceData ? priceData.ClientQcRate : 0);

                          // Calculate total expense rate
                          const totalRate = scannedRate + qcRate + indexRate + flagRate + cbslqaRate + clientqcRate;
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td style={{whiteSpace:'nowrap'}}>{elem.locationName}</td>
                              <td style={{whiteSpace:'nowrap'}}>{elem.user_type || 0}</td>
                              <td style={{whiteSpace:'nowrap'}}>{elem.Date}</td>
                              <td>{elem.lotno}</td>
                              <td>{isNaN(parseInt(elem.Scanned)) ? 0 : parseInt(elem.Scanned).toLocaleString()}</td>
                              <td>{isNaN(parseInt(elem.QC)) ? 0 : parseInt(elem.QC).toLocaleString()}</td>
                              <td>{isNaN(parseInt(elem.Flagging)) ? 0 : parseInt(elem.Flagging).toLocaleString()}</td>
                              <td>{isNaN(parseInt(elem.Indexing)) ? 0 : parseInt(elem.Indexing).toLocaleString()}</td>
                              <td>{isNaN(parseInt(elem.CBSL_QA)) ? 0 : parseInt(elem.CBSL_QA).toLocaleString()}</td>
                              <td>{isNaN(parseInt(elem.Client_QC)) ? 0 : parseInt(elem.Client_QC).toLocaleString()}</td>
                              <td>{totalRate.toLocaleString()}</td>
                              <td></td>
                            </tr>
                          );
                        })}
                        <tr style={{ color: "black" }}>
                          <td colSpan="5">
                            <strong>Total</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.Scanned.toLocaleString()}</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.QC.toLocaleString()}</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.Flagging.toLocaleString()}</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.Indexing.toLocaleString()}</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.CBSL_QA.toLocaleString()}</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.Client_QC.toLocaleString()}</strong>
                          </td>
                          <td>
                            <strong>{columnSumsUser.totalExpenseRate.toLocaleString()}</strong>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>Data Loading.... </p>
                  )}

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
     </div>
     </div>
      </div>
    </>
  );
};

export default PeriodicSummaryReport