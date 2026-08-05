const express = require("express");
const router = express.Router();

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const upload = require("../utils/multer");

router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);

router
    .route("/admin/product/new")
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images", 5),
        newProduct
    );

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
