import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendURL + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const formatDate = (slotDate) => {
    const [day, month, year] = slotDate.split('_');
    const dateObj = new Date(year, month - 1, day);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = dateObj.toLocaleDateString('en-US', options);

    const [formattedMonth, formattedDay, formattedYear] = dateStr.split(' ');
    return `${parseInt(day)}, ${formattedMonth}, ${year}`;
  };

  const cancelAppointment = async (appointmentId) => {
    const toastId = toast.loading("Cancelling appointment...");

    try {
      const { data } = await axios.post(
        backendURL + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      );

      toast.update(toastId, {
        render: data.message,
        type: data.success ? "success" : "error",
        isLoading: false,
        autoClose: 3000
      });

      if (data.success) {
        getUserAppointments(); // refresh appointments list
        getDoctorsData();
      }

    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.message || error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
      console.error(error);
    }
  };

  const initPay = (order) => {
    console.log("dataOrder", order.id)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment for Doctor Visit',
      order_id: order.id,
      handler: async (response) => {
        try {
          // console.log("resposne", response)
          const { data } = await axios.post(
            `${backendURL}/api/user/verify-razorpay`,
            response,
            { headers: { token } }
          );

          if (data.success) {
            toast.success(data.message);
            getUserAppointments();
            navigate('/my-appointments');
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || error.message);
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success && data.order) {
        initPay(data.order);
      } else {
        toast.error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
    else {
    }
  }, [token])

  return (
    <div className="max-w-full mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>

      <div className="grid gap-6">
        {
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
            >
              <div className="md:w-1/4 p-6 flex items-center justify-center bg-gray-50">
                <img
                  src={item.docData.image}
                  alt={item.name}
                  className="w-40 h-40 object-cover rounded-full shadow-md"
                />
              </div>

              <div className="md:w-2/4 p-6 space-y-2">
                <p className="text-xl font-semibold text-gray-800">{item.docData.name}</p>
                <p className="text-gray-500">{item.docData.speciality}</p>
                <div className="text-sm text-gray-600">
                  <p>Address:</p>
                  <p>{item.docData.address.line1}</p>
                  <p>{item.docData.address.line2}</p>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Date & Time:</span> {formatDate(item.slotDate)} | {item.slotTime.toUpperCase()}
                </p>
              </div>

              <div className="md:w-1/4 p-6 flex flex-col justify-center gap-3">
                {
                  item.isCompleted ? (
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded w-full cursor-not-allowed"
                      disabled
                    >
                      Completed
                    </button>
                  ) : item.cancelled && item.payment ? (
                    <button
                      className="px-4 py-2 bg-red-400 text-white rounded w-full cursor-not-allowed"
                      disabled
                    >
                      Paid
                    </button>
                  ) : item.cancelled ? (
                    <button
                      className="px-4 py-2 bg-gray-300 text-white rounded w-full cursor-not-allowed"
                      disabled
                    >
                      Pay Online
                    </button>
                  ) : item.payment ? (
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded w-full cursor-not-allowed"
                      disabled
                    >
                      Paid
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 w-full"
                      onClick={() => appointmentRazorpay(item._id)}
                    >
                      Pay Online
                    </button>
                  )
                }
                {
                  item.isCompleted ? (
                    <p className="text-sm text-indigo-600 font-medium text-center">Appointment Completed</p>
                  ) : item.cancelled ? (
                    <p className="text-sm text-red-500 font-medium text-center">Appointment Cancelled</p>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="px-4 py-2 border border-gray-200 text-gray-500 bg-white rounded hover:bg-red-500 hover:text-white transition-colors duration-200 w-full"
                    >
                      Cancel Appointment
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

export default MyAppointments
