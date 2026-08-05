import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const logoutHandler = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3">
                <div className="navbar-brand">
                    <Link to="/">
                        <h3>MyCart</h3>
                    </Link>
                </div>
            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0"></div>

            <div
                className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex justify-content-center align-items-center"
                style={{ gap: "16px" }}
            >
                <Link to="/cart" style={{ textDecoration: "none" }}>
                    <span id="cart" className="text-white">Cart</span>
                    <span className="ml-1" id="cart_count">{cartItems.length}</span>
                </Link>

                {isAuthenticated ? (
                    <div className="dropdown d-inline">
                        <button
                            className="btn dropdown-toggle text-white"
                            type="button"
                            id="dropDownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {user && user.name}
                        </button>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropDownMenuButton">
                            {user && user.role === "admin" && (
                                <Fragment>
                                    <Link className="dropdown-item" to="/admin/dashboard">
                                        Admin Dashboard
                                    </Link>
                                    <Link className="dropdown-item" to="/admin/product/new">
                                        Add New Product
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                </Fragment>
                            )}
                            <Link className="dropdown-item" to="/orders/me">
                                My Orders
                            </Link>
                            <button className="dropdown-item text-danger" onClick={logoutHandler}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" style={{ textDecoration: "none" }} className="text-white">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Header;