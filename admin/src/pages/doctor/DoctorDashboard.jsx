import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { formatDate, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])
  return dashData && (
    <div className="m-5">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

        {/* Doctors */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <img src={assets.earning_icon} alt="Doctors" className="w-10 h-10 mr-4" />
          <div>
            <p className="text-xl font-semibold text-gray-800">{currency}{dashData.earnings}</p>
            <p className="text-gray-500">Earning</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <img src={assets.appointments_icon} alt="Appointments" className="w-10 h-10 mr-4" />
          <div>
            <p className="text-xl font-semibold text-gray-800">{dashData.appointments}</p>
            <p className="text-gray-500">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <img src={assets.patients_icon} alt="Patients" className="w-10 h-10 mr-4" />
          <div>
            <p className="text-xl font-semibold text-gray-800">{dashData.patients}</p>
            <p className="text-gray-500">Patients</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className='bg-white rounded-lg shadow border'>

        {/* Header */}
        <div className='flex items-center gap-3 px-5 py-4 border-b'>
          <img src={assets.list_icon} alt="list" className='w-5 h-5' />
          <p className='text-base font-semibold text-gray-700'>Recent Bookings</p>
        </div>

        {/* List */}
        <div className='divide-y'>
          {dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition' key={index}>
              <img className='rounded-full w-10 h-10 object-cover' src={item.userData.image} alt="Doctor" />
              <div className='flex-1 text-sm'>
                <p className='font-medium text-gray-800'>{item.userData.name}</p>
                <p className='text-gray-500 text-xs'>{formatDate(item.slotDate)} - {item.slotTime.toUpperCase()}</p>
              </div>
              {item.cancelled ? (
                <p className='text-xs text-red-500 font-semibold whitespace-nowrap'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-xs text-green-600 font-semibold whitespace-nowrap'>Completed</p>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      cancelAppointment(item._id);
                      getDashData();
                    }}
                    className='text-xs text-red-500 hover:underline'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      completeAppointment(item._id);
                      getDashData();
                    }}
                    className='text-xs text-green-600 hover:underline'
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

export default DoctorDashboard
