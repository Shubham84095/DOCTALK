import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../../../frontend/src/assets/assets'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, formatDate, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll min-h-[60vh]'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {
          appointments.map((item, index) => (
            <div
              className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
              key={index}
            >
              <p className='max-sm:hidden'>{index + 1}</p>

              <div className='flex items-center gap-2'>
                <img className='w-8 h-8 rounded-full object-cover' src={item.userData?.image} alt="Patient" />
                <p className='truncate'>{item.userData?.name}</p>
              </div>

              <p>{calculateAge(item.userData?.dob) || '-'}</p>

              <p>{formatDate(item.slotDate)}, {(item.slotTime).toUpperCase()}</p>

              <div className='flex items-center gap-2'>
                <img className='w-8 h-8 rounded-full object-cover' src={item.docData?.image} alt="Doctor" />
                <p className='truncate'>{item.docData?.name}</p>
              </div>

              <p>{currency}{item.docData?.fees || 0}</p>

              <div className='flex items-center'>
                {
                  item.isCompleted ? (
                    <p className="text-xs text-green-500 font-semibold whitespace-nowrap">
                      Completed
                    </p>
                  ) : item.cancelled ? (
                    <p className="text-xs text-red-500 font-semibold whitespace-nowrap">
                      Cancelled
                    </p>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Cancel
                    </button>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AllAppointments
