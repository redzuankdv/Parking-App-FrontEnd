import { useEffect, useState } from "react";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

export function JokeBox() {
    const [joke, setJoke] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const maxRetries = 3;

        const fetchJoke = async (retryCount = 0) => {
            try {
                setLoading(true);
                const res = await fetch("https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
                const data = await res.json();
                if (data.joke) {
                    setJoke(data.joke);
                    setLoading(false);
                } else {
                    throw new Error("No joke found");
                }
            } catch (error) {
                console.error("Failed to fetch joke:", error);
                if (retryCount < maxRetries) {
                    fetchJoke(retryCount + 1);
                } else {
                    setJoke("Couldn't fetch a joke right now. Please try again later.");
                    setLoading(false);
                }
            }
        };
        fetchJoke();
    }, []);

    return (
        <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
            <Toast bg="light" show={true}>
                <Toast.Header closeButton={false}>
                    <strong className="me-auto">Random Joke</strong>
                </Toast.Header>
                <Toast.Body>
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        joke
                    )}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}