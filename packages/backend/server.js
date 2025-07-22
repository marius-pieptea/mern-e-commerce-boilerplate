const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const setupSwagger = require("./swagger");
const setupInMemoryDB = require("./setupInMemoryDb"); // Adjust the path as necessary

dotenv.config();

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    `http://localhost:${process.env.PORT}`,
    `http://localhost:5006`, // Additional fallback for swagger setup
  ],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

setupSwagger(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

const connectDB = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      console.log("Connecting to MongoDB Atlas");
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Atlas connected successfully");
      break;
    } catch (error) {
      console.error("Failed to connect to MongoDB Atlas", error);
      retries -= 1;
      if (retries === 0) {
        console.error("Exhausted all retries. Exiting...");
        process.exit(1);
      }
      console.log(`Retries left: ${retries}`);
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

connectDB();

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
