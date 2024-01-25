const { readFile } = require("../campaigns/handleFile");

exports.getProducts = async (req, res) => {
  try {
    const products = await readFile("products.json");
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};
