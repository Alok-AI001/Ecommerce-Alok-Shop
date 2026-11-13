
import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant = "info", children, onClose }) {
    return (
        <Alert variant={variant} dismissible onClose={onClose}>
            {children}
        </Alert>
    );
}

export default Message;
