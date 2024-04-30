// import React, { useEffect, useState } from 'react'
// import { API_URL } from './API';
// import axios from 'axios';
// import { priceCount } from './Components/priceCount';

// const CumulativeSummaryReport = ({ multipliedData }) => {
//     const [locationView, setLocationView] = useState(false);
//     const [userView, setUserView] = useState(false);
//     const [summaryReport, setSummaryReport] = useState();
//     const[detailedReport,setDetailedReport]=useState();
//     const [locationName, setLocationName] = useState('');
//     const[detailedReportLocationWise,setDetailedReportLocationWise]=useState();
//     const [prices, setPrices] = useState();
//     const handleLocationView = () => {
//         setLocationView(true);
//     }
//     const handleUserView = () => {
//         setUserView(true);
//     }
//     useEffect(() => {
//         const fetchSummaryReport = () => {
//             axios.get(`${API_URL}/summaryReport`)
//                 .then((response) => setSummaryReport(response.data))
//                 .catch((error) => {
//                     console.error("Error fetching user data:", error);
//                 });
//         }

//         const fetchDeatiledReport=()=>{
//             axios.get(`${API_URL}/detailedreport`)
//             .then((response)=> setDetailedReport(response.data))
//             .catch((error) => {
//                 console.error("Error fetching user data:", error);
//             });

//         }

//         const fetchUserDetailed = (locationName) => {
//             axios.get(`${API_URL}/detailedreportlocationwise`, {
//                 params: {
//                     locationName: locationName
//                 }
//             })
//             .then((response) => setDetailedReportLocationWise(response.data))
//             .catch((error) => {
//                 console.error("Error fetching user data:", error);
//             });
//         }

//         fetchSummaryReport();
//         fetchDeatiledReport();
//         fetchUserDetailed(locationName);
//     }, [])
//     console.log('Summary Data', summaryReport);
//     console.log("detailed report data",detailedReport)

//     return (
//         <>
//             <div className='container'>
//                 <div className='row mt-3'>
//                     <div className='search-report-card'>
//                         <h4>Summary Report</h4>
//                         <div className='row ms-2 me-2'>
//                             <table className='table-bordered mt-2'>
//                                 <thead>
//                                     <tr>
//                                         <th></th>
//                                         <th>Scanned</th>
//                                         <th>QC</th>
//                                         <th>Indexing</th>
//                                         <th>Flagging</th>
//                                         <th>CBSL-QA</th>
//                                         <th>Client-QC</th>
//                                         <th>Business Value</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {/* <tr>
//                                         <td>Arrow</td>
//                                         {summaryReport && summaryReport.map((elem, index) => (
//                                             <td key={index}>{elem.Scanned}</td>
//                                             <td>{elem.QC}</td>
//                                             <td>{elem.Flagging}</td>
//                                             <td>{elem.Indexing}</td>
//                                             <td>{elem.CBSL_QA}</td>
//                                             <td>{elem.Client-QA}</td>
//                                         ))}
//                                         <td>214556467</td>
//                                     </tr> */}
//                                     <tr>
//     <td>Arrow</td>
//     {summaryReport && summaryReport.map((elem, index) => (
//         <React.Fragment key={index}>
//             <td>{elem.Scanned}</td>
//             <td>{elem.QC}</td>
//             <td>{elem.Flagging}</td>
//             <td>{elem.Indexing}</td>
//             <td>{elem.CBSL_QA}</td>
//             <td>{elem.Client_QC}</td>
//         </React.Fragment>
//     ))}

// </tr>

//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='row mt-3'>
//                     <div className='search-report-card'>
//                         <h4>Detailed Report</h4>
//                         <div className='row'>
//                             <div className='col-2'>
//                                 <p>Total row(s) affected: 1</p>
//                             </div>
//                             <div className='col-8'></div>
//                             <div className='col-2'>
//                                 <button className='btn btn-success'>Export CSV</button>
//                             </div>
//                         </div>

//                         <div className='row ms-2 me-2'>
//                             <table className='table-bordered mt-2'>
//                                 <thead>
//                                     <tr>
//                                         <th>Sr.No.</th>
//                                         <th>Location Name</th>
//                                         <th>Scanned</th>
//                                         <th>QC</th>
//                                         <th>Indexing</th>
//                                         <th>Flagging</th>
//                                         <th>CBSL-QA</th>
//                                         <th>Client-QC</th>
//                                         <th>Business Value</th>
//                                         <th>Remarks</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                 {detailedReport && detailedReport.map((elem, index) => (
//                                     <tr onClick={handleLocationView} key={index}>

