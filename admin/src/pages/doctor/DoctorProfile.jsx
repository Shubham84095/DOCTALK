import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendURL } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (line, value) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [line]: value
      }
    }))
  }

  const updateProfile = async () => {
    const toastId = toast.loading("Updating profile..."); // 🟡 show loading toast

    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        `${backendURL}/api/doctor/update-profile`,
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.update(toastId, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        setIsEdit(false);
        getProfileData();
      } else {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: error?.response?.data?.message || error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    }
  };


  return profileData && (
    <div className="max-w-4xl m-5 p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={profileData.image}
            alt={profileData.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
          />
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col justify-between gap-4 flex-1">

          {/* Name, Degree, Experience */}
          <div>
            <p className="text-2xl font-bold text-gray-800">{profileData.name}</p>
            <p className="text-sm text-gray-600">
              {profileData.degree} - {profileData.speciality}
            </p>
            <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {profileData.experience} Years Experience
            </button>
          </div>

          {/* About Section */}
          <div>
            <p className="font-semibold text-gray-700">About:</p>
            <p className="text-gray-600">{profileData.about}</p>
          </div>

          {/* Appointment Fee */}
          <p className="text-gray-700 font-medium">
            Appointment Fee: <span className="text-green-600">
              {currency}
              {isEdit ? (
                <input
                  type="number"
                  value={profileData.fees}
                  className="ml-2 border border-gray-300 px-2 py-1 rounded w-24"
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          {/* Address */}
          <div>
            <p className="font-semibold text-gray-700">Address:</p>
            <p className="text-gray-600">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={profileData.address?.line1 || ''}
                    onChange={(e) => handleAddressChange('line1', e.target.value)}
                    className="block mb-1 border border-gray-300 px-2 py-1 rounded w-full"
                    placeholder="Line 1"
                  />
                  <input
                    type="text"
                    value={profileData.address?.line2 || ''}
                    onChange={(e) => handleAddressChange('line2', e.target.value)}
                    className="block border border-gray-300 px-2 py-1 rounded w-full"
                    placeholder="Line 2"
                  />
                </>
              ) : (
                <>
                  {profileData.address?.line1} <br />
                  {profileData.address?.line2}
                </>
              )}
            </p>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
              checked={profileData.available}
              type="checkbox"
              id="available"
              className="accent-green-600"
            />
            <label htmlFor="available" className="text-gray-700">Available</label>
          </div>

          {/* Edit/Save Button */}
          {
            isEdit ? (
              <button
                onClick={() => updateProfile()}
                className="mt-4 w-fit px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="mt-4 w-fit px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Edit
              </button>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
