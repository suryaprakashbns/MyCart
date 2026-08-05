const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const app = require("./app");
const connectDatabase = require("./config/database");


// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
});

// Load env vars


// Load cloudinary config
require("./config/cloudinary");

// Connect to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
