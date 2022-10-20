const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/userRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");

const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//middleWares
app.use(cors());
app.use(express.json());

// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/contacts", contactRoutes);

app.use(
  "/avatars",
  express.static(path.join(__dirname, "public/uploads/avatars"))
);
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello EveryOne!");
});

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
