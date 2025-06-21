import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
    const { aToken, setAtoken } = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)

    const navigate = useNavigate();

    const logout = () => {
        if (aToken) {
            localStorage.removeItem('aToken');
            setAtoken('');
            navigate('/')
        }

        if(dToken){
            localStorage.removeItem('dToken')
            setDToken('')
            navigate('/')
        }
    };

    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm">
            {/* Left: Logo + Role */}
            <div className="flex items-center gap-3">
                <img
                    className="w-32 sm:w-40 cursor-pointer object-contain"
                    src={assets.admin_logo}
                    alt="Admin Logo"
                />
                <p className="text-xs sm:text-sm border border-gray-400 text-gray-700 px-3 py-1 rounded-full font-medium bg-gray-100">
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>

            {/* Right: Logout Button */}
            <button
                onClick={logout}
                className="bg-primary hover:bg-indigo-700 text-white text-sm sm:text-base px-6 sm:px-8 py-2 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar
