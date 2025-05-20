import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function AuthPage() {
    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow("SignUp");
    const handleShowLogin = () => setModalShow("Login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);
    const [showTermsModal, setShowTermsModal] = useState(false);

    useEffect(() => {
        if (currentUser) navigate("/home");
    }, [currentUser, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                username,
                password
            );
            console.log(res.user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
        } catch (error) {
            console.error(error);
        }
    };

    const provider = new GoogleAuthProvider();
    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => setModalShow(null);

    return (
        <Row className="vh-100">
            <Col md={6} className="d-flex align-items-center bg-light bg-gradient">
                <Container>
                    <h1 className="text-center my-3">Welcome to our CelerPark App!</h1>
                    <Card className="my-3 shadow rounded-4">
                        <Card.Body style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Title className="text-center">About Us</Card.Title>
                            <Card.Text>At CelerPark, we make parking simple, fast, and stress-free. Our app allows you to easily reserve your parking slot in advance, ensuring you have a space ready when you arrive. CelerPark saves you time and gives you peace of mind. Our goal is to modernize parking management by providing an easy-to-use platform that connects drivers to available parking spaces anytime, anywhere. Thank you for choosing CelerPark. Your journey starts with us!</Card.Text>
                        </Card.Body>
                    </Card>
                </Container>
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center p-4">
                <div className="d-grip gap-2 text-center" style={{ width: "100%", maxWidth: "300px" }}>
                    <Button
                        className="rounded-pill w-100 mb-2"
                        variant="outline-dark"
                        onClick={handleGoogleLogin}
                    >
                        <i className="bi bi-google me-2"></i> Sign up with Google
                    </Button>
                    <p>or</p>
                    <Button className="rounded-pill w-100 mb-2" onClick={handleShowSignUp}>
                        Create an account
                    </Button>
                    <p className="text-muted small">
                        By signing up, you agree to our{" "}
                        <span
                            onClick={() => setShowTermsModal(true)}
                            style={{ textDecoration: "underline", cursor: "pointer" }}
                        >
                            Terms and Conditions
                        </span>
                        , which outline our data practices, responsibilities, and user obligations.
                    </p>
                    <p className="mt-5" style={{ fontWeight: "bold" }}>
                        Already have an account?
                    </p>
                    <Button
                        className="rounded-pill w-100"
                        variant="outline-primary"
                        onClick={handleShowLogin}
                    >
                        Sign In
                    </Button>
                </div>
                <Modal
                    show={modalShow !== null}
                    onHide={handleClose}
                    animation={false}
                    centered
                >
                    <Modal.Body className="bg-light p-4 rounded">
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            {modalShow === "SignUp"
                                ? "Create your account"
                                : "Log in to your account"}
                        </h2>
                        <Form
                            className="d-grip gap-2 px-5"
                            onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
                        >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="email"
                                    placeholder="Enter username"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Group>

                            <Button className="rounded-pill" type="submit">
                                {modalShow === "SignUp" ? "Sign up" : "Log in"}
                            </Button>
                            {modalShow === "SignUp" && (
                                <p className="text-muted small mt-3 text-center">
                                    By signing up, you agree to our{" "}
                                    <span
                                        onClick={() => setShowTermsModal(true)}
                                        style={{ textDecoration: "underline", cursor: "pointer" }}
                                    >
                                        Terms and Conditions
                                    </span>
                                    , which explain your rights, responsibilities, and how your data is handled.
                                </p>
                            )}
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title>Terms and Conditions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>1. Booking Policy:</strong> Each parking reservation is valid for one vehicle per entry. The fee is RM10 per entrance, paid at the counter.</p>
                        <p><strong>2. No Online Payment:</strong> This app does not collect payments. Users pay upon arrival at the parking location.</p>
                        <p><strong>3. Cancellation:</strong> Bookings can be canceled anytime before the scheduled time. No penalty is charged.</p>
                        <p><strong>4. Responsibility:</strong> Users must provide accurate car details. Incorrect info may result in denied entry.</p>
                        <p><strong>5. Limitation of Liability:</strong> CelerPark is not responsible for loss, theft, or damage to your vehicle or belongings.</p>
                        <p><strong>6. Updates:</strong> These terms may be updated without prior notice. Continued use means acceptance of new terms.</p>
                    </Modal.Body>
                </Modal>

            </Col>
        </Row >
    )
}