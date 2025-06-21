import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendURL, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const getAvailableSlots = async () => {
    const allSlots = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(now.getDate() + i);
      currentDate.setHours(10, 0, 0, 0);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        if (currentMinutes <= 30) {
          currentDate.setHours(currentHour, 30, 0, 0);
        } else {
          currentDate.setHours(currentHour + 1, 0, 0, 0);
        }

        if (currentDate >= endTime) {
          allSlots.push([]);
          continue;
        }
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login first');
      navigate('/login');
      scrollTo(0, 0);
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const toastId = toast.loading("Booking your appointment...");

      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      toast.update(toastId, {
        render: data.message,
        type: data.success ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
      });

      if (data.success) {
        getDoctorsData();
        navigate('/my-appointments');
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    const fetchDocInfo = async () => {
      const info = doctors.find(doc => doc._id === docId);
      setDocInfo(info);
    };

    if (doctors?.length) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  if (!docInfo) {
    return <div>Loading doctor information...</div>;
  }

  // Compute booked slots for the selected date
  const selectedDate = docSlots[slotIndex]?.[0]?.datetime;
  const day = selectedDate?.getDate();
  const month = selectedDate?.getMonth() + 1;
  const year = selectedDate?.getFullYear();
  const slotDateKey = `${day}_${month}_${year}`;
  const bookedTimes = docInfo.slots_booked?.[slotDateKey] || [];

  const availableSlots = docSlots[slotIndex]?.filter(
    (slot) => !bookedTimes.includes(slot.time)
  );

  return (
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-600'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className='py-0.5 px-2 border border-gray-400 text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          <div className='flex flex-col text-sm font-medium text-gray-900 mt-3'>
            <p className='flex items-center gap-1'>
              About <img src={assets.info_icon} alt='' />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:{' '}
            <span className='text-gray-600'>
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 &&
            docSlots.map((item, index) => {
              const dateObj = new Date();
              dateObj.setDate(dateObj.getDate() + index);

              return (
                <div
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime('');
                  }}
                  key={index}
                  className={`text-center py-4 px-3 w-16 flex-shrink-0 rounded-xl cursor-pointer text-sm ${
                    slotIndex === index
                      ? 'bg-primary text-white'
                      : 'border border-gray-400 text-gray-600 bg-white hover:bg-gray-50'
                  }`}
                >
                  <p>{daysOfWeek[dateObj.getDay()]}</p>
                  <p>{dateObj.getDate()}</p>
                </div>
              );
            })}
        </div>

        <div>
          {docSlots.length > 0 && (
            <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
              {availableSlots && availableSlots.length > 0 ? (
                availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlotTime(slot.time)}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full transition capitalize ${
                      slot.time === slotTime
                        ? 'bg-primary text-white'
                        : 'text-gray-500 border border-gray-300 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {slot.time.toLowerCase()}
                  </button>
                ))
              ) : (
                <p className='text-sm text-gray-500 px-4 py-2 rounded-full bg-red-100 border border-red-300 whitespace-nowrap'>
                  No slots available
                </p>
              )}
            </div>
          )}
        </div>

        <button
          disabled={!slotTime}
          className={`text-sm font-light px-14 py-3 rounded-full my-6 transition-colors ${
            !slotTime
              ? 'bg-gray-300 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          onClick={() => bookAppointment()}
        >
          Book an appointment
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
