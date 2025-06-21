import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="p-6 max-w-6xl max-h-[90vh] overflow-y-scroll mx-auto bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">All Doctors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow hover:shadow-lg hover:ring-1 hover:ring-blue-400 transition duration-300 overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto object-cover"
            />

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <p className="text-sm text-blue-600 font-medium">{item.speciality}</p>

              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Experience:</strong> {item.experience}</p>
                <p><strong>Fees:</strong> ₹{item.fees}</p>
              </div>

              <button
                onClick={() => changeAvailability(item._id)}
                className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition 
    ${item.available
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'}
  `}
              >
                Mark as {item.available ? 'Unavailable' : 'Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
