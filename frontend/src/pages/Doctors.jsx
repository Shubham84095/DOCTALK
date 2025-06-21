import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialities = ["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"];

  return (
    <div className="px-4 md:px-12">
      <p className='text-gray-600'>Browse through the doctors specialist.</p>

      {/* Speciality Filter Section */}
      <div className="flex flex-col sm:flex-row gap-6 mt-5">
        {/* On mobile: horizontal scroll, on desktop: vertical */}
        <div className="sm:flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-auto overflow-x-auto sm:overflow-visible">
          <div className="flex sm:flex-col gap-2 w-max sm:w-auto min-w-full">
            {specialities.map((item) => (
              <p
                key={item}
                onClick={() => speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)}
                className={`whitespace-nowrap border px-4 py-2 border-gray-300 rounded transition-all cursor-pointer ${speciality === item ? "bg-indigo-100 text-black" : ""
                  }`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div className='w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300'
                key={index}
              >
                <img className='bg-primary' src={item.image} alt="" />
                <div className='p-4'>
                  <div className="flex items-center gap-2">
                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
                    <p className={`text-sm font-medium ${item.available ? 'text-green-600' : 'text-gray-500'}`}>
                      {item.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
