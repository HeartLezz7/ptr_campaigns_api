const express = require("express");
const app = express();
const cors = require("cors");
const {
  getProducts,
  summaryDiscount,
} = require("./controllers/products_controllers");
const { getUser } = require("./controllers/user_controller");
const notFoundMiddleware = require("./middlewares/not_found");
const errorMiddleware = require("./middlewares/error");

const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/user", getUser);
app.get("/product", getProducts);
app.post("/discount", summaryDiscount);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => console.log("This server run on port: ", port));
