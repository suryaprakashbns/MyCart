import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../actions/orderActions";

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const payHandler = () => {
        const order = {
            orderItems: cartItems,
            shippingInfo,
            itemsPrice: orderInfo.itemsPrice,
            shippingPrice: orderInfo.shippingPrice,
            taxPrice: orderInfo.taxPrice,
            totalPrice: orderInfo.totalPrice,
            paymentInfo: {
                id: "sim_" + Date.now(),
                status: "succeeded",
            },
        };

        dispatch(createOrder(order));
        navigate("/order/success");
    };

    return (
        <Fragment>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <h2 className="mb-4">Payment (Simulated)</h2>
                    <p>
                        Total to pay: <b>₹{orderInfo && orderInfo.totalPrice}</b>
                    </p>
                    <button className="btn btn-block py-3" onClick={payHandler}>
                        Pay Now
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default Payment;
