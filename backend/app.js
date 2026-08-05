const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");


// Middleware
app.use(express.json());





app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(morgan("dev"));
}

// Routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const orders = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", orders);

// Serve React build in production
if (process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("JVLCart API is running...");
    });
}

module.exports = app;
