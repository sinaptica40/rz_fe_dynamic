import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NoRouteLayout = ({ areas }) => {
    const navigate = useNavigate();
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white text-orange">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-3">Oops! Page not found.</p>
      <p className="lead">The page you’re looking for doesn’t exist.</p>
      <Button
        variant="outline-warning"
        onClick={() => navigate("/dashboard")}
        className="mt-3"
      >
        Go Home
      </Button>
    </div>

    )
};

export default NoRouteLayout;
