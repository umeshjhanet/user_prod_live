import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { FaUserLarge } from "react-icons/fa6";
import Header from './Components/Header';
import { API_URL } from './API';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [userDB, setUserDB] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const [logoutTimer, setLogoutTimer] = useState(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      const timer = setTimeout(() => {
        console.log("Logging out due to inactivity...");
        logout();
      }, 9000000); // 3 minutes
      setLogoutTimer(timer);
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
      "wheel"
    ];

    const resetTimeoutHandler = () => {
      resetTimeout();
    };

    for (const event of events) {
      window.addEventListener(event, resetTimeoutHandler);
    }

    resetTimeout();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      for (const event of events) {
        window.removeEventListener(event, resetTimeoutHandler);
      }
    };
  }, [logoutTimer]);

  const logout = () => {
    console.log('Logging out due to inactivity.');
    navigate('/');
  };

  const errors = {
    username: "Invalid user",
    password: "Invalid password",
    blank: "Please fill in all fields"
  };
  const renderErrorMessage = (name) =>
  errorMessages[name] && (
    <div className="error mt-1" style={{ marginLeft: '35px' }}>{errorMessages[name]}</div>
  );
// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();
  const { uname, password } = event.target.elements;

  // Check for empty fields
  if (!uname.value || !password.value) {
    setErrorMessages({ blank: errors.blank });
    return;
  }

  // Send login request to backend
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_email_id: uname.value, password: password.value })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Data received from backend:", data);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/projects');
    } else if (response.status === 401) {
      setErrorMessages({ password: errors.password }); // Invalid username or email
    } else if (response.status === 403) {
      setErrorMessages({ password: errors.password });
       // Incorrect password
    } else if (response.status === 404) {
      setErrorMessages({ username: errors.username });
    }
    else {
      setError("An unexpected error occurred. Please try again later.");
    }
  } catch (error) {
    console.error("Error:", error);
    setError("An unexpected error occurred. Please try again later.");
  }
};
 

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };

  return (
    <>
      <div className="video-background">
        <video autoPlay loop muted className="fullscreen-bg__video">
          <source src={`${process.env.PUBLIC_URL}/Login_Screen.mp4`} type="video/mp4" />
        </video>
        <div className="login-card">
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className='login-card-content'>
                <div className="sign-in text-center">
                  <h1 style={{ fontSize: '30px' }}>SIGN IN</h1>
                </div>
                <div className="password-field mt-4 ms-2">
                  <span className="flex justify-around items-start">
                    <FaUserLarge className="me-2" size={20} color="gray" />
                  </span>
                  <input type='email' name='uname' placeholder='Username' className='password-inputbox' />
                </div>
                {renderErrorMessage('username')}
                <div className="password-field mt-3 ms-2">
                  <span className="flex justify-around items-start" onClick={handleToggle}>
                    <Icon className="absolute me-2" icon={icon} size={20} style={{ color: 'gray' }} />
                  </span>
                  <input
                    type={type}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="password-inputbox"
                  />
                </div>
                {renderErrorMessage('password')}
                {renderErrorMessage('blank')}
                <p className="text-end mt-2 me-3" style={{ color: 'red', fontSize: '14px' }}>Forgot Password ?</p>
                <input type='submit' className='btn login-btn' placeholder="Log In"></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;
