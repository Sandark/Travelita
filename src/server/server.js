const express = require("express");
const app = express();

const dotenv = require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");

const queries = require("./queries");
const location = require("./location");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static("dist"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Application is running of port ${port}`);
})

app.get("/", (req, res) => {
    res.sendFile("dist/index.html");
})

app.get("/users", queries.getUsers);

app.get("/users/:id", queries.getUserById);

app.post("/users", queries.createUser);

app.put("/users/:id", queries.updateUser);

app.delete("/users/:id", queries.deleteUser);

app.get("/city", location.searchForCity);