import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, clearErrors } from "../../actions/userActions";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, error } = useSelector((state) => state.user);

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
        if (error) {
            console.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, isAuthenticated, error, navigate, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-block py-3">
                            LOGIN
                        </button>

                        <Link to="/register" className="float-right mt-3">
                            New User?
                        </Link>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Login;
