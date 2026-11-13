
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../actions/userActions";
import Loader from "../Loader";
import Message from "../Message";

function SignupScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userSignup = useSelector((state) => state.userSignup || {});
    const { error, loading, userInfo } = userSignup;

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must contain at least 6 characters");
            return;
        }

        dispatch(signup(firstname, lastname, email, password));
    };

    useEffect(() => {
        if (userInfo) {
            setMessage(userInfo.details || "Signup successful");
        }
    }, [userInfo]);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mt-5">Create Account</h2>
                    <p className="text-center text-muted">
                        Sign up to continue shopping
                    </p>

                    {message && <Message variant="info">{message}</Message>}
                    {error && <Message variant="danger">{error}</Message>}

                    {loading ? (
                        <Loader />
                    ) : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter first name"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter last name"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="Example: alok123@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                variant="success"
                                className="w-100 mt-2"
                            >
                                Sign Up
                            </Button>
                        </Form>
                    )}

                    <div className="text-center mt-3 mb-4">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default SignupScreen;
