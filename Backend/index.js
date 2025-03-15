const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const connectDB = require("./config/db");

env.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Use Routes
app.use("/", authRoutes);
app.use("/", chatRoutes);
app.use("/", aiRoutes);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
