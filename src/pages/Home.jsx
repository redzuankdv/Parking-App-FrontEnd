import { Card, Col, Container, Row } from "react-bootstrap";

export default function Home() {
    return (
        <>
            <Container className="text-center">
                <h1 className="my-3">Welcome to our CelerPark App!</h1>
            </Container>
            <Container>
                <Row>
                    <Col md={12}>
                        <Card className="my-3">
                            <Card.Body style={{ backgroundColor: '#f1f2f3' }}>
                                <Card.Title className="text-center">About Us</Card.Title>
                                <Card.Text>At CelerPark, we make parking simple, fast, and stress-free. Our app allows you to easily reserve your parking slot in advance, ensuring you have a space ready when you arrive. CelerPark saves you time and gives you peace of mind. Our goal is to modernize parking management by providing an easy-to-use platform that connects drivers to available parking spaces anytime, anywhere. Thank you for choosing CelerPark. Your journey starts with us!</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}