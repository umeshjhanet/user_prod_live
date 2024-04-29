import React, { useState } from 'react'

const CumulativeSummaryReport = () => {
    const [locationView, setLocationView] = useState(false);
    const [userView, setUserView] = useState(false);
    const handleLocationView = () => {
        setLocationView(true);
    }
    const handleUserView = () => {
        setUserView(true);
    }
    return (
        <>
            <div className='container'>
                <div className='row mt-3'>
                    <div className='search-report-card'>
                        <h4>Summary Report</h4>
                        <div className='row ms-2 me-2'>
                            <table className='table-bordered mt-2'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Scanned</th>
                                        <th>QC</th>
                                        <th>Segregation</th>
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
                                        <td>1782528</td>
                                        <td>414478</td>
                                        <td>0</td>
                                        <td>237903</td>
                                        <td>555857</td>
                                        <td>45095</td>
                                        <td>3868</td>
                                        <td>81239.39</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='search-report-card'>
                        <h4>Detailed Report</h4>
                        <div className='row'>
                            <div className='col-2'>
                                <p>Total row(s) affected: 1</p>
                            </div>
                            <div className='col-8'></div>
                            <div className='col-2'>
                                <button className='btn btn-success'>Export CSV</button>
                            </div>
                        </div>

                        <div className='row ms-2 me-2'>
                            <table className='table-bordered mt-2'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Location Name</th>
                                        <th>Scanned</th>
                                        <th>QC</th>
                                        <th>Segregation</th>
                                        <th>Indexing</th>
                                        <th>Flagging</th>
                                        <th>CBSL-QA</th>
                                        <th>Client-QC</th>
                                        <th>Business Value</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={handleLocationView}>
                                        <td>Arrow</td>
                                        <td>Agra</td>
                                        <td>1782528</td>
                                        <td>414478</td>
                                        <td>0</td>
                                        <td>237903</td>
                                        <td>555857</td>
                                        <td>45095</td>
                                        <td>3868</td>
                                        <td>81239.39</td>
                                        <td>Approved</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {locationView &&
                    <>
                        <div className='row mt-3'>
                            <div className='search-report-card'>
                                <h4>Detailed Report</h4>
                                <div className='row'>
                                    <div className='col-2'>
                                        <p>Total row(s) affected: 1</p>
                                    </div>
                                    <div className='col-8'></div>
                                    <div className='col-2'>
                                        <button className='btn btn-success'>Export CSV</button>
                                    </div>
                                </div>

                                <div className='row ms-2 me-2'>
                                    <table className='table-bordered mt-2'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>User Name</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Segregation</th>
                                                <th>Indexing</th>
                                                <th>Flagging</th>
                                                <th>CBSL-QA</th>
                                                <th>Client-QC</th>
                                                <th>Business Value</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr onClick={handleUserView}>
                                                <td>Arrow</td>
                                                <td>Rohit</td>
                                                <td>1782528</td>
                                                <td>414478</td>
                                                <td>0</td>
                                                <td>237903</td>
                                                <td>555857</td>
                                                <td>45095</td>
                                                <td>3868</td>
                                                <td>81239.39</td>
                                                <td>Approved</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {userView &&
                    <>
                        <div className='row mt-3'>
                            <div className='search-report-card'>
                                <h4>Detailed Report</h4>
                                <div className='row'>
                                    <div className='col-2'>
                                        <p>Total row(s) affected: 1</p>
                                    </div>
                                    <div className='col-8'></div>
                                    <div className='col-2'>
                                        <button className='btn btn-success'>Export CSV</button>
                                    </div>
                                </div>

                                <div className='row ms-2 me-2'>
                                    <table className='table-bordered mt-2'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>User Name</th>
                                                <th>Date</th>
                                                <th>LotNo</th>
                                                <th>File Barcode</th>
                                                <th>Scanned</th>
                                                <th>QC</th>
                                                <th>Segregation</th>
                                                <th>Indexing</th>
                                                <th>Flagging</th>
                                                <th>CBSL-QA</th>
                                                <th>Client-QC</th>
                                                <th>Business Value</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr onClick={handleUserView}>
                                                <td>Arrow</td>
                                                <td>Rohit</td>
                                                <td>26-04-2024</td>
                                                <td>001</td>
                                                <td>123423</td>
                                                <td>1782528</td>
                                                <td>414478</td>
                                                <td>0</td>
                                                <td>237903</td>
                                                <td>555857</td>
                                                <td>45095</td>
                                                <td>3868</td>
                                                <td>81239.39</td>
                                                <td>Approved</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default CumulativeSummaryReport