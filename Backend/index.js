const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const connectDB = require("./config/db");

env.config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:5173", // for local development
    "http://localhost:3000", // for local development
    "https://sica-chat.netlify.app/", // your deployed frontend,
    "https://sica-chat.netlify.app"
  ],
  credentials: true, // if you need to send cookies or auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
