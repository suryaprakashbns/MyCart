import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts } from "../../actions/productActions";
import { getAllOrders } from "../../actions/orderActions";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { orders } = useSelector((state) => state.allOrders);

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getAllOrders());
    }, [dispatch]);

    const outOfStock = products?.filter((p) => p.stock === 0).length || 0;
    const totalRevenue = orders?.reduce((acc, o) => acc + o.totalPrice, 0) || 0;

    return (
        <Fragment>
            <h1 className="my-4">Admin Dashboard</h1>

            <div className="row">
                <div className="col-xl-4 col-sm-6 mb-3">
                    <div className="card text-white bg-primary o-hidden h-100">
                        <div className="card-body">
                            Total Revenue<br />
                            <b>₹{totalRevenue.toFixed(2)}</b>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-sm-6 mb-3">
                    <div className="card text-white bg-success o-hidden h-100">
                        <div className="card-body">
                            Products<br />
                            <b>{products?.length || 0}</b>
                        </div>
                        <Link className="card-footer text-white" to="/admin/products">
                            View Details
                        </Link>
                    </div>
                </div>

                <div className="col-xl-4 col-sm-6 mb-3">
                    <div className="card text-white bg-danger o-hidden h-100">
                        <div className="card-body">
                            Out of Stock<br />
                            <b>{outOfStock}</b>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-sm-6 mb-3">
                    <div className="card text-white bg-info o-hidden h-100">
                        <div className="card-body">
                            Orders<br />
                            <b>{orders?.length || 0}</b>
                        </div>
                        <Link className="card-footer text-white" to="/admin/orders">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>

            <Link to="/admin/product/new" className="btn btn-primary mt-3">
                + Add New Product
            </Link>
        </Fragment>
    );
};

export default Dashboard;