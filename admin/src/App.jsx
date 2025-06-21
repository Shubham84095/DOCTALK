import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import AllAppointments from './pages/admin/AllAppointments';
import AddDoctor from './pages/admin/AddDoctor';
import DoctorsList from './pages/admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorProfile from './pages/doctor/DoctorProfile';

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* ---------ADMIN ROUTES------------*/}
          <Route path='/' element = {<></>}/>
          <Route path='/admin-dashboard' element = {<Dashboard/>}/>
          <Route path='/all-appointments' element = {<AllAppointments/>}/>
          <Route path='/add-doctor' element = {<AddDoctor/>}/>
          <Route path='/doctors-list' element = {<DoctorsList/>}/>

          {/* ---------DOCTOR ROUTES------------*/}
          <Route path='/doctor-dashboard' element = {<DoctorDashboard/>}/>
          <Route path='/doctor-appointments' element = {<DoctorAppointments/>}/>
          <Route path='/doctor-profile' element = {<DoctorProfile/>}/>
        </Routes>
      </div>
      <ToastContainer />
    </div>
  ) :
    <div>
      <Login />
      <ToastContainer />
    </div>
}

export default App
