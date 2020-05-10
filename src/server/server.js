const express = require("express");
const app = express();

const dotenv = require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");

const queries = require("./queries");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Application is running of port ${port}`);
})

app.get("/", (req, res) => {
    res.json({info: 'Node.js, Express, and Postgres API'})
})

app.get("/users", queries.getUsers);

app.get("/users/:id", queries.getUserById);

app.post("/users", queries.createUser);

app.put("/users/:id", queries.updateUser);

app.delete("/users/:id", queries.deleteUser);