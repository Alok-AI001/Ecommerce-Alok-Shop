
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../actions/userActions";
import Loader from "../Loader";
import Message from "../Message";

function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect destination from URL
  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const userLogin = useSelector((state) => state.userLogin || {});
  const { error, loading, userInfo } = userLogin;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login form submission
  const submitHandler = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      return;
    }

    dispatch(login(email.trim(), password));
  };

  // Redirect after successful login
  useEffect(() => {
    if (userInfo) {
      navigate(redirect, { replace: true });
    }
  }, [userInfo, navigate, redirect]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mt-5">Welcome Back</h2>

          <p className="text-center text-muted">
            Login to your account
          </p>

          {error && (
            <Message variant="danger">{error}</Message>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100 mt-2"
                disabled={loading}
              >
                Login
              </Button>
            </Form>
          )}

          <div className="text-center mt-3 mb-4">
            New user? <Link to="/signup">Create Account</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;
