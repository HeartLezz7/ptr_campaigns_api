const fs = require("fs/promises");

exports.readFile = async (path) => {
  try {
    const result = await fs.readFile(path, "utf-8");
    const products = JSON.parse(result);
    return products;
  } catch (error) {
    console.log(error);
  }
};

exports.writeFile = async (path, data) => {
  const newData = JSON.stringify(data);
  await fs.writeFile(path, newData);
};
