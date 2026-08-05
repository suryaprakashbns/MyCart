const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
const bufferToDataUri = require("../utils/dataUri");

// Create new product => /api/v1/admin/product/new
exports.newProduct = async (req, res, next) => {
    try {
        console.log("\n========== CREATE PRODUCT ==========");

        console.log("1. USER:");
        console.log(req.user);

        console.log("2. BODY:");
        console.log(req.body);

        console.log("3. FILES:");
        console.log(req.files);

        req.body.user = req.user.id;

        let images = [];

        if (req.files && req.files.length > 0) {
            console.log("4. Number of files:", req.files.length);

            for (const file of req.files) {
                console.log("5. Processing file:", file.originalname);

                const fileUri = bufferToDataUri(file);

                console.log("6. Data URI created");

                console.log("7. Starting Cloudinary upload...");

                const result = await cloudinary.uploader.upload(
                    fileUri.content,
                    {
                        folder: "MyCart/products",
                    }
                );

                console.log("8. CLOUDINARY SUCCESS:");
                console.log(result.secure_url);

                images.push({
                    image: result.secure_url,
                });
            }
        }

        req.body.images = images;

        console.log("9. FINAL BODY:");
        console.log(req.body);

        console.log("10. Creating MongoDB document...");

        const product = await Product.create(req.body);

        console.log("11. PRODUCT CREATED:");
        console.log(product);

        res.status(201).json({
            success: true,
            product,
        });

    } catch (error) {
        console.log("\n========== ERROR ==========");

        console.log("RAW ERROR:");
        console.log(error);

        console.log("ERROR TYPE:");
        console.log(typeof error);

        console.log("ERROR MESSAGE:");
        console.log(error?.message);

        console.log("===========================\n");

        res.status(500).json({
            success: false,
            message:
                error?.message ||
                JSON.stringify(error) ||
                String(error),
        });
    }
};

// Get all products => /api/v1/products
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get single product details => /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update product => /api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete product => /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
