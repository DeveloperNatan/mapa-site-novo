const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");

app.use(cors());
app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user routes
app.use("/", require("./routes"));

//servir
app.use(express.static(path.join(__dirname, "../../frontend/src/html/")));
app.use(express.static(path.join(__dirname, "../../frontend/src")));

// start server
app.listen(9000);
