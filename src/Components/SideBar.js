
import React, { useState } from 'react'

const SideBar = () => {
    const userLog = JSON.parse(localStorage.getItem('user'));
    const projects = userLog ? userLog.projects : [];
    const getDashboardLink = () => {
        if (projects.includes(1)) {
            return '/UPDCDashboard';
        } else if (projects.includes(2)) {
            return '/TelDashboard';
        } else if (projects.includes(3)) {
            return '/KarDashboard';
        }
        return '/projects'; // Default case if no project is assigned or project ID doesn't match
    };
    const superAdmin = () => {
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
                            <a href={getDashboardLink()} class="nav-link link-dark">
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
    const cbslAdmin = () => {
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
                            <a href={getDashboardLink()} class="nav-link link-dark">
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
    const cbslHR = () => {
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
                            <a href={getDashboardLink()} class="nav-link link-dark">
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

    const cbslUser = () => {
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
                            <a href={getDashboardLink()} class="nav-link link-dark">
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
    const isSuperAdmin = userLog && userLog.user_roles.includes("Super Admin");
    //   const isServerUser = userLog && userLog.user_roles.includes("Server Database Monitoring");
    const isCbslUser = userLog && userLog.user_roles.some(role => ["CBSL Site User", "PM", "PO"].includes(role));
    const isHR = userLog && userLog.user_roles.includes("HR");
    const iscbslAdmin = userLog && userLog.user_roles.includes("CBSL Admin");
    return (
        <>
            {isSuperAdmin && superAdmin()}
            {iscbslAdmin && cbslAdmin()}
            {isCbslUser && cbslUser()}
            {isHR && cbslHR()}
            {iscbslAdmin && cbslAdmin()}
            {/* {!isAdmin && !isCbslUser && !isDistrictHeadUser && !iscbslAdmin && !isServerUser && normalUser()}   */}
        </>
    )
}

export default SideBar