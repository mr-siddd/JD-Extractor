import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jdRoutes from "./src/routes/jdRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Job JD Extractor API is running!" });
});

app.use(jdRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
