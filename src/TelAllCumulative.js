import React, { useEffect, useState } from "react";
import { API_URL } from "./API";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import { priceCount } from "./Components/priceCount";
import { useRef } from 'react';
import { IoArrowBackCircle } from "react-icons/io5";
import { FiDownload } from 'react-icons/fi';

const TelAllCumulative = ({ multipliedData, prices, editedPrices, userData }) => {
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
  const [enhancedLocationReport, setEnhancedLocationReport] = useState([]);


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
    setDetailedReportLocationWise([]);
    axios
      .get(`${API_URL}/alldetailedreportlocationwisetelangana`, {
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
    setDetailedUserReport([]);
    axios.get(`${API_URL}/alluserdetailedreportlocationwisetelangana`, {
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
    let apiUrl = `${API_URL}/alldetailedreportlocationwisecsvtelangana`;

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

    let apiUrl = `${API_URL}/alluserdetailedreportlocationwisecsvtelangana`;

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

      const baseUrl = `${API_URL}/summaryreportcummulativetelangana`;

      // Ensure userData has the expected structure and values
      const isCBSLUser = Array.isArray(userData.user_roles) && userData.user_roles.includes("CBSL Site User");
      const hasSingleProject = Array.isArray(userData.projects) && userData.projects[0] === 2;
      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
      const hasMatchingLocation = Array.isArray(userData.locations) && userData.locations.some(location => location.name === locationName);

      console.log("isCBSLUser:", isCBSLUser); // Log isCBSLUser
      console.log("hasSingleProject:", hasSingleProject); // Log hasSingleProject
      console.log("locationName:", locationName); // Log locationName
      console.log("hasMatchingLocation:", hasMatchingLocation); // Log hasMatchingLocation

      // Use URL and URLSearchParams for constructing the URL
      const url = new URL(baseUrl);
      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        url.searchParams.append("locationName", locationName);
      }

      console.log("Final API URL for Summary Report:", url.toString()); // Log the final URL

      // Make the API request
      axios.get(url.toString())
        .then((response) => {
          console.log("Response data:", response.data); // Log the response data
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
      let apiUrl = `${API_URL}/detailedreportcummulativetelangana`;
      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
      const isCBSLUser = Array.isArray(userData.user_roles) && userData.user_roles.includes("CBSL Site User");
      const hasSingleProject = Array.isArray(userData.projects) && userData.projects[0] === 2;
      const locationNameWithDistrictCourt = `${locationName}`;
      const hasMatchingLocation = Array.isArray(userData.locations) && userData.locations.some(location => location.name === locationNameWithDistrictCourt);

      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        apiUrl += `?locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
      }

      console.log("Final API URL for Location Report:", apiUrl);

      axios.get(apiUrl)
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
      let apiUrl = `${API_URL}/detailedreportcummulativecsvtelangana`;

      if (formattedStartDate && formattedEndDate) {
        apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      }

      const locationName = userData.locations.length > 0 ? userData.locations[0].name : "";
      const isCBSLUser = userData.user_roles.includes("CBSL Site User");
      const hasSingleProject = userData.projects[0] === 2;
      const locationNameWithDistrictCourt = `${locationName}`;
      const hasMatchingLocation = userData.locations.some(location => location.name === locationNameWithDistrictCourt);

      if (isCBSLUser && hasSingleProject && hasMatchingLocation) {
        const separator = apiUrl.includes('?') ? '&' : '?';
        apiUrl += `${separator}locationName=${encodeURIComponent(locationNameWithDistrictCourt)}`;
      }

      console.log("Final API URL for Detailed Report CSV:", apiUrl);

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

    const fetchPrices = () => {
      setIsLoading(true);
      axios.get(`${API_URL}/telgetbusinessrate`)
        .then((response) => {
          setPrice(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching prices:", error);
          setIsLoading(false);
        });
    };

    fetchPrices();
    fetchDetailedReportCsvFile(startDate, endDate, userData);
    fetchSummaryReport();
    fetchLocationReport();

    if (locationName) {
      fetchUserDetailed(locationName);
    }

    fetchUserDetailedReport();
  }, [selectedUsername, locationName, startDate, endDate, userData]);

  // console.log("Location Data", locationReport);
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );

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
            Counting: Number(location.Counting || 0) * (prices.CountingRate || 0),  // Ensure the property is correct
            Inventory: Number(location.Inventory || 0) * (prices.InventoryRate || 0),  // Ensure the property is correct
            DocPreparation: Number(location.DocPreparation || 0) * (prices.DocPreparationRate || 0),  // Ensure the property is correct
            Guard: Number(location.Guard || 0) * (prices.GuardRate || 0),  // Ensure the property is correct
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






  const handleBackToLocationView = () => {
    setLocationView(true);
    setUserView(false);
  };

  console.log("summary report", summaryReport)
  //console.log("Scanned Value", summaryReport.Scanned)

  const calculateColumnSum = () => {
    let Inventory = 0;
    let Counting = 0;
    let DocPreparation = 0;
    let Guard = 0;
    let Scanned = 0;
    let QC = 0;
    let Flagging = 0;
    let Indexing = 0;
    let CBSL_QA = 0;
    let Client_QC = 0;
    let totalExpenseRate = 0;

    if (detailedReportLocationWise && Array.isArray(detailedReportLocationWise)) {
      detailedReportLocationWise.forEach((elem) => {
        Inventory += parseInt(elem.Inventory) || 0;
        Counting += parseInt(elem.Counting) || 0;
        DocPreparation += parseInt(elem.DocPreparation) || 0;
        Guard += parseInt(elem.Guard) || 0;
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
        const countingRate = priceData?.CountingRate || 0;
        const inventoryRate = priceData?.InventoryRate || 0;
        const docPreparationRate = priceData?.DocPreparationRate || 0;
        const guardRate = priceData?.GuardRate || 0;

        const scannedRate = (parseInt(elem.Scanned) || 0) * scanRate;
        const qcRateTotal = (parseInt(elem.QC) || 0) * qcRate;
        const indexRateTotal = (parseInt(elem.Indexing) || 0) * indexRate;
        const flagRateTotal = (parseInt(elem.Flagging) || 0) * flagRate;
        const cbslQaRateTotal = (parseInt(elem.CBSL_QA) || 0) * cbslQaRate;
        const clientQcRateTotal = (parseInt(elem.Client_QC) || 0) * clientQcRate;
        const countingRateTotal = (parseInt(elem.Counting) || 0) * countingRate;
        const inventoryRateTotal = (parseInt(elem.Inventory) || 0) * inventoryRate;
        const docPreparationRateTotal = (parseInt(elem.DocPreparation) || 0) * docPreparationRate;
        const otherRate = (parseInt(elem.Guard) || 0) * guardRate;

        const totalRate = scannedRate + qcRateTotal + indexRateTotal + flagRateTotal + cbslQaRateTotal + clientQcRateTotal + countingRateTotal + inventoryRateTotal + docPreparationRateTotal + otherRate;

        totalExpenseRate += totalRate;
      });
    }

    return {
      Inventory,
      Counting,
      DocPreparation,
      Guard,
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
    let Inventory = 0;
    let Counting = 0;
    let DocPreparation = 0;
    let Guard = 0;
    let Scanned = 0;
    let QC = 0;
    let Flagging = 0;
    let Indexing = 0;
    let CBSL_QA = 0;
    let Client_QC = 0;
    let totalExpenseRate = 0;

    if (detailedUserReport && Array.isArray(detailedUserReport)) {
      detailedUserReport.forEach((elem) => {
        Inventory += parseInt(elem.Inventory) || 0;
        Counting += parseInt(elem.Counting) || 0;
        DocPreparation += parseInt(elem.DocPreparation) || 0;
        Guard += parseInt(elem.Guard) || 0;
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
        const countingRate = priceData?.CountingRate || 0;
        const inventoryRate = priceData?.InventoryRate || 0;
        const docPreparationRate = priceData?.DocPreparationRate || 0;
        const guardRate = priceData?.GuardRate || 0;

        const scannedRate = (parseInt(elem.Scanned) || 0) * scanRate;
        const qcRateTotal = (parseInt(elem.QC) || 0) * qcRate;
        const indexRateTotal = (parseInt(elem.Indexing) || 0) * indexRate;
        const flagRateTotal = (parseInt(elem.Flagging) || 0) * flagRate;
        const cbslQaRateTotal = (parseInt(elem.CBSL_QA) || 0) * cbslQaRate;
        const clientQcRateTotal = (parseInt(elem.Client_QC) || 0) * clientQcRate;
        const countingRateTotal = (parseInt(elem.Counting) || 0) * countingRate;
        const inventoryRateTotal = (parseInt(elem.Inventory) || 0) * inventoryRate;
        const docPreparationRateTotal = (parseInt(elem.DocPreparation) || 0) * docPreparationRate;
        const otherRate = (parseInt(elem.Guard) || 0) * guardRate;

        const totalRate = scannedRate + qcRateTotal + indexRateTotal + flagRateTotal + cbslQaRateTotal + clientQcRateTotal + countingRateTotal + inventoryRateTotal + docPreparationRateTotal + otherRate;

        totalExpenseRate += totalRate;
      });
    }

    return {
      Inventory,
      Counting,
      DocPreparation,
      Guard,
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
              {summaryReport && (
                <table className="table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Inventory</th>
                      <th>Counting</th>
                      <th>Doc Pre</th>
                      <th>Other</th>
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
                      <td>1</td>
                      <td>{isNaN(parseInt(summaryReport.Inventory)) ? 0 : parseInt(summaryReport.Inventory).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.Counting)) ? 0 : parseInt(summaryReport.Counting).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.DocPreparation)) ? 0 : parseInt(summaryReport.DocPreparation).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.Guard)) ? 0 : parseInt(summaryReport.Guard).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.Scanned)) ? 0 : parseInt(summaryReport.Scanned).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.QC)) ? 0 : parseInt(summaryReport.QC).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.Flagging)) ? 0 : parseInt(summaryReport.Flagging).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.Indexing)) ? 0 : parseInt(summaryReport.Indexing).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.CBSL_QA)) ? 0 : parseInt(summaryReport.CBSL_QA).toLocaleString()}</td>
                      <td>{isNaN(parseInt(summaryReport.Client_QC)) ? 0 : parseInt(summaryReport.Client_QC).toLocaleString()}</td>
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
                  <button className="btn btn-success" onClick={handleExport}>
                    <FiDownload className="me-2" />Export CSV
                  </button>
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

            </div>
            <div className="all-tables row ms-2 me-2">
              <table className="table-bordered mt-2">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Location Name</th>
                    <th>Inventory</th>
                    <th>Counting</th>
                    <th>DocPre</th>
                    <th>Other</th>
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
                      <td style={{ whiteSpace: 'nowrap' }} className="hover-text" onClick={() => handleLocationView(elem.LocationName)}>{elem.LocationName || 0}</td>
                      <td>{isNaN(parseInt(elem.Inventory)) ? 0 : parseInt(elem.Inventory).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Counting)) ? 0 : parseInt(elem.Counting).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.DocPreparation)) ? 0 : parseInt(elem.DocPreparation).toLocaleString()}</td>
                      <td>{isNaN(parseInt(elem.Guard)) ? 0 : parseInt(elem.Guard).toLocaleString()}</td>
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
                            <th>DocPre</th>
                            <th>Other</th>
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
                          {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => {
                            const normalizeName = (name) =>
                              name ? name.replace(/district court/gi, "").trim() : "";
                            const normalizedLocationName = normalizeName(elem.locationName);
                            console.log("Normalized Location Name:", normalizedLocationName);
                            const priceData = price.find(
                              (price) => normalizeName(price.LocationName) === normalizedLocationName
                            );
                            const scanRate = priceData?.ScanRate || 0;
                            const qcRate = priceData?.QcRate || 0;
                            const indexRate = priceData?.IndexRate || 0;
                            const flagRate = priceData?.FlagRate || 0;
                            const cbslQaRate = priceData?.CbslQaRate || 0;
                            const clientQcRate = priceData?.ClientQcRate || 0;
                            const countingRate = priceData?.CountingRate || 0;
                            const inventoryRate = priceData?.InventoryRate || 0;
                            const docPreparationRate = priceData?.DocPreparationRate || 0;
                            const guardRate = priceData?.GuardRate || 0;
                            const scanned = isNaN(Number(elem.Scanned)) ? 0 : Number(elem.Scanned);
                            const qc = isNaN(Number(elem.QC)) ? 0 : Number(elem.QC);
                            const indexing = isNaN(Number(elem.Indexing)) ? 0 : Number(elem.Indexing);
                            const flagging = isNaN(Number(elem.Flagging)) ? 0 : Number(elem.Flagging);
                            const cbslQa = isNaN(Number(elem.CBSL_QA)) ? 0 : Number(elem.CBSL_QA);
                            const clientQc = isNaN(Number(elem.Client_QC)) ? 0 : Number(elem.Client_QC);
                            const counting = isNaN(Number(elem.Counting)) ? 0 : Number(elem.Counting);
                            const inventory = isNaN(Number(elem.Inventory)) ? 0 : Number(elem.Inventory);
                            const docPreparation = isNaN(Number(elem.DocPreparation)) ? 0 : Number(elem.DocPreparation);
                            const guard = isNaN(Number(elem.Guard)) ? 0 : Number(elem.Guard);
                            const scannedRate = scanned * scanRate;
                            const qcRateTotal = qc * qcRate;
                            const indexRateTotal = indexing * indexRate;
                            const flagRateTotal = flagging * flagRate;
                            const cbslQaRateTotal = cbslQa * cbslQaRate;
                            const clientQcRateTotal = clientQc * clientQcRate;
                            const countingRateTotal = counting * countingRate;
                            const inventoryRateTotal = inventory * inventoryRate;
                            const docPreparationRateTotal = docPreparation * docPreparationRate;
                            const otherRate = guard * guardRate;
                            const totalRate = scannedRate + qcRateTotal + indexRateTotal + flagRateTotal + cbslQaRateTotal + clientQcRateTotal + countingRateTotal + inventoryRateTotal + docPreparationRateTotal + otherRate;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{elem.locationName}</td>
                                <td style={{ whiteSpace: 'nowrap' }} className="hover-text" onClick={() => handleUserView(elem.user_type, elem.locationName)}>{elem.user_type || 0}</td>
                                <td>{inventory.toLocaleString()}</td>
                                <td>{counting.toLocaleString()}</td>
                                <td>{docPreparation.toLocaleString()}</td>
                                <td>{guard.toLocaleString()}</td>
                                <td>{scanned.toLocaleString()}</td>
                                <td>{qc.toLocaleString()}</td>
                                <td>{flagging.toLocaleString()}</td>
                                <td>{indexing.toLocaleString()}</td>
                                <td>{cbslQa.toLocaleString()}</td>
                                <td>{clientQc.toLocaleString()}</td>
                                <td>{totalRate.toLocaleString()}</td>
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
                <div className="col-12">
            <p className="fw-bold">
              Number Of Working Days: {detailedUserReport ? new Set(detailedUserReport.map(item => item.Date)).size : 0}
            </p>
          </div>
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
                            <th style={{ width: '200px' }}>Date</th>
                            <th>Lot No</th>
                            <th>Inventory</th>
                            <th>Counting</th>
                            <th>DocPre</th>
                            <th>Other</th>
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
                          {detailedUserReport && detailedUserReport.map((elem, index) => {
                            const normalizeName = (name) =>
                              name ? name.replace(/district court/gi, "").trim() : "";
                            const normalizedLocationName = normalizeName(elem.locationName);
                            const priceData = price.find(
                              (price) => normalizeName(price.LocationName) === normalizedLocationName
                            );
                            const scanRate = priceData?.ScanRate || 0;
                            const qcRate = priceData?.QcRate || 0;
                            const indexRate = priceData?.IndexRate || 0;
                            const flagRate = priceData?.FlagRate || 0;
                            const cbslQaRate = priceData?.CbslQaRate || 0;
                            const clientQcRate = priceData?.ClientQcRate || 0;
                            const countingRate = priceData?.CountingRate || 0;
                            const inventoryRate = priceData?.InventoryRate || 0;
                            const docPreparationRate = priceData?.DocPreparationRate || 0;
                            const guardRate = priceData?.GuardRate || 0;
                            const scanned = isNaN(Number(elem.Scanned)) ? 0 : Number(elem.Scanned);
                            const qc = isNaN(Number(elem.QC)) ? 0 : Number(elem.QC);
                            const indexing = isNaN(Number(elem.Indexing)) ? 0 : Number(elem.Indexing);
                            const flagging = isNaN(Number(elem.Flagging)) ? 0 : Number(elem.Flagging);
                            const cbslQa = isNaN(Number(elem.CBSL_QA)) ? 0 : Number(elem.CBSL_QA);
                            const clientQc = isNaN(Number(elem.Client_QC)) ? 0 : Number(elem.Client_QC);
                            const counting = isNaN(Number(elem.Counting)) ? 0 : Number(elem.Counting);
                            const inventory = isNaN(Number(elem.Inventory)) ? 0 : Number(elem.Inventory);
                            const docPreparation = isNaN(Number(elem.DocPreparation)) ? 0 : Number(elem.DocPreparation);
                            const guard = isNaN(Number(elem.Guard)) ? 0 : Number(elem.Guard);
                            const scannedRate = scanned * scanRate;
                            const qcRateTotal = qc * qcRate;
                            const indexRateTotal = indexing * indexRate;
                            const flagRateTotal = flagging * flagRate;
                            const cbslQaRateTotal = cbslQa * cbslQaRate;
                            const clientQcRateTotal = clientQc * clientQcRate;
                            const countingRateTotal = counting * countingRate;
                            const inventoryRateTotal = inventory * inventoryRate;
                            const docPreparationRateTotal = docPreparation * docPreparationRate;
                            const otherRate = guard * guardRate;
                            const totalRate = scannedRate + qcRateTotal + indexRateTotal + flagRateTotal + cbslQaRateTotal + clientQcRateTotal + countingRateTotal + inventoryRateTotal + docPreparationRateTotal + otherRate;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{elem.locationName}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{elem.user_type || 0}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{elem.Date}</td>
                                <td>{elem.lotno}</td>
                                <td>{inventory.toLocaleString()}</td>
                                <td>{counting.toLocaleString()}</td>
                                <td>{docPreparation.toLocaleString()}</td>
                                <td>{guard.toLocaleString()}</td>
                                <td>{scanned.toLocaleString()}</td>
                                <td>{qc.toLocaleString()}</td>
                                <td>{flagging.toLocaleString()}</td>
                                <td>{indexing.toLocaleString()}</td>
                                <td>{cbslQa.toLocaleString()}</td>
                                <td>{clientQc.toLocaleString()}</td>
                                <td>{totalRate.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                          <tr style={{ color: "black" }}>
                            <td colSpan="5">
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
  )
}

export default TelAllCumulative