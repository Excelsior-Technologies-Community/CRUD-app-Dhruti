import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import productRoutes from "./routes/ProductRoutes.js";
import cors from "cors";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware , Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('Server is running successfully');
})

const Port = process.env.PORT

app.listen(Port, () => {
    console.log(`Server is running successfully on port http://localhost:${Port}`);
});