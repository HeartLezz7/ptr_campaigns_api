const { readFile, writeFile } = require("./handleFile");

const discount = async () => {
  try {
    let products = await readFile("products.json");
    console.log(products);
  } catch (error) {
    console.log(error);
  }
};

discount();
