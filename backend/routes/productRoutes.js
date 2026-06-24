import express from "express";
import { upload } from "../controller/upload.js";

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

export default router;