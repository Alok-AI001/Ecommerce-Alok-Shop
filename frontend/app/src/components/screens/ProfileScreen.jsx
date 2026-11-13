
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import Message from '../Message';
import {
    getUserDetails,
    updateUserProfile
} from '../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import { listMyOrders } from '../../actions/orderActions';
import { LinkContainer } from 'react-router-bootstrap';

function ProfileScreen() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux states with safe defaults
    const userDetails = useSelector(state => state.userDetails || {});
    const { error, loading, user } = userDetails;

    const userLogin = useSelector(state => state.userLogin || {});
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector(
        state => state.userUpdateProfile || {}
    );
    const {
        success,
        loading: loadingUpdate,
        error: updateError
    } = userUpdateProfile;

    const ordersMyList = useSelector(state => state.orderMyList || {});
    const {
        loading: loadingOrders,
        error: errorOrders,
        orders = []
    } = ordersMyList;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        if (!user || !user.first_name || !user.last_name ||
            success || userInfo._id !== user._id) {

            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(getUserDetails(userInfo._id));
        } else {
            setFname(user.first_name);
            setLname(user.last_name);
        }
    }, [dispatch, userInfo, user, success, navigate]);

    useEffect(() => {
        if (userInfo) {
            dispatch(listMyOrders());
        }
    }, [dispatch, userInfo]);

    const handleClose = () => setMessage('');

    const submitHandler = (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (!user?._id) {
            setMessage('User details are still loading. Please try again.');
            return;
        }

        dispatch(updateUserProfile({
            id: user._id,
            fname,
            lname,
            password
        }));

        setMessage('');
    };

    return (
        <Row className="mt-4">

            <Col md={3}>
                <h2>User Profile</h2>

                {message && (
                    <Message variant="danger" onClose={handleClose}>
                        {message}
                    </Message>
                )}

                {error && (
                    <Message variant="danger">
                        {error}
                    </Message>
                )}

                {updateError && (
                    <Message variant="danger">
                        {updateError}
                    </Message>
                )}

                {success && (
                    <Message variant="success">
                        Profile updated successfully!
                    </Message>
                )}

                {loading && <Loader />}

                <Form onSubmit={submitHandler}>

                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter First Name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter Last Name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter New Password (optional)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="passwordConfirm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loadingUpdate}
                    >
                        {loadingUpdate ? 'Updating...' : 'Update'}
                    </Button>

                </Form>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>

                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger">
                        {errorOrders}
                    </Message>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>

                                    <td>
                                        {order.createdAt
                                            ? order.createdAt.substring(0, 10)
                                            : '-'}
                                    </td>

                                    <td>Rs {order.totalPrice}</td>

                                    <td>
                                        {order.isPaid && order.paidAt
                                            ? order.paidAt.substring(0, 10)
                                            : (
                                                <i
                                                    className="fas fa-times"
                                                    style={{ color: 'red' }}
                                                />
                                            )}
                                    </td>

                                    <td>
                                        {order.isDelivered && order.deliveredAt
                                            ? order.deliveredAt.substring(0, 10)
                                            : (
                                                <i
                                                    className="fas fa-times"
                                                    style={{ color: 'red' }}
                                                />
                                            )}
                                    </td>

                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className="btn-sm">
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>

        </Row>
    );
}

export default ProfileScreen;
