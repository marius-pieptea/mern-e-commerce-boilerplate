const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const productController = require("../controllers/productController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           example: "Lenovo 15.6 Inch Full HD Notebook"
 *         price:
 *           type: number
 *           example: 10.99
 *         category:
 *           type: string
 *           example: "Laptops"
 *         description:
 *           type: string
 *           example: "Intel Quad N5100 4 x 2.80 GHz, 16GB DDR4, 1000 GB SSD, Intel UHD, HDMI, Webcam, Bluetooth, USB 3.0, WiFi, Windows 11 Prof. 64 Bit"
 *         image:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         stock:
 *           type: number
 *           example: 100
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ObjectId reference to User
 *                 example: "507f1f77bcf86cd799439011"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great product!"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Fetch all products with optional filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the product
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price of the product
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price of the product
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for the product name
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", productController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, admin, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Fetch a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in:
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", auth, admin, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", auth, admin, productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Add a review to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/:id/reviews", auth, productController.addReview);

module.exports = router;