//                                         <td>{index+1}</td>
//             <td>{elem.locationname}</td>
//             <td>{elem.Scanned}</td>
//             <td>{elem.QC}</td>
//             <td>{elem.Indexing}</td>
//             <td>{elem.Flagging}</td>
//             <td>{elem.CBSL_QA}</td>
//             <td>{elem.Client_QC}</td>
//             <td>{}</td>

//                                     </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//                 {locationView &&
//                     <>
//                         <div className='row mt-3'>
//                             <div className='search-report-card'>
//                                 <h4>Detailed Report</h4>
//                                 <div className='row'>
//                                     <div className='col-2'>
//                                         <p>Total row(s) affected: 1</p>
//                                     </div>
//                                     <div className='col-8'></div>
//                                     <div className='col-2'>
//                                         <button className='btn btn-success'>Export CSV</button>
//                                     </div>
//                                 </div>

//                                 <div className='row ms-2 me-2'>
//                                     <table className='table-bordered mt-2'>
//                                         <thead>
//                                             <tr>
//                                                 <th></th>
//                                                 <th>User Name</th>
//                                                 <th>Scanned</th>
//                                                 <th>QC</th>
//                                                 <th>Indexing</th>
//                                                 <th>Flagging</th>
//                                                 <th>CBSL-QA</th>
//                                                 <th>Client-QC</th>
//                                                 <th>Business Value</th>
//                                                 <th>Remarks</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                         {detailedReportLocationWise && detailedReportLocationWise.map((elem, index) => (
//                                     <tr onClick={handleUserView} key={index}>
//                                         <td>{index+1}</td>
//             <td>{elem.user_type}</td>
//             <td>{elem.Scanned}</td>
//             <td>{elem.QC}</td>
//             <td>{elem.Indexing}</td>
//             <td>{elem.Flagging}</td>
//             <td>{elem.CBSL_QA}</td>
//             <td>{elem.Client_QC}</td>

//                                     </tr>
//                                     ))}
//                                             {/* <tr onClick={handleUserView}>
//                                                 <td>Arrow</td>
//                                                 <td>Rohit</td>
//                                                 <td>1782528</td>
//                                                 <td>414478</td>
//                                                 <td>237903</td>
//                                                 <td>555857</td>
//                                                 <td>45095</td>
//                                                 <td>3868</td>
//                                                 <td>81239.39</td>
//                                                 <td>Approved</td>
//                                             </tr> */}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 }
//                 {userView &&
//                     <>
//                         <div className='row mt-3'>
//                             <div className='search-report-card'>
//                                 <h4>Detailed Report</h4>
//                                 <div className='row'>
//                                     <div className='col-2'>
//                                         <p>Total row(s) affected: 1</p>
//                                     </div>
//                                     <div className='col-8'></div>
//                                     <div className='col-2'>
//                                         <button className='btn btn-success'>Export CSV</button>
//                                     </div>
//                                 </div>

//                                 <div className='row ms-2 me-2'>
//                                     <table className='table-bordered mt-2'>
//                                         <thead>
//                                             <tr>
//                                                 <th></th>
//                                                 <th>User Name</th>
//                                                 <th>Date</th>
//                                                 <th>LotNo</th>
//                                                 <th>File Barcode</th>
//                                                 <th>Scanned</th>
//                                                 <th>QC</th>
//                                                 <th>Indexing</th>
//                                                 <th>Flagging</th>
//                                                 <th>CBSL-QA</th>
//                                                 <th>Client-QC</th>
//                                                 <th>Business Value</th>
//                                                 <th>Remarks</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr onClick={handleUserView}>
//                                                 <td>Arrow</td>
//                                                 <td>Rohit</td>
//                                                 <td>26-04-2024</td>
//                                                 <td>001</td>
//                                                 <td>123423</td>
//                                                 <td>1782528</td>
//                                                 <td>414478</td>
//                                                 <td>237903</td>
//                                                 <td>555857</td>
//                                                 <td>45095</td>
//                                                 <td>3868</td>
//                                                 <td>81239.39</td>
//                                                 <td>Approved</td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 }
//             </div>
//         </>
//     )
// }

// export default CumulativeSummaryReport

import React, { useEffect, useState } from "react";
import { API_URL } from "./API";
import axios from "axios";
import { priceCount } from "./Components/priceCount";

