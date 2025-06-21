import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currency = '₹'
    const calculateAge = (dob) => {
        if (!dob) return '-';
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';

        const parts = dateStr.split('_');
        if (parts.length !== 3) return '-';

        const [day, month, year] = parts.map(Number); 
        const dateObj = new Date(year, month - 1, day); 

        if (isNaN(dateObj)) return '-';

        // Format: 19 Jun 2025
        return dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const value = {
        calculateAge,
        formatDate,
        currency
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider