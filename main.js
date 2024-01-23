const fs = require("fs/promises");

const read = async () => {
  const res = await fs.readFile("products.json", "utf-8");
  const arr = JSON.parse(res);
  arr[0].price = 500;
  console.log(arr);
  const str = JSON.stringify(arr);
  await fs.writeFile("products.json", str);
};

read();
