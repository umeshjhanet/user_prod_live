import React from 'react'
import { BrowserRouter, Routes, Route, Link, Router } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";


const Header = () => {
  const userLog = JSON.parse(localStorage.getItem('user'));
  return (
    <>
      
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#4BC0C0', color:'white', textAlign:'center' }}>
          <div className="container-fluid" style={{textAlign:'center'  }} >
            <h4>User Production Dashboard- Powered by CBSL</h4>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                </ul>
                <form className="d-flex">
                   <Link to='/'>
                    <button href='/' className="btn logout-btn" style={{ color: 'white', marginTop: '10px', paddingTop:'4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  </Link>
                  <p className='ms-2' style={{ color: 'white', marginTop: '20px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
                </form>
              </div>
            </div>
        </nav>
      
      
    </>
  )
}

export default Header