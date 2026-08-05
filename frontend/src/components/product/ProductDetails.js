import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../../actions/productActions";
import { addItemToCart } from "../../actions/cartActions";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const { product, loading, error } = useSelector((state) => state.productDetails);

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const increaseQty = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const addToCart = () => {
        dispatch(addItemToCart(id, quantity));
        navigate("/cart");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <Fragment>
            <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <img
                        src={
                            product.images && product.images[0]
                                ? product.images[0].image
                                : "/images/no-photo.jpg"
                        }
                        alt={product.name}
                        className="img-fluid"
                    />
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>
                    <hr />
                    <p id="product_price">₹{product.price}</p>

                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <button
                        type="button"
                        id="cart_btn"
                        className="btn btn-primary d-inline ml-4"
                        disabled={product.stock === 0}
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>

                    <hr />
                    <p>
                        Status:{" "}
                        <span className={product.stock > 0 ? "greenColor" : "redColor"}>
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                    </p>
                    <hr />
                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr />
                    <p id="product_seller mb-3">
                        Sold by: <strong>{product.seller}</strong>
                    </p>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductDetails;
