import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/Header';
import Login from './Login';
import User_Form from './User_Form';
import Dashboard from './UPDCDashboard';
import PeriodicSummaryReport from './periodicSummaryReport';
import CumulativeSummaryReport from './cumulativeSummaryReport';
import Projects from './projects';
import PriceRateForm from './PriceRateForm';
import NonTechForm from './nonTechForm';
import TaskForm from './TaskForm';
import NonTechCumulative from './NonTechCumulative';
import NonTechPeriodic from './NonTechPeriodic';
import CalculatorModal from './Components/CalculatorModal';
import AllCummulative from './AllCummulative';
import KarDashboard from './KarDashboard';
import TelDashboard from './TelDashboard';
import AllPeriodic from './AllPeriodic';
import TelNonTechCommulative from './TelNonTechCommulative';
import TelNonTechPeriodic from './TelNonTechPeriodic';
import KarNonTechCumulative from './KarNonTechCumulative';
import KarNonTechPeriodic from './KarNonTechPeriodic';
import TelAllCumulative from './TelAllCumulative';
import TelAllPeriodic from './TelAllPeriodic';
import KarAllCumulative from './KarAllCumulative';
import KarAllPeriodic from './KarAllPeriodic';
import NonTechModal from './Components/NonTechModal';
import TelNonTechModal from './Components/TelNonTechModal';
import KarNonTechModal from './Components/KarNonTechModal';
import AllProjectDashboard from './AllProjectDashboard';

const App = () => {
 
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/AllProjectDashboard" element={<AllProjectDashboard />} />
          <Route path="/UPDCDashboard" element={<Dashboard />} />
          <Route path="/UPDCDashboard" element={<NonTechModal />} />
          <Route path="/TelDashboard" element={<TelDashboard />} />
          <Route path="/TelDashboard" element={<TelNonTechModal />} />
          <Route path="/TelDashboard" element={<TelNonTechCommulative />} />
          <Route path="/TelDashboard" element={<TelNonTechPeriodic />} />
          <Route path="/TelDashboard" element={<TelAllCumulative />} />
          <Route path="/TelDashboard" element={<TelAllPeriodic />} />
          <Route path="/KarDashboard" element={<KarDashboard />} />
          <Route path="/KarDashboard" element={<KarNonTechCumulative />} />
          <Route path="/KarDashboard" element={<KarNonTechPeriodic />} />
          <Route path="/KarDashboard" element={<KarAllCumulative />} />
          <Route path="/KarDashboard" element={<KarAllPeriodic />} />
          <Route path="/KarDashboard" element={<KarNonTechModal />} />
          <Route path="/User_Form" element={<User_Form />} />
          <Route path="/dashboard" element={<PeriodicSummaryReport />} />
          <Route path="/dashboard" element={<CumulativeSummaryReport />} />
          <Route path="/dashboard" element={<NonTechCumulative />} />
          <Route path="/dashboard" element={<AllCummulative />} />
          <Route path="/dashboard" element={<AllPeriodic />} />
          <Route path="/dashboard" element={<NonTechPeriodic />} />
          <Route path="/dashboard" element={<CalculatorModal />} />
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