const CumulativeSummaryReport = () => {
  const [locationView, setLocationView] = useState(false);
  const [userView, setUserView] = useState(false);
  const [summaryReport, setSummaryReport] = useState([]);
  const [detailedReport, setDetailedReport] = useState([]);
  const [detailedReportLocationWise, setDetailedReportLocationWise] = useState(
    []
  );
  const [detailedUserReport, setDetailedUserReport] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  const handleLocationView = (locationName) => {
    if (locationName) {
      fetchUserDetailed(locationName);
      setLocationName(locationName); // Set the locationName state
      setLocationView(true);
    } else {
      console.error("Location name is undefined");
    }
  };

  const handleUserView = (username, locationName) => {
    if (username && locationName) {
      fetchUserDetailedReport(username, locationName);
      setSelectedUsername(username);
      setUserView(true);
    } else {
      console.error("Username or location name is undefined");
    }
  };
  const fetchSummaryReport = () => {
    axios
      .get(`${API_URL}/summaryReport`)
      .then((response) => setSummaryReport(response.data))
      .catch((error) => {
        console.error("Error fetching summary report:", error);
      });
  };

  const fetchDetailedReport = () => {
    axios
      .get(`${API_URL}/detailedreport`)
      .then((response) => setDetailedReport(response.data))
      .catch((error) => {
        console.error("Error fetching detailed report:", error);
      });
  };

  const fetchUserDetailed = (locationName) => {
    axios
      .get(`${API_URL}/detailedreportlocationwise`, {
        params: {
          locationName: locationName,
        },
      })
      .then((response) => setDetailedReportLocationWise(response.data))
      .catch((error) => {
        console.error(
          "Error fetching user detailed report by location:",
          error
        );
      });
  };

  const fetchUserDetailedReport = (username, locationName) => {
    axios
      .get(`${API_URL}/UserDetailedReport`, {
        params: {
          username: username,
          locationName: locationName,
        },
      })
      .then((response) => setDetailedUserReport(response.data))
      .catch((error) => {
        console.error("Error fetching user detailed report:", error);
      });
  };

  useEffect(() => {
    fetchSummaryReport();
    fetchDetailedReport();
    if (locationName) {
      fetchUserDetailed(locationName);
    }
    if (selectedUsername && locationName) {
      fetchUserDetailedReport(selectedUsername, locationName);
    }
  }, [locationName, selectedUsername]);

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
                    <th></th>
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
                    <td>Arrow</td>
                    {summaryReport &&
                      summaryReport.map((elem, index) => (
                        <React.Fragment key={index}>
                          <td>{elem.Scanned}</td>
                          <td>{elem.QC}</td>
                          <td>{elem.Indexing}</td>
                          <td>{elem.Flagging}</td>
                          <td>{elem.CBSL_QA}</td>
                          <td>{elem.Client_QC}</td>
                        </React.Fragment>
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
                <button className="btn btn-success">Export CSV</button>
              </div>
            </div>

            <div className="row ms-2 me-2">
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
                  {detailedReport &&
                    detailedReport.map((elem, index) => (
                      <tr
                        onClick={() => handleLocationView(elem.locationname)}
                        key={index}
                      >
                        <td>{index + 1}</td>
                        <td>{elem.locationname}</td>
                        <td>{elem.Scanned}</td>
                        <td>{elem.QC}</td>
                        <td>{elem.Indexing}</td>
                        <td>{elem.Flagging}</td>
                        <td>{elem.CBSL_QA}</td>
                        <td>{elem.Client_QC}</td>
                        <td>{}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {locationView && (
          <>
            <div className="row mt-3">
              <div className="search-report-card">
                <h4>Detailed Report</h4>
                <div className="row">
                  <div className="col-2">
                    <p>Total row(s) affected: 1</p>
                  </div>
                  <div className="col-8"></div>
                  <div className="col-2">
                    <button className="btn btn-success">Export CSV</button>
                  </div>
                </div>

                <div className="row ms-2 me-2">
                  <table className="table-bordered mt-2">
                    <thead>
                      <tr>
                        <th></th>
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
                        detailedReportLocationWise.map((elem, index) => (
                          <tr onClick={handleUserView} key={index}>
                            <td>{index + 1}</td>
                            <td>{elem.user_type}</td>
                            <td>{elem.Scanned}</td>
                            <td>{elem.QC}</td>
                            <td>{elem.Indexing}</td>
                            <td>{elem.Flagging}</td>
                            <td>{elem.CBSL_QA}</td>
                            <td>{elem.Client_QC}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
        {userView && (
          <>
            <div className="row mt-3">
              <div className="search-report-card">
                <h4>Detailed Report</h4>
                <div className="row">
                  <div className="col-2">
                    <p>Total row(s) affected: 1</p>
                  </div>
                  <div className="col-8"></div>
                  <div className="col-2">
                    <button className="btn btn-success">Export CSV</button>
                  </div>
                </div>

                <div className="row ms-2 me-2">
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
                      {detailedUserReport &&
                        detailedUserReport.map((elem, index) => (
                          <tr
                            onClick={() =>
                              handleUserView(elem.username, locationName)
                            }
                            key={index}
                          >
                            <td>{elem.LocationName}</td>
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
                            <td>81239.39</td>
                            <td>Approved</td>
                          </tr>
                        ))}
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

export default CumulativeSummaryReport;
