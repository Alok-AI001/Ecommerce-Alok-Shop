
import React, { useEffect, useState } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CheckoutSteps from "../CheckoutSteps";
import Message from "../Message";
import { createOrder } from "../../actions/orderActions";
import { ORDER_CREATE_RESET } from "../../constants/orderConstants";

function PlaceOrderScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderCreate = useSelector((state) => state.orderCreate || {});
    const { order, error, success } = orderCreate;

    const cart = useSelector((state) => state.cart || { cartItems: [] });

    const cartItems = cart.cartItems || [];
    const shippingAddress = cart.shippingAddress || {};

    const [message, setMessage] = useState(false);
    const handleClose = () => setMessage(false);

    const itemsPrice = cartItems
        .reduce((acc, item) => acc + item.price * item.qty, 0)
        .toFixed(2);

    const shippingPrice = (Number(itemsPrice) > 10000 ? 0 : 100).toFixed(2);
    const taxPrice = (0.1 * Number(itemsPrice)).toFixed(2);

    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (success && order) {
            navigate(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [success, order, navigate, dispatch]);

    const placeOrder = () => {
        if (!shippingAddress.address) {
            navigate("/shipping");
            return;
        }

        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod: cart.paymentMethod || "Cash on Delivery",
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }));
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />

            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            {shippingAddress.address ? (
                                <p>
                                    <strong>Shipping: </strong>
                                    {shippingAddress.address}, {shippingAddress.city},{" "}
                                    {shippingAddress.postalCode}, {shippingAddress.country}
                                </p>
                            ) : (
                                <Message variant="warning">
                                    Shipping address not found. Please enter your address.
                                    <Link to="/shipping"> Add Address</Link>
                                </Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                Cash on Delivery
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>

                            {cartItems.length === 0 ? (
                                <Message variant="info">
                                    Your cart is empty <Link to="/">Go Back</Link>
                                </Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cartItems.map((item) => (
                                        <ListGroup.Item key={item.product}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} X {item.price} ={" "}
                                                    {(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>Rs. {itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>Rs. {shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>Rs. {taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>Rs. {totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {error && (
                                <ListGroup.Item>
                                    <Message variant="danger" onClose={handleClose}>
                                        {error}
                                    </Message>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cartItems.length === 0 || !shippingAddress.address}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default PlaceOrderScreen;
