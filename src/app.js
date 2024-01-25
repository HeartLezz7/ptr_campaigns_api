const express = require("express");
const app = express();
const cors = require("cors");
const { getProducts } = require("./controllers/products_controllers");
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/product", getProducts);

app.listen(port, () => console.log("This server run on port: ", port));
