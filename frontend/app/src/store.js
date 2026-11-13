
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

// Product reducers
import {
    productCreateReducers,
    productDeleteReducers,
    productDetailsReducers,
    productListReducers,
    productUpdateReducers
} from './reducers/productReducers';

// User reducers
import {
    userDeleteReducer,
    userDetailsReducer,
    userListReducer,
    userLoginReducers,
    userSignupReducers,
    userUpdateProfileReducer
} from './reducers/userReducers';

// Cart reducer
import { cartReducers } from './reducers/cartReducers';

// Order reducers
import {
    orderCreateReducer,
    orderDetailsReducer,
    orderDeliverReducer,
    orderListReducers,
    orderListMyReducer
} from './reducers/orderReducers';

// Combine all reducers
const reducer = combineReducers({

    // Product reducers
    productList: productListReducers,
    productDetails: productDetailsReducers,
    productCreate: productCreateReducers,
    productDelete: productDeleteReducers,
    productUpdate: productUpdateReducers,

    // User reducers
    userLogin: userLoginReducers,
    userSignup: userSignupReducers,
    userDetails: userDetailsReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdateProfile: userUpdateProfileReducer,

    // Cart reducer
    cart: cartReducers,

    // Order reducers
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderDeliver: orderDeliverReducer,
    orderList: orderListReducers,
    orderMyList: orderListMyReducer,

});

// Get logged-in user from local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

// Initial state
const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage
    },
    cart: {
        cartItems: []
    },
};

// Middleware
const middleware = [thunk];

// Create Redux store
const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware)
);

export default store;
