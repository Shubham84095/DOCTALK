import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAtoken] = useState(localStorage.getItem('aToken') || '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashdata] = useState(false)

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {
        try {
            // console.log(aToken)
            const { data } = await axios.post(
                backendURL + '/api/admin/all-doctors',
                {},
                {
                    headers: {
                        aToken
                    }
                }
            );

            if (data.success) {
                setDoctors(data.doctors);
                // console.log(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/admin/change-availability', { docId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const getAllAppointments = async () => {
        const fetchPromise = axios.get(backendURL + '/api/admin/appointments', {
            headers: { aToken }
        });

        toast.promise(
            fetchPromise,
            {
                pending: 'Fetching appointments...',
                error: 'Failed to fetch appointments',
            }
        );

        try {
            const { data } = await fetchPromise;

            if (data.success) {
                // console.log(data.appointments);
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            
            const {data} = await axios.post(backendURL + '/api/admin/cancel-appointment', {appointmentId}, {headers: {aToken}})

            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const getDashData = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/admin/dashboard', {headers: {aToken}})
            if(data.success){
                // console.log(data.dashData)
                setDashdata(data.dashData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAtoken,
        backendURL,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, getDashData,
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
