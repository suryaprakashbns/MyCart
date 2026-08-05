import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import "./App.css";

import Header from "./components/layout/Header";
import Home from "./components/product/Home";
import ProductDetails from "./components/product/ProductDetails";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import NewProduct from "./components/admin/NewProduct";
import ProtectedRoute from "./components/route/ProtectedRoute";
import { loadUser } from "./actions/userActions";
import MyOrders from "./components/order/MyOrders";
import Dashboard from "./components/admin/Dashboard";
import AdminRoute from "./components/route/AdminRoute";
function AppContent() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="container container-fluid">
                    <Routes>
                        <Route path="/" element={<Home />} exact />
                        <Route path="/product/:id" element={<ProductDetails />} exact />
                        <Route path="/cart" element={<Cart />} exact />
                        <Route path="/login" element={<Login />} exact />
                        <Route path="/register" element={<Register />} exact />

                        <Route
                            path="/shipping"
                            element={
                                <ProtectedRoute>
                                    <Shipping />
                                </ProtectedRoute>
                            }
                            exact
                        />
                        <Route
                            path="/order/confirm"
                            element={
                                <ProtectedRoute>
                                    <ConfirmOrder />
                                </ProtectedRoute>
                            }
                            exact
                        />
                        <Route
                            path="/payment"
                            element={
                                <ProtectedRoute>
                                    <Payment />
                                </ProtectedRoute>
                            }
                            exact
                        />
                        <Route
                            path="/order/success"
                            element={
                                <ProtectedRoute>
                                    <OrderSuccess />
                                </ProtectedRoute>
                            }
                            exact
                        />
                        <Route
                            path="/admin/product/new"
                            element={
                                <ProtectedRoute isAdmin={true}>
                                    <NewProduct />
                                </ProtectedRoute>
                            }
                            exact
                        />
                        <Route
                           path="/orders/me"
                            element={
                           <AdminRoute>
                             <MyOrders />
                          </AdminRoute>
                                    }
                             exact
                         />
                       <Route
                         path="/admin/dashboard"
                          element={
                        <AdminRoute>
                          <Dashboard />
                        </AdminRoute>
                                  }
                         exact
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;
