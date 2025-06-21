import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)
  const { formatDate } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className="m-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Doctors */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <img src={assets.doctor_icon} alt="Doctors" className="w-10 h-10 mr-4" />
          <div>
            <p className="text-xl font-semibold">{dashData.doctors}</p>
            <p className="text-gray-500">Doctors</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <img src={assets.appointments_icon} alt="Appointments" className="w-10 h-10 mr-4" />
          <div>
            <p className="text-xl font-semibold">{dashData.appointments}</p>
            <p className="text-gray-500">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <img src={assets.patients_icon} alt="Patients" className="w-10 h-10 mr-4" />
          <div>
            <p className="text-xl font-semibold">{dashData.patients}</p>
            <p className="text-gray-500">Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>

        <div className='flex items-end gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Recent Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.docData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                  <p className='text-gray-500'>{formatDate(item.slotDate)}</p>
                </div>
                {
                  item.isCompleted ? (
                    <p className='text-xs text-green-500 font-semibold whitespace-nowrap'>
                      Completed
                    </p>
                  ) : item.cancelled ? (
                    <p className='text-xs text-red-500 font-semibold whitespace-nowrap'>
                      Cancelled
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        cancelAppointment(item._id);
                        getDashData();
                      }}
                      className='text-xs text-red-500 hover:underline'
                    >
                      Cancel
                    </button>
                  )
                }

              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard
