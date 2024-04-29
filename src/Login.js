import React from 'react'
import Header from './Components/Header'
import './App.css';

const Login = () => {
  return (
    <>
    <Header/>
    <div className='container-fluid'>
          <div className='row'>
              <div className="form">
                <form >
                  <div className='login-card'>
                    <div className="password-field mt-4 ms-2">
                      <input type='email' name='uname' placeholder='Username' className='password-inputbox' />
                    </div>
                    <div className="password-field mt-3 ms-2">
                      <input
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        className="password-inputbox"
                      />
                    </div>
                    <p className="text-end mt-2 me-3" style={{ color: 'white', fontSize: '14px',fontWeight:'500' }}>Forgot Password ?</p>
                    <input type='submit' className='btn login-btn' placeholder="Log In"></input>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
  )
}

export default Login