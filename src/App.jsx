import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Form, Modal, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import { AuthProvider } from "./components/AuthProvider";
import { AuthContext } from "./components/AuthContext";
import AuthPage from "./pages/AuthPage";
import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import AddParking from "./pages/AddParking";
import Parking from "./pages/Parking";
import EditParking from "./pages/EditParking";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { JokeBox } from "./components/JokeBox";

function Layout() {
    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        } else {
            const fetchImage = async () => {
                try {
                    const storage = getStorage();
                    const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
                    const url = await getDownloadURL(storageRef);
                    setImageUrl(url);
                } catch (error) {
                    if (error.code !== "storage/object-not-found") {
                        console.error("Error fetching profile image:", error)
                    }
                };
            }
            fetchImage();
        }
    }, [currentUser, navigate]);

    const handleLogout = () => {
        auth.signOut();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploading(true);
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
            await uploadBytes(storageRef, selectedFile);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            alert("Profile picture uploaded!");
            setShowModal(false);
            setSelectedFile(null);
        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
            await deleteObject(storageRef);
            setImageUrl(null);
            setShowModal(false);
            setSelectedFile(null);
            alert("Profile picture deleted!");
        } catch (error) {
            alert("Failed to delete picture: " + error.message);
        }
    };

    const handleOpenModal = () => {
        setSelectedFile(null);
        setShowModal(true);
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container className="d-flex justify-content-between">
                    <Navbar.Brand href="/">CelerPark</Navbar.Brand>
                    {currentUser && (
                        <Nav className="me-auto">
                            <Nav.Link href="/addparking">Book Here</Nav.Link>
                            <Nav.Link href="/yourparking">My Parking</Nav.Link>
                        </Nav>
                    )}
                    {currentUser && (
                        <div className="d-flex gap-2 align-items-center">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Profile"
                                    onClick={handleOpenModal}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                    }}
                                />
                            ) : (
                                <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                                    Edit Profile
                                </Button>
                            )}
                            <Button variant="outline-danger" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    )}
                </Container>
            </Navbar>

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedFile(null);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select Image</Form.Label>
                            <Form.Control
                                key={selectedFile ? selectedFile.name : "empty"}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                        </Form.Group>
                        <div className="mt-3 d-flex gap-2">
                            <Button
                                className="mt-3"
                                variant="primary"
                                disabled={!selectedFile || uploading}
                                onClick={handleUpload}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : imageUrl
                                        ? "Change Picture"
                                        : "Upload"
                                }
                            </Button>
                            {imageUrl && (
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            )}
                        </div>
                    </Form>
                    {imageUrl && (
                        <div className="mt-4 text-center">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid #ccc"
                                }}
                            />
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <Outlet />
            <JokeBox key={location.pathname} />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<AuthPage />} />
                        <Route path="*" element={<ErrorPage />} />
                        <Route path="home" element={<Home />} />
                        <Route path="addparking" element={<AddParking />} />
                        <Route path="yourparking" element={<Parking />} />
                        <Route path="editparking/:id" element={<EditParking />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}