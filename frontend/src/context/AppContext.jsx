import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import { toast } from 'react-toastify'


export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '₹'
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/list`);

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message || "Failed to fetch doctors.");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message || "An error occurred.");
        }
    };

    const loadUserProfileData = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/user/get-profile', {headers:{token}})
            if(data.success){
                setUserData(data.userData);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message || "An error occurred.");
        }
    }

    useEffect(() => {
        if(token){
            loadUserProfileData();
        }
        else{
            setUserData(false);
        }
    }, [token])
    useEffect(() => {
        getDoctorsData()
    }, [])

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendURL,
        userData, setUserData,
        loadUserProfileData,
        getDoctorsData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider