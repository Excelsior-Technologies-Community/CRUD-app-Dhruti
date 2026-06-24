import dotenv from "dotenv"
import express from "express"
import connectDB from "./config/db.js";
import productRoutes from "./routes/ProductRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import cors from "cors";
import path from "path";

dotenv.config();

// Connect Database
connectDB();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const app = express();

// Middleware , Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// multer
app.use("/uploads", express.static("uploads"));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running successfully');
})

const Port = process.env.PORT

app.listen(Port, () => {
    console.log(`Server is running successfully on port http://localhost:${Port}`);
});