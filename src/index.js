import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/Header';
import Login from './Login';
import User_Form from './User_Form';
import UPDCDashboard from './UPDCDashboard';
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
import TelNonTechModal from './Components/TelNonTechModal';
import KarNonTechModal from './Components/KarNonTechModal';
import AllProjectDashboard from './AllProjectDashboard';
import LocationWiseDashboard from './LocationWiseDashboard';
import PrivateRoute from './PrivateRoute';
import SiteUser from './SiteUser';
import Home from './home';
import TaskTray from './TaskTray';
import UploadNonTechModal from './uploadNonTechnical';
import KarTaskTray from './KarTaskTray';
import DynamicDashboard from './Dashboard';
import MainOptions from './MainOptions';
import ProjectGraph from './projectGraph';
import Attendance from './attendance';
import AllTaskTray from './allTaskTray';
import UPDCTaskTray from './UPDCTaskTray';
import SetTarget from './setTarget';
import POTaskTray from './POTaskTray';
import FaceAttendance from './faceAttendance';
import HRView from './hrView';

const App = () => {
 
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
          <Route path="/projects" element={<PrivateRoute element={<Projects />} />} />
          <Route path="/home" element={<PrivateRoute element={<Home/>} />} />
          <Route path="/attendance" element={<PrivateRoute element={<Attendance/>} />} />
          <Route path="/allTaskTray" element={<PrivateRoute element={<AllTaskTray/>} />} />
          <Route path="/Dashboard/:projectId" element={<PrivateRoute element={<DynamicDashboard />} />} />
          <Route path="/MainOptions" element={<PrivateRoute element={<MainOptions />} />} />
          <Route path="/projectGraph" element={<PrivateRoute element={<ProjectGraph />} />} />
          <Route path="/UPDCTaskTray" element={<PrivateRoute element={<UPDCTaskTray/>} />} />
          <Route path="/TaskTray" element={<PrivateRoute element={<TaskTray/>} />} />
          <Route path="/KarTaskTray" element={<PrivateRoute element={<KarTaskTray/>} />} />
          <Route path="/AllProjectDashboard"element={<PrivateRoute element={<AllProjectDashboard />} />}/>
          <Route path="/LocationWiseDashboard" element={<PrivateRoute element={<LocationWiseDashboard />} />}/>
          <Route path="/UPDCDashboard"element={<PrivateRoute element={<UPDCDashboard />} />}/>
          <Route path="/uploadNonTechnical" element={<PrivateRoute element={<UploadNonTechModal />} />}/>
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
          <Route path="/setTarget"element={<PrivateRoute element={<SetTarget/>}/>}/>
          <Route path="/faceAttendance"element={<PrivateRoute element={<FaceAttendance/>}/>}/>
          <Route path="/POTaskTray"element={<PrivateRoute element={<POTaskTray/>}/>}/>
          <Route path="/hrView"element={<PrivateRoute element={<HRView/>}/>}/>
          </Routes>
          </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals();


