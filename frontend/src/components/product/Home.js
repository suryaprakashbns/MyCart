import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Product from "./Product";

const Home = () => {
    const dispatch = useDispatch();
    const { loading, products, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    return (
        <Fragment>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Fragment>
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {error && <p className="text-danger">{error}</p>}
                            {products &&
                                products.map((product) => (
                                    <Product key={product._id} product={product} />
                                ))}
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
