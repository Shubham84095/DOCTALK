import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { calculateAge, formatDate, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className='w-full max-w-6xl mx-auto m-5'>
      <p className='mb-4 text-xl font-semibold text-gray-700'>All Appointments</p>

      <div className='bg-white border rounded-lg text-sm max-h-[80vh] min-h-[50vh] overflow-y-auto shadow-sm'>
        {/* Header Row */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 py-3 px-6 border-b bg-gray-100 font-medium text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointment Rows */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center gap-2 py-4 px-6 border-b hover:bg-gray-50 text-gray-600'
          >
            {/* Index */}
            <p className='max-sm:hidden font-medium'>{index + 1}</p>

            {/* Patient Info */}
            <div className='flex items-center gap-2'>
              <img
                src={item.userData.image}
                alt="patient"
                className='w-8 h-8 rounded-full object-cover'
              />
              <p className='truncate'>{item.userData.name}</p>
            </div>

            {/* Payment Status */}
            <p className={`text-xs font-semibold ${item.payment ? 'text-green-600' : 'text-yellow-600'}`}>
              {item.payment ? 'Online' : 'Cash'}
            </p>

            {/* Age */}
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

            {/* Date & Time */}
            <p>
              {formatDate(item.slotDate)}, {item.slotTime?.toUpperCase()}
            </p>

            {/* Fees */}
            <p className='text-gray-800 font-medium'>
              {currency}{item.amount}
            </p>

            {/* Action */}
            <div className='flex items-center gap-3'>
              {item.cancelled ? (
                <p className='text-xs text-red-500 font-semibold'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-xs text-green-600 font-semibold'>Completed</p>
              ) : (
                <>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-xs text-red-500 hover:underline'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className='text-xs text-blue-600 hover:underline'
                  >
                    Complete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
