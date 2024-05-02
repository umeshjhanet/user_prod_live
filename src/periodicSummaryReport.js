import React, { useEffect, useState } from 'react'
import { API_URL } from './API';
import axios from 'axios';
import { priceCount } from './Components/priceCount';
import { useRef } from 'react';

const PeriodicSummaryReport = ({ multipliedData,startDate,endDate }) => {

const [locationView, setLocationView] = useState(false);
const [userView, setUserView] = useState(false);
const [summaryReport, setSummaryReport] = useState();
const [locationReport, setLocationReport] = useState();
const [locationName, setLocationName] = useState("");
const [detailedReportLocationWise, setDetailedReportLocationWise] =useState();
const[detailedUserReport,setDetailedUserReport]=useState();
const [selectedUsername, setSelectedUsername] = useState('');
const [detailedcsv, setDetailedCsv] = useState(null);
const[detailedlocationwisecsv,setDetailedLocationWiseCsv]=useState(null);
const[userwisecsv,setUserWiseCSv]=useState(null);
const [showConfirmation, setShowConfirmation] = useState(false);
const [showConfirmationLocation, setShowConfirmationLocation] = useState(false);
const [showConfirmationUser, setShowConfirmationUser] = useState(false);
const ref = useRef(null);

  useEffect(() => {
    if (locationView || userView) {
      // Scroll to the referenced div when locationView or userView changes
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [locationView, userView]);

const handleLocationView = (locationName) => {
fetchUserDetailed(locationName,startDate,endDate);
fetchDetailedLocationWiseReportCsvFile(locationName,startDate,endDate)
setLocationView(true);
setUserView(false);
};

const handleUserView = (username, locationName) => {
setSelectedUsername(username);
setLocationName(locationName);
console.log("LocationName Fetched", locationName);
console.log("UserName Fetched", username);
fetchUserDetailedReport(username, locationName,startDate,endDate);
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

const handleLocationExport=()=>{
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

const handleCancelLocationExport=()=>{
  setShowConfirmationLocation(false);
}

const handleUserExport=()=>{
  setShowConfirmationUser(true);
}


const handleUserWiseExport=()=>{
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

const handleCancelUserExport=()=>{
  setShowConfirmationUser(false);
}

const fetchUserDetailed = (locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
  
    axios
      .get(`${API_URL}/detailedreportlocationwise`, {
        params: {
          locationName: locationName,
          startDate: formattedStartDate ? formatDate(formattedStartDate) : null,
          endDate: formattedEndDate ? formatDate(formattedEndDate) : null
        },
      })
      .then((response) => setDetailedReportLocationWise(response.data))
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };
  

const fetchUserDetailedReport = (username, locationName,startDate,endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

axios.get(`${API_URL}/UserDetailedReport`, {
    params: {
        username: username,
        locationName: locationName,
        startDate: formattedStartDate ? formatDate(formattedStartDate) : null,
          endDate: formattedEndDate ? formatDate(formattedEndDate) : null
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
};


const fetchUserWiseReportCsvFile = (username, locationName, startDate, endDate) => {
const formattedStartDate = startDate ? new Date(startDate) : null;
const formattedEndDate = endDate ? new Date(endDate) : null;
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

let apiUrl = `http://localhost:5001/userdetailedreportlocationwisecsv`;

if (username && locationName) {
    const locationQueryString = Array.isArray(locationName) ? locationName.join(',') : locationName;
    apiUrl += `?username=${username}&locationName=${locationQueryString}`;
  }
  if (formattedStartDate && formattedEndDate) {
    const separator = apiUrl.includes('?') ? '&' : '?';
    apiUrl += `${separator}startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
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

useEffect(() => {
    const fetchSummaryReport = async () => {
        try {
            const formattedStartDate = startDate ? new Date(startDate) : null;
            const formattedEndDate = endDate ? new Date(endDate) : null;
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };

            let apiUrl = `${API_URL}/summaryreport`;
            const queryParams = {};
            if (formattedStartDate && formattedEndDate) {
                apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
            }

            const response = await axios.get(apiUrl, { params: queryParams });
            setSummaryReport(response.data);
        } catch (error) {
            console.error("Error fetching summary data:", error);
        }
    };

    const fetchLocationReport = async () => {
            try {
                const formattedStartDate = startDate ? new Date(startDate) : null;
                const formattedEndDate = endDate ? new Date(endDate) : null;
                const formatDate = (date) => {
                    return date.toISOString().split('T')[0];
                };
    
                let apiUrl = `${API_URL}/detailedreport`;
                const queryParams = {};
                if (formattedStartDate && formattedEndDate) {
                    apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
                }
    
                const response = await axios.get(apiUrl, { params: queryParams });
                setLocationReport(response.data);
            } catch (error) {
                console.error("Error fetching summary data:", error);
            }
        };

        const fetchDetailedReportCsvFile = (startDate, endDate) => {
            const formattedStartDate = startDate ? new Date(startDate) : null;
            const formattedEndDate = endDate ? new Date(endDate) : null;
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };
        
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
                });
        };
    

    fetchSummaryReport();
    fetchLocationReport();
    fetchDetailedReportCsvFile(startDate,endDate);
    fetchDetailedLocationWiseReportCsvFile([locationName], startDate, endDate);
    fetchUserWiseReportCsvFile(selectedUsername,[locationName],startDate,endDate);

}, [selectedUsername,locationName,startDate, endDate]);


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


console.log("Location Data", multipliedLocationData);

return (
<>
  <div className="container">
    <div className="row mt-3">
    
      <div className="search-report-card">
        <h4>Summary Report</h4>
        <div className="row ms-2 me-2">
          <table className="table-bordered mt-2">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Scanned</th>
                <th>QC</th>
                <th>Indexing</th>
                <th>Flagging</th>
                <th>CBSL-QA</th>
                <th>Client-QC</th>
                <th>Business Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
            {summaryReport && summaryReport.map((elem, index) => (
                      <>
                        <td key={index}>{index + 1}</td>
                        <td>{elem.Scanned}</td>
                        <td>{elem.QC}</td>
                        <td>{elem.Indexing}</td>
                        <td>{elem.Flagging}</td>
                        <td>{elem.CBSL_QA}</td>
                        <td>{elem.Client_QC}</td>
                        <td colSpan={multipliedData[0].multipliedValues.length}>
                          {multipliedData[0].multipliedValues.reduce((sum, value) => sum + value, 0).toFixed(2)}
                        </td>
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
        <h4>Detailed Report</h4>
        <div className="row">
          <div className="col-2">
            <p>Total row(s) affected: 1</p>
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
                    <th>Business Value</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {locationReport &&
                    locationReport.map((elem, index) => {
                      const rowTotalSum = multipliedLocationData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                      return (
                        <tr onClick={() => handleLocationView(elem.locationname)} key={index}>
                          <td>{index + 1}</td>
                          <td>{elem.locationname || 0}</td>
                          <td>{elem.Scanned || 0}</td>
                          <td>{elem.QC || 0}</td>
                          <td>{elem.Indexing || 0}</td>
                          <td>{elem.Flagging || 0}</td>
                          <td>{elem.CBSL_QA || 0}</td>
                          <td>{elem.Client_QC || 0}</td>
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
        {locationView && (
          <>
            <div className="row mt-3" ref={ref}>
              <div className="search-report-card">
                <h4>Detailed Report</h4>
                <div className="row">
                  <div className="col-2">
                    <p>Total row(s) affected: 1</p>
                  </div>
                  <div className="col-8"></div>
                  <div className="col-2">
                        <button className="btn btn-success" onClick={handleLocationExport}>Export CSV</button>

                      </div>
                  {showConfirmationLocation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <p className="fw-bold">Are you sure you want to export the CSV file?</p>
            <button className="btn btn-success mt-3 ms-5" onClick={handleDetailedLocationWiseExport}>Yes</button>
            <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelLocationExport}>No</button>
          </div>
        </div>
      )}
                </div>

                <div className="all-tables row ms-2 me-2">
                  <table className="table-bordered mt-2">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Location</th>
                        <th>User Name</th>
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
                      {detailedReportLocationWise &&
                        detailedReportLocationWise.map((elem, index) => {
                          const rowTotalSum = multipliedUserWiseData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                          return(
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
                            <td>
                            {rowTotalSum.toFixed(2)}
                          </td>
                          <td></td>
                          </tr>
                          )
})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
        {userView && (
          <>
            <div className="row mt-3" ref={ref}>
              <div className="search-report-card">
                <h4>Detailed Report</h4>
                <div className="row">
                  <div className="col-2">
                    <p>Total row(s) affected: 1</p>
                  </div>
                  <div className="col-8"></div>
                  <div className="col-2">
                    <button className="btn btn-success" onClick={() => handleUserWiseExport()}>Export CSV</button>
                  </div>
                </div>

                <div className="all-tables row ms-2 me-2">
                  <table className="table-bordered mt-2">
                    <thead>
                      <tr>
                        <th>Location Name</th>
                        <th>User Name</th>
                        <th>Date</th>
                        <th>LotNo</th>
                        <th>File Barcode</th>
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
                      {detailedUserReport ?
                        detailedUserReport.map((elem, index) => {
                          const rowTotalSum = multipliedUserData[index].multipliedValues.reduce((sum, value) => sum + value, 0);
                          return(
                          <tr onClick={() => handleUserView(elem.user_type, elem.locationName)} key={index}>
                            <td>{elem.locationName}</td>
                            <td>{elem.user_type}</td>
                            <td>{elem.Date}</td>
                            <td>{elem.LotNo}</td>
                            <td>{elem.FileBarcode}</td>
                            <td>{elem.Scanned ? elem.Scanned : 0}</td>
                            <td>{elem.QC ? elem.QC : 0}</td>
                            <td>{elem.Indexing ? elem.Indexing : 0}</td>
                            <td>{elem.Flagging ? elem.Flagging : 0}</td>
                            <td>{elem.CBSL_QA ? elem.CBSL_QA : 0}</td>
                            <td>{elem.Client_QC ? elem.Client_QC : 0}</td>
                            <td>
                            {rowTotalSum.toFixed(2)}
                          </td>
                          <td></td>
                          </tr>
                          )
                         }) : (<p>There is no data.</p>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
  </div>
</>
);
};

export default PeriodicSummaryReport