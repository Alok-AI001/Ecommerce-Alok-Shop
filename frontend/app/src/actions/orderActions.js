
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL
} from "../constants/orderConstants";

import axios from "axios";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";

// Helper function for authentication
const getAuthConfig = (getState) => {
    const userInfo = getState().userLogin?.userInfo;

    if (!userInfo) {
        throw new Error("Please login to continue.");
    }

    if (!userInfo.token) {
        throw new Error("Login token not found. Please logout and login again.");
    }

    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`
        }
    };
};

// Create Order
export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST });

        const config = getAuthConfig(getState);

        const { data } = await axios.post(
            "/api/orders/add/",
            order,
            config
        );

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        });

        dispatch({ type: CART_CLEAR_ITEMS });

        localStorage.removeItem("cartItems");

    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response?.data?.detail ||
                error.response?.data?.details ||
                error.message
        });
    }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const config = getAuthConfig(getState);

        const { data } = await axios.get(
            `/api/orders/${id}/`,
            config
        );

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response?.data?.detail ||
                error.response?.data?.details ||
                error.message
        });
    }
};

// Deliver Order
export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DELIVER_REQUEST });

        const config = getAuthConfig(getState);

        const { data } = await axios.put(
            `/api/orders/${order._id}/deliver/`,
            {},
            config
        );

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload:
                error.response?.data?.detail ||
                error.response?.data?.details ||
                error.message
        });
    }
};

// List All Orders
export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_REQUEST });

        const config = getAuthConfig(getState);

        const { data } = await axios.get(
            "/api/orders/",
            config
        );

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response?.data?.detail ||
                error.response?.data?.details ||
                error.message
        });
    }
};

// List My Orders
export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_MY_REQUEST });

        const config = getAuthConfig(getState);

        const { data } = await axios.get(
            "/api/orders/myorders/",
            config
        );

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload:
                error.response?.data?.detail ||
                error.response?.data?.details ||
                error.message
        });
    }
};
