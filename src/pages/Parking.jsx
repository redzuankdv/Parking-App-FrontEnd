import { useContext } from "react";
import { ParkingContext } from "../contexts/ParkingContext";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Parking() {
    const { parkings, setParkings } = useContext(ParkingContext);

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this booking?")) {
            return;
        }

        try {
            const res = await fetch(`https://parking-app-backend-byhd.onrender.com/bookings/${id}`, { method: "DELETE", });
            if (!res.ok) throw new Error("Failed to delete booking");
            setParkings(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("Error deleting booking: " + err.message);
        }
    }

    return (
        <Container>
            <h1 className="my-3">Your Booking</h1>
            <Row>
                <Col>
                    {parkings.length === 0 ? (
                        <p>Book your parking first to view your booking</p>
                    ) : (
                        <ParkingTable parkings={parkings} onDelete={handleDelete} />
                    )}
                </Col>
            </Row>

            <Row className="mt-3">
                <Col>
                    <Link to="/addparking">
                        <Button variant="primary">Book Here</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

function ParkingTable({ parkings, onDelete }) {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Plate</th>
                    <th>Location</th>
                    <th>Parking Area</th>
                    <th>Slot</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {parkings.map((parking) => (
                    <tr key={parking.id}>
                        <td>{parking.plate}</td>
                        <td>{parking.location}</td>
                        <td>{parking.parkingarea}</td>
                        <td>{parking.slot}</td>
                        <td>{parking.intime.replace('T', ' ').slice(0, 16)}</td>
                        <td>{parking.outtime.replace('T', ' ').slice(0, 16)}</td>
                        <td>
                            <Link to={`/editparking/${parking.id}`}>
                                <Button variant="warning" size="sm">Edit</Button>
                            </Link>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete(parking.id)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}