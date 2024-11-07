import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom


const SideBar = () => {
    const userLog = JSON.parse(localStorage.getItem('user'));
    const projects = userLog ? userLog.projects : [];
    const Role = userLog ? userLog.user_roles : [];
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const getDashboardLink = () => {
        if (projects.includes(1)) {
            return '/UPDCDashboard';
        } else if (projects.includes(2)) {
            return '/TelDashboard';
        } else if (projects.includes(3)) {
            return '/KarDashboard';
        }
        return '/UPDCDashboard'; // Default case if no project is assigned or project ID doesn't match
    };

    const getTaskTrayLink = () => {
        if (projects.includes(1)) {
            return '/UPDCTaskTray';
        } else if (projects.includes(2)) {
            return '/TaskTray';
        } else if (projects.includes(3)) {
            return '/KarTaskTray';
        } else if (Role.includes('HR')) {
            return '/hrView';
        }else if (Role.includes('PO')) {
            return '/POTaskTray';
        }
        return ''; // Default case if no project is assigned or project ID doesn't match
    };


    const getUploadNonTechLink = () => {
        if (projects.includes(1) || projects.includes(2) || projects.includes(3)) {
            return '/uploadNonTechnical';
        }
        return ''; // Default case if no project is assigned or project ID doesn't match
    };
    const getDeliveredData = () => {
            return '/MainOptions';
    };

    const renderLink = (to, label) => (
        <li>
            <Link
                to={to}
                className={`nav-link link-dark ${location.pathname === to ? 'active' : ''}`}
            >
                {label}
            </Link>
        </li>
    );

    const superAdmin = () => (
        <div className="sidebar bg-light" style={{ width: '200px', height: '100%' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">{userLog ? userLog.first_name : 'Guest'}</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {renderLink(getDashboardLink(), 'Dashboard')}
                {renderLink('/SiteUser', 'Manage Employee Details')}
                {renderLink(getDeliveredData(), 'Delivered Data')}
                {renderLink('/user_form', 'Add User')}
                {renderLink('/setTarget', 'Set Target')}
            </ul>
            <hr />
        </div>
    );

    const cbslAdmin = () => (
        <div className="sidebar bg-light" style={{ width: '220px' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">{userLog ? userLog.first_name : 'Guest'}</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {renderLink(getDashboardLink(), 'Dashboard')}
                {renderLink('/SiteUser', 'Manage Employee Details')}
            </ul>
            <hr />
        </div>
    );
    const cbslHR = () => (
        <div className="sidebar bg-light" style={{ width: '220px' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">{userLog ? userLog.first_name : 'Guest'}</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {renderLink(getDashboardLink(), 'Dashboard')}
                {renderLink('/SiteUser', 'Manage Employee Details')}
                {renderLink('/faceAttendance', 'Face Attendance')}
                {renderLink(getTaskTrayLink(), 'Approval Workflow')}
            </ul>
            <hr />
        </div>
    );
    const cbslUser = () => (
        <div className="sidebar bg-light" style={{ width: '220px' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">{userLog ? userLog.first_name : 'Guest'}</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {renderLink(getDashboardLink(), 'Dashboard')}
                {renderLink('/SiteUser', 'Manage Employee Details')}
                
            </ul>
            <hr />
        </div>
    );
    const cbslPO = () => (
        <div className="sidebar bg-light" style={{ width: '220px' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">{userLog ? userLog.first_name : 'Guest'}</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {renderLink(getDashboardLink(), 'Dashboard')}
                {renderLink('/SiteUser', 'Manage Employee Details')}
                {renderLink(getTaskTrayLink(), 'Approval Workflow')}
            </ul>
            <hr />
        </div>
    );
    const isSuperAdmin = userLog && userLog.user_roles.includes('Super Admin');
    const isCbslUser = userLog && userLog.user_roles.some(role => ['CBSL Site User', 'PM'].includes(role));
    const isHR = userLog && userLog.user_roles.includes('HR');
    const isPO = userLog && userLog.user_roles.includes('PO');
    const iscbslAdmin = userLog && userLog.user_roles.includes('CBSL Admin');
    return (
        <>
        <div className='sidebar'>
            {isSuperAdmin && superAdmin()}
            {iscbslAdmin && cbslAdmin()}
            {isCbslUser && cbslUser()}
            {isHR && cbslHR()}
            {isPO && cbslPO()}
            </div>
        </>
    );
};
export default SideBar;
