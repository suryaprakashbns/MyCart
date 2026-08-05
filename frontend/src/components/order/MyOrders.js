import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { myOrders } from "../../actions/orderActions";

const MyOrders = () => {
    const dispatch = useDispatch();
    const { loading, orders, error } = useSelector((state) => state.myOrders);

    useEffect(() => {
        dispatch(myOrders());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;

    return (
        <Fragment>
            <h1 className="my-5">My Orders</h1>
            {error && <p className="text-danger">{error}</p>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders && orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td className={order.orderStatus === "Delivered" ? "greenColor" : "redColor"}>
                                {order.orderStatus}
                            </td>
                            <td>{order.orderItems.length}</td>
                            <td>₹{order.totalPrice}</td>
                            <td>
                                <Link to={`/order/${order._id}`}>View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
};

export default MyOrders;