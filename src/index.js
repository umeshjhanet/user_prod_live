import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import LocationWiseDashboard from './LocationWiseDashboard';
import PrivateRoute from './PrivateRoute';
import SiteUser from './SiteUser';
import Home from './home';
import TaskTray from './TaskTray';

const App = () => {
 
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
          <Route path="/projects" element={<PrivateRoute element={<Projects />} />} />
          <Route path="/home" element={<PrivateRoute element={<Home/>} />} />
          <Route path="/TaskTray" element={<PrivateRoute element={<TaskTray/>} />} />
          <Route path="/AllProjectDashboard"element={<PrivateRoute element={<AllProjectDashboard />} />}/>
          <Route path="/LocationWiseDashboard" element={<PrivateRoute element={<LocationWiseDashboard />} />}/>
          <Route path="/UPDCDashboard"element={<PrivateRoute element={<Dashboard />} />}/>
          <Route path="/uploadNonTechnical" element={<PrivateRoute element={<NonTechModal />} />}/>
          <Route path="/TelDashboard"element={<PrivateRoute element={<TelDashboard />} />}/>
          <Route path="/TelDashboard"element={<PrivateRoute element={<TelNonTechModal />} />}/>
          <Route path="/SiteUser"element={<PrivateRoute element={<SiteUser/>} />}/>
          <Route path="/TelDashboard"element={<PrivateRoute element={<TelNonTechCommulative />} />}/>
          <Route path="/TelDashboard"element={<PrivateRoute element={<TelNonTechPeriodic />} />}/>
          <Route path="/TelDashboard"element={<PrivateRoute element={<TelAllCumulative />} />}/>
          <Route path="/TelDashboard"element={<PrivateRoute element={<TelAllPeriodic />} />}/>
          <Route path="/KarDashboard"element={<PrivateRoute element={<KarDashboard />} />}/>
          <Route path="/KarDashboard"element={<PrivateRoute element={<KarNonTechCumulative />} />}/>
          <Route path="/KarDashboard"element={<PrivateRoute element={<KarNonTechPeriodic />} />}/>
          <Route path="/KarDashboard"element={<PrivateRoute element={<KarAllCumulative />} />}/>
          <Route path="/KarDashboard"element={<PrivateRoute element={<KarAllPeriodic />} />}/>
          <Route path="/KarDashboard"element={<PrivateRoute element={<KarNonTechModal />} />}/>
          <Route path="/User_Form"element={<PrivateRoute element={<User_Form />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<PeriodicSummaryReport />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<CumulativeSummaryReport />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<NonTechCumulative />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<AllCummulative />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<AllPeriodic />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<NonTechPeriodic />} />}/>
          <Route path="/dashboard"element={<PrivateRoute element={<CalculatorModal />} />}/>
          <Route path="/PriceRateForm"element={<PrivateRoute element={<PriceRateForm />} />}/>
          <Route path="/nontechForm"element={<PrivateRoute element={<NonTechForm />} />}/>
          <Route path="/TaskForm"element={<PrivateRoute element={<TaskForm/>}/>}/>
          </Routes>
          </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals();


