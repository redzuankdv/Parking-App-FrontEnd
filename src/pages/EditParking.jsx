import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ParkingContext } from "../contexts/ParkingContext";
import { Button, Form } from "react-bootstrap";
import { getAuth } from "firebase/auth";

export default function EditParking() {
    const { id } = useParams();
    const [plate, setPlate] = useState("");
    const [location, setLocation] = useState("");
    const [area, setArea] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [showSlots, setShowSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [errors, setErrors] = useState({});
    const [receipt, setReceipt] = useState(null);

    const { parkings, setParkings } = useContext(ParkingContext);

    useEffect(() => {
        async function fetchBooking() {
            try {
                const res = await fetch(`https://parking-app-backend-byhd.onrender.com/bookings/${id}`);
                if (!res.ok) throw new Error("Failed to fetch booking");
                const data = await res.json();
                setPlate(data.plate);
                setLocation(data.location);
                setArea(data.parkingarea);
                setFrom(data.intime);
                setTo(data.outtime);
                setSelectedSlot(data.slot);
            } catch (err) {
                console.error(err);
            }
        }
        fetchBooking();
    }, [id]);

    async function searchSlots(event) {
        event.preventDefault();

        const newErrors = {};
        if (!plate) newErrors.plate = "Plate number is required";
        if (!location) newErrors.location = "Location is required";
        if (!area) newErrors.area = "Area is required";
        if (!from) newErrors.from = "From date is required";
        if (!to) newErrors.to = "To date is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const res = await fetch("https://parking-app-backend-byhd.onrender.com/bookings");
            const bookings = await res.json();

            const fromDate = new Date(from);
            const toDate = new Date(to);

            const overlappingBookings = bookings.filter(b => {
                if (b.id === id) return false;
                const bookingFrom = new Date(b.intime);
                const bookingTo = new Date(b.outtime);
                const sameLocation = b.location === location;
                const sameArea = b.parkingarea === area;
                const overlaps = fromDate < bookingTo && toDate > bookingFrom;
                return sameLocation && sameArea && overlaps;
            });

            const bookedSlots = overlappingBookings.map(b => b.slot);

            const allSlots = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
            const realSlots = allSlots.map(id => ({
                id,
                status: bookedSlots.includes(id) ? "booked" : "available"
            }));

            setSlots(realSlots);
            setShowSlots(true);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        }
    }

    async function confirmEdit() {
        if (!selectedSlot) {
            alert("Please select a parking slot.");
            return;
        }

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("You must be logged in to edit booking.");
            return;
        }

        const bookingData = {
            plate,
            location,
            parkingarea: area,
            intime: from,
            outtime: to,
            slot: selectedSlot,
            userId: currentUser.uid,
        };

        try {
            const res = await fetch(`https://parking-app-backend-byhd.onrender.com/bookings/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });
            const result = await res.json();
            if (result.status !== "success") throw new Error(result.message || "Failed to update");

            setParkings(parkings.map(p => (p.id === id ? { ...p, ...bookingData } : p)));

            setReceipt({ ...bookingData, slot: selectedSlot });
            setShowSlots(false);
            setSelectedSlot(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px",
                backgroundColor: "#f0f2f5"
            }}
        >
            <Form
                onSubmit={searchSlots}
                style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}
            >
                <div>
                    <label>Plate Number:</label>
                    <input
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px" }}
                    />
                    {errors.plate && <p style={{ color: "red", fontSize: "12px" }}>{errors.plate}</p>}
                </div>

                <div>
                    <label>Location:</label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px" }}
                    >
                        <option value="">Select Location</option>
                        <option value="SigmaSchool">CelerSchool</option>
                        <option value="SigmaOffice">CelerOffice</option>
                    </select>
                    {errors.location && <p style={{ color: "red", fontSize: "12px" }}>{errors.location}</p>}
                </div>

                <div>
                    <label>Parking Area:</label>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px" }}
                    >
                        <option value="">Select Area</option>
                        <option value="Parking A">Parking A</option>
                        <option value="Parking B">Parking B</option>
                    </select>
                    {errors.area && <p style={{ color: "red", fontSize: "12px" }}>{errors.area}</p>}
                </div>

                <div>
                    <label>From:</label>
                    <input
                        type="datetime-local"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px" }}
                    />
                    {errors.from && <p style={{ color: "red", fontSize: "12px" }}>{errors.from}</p>}
                </div>

                <div>
                    <label>To:</label>
                    <input
                        type="datetime-local"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px" }}
                    />
                    {errors.to && <p style={{ color: "red", fontSize: "12px" }}>{errors.to}</p>}
                </div>

                <Button type="submit">Search Slots</Button>
            </Form>

            {showSlots && (
                <div style={{ marginTop: "30px" }}>
                    <h2>{area}</h2>
                    <div style={{ marginBottom: "10px" }}>
                        <h4>Hints</h4>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ color: "green" }}>P Available</div>
                            <div style={{ color: "red" }}>P Booked</div>
                            <div style={{ color: "orange" }}>Selected</div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 100px)",
                            gap: "20px",
                            backgroundColor: "#e6f7ff",
                            padding: "20px",
                            borderRadius: "10px",
                        }}
                    >
                        {slots.map((slot) => (
                            <div
                                key={slot.id}
                                onClick={() => {
                                    if (slot.status === "available") {
                                        setSelectedSlot(slot.id);
                                    }
                                }}
                                style={{
                                    textAlign: "center",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    backgroundColor:
                                        selectedSlot === slot.id
                                            ? "orange"
                                            : slot.status === "available"
                                                ? "lightgreen"
                                                : "lightcoral",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    cursor: slot.status === "available" ? "pointer" : "not-allowed",
                                }}
                            >
                                {slot.id}
                            </div>
                        ))}
                    </div>

                    <Button style={{ marginTop: "20px" }} onClick={confirmEdit}>
                        Update Booking
                    </Button>
                </div>
            )}

            {receipt && (
                <div
                    style={{
                        marginTop: "30px",
                        backgroundColor: "#d9f7be",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    <h3>Updated Booking Receipt</h3>
                    <p><strong>Plate:</strong> {receipt.plate}</p>
                    <p><strong>Location:</strong> {receipt.location}</p>
                    <p><strong>Area:</strong> {receipt.parkingarea}</p>
                    <p><strong>Slot:</strong> {receipt.slot}</p>
                    <p><strong>From:</strong> {receipt.intime}</p>
                    <p><strong>To:</strong> {receipt.outtime}</p>
                </div>
            )}
        </div>
    );
}