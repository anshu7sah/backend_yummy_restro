const express = require("express");
const morgan = require("morgan");
const { mongoConnect } = require("./services/mongo");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();
const categoriesRoutes = require("./routes/categoryRouter");
const dishRoutes = require("./routes/dishRouter");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const PREFIX = "/" + process.env.PREFIX;

app.use(PREFIX, categoriesRoutes);
app.use(PREFIX, dishRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoConnect(DATABASE);
});

app.use((req, res, next) => {
  console.log("Anshu");
  next(createError.NotFound());
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});
