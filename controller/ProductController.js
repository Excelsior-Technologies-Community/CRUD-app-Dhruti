import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true,
                runValidators: true,
             }
        );

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product Deleted",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};