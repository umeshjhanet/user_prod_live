
import React, {useState} from 'react'

const SideBar = () => {
    const userLog = JSON.parse(localStorage.getItem('user'));

    return (
        <>
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '220px' }}>
                <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg class="bi me-2" width="40" height="32"></svg>
                    <span class="fs-4">{userLog ? userLog.first_name : 'Guest'}</span>
                </a>
                <hr></hr>
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link active" aria-current="page">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/projects" class="nav-link link-dark">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/SiteUser" class="nav-link link-dark">
                            Manage Employee Details
                        </a>
                    </li>
                    <li>
                        <a href="/uploadNonTechnical" class="nav-link link-dark">
                            Upload Non-Technical 
                        </a>
                    </li>
                    <li>
                        <a href="/TaskTray" class="nav-link link-dark">
                            Approval Workflow 
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link link-dark">
                           Log Out
                        </a>
                    </li>
                </ul>
                <hr></hr>
               
            </div>
        </>
    )
}

export default SideBar