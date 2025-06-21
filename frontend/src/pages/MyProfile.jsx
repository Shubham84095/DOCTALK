import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, token, backendURL, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    const loadingToast = toast.loading("Updating profile..."); // ✅ Show loader
    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(
        `${backendURL}/api/user/update-profile`,
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        toast.update(loadingToast, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.update(loadingToast, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.update(loadingToast, {
        render: error.response?.data?.message || error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  return userData && (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 space-y-6">
      <div className="flex flex-col items-center">
        {
          isEdit ? (
            <label htmlFor="image" className="relative inline-block w-24 h-24 cursor-pointer">
              {/* Profile Image */}
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />

              {/* Upload Icon Overlay */}
              {!image && (
                <div className="absolute bottom-0 right-0 bg-primary p-1 rounded-full">
                  <img
                    src={assets.upload_icon}
                    alt="Upload Icon"
                    className="w-4 h-4"
                  />
                </div>
              )}

              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              src={userData.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-4"
            />
          )
        }
        {
          isEdit ?
            <input
              type="text"
              value={userData.name}
              onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
              className="text-xl font-semibold text-center border-b border-gray-300 focus:outline-none"
            />
            : <p className="text-xl font-semibold">{userData.name}</p>
        }
      </div>

      <hr className="border-gray-300" />

      <div>
        <p className="text-gray-700 font-semibold mb-2">CONTACT INFORMATION</p>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-600">Email id:</p>
            <p className="font-medium">{userData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone:</p>
            {
              isEdit ?
                <input
                  type="text"
                  value={userData.phone}
                  onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
                : <p className="font-medium">{userData.phone}</p>
            }
          </div>
          <div>
            <p className="text-gray-600">Address:</p>
            {
              isEdit ?
                <>
                  <input
                    type="text"
                    value={userData.address.line1}
                    onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                    className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
                  />
                  <input
                    type="text"
                    value={userData.address.line2}
                    onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </>
                : <p className="font-medium">{userData.address.line1}<br />{userData.address.line2}</p>
            }
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-700 font-semibold mb-2">BASIC INFORMATION</p>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-600">Gender:</p>
            {
              isEdit ?
                <select
                  value={userData.gender}
                  onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                : <p className="font-medium">{userData.gender}</p>
            }
          </div>
          <div>
            <p className="text-gray-600">Birthday:</p>
            {
              isEdit ?
                <input
                  type="date"
                  value={userData.dob}
                  onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
                : <p className="font-medium">{userData.dob}</p>
            }
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            if (isEdit) {
              updateUserProfileData();
            } else {
              setIsEdit(true);
            }
          }}
          className={`mt-4 px-6 py-2 rounded text-white font-semibold ${isEdit ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isEdit ? 'Save Information' : 'Edit'}
        </button>
      </div>
    </div>
  )
}

export default MyProfile
