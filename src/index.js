import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/Header';
import Login from './Login';
import User_Form from './User_Form';
import Dashboard from './dashboard';
import PeriodicSummaryReport from './periodicSummaryReport';
import CumulativeSummaryReport from './cumulativeSummaryReport';
import Projects from './projects';
import PriceRateForm from './PriceRateForm';
import NonTechForm from './nonTechForm';
import TaskForm from './TaskForm';



const App = () => {
 
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/User_Form" element={<User_Form />} />
          <Route path="/dashboard" element={<PeriodicSummaryReport />} />
          <Route path="/dashboard" element={<CumulativeSummaryReport />} />
          <Route path="/PriceRateForm" element={<PriceRateForm />} />
          <Route path="/nontechForm" element={<NonTechForm />} />
          <Route path="/TaskForm" element={<TaskForm/>}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals();

