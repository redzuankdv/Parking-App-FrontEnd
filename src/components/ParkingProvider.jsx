import { useContext, useEffect, useState } from "react";
import { ParkingContext } from "../contexts/ParkingContext";
import { AuthContext } from "./AuthContext";

export function ParkingProvider({ children }) {
    const [parkings, setParkings] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser) {
            setParkings([]);
            return;
        }

        async function fetchParkings() {
            try {
                const res = await fetch(`https://parking-app-backend-byhd.onrender.com/bookings?userId=${currentUser.uid}`);
                if (!res.ok) throw new Error("Failed to fetch parkings");
                const data = await res.json();
                setParkings(data);
            } catch (error) {
                console.error("Error loading parkings:", error);
            }
        }

        fetchParkings();
    }, [currentUser]);

    return (
        <ParkingContext.Provider value={{ parkings, setParkings }}>
            {children}
        </ParkingContext.Provider>
    )
}